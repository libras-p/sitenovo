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

export const associados: Associado[] = [
  {
    id: 1,
    matricula: 'ASG-2024-001',
    nome: 'Carlos Eduardo do Nascimento',
    email: 'deafdonascimento@gmail.com',
    telefone: '(84) 98845-1290',
    cpf: '123.456.789-00',
    rg: '2.345.678 SSP',
    data_nascimento: '1992-07-14',
    tipo_sanguineo: 'O+',
    data_filiacao: '2018-02-10',
    categoria: 'Sócio Atleta',
    status: 'Ativo',
    validade_carteirinha: '2026-12-31',
    cidade: 'São Gonçalo do Amarante',
    estado: 'RN',
    identidade_surda: 'Surdo(a)',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    matricula: 'ASG-2023-042',
    nome: 'Mariana Silveira Santos',
    email: 'mariana.silveira@email.com',
    telefone: '(84) 99123-4567',
    cpf: '345.678.901-22',
    rg: '3.456.789 SSP',
    data_nascimento: '1988-03-28',
    tipo_sanguineo: 'A+',
    data_filiacao: '2019-05-15',
    categoria: 'Sócio Efetivo',
    status: 'Ativo',
    validade_carteirinha: '2026-12-31',
    cidade: 'Natal',
    estado: 'RN',
    identidade_surda: 'Surdo(a)',
    foto_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    matricula: 'ASG-2024-089',
    nome: 'Lucas Vinicius Pereira Lima',
    email: 'lucas.pereira@email.com',
    telefone: '(84) 98711-2233',
    cpf: '567.890.123-44',
    rg: '4.567.890 SSP',
    data_nascimento: '1996-11-05',
    tipo_sanguineo: 'B+',
    data_filiacao: '2022-01-20',
    categoria: 'Sócio Atleta',
    status: 'Ativo',
    validade_carteirinha: '2026-12-31',
    cidade: 'São Gonçalo do Amarante',
    estado: 'RN',
    identidade_surda: 'Surdo(a)',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    matricula: 'ASG-2022-015',
    nome: 'Renata Albuquerque Mendes',
    email: 'renata.mendes@email.com',
    telefone: '(84) 99654-7890',
    cpf: '789.012.345-66',
    rg: '5.678.901 SSP',
    data_nascimento: '1994-09-19',
    tipo_sanguineo: 'AB+',
    data_filiacao: '2021-08-12',
    categoria: 'Sócio Colaborador',
    status: 'Pendente',
    validade_carteirinha: '2025-12-31',
    cidade: 'Macaíba',
    estado: 'RN',
    identidade_surda: 'Intérprete / Familiar ouvinte',
    foto_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  },
];

export const carteirinhas: Carteirinha[] = [
  {
    id: 1,
    associado_id: 1,
    codigo_autenticacao: 'ASSGA-2024-001-AUTH-9F83A2',
    data_emissao: '2024-01-10',
    data_validade: '2026-12-31',
    via: 1,
    ativa: true,
  },
  {
    id: 2,
    associado_id: 2,
    codigo_autenticacao: 'ASSGA-2023-042-AUTH-4B71C9',
    data_emissao: '2023-06-01',
    data_validade: '2026-12-31',
    via: 1,
    ativa: true,
  },
  {
    id: 3,
    associado_id: 3,
    codigo_autenticacao: 'ASSGA-2024-089-AUTH-2E19D5',
    data_emissao: '2024-02-15',
    data_validade: '2026-12-31',
    via: 1,
    ativa: true,
  },
  {
    id: 4,
    associado_id: 4,
    codigo_autenticacao: 'ASSGA-2022-015-AUTH-7C33F1',
    data_emissao: '2022-09-01',
    data_validade: '2025-12-31',
    via: 1,
    ativa: false,
  },
];

export const mensalidades: Mensalidade[] = [
  {
    id: 1,
    associado_id: 1,
    mes_referencia: 9,
    ano_referencia: 2026,
    valor: 25.00,
    data_pagamento: '2026-09-05',
    status: 'Pago',
    metodo: 'PIX',
  },
  {
    id: 2,
    associado_id: 1,
    mes_referencia: 8,
    ano_referencia: 2026,
    valor: 25.00,
    data_pagamento: '2026-08-04',
    status: 'Pago',
    metodo: 'PIX',
  },
  {
    id: 3,
    associado_id: 2,
    mes_referencia: 9,
    ano_referencia: 2026,
    valor: 25.00,
    data_pagamento: '2026-09-02',
    status: 'Pago',
    metodo: 'PIX',
  },
  {
    id: 4,
    associado_id: 3,
    mes_referencia: 9,
    ano_referencia: 2026,
    valor: 25.00,
    data_pagamento: '2026-09-06',
    status: 'Pago',
    metodo: 'PIX',
  },
  {
    id: 5,
    associado_id: 4,
    mes_referencia: 9,
    ano_referencia: 2026,
    valor: 25.00,
    status: 'Pendente',
    metodo: 'PIX',
  },
];

