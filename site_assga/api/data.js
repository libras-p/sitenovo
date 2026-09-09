// In-memory data store replicating PostgreSQL assga_data table
const memoryStore = new Map([
  ['config', {
    id: 1,
    senha: 'ASSGA2026',
    nome_associacao: 'ASSGA - Associação Desportiva',
    endereco: 'São Gonçalo do Amarante - RN',
    email: 'assgar2019@gmail.com',
    telefone: '(84) 99698-1248',
    cnpj: '57.242.499/0001-60'
  }],
  ['noticias', [{
    id: 1,
    titulo: '2º HALLOWEEN ASSGA',
    conteudo: 'Estão abertas as inscrições para o 2º HALLOWEEN ASSGA! Prepare-se para um evento especial com muita diversão, esporte, integração e confraternização.',
    imagem: 'src/imagens/halloween-assga.jpeg',
    data: '15/08/2026'
  }]],
  ['eventos', [{
    id: 1,
    titulo: '2º HALLOWEEN ASSGA',
    descricao: 'Evento especial esportivo e de integração com premiações e confraternização.',
    data_inicio: '15/10/2026',
    data_fim: '16/10/2026',
    local: 'Ginásio Poliesportivo de São Gonçalo do Amarante - RN',
    vagas: 100,
    valor: 50.00,
    status: 'aberto'
  }]],
  ['diretoria', [{
    id: 1,
    nome: 'Diretoria Executiva',
    cargo: 'Presidência',
    descricao: 'Gestão e representação da Associação Desportiva ASSGA',
    email: 'assgar2019@gmail.com',
    telefone: '(84) 99698-1248'
  }]],
  ['estatuto', [{
    id: 1,
    conteudo: '<p>Documento oficial que regulamenta os princípios, direitos e deveres dos associados da ASSGA.</p>'
  }]],
  ['historia', {
    id: 1,
    titulo: 'Nossa História',
    subtitulo: 'Conheça a trajetória da ASSGA, desde sua fundação até os dias atuais.',
    data: 'Fundada em 2019',
    imagem: 'src/imagens/Assga_foto.jpg',
    texto: 'A ASSGA - Associação Desportiva foi fundada em 2019 na cidade de São Gonçalo do Amarante - RN, com o objetivo de promover o esporte, a integração social e o bem-estar da comunidade. Um grupo de apaixonados por esportes se uniu para criar uma associação que pudesse oferecer atividades esportivas de qualidade para todas as idades.',
    textoExtra: '<p><i class="fas fa-star" style="color:#ffd700;"></i> A ASSGA é feita de pessoas, histórias e conquistas. Cada passo é uma vitória!</p>',
    itens: [
      {
        id: 1,
        titulo: 'Fundação da ASSGA',
        data: '2019',
        texto: 'Início das atividades da Associação Desportiva ASSGA em São Gonçalo do Amarante - RN, unindo atletas, apoiadores e a comunidade.',
        imagem: 'src/imagens/Assga_foto.jpg'
      },
      {
        id: 2,
        titulo: 'Primeiros Torneios e Campeonatos',
        data: '2020 - 2021',
        texto: 'Realização dos primeiros campeonatos com grande participação e entusiasmo da comunidade desportiva.',
        imagem: 'src/imagens/foto1.jpg'
      },
      {
        id: 3,
        titulo: 'Expansão e Conquistas Esportivas',
        data: '2022 - 2024',
        texto: 'Crescimento contínuo, integração social e expansão de modalidades esportivas com destaque regional.',
        imagem: 'src/imagens/foto2.jpg'
      },
      {
        id: 4,
        titulo: 'Presença Digital e Eventos Especiais',
        data: '2026',
        texto: 'Consolidação da presença digital, carteirinhas de sócios e realizações como o 2º Halloween ASSGA.',
        imagem: 'src/imagens/foto3-1.jpg'
      }
    ]
  }],
  ['slider', [
    { imagem: 'src/imagens/foto1.jpg', texto: 'ASSGA - Associação Desportiva' },
    { imagem: 'src/imagens/foto2.jpg', texto: 'Esporte e integração da ASSGA' },
    { imagem: 'src/imagens/foto3-1.jpg', texto: 'Futsal e atividades esportivas ASSGA' }
  ]]
]);

const allowedCollections = new Set([
  'config',
  'noticias',
  'eventos',
  'diretoria',
  'estatuto',
  'historia',
  'slider',
]);

const privateCollections = new Set(['inscricoes', 'socios']);

function collectionFromRequest(request) {
  return String(request.query?.collection || '').trim().toLowerCase();
}

export default async function handler(request, response) {
  const collection = collectionFromRequest(request);

  if (privateCollections.has(collection)) {
    return response.status(403).json({
      error: 'Acesso restrito. Dados pessoais não são públicos.',
    });
  }

  if (!allowedCollections.has(collection)) {
    return response.status(400).json({ error: 'Coleção inválida.' });
  }

  if (request.method === 'GET') {
    const payload = memoryStore.get(collection) ?? [];
    if (collection === 'config' && payload && !Array.isArray(payload)) {
      const { senha, ...publicConfig } = payload;
      return response.status(200).json(publicConfig);
    }
    return response.status(200).json(payload);
  }

  if (request.method === 'POST') {
    const payload = request.body;
    memoryStore.set(collection, payload);
    return response.status(200).json({ status: 'ok', collection });
  }

  response.setHeader('Allow', 'GET, POST');
  return response.status(405).json({ error: 'Método não permitido.' });
}