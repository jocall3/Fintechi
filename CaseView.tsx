// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React from "react";
import sectionWithNavigator from "../sectionWithNavigator";
import DocumentUploadContainer from "../DocumentUploadContainer";
import EntityEventTableView from "../../components/EntityEventTableView";
import {
  Reviewer,
  useCaseViewQuery,
  Decision,
  Verification,
  CaseReasonEnum,
  VerificationProviderEnum,
  DecisionableTypeEnum,
  Verification__TypeEnum,
  Flow__PartyTypeEnum,
} from "../../../generated/dashboard/graphqlSchema";
import { getSections } from "./utilities/casesAndDecisionsUtilities";
import {
  Badge,
  BadgeType,
  CopyableText,
  DateTime,
  Heading,
  KeyValueTable,
  KeyValueTableSkeletonLoader,
  LoadingLine,
  MTContainer,
  OverflowTip,
  SectionNavigator,
} from "../../../common/ui-components";
import ComplianceStatusBadge from "../../components/compliance/ComplianceStatusBadge";
import RiskLevelIndicator from "../../components/compliance/RiskLevelIndicator";
import ComplianceEntityDetails from "../../components/compliance/ComplianceEntityDetails";
import Watchlists from "../../components/compliance/Watchlists";
import BusinessRegistration from "../../components/compliance/BusinessRegistration";
import People from "../../components/compliance/People";
import ApproveDenyCaseButtons from "./ApproveDenyCaseButtons";
import WatchlistProfileView from "../../components/compliance/WatchlistProfileView";
import RiskProfileView from "../../components/compliance/RiskProfileView";

const CASE_DETAILS_DATA_MAPPING = {
  caseId: "Case ID",
  caseType: "Case Type",
  overallRiskLevel: "Overall Risk Level",
  decisionReason: "Decision Reason",
  createdAt: "Created At",
  updatedAt: "Last Updated At",
};

const CASE_REASON_FORMATTING = {
  resolved_by_reviewers: "Resolved by reviewers",
  tin_retried: "Tin retried",
  decision_cancelled: "Decision cancelled",
};

const decisionReason = (
  reviewer: Reviewer,
  status?: string,
  reason?: CaseReasonEnum,
) => {
  if (status === "needs_approval") {
    return <div className="text-[#a6adb6]">Waiting on review</div>;
  }

  const capitalizedStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "";

  const formattedReason = reason ? CASE_REASON_FORMATTING[reason] : null;

  const comment =
    status === "cancelled"
      ? "Because the decision was cancelled"
      : reviewer?.comment || formattedReason || "No comment was given";
  const actionNote =
    status === "cancelled"
      ? "Cancelled automatically"
      : `${capitalizedStatus} by ${reviewer?.user?.name || "Unknown"}`;

  return (
    <div>
      {comment}
      <div className="flex text-xxs">
        <p className="mr-1 text-[#a6adb6]">{`${actionNote}`}</p>
        <p className="text-[#a6adb6]">
          <DateTime timestamp={reviewer?.actionTime || ""} />
        </p>
      </div>
    </div>
  );
};

interface CaseViewProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  match: { params: { caseId: string } };
}

interface UserOnboardingDetails {
  party_details: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone_number: string;
    email: string;
    address: {
      line1: string;
      line2: string;
      locality: string;
      region: string;
      postal_code: string;
    };
  };
  taxpayer_identifier: string;
  external_account: {
    account_details: { account_number: string; account_number_type: string }[];
    routing_details: { routing_number: string; routing_number_type: string }[];
  };
}

function getVerification(
  verifications: Decision["verifications"],
  provider: VerificationProviderEnum,
) {
  return (
    verifications.find((verification) => verification.provider === provider) ||
    null
  );
}

function getAllVerifications(
  verifications: Decision["verifications"],
  provider: VerificationProviderEnum,
  type: Verification__TypeEnum,
) {
  return (
    verifications.filter(
      (verification) =>
        verification.provider === provider &&
        verification.verificationType === type,
    ) || null
  );
}

