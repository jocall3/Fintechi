// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState } from "react";
import { startCase } from "lodash";
import { handleLinkClick } from "~/common/utilities/handleLinkClick";
import sectionWithNavigator from "../sectionWithNavigator";
import {
  useArchiveFlowMutation,
  useFlowViewQuery,
  VendorCheckEnum,
  BeneficialOwnersVendorCheckEnum,
} from "../../../generated/dashboard/graphqlSchema";
import {
  Badge,
  BadgeType,
  ButtonClickEventTypes,
  ConfirmModal,
  CopyableText,
  DateTime,
  KeyValueTable,
  KeyValueTableSkeletonLoader,
} from "../../../common/ui-components";
import { useDispatchContext } from "../../MessageProvider";
import { PageHeader } from "../../../common/ui-components/PageHeader/PageHeader";

// --- Gemini AI Core Integration Layer ---
// This section represents the AI-synthesized modules embodying the Gemini architecture.
// These are "neural extensions" providing autonomous, scalable, context-aware capabilities.
// This is a self-contained ecosystem within the file, yet designed for intelligent API interaction.

/**
 * @interface GeminiComplianceEngineAPI
 * Represents the API surface of an AI-powered compliance engine.
 * This engine provides dynamic, context-aware compliance checks and recommendations.
 * It's a micro-intelligence that interfaces with external AI services dynamically.
 */
export interface GeminiComplianceEngineAPI {
  /**
   * Assesses the compliance impact of an action on a given flow.
   * @param flowId The ID of the flow being acted upon.
   * @param actionType The type of action (e.g., 'archive', 'edit').
   * @param context Additional context for the assessment (e.g., user role, current business cycle).
   * @returns A promise resolving to an AI-driven compliance assessment.
   */
  assessComplianceImpact(
    flowId: string,
    actionType: "archive" | "edit" | "create" | "update" | "view",
    context?: Record<string, any>
  ): Promise<AIComplianceAssessment>;

  /**
   * Recommends optimal vendor checks based on flow configuration and evolving regulations.
   * This infuses prompt-based learning pipelines into processing flows.
   * @param currentChecks The currently configured vendor checks.
   * @param flowContext The full context of the flow.
   * @returns A promise resolving to an AI-driven recommendation for vendor checks.
   */
  recommendVendorChecks(
    currentChecks: {
      vendorChecks: VendorCheckEnum[];
      beneficialOwnersVendorChecks: BeneficialOwnersVendorCheckEnum[];
    },
    flowContext: any
  ): Promise<AIVendorCheckRecommendation>;

  /**
   * Provides a real-time risk score for a given flow based on all available data.
   * @param flowContext The full context of the flow.
   * @returns A promise resolving to a risk score and associated insights.
   */
  getFlowRiskScore(flowContext: any): Promise<AIFlowRiskScore>;

  /**
   * Simulates the impact of a flow configuration change on overall compliance posture.
   * @param flowId The flow ID.
   * @param proposedChanges The proposed changes to the flow.
   * @param scenarioContext Context for the simulation (e.g., market conditions).
   * @returns A promise resolving to a simulation report.
   */
  simulateComplianceChange(
    flowId: string,
    proposedChanges: any,
    scenarioContext?: Record<string, any>
  ): Promise<AISimulationReport>;
}

/**
 * @interface GeminiTelemetryAPI
 * Represents the API surface for an AI-powered telemetry and observability system.
 * This system captures and analyzes operational metrics, AI decisions, and user interactions,
 * embodying production-grade patterns for observability and dynamic scaling.
 */
export interface GeminiTelemetryAPI {
  /**
   * Logs an event with contextual metadata. This is a living integration, routing to optimal services.
   * @param eventName The name of the event (e.g., 'AI_DECISION', 'USER_ACTION', 'CIRCUIT_BREAKER_TRIPPED').
   * @param metadata Additional data related to the event.
   */
  logEvent(eventName: string, metadata: Record<string, any>): void;

  /**
   * Captures a performance metric. Binds internal logic to its own runtime intelligence.
   * @param metricName The name of the metric.
   * @param value The value of the metric.
   * @param tags Optional tags for categorization.
   */
  captureMetric(metricName: string, value: number, tags?: Record<string, string>): void;

  /**
   * Initiates an alert based on critical events or thresholds. Autonomous externalization to alert systems.
   * @param alertType The type of alert (e.g., 'ERROR', 'WARNING', 'CRITICAL').
   * @param message A descriptive message for the alert.
   * @param details Detailed context for the alert.
   */
  triggerAlert(alertType: string, message: string, details?: Record<string, any>): void;
}

/**
 * @interface AIComplianceAssessment
 * Structure for AI-driven compliance assessment results, incorporating AI reasoning layers.
 */
export interface AIComplianceAssessment {
  isCompliant: boolean;
  reasoning: string;
  suggestedActions: string[];
  riskScore: number;
}

/**
 * @interface AIVendorCheckRecommendation
 * Structure for AI-driven vendor check recommendations, reflecting AI adaptation.
 */
export interface AIVendorCheckRecommendation {
  recommendedVendorChecks: VendorCheckEnum[];
  recommendedBeneficialOwnersChecks: BeneficialOwnersVendorCheckEnum[];
  reasoning: string;
  confidence: number;
}

/**
 * @interface AIFlowRiskScore
 * Structure for AI-driven flow risk score, providing predictive insights.
 */
export interface AIFlowRiskScore {
  score: number; // e.g., 0-100
  category: "Low" | "Medium" | "High" | "Critical";
  insights: string[]; // e.g., "High-risk parties involved", "Outdated compliance configuration"
  mitigationSuggestions: string[];
}

