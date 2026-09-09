import express, { Request, Response } from 'express';
import path from 'path';
import cookieSession from 'cookie-session';
import { GoogleGenAI } from '@google/genai';
import {
  assgaConfig,
  associados,
  carteirinhas,
  mensalidades,
  membrosDiretoria,
  modalidades,
  eventos,
  capitulosEstatuto,
  noticias,
  Associado,
  Mensalidade
} from './src/data.js';

const app = express();
const PORT = 3000;

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session handling
app.use(
  cookieSession({
    name: 'assga_session',
    keys: [process.env.SESSION_SECRET || 'assga-potiguar-secret-key-2026'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// EJS View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Static files
const publicDir = path.join(process.cwd(), 'public');
app.use(express.static(publicDir));
app.use('/static', express.static(publicDir));
app.use('/static/imagens', express.static(path.join(publicDir, 'imagens')));
app.use('/imagens', express.static(path.join(publicDir, 'imagens')));
app.use('/src/imagens', express.static(path.join(publicDir, 'imagens')));

// Global template context middleware
app.use((req: Request, res: Response, next) => {
  const userId = req.session?.userId;
  const loggedUser = userId ? associados.find(a => a.id === userId) || null : null;
  res.locals.user = loggedUser;
  res.locals.config = assgaConfig;
  res.locals.messages = req.session?.messages || [];
  req.session!.messages = [];
  res.locals.hostUrl = `${req.protocol}://${req.get('host')}`;
  next();
});

// Helper flash messages
function addFlash(req: Request, text: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') {
  if (!req.session!.messages) req.session!.messages = [];
  req.session!.messages.push({ text, type });
}

// Routes
// 1. Home
app.get('/', (req: Request, res: Response) => {
  res.render('portal/home', {
    title: 'Início - ASSGA Associação dos Surdos',
    activePage: 'home',
    noticias,
  });
});

// 2. História
app.get('/historia', (req: Request, res: Response) => {
  res.render('portal/historia', {
    title: 'Nossa História - ASSGA',
    activePage: 'historia',
  });
});

// 3. Estatuto
app.get('/estatuto', (req: Request, res: Response) => {
  const busca = (req.query.q as string || '').trim().toLowerCase();
  let artigosFiltrados: { numero: number; texto: string; paragrafo_unico?: string }[] = [];

  if (busca) {
    for (const cap of capitulosEstatuto) {
      for (const art of cap.artigos) {
        if (
          art.texto.toLowerCase().includes(busca) ||
          (art.paragrafo_unico && art.paragrafo_unico.toLowerCase().includes(busca)) ||
          art.numero.toString() === busca
        ) {
          artigosFiltrados.push(art);
        }
      }
    }
  }

  res.render('portal/estatuto', {
    title: 'Estatuto Social - ASSGA',
    activePage: 'estatuto',
    capitulos: capitulosEstatuto,
    busca,
    artigosFiltrados,
  });
});

// 4. Diretoria
app.get('/diretoria', (req: Request, res: Response) => {
  res.render('portal/diretoria', {
    title: 'Diretoria Executiva - ASSGA',
    activePage: 'diretoria',
    membros: membrosDiretoria,
  });
});

// 5. Modalidades Esportivas
app.get('/esportiva', (req: Request, res: Response) => {
  res.render('portal/esportiva', {
    title: 'Departamento Esportivo - ASSGA',
    activePage: 'esportiva',
    modalidades,
  });
});

// 6. Eventos
app.get('/eventos', (req: Request, res: Response) => {
  res.render('portal/evento', {
    title: 'Agenda de Eventos - ASSGA',
    activePage: 'evento',
    eventos,
  });
});

// 7. Carteirinha
const handleCarteirinha = (req: Request, res: Response) => {
  const reqMatricula = req.params.matricula;
  let targetAssociado: Associado | undefined;

  if (reqMatricula) {
    targetAssociado = associados.find(a => a.matricula.toLowerCase() === reqMatricula.toLowerCase());
  } else if (res.locals.user) {
    targetAssociado = res.locals.user;
  } else {
    // Default demo view for visitors
    targetAssociado = associados[0];
  }

  if (!targetAssociado) {
    addFlash(req, 'Associado não encontrado para esta carteirinha.', 'danger');
    return res.redirect('/');
  }

  const carteirinha = carteirinhas.find(c => c.associado_id === targetAssociado!.id) || {
    id: 999,
    associado_id: targetAssociado.id,
    codigo_autenticacao: `ASSGA-${targetAssociado.matricula}-VAL-2026`,
    data_emissao: '2024-01-01',
    data_validade: targetAssociado.validade_carteirinha,
    via: 1,
    ativa: targetAssociado.status === 'Ativo',
  };

  res.render('portal/carteirinha', {
    title: 'Carteirinha Oficial do Associado - ASSGA',
    activePage: 'carteirinha',
    associado: targetAssociado,
    carteirinha,
  });
};

app.get('/carteirinha', handleCarteirinha);
app.get('/carteirinha/:matricula', handleCarteirinha);

// 8. Pagamento / PIX
app.get('/pagamento', (req: Request, res: Response) => {
  res.render('portal/pagamento', {
    title: 'Mensalidades e Contribuição PIX - ASSGA',
    activePage: 'pagamento',
  });
});

app.post('/pagamento', (req: Request, res: Response) => {
  const { identificador, mes_referencia, observacoes } = req.body;
  
  // Find associado if matches matricula or cpf
  const cleanId = String(identificador || '').trim().toLowerCase();
  const foundAssoc = associados.find(
    a => a.matricula.toLowerCase() === cleanId || a.cpf.replace(/\D/g, '') === cleanId.replace(/\D/g, '') || a.nome.toLowerCase().includes(cleanId)
  );

  if (foundAssoc) {
    mensalidades.unshift({
      id: Date.now(),
      associado_id: foundAssoc.id,
      mes_referencia: Number(mes_referencia) || 9,
      ano_referencia: 2026,
      valor: 25.00,
      data_pagamento: new Date().toISOString().split('T')[0],
      status: 'Pago',
      metodo: 'PIX',
      observacoes: observacoes ? String(observacoes) : undefined,
    });
    addFlash(req, `Comprovante registrado com sucesso para ${foundAssoc.nome}! Mensalidade confirmada.`, 'success');
    if (res.locals.user) {
      return res.redirect('/area-associado');
    }
  } else {
    addFlash(req, 'Comprovante recebido pela tesouraria da ASSGA para conferência manual.', 'success');
  }

  res.redirect('/pagamento');
});

// 9. Login
app.get('/login', (req: Request, res: Response) => {
  if (res.locals.user) {
    return res.redirect('/area-associado');
  }
  res.render('portal/login', {
    title: 'Área do Associado - Login - ASSGA',
    activePage: 'login',
    error: null,
  });
});

app.post('/login', (req: Request, res: Response) => {
  const idRaw = String(req.body.identificador || '').trim();
  const idClean = idRaw.toLowerCase();
  const idDigits = idRaw.replace(/\D/g, '');

  const user = associados.find(
    a =>
      a.matricula.toLowerCase() === idClean ||
      a.cpf.toLowerCase() === idClean ||
      (idDigits.length >= 7 && a.cpf.replace(/\D/g, '') === idDigits)
  );

  if (user) {
    req.session!.userId = user.id;
    addFlash(req, `Bem-vindo(a), ${user.nome}!`, 'success');
    return res.redirect('/area-associado');
  }

  res.render('portal/login', {
    title: 'Área do Associado - Login - ASSGA',
    activePage: 'login',
    error: 'Matrícula ou CPF não localizado em nosso cadastro. Verifique e tente novamente.',
  });
});

// 10. Logout
app.get('/logout', (req: Request, res: Response) => {
  req.session = null;
  res.redirect('/');
});

// 11. Área do Associado
app.get('/area-associado', (req: Request, res: Response) => {
  if (!res.locals.user) {
    addFlash(req, 'Por favor, informe sua matrícula ou CPF para acessar o painel.', 'warning');
    return res.redirect('/login');
  }

  const userMensalidades = mensalidades.filter(m => m.associado_id === res.locals.user.id);

  res.render('portal/area_associado', {
    title: `Meu Painel - ${res.locals.user.nome} - ASSGA`,
    activePage: 'area_associado',
    associado: res.locals.user,
    mensalidades: userMensalidades,
  });
});

// 12. Validação eletrônica de carteirinha via QR Code
app.get('/validar/:codigo', (req: Request, res: Response) => {
  const codigo = req.params.codigo;
  const cart = carteirinhas.find(c => c.codigo_autenticacao.toLowerCase() === codigo.toLowerCase());

  let targetAssociado: Associado | null = null;
  let valida = false;

  if (cart) {
    targetAssociado = associados.find(a => a.id === cart.associado_id) || null;
    valida = cart.ativa && targetAssociado?.status === 'Ativo';
  }

  if (!cart || !targetAssociado) {
    return res.render('portal/validar', {
      title: 'Validação de Carteirinha - ASSGA',
      activePage: 'validar',
      valida: false,
      associado: {
        nome: 'Registro Não Encontrado',
        matricula: 'N/A',
        categoria: 'N/A',
        status: 'Inexistente',
      },
      carteirinha: {
        codigo_autenticacao: codigo,
        data_validade: '2026-12-31',
      },
    });
  }

  res.render('portal/validar', {
    title: 'Validação Eletrônica de Carteirinha - ASSGA',
    activePage: 'validar',
    valida,
    associado: targetAssociado,
    carteirinha: cart,
  });
});

// ==========================================
// PAINEL ADMINISTRATIVO (ADMIN ROUTES)
// ==========================================

// Helper para mapa de associados
const getAssociadosMap = () => Object.fromEntries(associados.map(a => [a.id, a]));

// 1. Dashboard Admin
app.get('/admin', (req: Request, res: Response) => {
  const sociosAtivos = associados.filter(a => a.status === 'Ativo').length;
  const sociosPendentes = associados.filter(a => a.status === 'Pendente').length;
  const carteirinhasAtivas = carteirinhas.filter(c => c.ativa).length;
  const mensalidadesPagas = mensalidades.filter(m => m.status === 'Pago').length;
  const mensalidadesPendentes = mensalidades.filter(m => m.status !== 'Pago').length;
  const totalArrecadado = mensalidades
    .filter(m => m.status === 'Pago')
    .reduce((acc, m) => acc + m.valor, 0);

  res.render('admin/dashboard', {
    title: 'Painel Geral - Administração ASSGA',
    activePage: 'admin',
    activeAdminTab: 'dashboard',
    totalAssociados: associados.length,
    totalMensalidades: mensalidades.length,
    totalCarteirinhas: carteirinhas.length,
    totalEventos: eventos.length,
    stats: {
      totalSocios: associados.length,
      sociosAtivos,
      sociosPendentes,
      carteirinhasAtivas,
      mensalidadesPagas,
      mensalidadesPendentes,
      totalArrecadado,
      totalEventos: eventos.length,
    },
    ultimosAssociados: associados.slice(0, 6),
    ultimasMensalidades: mensalidades.slice(0, 6),
    associadosMap: getAssociadosMap(),
  });
});

// 2. Lista de Associados
app.get('/admin/associados', (req: Request, res: Response) => {
  const busca = (req.query.busca as string || '').trim().toLowerCase();
  const statusFiltro = (req.query.status as string || '').trim();
  const categoriaFiltro = (req.query.categoria as string || '').trim();

  let lista = [...associados];

  if (busca) {
    lista = lista.filter(
      a =>
        a.nome.toLowerCase().includes(busca) ||
        a.matricula.toLowerCase().includes(busca) ||
        a.cpf.replace(/\D/g, '').includes(busca.replace(/\D/g, '')) ||
        a.cidade.toLowerCase().includes(busca)
    );
  }

  if (statusFiltro) {
    lista = lista.filter(a => a.status === statusFiltro);
  }

  if (categoriaFiltro) {
    lista = lista.filter(a => a.categoria === categoriaFiltro);
  }

  res.render('admin/associados', {
    title: 'Lista de Associados - Gestão ASSGA',
    activePage: 'admin_associados',
    activeAdminTab: 'associados',
    totalAssociados: associados.length,
    totalMensalidades: mensalidades.length,
    totalCarteirinhas: carteirinhas.length,
    totalEventos: eventos.length,
    associados: lista,
    busca,
    statusFiltro,
    categoriaFiltro,
  });
});

// Novo Associado
app.post('/admin/associados/novo', (req: Request, res: Response) => {
  const {
    nome,
    categoria,
    cpf,
    rg,
    data_nascimento,
    email,
    telefone,
    identidade_surda,
    tipo_sanguineo,
    validade_carteirinha,
    cidade,
    foto_url,
  } = req.body;

  const novoId = Date.now();
  const matriculaSeq = String(associados.length + 1).padStart(3, '0');
  const novaMatricula = `ASG-2026-${matriculaSeq}`;

  const novoAssociado: Associado = {
    id: novoId,
    matricula: novaMatricula,
    nome: String(nome || 'Novo Associado').trim(),
    categoria: String(categoria || 'Sócio Atleta'),
    cpf: String(cpf || '').trim(),
    rg: String(rg || '').trim(),
    data_nascimento: String(data_nascimento || '2000-01-01'),
    email: String(email || '').trim(),
    telefone: String(telefone || '').trim(),
    identidade_surda: String(identidade_surda || 'Surdo(a)'),
    tipo_sanguineo: String(tipo_sanguineo || 'O+'),
    data_filiacao: new Date().toISOString().split('T')[0],
    status: 'Ativo',
    validade_carteirinha: String(validade_carteirinha || '2026-12-31'),
    cidade: String(cidade || 'São Gonçalo do Amarante'),
    estado: 'RN',
    foto_url: String(foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'),
  };

  associados.unshift(novoAssociado);

  // Gera carteirinha oficial vinculada
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const codigoAutenticacao = `ASSGA-2026-${matriculaSeq}-AUTH-${randomHex}`;

  carteirinhas.unshift({
    id: novoId,
    associado_id: novoId,
    codigo_autenticacao: codigoAutenticacao,
    data_emissao: new Date().toISOString().split('T')[0],
    data_validade: novoAssociado.validade_carteirinha,
    via: 1,
    ativa: true,
  });

  addFlash(req, `Associado ${novoAssociado.nome} (${novaMatricula}) cadastrado com sucesso! Carteirinha digital gerada.`, 'success');
  res.redirect('/admin/associados');
});

// Editar Associado
app.post('/admin/associados/:id/editar', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const assoc = associados.find(a => a.id === id);

  if (assoc) {
    assoc.nome = req.body.nome || assoc.nome;
    assoc.cpf = req.body.cpf || assoc.cpf;
    assoc.rg = req.body.rg || assoc.rg;
    assoc.data_nascimento = req.body.data_nascimento || assoc.data_nascimento;
    assoc.email = req.body.email || assoc.email;
    assoc.telefone = req.body.telefone || assoc.telefone;
    assoc.categoria = req.body.categoria || assoc.categoria;
    assoc.identidade_surda = req.body.identidade_surda || assoc.identidade_surda;
    assoc.validade_carteirinha = req.body.validade_carteirinha || assoc.validade_carteirinha;
    assoc.cidade = req.body.cidade || assoc.cidade;
    assoc.status = req.body.status || assoc.status;
    if (req.body.foto_url) assoc.foto_url = req.body.foto_url;

    // Atualiza validade da carteirinha também
    const cart = carteirinhas.find(c => c.associado_id === id);
    if (cart) {
      cart.data_validade = assoc.validade_carteirinha;
      cart.ativa = assoc.status === 'Ativo';
    }

    addFlash(req, `Dados de ${assoc.nome} atualizados com sucesso!`, 'success');
  } else {
    addFlash(req, 'Associado não encontrado.', 'danger');
  }

  res.redirect('/admin/associados');
});

// Alterar Status do Associado
app.post('/admin/associados/:id/status', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const assoc = associados.find(a => a.id === id);

  if (assoc) {
    assoc.status = req.body.status as 'Ativo' | 'Pendente' | 'Inativo';
    const cart = carteirinhas.find(c => c.associado_id === id);
    if (cart) cart.ativa = assoc.status === 'Ativo';

    addFlash(req, `Status de ${assoc.nome} alterado para ${assoc.status}!`, 'info');
  }

  res.redirect('/admin/associados');
});

// Excluir Associado
app.post('/admin/associados/:id/excluir', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = associados.findIndex(a => a.id === id);

  if (index !== -1) {
    const nome = associados[index].nome;
    associados.splice(index, 1);
    addFlash(req, `Associado ${nome} removido do quadro.`, 'warning');
  }

  res.redirect('/admin/associados');
});

// 3. Lista de Mensalidades
app.get('/admin/mensalidades', (req: Request, res: Response) => {
  const statusFiltro = (req.query.status as string || '').trim();
  const mesFiltro = Number(req.query.mes) || 0;
  const anoFiltro = Number(req.query.ano) || 0;

  let lista = [...mensalidades];

  if (statusFiltro) {
    lista = lista.filter(m => m.status === statusFiltro);
  }
  if (mesFiltro) {
    lista = lista.filter(m => m.mes_referencia === mesFiltro);
  }
  if (anoFiltro) {
    lista = lista.filter(m => m.ano_referencia === anoFiltro);
  }

  res.render('admin/mensalidades', {
    title: 'Controle de Mensalidades - Gestão ASSGA',
    activePage: 'admin_mensalidades',
    activeAdminTab: 'mensalidades',
    totalAssociados: associados.length,
    totalMensalidades: mensalidades.length,
    totalCarteirinhas: carteirinhas.length,
    totalEventos: eventos.length,
    mensalidades: lista,
    associados,
    associadosMap: getAssociadosMap(),
    statusFiltro,
    mesFiltro,
    anoFiltro,
  });
});

// Novo Lançamento de Mensalidade
app.post('/admin/mensalidades/novo', (req: Request, res: Response) => {
  const { associado_id, mes_referencia, ano_referencia, valor, metodo, status, observacoes } = req.body;
  const assocId = Number(associado_id);

  mensalidades.unshift({
    id: Date.now(),
    associado_id: assocId,
    mes_referencia: Number(mes_referencia) || 9,
    ano_referencia: Number(ano_referencia) || 2026,
    valor: Number(valor) || 25.00,
    metodo: String(metodo || 'PIX'),
    status: (status as 'Pago' | 'Pendente') || 'Pago',
    data_pagamento: status === 'Pago' ? new Date().toISOString().split('T')[0] : undefined,
    observacoes: observacoes ? String(observacoes) : undefined,
  });

  addFlash(req, 'Lançamento de mensalidade registrado com sucesso!', 'success');
  res.redirect('/admin/mensalidades');
});

// Alterar Status da Mensalidade
app.post('/admin/mensalidades/:id/status', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const m = mensalidades.find(item => item.id === id);

  if (m) {
    m.status = req.body.novoStatus as 'Pago' | 'Pendente' | 'Atrasado';
    if (m.status === 'Pago') {
      m.data_pagamento = new Date().toISOString().split('T')[0];
    } else {
      m.data_pagamento = undefined;
    }
    addFlash(req, `Status da mensalidade atualizado para ${m.status}!`, 'info');
  }

  res.redirect('/admin/mensalidades');
});

// 4. Lista de Carteirinhas
app.get('/admin/carteirinhas', (req: Request, res: Response) => {
  res.render('admin/carteirinhas', {
    title: 'Carteirinhas Digitais & QR - Gestão ASSGA',
    activePage: 'admin_carteirinhas',
    activeAdminTab: 'carteirinhas',
    totalAssociados: associados.length,
    totalMensalidades: mensalidades.length,
    totalCarteirinhas: carteirinhas.length,
    totalEventos: eventos.length,
    carteirinhas,
    associadosMap: getAssociadosMap(),
  });
});

// Alternar Status da Carteirinha (Ativa / Inativa)
app.post('/admin/carteirinhas/:id/toggle', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cart = carteirinhas.find(c => c.id === id);

  if (cart) {
    cart.ativa = !cart.ativa;
    addFlash(req, `Carteirinha ${cart.codigo_autenticacao} ${cart.ativa ? 'ativada' : 'suspensa'} com sucesso!`, 'info');
  }

  res.redirect('/admin/carteirinhas');
});