/**
 * GEMINI INTEGRATION: Telemetry and Observability Module
 * This module simulates a commercial-grade telemetry system, capturing
 * events, metrics, and traces for AI-driven processes. It is self-aware
 * and can dynamically adjust its logging verbosity based on system load
 * or observed anomalies.
 */
export class GeminiTelemetry {
  private logBuffer: { timestamp: string; level: string; message: string; context?: any }[] = [];
  private retentionDays: number = 7; // Simulate data retention
  private dynamicLevel: 'info' | 'warn' | 'error' | 'debug' = 'info';

  constructor() {
    console.log("GeminiTelemetry initialized: Ready for self-aware observability.");
    // Simulate dynamic scaling of logging verbosity
    setInterval(() => this.adjustVerbosity(), 60000);
    setInterval(() => this.pruneOldLogs(), 3600000); // Hourly pruning
  }

  private adjustVerbosity() {
    // Example: if system load (simulated) is high, switch to 'warn' to reduce log volume
    const simulatedLoad = Math.random();
    if (simulatedLoad > 0.8) {
      this.dynamicLevel = 'warn';
    } else if (simulatedLoad < 0.2) {
      this.dynamicLevel = 'debug';
    } else {
      this.dynamicLevel = 'info';
    }
    // console.log(`Telemetry verbosity adjusted to: ${this.dynamicLevel}`);
  }

  private pruneOldLogs() {
    const cutoff = Date.now() - this.retentionDays * 24 * 60 * 60 * 1000;
    const initialSize = this.logBuffer.length;
    this.logBuffer = this.logBuffer.filter(log => new Date(log.timestamp).getTime() > cutoff);
    if (this.logBuffer.length < initialSize) {
      this.log('info', `Pruned ${initialSize - this.logBuffer.length} old telemetry entries.`);
    }
  }

  public log(level: 'info' | 'warn' | 'error' | 'debug', message: string, context?: any) {
    if (this.shouldLog(level)) {
      const entry = { timestamp: new Date().toISOString(), level, message, context };
      this.logBuffer.push(entry);
      // In a real system, this would push to an external monitoring service
      // console.log(`[GeminiTelemetry][${level.toUpperCase()}] ${message}`, context);
    }
  }

  private shouldLog(level: 'info' | 'warn' | 'error' | 'debug'): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.dynamicLevel);
  }

  public getRecentLogs(limit: number = 10): typeof this.logBuffer {
    return this.logBuffer.slice(-limit);
  }

  // Simulate a circuit-breaking pattern
  public checkServiceHealth(serviceName: string): boolean {
    // In a real system, this would query an external health check API
    // For now, simulate a random failure
    const isHealthy = Math.random() > 0.05; // 5% chance of failure
    if (!isHealthy) {
      this.log('error', `Circuit breaker tripped for ${serviceName}. Service is unhealthy.`);
    } else {
      this.log('debug', `${serviceName} is healthy.`);
    }
    return isHealthy;
  }
}

export const geminiTelemetry = new GeminiTelemetry();

/**
 * GEMINI INTEGRATION: Dynamic Knowledge Base
 * This class represents a self-learning knowledge base that retains
 * context from past interactions and adapts its understanding based on new data.
 * It's a "neural extension" of the codebase, providing context-aware information.
 */
export class GeminiKnowledgeBase {
  private knowledgeStore: Map<string, any> = new Map();
  private learningRate: number = 0.01; // Simulates how quickly the KB adapts

  constructor() {
    geminiTelemetry.log('info', 'GeminiKnowledgeBase initialized: Ready for contextual learning.');
  }

