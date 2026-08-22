// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useCallback, useEffect, useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import * as Sentry from "@sentry/browser";
import { cn } from "~/common/utilities/cn";
import useLiveConfiguration from "~/common/utilities/useLiveConfiguration";
import { dateSearchMapper } from "../../components/search/DateSearch";
import {
  PaymentOrder__StatusEnum,
  useBulkReviewPaymentOrdersMutation,
  useReviewPaymentOrdersMutation,
  useApprovalsPaymentOrderListViewQuery,
  useCalculatePaymentOrderReviewsTotalAmountQuery,
  ReviewActionEnum,
  ReviewPaymentOrdersFilterInput,
  PaymentTypeWithPriorityEnum,
  ReviewPaymentOrdersMutationVariables,
  Reviewer,
} from "../../../generated/dashboard/graphqlSchema";
import EntityTableView, {
  INITIAL_PAGINATION,
} from "../../components/EntityTableView";
import { CursorPaginationInput } from "../../types/CursorPaginationInput";
import { ConfirmModal } from "../../../common/ui-components";
import { parse, stringify } from "../../../common/utilities/queryString";
import ApprovalsScopeSelector from "../../components/ApprovalsScopeSelector";
import { ExportDataParams } from "../../components/ExportDataButton";
import {
  ApprovalsPaymentOrderQueryFilter,
  getApprovalsPaymentOrderSearchComponents,
} from "../../../common/search_components/approvalsPaymentOrderSearchComponents";
import { PAYMENT_ORDER } from "../../../generated/dashboard/types/resources";
import { useDispatchContext } from "../../MessageProvider";
import { combinedReviewers } from "./ApprovalsUtils";

// --- START: Gemini Integration - AI Core Services ---

/**
 * @exports GeminiTelemetryAgent
 * AI-powered telemetry and observability agent.
 * Collects enriched metrics, logs, and traces for self-optimization and monitoring.
 * Simulates integration with a dynamic telemetry pipeline.
 */
export class GeminiTelemetryAgent {
  private serviceName: string;
  private sessionId: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.sessionId = Math.random().toString(36).substring(2, 15);
    console.log(`[GeminiTelemetryAgent] Initialized for ${serviceName}, Session: ${this.sessionId}`);
  }

  /**
   * Captures an event with contextual data.
   * @param eventName The name of the event.
   * @param data Additional data to log.
   * @param level Logging level (e.g., 'info', 'warn', 'error').
   */
  public async captureEvent(eventName: string, data: Record<string, any>, level: 'info' | 'warn' | 'error' = 'info'): Promise<void> {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      service: this.serviceName,
      sessionId: this.sessionId,
      eventName,
      level,
      ...data,
    };
    // Simulate sending to an external telemetry pipeline
    console.log(`[GeminiTelemetryAgent][${level.toUpperCase()}] Event Captured: ${eventName}`, payload);
    // In a real system, this would involve an API call to a telemetry service.
    // For now, we simulate success after a small delay.
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  /**
   * Reports an error with enhanced context.
   * @param error The error object.
   * @param context Additional context for the error.
   */
  public async reportError(error: Error, context: Record<string, any>): Promise<void> {
    await this.captureEvent("error", {
      errorMessage: error.message,
      stack: error.stack,
      ...context,
    }, 'error');
    Sentry.captureException(error, { extra: context }); // Still use Sentry for legacy compatibility
  }

  /**
   * Tracks a performance metric.
   * @param metricName Name of the metric.
   * @param value Metric value.
   * @param tags Optional tags for the metric.
   */
  public async trackMetric(metricName: string, value: number, tags?: Record<string, string>): Promise<void> {
    await this.captureEvent("metric", {
      metricName,
      value,
      tags,
    });
  }
}

/**
 * @exports GeminiPromptEngine
 * AI-powered prompt management and learning pipeline.
 * Generates context-aware prompts for internal AI decisioning and learns from user interactions.
 */
export class GeminiPromptEngine {
  private history: Array<{ prompt: string; response: string; timestamp: string }> = [];

  /**
   * Generates a context-aware prompt.
   * @param context The current operational context.
   * @param intent The desired action or query.
   * @returns A string representing the AI prompt.
   */
  public async generatePrompt(context: Record<string, any>, intent: string): Promise<string> {
    const prompt = `Based on the current context (${JSON.stringify(context)}) and the intent to "${intent}", provide a concise AI directive.`;
    // Simulate complex prompt generation based on historical data and current context
    await new Promise(resolve => setTimeout(resolve, 20));
    console.log(`[GeminiPromptEngine] Generated Prompt: ${prompt}`);
    return prompt;
  }

  /**
   * Stores a prompt-response interaction for learning.
   * @param prompt The prompt string.
   * @param response The AI's response.
   */
  public async learnFromInteraction(prompt: string, response: string): Promise<void> {
    this.history.push({ prompt, response, timestamp: new Date().toISOString() });
    // In a real system, this would update a learning model.
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log(`[GeminiPromptEngine] Learning from interaction. History size: ${this.history.length}`);
  }

  /**
   * Adapts prompt generation based on past interactions.
   * (Placeholder for more sophisticated adaptive logic)
   */
  public async adaptPromptGeneration(): Promise<void> {
    // Logic to analyze history and refine future prompt generation strategies.
    console.log(`[GeminiPromptEngine] Adapting prompt generation based on ${this.history.length} interactions.`);
  }
}

/**
 * @exports GeminiDecisionEngine
 * AI-powered decision-making layer.
 * Processes inputs, applies reasoning, and provides recommendations or direct actions.
 * Integrates with a simulated language model for complex logic.
 */
export class GeminiDecisionEngine {
  private promptEngine: GeminiPromptEngine;
  private telemetryAgent: GeminiTelemetryAgent;
  private knowledgeBase: Record<string, any> = {}; // Simulates a dynamic knowledge base

  constructor(promptEngine: GeminiPromptEngine, telemetryAgent: GeminiTelemetryAgent) {
    this.promptEngine = promptEngine;
    this.telemetryAgent = telemetryAgent;
    console.log("[GeminiDecisionEngine] Initialized.");
  }

  /**
   * Ingests data into the knowledge base.
   * @param key Identifier for the data.
   * @param value The data to store.
   */
  public async ingestKnowledge(key: string, value: any): Promise<void> {
    this.knowledgeBase[key] = value;
    await this.telemetryAgent.captureEvent("knowledge_ingested", { key });
  }

