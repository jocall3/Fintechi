// context/hooks/useAIFeatures.ts
import { useState } from 'react';
import { AIInsight, WeaverStage, QuantumWeaverState } from '../../types';

export const useAIFeatures = () => {
  const [weaverState, setWeaverState] = useState<QuantumWeaverState>({
    stage: WeaverStage.Pitch, businessPlan: '', feedback: '', questions: [], loanAmount: 0, coachingPlan: null, error: null,
  });
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);

  return {
    weaverState,
    setWeaverState,
    aiInsights,
    setAiInsights,
    isInsightsLoading,
    setIsInsightsLoading,
  };
};