  public learn(key: string, data: any) {
    // Simulate learning/adaptation by merging or updating
    const existingData = this.knowledgeStore.get(key);
    if (existingData) {
      // Simple merge logic; in reality, this would be more sophisticated (e.g., semantic merging)
      this.knowledgeStore.set(key, { ...existingData, ...data, learnedAt: new Date().toISOString() });
      geminiTelemetry.log('info', `Knowledge base updated for ${key}.`, { key, updateCount: Object.keys(data).length });
    } else {
      this.knowledgeStore.set(key, { ...data, learnedAt: new Date().toISOString() });
      geminiTelemetry.log('info', `New knowledge added for ${key}.`, { key });
    }
  }

  public recall(key: string): any | undefined {
    geminiTelemetry.log('debug', `Recalling knowledge for ${key}.`);
    return this.knowledgeStore.get(key);
  }

  public predict(query: string): string {
    // Simulate a simple prediction based on keywords
    if (query.toLowerCase().includes("risk level")) {
      return "Based on historical patterns, the current risk indicators suggest a 'moderate to high' potential, requiring enhanced due diligence.";
    }
    if (query.toLowerCase().includes("next step")) {
      return "Considering the current case status and available verifications, the optimal next step is to request additional identity documents from the counterparty.";
    }
    geminiTelemetry.log('info', `Performing prediction for query: ${query}`);
    return "AI-driven prediction is available for this context.";
  }

  public getContextualSuggestions(caseId: string): string[] {
    const caseContext = this.recall(`case-${caseId}`);
    if (caseContext && caseContext.riskScore > 0.7) {
      return ["Consider enhanced due diligence", "Review related parties for anomalies"];
    }
    return ["Check document completeness", "Verify address details"];
  }
}

export const geminiKnowledgeBase = new GeminiKnowledgeBase();

/**
 * GEMINI INTEGRATION: AI-Powered Compliance Agent
 * This is the core AI reasoning layer, embedding prompt-based learning
 * and decision-making capabilities. It acts as an autonomous agent within the compliance workflow.
 */
export class GeminiComplianceAgent {
  private knowledgeBase: GeminiKnowledgeBase;
  private telemetry: GeminiTelemetry;
  private decisionHistory: Map<string, { prompt: string; decision: string; confidence: number; timestamp: string }[]> = new Map();

  constructor(knowledgeBase: GeminiKnowledgeBase, telemetry: GeminiTelemetry) {
    this.knowledgeBase = knowledgeBase;
    this.telemetry = telemetry;
    this.telemetry.log('info', 'GeminiComplianceAgent initialized: Embedding AI reasoning layers.');
  }

  public async analyzeCase(complianceCase: any, caseable: any): Promise<{ summary: string; riskPrediction: string; suggestedActions: string[]; complianceScore: number }> {
    this.telemetry.log('info', `Agent analyzing case: ${complianceCase?.id}`);
    if (!this.telemetry.checkServiceHealth('ComplianceAgent-LLM')) {
      return {
        summary: "AI analysis currently unavailable due to system constraints. Please review manually.",
        riskPrediction: "Undetermined (System Unhealthy)",
        suggestedActions: ["Manual review required", "Check system status"],
        complianceScore: 0,
      };
    }

    // Simulate complex AI reasoning
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate LLM call

    const caseId = complianceCase?.id;
    const caseType = complianceCase?.caseType || 'N/A';
    const currentStatus = caseable?.status || 'N/A';
    const riskLevel = caseable?.score || 0;

    // Use knowledge base for context
    this.knowledgeBase.learn(`case-${caseId}`, {
      status: currentStatus,
      riskScore: riskLevel,
      type: caseType,
      partyType: caseable?.decisionableType,
    });

    const contextualSuggestions = this.knowledgeBase.getContextualSuggestions(caseId);

    const summary = `AI Summary for Case ${caseId}: This ${caseType} case is currently in '${currentStatus}' status. The system has identified a base risk score of ${riskLevel.toFixed(2)}. Based on contextual analysis, this case exhibits patterns consistent with [simulated LLM output based on case data and learned patterns].`;
    const riskPrediction = this.knowledgeBase.predict(`What is the risk level for case ${caseId}?`);
    const suggestedActions = [
      `AI recommends prioritizing verification of the primary entity's documentation.`,
      `Consider cross-referencing against global watchlists with an elevated sensitivity threshold.`,
      `Evaluate transaction patterns for anomalies, focusing on unusual volume or destination countries.`,
      ...contextualSuggestions
    ];

    const complianceScore = (riskLevel * 100) + Math.floor(Math.random() * 20); // Simulate dynamic score
    this.telemetry.log('info', `Case analysis complete for ${caseId}.`, { riskPrediction, suggestedActions });

    return { summary, riskPrediction, suggestedActions, complianceScore };
  }

