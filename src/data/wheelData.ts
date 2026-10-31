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
    name: 'Saúde & Disposição',
    pillar: 'pessoal',
    pillarName: 'Pessoal',
    description: 'Nível de energia física, qualidade do sono, alimentação e vigor diário.',
    guidingQuestion: 'Quão satisfeito você está com sua vitalidade física, sono e energia no dia a dia?',
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
    description: 'Estudos, leitura, novos aprendizados e evolução contínua da sua mente.',
    guidingQuestion: 'Você dedica tempo intencional para aprender coisas novas e expandir horizontes?',
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
    description: 'Capacidade de lidar com o estresse, autoconhecimento e serenidade sob pressão.',
    guidingQuestion: 'Como você avalia sua capacidade de gerenciar ansiedade, estresse e sentimentos difíceis?',
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
    name: 'Realização & Carreira',
    pillar: 'profissional',
    pillarName: 'Profissional',
    description: 'Sentimento de sentido no trabalho, progressão profissional e uso dos seus talentos.',
    guidingQuestion: 'O seu trabalho atual está alinhado com suas forças, talentos e objetivos de vida?',
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
    description: 'Segurança financeira, gestão consciente, reservas de emergência e investimentos.',
    guidingQuestion: 'Qual seu grau de tranquilidade em relação às suas finanças e planejamento futuro?',
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
    description: 'Impacto positivo no coletivo, voluntariado, mentoria e construção de legado.',
    guidingQuestion: 'Você sente que seus atos e trabalho deixam uma marca positiva na comunidade?',
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
    name: 'Família & Convivência',
    pillar: 'relacionamentos',
    pillarName: 'Relacionamentos',
    description: 'Harmonia, diálogo e conexão com pais, filhos, irmãos ou figuras familiares.',
    guidingQuestion: 'Como está o clima, o respeito mútuo e a cumplicidade no seu ambiente familiar?',
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
    name: 'Amor & Afeto',
    pillar: 'relacionamentos',
    pillarName: 'Relacionamentos',
    description: 'Cumplicidade amorosa, intimidade, confiança e respeito a dois (ou autoamor pleno).',
    guidingQuestion: 'Qual o grau de satisfação com sua vida afetiva, troca de carinho e intimidade?',
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
    name: 'Vida Social & Amizades',
    pillar: 'relacionamentos',
    pillarName: 'Relacionamentos',
    description: 'Amizades leais, momentos de descontração e rede de apoio comunitária.',
    guidingQuestion: 'Você tem amigos em quem confia e momentos agradáveis de conexão humana?',
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
    name: 'Hobbies & Lazer',
    pillar: 'qualidade',
    pillarName: 'Qualidade de Vida',
    description: 'Tempo para relaxar, criar, brincar, apreciar arte, viajar e recarregar as energias.',
    guidingQuestion: 'Você tem tempo de qualidade para atividades que te dão pura alegria desinteressada?',
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
    name: 'Espiritualidade & Sentido',
    pillar: 'qualidade',
    pillarName: 'Qualidade de Vida',
    description: 'Conexão com algo maior, paz espiritual, rituais diários e propósito existencial.',
    guidingQuestion: 'Como você cultiva sua fé, momentos de silêncio, gratidão e conexão com o sagrado?',
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
    name: 'Ambiente Físico & Lar',
    pillar: 'qualidade',
    pillarName: 'Qualidade de Vida',
    description: 'Ordem, beleza, conforto, segurança e aconchego nos lugares onde você vive e trabalha.',
    guidingQuestion: 'O seu lar e local de trabalho te trazem conforto, paz, inspiração e organização?',
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