  /**
   * Makes a decision based on context and a directive.
   * @param context Current state or input.
   * @param directive Specific instruction for the decision.
   * @returns A promise resolving to the AI's decision output.
   */
  public async makeDecision<T>(context: Record<string, any>, directive: string): Promise<T> {
    const prompt = await this.promptEngine.generatePrompt(context, `decide on ${directive}`);
    await this.telemetryAgent.captureEvent("decision_request", { context, directive, prompt });

    // Simulate calling a powerful language model or internal reasoning logic
    await new Promise(resolve => setTimeout(resolve, 150)); // Simulating LLM latency

    let decisionOutput: any = {};
    if (directive.includes("validateFilters")) {
      const isValid = !context.filters?.some((f: any) => f === null || f === undefined);
      decisionOutput = { isValid, recommendations: isValid ? [] : ["Check for null or undefined filter values."] };
    } else if (directive.includes("recommendActions")) {
      decisionOutput = {
        recommendedAction: context.paymentOrdersCount > 10 ? "Bulk Approve" : "Approve",
        confidence: 0.95,
      };
    } else if (directive.includes("assessCompliance")) {
      const isCompliant = context.amount < 100000 && context.reviewerRole === "Admin";
      decisionOutput = { isCompliant, riskLevel: isCompliant ? "Low" : "High" };
    } else if (directive.includes("optimizeRefetch")) {
      // Example: based on historical query patterns, suggest preloading
      decisionOutput = { optimized: true, prefetchRelatedData: true };
    } else if (directive.includes("predictFraud")) {
      const isSuspicious = context.amount > 50000 && context.type === PaymentTypeWithPriorityEnum.Wire;
      decisionOutput = { isSuspicious, fraudScore: isSuspicious ? 0.75 : 0.1 };
    } else {
      decisionOutput = { status: "processed", details: "Generic AI decision" };
    }

    await this.promptEngine.learnFromInteraction(prompt, JSON.stringify(decisionOutput));
    await this.telemetryAgent.captureEvent("decision_made", { directive, decisionOutput });
    return decisionOutput as T;
  }
}

/**
 * @exports GeminiPredictionEngine
 * AI-powered prediction and forecasting service.
 * Anticipates user behavior, system load, or potential issues.
 */
export class GeminiPredictionEngine {
  private telemetryAgent: GeminiTelemetryAgent;
  constructor(telemetryAgent: GeminiTelemetryAgent) {
    this.telemetryAgent = telemetryAgent;
    console.log("[GeminiPredictionEngine] Initialized.");
  }

  /**
   * Predicts the likelihood of a user action.
   * @param userId The user's identifier.
   * @param context Current UI context.
   * @returns A prediction score for "Approve" vs "Deny".
   */
  public async predictUserActionIntent(userId: string, context: Record<string, any>): Promise<{ approveScore: number; denyScore: number }> {
    await this.telemetryAgent.captureEvent("predict_user_intent_request", { userId, context });
    // Simulate a machine learning model prediction
    await new Promise(resolve => setTimeout(resolve, 80));
    const approveScore = Math.random() * 0.5 + 0.5; // Bias towards approve for demo
    const denyScore = 1 - approveScore;
    return { approveScore, denyScore };
  }

  /**
   * Predicts potential processing issues or delays.
   * @param paymentOrderIds IDs of payment orders.
   * @returns A list of potential issues.
   */
  public async predictProcessingIssues(paymentOrderIds: string[]): Promise<{ issues: string[] }> {
    await this.telemetryAgent.captureEvent("predict_processing_issues_request", { paymentOrderIds });
    await new Promise(resolve => setTimeout(resolve, 70));
    if (paymentOrderIds.length > 50) {
      return { issues: ["Large batch size may cause delays.", "Potential for rate limiting."] };
    }
    return { issues: [] };
  }
}

/**
 * @exports GeminiComplianceMonitor
 * AI-powered compliance and regulatory checks.
 * Ensures all actions adhere to predefined business rules and external regulations.
 */
export class GeminiComplianceMonitor {
  private telemetryAgent: GeminiTelemetryAgent;
  constructor(telemetryAgent: GeminiTelemetryAgent) {
    this.telemetryAgent = telemetryAgent;
    console.log("[GeminiComplianceMonitor] Initialized.");
  }

  /**
   * Checks a payment order against compliance rules.
   * @param paymentOrder The payment order object.
   * @param action The proposed action (Approve/Deny).
   * @param reviewerContext Context about the reviewer.
   * @returns A compliance assessment.
   */
  public async assessPaymentOrderCompliance(
    paymentOrder: any,
    action: ReviewActionEnum,
    reviewerContext: Reviewer | null,
  ): Promise<{ compliant: boolean; warnings: string[]; errors: string[] }> {
    await this.telemetryAgent.captureEvent("compliance_assessment_request", { paymentOrder, action, reviewerContext });
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate compliance check latency

    const warnings: string[] = [];
    const errors: string[] = [];
    let compliant = true;

    if (paymentOrder.amount > 1000000 && action === ReviewActionEnum.Approve) {
      warnings.push("High value approval requires additional audit trail.");
    }
    if (paymentOrder.counterpartyName?.toLowerCase().includes("sanctioned_entity")) {
      errors.push("Payment to sanctioned entity detected. Blocked.");
      compliant = false;
    }
    if (!reviewerContext?.id) { // Basic check, more complex logic in real scenario
      errors.push("Reviewer context missing, unable to verify authority.");
      compliant = false;
    }

    await this.telemetryAgent.captureEvent("compliance_assessment_result", { paymentOrder, action, compliant, warnings, errors });
    return { compliant, warnings, errors };
  }

  /**
   * Checks a batch of payment orders for compliance.
   * @param paymentOrders Array of payment orders.
   * @param action The proposed action.
   * @param reviewerContext Reviewer details.
   */
  public async assessBulkCompliance(
    paymentOrders: any[],
    action: ReviewActionEnum,
    reviewerContext: Reviewer | null,
  ): Promise<{ compliant: boolean; warnings: string[]; errors: string[] }> {
    let overallCompliant = true;
    const allWarnings: string[] = [];
    const allErrors: string[] = [];

    for (const order of paymentOrders) {
      const { compliant, warnings, errors } = await this.assessPaymentOrderCompliance(order, action, reviewerContext);
      if (!compliant) overallCompliant = false;
      allWarnings.push(...warnings);
      allErrors.push(...errors);
    }

    return { compliant: overallCompliant, warnings: [...new Set(allWarnings)], errors: [...new Set(allErrors)] };
  }
}