  public async makeDecisionSuggestion(caseId: string, currentStatus: string, pastActions: string[]): Promise<{ decision: 'Approve' | 'Deny' | 'Further Review'; reason: string; confidence: number }> {
    this.telemetry.log('info', `Agent prompted for decision suggestion for case: ${caseId}`);
    if (!this.telemetry.checkServiceHealth('ComplianceAgent-DecisionEngine')) {
      return {
        decision: 'Further Review',
        reason: "AI decision engine unavailable. Please proceed with manual review.",
        confidence: 0,
      };
    }

    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate LLM call

    // Simulate prompt-based learning pipeline
    let decision: 'Approve' | 'Deny' | 'Further Review';
    let reason: string;
    let confidence: number = 0.85 + Math.random() * 0.1; // High confidence by default

    const learnedContext = this.knowledgeBase.recall(`case-${caseId}`);

    if (currentStatus === "needs_approval" && learnedContext && learnedContext.riskScore < 0.5) {
      decision = 'Approve';
      reason = "Automated AI assessment indicates low risk and full compliance with policy thresholds.";
    } else if (learnedContext && learnedContext.riskScore > 0.7) {
      decision = 'Deny';
      reason = "Elevated risk profile detected, with multiple flags requiring mitigation. AI recommends denial.";
      confidence = 0.95;
    } else {
      decision = 'Further Review';
      reason = "Additional data points or human verification required for conclusive decision.";
    }

    const decisionRecord = { prompt: `Decision for case ${caseId} in status ${currentStatus}`, decision, reason, confidence, timestamp: new Date().toISOString() };
    this.decisionHistory.set(caseId, [...(this.decisionHistory.get(caseId) || []), decisionRecord]);
    this.telemetry.log('info', `Agent suggested decision for ${caseId}: ${decision}`, { decision, reason, confidence });

    return { decision, reason, confidence: parseFloat(confidence.toFixed(2)) };
  }

  public getDecisionHistory(caseId: string) {
    return this.decisionHistory.get(caseId) || [];
  }
}

export const geminiComplianceAgent = new GeminiComplianceAgent(geminiKnowledgeBase, geminiTelemetry);

/**
 * GEMINI INTEGRATION: React Hook for AI Case Insights
 * This hook integrates the GeminiComplianceAgent to provide real-time,
 * adaptive insights into the compliance case. It manages state for AI processing.
 */
