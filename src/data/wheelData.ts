import { LifeArea, PillarInfo, ScoresMap } from '../types/wheel';

export const PILLARS: PillarInfo[] = [
  {
    id: 'pessoal',
    name: 'Pessoal',
    shortDescription: 'Sua vitalidade, expansão mental e serenidade emocional.',
    color: '#0D9488', // Teal 600
    lightColor: '#F0FDFA',
    iconName: 'Heart',
  },
  {
    id: 'profissional',
    name: 'Profissional',
    shortDescription: 'Sua carreira, independência financeira e contribuição ao mundo.',
    color: '#2563EB', // Blue 600
    lightColor: '#EFF6FF',
    iconName: 'Briefcase',
  },
  {
    id: 'relacionamentos',
    name: 'Relacionamentos',
    shortDescription: 'Seus vínculos afetivos, laços familiares e convivência social.',
    color: '#E11D48', // Rose 600
    lightColor: '#FFF1F2',
    iconName: 'Users',
  },
  {
    id: 'qualidade',
    name: 'Qualidade de Vida',
    shortDescription: 'Momentos de alegria, espaço físico e conexão de alma.',
    color: '#D97706', // Amber 600
    lightColor: '#FFFBEB',
    iconName: 'Sparkles',
  },
];

export const LIFE_AREAS: LifeArea[] = [
  // 1. Pessoal
  {
    id: 'saude_disposicao',
    name: 'Saúde e Disposição',
    pillar: 'pessoal',
    pillarName: 'Pessoal',
    description: 'Como está a sua vitalidade, a sua energia física e a leveza ao lidar com esta questão?',
    guidingQuestion: 'Como está a sua vitalidade, a sua energia física e a leveza ao lidar com esta questão?',
    detailedQuestions: [
      'Você acorda descansado e com energia para as atividades do dia?',
      'Pratica atividades físicas regulares e cuida de exames preventivos?',
      'Sua alimentação nutre seu corpo e mente com constância?',
    ],
    color: '#0D9488',
    lightBg: '#CCFBF1',
    textColor: '#115E59',
    defaultScore: 6,
  },
  {
    id: 'desenvolvimento_intelectual',
    name: 'Desenvolvimento Intelectual',
    pillar: 'pessoal',
    pillarName: 'Pessoal',
    description: 'O quanto você investe em aprendizado, clareza mental e evolução em relação a este tema?',
    guidingQuestion: 'O quanto você investe em aprendizado, clareza mental e evolução em relação a este tema?',
    detailedQuestions: [
      'Costuma ler livros, fazer cursos ou consumir conteúdos enriquecedores?',
      'Sente que sua mente é estimulada com desafios intelectuais?',
      'Aplica os novos conhecimentos na prática do seu cotidiano?',
    ],
    color: '#0F766E',
    lightBg: '#E6FFFA',
    textColor: '#134E4A',
    defaultScore: 7,
  },
  {
    id: 'equilibrio_emocional',
    name: 'Equilíbrio Emocional',
    pillar: 'pessoal',
    pillarName: 'Pessoal',
    description: 'Como você lida com os desafios e os momentos de pressão nesta área, sem perder a sua centralidade?',
    guidingQuestion: 'Como você lida com os desafios e os momentos de pressão nesta área, sem perder a sua centralidade?',
    detailedQuestions: [
      'Consegue manter a calma em momentos de tensão ou imprevistos?',
      'Tem momentos de clareza mental e serenidade interna?',
      'Reconhece seus gatilhos emocionais e sabe se reequilibrar?',
    ],
    color: '#14B8A6',
    lightBg: '#F0FDFA',
    textColor: '#0F766E',
    defaultScore: 5,
  },

  // 2. Profissional
  {
    id: 'realizacao_proposito',
    name: 'Realização Profissional',
    pillar: 'profissional',
    pillarName: 'Profissional',
    description: 'O quanto você se sente realizada, motivada e produtiva em relação a esta escolha?',
    guidingQuestion: 'O quanto você se sente realizada, motivada e produtiva em relação a esta escolha?',
    detailedQuestions: [
      'Você sente orgulho e entusiasmo pelo trabalho que realiza?',
      'Visualiza oportunidades claras de crescimento na sua carreira?',
      'Seus talentos naturais são aproveitados no seu dia a dia profissional?',
    ],
    color: '#2563EB',
    lightBg: '#DBEAFE',
    textColor: '#1E40AF',
    defaultScore: 6,
  },
  {
    id: 'recursos_financeiros',
    name: 'Recursos Financeiros',
    pillar: 'profissional',
    pillarName: 'Profissional',
    description: 'Como você se sente em relação à estabilidade, à prosperidade e ao fluxo de recursos ligados a este tema?',
    guidingQuestion: 'Como você se sente em relação à estabilidade, à prosperidade e ao fluxo de recursos ligados a este tema?',
    detailedQuestions: [
      'Sua renda cobre seus custos de vida com tranquilidade e sobra para poupar?',
      'Possui uma reserva de segurança para emergências e imprevistos?',
      'Investe de forma planejada para construir estabilidade no longo prazo?',
    ],
    color: '#1D4ED8',
    lightBg: '#EFF6FF',
    textColor: '#1E3A8A',
    defaultScore: 5,
  },
  {
    id: 'contribuicao_social',
    name: 'Contribuição Social',
    pillar: 'profissional',
    pillarName: 'Profissional',
    description: 'Qual é a sensação de pertencimento, valor e impacto positivo que você percebe nesta área da sua vida?',
    guidingQuestion: 'Qual é a sensação de pertencimento, valor e impacto positivo que você percebe nesta área da sua vida?',
    detailedQuestions: [
      'Dedica tempo, recursos ou atenção para ajudar causas ou pessoas necessitadas?',
      'Enxerga um impacto social positivo gerado pelo seu esforço?',
      'Participa ativamente na melhoria do ambiente ao seu redor?',
    ],
    color: '#3B82F6',
    lightBg: '#EBF5FF',
    textColor: '#1D4ED8',
    defaultScore: 6,
  },

  // 3. Relacionamentos
  {
    id: 'familia',
    name: 'Relacionamento Familiar',
    pillar: 'relacionamentos',
    pillarName: 'Relacionamentos',
    description: 'Como está a harmonia, a base e a fluidez das relações que sustentam este aspecto da sua vida?',
    guidingQuestion: 'Como está a harmonia, a base e a fluidez das relações que sustentam este aspecto da sua vida?',
    detailedQuestions: [
      'Consegue ter conversas sinceras e momentos acolhedores em família?',
      'Há equilíbrio entre afeto, limites e presença genuína?',
      'Sente que seu lar é um refúgio seguro de apoio mútuo?',
    ],
    color: '#E11D48',
    lightBg: '#FFE4E6',
    textColor: '#9F1239',
    defaultScore: 7,
  },
  {
    id: 'amor_afeto',
    name: 'Relacionamento Amoroso',
    pillar: 'relacionamentos',
    pillarName: 'Relacionamentos',
    description: 'Como você avalia a troca de afeto, a cumplicidade e o equilíbrio entre dar e receber nesta área?',
    guidingQuestion: 'Como você avalia a troca de afeto, a cumplicidade e o equilíbrio entre dar e receber nesta área?',
    detailedQuestions: [
      'Existe escuta ativa, companheirismo e diálogo honesto com seu parceiro(a)?',
      'Caso solteiro(a), você cultiva amor-próprio e clareza sobre o que busca?',
      'Há espaço para o romance, leveza e cumplicidade na rotina?',
    ],
    color: '#BE123C',
    lightBg: '#FFF1F2',
    textColor: '#881337',
    defaultScore: 6,
  },
  {
    id: 'vida_social',
    name: 'Vida Social',
    pillar: 'relacionamentos',
    pillarName: 'Relacionamentos',
    description: 'De que forma as suas trocas e o apoio das pessoas ao redor influenciam positivamente esta área?',
    guidingQuestion: 'De que forma as suas trocas e o apoio das pessoas ao redor influenciam positivamente esta área?',
    detailedQuestions: [
      'Mantém contato regular com amigos que elevam sua energia?',
      'Tem alguém a quem recorrer sem filtros nos momentos de vulnerabilidade?',
      'Separa tempo para rir, conversar e partilhar a vida com amigos?',
    ],
    color: '#F43F5E',
    lightBg: '#FFF5F6',
    textColor: '#BE123C',
    defaultScore: 7,
  },

  // 4. Qualidade de Vida
  {
    id: 'hobbies_lazer',
    name: 'Hobbies e Diversão',
    pillar: 'qualidade',
    pillarName: 'Qualidade de Vida',
    description: 'Você consegue encontrar momentos de leveza, prazer e descontração dentro desta área?',
    guidingQuestion: 'Você consegue encontrar momentos de leveza, prazer e descontração dentro desta área?',
    detailedQuestions: [
      'Dedica momentos regulares na semana para seus passatempos favoritos?',
      'Consegue se desconectar das obrigações e curtir momentos de ócio criativo?',
      'Pratica atividades que despertam sua curiosidade e imaginação?',
    ],
    color: '#D97706',
    lightBg: '#FEF3C7',
    textColor: '#92400E',
    defaultScore: 5,
  },
  {
    id: 'espiritualidade',
    name: 'Espiritualidade',
    pillar: 'qualidade',
    pillarName: 'Qualidade de Vida',
    description: 'O quanto você sente que este aspecto da sua vida está alinhado com o seu propósito maior e com a sua verdade?',
    guidingQuestion: 'O quanto você sente que este aspecto da sua vida está alinhado com o seu propósito maior e com a sua verdade?',
    detailedQuestions: [
      'Reserva momentos para oração, meditação, contemplação ou silêncio?',
      'Sente gratidão genuína pelas pequenas coisas do seu dia?',
      'Sua vida possui um propósito que transcende o imediatismo material?',
    ],
    color: '#B45309',
    lightBg: '#FFFBEB',
    textColor: '#78350F',
    defaultScore: 6,
  },
  {
    id: 'ambiente_espaco',
    name: 'Plenitude e Felicidade',
    pillar: 'qualidade',
    pillarName: 'Qualidade de Vida',
    description: 'O quanto você se sente realizada, alegre e em paz com a área que está analisando?',
    guidingQuestion: 'O quanto você se sente realizada, alegre e em paz com a área que está analisando?',
    detailedQuestions: [
      'Seu espaço de descanso é silencioso, limpo e aconchegante?',
      'Seu local de trabalho favorece a concentração e a criatividade?',
      'Você se sente energizado e em harmonia no ambiente da sua casa?',
    ],
    color: '#F59E0B',
    lightBg: '#FFFDF5',
    textColor: '#B45309',
    defaultScore: 7,
  },
];

export const DEFAULT_SCORES: ScoresMap = LIFE_AREAS.reduce((acc, area) => {
  acc[area.id] = area.defaultScore;
  return acc;
}, {} as ScoresMap);