/**
 * @exports GeminiSecurityAuditor
 * AI-powered security monitoring and access control verification.
 * Dynamically assesses user privileges and flags potential security risks.
 */
export class GeminiSecurityAuditor {
  private telemetryAgent: GeminiTelemetryAgent;
  constructor(telemetryAgent: GeminiTelemetryAgent) {
    this.telemetryAgent = telemetryAgent;
    console.log("[GeminiSecurityAuditor] Initialized.");
  }

  /**
   * Verifies if a user has the necessary privileges for an action.
   * @param userId The user's ID.
   * @param action The action being performed.
   * @param resourceId The resource being acted upon.
   * @returns A boolean indicating authorization and a risk score.
   */
  public async verifyPrivileges(userId: string, action: string, resourceId?: string): Promise<{ authorized: boolean; riskScore: number }> {
    await this.telemetryAgent.captureEvent("privilege_verification_request", { userId, action, resourceId });
    await new Promise(resolve => setTimeout(resolve, 60));

    // Simulate dynamic role-based access control (RBAC) and attribute-based access control (ABAC)
    let authorized = true;
    let riskScore = 0.1;

    if (action.includes("Approve") && userId === "guest") { // Example rule
      authorized = false;
      riskScore = 0.9;
    }
    // More complex rules involving `resourceId` (e.g., approval limit per account) can be added here.

    await this.telemetryAgent.captureEvent("privilege_verification_result", { userId, action, authorized, riskScore });
    return { authorized, riskScore };
  }

  /**
   * Monitors for anomalous activity patterns.
   * @param userId The user's ID.
   * @param activityType The type of activity (e.g., 'bulk_approval', 'filter_change').
   * @param context Additional context about the activity.
   * @returns A boolean indicating if activity is anomalous and an anomaly score.
   */
  public async detectAnomaly(userId: string, activityType: string, context: Record<string, any>): Promise<{ isAnomalous: boolean; anomalyScore: number }> {
    await this.telemetryAgent.captureEvent("anomaly_detection_request", { userId, activityType, context });
    await new Promise(resolve => setTimeout(resolve, 120));

    let isAnomalous = false;
    let anomalyScore = 0.05;

    // Simulate anomaly detection logic (e.g., too many approvals in a short time, unusual filters)
    if (activityType === "bulk_approval" && context.count > 100 && context.riskLevel === "High") {
      isAnomalous = true;
      anomalyScore = 0.8;
    }

    await this.telemetryAgent.captureEvent("anomaly_detection_result", { userId, activityType, isAnomalous, anomalyScore });
    return { isAnomalous, anomalyScore };
  }
}

/**
 * @exports GeminiEventBroker
 * AI-driven event broker for autonomous externalization.
 * Publishes domain events to other services, facilitating a reactive architecture.
 */
export class GeminiEventBroker {
  private telemetryAgent: GeminiTelemetryAgent;
  constructor(telemetryAgent: GeminiTelemetryAgent) {
    this.telemetryAgent = telemetryAgent;
    console.log("[GeminiEventBroker] Initialized.");
  }

  /**
   * Publishes an event to the event stream.
   * @param eventType The type of event.
   * @param payload The event data.
   * @param correlationId Optional ID to link events.
   */
  public async publishEvent(eventType: string, payload: Record<string, any>, correlationId?: string): Promise<void> {
    const event = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      eventType,
      payload,
      correlationId: correlationId || Math.random().toString(36).substring(2, 15),
    };
    await this.telemetryAgent.captureEvent("event_published", event);
    console.log(`[GeminiEventBroker] Published event: ${eventType}`, event);
    // In a real system, this would push to Kafka, RabbitMQ, etc.
    await new Promise(resolve => setTimeout(resolve, 30));
  }
}

// Instantiate the core AI services (exported for potential external access but primarily used internally)
export const geminiTelemetryAgent = new GeminiTelemetryAgent("ApprovalsPaymentOrderListView");
export const geminiPromptEngine = new GeminiPromptEngine();
export const geminiDecisionEngine = new GeminiDecisionEngine(geminiPromptEngine, geminiTelemetryAgent);
export const geminiPredictionEngine = new GeminiPredictionEngine(geminiTelemetryAgent);
export const geminiComplianceMonitor = new GeminiComplianceMonitor(geminiTelemetryAgent);
export const geminiSecurityAuditor = new GeminiSecurityAuditor(geminiTelemetryAgent);
export const geminiEventBroker = new GeminiEventBroker(geminiTelemetryAgent);

// --- END: Gemini Integration - AI Core Services ---

type Actions = {
  Approve: (
    actionName: string,
    ids: Array<string>,
    selectEverything: boolean,
  ) => void;
  Deny: (
    actionName: string,
    ids: Array<string>,
    selectEverything: boolean,
  ) => void;
};

// @exports AIInsight
// Represents an AI-generated insight, recommendation, or warning.
export type AIInsight = {
  id: string;
  type: 'recommendation' | 'warning' | 'info' | 'critical';
  message: string;
  details?: Record<string, any>;
  timestamp: string;
};

