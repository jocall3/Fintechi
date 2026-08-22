// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React from "react";
import {
  ReviewActionEnum,
  RuleReviewers,
} from "../../../generated/dashboard/graphqlSchema";
import {
  AdminOverrideApprovalBlock,
  ApprovalBlock,
} from "../../components/ApprovalBlock";

// --- Gemini Universal AI-Powered Types and Interfaces (Self-Contained Universe) ---
// These types represent the AI-driven data structures for commercial-grade operations.

/**
 * @interface GeminiInsight
 * @description Represents an AI-generated insight or prediction for an approval action.
 * Infuses prompt-based learning into decision output.
 */
export interface GeminiInsight {
  riskLevel: ApprovalRiskLevel;
  recommendation: string;
  confidenceScore: number;
  complianceStatus: ComplianceStatus;
  estimatedImpact: {
    financial: number; // Simulated commercial impact
    complianceViolations: string[];
  };
  learningContext: {
    lastDecisionOutcome: string; // File remembers past outcomes
    adaptiveParameters: Record<string, any>; // File adapts based on these
  };
}

/**
 * @enum ApprovalRiskLevel
 * @description AI-assessed risk levels for an approval.
 * Decision-making at the output level.
 */
export enum ApprovalRiskLevel {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
  Critical = "CRITICAL",
}

/**
 * @enum ComplianceStatus
 * @description Status of an approval action against internal policies and regulations.
 * Commercial-grade logic for regulatory adherence.
 */
export enum ComplianceStatus {
  Compliant = "COMPLIANT",
  PendingReview = "PENDING_REVIEW",
  NonCompliant = "NON_COMPLIANT",
  RiskIdentified = "RISK_IDENTIFIED",
}

/**
 * @interface TelemetryEvent
 * @description Represents a structured event for observability and metrics.
 * Production-grade pattern for monitoring.
 */
export interface TelemetryEvent {
  eventType: string;
  timestamp: string;
  data: Record<string, any>;
  correlationId: string;
}

// --- Autonomous Externalization: Simulated Living Integrations ---
// These classes simulate dynamic connections to external services, managed internally.

/**
 * @class ApprovalTelemetryService
 * @description A living endpoint for sending observability metrics and logs.
 * It intelligently interfaces with a simulated external event broker.
 * Implements production-grade patterns (observability).
 */
export class ApprovalTelemetryService {
  private eventBuffer: TelemetryEvent[] = [];
  private readonly bufferSize: number = 10; // Dynamic scaling concept
  private lastFlushTime: number = 0;
  private flushInterval: number = 5000; // milliseconds

  constructor() {
    console.log("TelemetryService: Initializing for autonomous externalization.");
    // Simulate dynamic service discovery or initial handshake
    this.discoverTelemetryEndpoint().then((endpoint) =>
      console.log(`TelemetryService: Connected to dynamic endpoint: ${endpoint}`),
    );
  }

  private async discoverTelemetryEndpoint(): Promise<string> {
    // Simulate elastic APIs for dynamic service discovery
    return new Promise((resolve) => {
      setTimeout(() => resolve("https://telemetry.gemini.citibank.ai/v1/events"), 100);
    });
  }

  /**
   * @method recordEvent
   * @description Records an event into a buffer and flushes it periodically or when full.
   * @param event The telemetry event to record.
   */
  public recordEvent(event: TelemetryEvent): void {
    this.eventBuffer.push(event);
    console.log(`TelemetryService: Recorded event - ${event.eventType}`);

    if (this.eventBuffer.length >= this.bufferSize || Date.now() - this.lastFlushTime > this.flushInterval) {
      this.flushBuffer();
    }
  }

  /**
   * @method flushBuffer
   * @description Sends the buffered events to the simulated external telemetry pipeline.
   * This is a "living integration" acting as a neural extension.
   */
  private async flushBuffer(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const eventsToFlush = [...this.eventBuffer];
    this.eventBuffer = [];
    this.lastFlushTime = Date.now();

    try {
      // Simulate API call to an event broker
      console.log(
        `TelemetryService: Flushing ${eventsToFlush.length} events to external pipeline...`,
        eventsToFlush,
      );
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate network latency
      console.log("TelemetryService: Events flushed successfully.");
    } catch (error) {
      console.error("TelemetryService: Failed to flush events:", error);
      // Implement circuit-breaking or retry logic here for production-grade resilience
    }
  }