export const membrosDiretoria: MembroDiretoria[] = [
  {
    id: 1,
    ordem: 1,
    cargo: 'Presidente',
    nome: 'Carlos Eduardo do Nascimento',
    gestao: '2024-2028',
    email: 'deafdonascimento@gmail.com',
    telefone: '(84) 99698-1248',
    bio: 'Liderança surda ativa na luta pelos direitos linguísticos, acessibilidade e fortalecimento do desporto de surdos.',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    ordem: 2,
    cargo: 'Vice-Presidente',
    nome: 'Mariana Silveira Santos',
    gestao: '2024-2028',
    email: 'mariana.silveira@email.com',
    telefone: '(84) 99123-4567',
    bio: 'Coordenadora de projetos comunitários e fomento cultural em LIBRAS.',
    foto_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    ordem: 3,
    cargo: 'Diretor de Esportes',
    nome: 'Lucas Vinicius Pereira',
    gestao: '2024-2028',
    email: 'lucas.pereira@email.com',
    telefone: '(84) 98711-2233',
    bio: 'Atleta de futsal para surdos, responsável pelo planejamento de competições e treinos da associação.',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    ordem: 4,
    cargo: '1ª Secretária',
    nome: 'Juliana Costa Ferreira',
    gestao: '2024-2028',
    email: 'secretaria.assga@gmail.com',
    telefone: '(84) 98877-6655',
    bio: 'Gestão de documentação, atas e cadastro de associados.',
    foto_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    ordem: 5,
    cargo: 'Diretor Financeiro / Tesoureiro',
    nome: 'Marcos André da Silva',
    gestao: '2024-2028',
    email: 'financeiro.assga@gmail.com',
    telefone: '(84) 98122-3344',
    bio: 'Responsável pela transparência contábil, prestação de contas e arrecadação de mensalidades.',
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
];

export const modalidades: ModalidadeEsportiva[] = [
  {
    id: 1,
    nome: 'Futsal Masculino e Feminino',
    categoria: 'Principal e Veteranos',
    icone: 'fa-futbol',
    dias_treino: 'Terças e Quintas às 19:30',
    local_treino: 'Ginásio Municipal de São Gonçalo do Amarante',
    responsavel: 'Lucas Vinicius',
    descricao: 'Treinamento tático e físico para competições estaduais e nacionais de surdoatletas filiados à CBDS.',
    ativa: true,
  },
  {
    id: 2,
    nome: 'Voleibol de Surdos',
    categoria: 'Misto',
    icone: 'fa-volleyball',
    dias_treino: 'Sábados às 15:00',
    local_treino: 'Quadra Poliesportiva Central',
    responsavel: 'Equipe Técnica ASSGA',
    descricao: 'Iniciação e alto rendimento no voleibol, adaptado com sinais visuais.',
    ativa: true,
  },
  {
    id: 3,
    nome: 'Atletismo e Corridas de Rua',
    categoria: 'Geral',
    icone: 'fa-person-running',
    dias_treino: 'Segundas, Quartas e Sextas às 06:00',
    local_treino: 'Pista Municipal',
    responsavel: 'Coordenação Esportiva',
    descricao: 'Preparação para provas de 5km, 10km e pista oficial.',
    ativa: true,
  },
  {
    id: 4,
    nome: 'Xadrez e Jogos de Mesa',
    categoria: 'Livre',
    icone: 'fa-chess',
    dias_treino: 'Domingos às 14:00',
    local_treino: 'Sede Social da ASSGA',
    responsavel: 'Diretoria Social',
    descricao: 'Estimula o raciocínio estratégico e a integração dos associados de todas as idades.',
    ativa: true,
  },
];

export const eventos: Evento[] = [
  {
    id: 1,
    titulo: 'Torneio Estadual de Futsal dos Surdos 2026',
    tipo: 'Campeonato Oficial',
    data_inicio: '2026-10-12T09:00:00',
    local: 'Ginásio Poliesportivo de São Gonçalo do Amarante - RN',
    descricao: 'Competição que reúne equipes de surdos de várias regiões do Rio Grande do Norte e estados vizinhos.',
    libras_disponivel: true,
    imagem_url: '/imagens/foto1.jpg',
    destaque: true,
    ativo: true,
  },
  {
    id: 2,
    titulo: 'Encontro de Conscientização e Cultura Surda (Setembro Azul)',
    tipo: 'Cultural e Comunitário',
    data_inicio: '2026-09-26T14:00:00',
    local: 'Auditório da Casa de Cultura Municipal',
    descricao: 'Palestras, oficinas em LIBRAS, apresentações teatrais e debates sobre acessibilidade e inclusão social.',
    libras_disponivel: true,
    imagem_url: '/imagens/Assga_foto.jpg',
    destaque: true,
    ativo: true,
  },
  {
    id: 3,
    titulo: '2º HALLOWEEN ASSGA',
    tipo: 'Confraternização e Esporte',
    data_inicio: '2026-10-15T18:00:00',
    data_fim: '2026-10-16T22:00:00',
    local: 'Ginásio Poliesportivo de São Gonçalo do Amarante - RN',
    descricao: 'Evento especial esportivo e de integração com premiações, confraternização e muita diversão.',
    libras_disponivel: true,
    imagem_url: '/imagens/halloween-assga.jpeg',
    destaque: true,
    ativo: true,
  },
  {
    id: 4,
    titulo: 'Assembleia Geral Ordinária de Prestação de Contas',
    tipo: 'Institucional',
    data_inicio: '2026-11-20T18:30:00',
    local: 'Sede Social da ASSGA',
    descricao: 'Apresentação dos balancetes financeiros, relatório de atividades esportivas e deliberações estatutárias.',
    libras_disponivel: true,
    imagem_url: '/imagens/foto2.jpg',
    destaque: false,
    ativo: true,
  },
];

export const capitulosEstatuto: CapituloEstatuto[] = [
  {
    id: 1,
    numero: 1,
    titulo: 'Da Denominação, Sede, Fins e Duração',
    ordem: 1,
    artigos: [
      {
        id: 1,
        capitulo_id: 1,
        numero: 1,
        texto: 'A ASSGA - Associação dos Surdos de São Gonçalo do Amarante, fundada em 23 de Julho de 2024, é uma entidade civil sem fins lucrativos, com personalidade jurídica própria e prazo de duração indeterminado.',
        paragrafo_unico: 'A associação adota a Língua Brasileira de Sinais (LIBRAS) como meio oficial e prioritário de comunicação, instrução e deliberação.',
      },
      {
        id: 2,
        capitulo_id: 1,
        numero: 2,
        texto: 'A ASSGA tem por finalidade precípua promover a união da comunidade surda, fomentar o desporto, defender a cidadania e a inclusão social.',
      },
    ],
  },
  {
    id: 2,
    numero: 2,
    titulo: 'Dos Sócios, Seus Direitos e Deveres',
    ordem: 2,
    artigos: [
      {
        id: 3,
        capitulo_id: 2,
        numero: 3,
        texto: 'O quadro social da ASSGA é composto pelas seguintes categorias: Sócios Atletas, Sócios Efetivos, Sócios Colaboradores e Sócios Beneméritos.',
      },
      {
        id: 4,
        capitulo_id: 2,
        numero: 4,
        texto: 'São direitos dos associados em dia com suas mensalidades: participar das assembleias gerais, votar e ser votado, usufruir da carteirinha oficial e participar das modalidades esportivas.',
      },
    ],
  },
];

export const contatos: ContatoMensagem[] = [];

export const voluntarios: VoluntarioCadastro[] = [];

export const momentosAssga: MomentoAssga[] = [
  {
    id: 1,
    titulo: 'Encontro Oficial da ASSGA',
    subtitulo: 'União de associados, atletas e famílias surdas de São Gonçalo do Amarante e região metropolitana.',
    imagem: '/imagens/Assga_foto.jpg',
    badge: 'Comunidade & Liderança',
    ordem: 1,
  },
  {
    id: 2,
    titulo: 'Futsal e Alto Rendimento',
    subtitulo: 'Treinamento constante e preparação para os campeonatos potiguares e interestaduais.',
    imagem: '/imagens/foto1.jpg',
    badge: 'Desporto de Surdos',
    ordem: 2,
  },
  {
    id: 3,
    titulo: 'Integração e Cidadania em LIBRAS',
    subtitulo: 'Valorização da cultura surda, respeito aos direitos humanos e acessibilidade linguística plena.',
    imagem: '/imagens/foto2.jpg',
    badge: 'Cultura e Cidadania',
    ordem: 3,
  },
];

export const noticias: Noticia[] = [
  {
    id: 1,
    titulo: '2º HALLOWEEN ASSGA',
    conteudo: 'Estão abertas as inscrições para o 2º HALLOWEEN ASSGA! Prepare-se para um evento especial com muita diversão, esporte, integração e confraternização.',
    imagem: '/imagens/halloween-assga.jpeg',
    data: '15/08/2026',
    destaque: true,
  },
  {
    id: 2,
    titulo: 'Treinos Oficiais de Futsal para os Jogos Regionais',
    conteudo: 'A diretoria esportiva da ASSGA convoca todos os atletas filiados para os treinos preparatórios rumo aos campeonatos estaduais de surdos.',
    imagem: '/imagens/foto1.jpg',
    data: '02/09/2026',
    destaque: true,
  },
];