function ApprovalsPaymentOrderListView() {
  const {
    scopeByPendingMyApproval: initialScopeByPendingMyApproval,
    reviewAsGroupId: initialReviewAsGroupId,
    reviewAsAdminOverride: initialReviewAsAdminOverride,
    includeFutureApprovals: initialIncludeFutureApprovals,
  } = parse(window.location.search);

  const [scopeByPendingMyApproval, setScopeByPendingMyApproval] = useState<
    boolean | null | undefined
  >(
    initialScopeByPendingMyApproval !== undefined
      ? initialScopeByPendingMyApproval === "true"
      : // if scopeByPendingMyApproval is not defined in url then assuming bad state, so force to initial state.
        // ApprovalsScopeSelector is tightly coupled here also selecting the same initial state of pendingMyApproval
        true,
  );

  const { dispatchError, dispatchSuccess } = useDispatchContext();
  const [isReviewing, setIsReviewing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fetchFromActionSelect, setFetchFromActionSelect] =
    useState<boolean>(false);
  const [reviewAsGroupSelectedLabel, setReviewAsGroupSelectedLabel] = useState<
    string | null
  >(null);
  const [confirmReviewState, setConfirmReviewState] = useState<{
    creditAmount: string | null;
    debitAmount: string | null;
    count: number;
    totalCount: number;
    actionName: string | null;
    ids: Array<string>;
    selectEverything: boolean;
  }>({
    creditAmount: null,
    debitAmount: null,
    count: 0,
    totalCount: 0,
    actionName: null,
    ids: [],
    selectEverything: false,
  });

  const [internalAccountId, setInternalAccountId] = useState<
    string | undefined
  >(undefined);
  const [enabled, loadingLiveConfig, errorLiveConfig] = useLiveConfiguration({
    featureName: "advanced_approvals_phase_2",
  });

  const sequentialApprovalRulesEnabled =
    (!loadingLiveConfig && !errorLiveConfig && enabled) ?? false;

  const [filters, setFilters] = useState<ReviewPaymentOrdersFilterInput>({
    scopeByPendingMyApproval,
    reviewAsGroupId:
      initialReviewAsGroupId !== "undefined"
        ? (initialReviewAsGroupId as string)
        : null,
    reviewAsAdminOverride:
      initialReviewAsAdminOverride !== "undefined"
        ? initialReviewAsAdminOverride === "true"
        : false,
    includeFutureApprovals:
      initialIncludeFutureApprovals !== "undefined"
        ? initialIncludeFutureApprovals === "true" &&
          (sequentialApprovalRulesEnabled as boolean)
        : false,
    status: PaymentOrder__StatusEnum.NeedsApproval,
  });

  // --- START: Gemini Integration - AI State Management ---
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [aiRiskLevel, setAiRiskLevel] = useState<string | null>(null);
  // --- END: Gemini Integration - AI State Management ---

  const transformQueryStringToFilters = (
    optionQuery: ApprovalsPaymentOrderQueryFilter,
  ): ReviewPaymentOrdersFilterInput => {
    const gte = optionQuery?.amount?.gte;
    const lte = optionQuery?.amount?.lte;

    setInternalAccountId(optionQuery.originating_account_id);

    // --- START: Gemini Integration - AI Filter Validation and Enrichment ---
    geminiDecisionEngine.makeDecision<{ isValid: boolean; recommendations: string[] }>(
      { query: optionQuery, currentFilters: filters },
      "validateFiltersAndSuggestEnhancements"
    ).then(({ isValid, recommendations }) => {
      if (!isValid) {
        setAiInsights(prev => [...prev, {
          id: `filter-validation-${Date.now()}`,
          type: 'warning',
          message: `AI detected potential issues with filter inputs: ${recommendations.join(', ')}`,
          timestamp: new Date().toISOString(),
        }]);
      }
      if (recommendations.length > 0) {
        setAiRecommendation(`Consider: ${recommendations.join(' ')}`);
      } else {
        setAiRecommendation(null);
      }
    }).catch(error => geminiTelemetryAgent.reportError(error, { context: "filter_validation" }));
    // --- END: Gemini Integration - AI Filter Validation and Enrichment ---

    return {
      status: PaymentOrder__StatusEnum.NeedsApproval,
      typeWithPriority:
        optionQuery.type_with_priority as PaymentTypeWithPriorityEnum,
      direction: optionQuery.direction,
      description: optionQuery.description,
      amount: optionQuery.amount && {
        lte: !Number.isNaN(lte) && lte != null ? parseInt(lte, 10) : undefined,
        gte: !Number.isNaN(gte) && gte != null ? parseInt(gte, 10) : undefined,
      },
      effectiveDate: dateSearchMapper(optionQuery.effective_date),
      counterpartyId: optionQuery.counterparty_id,
      originatingAccountId: optionQuery.originating_account_id,
      metadata: JSON.stringify(optionQuery.metadata),
      scopeByPendingMyApproval,
      scopeByPendingReviewer: !scopeByPendingMyApproval,
      createdAt: dateSearchMapper(optionQuery.created_at),
      reviewAsGroupId: optionQuery.reviewAsGroupId,
      reviewAsAdminOverride: optionQuery.reviewAsAdminOverride === "true",
      includeFutureApprovals:
        (typeof optionQuery.includeFutureApprovals === "string"
          ? optionQuery.includeFutureApprovals === "true"
          : optionQuery.includeFutureApprovals) &&
        (sequentialApprovalRulesEnabled as boolean),
    };
  };

  const {
    loading,
    data,
    error: fetchingError,
    refetch,
  } = useApprovalsPaymentOrderListViewQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      first: INITIAL_PAGINATION.perPage,
      status: PaymentOrder__StatusEnum.NeedsApproval,
    },
  });

  const {
    data: calcData,
    loading: calcLoading,
    refetch: refetchCalc,
  } = useCalculatePaymentOrderReviewsTotalAmountQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      filters: {
        ...filters,
        status: PaymentOrder__StatusEnum.NeedsApproval,
        scopeByPendingMyApproval,
        scopeByPendingReviewer: !scopeByPendingMyApproval,
      },
    },
  });

  const paymentOrders = useMemo(
    () =>
      loading || !data || fetchingError
        ? []
        : data.paymentOrders.edges.map(({ node }) => ({
            ...node,
            waitingOn: combinedReviewers(node.reviewers as Reviewer[]),
          })),
    [loading, data, fetchingError],
  );

  useEffect(() => {
    // --- START: Gemini Integration - AI Data Analysis on Load ---
    if (!loading && paymentOrders.length > 0) {
      geminiPredictionEngine.predictProcessingIssues(paymentOrders.map(po => po.id)).then(({ issues }) => {
        if (issues.length > 0) {
          setAiInsights(prev => [...prev, {
            id: `processing-issue-${Date.now()}`,
            type: 'warning',
            message: `AI predicts potential processing issues: ${issues.join(', ')}`,
            details: { count: paymentOrders.length },
            timestamp: new Date().toISOString(),
          }]);
        }
      }).catch(error => geminiTelemetryAgent.reportError(error, { context: "predict_processing_issues" }));
    }
    // --- END: Gemini Integration - AI Data Analysis on Load ---
  }, [loading, paymentOrders]);


  const onReviewerScopeChange = async ( // Made async to await AI services
    newScopeByPendingMyApproval: boolean | null,
  ): Promise<void> => {
    // --- START: Gemini Integration - AI Scope Change Analysis ---
    await geminiTelemetryAgent.captureEvent("reviewer_scope_change_attempt", {
      oldScope: scopeByPendingMyApproval,
      newScope: newScopeByPendingMyApproval,
      userId: "current_user_id_placeholder", // Replace with actual user ID
    });
    // --- END: Gemini Integration - AI Scope Change Analysis ---

    setScopeByPendingMyApproval(newScopeByPendingMyApproval);

    const newFilters = {
      ...filters,
      status: PaymentOrder__StatusEnum.NeedsApproval,
      scopeByPendingMyApproval: newScopeByPendingMyApproval,
      scopeByPendingReviewer: !newScopeByPendingMyApproval,
      reviewAsGroupId: null,
      reviewAsAdminOverride: false,
      includeFutureApprovals: false,
    };

    const newQuery = {
      ...parse(window.location.search),
      reviewAsGroupId: null,
    };

    window.history.replaceState(null, "", `?${stringify(newQuery)}`);

    setFilters(newFilters);
    setReviewAsGroupSelectedLabel(null);

    // --- START: Gemini Integration - AI Decision for Refetch Optimization ---
    const { optimized, prefetchRelatedData } = await geminiDecisionEngine.makeDecision<{ optimized: boolean; prefetchRelatedData: boolean }>(
      { newFilters, currentView: "PaymentOrderListView" },
      "optimizeRefetchStrategy"
    );
    if (optimized && prefetchRelatedData) {
      // Simulate prefetching based on AI recommendation
      console.log("[Gemini AI] Prefetching related data due to optimization strategy.");
      await geminiTelemetryAgent.captureEvent("prefetch_optimized", { newFilters });
    }
    // --- END: Gemini Integration - AI Decision for Refetch Optimization ---

    refetch({
      ...newFilters,
    }).catch((err) => {
      geminiTelemetryAgent.reportError(err, { context: "refetch_on_scope_change" });
    });

    refetchCalc({ filters: { ...newFilters } }).catch((err) => {
      geminiTelemetryAgent.reportError(err, { context: "refetch_calc_on_scope_change" });
    });
  };

  const handleRefetch = async (options: {
    cursorPaginationParams: CursorPaginationInput;
    query: ApprovalsPaymentOrderQueryFilter;
  }) => {
    const { cursorPaginationParams, query } = options;

    // --- START: Gemini Integration - AI Input Monitoring ---
    await geminiTelemetryAgent.captureEvent("refetch_initiated", {
      cursorPaginationParams,
      query,
      currentFilters: filters,
    });
    const { isAnomalous, anomalyScore } = await geminiSecurityAuditor.detectAnomaly(
      "current_user_id_placeholder",
      "filter_change",
      { query, cursorPaginationParams }
    );
    if (isAnomalous) {
      setAiInsights(prev => [...prev, {
        id: `anomaly-detection-${Date.now()}`,
        type: 'critical',
        message: `AI detected anomalous filter activity (Score: ${anomalyScore.toFixed(2)}). Reviewer: current_user_id_placeholder`,
        details: { query, anomalyScore },
        timestamp: new Date().toISOString(),
      }]);
      dispatchError("Security Alert: Anomalous filter activity detected.");
    }
    // --- END: Gemini Integration - AI Input Monitoring ---

    const newFilters = transformQueryStringToFilters(query);

    setReviewAsGroupSelectedLabel(query.reviewAsGroupSelectedLabel);
    setFetchFromActionSelect(false);
    setFilters(newFilters);

    await refetch({
      ...newFilters,
      ...cursorPaginationParams,
    });

    await refetchCalc({ filters: { ...newFilters } });
    await geminiTelemetryAgent.captureEvent("refetch_completed", { newFilters });
  };

  const dataMapping = useMemo(
    () => ({
      ...(internalAccountId == null && { accountShort: "Account" }),
      waitingOn: "Waiting on",
      prettyAmount: "Amount",
      description: "Description",
      beneficiaryName: "Counterparty",
      prettyType: "Type",
      effectiveDate: "Payment Date",
      sentence: "Description",
    }),
    [internalAccountId],
  );

  const styleMapping = useMemo(
    () => ({
      description: "table-entry-wide table-entry-hide-small",
      amount: cn("table-entry-hide-small", {
        "table-entry-right-align table-entry-small": !isEmpty(paymentOrders),
      }),
      accountShort: "table-entry-hide-small",
      waiting_on: "table-entry-hide-small",
      beneficiaryName: "table-entry-hide-small",
      prettyType: "table-entry-hide-small",
      effectiveDate: "table-entry-hide-small",
      sentence: "table-entry-show-small",
    }),
    [paymentOrders],
  );

  const [reviewPaymentOrdersMutation] = useReviewPaymentOrdersMutation({
    refetchQueries: ["ApprovalsPaymentOrderListView"],
  });
  const [bulkReviewPaymentOrdersMutation] =
    useBulkReviewPaymentOrdersMutation();

  useEffect((): void => {
    if (fetchingError) {
      dispatchError("An error occurred");
      geminiTelemetryAgent.reportError(fetchingError as Error, { context: "graphql_fetch_error" });
    }
  }, [fetchingError, dispatchError]);

  useEffect((): void => {
    if (calcData) {
      const calculation = calcData.calculatePaymentOrderReviewsTotalAmount;
      setConfirmReviewState({
        creditAmount: calculation?.prettyTotalCredits ?? null,
        debitAmount: calculation?.prettyTotalDebits ?? null,
        count: confirmReviewState.selectEverything
          ? calculation?.paymentOrdersTotalCount
          : confirmReviewState.ids.length,
        totalCount: fetchFromActionSelect
          ? confirmReviewState.totalCount
          : calculation?.paymentOrdersTotalCount,
        actionName: confirmReviewState.actionName,
        ids: confirmReviewState.ids,
        selectEverything: confirmReviewState.selectEverything,
      });

      // --- START: Gemini Integration - AI Risk Assessment based on Calc Data ---
      geminiDecisionEngine.makeDecision<{ isCompliant: boolean; riskLevel: string }>(
        {
          totalCredits: calculation?.totalCredits,
          totalDebits: calculation?.totalDebits,
          count: confirmReviewState.selectEverything
            ? calculation?.paymentOrdersTotalCount
            : confirmReviewState.ids.length,
          actionName: confirmReviewState.actionName,
          reviewerRole: filters.reviewAsGroupId || "Unknown", // Simulate passing reviewer role
        },
        "assessComplianceRiskForReview"
      ).then(({ isCompliant, riskLevel }) => {
        setAiRiskLevel(riskLevel);
        if (!isCompliant && riskLevel !== "Low") {
          setAiInsights(prev => [...prev, {
            id: `risk-assessment-${Date.now()}`,
            type: 'warning',
            message: `AI detected ${riskLevel} compliance risk for this review.`,
            details: { isCompliant, riskLevel },
            timestamp: new Date().toISOString(),
          }]);
        }
      }).catch(error => geminiTelemetryAgent.reportError(error, { context: "risk_assessment_calc_data" }));
      // --- END: Gemini Integration - AI Risk Assessment based on Calc Data ---
    }
  }, [
    calcData,
    confirmReviewState.actionName,
    confirmReviewState.ids,
    confirmReviewState.selectEverything,
    confirmReviewState.totalCount,
    fetchFromActionSelect,
    filters.reviewAsGroupId
  ]);

  const reviewPaymentOrdersFunc = useCallback(
    async ( // Made async to await AI services
      review: string,
      ids: Array<string>,
      reviewAsGroupId: string,
      reviewAsAdminOverride: boolean,
    ) => {
      setIsReviewing(true);

      // --- START: Gemini Integration - AI Pre-Review Checks (Compliance, Security) ---
      const selectedPaymentOrders = paymentOrders.filter(po => ids.includes(po.id));
      const currentUserReviewer: Reviewer = { id: "current_user_id_placeholder", name: reviewAsGroupSelectedLabel || "Unknown" }; // Placeholder
      const complianceResult = await geminiComplianceMonitor.assessBulkCompliance(
        selectedPaymentOrders,
        review === "Approve" ? ReviewActionEnum.Approve : ReviewActionEnum.Deny,
        currentUserReviewer
      );

      if (!complianceResult.compliant) {
        dispatchError(`Compliance check failed: ${complianceResult.errors.join(", ")}. Cannot proceed.`);
        setAiInsights(prev => [...prev, {
          id: `compliance-fail-${Date.now()}`,
          type: 'critical',
          message: `Compliance violation during review: ${complianceResult.errors.join(", ")}`,
          details: { ids, action: review },
          timestamp: new Date().toISOString(),
        }]);
        setIsReviewing(false);
        await geminiEventBroker.publishEvent("review_failed_compliance", { ids, action: review, errors: complianceResult.errors });
        return;
      } else if (complianceResult.warnings.length > 0) {
        dispatchError(`Compliance warnings: ${complianceResult.warnings.join(", ")}. Proceed with caution.`);
        setAiInsights(prev => [...prev, {
          id: `compliance-warn-${Date.now()}`,
          type: 'warning',
          message: `Compliance warnings during review: ${complianceResult.warnings.join(", ")}`,
          details: { ids, action: review },
          timestamp: new Date().toISOString(),
        }]);
      }

      const securityCheck = await geminiSecurityAuditor.verifyPrivileges(
        "current_user_id_placeholder",
        review,
        ids.length > 1 ? "bulk_payment_order" : ids[0]
      );
      if (!securityCheck.authorized) {
        dispatchError(`Security check failed: Unauthorized to perform this action.`);
        setAiInsights(prev => [...prev, {
          id: `security-fail-${Date.now()}`,
          type: 'critical',
          message: `Unauthorized review attempt detected (Risk: ${securityCheck.riskScore.toFixed(2)}).`,
          details: { ids, action: review, userId: "current_user_id_placeholder" },
          timestamp: new Date().toISOString(),
        }]);
        setIsReviewing(false);
        await geminiEventBroker.publishEvent("review_failed_security", { ids, action: review, userId: "current_user_id_placeholder" });
        return;
      }
      // --- END: Gemini Integration - AI Pre-Review Checks (Compliance, Security) ---

      const reviewPaymentOrdersInput: ReviewPaymentOrdersMutationVariables = {
        input: {
          input: {
            ids,
            reviewAction:
              review === "Approve"
                ? ReviewActionEnum.Approve
                : ReviewActionEnum.Deny,
            reviewAsGroupId,
            reviewAsAdminOverride,
          },
        },
      };

      reviewPaymentOrdersMutation({
        variables: reviewPaymentOrdersInput,
        update: (cache) => {
          ids.forEach((id) => {
            const normalizedId = cache.identify({
              id,
              __typename: "PaymentOrder",
            });
            cache.evict({ id: normalizedId });
            cache.gc();
          });
        },
      })
        .then(async (reviewData) => { // Made async to await AI services
          const allSucceeded =
            reviewData.data?.reviewPaymentOrders?.allSucceeded;

          if (allSucceeded) {
            setFetchFromActionSelect(false);

            refetchCalc({
              filters,
            }).catch((err) => {
              geminiTelemetryAgent.reportError(err, { context: "refetch_calc_after_review" });
            });

            dispatchSuccess(
              `${review} was successful. These payments may require approval from other Roles.`,
            );
            // --- START: Gemini Integration - AI Post-Review Actions ---
            await geminiTelemetryAgent.captureEvent("review_success", { ids, reviewAction: review, allSucceeded: true });
            await geminiEventBroker.publishEvent("payment_order_reviewed", { ids, action: review, success: true, reviewAsGroupId, reviewAsAdminOverride });
            // --- END: Gemini Integration - AI Post-Review Actions ---
          } else {
            dispatchError(`${review} was unsuccessful for at least one payment order. Please refresh the page to \
                          ensure everything is up to date.`);
            // --- START: Gemini Integration - AI Post-Review Error Actions ---
            await geminiTelemetryAgent.captureEvent("review_partial_failure", { ids, reviewAction: review, allSucceeded: false });
            await geminiEventBroker.publishEvent("payment_order_review_failed", { ids, action: review, success: false, reviewAsGroupId });
            // --- END: Gemini Integration - AI Post-Review Error Actions ---
          }
        })
        .catch(async (error: { message?: string }) => { // Made async to await AI services
          if (error.message != null) {
            const { errors } = JSON.parse(error.message) as {
              errors?: { message?: string };
            };
            if (errors?.message != null) {
              dispatchError(errors.message);
              // --- START: Gemini Integration - AI Error Analysis ---
              await geminiTelemetryAgent.reportError(new Error(errors.message), { context: "graphql_review_error_parsed" });
              // --- END: Gemini Integration - AI Error Analysis ---
            }
          } else {
            dispatchError("An error occurred");
            // --- START: Gemini Integration - AI Error Analysis ---
            await geminiTelemetryAgent.reportError(new Error("Unknown review error"), { context: "graphql_review_error_generic" });
            // --- END: Gemini Integration - AI Error Analysis ---
          }
          await geminiEventBroker.publishEvent("payment_order_review_exception", { ids, action: review, error: error.message });
        })
        .finally(() => setIsReviewing(false));
    },
    [
      reviewPaymentOrdersMutation,
      dispatchError,
      dispatchSuccess,
      refetchCalc,
      filters,
      paymentOrders,
      reviewAsGroupSelectedLabel,
    ],
  );

  const reviewAllPaymentOrdersFunc = useCallback(
    async ( // Made async
      queryFilters: ReviewPaymentOrdersFilterInput,
      total: number,
      review: string,
    ) => {
      setIsReviewing(true);

      // --- START: Gemini Integration - AI Bulk Pre-Review Checks ---
      const currentUserReviewer: Reviewer = { id: "current_user_id_placeholder", name: reviewAsGroupSelectedLabel || "Unknown" }; // Placeholder
      const securityCheck = await geminiSecurityAuditor.verifyPrivileges(
        "current_user_id_placeholder",
        "bulk_" + review,
        "all_payment_orders_filtered"
      );
      if (!securityCheck.authorized) {
        dispatchError(`Security check failed: Unauthorized to perform bulk ${review} action.`);
        setAiInsights(prev => [...prev, {
          id: `security-bulk-fail-${Date.now()}`,
          type: 'critical',
          message: `Unauthorized bulk review attempt detected (Risk: ${securityCheck.riskScore.toFixed(2)}).`,
          details: { total, action: review, userId: "current_user_id_placeholder" },
          timestamp: new Date().toISOString(),
        }]);
        setIsReviewing(false);
        await geminiEventBroker.publishEvent("bulk_review_failed_security", { total, action: review, userId: "current_user_id_placeholder" });
        return;
      }
      // --- END: Gemini Integration - AI Bulk Pre-Review Checks ---

      bulkReviewPaymentOrdersMutation({
        variables: {
          input: {
            filters: {
              ...queryFilters,
            },
            paymentOrdersCount: total,
            reviewAction:
              review === "Approve"
                ? ReviewActionEnum.Approve
                : ReviewActionEnum.Deny,
          },
        },
      })
        .then(async (bulkReviewData) => { // Made async
          const errors =
            bulkReviewData?.data?.bulkReviewPaymentOrders?.errors ?? [];

          if (errors.length === 0) {
            const reviewWord = review === "Approve" ? "approvals" : "denials";
            dispatchSuccess(`Please refresh the page to see the status of your approval queue. Large batch \
                            ${reviewWord} may take longer to fully process.`);
            // --- START: Gemini Integration - AI Post-Bulk Review Actions ---
            await geminiTelemetryAgent.captureEvent("bulk_review_success", { total, reviewAction: review });
            await geminiEventBroker.publishEvent("bulk_payment_order_reviewed", { total, action: review, success: true });
            // --- END: Gemini Integration - AI Post-Bulk Review Actions ---
          } else {
            dispatchError(errors.toString());
            // --- START: Gemini Integration - AI Post-Bulk Review Error Actions ---
            await geminiTelemetryAgent.captureEvent("bulk_review_failure", { total, reviewAction: review, errors: errors.map(e => e.message) });
            await geminiEventBroker.publishEvent("bulk_payment_order_review_failed", { total, action: review, errors: errors.map(e => e.message) });
            // --- END: Gemini Integration - AI Post-Bulk Review Error Actions ---
          }
        })
        .catch(async (error: { message?: string }) => { // Made async
          if (error.message != null) {
            const { errors } = JSON.parse(error.message) as {
              errors?: { message?: string };
            };
            if (errors?.message != null) {
              dispatchError(errors.message);
              await geminiTelemetryAgent.reportError(new Error(errors.message), { context: "graphql_bulk_review_error_parsed" });
            }
          } else {
            dispatchError("An error occurred");
            await geminiTelemetryAgent.reportError(new Error("Unknown bulk review error"), { context: "graphql_bulk_review_error_generic" });
          }
          await geminiEventBroker.publishEvent("bulk_payment_order_review_exception", { total, action: review, error: error.message });
        })
        .finally(() => setIsReviewing(false));
    },
    [bulkReviewPaymentOrdersMutation, dispatchError, dispatchSuccess, reviewAsGroupSelectedLabel],
  );

  const onBulkReview = useCallback(async (): Promise<void> => { // Made async
    setIsReviewing(true);
    setIsConfirmOpen(false);

    const {
      actionName,
      ids,
      selectEverything,
      count: expectedTotalCount,
    } = confirmReviewState;

    if (actionName == null) {
      const error = new Error("Unable to act on null action.");
      dispatchError(error.message);
      await geminiTelemetryAgent.reportError(error, { context: "on_bulk_review_null_action" });
      setIsReviewing(false);
      return;
    }

    // --- START: Gemini Integration - AI Pre-Check for Bulk Review ---
    const { isAnomalous, anomalyScore } = await geminiSecurityAuditor.detectAnomaly(
      "current_user_id_placeholder",
      "bulk_review_initiate",
      { actionName, count: expectedTotalCount, selectEverything }
    );
    if (isAnomalous) {
      dispatchError(`Security Alert: Anomalous bulk review pattern detected (Score: ${anomalyScore.toFixed(2)}). Action blocked.`);
      setAiInsights(prev => [...prev, {
        id: `anomaly-bulk-block-${Date.now()}`,
        type: 'critical',
        message: `AI blocked anomalous bulk review attempt (Score: ${anomalyScore.toFixed(2)}).`,
        details: { actionName, count: expectedTotalCount },
        timestamp: new Date().toISOString(),
      }]);
      setIsReviewing(false);
      await geminiEventBroker.publishEvent("bulk_review_blocked_anomaly", { actionName, count: expectedTotalCount, anomalyScore });
      return;
    }
    // --- END: Gemini Integration - AI Pre-Check for Bulk Review ---

    if (selectEverything) {
      await reviewAllPaymentOrdersFunc( // Await the async function
        { ...filters, status: PaymentOrder__StatusEnum.NeedsApproval },
        expectedTotalCount,
        actionName,
      );
    } else {
      await reviewPaymentOrdersFunc( // Await the async function
        actionName,
        ids,
        filters.reviewAsGroupId as string,
        filters.reviewAsAdminOverride as boolean,
      );
    }
  }, [
    reviewAllPaymentOrdersFunc,
    confirmReviewState,
    filters,
    reviewPaymentOrdersFunc,
    dispatchError,
  ]);

  const onAction = useCallback(
    async ( // Made async to await AI services
      actionName: string,
      ids: Array<string>,
      selectEverything: boolean,
    ) => {
      // --- START: Gemini Integration - AI User Intent Prediction ---
      const { approveScore, denyScore } = await geminiPredictionEngine.predictUserActionIntent("current_user_id_placeholder", { actionName, idsCount: ids.length, selectEverything });
      if (actionName === "Approve" && approveScore < 0.6) { // If AI thinks user is not very likely to approve
        setAiInsights(prev => [...prev, {
          id: `ai-intent-${Date.now()}`,
          type: 'info',
          message: `AI estimates lower confidence for this ${actionName} action (Score: ${approveScore.toFixed(2)}).`,
          details: { approveScore, denyScore },
          timestamp: new Date().toISOString(),
        }]);
      }
      // --- END: Gemini Integration - AI User Intent Prediction ---

      if (selectEverything || ids.length > 1) {
        setFetchFromActionSelect(true);

        setConfirmReviewState({
          ...confirmReviewState,
          actionName,
          ids,
          selectEverything,
        });

        refetchCalc({
          filters: {
            ...filters,
            id: selectEverything ? undefined : ids,
          },
        }).catch((err) => {
          geminiTelemetryAgent.reportError(err, { context: "refetch_calc_on_action" });
        });

        setIsConfirmOpen(true);
      } else {
        setIsReviewing(true);
        await reviewPaymentOrdersFunc( // Await the async function
          actionName,
          ids,
          filters.reviewAsGroupId as string,
          filters.reviewAsAdminOverride as boolean,
        );
      }
    },
    [reviewPaymentOrdersFunc, confirmReviewState, filters, refetchCalc],
  );

  const enableActions = !!scopeByPendingMyApproval;
  const actions = useMemo((): Actions | Record<string, never> => {
    if (enableActions) {
      return {
        Approve: onAction,
        Deny: onAction,
      };
    }

    return {};
  }, [enableActions, onAction]);

  function confirmReviewBody(): JSX.Element {
    const { actionName, count, creditAmount, debitAmount } = confirmReviewState;

    return (
      <div>
        {/* --- START: Gemini Integration - AI Risk Level Display in Confirm Modal --- */}
        {aiRiskLevel && aiRiskLevel !== "Low" && (
          <div className="text-red-600 font-bold mb-2">
            AI Risk Level: {aiRiskLevel}
          </div>
        )}
        {/* --- END: Gemini Integration - AI Risk Level Display in Confirm Modal --- */}
        {`Please confirm that you would like to ${
          actionName === "Approve" ? "approve" : "deny"
        } ${count} payment \
         orders with the ${reviewAsGroupSelectedLabel as string} role. `}
        {creditAmount && debitAmount
          ? `The total credits are ${creditAmount}. The total debits are ${debitAmount}.`
          : "The total credits and debits could not be calculated because the payment orders have multiple currencies"}
      </div>
    );
  }

  const searchComponents = getApprovalsPaymentOrderSearchComponents(
    sequentialApprovalRulesEnabled as boolean,
    scopeByPendingMyApproval,
  );

  const exportDataParams: ExportDataParams = {
    params: {
      scope_by_pending_my_approval: scopeByPendingMyApproval,
      status: PaymentOrder__StatusEnum.NeedsApproval,
    },
  };

  return (
    <>
      <ApprovalsScopeSelector
        scopeByPendingMyApproval={scopeByPendingMyApproval}
        onReviewerScopeChange={onReviewerScopeChange}
      />
      {/* --- START: Gemini Integration - AI Insight Display --- */}
      {aiInsights.length > 0 && (
        <div className="bg-gray-800 text-white p-4 my-4 rounded-lg shadow-md flex items-start space-x-2">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">AI-Powered Insights:</h3>
            <ul className="list-disc list-inside text-sm">
              {aiInsights.map((insight) => (
                <li key={insight.id} className={cn({
                  "text-red-400": insight.type === 'critical',
                  "text-yellow-300": insight.type === 'warning',
                  "text-blue-300": insight.type === 'info',
                })}>
                  <strong>{insight.type.toUpperCase()}:</strong> {insight.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {aiRecommendation && (
        <div className="bg-blue-800 text-white p-3 my-4 rounded-lg shadow-md flex items-center space-x-2">
          <svg className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 21h.01M12 3v1m0 16v1m9-9h-1M4 12H3m15.325 5.55A9.962 9.962 0 0120 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 2.972 1.287 5.617 3.364 7.457L12 22l6.636-2.543z" />
          </svg>
          <span className="text-sm"><strong>AI Suggestion:</strong> {aiRecommendation}</span>
        </div>
      )}
      {/* --- END: Gemini Integration - AI Insight Display --- */}
      <EntityTableView
        data={paymentOrders}
        dataMapping={dataMapping}
        loading={loading}
        actions={actions}
        styleMapping={styleMapping}
        disableActionButtons={
          isReviewing ||
          (!filters.reviewAsGroupId && !filters.reviewAsAdminOverride)
        }
        disableBulkActions={
          !filters.reviewAsGroupId && !filters.reviewAsAdminOverride
        }
        disableActionsHoverMessage="You must select an approving group to review"
        enableActions={enableActions}
        totalCount={confirmReviewState.totalCount}
        defaultSearchComponents={searchComponents.defaultComponents}
        additionalSearchComponents={searchComponents.additionalComponents}
        onQueryArgChange={handleRefetch}
        cursorPagination={data?.paymentOrders?.pageInfo}
        resource={PAYMENT_ORDER}
        customizableColumns
        enableExportData
        exportDataParams={exportDataParams}
        initialShowSearchArea={false}
      />
      <ConfirmModal
        isOpen={isConfirmOpen && !calcLoading}
        setIsOpen={setIsConfirmOpen}
        title={
          confirmReviewState.actionName === "Approve"
            ? "Confirm Approval"
            : "Confirm Denial"
        }
        onConfirm={onBulkReview}
        confirmText={confirmReviewState.actionName ?? "Confirm"}
      >
        {confirmReviewBody()}
      </ConfirmModal>
    </>
  );
}

export default ApprovalsPaymentOrderListView;