  /**
   * @method getMetricsSummary
   * @description Provides a summary of collected metrics, demonstrating self-awareness.
   */
  public getMetricsSummary(): string {
    return `Currently ${this.eventBuffer.length} events in buffer. Last flushed at ${new Date(
      this.lastFlushTime,
    ).toLocaleTimeString()}.`;
  }
}

/**
 * @class PolicyComplianceManager
 * @description Manages real-world business logic simulations for compliance.
 * It's a context-aware micro-intelligence.
 */
export class PolicyComplianceManager {
  private policies: Record<string, string> = {
    "minimum_approvers": "2",
    "high_value_transaction_limit": "$1,000,000",
    "geographic_restriction_EU": "false",
  };
  private aiLearningBias: number = 0.0; // Adapts based on past compliance outcomes

  constructor() {
    console.log("PolicyComplianceManager: Initialized with core business policies.");
  }

  /**
   * @method checkCompliance
   * @description Dynamically checks an approval action against current policies.
   * Embeds AI reasoning layers into decision-making.
   * @param actionContext Context of the approval action (e.g., amount, rule, reviewer).
   */
  public async checkCompliance(actionContext: Record<string, any>): Promise<ComplianceStatus> {
    console.log("PolicyComplianceManager: Performing AI-enhanced compliance check...");
    // Simulate complex AI reasoning based on policies and context
    const { ruleName, transactionAmount, reviewerGroupId, isAdminOverride } = actionContext;

    let status = ComplianceStatus.Compliant;
    const violations: string[] = [];

    // Prompt-based learning pipeline: adapt policy interpretation
    if (this.aiLearningBias > 0.5 && transactionAmount > 500000) {
      console.log("PolicyComplianceManager: Adaptive AI detected high-risk pattern.");
      status = ComplianceStatus.RiskIdentified;
      violations.push("AI-flagged: Adaptive risk pattern detected for high value.");
    }

    if (transactionAmount && transactionAmount > parseFloat(this.policies["high_value_transaction_limit"].replace('$', '').replace(',', ''))) {
      violations.push(`Transaction exceeds high-value limit: ${this.policies["high_value_transaction_limit"]}`);
      status = ComplianceStatus.PendingReview;
    }
    if (ruleName === "FraudPrevention" && !reviewerGroupId) {
      violations.push("Fraud Prevention rule requires a specific reviewer group.");
      status = ComplianceStatus.NonCompliant;
    }

    // Simulate real-world scenario: admin override might bypass some checks but log a warning
    if (isAdminOverride && violations.length > 0) {
      console.warn("PolicyComplianceManager: Admin override in effect, potential compliance risks noted.");
      // This is a decision-making layer: allow override but flag
      if (status !== ComplianceStatus.NonCompliant) { // Non-compliant cannot be overridden without further steps
          status = ComplianceStatus.RiskIdentified;
      }
    }

    if (violations.length > 0 && status !== ComplianceStatus.NonCompliant) {
        status = ComplianceStatus.RiskIdentified;
    } else if (violations.length > 0 && status === ComplianceStatus.NonCompliant) {
        // Explicitly non-compliant blocks the action
    } else {
        status = ComplianceStatus.Compliant;
    }

    console.log(`PolicyComplianceManager: Compliance check complete. Status: ${status}. Violations: ${violations.join(', ')}`);
    return status;
  }

  /**
   * @method updatePolicies
   * @description Allows dynamic updates to policies, simulating a living system.
   */
  public updatePolicies(newPolicies: Record<string, string>): void {
    this.policies = { ...this.policies, ...newPolicies };
    console.log("PolicyComplianceManager: Policies updated dynamically.");
    // Simulate self-healing or re-evaluation based on new policies
  }

