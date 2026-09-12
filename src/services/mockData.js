// Banco de dados inicial, modelos e frases de acolhimento

export const MOTIVATIONAL_SOS_QUOTES = [
  {
    quote: "A fissura é como uma onda no oceano: ela cresce, atinge um pico e inevitavelmente passa. Respire fundo e espere 15 minutos.",
    author: "Prática de Mindfulness & Sobriedade",
  },
  {
    quote: "Você não precisa vencer a batalha do próximo mês ou ano hoje. Você só precisa manter a lucidez e a paz pelas próximas 24 horas.",
    author: "Princípio Só Por Hoje",
  },
  {
    quote: "A recaída não começa no ato, começa no isolamento e nos pensamentos. Fale com alguém agora ou ligue 188.",
    author: "Apoio Comunitário",
  },
  {
    quote: "Lembre-se do motivo pelo qual você começou. Toda a dor que você superou até agora vale a sua liberdade.",
    author: "Lembrete Terapêutico",
  },
  {
    quote: "Seja gentil consigo mesmo. Sentir vontade não significa fraqueza, significa que seu cérebro está se reconfigurando.",
    author: "Neurociência da Recuperação",
  },
];

export const BADGES_DEFINITION = [
  {
    id: 'badge-24h',
    title: 'Primeiro Passo',
    subtitle: '24 Horas de Lucidez',
    hoursRequired: 24,
    daysRequired: 1,
    iconName: 'Flame',
    color: '#E67E22',
    description: 'Completou seu primeiro dia completo no caminho da liberdade.',
  },
  {
    id: 'badge-3d',
    title: 'Clareza Inicial',
    subtitle: '3 Dias Consecutivos',
    hoursRequired: 72,
    daysRequired: 3,
    iconName: 'Sparkles',
    color: '#3498DB',
    description: 'O corpo e a mente começam a eliminar as toxinas e retomar o equilíbrio.',
  },
  {
    id: 'badge-7d',
    title: 'Semana Dourada',
    subtitle: '1 Semana Limpo(a)',
    hoursRequired: 168,
    daysRequired: 7,
    iconName: 'ShieldCheck',
    color: '#27AE60',
    description: '7 dias de resistência heroica contra os impulsos do hábito.',
  },
  {
    id: 'badge-30d',
    title: 'Um Mês de Vitória',
    subtitle: '30 Dias de Força',
    hoursRequired: 720,
    daysRequired: 30,
    iconName: 'Award',
    color: '#9B59B6',
    description: 'Novas sinapses neurais e um novo padrão de vida estabelecido.',
  },
  {
    id: 'badge-90d',
    title: 'Nova Consciência',
    subtitle: '90 Dias de Transformação',
    hoursRequired: 2160,
    daysRequired: 90,
    iconName: 'Medal',
    color: '#F1C40F',
    description: 'Marca fundamental reconhecida mundialmente na neuroplasticidade da sobriedade.',
  },
  {
    id: 'badge-180d',
    title: 'Raízes Firmes',
    subtitle: '6 Meses de Firmeza',
    hoursRequired: 4320,
    daysRequired: 180,
    iconName: 'Gem',
    color: '#1ABC9C',
    description: 'Meio ano construindo paz, relacionamentos restaurados e saúde.',
  },
  {
    id: 'badge-365d',
    title: 'Renascimento',
    subtitle: '1 Ano Completo',
    hoursRequired: 8760,
    daysRequired: 365,
    iconName: 'Crown',
    color: '#E74C3C',
    description: 'Passou por todas as estações do ano, celebrações e desafios em total sobriedade!',
  },
];

export const INITIAL_SUBSTANCES = [
  {
    id: 'sub-alcohol',
    name: 'Álcool',
    category: 'Bebidas Alcoólicas',
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 14 * 60 * 60 * 1000).toISOString(), // ~3 dias e 14h atrás
    dailyCost: 35.0, // R$ 35 por dia
    color: '#27AE60',
    notes: 'Priorizando clareza mental, sono de qualidade e presença com a família.',
    relapsesCount: 0,
    history: [],
  },
  {
    id: 'sub-tobacco',
    name: 'Cigarro / Nicotina',
    category: 'Tabaco',
    startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000).toISOString(), // ~12 dias atrás
    dailyCost: 18.0, // R$ 18 por dia
    color: '#3498DB',
    notes: 'Respirando melhor e economizando para viajar no final do ano.',
    relapsesCount: 0,
    history: [],
  },
];

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    authorName: 'Guerreiro(a) Anônimo(a)',
    isAnonymous: true,
    authorAvatar: null,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    content: 'Hoje completei 14 dias sem álcool. O final de semana parecia um monstro assustador, mas tomei bastante água com gás e limão e li um livro. Vale a pena cada segundo!',
    likesCount: 19,
    likedBy: [],
    commentsCount: 4,
    tags: ['Superação', 'FimDeSemana'],
  },
  {
    id: 'post-2',
    authorName: 'Mariana S.',
    isAnonymous: false,
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    content: 'Se alguém aí estiver sentindo aquela fisgada forte no peito hoje: não desista. Respira, toma um banho gelado e lembra de como a ressaca moral no dia seguinte dói muito mais.',
    likesCount: 38,
    likedBy: [],
    commentsCount: 9,
    tags: ['Acolhimento', 'Força'],
  },
  {
    id: 'post-3',
    authorName: 'Guerreiro(a) Anônimo(a)',
    isAnonymous: true,
    authorAvatar: null,
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    content: 'Acabei de ver na calculadora do naOn que já economizei R$ 420 esse mês deixando o cigarro. Comprei um tênis novo para começar a correr!',
    likesCount: 52,
    likedBy: [],
    commentsCount: 12,
    tags: ['Economia', 'Saúde'],
  },
];

export const INITIAL_MOODS = [
  {
    id: 'mood-today',
    date: new Date().toISOString().split('T')[0],
    mood: 'radiante', // radiante, bem, calmo, ansioso, desafiado
    emoji: '😊',
    label: 'Bem & Firme',
    triggerNote: 'Dia produtivo, caminhei no parque e mantive a hidratação.',
    cravingLevel: 1, // 0 to 5
    timestamp: new Date().toISOString(),
  },
];
