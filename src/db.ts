import { Pool } from 'pg';
import {
  Associado,
  Noticia,
  apiData,
  associados,
  carteirinhas,
  capitulosEstatuto,
  contatos,
  eventos,
  membrosDiretoria,
  mensalidades,
  modalidades,
  momentosAssga,
  noticias,
  parceirosApoiadores,
  voluntarios,
} from './data.js';

const connectionString = process.env.DATABASE_URL;
export const databaseEnabled = Boolean(connectionString);
let postgresHealthy = Boolean(connectionString);

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
      max: 5,
    })
  : null;

const portalCollections: Record<string, unknown[]> = {
  carteirinhas,
  mensalidades,
  membrosDiretoria,
  modalidades,
  eventos,
  capitulosEstatuto,
  momentosAssga,
  contatos,
  voluntarios,
  parceirosApoiadores,
};

function writablePool(): Pool | null {
  if (!pool) {
    if (process.env.VERCEL || process.env.NETLIFY) {
      throw new Error('DATABASE_URL é obrigatória para persistir dados em produção.');
    }
    return null;
  }

  if (!postgresHealthy) {
    throw new Error('PostgreSQL indisponível; os dados não foram salvos.');
  }

  return pool;
}

function currentPortalState(): Record<string, unknown> {
  return {
    ...Object.fromEntries(Object.entries(portalCollections)),
    apiData: Object.fromEntries(apiData),
  };
}

function reportDatabaseFailure(error: unknown): void {
  postgresHealthy = false;
  console.warn('PostgreSQL indisponível; mantendo o armazenamento local como fallback:', error);
}

function toAssociado(row: Record<string, unknown>): Associado {
  return {
    id: Number(row.id),
    matricula: String(row.matricula),
    nome: String(row.nome),
    email: String(row.email),
    telefone: String(row.telefone),
    cpf: String(row.cpf),
    rg: String(row.rg),
    data_nascimento: String(row.data_nascimento),
    tipo_sanguineo: String(row.tipo_sanguineo),
    data_filiacao: String(row.data_filiacao),
    categoria: String(row.categoria),
    status: row.status as Associado['status'],
    validade_carteirinha: String(row.validade_carteirinha),
    cidade: String(row.cidade),
    estado: String(row.estado),
    identidade_surda: String(row.identidade_surda),
    foto_url: String(row.foto_url),
    exibir_no_site: Boolean(row.exibir_no_site),
  };
}

function toNoticia(row: Record<string, unknown>): Noticia {
  return {
    id: Number(row.id),
    titulo: String(row.titulo),
    conteudo: String(row.conteudo),
    imagem: String(row.imagem),
    data: String(row.data),
    destaque: Boolean(row.destaque),
  };
}

export async function initializePostgresData(): Promise<void> {
  if (!pool) return;

  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS associados (
      id BIGINT PRIMARY KEY,
      matricula TEXT NOT NULL UNIQUE,
      nome TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      telefone TEXT NOT NULL DEFAULT '',
      cpf TEXT NOT NULL DEFAULT '',
      rg TEXT NOT NULL DEFAULT '',
      data_nascimento TEXT NOT NULL DEFAULT '',
      tipo_sanguineo TEXT NOT NULL DEFAULT '',
      data_filiacao TEXT NOT NULL DEFAULT '',
      categoria TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Ativo',
      validade_carteirinha TEXT NOT NULL DEFAULT '',
      cidade TEXT NOT NULL DEFAULT '',
      estado TEXT NOT NULL DEFAULT 'RN',
      identidade_surda TEXT NOT NULL DEFAULT '',
      foto_url TEXT NOT NULL DEFAULT '',
      exibir_no_site BOOLEAN NOT NULL DEFAULT FALSE
    )
    `);
    await pool.query('ALTER TABLE associados ADD COLUMN IF NOT EXISTS exibir_no_site BOOLEAN NOT NULL DEFAULT FALSE');
    await pool.query(`
    CREATE TABLE IF NOT EXISTS noticias (
      id BIGINT PRIMARY KEY,
      titulo TEXT NOT NULL,
      conteudo TEXT NOT NULL,
      imagem TEXT NOT NULL DEFAULT '',
      data TEXT NOT NULL DEFAULT '',
      destaque BOOLEAN NOT NULL DEFAULT TRUE
    )
    `);
    await pool.query(`
    CREATE TABLE IF NOT EXISTS portal_state (
      id SMALLINT PRIMARY KEY CHECK (id = 1),
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
    `);
    await pool.query(`
    CREATE TABLE IF NOT EXISTS api_data_collections (
      collection TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
    `);

    const associadosCount = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM associados');
    if (Number(associadosCount.rows[0].count) === 0 && associados.length > 0) {
      for (const associado of associados) await saveAssociado(associado);
    }

    const noticiasCount = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM noticias');
    if (Number(noticiasCount.rows[0].count) === 0 && noticias.length > 0) {
      for (const noticia of noticias) await saveNoticia(noticia);
    }

    await pool.query(
      `INSERT INTO portal_state (id, payload) VALUES (1, $1::jsonb) ON CONFLICT (id) DO NOTHING`,
      [JSON.stringify(currentPortalState())],
    );

    await refreshPostgresData();
  } catch (error) {
    reportDatabaseFailure(error);
  }
}

export async function refreshPostgresData(): Promise<void> {
  if (!pool || !postgresHealthy) return;

  try {
    const associadosRows = await pool.query('SELECT * FROM associados ORDER BY id DESC');
    associados.splice(0, associados.length, ...associadosRows.rows.map(toAssociado));

    const noticiasRows = await pool.query('SELECT * FROM noticias ORDER BY id DESC');
    noticias.splice(0, noticias.length, ...noticiasRows.rows.map(toNoticia));

    const portalState = await pool.query<{ payload: Record<string, unknown> }>(
      'SELECT payload FROM portal_state WHERE id = 1',
    );
    const savedCollections = portalState.rows[0]?.payload;
    if (savedCollections) {
      for (const [collection, values] of Object.entries(portalCollections)) {
        const savedValues = savedCollections[collection];
        if (Array.isArray(savedValues)) {
          values.splice(0, values.length, ...savedValues);
        }
      }

      const savedApiData = savedCollections.apiData;
      if (savedApiData && typeof savedApiData === 'object' && !Array.isArray(savedApiData)) {
        apiData.clear();
        for (const [collection, value] of Object.entries(savedApiData)) {
          apiData.set(collection, value);
        }
      }
    }
  } catch (error) {
    reportDatabaseFailure(error);
  }
}

export async function savePortalState(): Promise<void> {
  const database = writablePool();
  if (!database) return;

  try {
    await database.query(
      `INSERT INTO portal_state (id, payload, updated_at)
       VALUES (1, $1::jsonb, NOW())
       ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
      [JSON.stringify(currentPortalState())],
    );
  } catch (error) {
    reportDatabaseFailure(error);
    throw error;
  }
}