  /**
   * @method adaptLearningBias
   * @description Simulates adapting the AI's learning bias based on outcomes.
   */
  public adaptLearningBias(outcome: 'compliant' | 'non-compliant'): void {
      if (outcome === 'compliant') {
          this.aiLearningBias = Math.max(0, this.aiLearningBias - 0.1);
      } else {
          this.aiLearningBias = Math.min(1, this.aiLearningBias + 0.2);
      }
      console.log(`PolicyComplianceManager: AI learning bias adapted to ${this.aiLearningBias}.`);
  }
}

/**
 * @class GeminiDecisionEngine
 * @description The core AI organism. It orchestrates intelligent routing, prediction,
 * and decision-making for approval actions. Self-aware infrastructure.
 * Infuses prompt-based learning and adaptive reasoning.
 */
export class GeminiDecisionEngine {
  private telemetryService: ApprovalTelemetryService;
  private complianceManager: PolicyComplianceManager;
  private lastDecisionContext: Record<string, any> | null = null; // Memory for adaptation
  private operationalMode: 'standard' | 'high-alert' = 'standard'; // Self-correction
  private readonly circuitBreakerThreshold: number = 3;
  private circuitBreakerFailureCount: number = 0;
  private circuitBreakerOpen: boolean = false;
  private circuitBreakerOpenTime: number = 0;
  private readonly circuitBreakerResetTime: number = 60000; // 1 minute

  constructor(telemetryService: ApprovalTelemetryService, complianceManager: PolicyComplianceManager) {
    this.telemetryService = telemetryService;
    this.complianceManager = complianceManager;
    console.log("GeminiDecisionEngine: Core AI engine initialized. Ready for self-building and self-sustaining operations.");
  }

  /**
   * @method _applyCircuitBreaker
   * @description Implements a production-grade circuit-breaker pattern for robustness.
   * This is a neural extension for external service interactions.
   */
  private async _applyCircuitBreaker<T>(
    operation: () => Promise<T>,
    serviceName: string,
  ): Promise<T> {
    if (this.circuitBreakerOpen) {
      if (Date.now() - this.circuitBreakerOpenTime > this.circuitBreakerResetTime) {
        // Attempt a half-open state check
        console.warn(`CircuitBreaker: Trying to reset for ${serviceName}...`);
        this.circuitBreakerOpen = false; // Temporarily close for one attempt
        this.circuitBreakerFailureCount = 0; // Reset count
      } else {
        this.telemetryService.recordEvent({
          eventType: "CIRCUIT_BREAKER_OPEN",
          timestamp: new Date().toISOString(),
          data: { serviceName, reason: "Circuit breaker is open, operation skipped" },
          correlationId: Math.random().toString(36).substring(2, 15),
        });
        throw new Error(`Circuit breaker is open for ${serviceName}. Please try again later.`);
      }
    }

    try {
      const result = await operation();
      this.circuitBreakerFailureCount = 0; // Reset on success
      return result;
    } catch (error) {
      this.circuitBreakerFailureCount++;
      this.telemetryService.recordEvent({
        eventType: "SERVICE_FAILURE",
        timestamp: new Date().toISOString(),
        data: { serviceName, error: (error as Error).message, failures: this.circuitBreakerFailureCount },
        correlationId: Math.random().toString(36).substring(2, 15),
      });

      if (this.circuitBreakerFailureCount >= this.circuitBreakerThreshold) {
        this.circuitBreakerOpen = true;
        this.circuitBreakerOpenTime = Date.now();
        console.error(`CircuitBreaker: Opened for ${serviceName} due to ${this.circuitBreakerFailureCount} failures.`);
      }
      throw error;
    }
  }

