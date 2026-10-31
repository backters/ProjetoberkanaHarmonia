import { LIFE_AREAS, PILLARS } from '../data/wheelData';
import { ActionPlanItem, HarmonyReport, LifeArea, PillarId, ScoresMap } from '../types/wheel';

export function calculateHarmonyReport(scores: ScoresMap): HarmonyReport {
  const values = LIFE_AREAS.map(a => scores[a.id] ?? 5);
  const total = values.reduce((sum, val) => sum + val, 0);
  const average = total / values.length;

  // Standard deviation
  const variance = values.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Harmony Index: balanced wheel rolls smoothly.
  // We compute uniformity factor based on stdDev: maximum penalty if stdDev is high (e.g. 4.0), 0 penalty if stdDev is 0.
  // Harmony index ranges from 0 to 100.
  const uniformityScore = Math.max(0, 100 - (stdDev * 18));
  const levelScore = (average / 10) * 100;
  const harmonyIndex = Math.round((levelScore * 0.55) + (uniformityScore * 0.45));

  // Determine tier
  let tier: 'excellent' | 'good' | 'moderate' | 'critical';
  let tierLabel: string;
  let tierDescription: string;

  if (harmonyIndex >= 78) {
    tier = 'excellent';
    tierLabel = 'Harmonia Elevada & Fluidez';
    tierDescription = 'Sua roda gira com estabilidade notável. As diversas áreas da sua vida se sustentam mutuamente com alta vitalidade e sincronia.';
  } else if (harmonyIndex >= 62) {
    tier = 'good';
    tierLabel = 'Bom Equilíbrio com Potencial de Alavancagem';
    tierDescription = 'Você mantém bases sólidas na maioria dos setores, mas há pontos com atrito perceptível que, se alinhados, destravarão um salto exponencial.';
  } else if (harmonyIndex >= 45) {
    tier = 'moderate';
    tierLabel = 'Desequilíbrio Moderado (Roda Irregular)';
    tierDescription = 'Algumas áreas estão consumindo energia excessiva enquanto outras fundamentais operam no modo sobrevivência. É hora de rebalancear pesos.';
  } else {
    tier = 'critical';
    tierLabel = 'Atenção Prioritária & Sobrecarga';
    tierDescription = 'Sua roda apresenta fortes oscilações e áreas de exaustão. Focar na base de autocuidado e clareza é imperativo para evitar esgotamento.';
  }

  // Pillar averages
  const pillarAverages: Record<PillarId, number> = {
    pessoal: 0,
    profissional: 0,
    relacionamentos: 0,
    qualidade: 0,
  };

  PILLARS.forEach(pillar => {
    const areas = LIFE_AREAS.filter(a => a.pillar === pillar.id);
    const sum = areas.reduce((acc, a) => acc + (scores[a.id] ?? 5), 0);
    pillarAverages[pillar.id] = Math.round((sum / areas.length) * 10) / 10;
  });

  // Sort areas by score
  const sortedAreas = [...LIFE_AREAS].sort((a, b) => (scores[a.id] ?? 5) - (scores[b.id] ?? 5));
  const criticalArea = sortedAreas[0];
  const strongestArea = sortedAreas[sortedAreas.length - 1];

  // Leverage Area (Área Alavanca):
  // Foundational areas have higher systemic weight (Health & Vitality, Emotional Balance, Financial Resources).
  // If health is below 7, health is universally the #1 leverage area because fatigue impairs all 11 other areas.
  // Next is emotional balance, then financial, or otherwise the lowest area.
  let leverageArea: LifeArea;
  const healthArea = LIFE_AREAS.find(a => a.id === 'saude_disposicao')!;
  const emotionalArea = LIFE_AREAS.find(a => a.id === 'equilibrio_emocional')!;
  const financialArea = LIFE_AREAS.find(a => a.id === 'recursos_financeiros')!;

  const healthScore = scores['saude_disposicao'] ?? 5;
  const emotionalScore = scores['equilibrio_emocional'] ?? 5;
  const financialScore = scores['recursos_financeiros'] ?? 5;

  if (healthScore <= 6) {
    leverageArea = healthArea;
  } else if (emotionalScore <= 6) {
    leverageArea = emotionalArea;
  } else if (financialScore <= 5) {
    leverageArea = financialArea;
  } else {
    leverageArea = criticalArea;
  }

  // Generate action plan items
  const actionPlan: ActionPlanItem[] = [
    {
      areaId: leverageArea.id,
      areaName: leverageArea.name,
      pillarName: leverageArea.pillarName,
      timeframe: '7 dias',
      action: get7DayAction(leverageArea.id),
      impact: 'Alívio imediato de tensão e recuperação rápida de clareza e vigor.',
    },
    {
      areaId: criticalArea.id,
      areaName: criticalArea.name,
      pillarName: criticalArea.pillarName,
      timeframe: '30 dias',
      action: get30DayAction(criticalArea.id),
      impact: 'Criação de um novo ritual consistente para eliminar o gargalo de energia.',
    },
    {
      areaId: strongestArea.id,
      areaName: strongestArea.name,
      pillarName: strongestArea.pillarName,
      timeframe: '90 dias',
      action: get90DayAction(strongestArea.id),
      impact: 'Uso da sua maior fortaleza como mola propulsora para apoiar as áreas vulneráveis.',
    },
  ];

  return {
    overallAverage: Math.round(average * 10) / 10,
    harmonyIndex,
    tier,
    tierLabel,
    tierDescription,
    pillarAverages,
    strongestArea,
    criticalArea,
    leverageArea,
    actionPlan,
  };
}