// Renovar Carteirinha (+1 Ano)
app.post('/admin/carteirinhas/:id/renovar', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cart = carteirinhas.find(c => c.id === id);

  if (cart) {
    const anoAtual = parseInt(cart.data_validade.split('-')[0], 10) || 2026;
    const novoAno = anoAtual + 1;
    cart.data_validade = `${novoAno}-12-31`;
    cart.ativa = true;

    const assoc = associados.find(a => a.id === cart.associado_id);
    if (assoc) {
      assoc.validade_carteirinha = cart.data_validade;
      assoc.status = 'Ativo';
    }

    addFlash(req, `Validade da carteirinha renovada com sucesso até 31/12/${novoAno}!`, 'success');
  }

  res.redirect('/admin/carteirinhas');
});

// 5. Lista de Eventos
app.get('/admin/eventos', (req: Request, res: Response) => {
  res.render('admin/eventos', {
    title: 'Gestão de Eventos - Gestão ASSGA',
    activePage: 'admin_eventos',
    activeAdminTab: 'eventos',
    totalAssociados: associados.length,
    totalMensalidades: mensalidades.length,
    totalCarteirinhas: carteirinhas.length,
    totalEventos: eventos.length,
    eventos,
  });
});

// Novo Evento
app.post('/admin/eventos/novo', (req: Request, res: Response) => {
  const { titulo, tipo, data_inicio, local, descricao, imagem_url, libras_disponivel } = req.body;

  eventos.unshift({
    id: Date.now(),
    titulo: String(titulo || 'Novo Evento ASSGA').trim(),
    tipo: String(tipo || 'Esportivo'),
    data_inicio: String(data_inicio || new Date().toISOString()),
    local: String(local || 'Sede da ASSGA').trim(),
    descricao: String(descricao || '').trim(),
    imagem_url: String(imagem_url || '/imagens/foto1.jpg'),
    libras_disponivel: libras_disponivel === 'on' || libras_disponivel === 'true',
    destaque: true,
    ativo: true,
  });

  addFlash(req, 'Novo evento cadastrado com sucesso no portal!', 'success');
  res.redirect('/admin/eventos');
});