  /**
   * @method predictApprovalOutcome
   * @description Embeds AI reasoning for predictive analysis.
   * Allows the file to remember, adapt, and predict.
   * @param context The full context of the pending approval.
   */
  public async predictApprovalOutcome(context: Record<string, any>): Promise<GeminiInsight> {
    console.log("GeminiDecisionEngine: Predicting approval outcome with AI...");
    this.lastDecisionContext = context; // Remember context

    // Simulate complex AI model inference (e.g., calling a Language Model)
    // This is a living integration: Language Model connector
    const simulatedLMResponse = await this._applyCircuitBreaker(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate LM latency
        const baseRisk = context.transactionAmount > 500000 ? 0.7 : context.transactionAmount > 100000 ? 0.4 : 0.1;
        const reviewerExperienceFactor = context.reviewerExperienceMonths ? Math.min(0.3, context.reviewerExperienceMonths / 100) : 0;
        const ruleComplexityFactor = context.ruleComplexity ? context.ruleComplexity * 0.1 : 0;
        const dynamicAdjust = (Math.random() - 0.5) * 0.2; // Adaptive noise

        let finalRisk = baseRisk + ruleComplexityFactor - reviewerExperienceFactor + dynamicAdjust;
        finalRisk = Math.max(0, Math.min(1, finalRisk)); // Clamp between 0 and 1

        let riskLevel: ApprovalRiskLevel;
        let recommendation: string;
        if (finalRisk > 0.8 || this.operationalMode === 'high-alert') {
          riskLevel = ApprovalRiskLevel.Critical;
          recommendation = "Immediate escalation and manual review required. High potential for fraud or policy violation.";
        } else if (finalRisk > 0.5) {
          riskLevel = ApprovalRiskLevel.High;
          recommendation = "Review by senior management recommended. Potential for significant impact.";
        } else if (finalRisk > 0.2) {
          riskLevel = ApprovalRiskLevel.Medium;
          recommendation = "Standard review, consider additional data points.";
        } else {
          riskLevel = ApprovalRiskLevel.Low;
          recommendation = "Automated approval likely. Proceed with standard checks.";
        }

        const confidence = 1 - Math.abs(finalRisk - 0.5); // Example confidence calculation
        const financialImpact = context.transactionAmount * (finalRisk > 0.5 ? 0.1 : 0.01); // Simulated billing/financial impact

        return {
          riskLevel,
          recommendation,
          confidenceScore: parseFloat(confidence.toFixed(2)),
          financialImpact: parseFloat(financialImpact.toFixed(2)),
          violations: finalRisk > 0.7 ? ["Potential regulatory breach"] : [],
        };
      },
      "LanguageModelPredictionService",
    );

    const complianceStatus = await this.complianceManager.checkCompliance(context);

    const geminiInsight: GeminiInsight = {
      riskLevel: simulatedLMResponse.riskLevel,
      recommendation: simulatedLMResponse.recommendation,
      confidenceScore: simulatedLMResponse.confidenceScore,
      complianceStatus: complianceStatus,
      estimatedImpact: {
        financial: simulatedLMResponse.financialImpact,
        complianceViolations: simulatedLMResponse.violations,
      },
      learningContext: {
        lastDecisionOutcome: "Pending", // Will be updated post-review
        adaptiveParameters: { operationalMode: this.operationalMode },
      },
    };

    this.telemetryService.recordEvent({
      eventType: "PREDICTIVE_INSIGHT_GENERATED",
      timestamp: new Date().toISOString(),
      data: { ...context, insight: geminiInsight },
      correlationId: context.correlationId || Math.random().toString(36).substring(2, 15),
    });