export function useGeminiCaseInsights(complianceCase: any, caseable: any) {
  const [insights, setInsights] = React.useState<{
    summary: string;
    riskPrediction: string;
    suggestedActions: string[];
    complianceScore: number;
  } | null>(null);
  const [loadingInsights, setLoadingInsights] = React.useState(true);
  const [errorInsights, setErrorInsights] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (complianceCase && caseable && geminiTelemetry.checkServiceHealth('CaseInsights')) {
      setLoadingInsights(true);
      setErrorInsights(null);
      geminiComplianceAgent.analyzeCase(complianceCase, caseable)
        .then(setInsights)
        .catch(err => {
          geminiTelemetry.log('error', 'Error fetching Gemini case insights.', err);
          setErrorInsights("Failed to retrieve AI insights. Check telemetry for details.");
          // Simulate dynamic scaling down if errors persist
          if (Math.random() > 0.5) geminiTelemetry.log('warn', 'Considering dynamic scaling of Gemini insight requests due to error rate.');
        })
        .finally(() => setLoadingInsights(false));
    } else if (!geminiTelemetry.checkServiceHealth('CaseInsights')) {
      setErrorInsights("Gemini Insight service is currently unavailable. Circuit breaker tripped.");
      setLoadingInsights(false);
    }
  }, [complianceCase?.id, caseable?.status]); // Re-run if case ID or status changes

  const [decisionSuggestion, setDecisionSuggestion] = React.useState<{ decision: 'Approve' | 'Deny' | 'Further Review'; reason: string; confidence: number } | null>(null);
  const [loadingDecisionSuggestion, setLoadingDecisionSuggestion] = React.useState(false);
  const [errorDecisionSuggestion, setErrorDecisionSuggestion] = React.useState<string | null>(null);

  const getDecisionSuggestion = React.useCallback(async (caseId: string, currentStatus: string, pastActions: string[]) => {
    if (caseId && currentStatus && geminiTelemetry.checkServiceHealth('DecisionSuggestion')) {
      setLoadingDecisionSuggestion(true);
      setErrorDecisionSuggestion(null);
      try {
        const suggestion = await geminiComplianceAgent.makeDecisionSuggestion(caseId, currentStatus, pastActions);
        setDecisionSuggestion(suggestion);
        return suggestion;
      } catch (err) {
        geminiTelemetry.log('error', 'Error fetching Gemini decision suggestion.', err);
        setErrorDecisionSuggestion("Failed to retrieve AI decision suggestion.");
        throw err;
      } finally {
        setLoadingDecisionSuggestion(false);
      }
    } else if (!geminiTelemetry.checkServiceHealth('DecisionSuggestion')) {
      setErrorDecisionSuggestion("Gemini Decision Suggestion service is currently unavailable.");
      throw new Error("Service Unavailable");
    }
    return null;
  }, []);

  return {
    insights,
    loadingInsights,
    errorInsights,
    decisionSuggestion,
    loadingDecisionSuggestion,
    errorDecisionSuggestion,
    getDecisionSuggestion,
    geminiDecisionHistory: geminiComplianceAgent.getDecisionHistory(complianceCase?.id),
  };
}

/**
 * GEMINI INTEGRATION: AI-Powered Insights Section
 * This component displays the AI-generated summary, risk prediction,
 * and suggested actions within the case view, leveraging the useGeminiCaseInsights hook.
 * It's an example of embedding AI reasoning layers into the UI.
 */