function get7DayAction(areaId: string): string {
  switch (areaId) {
    case 'saude_disposicao':
      return 'Estabelecer horário inegociável de sono com 7 a 8 horas, 2L de água ao dia e caminhada leve de 20 minutos.';
    case 'equilibrio_emocional':
      return 'Fazer 10 minutos de silêncio ou respiração diafragmática ao acordar e cortar estímulos de tela 45 minutos antes de dormir.';
    case 'recursos_financeiros':
      return 'Mapear todos os gastos fixos e variáveis dos últimos 30 dias em uma planilha simples e identificar vazamentos imediatos.';
    case 'realizacao_proposito':
      return 'Escrever uma lista com seus 3 maiores talentos e agendar 1 hora na semana dedicada a um projeto pessoal com significado.';
    case 'familia':
      return 'Promover um momento de refeição sem celulares ou uma conversa acolhedora de 20 minutos com quem é prioritário na sua família.';
    case 'amor_afeto':
      return 'Planejar uma experiência a dois sem interferências externas, ou praticar um dia dedicado inteiramente ao autocuidado.';
    default:
      return 'Identificar o micro-hábito de 15 minutos que pode ser implementado já nesta semana para dar o primeiro passo concreto.';
  }
}

function get30DayAction(areaId: string): string {
  switch (areaId) {
    case 'saude_disposicao':
      return 'Agendar consultas e exames de rotina, ajustar cardápio para reduzir ultraprocessados e fixar treino 3x na semana.';
    case 'equilibrio_emocional':
      return 'Iniciar prática regular de meditação, escrita terapêutica (journaling) ou acompanhamento com terapeuta/mentor.';
    case 'recursos_financeiros':
      return 'Criar uma meta de economia automática no primeiro dia após o recebimento e iniciar a constituição da reserva de emergência.';
    case 'realizacao_proposito':
      return 'Definir 1 meta profissional de médio prazo e iniciar um curso ou mentoria que acelere seu posicionamento.';
    case 'hobbies_lazer':
      return 'Bloquear uma manhã de sábado ou tarde de domingo quinzenal exclusivamente para atividades lúdicas sem obrigação de produtividade.';
    default:
      return 'Consolidar um sistema de acompanhamento semanal para medir a evolução desta área aos domingos.';
  }
}

function get90DayAction(strongestAreaId: string): string {
  return `Canalizar a confiança e a disciplina que você já possui em "${strongestAreaId}" para inspirar e financiar as mudanças necessárias no restante da sua vida.`;
}