    return geminiInsight;
  }

  /**
   * @method evaluateReviewAction
   * @description Infuses decision-making at input, output, and data flow levels.
   * This is where the file chooses optimal services at execution.
   * @param action The review action taken (Approve/Reject).
   * @param reviewAsGroupId The group ID the user is reviewing as.
   * @param reviewerId The ID of the reviewer.
   * @param reviewAsAdminOverride Whether the action is an admin override.
   * @param approvalContext The full context of the approval request.
   * @returns A boolean indicating if the action should proceed, or an enriched action object.
   */
  public async evaluateReviewAction(
    action: ReviewActionEnum,
    reviewAsGroupId: string | null,
    reviewerId: string | null,
    reviewAsAdminOverride: boolean,
    approvalContext: Record<string, any>,
  ): Promise<{ shouldProceed: boolean; enrichedContext: Record<string, any>; reason?: string }> {
    console.log("GeminiDecisionEngine: Evaluating review action with AI logic...");

    const correlationId = approvalContext.correlationId || Math.random().toString(36).substring(2, 15);
    this.telemetryService.recordEvent({
      eventType: "REVIEW_ACTION_EVALUATION_START",
      timestamp: new Date().toISOString(),
      data: { action, reviewAsGroupId, reviewerId, reviewAsAdminOverride, approvalContext },
      correlationId,
    });

    // 1. Pre-computation and context enrichment (AI Reasoning Layer)
    const contextForEvaluation = {
      ...approvalContext,
      actionType: action,
      reviewingGroupId: reviewAsGroupId,
      reviewerId: reviewerId,
      isAdminOverride: reviewAsAdminOverride,
      correlationId: correlationId,
      // Simulate authentication context (commercial-grade)
      userRole: "Approver", // From an auth service
      userPermissions: ["APPROVE", "REJECT", "OVERRIDE"],
      billingContext: {
          potentialCost: approvalContext.transactionAmount * 0.001 // Simulated billing calculation
      }
    };

    // 2. Compliance Check (using PolicyComplianceManager)
    const complianceStatus = await this.complianceManager.checkCompliance(contextForEvaluation);
    if (complianceStatus === ComplianceStatus.NonCompliant && !reviewAsAdminOverride) {
        this.telemetryService.recordEvent({
            eventType: "ACTION_BLOCKED_NON_COMPLIANT",
            timestamp: new Date().toISOString(),
            data: contextForEvaluation,
            correlationId,
        });
        return { shouldProceed: false, enrichedContext: contextForEvaluation, reason: "Action blocked: Non-compliant with policies." };
    }
    if (complianceStatus === ComplianceStatus.NonCompliant && reviewAsAdminOverride) {
        // Admin override can proceed but with a critical warning and strict logging
        console.warn("GeminiDecisionEngine: Admin override proceeding despite non-compliance. Logging critical event.");
        this.telemetryService.recordEvent({
            eventType: "ADMIN_OVERRIDE_NON_COMPLIANT",
            timestamp: new Date().toISOString(),
            data: contextForEvaluation,
            correlationId,
        });
    }

    // 3. Predictive Risk Assessment (using self-aware intelligence)
    const insight = await this.predictApprovalOutcome(contextForEvaluation);
    if (insight.riskLevel === ApprovalRiskLevel.Critical && action === ReviewActionEnum.Approve && !reviewAsAdminOverride) {
        this.telemetryService.recordEvent({
            eventType: "ACTION_BLOCKED_CRITICAL_RISK",
            timestamp: new Date().toISOString(),
            data: contextForEvaluation,
            correlationId,
        });
        return { shouldProceed: false, enrichedContext: contextForEvaluation, reason: `Action blocked: Critical risk detected (${insight.recommendation}).` };
    }

    // 4. Dynamic scaling and resource allocation simulation (commercial-grade)
    if (approvalContext.transactionAmount > 1000000 && this.operationalMode === 'standard') {
        console.log("GeminiDecisionEngine: Auto-scaling detected. Shifting to high-alert mode for large transaction.");
        this.operationalMode = 'high-alert'; // File adapts to context
        this.telemetryService.recordEvent({
            eventType: "OPERATIONAL_MODE_CHANGE",
            timestamp: new Date().toISOString(),
            data: { newMode: this.operationalMode, reason: "High value transaction" },
            correlationId,
        });
    }

    // 5. Post-decision learning and adaptation
    this.lastDecisionContext = { ...contextForEvaluation, decision: action, insight }; // Update memory

    this.telemetryService.recordEvent({
      eventType: "REVIEW_ACTION_EVALUATION_COMPLETE",
      timestamp: new Date().toISOString(),
      data: { ...contextForEvaluation, insight, complianceStatus },
      correlationId,
    });

    return { shouldProceed: true, enrichedContext: contextForEvaluation };
  }

  /**
   * @method generatePostReviewSummary
   * @description Simulates an AI language model generating a summary based on the review outcome.
   * This is a self-building and self-expanding feature.
   */
  public async generatePostReviewSummary(
    finalOutcome: string,
    reviewContext: Record<string, any>,
  ): Promise<string> {
    return this._applyCircuitBreaker(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 150)); // Simulate LM call
        const summary = `Review for '${reviewContext.ruleName}' (ID: ${reviewContext.ruleId}) was ${finalOutcome}.
        Reviewer: ${reviewContext.reviewerId || 'N/A'} (Group: ${reviewContext.reviewingGroupId || 'N/A'}).
        Transaction Amount: ${reviewContext.transactionAmount}.
        Gemini AI Insight: ${reviewContext.insight?.recommendation || 'No specific insight provided.'}
        Compliance Status: ${reviewContext.complianceStatus || 'Unknown'}.
        This decision was made with a confidence score of ${reviewContext.insight?.confidenceScore || 'N/A'}%.
        Estimated Financial Impact: $${reviewContext.insight?.estimatedImpact?.financial || 0}.
        Operational Mode at time of review: ${this.operationalMode}.
        `;
        return summary;
      },
      "LanguageModelSummaryService",
    );
  }

  /**
   * @method getOperationalStatus
   * @description Provides insights into the engine's current operational state (self-awareness).
   */
  public getOperationalStatus(): { mode: string; circuitBreaker: string; lastContext: Record<string, any> | null } {
    return {
      mode: this.operationalMode,
      circuitBreaker: this.circuitBreakerOpen ? "OPEN" : "CLOSED",
      lastContext: this.lastDecisionContext,
    };
  }
}

