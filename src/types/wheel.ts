export type PillarId = 'pessoal' | 'profissional' | 'relacionamentos' | 'qualidade';

export interface LifeArea {
  id: string;
  name: string;
  pillar: PillarId;
  pillarName: string;
  description: string;
  guidingQuestion: string;
  detailedQuestions: string[];
  color: string;
  lightBg: string;
  textColor: string;
  defaultScore: number;
}

export interface PillarInfo {
  id: PillarId;
  name: string;
  shortDescription: string;
  color: string;
  lightColor: string;
  iconName: string;
}

export type ScoresMap = Record<string, number>;

export interface HarmonyReport {
  overallAverage: number;
  harmonyIndex: number; // 0 - 100%
  tier: 'excellent' | 'good' | 'moderate' | 'critical';
  tierLabel: string;
  tierDescription: string;
  pillarAverages: Record<PillarId, number>;
  strongestArea: LifeArea;
  criticalArea: LifeArea;
  leverageArea: LifeArea;
  actionPlan: ActionPlanItem[];
}

export interface ActionPlanItem {
  areaId: string;
  areaName: string;
  pillarName: string;
  timeframe: '7 dias' | '30 dias' | '90 dias';
  action: string;
  impact: string;
}

export interface LeadData {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  consent?: boolean;
  scores: ScoresMap;
  overallAverage: number;
  harmonyIndex: number;
  leverageAreaName: string;
  createdAt: string;
}

export interface EmailDispatchResult {
  success: boolean;
  message: string;
  emailPreviewHtml?: string;
  recipient?: string;
  sentAt?: string;
}
