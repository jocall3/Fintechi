// types/ai.ts

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  chartData?: { name: string; value: number }[];
}

export interface AIPlanStep {
    title: string;
    description: string;
    timeline: string;
}

export interface AIPlan {
    title: string;
    summary: string;
    steps: AIPlanStep[];
}

export interface AIQuestion {
    id:string;
    question: string;
    category: string;
}

export enum WeaverStage {
    Pitch = 'pitch',
    Analysis = 'analysis',
    Test = 'test',
    FinalReview = 'final_review',
    Approved = 'approved',
    Error = 'error',
}

export interface QuantumWeaverState {
    stage: WeaverStage;
    businessPlan: string;
    feedback: string;
    questions: AIQuestion[];
    loanAmount: number;
    coachingPlan: AIPlan | null;
    error: string | null;
}

export interface AIGoalPlanStep {
    title: string;
    description: string;
    category: 'Savings' | 'Budgeting' | 'Investing' | 'Income';
}

export interface AIGoalPlan {
    feasibilitySummary: string;
    monthlyContribution: number;
    steps: AIGoalPlanStep[];
}

export interface AIAgent {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'error';
    specialization: 'Risk' | 'Compliance' | 'FX' | 'Ledgering' | 'Liquidity';
    traffic: number; // simulated requests per second
}