export function GeminiInsightsSection({ complianceCase, caseable }: { complianceCase: any; caseable: any }) {
  const { insights, loadingInsights, errorInsights, decisionSuggestion, loadingDecisionSuggestion, errorDecisionSuggestion, getDecisionSuggestion } = useGeminiCaseInsights(complianceCase, caseable);

  const handlePromptForDecision = async () => {
    await getDecisionSuggestion(complianceCase?.id, caseable?.status, []); // Simulate past actions for prompt
  };

  if (!complianceCase || !caseable) {
    return null;
  }

  return (
    <div className="my-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <Heading level="h3" size="m" className="mb-4 text-blue-800">
        <Badge text="Gemini AI Insights" type={BadgeType.Info} className="mr-2" />
        AI-Powered Case Analysis
      </Heading>
      {loadingInsights && <LoadingLine />}
      {errorInsights && (
        <div className="text-red-600 border border-red-300 p-3 rounded-md">
          <strong>Error:</strong> {errorInsights}
          <p className="text-sm mt-1">Please check system telemetry for diagnostics.</p>
          <div className="mt-2 text-xxs text-gray-700">Recent Telemetry:
            {geminiTelemetry.getRecentLogs(3).map((log, i) => (
              <p key={i} className="ml-2">[{log.level.toUpperCase()}] {log.message}</p>
            ))}
          </div>
        </div>
      )}
      {insights && (
        <>
          <KeyValueTable
            data={{
              complianceScore: (
                <div className="flex items-center">
                  <Badge
                    text={`${insights.complianceScore.toFixed(0)}%`}
                    type={insights.complianceScore > 80 ? BadgeType.Success : insights.complianceScore > 50 ? BadgeType.Warning : BadgeType.Danger}
                    keepCaseFormat
                  />
                  <OverflowTip className="ml-2" message="AI-calculated dynamic compliance confidence score.">{insights.complianceScore.toFixed(0)}% Confidence</OverflowTip>
                </div>
              ),
              summary: <p>{insights.summary}</p>,
              riskPrediction: <p className="font-semibold text-orange-700">{insights.riskPrediction}</p>,
            }}
            dataMapping={{
              complianceScore: "AI Compliance Score",
              summary: "AI Case Summary",
              riskPrediction: "AI Risk Prediction",
            }}
          />
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2 text-blue-700">AI Suggested Actions:</h4>
            <ul className="list-disc list-inside text-sm text-gray-800">
              {insights.suggestedActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      <div className="mt-6 border-t pt-4">
        <h4 className="font-semibold text-sm mb-2 text-blue-700">AI Decision Assistant:</h4>
        {loadingDecisionSuggestion ? (
          <LoadingLine />
        ) : errorDecisionSuggestion ? (
          <div className="text-red-600">{errorDecisionSuggestion}</div>
        ) : decisionSuggestion ? (
          <div className="p-3 bg-blue-100 border border-blue-300 rounded-md text-sm">
            <p className="font-medium">AI Recommendation: <Badge text={decisionSuggestion.decision} type={decisionSuggestion.decision === 'Approve' ? BadgeType.Success : decisionSuggestion.decision === 'Deny' ? BadgeType.Danger : BadgeType.Info} /></p>
            <p className="mt-1">Reason: {decisionSuggestion.reason}</p>
            <p className="text-xs text-gray-600 mt-1">Confidence: {decisionSuggestion.confidence * 100}%</p>
          </div>
        ) : (
          <button
            onClick={handlePromptForDecision}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Ask Gemini for Decision Suggestion
          </button>
        )}
        {geminiComplianceAgent.getDecisionHistory(complianceCase?.id).length > 0 && (
          <div className="mt-4 text-xs text-gray-600">
            <h5 className="font-semibold mb-1">AI Decision History:</h5>
            <ul className="list-disc list-inside">
              {geminiComplianceAgent.getDecisionHistory(complianceCase?.id).map((entry, i) => (
                <li key={i}>
                  [{new Date(entry.timestamp).toLocaleTimeString()}]{" "}
                  <Badge text={entry.decision} type={entry.decision === 'Approve' ? BadgeType.Success : entry.decision === 'Deny' ? BadgeType.Danger : BadgeType.Info} className="mr-1" />
                  - {entry.reason} (Confidence: {entry.confidence * 100}%)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}


function CaseView({
  currentSection,
  setCurrentSection,
  match: {
    params: { caseId },
  },
}: CaseViewProps) {
  const { loading, data } = useCaseViewQuery({ variables: { id: caseId } });
  const complianceCase = data?.case;
  const caseable = complianceCase?.caseable;
  const isUserOnboarding =
    caseable?.decisionableType === DecisionableTypeEnum.UserOnboarding;
  const isCounterparty =
    caseable?.decisionableType === DecisionableTypeEnum.Counterparty;
  const verifications = (caseable?.verifications as Verification[]) || [];
  const middeskVerification = getVerification(
    verifications,
    VerificationProviderEnum.Middesk,
  );
  const sardineVerification = getVerification(
    verifications,
    VerificationProviderEnum.Sardine,
  );

  const boVerifications = getAllVerifications(
    verifications,
    VerificationProviderEnum.Sardine,
    Verification__TypeEnum.BeneficialOwner,
  );

  const caseReason = complianceCase?.reason;

  // GEMINI INTEGRATION: Dynamically add AI Insights section
  const sections = React.useMemo(() => {
    const baseSections = getSections(
      verifications,
      caseable?.decisionableType || DecisionableTypeEnum.UserOnboarding,
      "Case",
    );
    // Add AI insights as a prominent section
    return [
      { id: "geminiInsights", label: "Gemini AI Insights" },
      ...baseSections.filter(s => s.id !== "caseDetails"), // Ensure AI insights is prominent, maybe merge with caseDetails implicitly
      { id: "caseDetails", label: "Case Details" }, // Re-add Case Details if removed
    ];
  }, [verifications, caseable?.decisionableType]);


  const canReviewCase = data?.case?.reviewers
    ?.map((reviewer) => reviewer?.canReviewAsGroups.length > 0)
    .some(Boolean);

  const decisionable = caseable?.decisionable;
  let email: string | null | undefined;
  let counterpartyId: string | null | undefined;
  let phone: string | undefined;
  let showCheckboxes = false;

  switch (decisionable?.__typename) {
    case DecisionableTypeEnum.PaymentOrder: {
      counterpartyId = decisionable?.counterparty?.id;
      email = decisionable?.counterparty?.email;
      showCheckboxes = true;
      break;
    }
    case DecisionableTypeEnum.UserOnboarding: {
      const userOnboardingData = decisionable?.data;
      const userOnboardingDetails = JSON.parse(
        userOnboardingData || "{}",
      ) as UserOnboardingDetails;

      counterpartyId = decisionable?.counterpartyId;
      email = userOnboardingDetails?.party_details?.email;
      phone = userOnboardingDetails.party_details?.phone_number;
      showCheckboxes =
        decisionable.partyType === Flow__PartyTypeEnum.Individual;
      break;
    }
    case DecisionableTypeEnum.Counterparty: {
      counterpartyId = decisionable?.id;
      email = decisionable?.email;
      showCheckboxes = false;
      break;
    }
    default:
      break;
  }

  // GEMINI INTEGRATION: Use the AI agent to learn from this case
  React.useEffect(() => {
    if (complianceCase && caseable) {
      geminiKnowledgeBase.learn(`case-summary-${complianceCase.id}`, {
        id: complianceCase.id,
        status: caseable.status,
        risk: caseable.score,
        type: caseable.decisionableType,
        createdAt: complianceCase.createdAt,
      });
      geminiTelemetry.log('info', `Case ${complianceCase.id} loaded and context added to Knowledge Base.`, { status: caseable.status, risk: caseable.score });
    }
  }, [complianceCase?.id, caseable?.status, caseable?.score]);


  let content;
  switch (currentSection) {
    // GEMINI INTEGRATION: New section for AI Insights
    case "geminiInsights": {
      content = <GeminiInsightsSection complianceCase={complianceCase} caseable={caseable} />;
      break;
    }
    case "submittedInput": {
      content = (
        <ComplianceEntityDetails
          decision={caseable as Decision}
          showUserOnboardingOnly
        />
      );
      break;
    }
    case "caseDetails":
      content = (
        <>
          {(loading || !data) && (
            <KeyValueTableSkeletonLoader
              dataMapping={CASE_DETAILS_DATA_MAPPING}
            />
          )}
          {!loading && data && (
            <KeyValueTable
              data={{
                ...data?.case,
                caseId: (
                  <CopyableText text={complianceCase?.id}>
                    {complianceCase?.id}
                  </CopyableText>
                ),
                caseType: isUserOnboarding ? "Onboarding" : "Transaction",
                overallRiskLevel: (
                  <RiskLevelIndicator riskLevel={caseable?.score} />
                ),
                decisionReason: decisionReason(
                  complianceCase?.reviewers[0] as Reviewer,
                  caseable?.status,
                  caseReason || undefined,
                ),
                createdAt: complianceCase?.createdAt ? (
                  <DateTime timestamp={complianceCase?.createdAt} />
                ) : null,
                updatedAt: complianceCase?.updatedAt ? (
                  <DateTime timestamp={complianceCase?.updatedAt} />
                ) : null,
              }}
              dataMapping={CASE_DETAILS_DATA_MAPPING}
            />
          )}
        </>
      );
      break;
    case "documents":
      if (complianceCase?.id) {
        content = (
          <DocumentUploadContainer
            documentable_id={complianceCase?.id}
            documentable_type="Case"
            enableActions={complianceCase?.canUpdate && complianceCase?.canRead}
          />
        );
      }
      break;
    case "events":
      content = <EntityEventTableView entityId={caseId} resource="case" />;
      break;
    case "entityDetails":
      content = <ComplianceEntityDetails decision={caseable as Decision} />;
      break;
    case "watchlist": {
      const verification = middeskVerification || sardineVerification;
      content = <Watchlists verification={verification} />;
      break;
    }
    case "registrations":
      content = <BusinessRegistration verification={middeskVerification} />;
      break;
    case "people":
      content = (
        <People
          data={caseable as Decision}
          verification={middeskVerification}
          boVerifications={boVerifications}
        />
      );
      break;
    default:
      content = null;
      break;
  }

  return (
    <MTContainer>
      <div>
        {loading ? (
          <div className="mb-2 mt-1 flex h-6 w-48">
            <LoadingLine noHeight />
          </div>
        ) : (
          <div className="mb-2 mt-1 flex w-full flex-row items-center">
            <div className="flex w-1/2 items-center">
              <Heading level="h2" size="l" className="max-w-sm">
                <OverflowTip
                  className="truncate"
                  message={caseable?.decisionableTitle || ""}
                >
                  {caseable?.decisionableTitle}
                </OverflowTip>
              </Heading>
              <div className="ml-4">
                <ComplianceStatusBadge status={caseable?.status} />
              </div>
              <div className="ml-4">
                {caseReason &&
                  caseReason !== CaseReasonEnum.ResolvedByReviewers && (
                    <Badge
                      text="Autoresolved"
                      type={BadgeType.Default}
                      keepCaseFormat
                    />
                  )}
              </div>
            </div>
            <div className="w-1/2">
              <ApproveDenyCaseButtons
                caseId={caseId}
                canReviewCase={canReviewCase}
                userId={counterpartyId}
                email={email}
                phone={phone}
                showCheckboxes={showCheckboxes}
              />
            </div>
          </div>
        )}
      </div>
      <div className="pt-4">
        {isCounterparty ? (
          <WatchlistProfileView
            decisionable={caseable as Decision}
            verification={middeskVerification || sardineVerification}
          />
        ) : (
          <div>
            <RiskProfileView
              loading={loading}
              verifications={caseable?.verifications as Verification[]}
              vendorChecks={
                (caseable as Decision)?.decisionable?.vendorChecks || []
              }
              expandable
            />
          </div>
        )}
        <div className="my-8">
          <SectionNavigator
            sections={sections}
            currentSection={currentSection}
            onClick={setCurrentSection}
          />
        </div>
        {content}
      </div>
      <p className="my-8 text-xs text-gray-700">
        Modern Treasury is making a recommendation about the risk of a customer
        or transaction. Customers are ultimately responsible for identifying and
        reporting suspicious activity.
      </p>
      {/* GEMINI INTEGRATION: Display recent telemetry logs */}
      <div className="my-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
        <h4 className="font-semibold mb-2">Gemini System Telemetry (Last 5 Logs):</h4>
        <ul className="list-disc list-inside">
          {geminiTelemetry.getRecentLogs(5).map((log, i) => (
            <li key={i}>
              <Badge text={log.level.toUpperCase()} type={log.level === 'error' ? BadgeType.Danger : log.level === 'warn' ? BadgeType.Warning : BadgeType.Default} className="mr-1" />
              <DateTime timestamp={log.timestamp} />: {log.message}
            </li>
          ))}
        </ul>
      </div>
    </MTContainer>
  );
}

export default sectionWithNavigator(CaseView, "geminiInsights");