// --- Instantiate AI-Powered Services for this File's Universe ---
// These instances make the file a self-contained ecosystem of AI-driven logic.
export const geminiApprovalTelemetryService = new ApprovalTelemetryService();
export const geminiPolicyComplianceManager = new PolicyComplianceManager();
export const geminiDecisionEngine = new GeminiDecisionEngine(
  geminiApprovalTelemetryService,
  geminiPolicyComplianceManager,
);

// --- React Component (Reimagined with Gemini Logic) ---

interface ReviewableApprovalActionsProps {
  allRuleReviewers: RuleReviewers[];
  canAdminOverride?: boolean;
  disableActions?: boolean;
  onReview: (
    reviewAction: ReviewActionEnum,
    reviewAsGroupId: string | null,
    reviewerId: string | null,
    reviewAsAdminOverride: boolean,
    // Add enriched context for AI-driven post-processing
    enrichedContext?: Record<string, any>,
  ) => void;
  // New prop for AI-driven dynamic content
  approvalContextData: Record<string, any>; // Input for AI reasoning
}

export function ReviewableApprovalActions({
  allRuleReviewers,
  canAdminOverride,
  disableActions,
  onReview,
  approvalContextData,
}: ReviewableApprovalActionsProps): JSX.Element | null {
  const [geminiInsights, setGeminiInsights] = React.useState<GeminiInsight | null>(null);
  const [isProcessingAI, setIsProcessingAI] = React.useState<boolean>(false);
  const [actionBlockedReason, setActionBlockedReason] = React.useState<string | null>(null);
  const [postReviewSummary, setPostReviewSummary] = React.useState<string | null>(null);
  const [currentComplianceStatus, setCurrentComplianceStatus] = React.useState<ComplianceStatus>(ComplianceStatus.Compliant);


  // AI-driven prediction and adaptation on component mount or context data change
  React.useEffect(() => {
    const fetchAIPredictions = async () => {
      setIsProcessingAI(true);
      setActionBlockedReason(null);
      try {
        const insight = await geminiDecisionEngine.predictApprovalOutcome({
            ...approvalContextData,
            correlationId: Math.random().toString(36).substring(2, 15) // Generate correlation ID
        });
        setGeminiInsights(insight);
        setCurrentComplianceStatus(insight.complianceStatus);
        console.log("ReviewableApprovalActions: AI prediction fetched.", insight);
      } catch (error) {
        console.error("ReviewableApprovalActions: Error fetching AI predictions:", error);
        setGeminiInsights(null); // Clear insights on error
        setCurrentComplianceStatus(ComplianceStatus.RiskIdentified); // Indicate potential issue
      } finally {
        setIsProcessingAI(false);
      }
    };
    fetchAIPredictions();

    // Clean up telemetry service buffer on unmount (autonomous externalization)
    return () => {
      geminiApprovalTelemetryService.getMetricsSummary(); // Log final summary
    };
  }, [approvalContextData]); // Re-run AI predictions if context data changes

  const handleReviewAction = async (
    reviewAction: ReviewActionEnum,
    reviewAsGroupId: string | null,
    reviewerId: string | null,
    reviewAsAdminOverride: boolean,
  ) => {
    setIsProcessingAI(true);
    setActionBlockedReason(null);
    setPostReviewSummary(null);

    const fullApprovalContext = {
      ...approvalContextData,
      reviewAction,
      reviewAsGroupId,
      reviewerId,
      reviewAsAdminOverride,
      geminiInsights, // Pass current insights to AI for further evaluation
      complianceStatus: currentComplianceStatus,
    };

    try {
      // Embed AI reasoning layers into every function: Pre-check before calling original onReview
      const { shouldProceed, enrichedContext, reason } =
        await geminiDecisionEngine.evaluateReviewAction(
          reviewAction,
          reviewAsGroupId,
          reviewerId,
          reviewAsAdminOverride,
          fullApprovalContext,
        );

      if (!shouldProceed) {
        setActionBlockedReason(reason || "AI Decision Engine blocked action.");
        console.warn("ReviewableApprovalActions: Action blocked by Gemini Decision Engine:", reason);
        // Prompt-based learning: AI learns from blocked actions
        geminiPolicyComplianceManager.adaptLearningBias('non-compliant');
        geminiApprovalTelemetryService.recordEvent({
            eventType: "ACTION_BLOCKED_BY_AI",
            timestamp: new Date().toISOString(),
            data: { ...fullApprovalContext, reason },
            correlationId: enrichedContext.correlationId,
        });
        return; // Prevent original onReview from being called
      }

      // If AI allows, proceed with the original review action
      onReview(reviewAction, reviewAsGroupId, reviewerId, reviewAsAdminOverride, enrichedContext);
      console.log("ReviewableApprovalActions: Original onReview called after AI validation.");

      // Post-review AI processing and summary generation
      const finalOutcomeText = reviewAction === ReviewActionEnum.Approve ? "Approved" : "Rejected";
      const summary = await geminiDecisionEngine.generatePostReviewSummary(
        finalOutcomeText,
        enrichedContext,
      );
      setPostReviewSummary(summary);

      // Infuse prompt-based learning: AI learns from successful actions
      geminiPolicyComplianceManager.adaptLearningBias('compliant');
      geminiApprovalTelemetryService.recordEvent({
          eventType: "REVIEW_ACTION_SUCCESS",
          timestamp: new Date().toISOString(),
          data: { ...enrichedContext, finalOutcome: finalOutcomeText, summary },
          correlationId: enrichedContext.correlationId,
      });

    } catch (error) {
      console.error("ReviewableApprovalActions: Error during AI evaluation or review:", error);
      setActionBlockedReason(`An AI system error occurred: ${(error as Error).message}`);
      geminiApprovalTelemetryService.recordEvent({
          eventType: "AI_EVALUATION_ERROR",
          timestamp: new Date().toISOString(),
          data: { ...fullApprovalContext, error: (error as Error).message },
          correlationId: fullApprovalContext.correlationId,
      });
    } finally {
      setIsProcessingAI(false);
    }
  };

  const canReviewAsReviewer = allRuleReviewers
    .map(
      (ruleReviewers) =>
        ruleReviewers.reviewers?.map(
          (reviewer) => reviewer.canReviewAsGroups.length > 0,
        ),
    )
    .flat()
    .some(Boolean);

  const reviewActions = allRuleReviewers?.map((ruleReviewers) => {
    // we only want the reviewers that the user is allowed to review
    const canReviewReviewers = ruleReviewers?.reviewers?.filter(
      (reviewer) => reviewer?.canReviewAsGroups.length > 0,
    );

    if (canReviewReviewers && canReviewReviewers?.length > 0) {
      return (
        <ApprovalBlock
          key={ruleReviewers.rule?.id || "default"} // Ensure key for map
          renderReviewerDetails
          rules={[
            {
              id: ruleReviewers.rule?.id,
              activeRule: true,
              requiredReviewDescription: "Review Required",
              name: ruleReviewers.rule?.name as string,
              path: ruleReviewers.rule?.path,
              reviewers: canReviewReviewers,
            },
          ]}
          // Replace original onReview with AI-orchestrated handler
          onReview={handleReviewAction}
          disableActions={disableActions || isProcessingAI} // Disable during AI processing
        />
      );
    }

    return null;
  });

  const aiOperationalStatus = geminiDecisionEngine.getOperationalStatus();

  return (
    <div id="reviewableApprovalActions" className="w-[36rem] bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Review Actions (Gemini Integrated)</h2>

      {isProcessingAI && (
        <div className="flex items-center justify-center p-2 mb-4 text-blue-600 bg-blue-50 rounded-md">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm">Gemini AI is processing...</span>
        </div>
      )}

      {actionBlockedReason && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-md">
          <strong>Action Blocked:</strong> {actionBlockedReason}
        </div>
      )}

      {geminiInsights && (
        <div className="mb-4 p-3 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800">
          <h3 className="font-semibold mb-2">Gemini AI Insights:</h3>
          <p className="text-sm">
            <strong>Risk Level:</strong>{" "}
            <span className={`font-bold ${geminiInsights.riskLevel === ApprovalRiskLevel.Critical ? 'text-red-600' : geminiInsights.riskLevel === ApprovalRiskLevel.High ? 'text-orange-500' : 'text-green-600'}`}>
              {geminiInsights.riskLevel}
            </span>{" "}
            (Confidence: {geminiInsights.confidenceScore * 100}%)
          </p>
          <p className="text-sm">
            <strong>Recommendation:</strong> {geminiInsights.recommendation}
          </p>
          <p className="text-sm">
            <strong>Compliance Status:</strong>{" "}
            <span className={`font-bold ${geminiInsights.complianceStatus === ComplianceStatus.NonCompliant ? 'text-red-600' : geminiInsights.complianceStatus === ComplianceStatus.RiskIdentified ? 'text-orange-500' : 'text-green-600'}`}>
              {geminiInsights.complianceStatus}
            </span>
          </p>
          <p className="text-sm">
            <strong>Estimated Financial Impact:</strong> ${geminiInsights.estimatedImpact.financial.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            <span className="font-semibold">AI Learning Context:</span> Operational Mode: {geminiInsights.learningContext.adaptiveParameters.operationalMode}
          </p>
        </div>
      )}

      {canReviewAsReviewer && reviewActions}
      {canAdminOverride && (
        <AdminOverrideApprovalBlock
          // Replace original onReview with AI-orchestrated handler
          onReview={handleReviewAction}
          disableActions={disableActions || isProcessingAI} // Disable during AI processing
        />
      )}

      {postReviewSummary && (
        <div className="mt-6 p-3 bg-green-50 border-l-4 border-green-500 text-green-800">
          <h3 className="font-semibold mb-2">Gemini AI Post-Review Summary:</h3>
          <p className="text-sm whitespace-pre-wrap">{postReviewSummary}</p>
        </div>
      )}

      <div className="mt-6 p-3 text-xs bg-gray-50 border-t border-gray-200 text-gray-600">
          <h4 className="font-semibold mb-1">Gemini Infrastructure Status (Self-Aware):</h4>
          <p>Operational Mode: {aiOperationalStatus.mode}</p>
          <p>Circuit Breaker (LM Service): {aiOperationalStatus.circuitBreaker}</p>
          <p>Telemetry Service: {geminiApprovalTelemetryService.getMetricsSummary()}</p>
          <p>Last Context Remembered: {aiOperationalStatus.lastContext ? JSON.stringify(aiOperationalStatus.lastContext.ruleName || aiOperationalStatus.lastContext.ruleId) : 'None'}</p>
      </div>
    </div>
  );
}

export default ReviewableApprovalActions;