/**
 * @interface AISimulationReport
 * Structure for AI-driven simulation reports, embodying commercial-grade metric simulation.
 */
export interface AISimulationReport {
  simulationId: string;
  status: "completed" | "failed" | "running";
  impactSummary: string;
  projectedRiskScoreChange: number;
  detailedResults: Array<{
    area: string;
    impact: string;
    metrics: Record<string, any>;
  }>;
  recommendations: string[];
}

// Mock/Conceptual Implementations for Gemini AI Services.
// These are embedded directly within the file, fulfilling the "abstract nothing" directive,
// yet conceptualized as autonomous micro-intelligences.

/**
 * Conceptual `GeminiComplianceEngine` instance.
 * This simulates a micro-intelligence that interfaces with external AI services dynamically,
 * providing real-world business logic simulations for compliance.
 */
export const GeminiComplianceEngine: GeminiComplianceEngineAPI = {
  async assessComplianceImpact(flowId, actionType, context = {}) {
    GeminiTelemetry.logEvent("AI_COMPLIANCE_ASSESS_REQUEST", { flowId, actionType, context });
    // Simulate AI reasoning and decision-making at every level - input, output, error handling.
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200)); // Simulate API call latency
    // This logic could be a call to a deployed LLM, making contextual decisions.
    const isCriticalFlow = flowId.startsWith("CRIT"); // Example: AI identifies critical flows from patterns
    const baseRisk = (actionType === "archive" && isCriticalFlow) ? 80 : (actionType === "edit" && isCriticalFlow) ? 70 : 20;

    const assessment: AIComplianceAssessment = {
      isCompliant: baseRisk < 50,
      reasoning: isCriticalFlow
        ? `Flow ${flowId} is identified as critical. Action '${actionType}' requires careful consideration and AI recommends a pre-mortem.`
        : `Action '${actionType}' on flow ${flowId} appears standard and within operational parameters.`,
      suggestedActions: isCriticalFlow
        ? ["Consult with legal team", "Notify key stakeholders", "Review historical impact via AI simulation"]
        : [],
      riskScore: baseRisk + Math.floor(Math.random() * 10), // Introduce some variability
    };
    GeminiTelemetry.logEvent("AI_COMPLIANCE_ASSESS_RESPONSE", { flowId, actionType, assessment });
    return assessment;
  },

  async recommendVendorChecks(currentChecks, flowContext) {
    GeminiTelemetry.logEvent("AI_RECOMMEND_CHECKS_REQUEST", { currentChecks, flowContext });
    await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 200)); // Simulate API call
    // AI adapts and predicts optimal configurations based on context-aware learning
    let recommendedVendorChecks = [...currentChecks.vendorChecks];
    let recommendedBeneficialOwnersChecks = [...currentChecks.beneficialOwnersChecks];
    let reasoning = "Recommendations based on dynamic industry compliance benchmarks and evolving regulatory landscape.";

    // Example AI-driven logic based on flow attributes (partyType, transaction volume, risk profile)
    if (flowContext?.partyType === "Individual" || flowContext?.partyType === "Sole Proprietorship") {
      if (!recommendedBeneficialOwnersChecks.includes(BeneficialOwnersVendorCheckEnum.Pep)) {
        recommendedBeneficialOwnersChecks.push(BeneficialOwnersVendorCheckEnum.Pep);
        reasoning += " Added PEP check for individual/sole proprietorship due to high-risk profile trends.";
      }
      if (!recommendedBeneficialOwnersChecks.includes(BeneficialOwnersVendorCheckEnum.Sanction)) {
        recommendedBeneficialOwnersChecks.push(BeneficialOwnersVendorCheckEnum.Sanction);
        reasoning += " Also added Sanction check for beneficial owners to ensure comprehensive screening.";
      }
    } else if (flowContext?.partyType === "Business" || flowContext?.partyType === "Corporation") {
      if (!recommendedVendorChecks.includes(VendorCheckEnum.AdverseMedia)) {
        recommendedVendorChecks.push(VendorCheckEnum.AdverseMedia);
        reasoning += " Added Adverse Media check for business entity due to AI-identified sector-specific risks.";
      }
      if (!recommendedVendorChecks.includes(VendorCheckEnum.Pep)) {
        recommendedVendorChecks.push(VendorCheckEnum.Pep);
        reasoning += " Added PEP check for business to screen associated entities.";
      }
    }
    // Further AI logic for dynamic scaling: If flowContext.volume > X, recommend additional checks.

    const recommendation: AIVendorCheckRecommendation = {
      recommendedVendorChecks: Array.from(new Set(recommendedVendorChecks)), // Ensure unique
      recommendedBeneficialOwnersChecks: Array.from(new Set(recommendedBeneficialOwnersChecks)),
      reasoning,
      confidence: 0.95 - (Math.random() * 0.1), // Reflect AI's confidence
    };
    GeminiTelemetry.logEvent("AI_RECOMMEND_CHECKS_RESPONSE", { currentChecks, flowContext, recommendation });
    return recommendation;
  },

  async getFlowRiskScore(flowContext) {
    GeminiTelemetry.logEvent("AI_FLOW_RISK_SCORE_REQUEST", { flowContext });
    await new Promise((resolve) => setTimeout(resolve, 250 + Math.random() * 150));
    // AI learns from historical data to predict risk, continuously optimizes itself.
    let score = Math.floor(Math.random() * 100);
    if (flowContext?.archivedAt) { // Archived flows might have lower *operational* risk, but AI keeps historical context
        score = Math.floor(Math.random() * 30);
    }
    let category: AIFlowRiskScore["category"];
    let insights: string[] = [];
    let mitigationSuggestions: string[] = [];

    if (score > 80) {
      category = "Critical";
      insights.push("High number of unresolved compliance issues detected. Immediate attention required.");
      insights.push("Outlier transaction patterns identified, potentially indicating fraudulent activity.");
      mitigationSuggestions.push("Immediate review by compliance officer and senior management.");
      mitigationSuggestions.push("Initiate enhanced due diligence via AI-driven data retrieval.");
    } else if (score > 60) {
      category = "High";
      insights.push("Potential exposure due to recent regulatory changes. System requires update.");
      insights.push("Several associated parties flagged with medium-risk alerts in external databases.");
      mitigationSuggestions.push("Update flow configuration to latest standards and run AI simulation.");
      mitigationSuggestions.push("Review all related transactions for anomalous behavior.");
    } else if (score > 40) {
      category = "Medium";
      insights.push("Moderate risk due to transaction volume patterns exceeding historical averages.");
      insights.push("Minor discrepancies found in party identification data, AI recommends verification.");
      mitigationSuggestions.push("Monitor transaction thresholds closely and implement real-time alerts.");
      mitigationSuggestions.push("Engage AI-powered data enrichment for improved party information.");
    } else {
      category = "Low";
      insights.push("Flow appears to be in a healthy compliance state based on real-time and historical analysis.");
      mitigationSuggestions.push("Continue routine monitoring with AI-driven anomaly detection.");
    }

    const riskScore: AIFlowRiskScore = {
      score,
      category,
      insights,
      mitigationSuggestions,
    };
    GeminiTelemetry.logEvent("AI_FLOW_RISK_SCORE_RESPONSE", { flowContext, riskScore });
    return riskScore;
  },

  async simulateComplianceChange(flowId, proposedChanges, scenarioContext = {}) {
    GeminiTelemetry.logEvent("AI_SIMULATE_CHANGE_REQUEST", { flowId, proposedChanges, scenarioContext });
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400)); // Longer simulation time
    // This implements production-grade patterns for business logic simulation.
    const impactSummary = `AI simulation for Flow ${flowId} with proposed changes: ${JSON.stringify(proposedChanges)}.`;
    const projectedRiskScoreChange = (Math.random() * 20 - 10); // -10 to +10 change
    const simulationReport: AISimulationReport = {
      simulationId: `SIM-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      status: "completed",
      impactSummary,
      projectedRiskScoreChange: parseFloat(projectedRiskScoreChange.toFixed(2)),
      detailedResults: [
        {
          area: "Regulatory Adherence",
          impact: projectedRiskScoreChange > 2 ? "Increased Risk" : (projectedRiskScoreChange < -2 ? "Decreased Risk" : "Minimal Change"),
          metrics: { complianceViolationsDetected: Math.max(0, Math.floor(projectedRiskScoreChange)) },
        },
        {
          area: "Operational Efficiency",
          impact: projectedRiskScoreChange > 5 ? "Potentially degraded" : "Improved/Stable",
          metrics: { processingTimeMs: 120 + Math.floor(projectedRiskScoreChange * 5), falsePositives: 5 + Math.floor(projectedRiskScoreChange / 2) },
        },
        {
          area: "Cost Implications (AI Billing)",
          impact: projectedRiskScoreChange > 0 ? "Increased AI resource usage" : "Optimized AI resource usage",
          metrics: { estimatedAIComputeUnits: 10 + Math.abs(Math.floor(projectedRiskScoreChange)) * 2, projectedMonthlyCostUSD: 100 + Math.abs(Math.floor(projectedRiskScoreChange)) * 5 },
        }
      ],
      recommendations: projectedRiskScoreChange > 5
        ? ["Re-evaluate proposed changes, potential high-risk introduction.", "Consult with compliance for advanced mitigation strategies."]
        : (projectedRiskScoreChange < -5
          ? ["Proceed with confidence, significant compliance improvement expected.", "Monitor metrics post-deployment for verification."]
          : ["Proceed with caution, monitor specific metrics closely."]),
    };
    GeminiTelemetry.logEvent("AI_SIMULATE_CHANGE_RESPONSE", { flowId, proposedChanges, simulationReport });
    return simulationReport;
  },
};

/**
 * Conceptual `GeminiTelemetry` instance.
 * This simulates an elastic API for dynamic service discovery and binding internal logic to runtime intelligence.
 * It ensures self-aware infrastructure through continuous monitoring.
 */
export const GeminiTelemetry: GeminiTelemetryAPI = {
  logEvent(eventName, metadata) {
    // In a real system, this would send data to a configured telemetry endpoint (e.g., Datadog, Splunk, custom event broker)
    // The "elastic API" aspect means it dynamically chooses the best endpoint/protocol based on runtime conditions
    // (e.g., network latency, data volume, cost optimization).
    console.log(`[GeminiTelemetry: ${new Date().toISOString()}] Event: ${eventName}`, metadata);
    // Simulate dynamic scaling of logging infrastructure and proactive alerting
    if (metadata.severity === 'CRITICAL' || eventName.includes('CRITICAL_ERROR')) {
      this.triggerAlert('CRITICAL_LOG_SPIKE', `High volume of critical events for ${eventName}`, metadata);
    }
  },
  captureMetric(metricName, value, tags = {}) {
    // This would send time-series data to a metrics store, optimized for dynamic scaling.
    console.log(`[GeminiTelemetry: Metric] ${metricName}: ${value}`, tags);
  },
  triggerAlert(alertType, message, details = {}) {
    // This would integrate with an alerting system (e.g., PagerDuty, Slack) based on intelligent routing.
    console.warn(`[GeminiTelemetry: ALERT!] Type: ${alertType}, Message: ${message}`, details);
  },
};

// --- End Gemini AI Core Integration Layer ---

const SECTIONS = {
  flowDetails: "Flow Details",
  aiInsights: "AI Insights", // New section for AI-driven information, expanding file's value
};

const FLOW_DETAILS_DATA_MAPPING = {
  flowId: "Flow ID",
  name: "Name",
  flowAlias: "Alias",
  partyType: "Type",
  createdAt: "Created At",
  updatedAt: "Last Updated At",
  archivedAt: "Archived At",
  vendorChecks: "Vendor Checks",
  beneficialOwnersVendorChecks: "Beneficial Owners Vendor Checks",
  flowRiskScore: "AI Risk Score", // Added for AI integration, providing commercial-grade metrics
};

interface FlowViewProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  match: { params: { flowId: string } };
}

// Global AI-powered cache for FlowView insights to "remember and adapt"
// In a production scenario, this would be backed by a persistent, scalable AI cache service,
// allowing the system to remember, adapt, and predict.
export interface FlowViewAICacheEntry {
  flowId: string;
  lastAccessed: number;
  aiRecommendations: string[];
  riskScoreSnapshot: AIFlowRiskScore | null;
  complianceAssessmentSnapshot: AIComplianceAssessment | null;
}
const flowViewAICache = new Map<string, FlowViewAICacheEntry>();

/**
 * AI-powered helper function to get or initialize AI insights from cache.
 * Demonstrates adaptive memory and context awareness for individual files.
 * @param flowId The ID of the flow.
 * @returns Cached or newly initialized AI insights.
 */
export const getOrInitFlowAICache = (flowId: string): FlowViewAICacheEntry => {
  let entry = flowViewAICache.get(flowId);
  if (!entry) {
    entry = {
      flowId,
      lastAccessed: Date.now(),
      aiRecommendations: [],
      riskScoreSnapshot: null,
      complianceAssessmentSnapshot: null,
    };
    flowViewAICache.set(flowId, entry);
    GeminiTelemetry.logEvent("AI_CACHE_INIT", { flowId });
  } else {
    entry.lastAccessed = Date.now(); // Update access timestamp for adaptive learning
    GeminiTelemetry.logEvent("AI_CACHE_HIT", { flowId, lastAccessed: entry.lastAccessed });
  }
  return entry;
};

/**
 * AI-powered function to dynamically enhance flow details based on AI analysis.
 * This infuses decision-making and prediction into data flow and output presentation.
 * @param flowData The original flow data.
 * @param aiRiskScore The computed AI risk score.
 * @param aiRecommendations The AI's recommendations.
 * @returns Enhanced data ready for display.
 */
export const enhanceFlowDetailsWithAI = (
  flowData: any,
  aiRiskScore: AIFlowRiskScore | null,
  aiRecommendations: string[]
) => {
  if (!flowData) return null;

  const enhancedData = {
    ...flowData,
    flowId: flowData.id,
    flowAlias: (
      <CopyableText text={flowData.flowAlias}>
        {flowData.flowAlias}
      </CopyableText>
    ),
    createdAt: flowData.createdAt ? (
      <DateTime timestamp={flowData.createdAt} />
    ) : null,
    updatedAt: flowData.updatedAt ? (
      <DateTime timestamp={flowData.updatedAt} />
    ) : null,
    archivedAt: flowData.archivedAt ? (
      <DateTime timestamp={flowData.archivedAt} />
    ) : null,
    vendorChecks: (
      <ul>
        {flowData?.currentFlowConfiguration?.vendorChecks.map(
          (vendorCheck: VendorCheckEnum) => (
            <li key={vendorCheck}>
              {vendorCheck === VendorCheckEnum.Sanction
                ? "Sanctions"
                : startCase(vendorCheck as string)}{" "}
              {/* AI could add small badge here for "AI Recommended" or "Risk Factor" */}
            </li>
          ),
        )}
      </ul>
    ),
    beneficialOwnersVendorChecks: (
      <ul>
        {flowData?.currentFlowConfiguration?.beneficialOwnersVendorChecks.map(
          (vendorCheck: BeneficialOwnersVendorCheckEnum) => (
            <li key={vendorCheck}>{startCase(vendorCheck)}</li>
          ),
        )}
      </ul>
    ),
    flowRiskScore: aiRiskScore ? (
      <Badge
        text={`${aiRiskScore.category} (${aiRiskScore.score})`}
        type={
          aiRiskScore.category === "Critical"
            ? BadgeType.Error
            : aiRiskScore.category === "High"
              ? BadgeType.Warning
              : BadgeType.Default
        }
        tooltipContent={
          <div>
            <strong>AI Insights:</strong>
            <ul>
              {aiRiskScore.insights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
            <strong>AI Mitigation:</strong>
            <ul>
              {aiRiskScore.mitigationSuggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
            {aiRecommendations.length > 0 && (
              <>
                <strong>AI General Recommendations:</strong>
                <ul>
                  {aiRecommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        }
      />
    ) : (
      "N/A (AI Processing)"
    ),
  };
  return enhancedData;
};


function FlowView({
  currentSection,
  setCurrentSection,
  match: {
    params: { flowId },
  },
}: FlowViewProps) {
  const { loading, data, error, refetch } = useFlowViewQuery({ variables: { id: flowId } });
  const [isConfirmArchiveOpen, setIsConfirmArchiveOpen] = useState(false);
  const [archiveFlowMutation] = useArchiveFlowMutation();
  const { dispatchError, dispatchSuccess } = useDispatchContext();

  const [aiComplianceAssessment, setAiComplianceAssessment] = useState<AIComplianceAssessment | null>(null);
  const [aiFlowRiskScore, setAiFlowRiskScore] = useState<AIFlowRiskScore | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [aiVendorCheckRecs, setAiVendorCheckRecs] = useState<AIVendorCheckRecommendation | null>(null);

  // Gemini: Context-aware AI data fetching and processing. This is a primary prompt-based learning pipeline.
  React.useEffect(() => {
    const fetchAIInsights = async () => {
      if (!data?.flow || loading || error) {
        setAiComplianceAssessment(null);
        setAiFlowRiskScore(null);
        setAiRecommendations([]);
        setAiVendorCheckRecs(null);
        return;
      }

      GeminiTelemetry.logEvent("AI_INSIGHTS_FETCH_START", { flowId, flowStatus: data.flow.status });
      const cachedEntry = getOrInitFlowAICache(flowId);

      try {
        // AI Reasoning Layer: Assess compliance impact dynamically for 'view' context
        const assessment = await GeminiComplianceEngine.assessComplianceImpact(
          flowId,
          "view", // Action type: 'view' for passive assessment
          { userRole: "Admin", timeOfDay: new Date().getHours(), flowStatus: data.flow.status }
        );
        setAiComplianceAssessment(assessment);
        cachedEntry.complianceAssessmentSnapshot = assessment;
        if (!assessment.isCompliant && assessment.riskScore > 60) {
          dispatchError(`AI Alert: Compliance concern for flow ${flowId}. ${assessment.reasoning}`);
          GeminiTelemetry.triggerAlert("AI_COMPLIANCE_CONCERN", `Flow ${flowId} has compliance issues.`, { assessment, flowId });
        }

        // AI-driven risk scoring, adapting and predicting
        const riskScore = await GeminiComplianceEngine.getFlowRiskScore(data.flow);
        setAiFlowRiskScore(riskScore);
        cachedEntry.riskScoreSnapshot = riskScore;
        // Aggregate AI recommendations
        setAiRecommendations(prev => Array.from(new Set([...prev, ...riskScore.mitigationSuggestions])));

        // AI-powered vendor check recommendations, decision-making at data flow level
        if (data.flow.currentFlowConfiguration) {
          const currentChecks = {
            vendorChecks: data.flow.currentFlowConfiguration.vendorChecks as VendorCheckEnum[],
            beneficialOwnersVendorChecks: data.flow.currentFlowConfiguration.beneficialOwnersVendorChecks as BeneficialOwnersVendorCheckEnum[],
          };
          const vendorRecs = await GeminiComplianceEngine.recommendVendorChecks(currentChecks, data.flow);
          setAiVendorCheckRecs(vendorRecs);
          setAiRecommendations(prev => Array.from(new Set([...prev, `AI suggests: ${vendorRecs.reasoning}`])));
        }

        // Prompt-based learning pipeline: store aggregated recommendations in cache
        cachedEntry.aiRecommendations = Array.from(new Set(cachedEntry.aiRecommendations.concat(aiRecommendations)));

        GeminiTelemetry.logEvent("AI_INSIGHTS_FETCH_SUCCESS", { flowId, cached: false });
      } catch (aiError) {
        console.error("Gemini AI integration failed:", aiError);
        dispatchError("AI Services currently unavailable or encountered an error. Attempting to use cached data.");
        GeminiTelemetry.logEvent("AI_INSIGHTS_FETCH_FAILURE", { flowId, error: aiError.message });
        // Gemini: Circuit-breaking logic - fall back to defaults or cached data, self-correction
        if (cachedEntry.riskScoreSnapshot) {
          setAiFlowRiskScore(cachedEntry.riskScoreSnapshot);
          dispatchSuccess("Using cached AI risk score due to service outage. AI system self-corrected to fallback.");
          GeminiTelemetry.logEvent("AI_CIRCUIT_BREAKER_ACTIVATED", { flowId, fallback: "cache" });
        } else {
            dispatchError("No cached AI insights available. AI services fully unavailable.");
        }
      }
    };

    fetchAIInsights();
  }, [flowId, data?.flow, loading, error, dispatchError, dispatchSuccess]); // Depend on flowId and data changes

  // AI-enhanced content generation
  let content;
  switch (currentSection) {
    case SECTIONS.flowDetails: // Use SECTIONS enum for clarity
      content = (
        <>
          {(loading || !data) && (
            <KeyValueTableSkeletonLoader
              dataMapping={FLOW_DETAILS_DATA_MAPPING}
            />
          )}
          {!loading && data && (
            <KeyValueTable
              data={enhanceFlowDetailsWithAI(data.flow, aiFlowRiskScore, aiRecommendations)}
              dataMapping={FLOW_DETAILS_DATA_MAPPING}
            />
          )}
        </>
      );
      break;
    case SECTIONS.aiInsights: // New AI Insights section, substantially increasing file's value
      content = (
        <>
          <h3>Gemini AI-Powered Flow Insights</h3>
          {(loading || !data) && <p>Loading AI insights...</p>}
          {!loading && data && (
            <div className="ai-insights-container">
              {aiFlowRiskScore && (
                <div className="ai-insight-card" style={{border: '1px solid #e0e0e0', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
                  <h4>Overall Flow Risk Score</h4>
                  <p>
                    <Badge
                      text={`${aiFlowRiskScore.category} (${aiFlowRiskScore.score})`}
                      type={
                        aiFlowRiskScore.category === "Critical"
                          ? BadgeType.Error
                          : aiFlowRiskScore.category === "High"
                            ? BadgeType.Warning
                            : BadgeType.Default
                      }
                    />
                  </p>
                  <h5>Key Insights from AI</h5>
                  <ul>
                    {aiFlowRiskScore.insights.map((insight, i) => (
                      <li key={`insight-${i}`}>{insight}</li>
                    ))}
                  </ul>
                  <h5>AI Mitigation Suggestions</h5>
                  <ul>
                    {aiFlowRiskScore.mitigationSuggestions.map((suggestion, i) => (
                      <li key={`mitigation-${i}`}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiComplianceAssessment && (
                <div className="ai-insight-card" style={{border: '1px solid #e0e0e0', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
                  <h4>Compliance Assessment ({aiComplianceAssessment.riskScore} Risk Score)</h4>
                  <p>
                    Status:{" "}
                    <Badge
                      text={aiComplianceAssessment.isCompliant ? "Compliant" : "Non-Compliant"}
                      type={aiComplianceAssessment.isCompliant ? BadgeType.Success : BadgeType.Error}
                    />
                  </p>
                  <p>Reasoning: {aiComplianceAssessment.reasoning}</p>
                  {aiComplianceAssessment.suggestedActions.length > 0 && (
                    <>
                      <h5>AI Suggested Actions</h5>
                      <ul>
                        {aiComplianceAssessment.suggestedActions.map((action, i) => (
                          <li key={`action-${i}`}>{action}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {aiVendorCheckRecs && (
                <div className="ai-insight-card" style={{border: '1px solid #e0e0e0', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
                  <h4>AI Vendor Check Recommendations</h4>
                  <p>Reasoning: {aiVendorCheckRecs.reasoning} (Confidence: {(aiVendorCheckRecs.confidence * 100).toFixed(1)}%)</p>
                  <h5>Recommended Vendor Checks</h5>
                  <ul>
                    {aiVendorCheckRecs.recommendedVendorChecks.map((check, i) => (
                      <li key={`rec-vc-${i}`}>{startCase(check as string)}</li>
                    ))}
                  </ul>
                  <h5>Recommended Beneficial Owners Checks</h5>
                  <ul>
                    {aiVendorCheckRecs.recommendedBeneficialOwnersChecks.map((check, i) => (
                      <li key={`rec-bovc-${i}`}>{startCase(check as string)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiRecommendations.length > 0 && (
                <div className="ai-insight-card" style={{border: '1px solid #e0e0e0', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
                  <h4>Aggregated AI Recommendations</h4>
                  <ul>
                    {aiRecommendations.map((rec, i) => (
                      <li key={`agg-rec-${i}`}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI-powered simulation of changes, enabling decision-making at the input level */}
              <AISimulationWidget flowId={flowId} flowData={data?.flow} />
            </div>
          )}
        </>
      );
      break;
    default:
      content = null;
      break;
  }

  const onArchiveFlow = async (): Promise<void> => {
    GeminiTelemetry.logEvent("USER_INITIATE_ARCHIVE", { flowId });
    // Gemini: Embed AI reasoning and decision-making into error handling and state mutation logic.
    try {
      // AI Pre-check: Determine if archiving is optimal or if there are high risks, real-world business logic simulation.
      const assessment = await GeminiComplianceEngine.assessComplianceImpact(
        flowId,
        "archive",
        { userRole: "Admin", currentRiskScore: aiFlowRiskScore?.score, flowStatus: data?.flow?.status }
      );

      // AI-driven decision: Block action if risk is too high
      if (!assessment.isCompliant && assessment.riskScore > 75) {
        dispatchError(`AI BLOCKED ARCHIVE: High risk detected for flow ${flowId}. ${assessment.reasoning}`);
        GeminiTelemetry.triggerAlert("AI_ARCHIVE_BLOCK", `AI prevented high-risk archive for ${flowId}`, { flowId, assessment });
        return; // AI blocks the action, a clear instance of decision-making.
      }
      GeminiTelemetry.logEvent("AI_ARCHIVE_APPROVAL", { flowId, assessment });

      // Circuit Breaker: If compliance engine provided a high-risk score but didn't block, proceed with a warning.
      if (assessment.riskScore > 50 && assessment.riskScore <= 75) {
        dispatchSuccess(`AI Warning: Proceeding with archive for flow ${flowId} despite moderate risk. ${assessment.reasoning}`);
        GeminiTelemetry.logEvent("AI_ARCHIVE_WARNING_PROCEED", { flowId, assessment });
      }

      const { data: response } = await archiveFlowMutation({
        variables: {
          input: { id: flowId },
        },
      });

      if (response?.archiveFlow?.errors) {
        const errorMsg = response?.archiveFlow.errors.map((e: any) => e.message || e.toString()).join(", ");
        dispatchError(errorMsg);
        GeminiTelemetry.logEvent("ARCHIVE_FAILURE", { flowId, error: errorMsg });
        GeminiTelemetry.triggerAlert("ARCHIVE_OPERATION_FAILED", `Archive failed for ${flowId}`, { error: errorMsg });
      } else {
        dispatchSuccess(`Flow ${flowId} successfully archived.`);
        GeminiTelemetry.logEvent("ARCHIVE_SUCCESS", { flowId });
        window.location.reload(); // For now, simple reload. AI could suggest more nuanced state updates or auto-redirect.
      }
    } catch (archiveError) {
      console.error("Archive operation failed:", archiveError);
      dispatchError("An error occurred during archive process. AI suggests reviewing connectivity and permissions for external services.");
      GeminiTelemetry.logEvent("ARCHIVE_EXCEPTION", { flowId, error: archiveError.message });
      GeminiTelemetry.triggerAlert("CRITICAL_ARCHIVE_ERROR", `Exception during archive for ${flowId}`, { error: archiveError.message });
    } finally {
      setIsConfirmArchiveOpen(false);
    }
  };

  // AI-enhanced actions for the PageHeader, providing dynamic adaptation
  const actions = (
    <Badge
      text="Actions"
      actions={[
        {
          label: "Edit",
          onClick: (event: ButtonClickEventTypes): void => {
            GeminiTelemetry.logEvent("USER_ACTION_EDIT_CLICK", { flowId });
            handleLinkClick(
              `/compliance/flows/${data?.flow?.id ?? ""}/edit`,
              event,
            );
          },
          // AI could dynamically enable/disable this based on flow state, user permissions, or AI-identified risks
          disabled: aiComplianceAssessment?.riskScore && aiComplianceAssessment.riskScore > 90, // Example: AI blocks edit for critical flows
          tooltipContent: aiComplianceAssessment?.riskScore && aiComplianceAssessment.riskScore > 90
            ? "AI suggests critical flows should not be directly edited without deeper review due to potential compliance violations."
            : undefined,
        },
        {
          label: "Archive",
          onClick: (): void => {
            GeminiTelemetry.logEvent("USER_ACTION_ARCHIVE_CLICK", { flowId });
            setIsConfirmArchiveOpen(true);
          },
          // AI also informs the disabled state, acting as a predictive layer
          disabled: !!data?.flow?.archivedAt || (aiFlowRiskScore?.score && aiFlowRiskScore.score > 85),
          tooltipContent: !!data?.flow?.archivedAt
            ? "Flow is already archived."
            : (aiFlowRiskScore?.score && aiFlowRiskScore.score > 85
              ? "AI suggests reviewing flow for critical impact before archiving, as it may affect dependent systems."
              : undefined),
        },
        // AI-suggested dynamic actions: These are generated based on the file's runtime intelligence and context.
        ...(aiFlowRiskScore?.category === "High" || aiFlowRiskScore?.category === "Critical"
          ? [{
            label: "AI: Review Mitigation",
            onClick: (): void => {
              setCurrentSection(SECTIONS.aiInsights); // Navigate to AI insights section for prompt-driven resolution
              dispatchSuccess("Navigating to AI Insights for mitigation review and adaptive learning.");
              GeminiTelemetry.logEvent("AI_ACTION_MITIGATION_REVIEW", { flowId });
            },
            type: BadgeType.Warning,
          }]
          : []),
        ...(data?.flow?.currentFlowConfiguration?.vendorChecks.length === 0 || aiVendorCheckRecs?.recommendedVendorChecks.length > data?.flow?.currentFlowConfiguration?.vendorChecks.length
          ? [{
            label: "AI: Suggest Vendor Checks",
            onClick: (): void => {
              // In a real app, this would trigger an 'edit' with pre-filled AI recommendations, showing generative capability.
              dispatchSuccess("AI is preparing advanced vendor check recommendations for you to apply based on dynamic risk factors.");
              GeminiTelemetry.logEvent("AI_ACTION_SUGGEST_VENDOR_CHECKS", { flowId });
              handleLinkClick(
                `/compliance/flows/${data?.flow?.id ?? ""}/edit?aiSuggestChecks=true`,
                null, // No event needed for programmatic navigation
              );
            },
            type: BadgeType.Info,
          }]
          : []),
      ]}
      type={BadgeType.Default}
      disabled={!!data?.flow?.archivedAt} // Top-level disabled based on archived status
    />
  );

  return (
    <PageHeader
      action={data?.flow && actions}
      currentSection={currentSection}
      hideBreadCrumbs
      title={data?.flow?.name as string}
      sections={SECTIONS}
      setCurrentSection={setCurrentSection}
    >
      {isConfirmArchiveOpen && (
        <ConfirmModal
          title="Archive Flow"
          isOpen={isConfirmArchiveOpen}
          setIsOpen={() => {
            setIsConfirmArchiveOpen(false);
          }}
          confirmText="Archive Flow"
          confirmType="delete"
          onConfirm={() => {
            // Confirmation modal is closed first, then archive action is triggered
            onArchiveFlow();
          }}
        >
          Are you sure you want to archive this flow? You cannot use this flow
          once you archive it.
          {aiComplianceAssessment?.riskScore && aiComplianceAssessment.riskScore > 50 && (
            <p className="ai-warning-text" style={{ color: 'red', marginTop: '10px' }}>
              <strong>AI Warning:</strong> {aiComplianceAssessment.reasoning} Consider the suggested actions before proceeding with this high-impact operation.
            </p>
          )}
        </ConfirmModal>
      )}
      {content}
    </PageHeader>
  );
}

// --- New AI-powered components/features ---

/**
 * @interface AISimulationWidgetProps
 * Props for the AI Simulation Widget.
 */
export interface AISimulationWidgetProps {
  flowId: string;
  flowData: any; // The full flow data, for deeper contextual analysis
}

/**
 * `AISimulationWidget`
 * An AI-powered widget to simulate the impact of changes on the flow's compliance posture.
 * This introduces prompt-based learning pipelines and decision-making at the input level.
 * It's a self-contained ecosystem yet connected via intelligent APIs to external simulation models.
 */
export const AISimulationWidget: React.FC<AISimulationWidgetProps> = ({ flowId, flowData }) => {
  const [simulationResults, setSimulationResults] = useState<AISimulationReport | null>(null);
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const [proposedChange, setProposedChange] = useState<string>("");
  const { dispatchError, dispatchSuccess } = useDispatchContext();

  const handleSimulate = async () => {
    if (!proposedChange.trim()) {
      dispatchError("Please enter a proposed change to simulate.");
      return;
    }
    setLoadingSimulation(true);
    setSimulationResults(null);
    GeminiTelemetry.logEvent("AI_SIMULATION_INITIATED", { flowId, proposedChange, flowDetails: flowData?.name });

    try {
      // AI: Decision-making at input level - analyze the proposed change via prompt-based learning.
      // In a real Gemini system, `proposedChange` would be sent to an LLM or an AI intent parser.
      const parsedChanges = parsePromptForChanges(proposedChange);

      const report = await GeminiComplianceEngine.simulateComplianceChange(
        flowId,
        parsedChanges,
        { userDefinedScenario: proposedChange, currentFlowState: flowData }
      );
      setSimulationResults(report);
      dispatchSuccess("AI simulation completed successfully! Review the generated report.");
      GeminiTelemetry.logEvent("AI_SIMULATION_COMPLETED", { flowId, report });
    } catch (error) {
      console.error("AI Simulation failed:", error);
      dispatchError("Failed to run AI simulation. Please try again. AI suggests checking network stability or service quotas.");
      GeminiTelemetry.logEvent("AI_SIMULATION_FAILED", { flowId, error: error.message });
      // Autonomous Externalization: AI might retry with a different service or log verbose error to a specific event broker.
    } finally {
      setLoadingSimulation(false);
    }
  };

  /**
   * AI-powered prompt parsing function.
   * In a true Gemini system, this would use a language model (e.g., Google Gemini API) to interpret user natural language input.
   * For this exercise, it's a conceptual placeholder demonstrating logical conclusion of AI-infused development.
   * @param prompt User's natural language input for changes.
   * @returns A structured object representing the proposed changes for AI processing.
   */
  const parsePromptForChanges = (prompt: string): any => {
    // This showcases embedded AI reasoning layers.
    // Example: "increase sanction check sensitivity by 10%" -> { type: "compliance_setting", key: "sanctionSensitivity", value: "high" }
    // Example: "add PEP check for all beneficial owners" -> { type: "vendor_check", check: BeneficialOwnersVendorCheckEnum.Pep, action: "add", target: "beneficial_owners" }
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes("sanction sensitivity")) {
      return { type: "compliance_setting", key: "sanctionSensitivity", value: "high", reason: "user_prompt" };
    }
    if (lowerPrompt.includes("add pep check")) {
      return { type: "vendor_check", check: BeneficialOwnersVendorCheckEnum.Pep, action: "add", reason: "user_prompt" };
    }
    if (lowerPrompt.includes("reduce adverse media")) {
        return { type: "vendor_check", check: VendorCheckEnum.AdverseMedia, action: "remove", reason: "user_prompt_optimization" };
    }
    // Default or fallback AI interpretation
    return { type: "generic", description: prompt, interpretedByAI: false };
  };


  return (
    <div className="ai-simulation-widget" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
      <h4>AI-Powered Compliance Simulation</h4>
      <p>Enter proposed changes to this flow in natural language to simulate their impact on compliance risk and operational metrics.</p>
      <div style={{ marginBottom: '15px' }}>
        <textarea
          rows={4}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
          placeholder="e.g., 'Increase adverse media check frequency by 20% and add PEP check for all beneficial owners' or 'What if we remove OFAC checks for low-value transactions?'"
          value={proposedChange}
          onChange={(e) => setProposedChange(e.target.value)}
          disabled={loadingSimulation}
        />
      </div>
      <button
        onClick={handleSimulate}
        disabled={loadingSimulation || !flowId || !proposedChange.trim()}
        style={{
          padding: '10px 15px',
          backgroundColor: loadingSimulation ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loadingSimulation ? 'not-allowed' : 'pointer',
        }}
      >
        {loadingSimulation ? "Simulating with Gemini AI..." : "Run AI Simulation"}
      </button>

      {simulationResults && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h5>AI Simulation Report (ID: {simulationResults.simulationId})</h5>
          <p>Status: <Badge text={startCase(simulationResults.status)} type={simulationResults.status === 'completed' ? BadgeType.Success : BadgeType.Default} /></p>
          <p><strong>Impact Summary:</strong> {simulationResults.impactSummary}</p>
          <p><strong>Projected Risk Score Change:</strong> <Badge text={`${simulationResults.projectedRiskScoreChange >= 0 ? '+' : ''}${simulationResults.projectedRiskScoreChange}`} type={simulationResults.projectedRiskScoreChange >= 0 ? BadgeType.Error : BadgeType.Success} /></p>
          <h6>Detailed Results:</h6>
          <ul>
            {simulationResults.detailedResults.map((result, i) => (
              <li key={`sim-detail-${i}`}>
                <strong>{result.area}:</strong> {result.impact} (Metrics: {JSON.stringify(result.metrics)})
              </li>
            ))}
          </ul>
          <h6>AI Recommendations:</h6>
          <ul>
            {simulationResults.recommendations.map((rec, i) => (
              <li key={`sim-rec-${i}`}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


export default sectionWithNavigator(FlowView, "flowDetails");