export interface Associado {
  id: number;
  matricula: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  rg: string;
  data_nascimento: string;
  tipo_sanguineo: string;
  data_filiacao: string;
  categoria: string;
  status: 'Ativo' | 'Pendente' | 'Inativo';
  validade_carteirinha: string;
  cidade: string;
  estado: string;
  identidade_surda: string;
  foto_url: string;
}

export interface Carteirinha {
  id: number;
  associado_id: number;
  codigo_autenticacao: string;
  data_emissao: string;
  data_validade: string;
  via: number;
  ativa: boolean;
}

export interface Mensalidade {
  id: number;
  associado_id: number;
  mes_referencia: number;
  ano_referencia: number;
  valor: number;
  data_pagamento?: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  metodo: string;
  comprovante_url?: string;
  observacoes?: string;
}

export interface MembroDiretoria {
  id: number;
  ordem: number;
  cargo: string;
  nome: string;
  gestao: string;
  email: string;
  telefone: string;
  bio: string;
  foto_url: string;
}

export interface ModalidadeEsportiva {
  id: number;
  nome: string;
  categoria: string;
  icone: string;
  dias_treino: string;
  local_treino: string;
  responsavel: string;
  descricao: string;
  ativa: boolean;
}

export interface Evento {
  id: number;
  titulo: string;
  tipo: string;
  data_inicio: string;
  data_fim?: string;
  local: string;
  descricao: string;
  libras_disponivel: boolean;
  imagem_url: string;
  destaque: boolean;
  ativo: boolean;
}

export interface ArtigoEstatuto {
  id: number;
  capitulo_id: number;
  numero: number;
  texto: string;
  paragrafo_unico?: string;
}

export interface CapituloEstatuto {
  id: number;
  numero: number;
  titulo: string;
  ordem: number;
  artigos: ArtigoEstatuto[];
}

export interface Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  imagem: string;
  data: string;
  destaque: boolean;
}

export interface MomentoAssga {
  id: number;
  titulo: string;
  subtitulo: string;
  imagem: string;
  badge: string;
  ordem: number;
}

export interface ContatoMensagem {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  criado_em: string;
}

export interface VoluntarioCadastro {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  idade: string;
  mensagem: string;
  criado_em: string;
}

export interface ParceiroApoiador {
  id: number;
  nome: string;
  link: string;
  imagem: string;
  ordem: number;
}

export const assgaConfig = {
  nome_associacao: 'ASSGA - Associação dos Surdos de São Gonçalo do Amarante',
  sigla: 'ASSGA',
  cnpj: '57.242.499/0001-60',
  email: 'assgar2019@gmail.com',
  telefone: '(84) 99698-1248',
  whatsapp: '5584996981248',
  chave_pix: 'Polyanabritoflamengobeatriz@gmail.com',
  endereco: 'São Gonçalo do Amarante - RN',
  instagram: 'https://www.instagram.com/assga_2019/',
  youtube: 'https://www.youtube.com/@ASSGAESPORTES',
};

export const associados: Associado[] = [];

export const carteirinhas: Carteirinha[] = [];

export const mensalidades: Mensalidade[] = [];

export const membrosDiretoria: MembroDiretoria[] = [];

export const modalidades: ModalidadeEsportiva[] = [];

export const eventos: Evento[] = [];

export const capitulosEstatuto: CapituloEstatuto[] = [];

export const contatos: ContatoMensagem[] = [];

export const voluntarios: VoluntarioCadastro[] = [];

export const parceirosApoiadores: ParceiroApoiador[] = [];

export const momentosAssga: MomentoAssga[] = [];

export const noticias: Noticia[] = [];