export async function clearPostgresData(): Promise<void> {
  const database = writablePool();
  if (!database) return;

  await database.query('DELETE FROM associados');
  await database.query('DELETE FROM noticias');
  await database.query('DELETE FROM api_data_collections');
  await savePortalState();
}

export async function saveAssociado(associado: Associado): Promise<boolean> {
  if (!pool) return !process.env.VERCEL && !process.env.NETLIFY;
  if (!postgresHealthy) return false;
  try {
    await pool.query(
    `INSERT INTO associados (
      id, matricula, nome, email, telefone, cpf, rg, data_nascimento,
      tipo_sanguineo, data_filiacao, categoria, status, validade_carteirinha,
      cidade, estado, identidade_surda, foto_url, exibir_no_site
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    ON CONFLICT (id) DO UPDATE SET
      matricula = EXCLUDED.matricula, nome = EXCLUDED.nome, email = EXCLUDED.email,
      telefone = EXCLUDED.telefone, cpf = EXCLUDED.cpf, rg = EXCLUDED.rg,
      data_nascimento = EXCLUDED.data_nascimento, tipo_sanguineo = EXCLUDED.tipo_sanguineo,
      data_filiacao = EXCLUDED.data_filiacao, categoria = EXCLUDED.categoria,
      status = EXCLUDED.status, validade_carteirinha = EXCLUDED.validade_carteirinha,
      cidade = EXCLUDED.cidade, estado = EXCLUDED.estado,
      identidade_surda = EXCLUDED.identidade_surda, foto_url = EXCLUDED.foto_url,
      exibir_no_site = EXCLUDED.exibir_no_site`,
    [
      associado.id, associado.matricula, associado.nome, associado.email, associado.telefone,
      associado.cpf, associado.rg, associado.data_nascimento, associado.tipo_sanguineo,
      associado.data_filiacao, associado.categoria, associado.status, associado.validade_carteirinha,
      associado.cidade, associado.estado, associado.identidade_surda, associado.foto_url,
      Boolean(associado.exibir_no_site),
    ],
    );
    return true;
  } catch (error) {
    reportDatabaseFailure(error);
    return false;
  }
}

export async function deleteAssociado(id: number): Promise<boolean> {
  if (!pool) return !process.env.VERCEL && !process.env.NETLIFY;
  if (!postgresHealthy) return false;
  try {
    await pool.query('DELETE FROM associados WHERE id = $1', [id]);
    return true;
  } catch (error) {
    reportDatabaseFailure(error);
    return false;
  }
}

export async function saveNoticia(noticia: Noticia): Promise<boolean> {
  if (!pool) return !process.env.VERCEL && !process.env.NETLIFY;
  if (!postgresHealthy) return false;
  try {
    await pool.query(
    `INSERT INTO noticias (id, titulo, conteudo, imagem, data, destaque)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (id) DO UPDATE SET
       titulo = EXCLUDED.titulo, conteudo = EXCLUDED.conteudo,
       imagem = EXCLUDED.imagem, data = EXCLUDED.data, destaque = EXCLUDED.destaque`,
    [noticia.id, noticia.titulo, noticia.conteudo, noticia.imagem, noticia.data, noticia.destaque],
    );
    return true;
  } catch (error) {
    reportDatabaseFailure(error);
    return false;
  }
}

export async function deleteNoticia(id: number): Promise<boolean> {
  if (!pool) return !process.env.VERCEL && !process.env.NETLIFY;
  if (!postgresHealthy) return false;
  try {
    await pool.query('DELETE FROM noticias WHERE id = $1', [id]);
    return true;
  } catch (error) {
    reportDatabaseFailure(error);
    return false;
  }
}