// Excluir Evento
app.post('/admin/eventos/:id/excluir', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = eventos.findIndex(e => e.id === id);

  if (index !== -1) {
    const tit = eventos[index].titulo;
    eventos.splice(index, 1);
    addFlash(req, `Evento "${tit}" excluído com sucesso.`, 'warning');
  }

  res.redirect('/admin/eventos');
});

// API Routes
// 13. Health API
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'ASSGA - Associação dos Surdos',
    version: '2.0.0',
    timestamp: Date.now(),
  });
});

// 14. Welcome API
app.get('/api/welcome', (req: Request, res: Response) => {
  res.json({ greeting: 'Olá, ASSGA! Bem-vindo ao portal oficial.' });
});

// 15. In-memory data store replicating api/data.js
const memoryDataStore = new Map<string, any>([
  ['config', assgaConfig],
  ['noticias', noticias],
  ['eventos', eventos],
  ['diretoria', membrosDiretoria],
  ['estatuto', capitulosEstatuto],
  ['historia', {
    id: 1,
    titulo: 'Nossa História',
    subtitulo: 'Conheça a trajetória da ASSGA, desde sua fundação até os dias atuais.',
    data: 'Fundada em 2019 / Registro em 2024',
    imagem: '/imagens/Assga_foto.jpg',
    texto: 'A ASSGA - Associação dos Surdos foi fundada com o objetivo de promover o esporte, a integração social e os direitos linguísticos em LIBRAS.',
  }],
  ['slider', [
    { imagem: '/imagens/foto1.jpg', texto: 'ASSGA - Associação Desportiva' },
    { imagem: '/imagens/foto2.jpg', texto: 'Esporte e integração da ASSGA' },
    { imagem: '/imagens/foto3-1.jpg', texto: 'Futsal e atividades esportivas ASSGA' }
  ]]
]);

