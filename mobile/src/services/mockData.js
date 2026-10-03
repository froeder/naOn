// Dados padrão e sementes para o naOn Mobile

export const INITIAL_SUBSTANCES = [
  {
    id: 'sub_default_1',
    name: 'Álcool',
    category: 'Bebidas Alcoólicas',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    dailyCost: 25.0,
    color: '#27AE60',
    reason: 'Pela minha saúde, clareza mental e pela minha família.',
    notes: 'Cada dia é uma vitória conquistada!',
    history: [],
  },
  {
    id: 'sub_default_2',
    name: 'Cigarro / Nicotina',
    category: 'Fumo',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    dailyCost: 15.0,
    color: '#3498DB',
    reason: 'Para respirar livremente e economizar para minha viagem.',
    notes: 'Evitar gatilhos após o café.',
    history: [],
  },
];

export const INITIAL_POSTS = [
  {
    id: 'post_1',
    authorName: 'RecuperandoDiaADia',
    avatarSeed: 'Felix',
    isAnonymous: true,
    timeAgo: 'há 2 horas',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    content: 'Hoje completei 90 dias limpo. Parecia impossível no início, mas com apoio e um dia de cada vez, hoje durmo em paz. Força a todos!',
    tag: 'Vitória',
    likesCount: 19,
    likedByMe: false,
    commentsCount: 2,
    comments: [
      { id: 'c1', authorName: 'Carlos M.', text: 'Parabéns irmão! Você é inspiração!', timeAgo: 'há 1h' },
      { id: 'c2', authorName: 'Luz_No_Fim', text: 'Só por hoje! Tamo junto nessa caminhada.', timeAgo: 'há 45m' }
    ]
  },
  {
    id: 'post_2',
    authorName: 'Luz_No_Fim',
    avatarSeed: 'Aneka',
    isAnonymous: true,
    timeAgo: 'há 4 horas',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    content: 'Tive uma vontade intensa hoje. Em vez de ceder, respirei fundo, bebi água gelada e liguei pro meu padrinho. A fissura passou!',
    tag: 'Superação',
    likesCount: 32,
    likedByMe: true,
    commentsCount: 1,
    comments: [
      { id: 'c3', authorName: 'Mariana S.', text: 'Excelente manejo! A fissura sempre passa.', timeAgo: 'há 3h' }
    ]
  },
  {
    id: 'post_3',
    authorName: 'Novo_Recomeco',
    avatarSeed: 'Zack',
    isAnonymous: false,
    timeAgo: 'há 8 horas',
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    content: 'Primeira semana sem recaída. O sono começou a melhorar. Obrigado pelo apoio de todos!',
    tag: 'Início de Jornada',
    likesCount: 45,
    likedByMe: false,
    commentsCount: 0,


export const INITIAL_MOODS = [
  {
    id: 'mood_1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    rating: 4,
    feeling: 'Determinado',
    triggers: ['Trabalho'],
    gratitude: 'Por ter conseguido dizer não e manter minha mente limpa.',
    note: 'Dia produtivo. Pratiquei caminhada no final da tarde.',
  },
  {
    id: 'mood_2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    rating: 3,
    feeling: 'Ansioso',
    triggers: ['Cansaço', 'Fim de semana'],
    gratitude: 'Pelo apoio da minha família e por ter o app na mão.',
    note: 'Senti vontade no final da tarde, mas respirei fundo e fiz um chá.',
  },
  {
    id: 'mood_3',
    date: new Date().toISOString(),
    rating: 5,
    feeling: 'Em Paz',
    triggers: [],
    gratitude: 'Por mais um dia acordando lúcido e com esperança.',
    note: 'Hoje me sinto forte e focado nas minhas metas.',
  }
];

export const MILESTONES = [
  { days: 1, title: '24 Horas', description: 'O primeiro e mais importante passo!', badge: '🌱', color: '#10B981' },
  { days: 3, title: '3 Dias', description: 'Superando o pico inicial da abstinência.', badge: '💧', color: '#06B6D4' },
  { days: 7, title: '1 Semana', description: 'O corpo começa a se restabelecer e desintoxicar.', badge: '⚡', color: '#3B82F6' },
  { days: 14, title: '2 Semanas', description: 'Melhora notável no sono e na clareza mental.', badge: '🌿', color: '#6366F1' },
  { days: 30, title: '1 Mês (Ficha de Bronze)', description: 'Nova rotina e hábitos positivos consolidados.', badge: '🥉', color: '#D97706' },
  { days: 60, title: '60 Dias', description: 'Duas luas de vitória e serenidade diária.', badge: '🌙', color: '#8B5CF6' },
  { days: 90, title: '3 Meses (Ficha de Prata)', description: 'Restauração profunda do sistema de recompensa.', badge: '🥈', color: '#9CA3AF' },
  { days: 180, title: '6 Meses', description: 'Meio ano transformando sua vida e seus relacionamentos.', badge: '🛡️', color: '#F59E0B' },
  { days: 270, title: '9 Meses', description: 'Renascimento e maturidade emocional na recuperação.', badge: '💎', color: '#EC4899' },
  { days: 365, title: '1 Ano (Ficha de Ouro)', description: '365 vitórias! Uma nova história construída.', badge: '🏆', color: '#EAB308' },
  { days: 730, title: '2 Anos', description: 'Solidez inabalável e inspiração para outros.', badge: '👑', color: '#84CC16' },
];

export const MOTIVATIONAL_QUOTES = [
  { text: 'Só por hoje não vou me render aos velhos hábitos.', author: 'Narcóticos Anônimos' },
  { text: 'A jornada de mil milhas começa com um único passo.', author: 'Lao Tsé' },
  { text: 'Você não precisa ver toda a escada, apenas dê o primeiro degrau.', author: 'Martin Luther King Jr.' },
  { text: 'A coragem não é a ausência do medo, mas a decisão de que algo mais é mais importante.', author: 'Ambrose Redmoon' },
  { text: 'A recuperação não é uma linha reta, mas cada dia sóbrio é uma vitória eterna.', author: 'Anônimo' },
  { text: 'Quando você muda o jeito de olhar para as coisas, as coisas para as quais você olha mudam.', author: 'Wayne Dyer' },
  { text: 'O segredo da mudança é focar toda a sua energia em construir o novo.', author: 'Sócrates' },
];

export const EMERGENCY_CONTACTS = [
  {
    name: 'CVV - Centro de Valorização da Vida',
    phone: '188',
    description: 'Apoio emocional e prevenção ao suicídio 24h gratuito.',
    type: 'phone',
  },
  {
    name: 'SAMU - Emergência Médica',
    phone: '192',
    description: 'Atendimento médico e intoxicações agudas 24h.',
    type: 'phone',
  },
  {
    name: 'Narcóticos Anônimos - Linha de Ajuda',
    phone: '08008886262',
    description: 'Encontre reuniões presenciais e online gratuitas em todo o Brasil.',
    type: 'phone',
  },
  {
    name: 'Alcoólicos Anônimos (AA) Brasil',
    phone: '1133159333',
    description: 'Plantão de atendimento e orientação de grupos.',
    type: 'phone',
  }
];

export const COPING_EXERCISES = [
  {
    id: 'breathe',
    title: 'Respiração 4-7-8 (Acalmar Sistema Nervoso)',
    description: 'Inspire pelo nariz por 4s, segure por 7s e solte o ar suavemente pela boca por 8s. Repita 4 ciclos.',
    duration: '2 min',
  },
  {
    id: 'grounding',
    title: 'Técnica 5-4-3-2-1 de Ancoragem',
    description: 'Olhe ao redor e note: 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira e 1 que saboreia.',
    duration: '3 min',
  },
  {
    id: 'water',
    title: 'Choque Térmico e Hidratação',
    description: 'Beba 1 copo grande de água bem gelada em pequenos goles e lave o rosto com água fria.',
    duration: '1 min',
  },
  {
    id: 'delay',
    title: 'Regra dos 15 Minutos',
    description: 'A fissura passa como uma onda. Diga a si mesmo: "Vou esperar 15 minutos antes de tomar qualquer decisão".',
    duration: '15 min',
  }
];

    comments: []
  }
];