app.get('/api/data', (req: Request, res: Response) => {
  const collection = String(req.query?.collection || '').trim().toLowerCase();
  if (collection === 'socios' || collection === 'inscricoes') {
    return res.status(403).json({ error: 'Acesso restrito. Dados pessoais não são públicos.' });
  }
  if (!collection) {
    return res.json(Object.fromEntries(memoryDataStore));
  }
  const data = memoryDataStore.get(collection);
  if (!data) {
    return res.status(404).json({ error: 'Coleção não encontrada.' });
  }
  return res.json(data);
});

app.post('/api/data', (req: Request, res: Response) => {
  const collection = String(req.query?.collection || '').trim().toLowerCase();
  if (!collection) {
    return res.status(400).json({ error: 'Parâmetro collection é obrigatório.' });
  }
  memoryDataStore.set(collection, req.body);
  res.json({ status: 'ok', collection });
});

// 16. Assistente Virtual LIBRAS / Gemini API
app.post('/api/assistente-libras', async (req: Request, res: Response) => {
  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensagem é obrigatória.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Intelligent fallback responses about ASSGA when API key is not configured
    const lower = message.toLowerCase();
    let fallbackReply = 'Olá! Sou o Assistente da ASSGA. Posso te ajudar com informações sobre a emissão de carteirinha, treinos esportivos, estatuto e eventos da nossa associação.';

    if (lower.includes('carteirinha') || lower.includes('crachá') || lower.includes('emissão')) {
      fallbackReply = 'A carteirinha oficial da ASSGA pode ser emitida diretamente pelo portal no menu "Carteirinha" ou pelo painel do associado. Ela conta com validação eletrônica por QR Code e dados oficiais para impressão frente e verso!';
    } else if (lower.includes('treino') || lower.includes('futsal') || lower.includes('esporte') || lower.includes('horário')) {
      fallbackReply = 'Os treinos de futsal acontecem às terças e quintas-feiras às 19:30 no Ginásio Municipal de São Gonçalo do Amarante. Também temos modalidades de voleibol, atletismo e jogos de mesa!';
    } else if (lower.includes('pix') || lower.includes('mensalidade') || lower.includes('pagamento') || lower.includes('valor')) {
      fallbackReply = 'A mensalidade social é de R$ 25,00. Nossa chave oficial PIX (e-mail) é: Polyanabritoflamengobeatriz@gmail.com. Você pode enviar o comprovante diretamente pelo menu "PIX".';
    } else if (lower.includes('contato') || lower.includes('telefone') || lower.includes('whatsapp') || lower.includes('endereço')) {
      fallbackReply = 'Você pode falar com a diretoria da ASSGA pelo WhatsApp (84) 99698-1248 ou pelo e-mail assgar2019@gmail.com. Estamos em São Gonçalo do Amarante - RN!';
    }

    return res.json({ reply: fallbackReply });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction:
          'Você é o Assistente Virtual Oficial da ASSGA (Associação de Surdos de São Gonçalo do Amarante - RN). ' +
          'A ASSGA promove o desporto dos surdos (futsal, voleibol, atletismo), cultura e cidadania em LIBRAS, emissão de carteirinha com QR Code e pagamentos via PIX. ' +
          'Responda em português brasileiro de forma acolhedora, objetiva, concisa e inclusiva.',
        temperature: 0.7,
      },
    });

    return res.json({
      reply: result.text || 'Não foi possível gerar uma resposta no momento.',
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Erro no assistente',
      message: error?.message || 'Falha ao processar solicitação.',
    });
  }
});

// Start Server binding to 0.0.0.0 and port 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portal ASSGA running on http://0.0.0.0:${PORT}`);
});
