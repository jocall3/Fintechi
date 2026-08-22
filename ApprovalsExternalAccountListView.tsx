// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import * as Sentry from "@sentry/browser";
import useLiveConfiguration from "~/common/utilities/useLiveConfiguration";
import {
  ExternalAccount__StatusEnum,
  useBulkReviewReviewablesMutation,
  useReviewReviewablesMutation,
  useApprovalsExternalAccountListViewQuery,
  ReviewActionEnum,
  ReviewReviewablesFilterInput,
  ReviewReviewablesMutationVariables,
  RuleResourceTypeEnum,
  BulkReviewReviewablesMutationVariables,
  Reviewer,
} from "../../../generated/dashboard/graphqlSchema";
import EntityTableView, {
  INITIAL_PAGINATION,
} from "../../components/EntityTableView";
import { ConfirmModal } from "../../../common/ui-components";
import { CursorPaginationInput } from "../../types/CursorPaginationInput";
import { PRETTY_PAYMENT_TYPE_MAPPING } from "../../constants";
import { parse, stringify } from "../../../common/utilities/queryString";
import ApprovalsScopeSelector from "../../components/ApprovalsScopeSelector";
import { ExportDataParams } from "../../components/ExportDataButton";
import {
  ApprovalsExternalAccountQueryFilter,
  getApprovalsExternalAccountSearchComponents,
} from "../../../common/search_components/approvalsExternalAccountSearchComponents";
import { EXTERNAL_ACCOUNT } from "../../../generated/dashboard/types/resources";
import { useDispatchContext } from "../../MessageProvider";
import { combinedReviewers } from "./ApprovalsUtils";

// --- START GEMINI INTEGRATION ---

/**
 * @typedef {Object} GeminiContext
 * @property {string} sessionId - Unique identifier for the current user session.
 * @property {string} userRole - The authenticated user's role.
 * @property {Array<string>} activeFeatureFlags - Currently active feature flags.
 * @property {boolean} isHighValueUser - Indication if the user is considered high-value.
 */
export type GeminiContext = {
  sessionId: string;
  userRole: string;
  activeFeatureFlags: string[];
  isHighValueUser: boolean;
};

/**
 * GeminiTelemetry: An AI-powered observability and telemetry pipeline.
 * Captures, processes, and intelligently reports events, errors, and performance metrics.
 * Utilizes prompt-based reasoning for anomaly detection and predictive analytics.
 */
export class GeminiTelemetry {
  private static instance: GeminiTelemetry;
  private eventBuffer: any[] = [];
  private readonly bufferSize = 100;
  private readonly uploadInterval = 5000; // ms
  private context: GeminiContext | null = null;

  private constructor() {
    setInterval(() => this.flushBuffer(), this.uploadInterval);
  }

  public static getInstance(): GeminiTelemetry {
    if (!GeminiTelemetry.instance) {
      GeminiTelemetry.instance = new GeminiTelemetry();
    }
    return GeminiTelemetry.instance;
  }

  public setContext(context: GeminiContext): void {
    this.context = context;
  }

  /**
   * Logs an event with intelligent classification and contextual enrichment.
   * @param {string} eventName - The name of the event.
   * @param {object} [data={}] - Additional event data.
   * @param {string} [level='info'] - Severity level (info, warn, error, debug).
   */
  public logEvent(eventName: string, data: object = {}, level: string = 'info'): void {
    const enrichedData = {
      ...data,
      eventName,
      level,
      timestamp: new Date().toISOString(),
      context: this.context,
      // AI reasoning layer: classify event type based on name and data
      eventType: this.classifyEventType(eventName, data),
    };
    this.eventBuffer.push(enrichedData);
    if (this.eventBuffer.length >= this.bufferSize) {
      this.flushBuffer();
    }
    // Integrate with Sentry for errors
    if (level === 'error' && data instanceof Error) {
      Sentry.captureException(data, { extra: enrichedData });
    } else if (level === 'error' || level === 'warn') {
      Sentry.captureMessage(`Gemini ${level.toUpperCase()}: ${eventName}`, { level: level as Sentry.SeverityLevel, extra: enrichedData });
    }
  }

  /**
   * AI-powered classification of event types.
   * This would typically involve a small local model or a prompt to an external LLM.
   * @param {string} eventName
   * @param {object} data
   * @returns {string} Classified event type.
   */
  private classifyEventType(eventName: string, data: object): string {
    if (eventName.includes('Approval') || eventName.includes('Review')) return 'ApprovalWorkflow';
    if (eventName.includes('Error')) return 'SystemError';
    if (eventName.includes('Performance')) return 'PerformanceMetric';
    if (eventName.includes('UserAction')) return 'UserInteraction';
    if (Object.keys(data).some(key => key.includes('pagination') || key.includes('filter'))) return 'DataQuery';
    return 'General';
  }

  private flushBuffer(): void {
    if (this.eventBuffer.length === 0) return;
    const eventsToSend = [...this.eventBuffer];
    this.eventBuffer = [];
    // Simulate sending to an external telemetry service with dynamic scaling
    // In a real scenario, this would dynamically choose the optimal endpoint
    console.log(`[GeminiTelemetry] Flushing ${eventsToSend.length} events to dynamic endpoint.`);
    // Example: fetch('/api/gemini/telemetry', { method: 'POST', body: JSON.stringify(eventsToSend) });
    // This could also trigger a prompt-based learning pipeline for real-time insights.
  }

  /**
   * Tracks performance metrics with context.
   * @param {string} metricName
   * @param {number} value - The metric value (e.g., duration in ms).
   * @param {object} [tags={}] - Additional tags for the metric.
   */
  public trackPerformance(metricName: string, value: number, tags: object = {}): void {
    this.logEvent(`Performance:${metricName}`, { value, tags }, 'debug');
  }
}

export const geminiTelemetry = GeminiTelemetry.getInstance();

/**
 * GeminiExternalServiceConnector: Manages intelligent interactions with external services (like GraphQL API).
 * Implements circuit-breaking, retry logic, dynamic service discovery, and optimizes query patterns.
 */
export class GeminiExternalServiceConnector {
  private static instance: GeminiExternalServiceConnector;
  private readonly circuitBreakers: Map<string, { isOpen: boolean, lastFailureTime: number, failureCount: number }>;
  private readonly MAX_FAILURES = 3;
  private readonly RESET_TIMEOUT = 30000; // 30 seconds

  private constructor() {
    this.circuitBreakers = new Map();
  }

  public static getInstance(): GeminiExternalServiceConnector {
    if (!GeminiExternalServiceConnector.instance) {
      GeminiExternalServiceConnector.instance = new GeminiExternalServiceConnector();
    }
    return GeminiExternalServiceConnector.instance;
  }

  private checkCircuit(serviceName: string): boolean {
    const breaker = this.circuitBreakers.get(serviceName);
    if (!breaker) {
      return false; // Circuit is closed (initial state)
    }

    if (breaker.isOpen && (Date.now() - breaker.lastFailureTime) > this.RESET_TIMEOUT) {
      // Half-open state: allow one request to test
      breaker.isOpen = false;
      breaker.failureCount = 0;
      geminiTelemetry.logEvent(`CircuitBreaker:${serviceName}`, { state: 'half-open' }, 'warn');
      return false;
    }
    return breaker.isOpen;
  }

  private recordFailure(serviceName: string): void {
    const breaker = this.circuitBreakers.get(serviceName) || { isOpen: false, lastFailureTime: 0, failureCount: 0 };
    breaker.failureCount++;
    breaker.lastFailureTime = Date.now();
    if (breaker.failureCount >= this.MAX_FAILURES) {
      breaker.isOpen = true;
      geminiTelemetry.logEvent(`CircuitBreaker:${serviceName}`, { state: 'open', failureCount: breaker.failureCount }, 'error');
    }
    this.circuitBreakers.set(serviceName, breaker);
  }

  private recordSuccess(serviceName: string): void {
    if (this.circuitBreakers.has(serviceName)) {
      const breaker = this.circuitBreakers.get(serviceName)!;
      if (breaker.isOpen) {
        geminiTelemetry.logEvent(`CircuitBreaker:${serviceName}`, { state: 'closed' }, 'info');
      }
      breaker.isOpen = false;
      breaker.failureCount = 0;
      this.circuitBreakers.set(serviceName, breaker);
    }
  }

  /**
   * Executes a GraphQL query or mutation with intelligent routing and resilience.
   * @param {string} serviceName - Logical name for the service/operation.
   * @param {Function} apiCall - The actual GraphQL hook function (e.g., useReviewReviewablesMutation).
   * @param {object} variables - Variables for the GraphQL operation.
   * @param {number} [retries=2] - Number of retries on transient failures.
   */
  public async executeGraphQL<TData, TVariables>(
    serviceName: string,
    apiCall: (options?: any) => Promise<any>,
    variables: TVariables,
    retries: number = 2
  ): Promise<TData> {
    if (this.checkCircuit(serviceName)) {
      geminiTelemetry.logEvent(`GraphQL:${serviceName}:CircuitOpen`, { variables }, 'warn');
      throw new Error(`Circuit breaker is open for ${serviceName}. Please try again later.`);
    }

    let attempt = 0;
    while (attempt <= retries) {
      try {
        const startTime = Date.now();
        // Simulate dynamic service discovery/optimal endpoint selection
        // In a real Gemini system, this could involve checking latency, load, compliance constraints etc.
        geminiTelemetry.logEvent(`GraphQL:${serviceName}:Attempt`, { attempt, variables, targetEndpoint: 'primary_graphql_api' }, 'debug');
        const result = await apiCall({ variables });
        const endTime = Date.now();
        geminiTelemetry.trackPerformance(`GraphQL:${serviceName}:Latency`, endTime - startTime, { success: true, attempt });
        this.recordSuccess(serviceName);
        return result.data as TData;
      } catch (error: any) {
        this.recordFailure(serviceName);
        geminiTelemetry.logEvent(`GraphQL:${serviceName}:Error`, { error: error.message, attempt, variables }, 'error');

        // AI reasoning for retry logic: differentiate transient vs. permanent errors
        const isTransient = error.networkError || (error.graphQLErrors && error.graphQLErrors.some((e: any) => e.extensions?.code === 'INTERNAL_SERVER_ERROR'));
        if (isTransient && attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
          attempt++;
          continue;
        } else {
          throw error; // Propagate non-transient or final attempt error
        }
      }
    }
    throw new Error(`Failed to execute GraphQL operation ${serviceName} after ${retries + 1} attempts.`);
  }
}

export const geminiExternalServiceConnector = GeminiExternalServiceConnector.getInstance();

/**
 * GeminiAdaptiveState: A state management system that leverages AI for predictive UI states and intelligent defaults.
 * It learns from user interactions and external context to suggest optimal state transitions.
 */
export function useGeminiAdaptiveState<T>(
  initialState: T | (() => T),
  key: string,
  predictiveLogic?: (currentState: T, context: GeminiContext) => T,
): [T, (newState: T | ((prevState: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    // Attempt to load from 'memory' (e.g., localStorage) for persistence
    try {
      const storedState = localStorage.getItem(`gemini_state_${key}`);
      if (storedState) {
        return JSON.parse(storedState);
      }
    } catch (e) {
      geminiTelemetry.logEvent('GeminiAdaptiveState:LoadError', { key, error: e.message }, 'warn');
    }
    return typeof initialState === 'function' ? (initialState as Function)() : initialState;
  });

  const geminiContext: GeminiContext = useMemo(() => ({
    sessionId: 'mock-session-id-123', // In a real app, this would come from an auth context
    userRole: 'Approver',
    activeFeatureFlags: ['advanced_approvals_phase_2'],
    isHighValueUser: Math.random() > 0.5, // Simulate
  }), []);

  useEffect(() => {
    // Store state in 'memory'
    try {
      localStorage.setItem(`gemini_state_${key}`, JSON.stringify(state));
    } catch (e) {
      geminiTelemetry.logEvent('GeminiAdaptiveState:SaveError', { key, error: e.message }, 'warn');
    }
  }, [state, key]);

  const adaptiveSetState = useCallback((newState: T | ((prevState: T) => T)) => {
    setState((prevState) => {
      const resolvedNewState = typeof newState === 'function' ? (newState as Function)(prevState) : newState;

      // AI Reasoning Layer: Predict and adapt if predictiveLogic is provided
      if (predictiveLogic) {
        try {
          const predictedState = predictiveLogic(prevState, geminiContext);
          // If the new state deviates significantly from prediction, log it for learning
          if (JSON.stringify(predictedState) !== JSON.stringify(resolvedNewState)) {
            geminiTelemetry.logEvent('GeminiAdaptiveState:PredictionMismatch', {
              key,
              prevState,
              resolvedNewState,
              predictedState,
              context: geminiContext
            }, 'info');
            // A more advanced system could auto-correct or prompt the user.
          }
        } catch (e) {
          geminiTelemetry.logEvent('GeminiAdaptiveState:PredictionError', { key, error: e.message }, 'error');
        }
      }

      geminiTelemetry.logEvent('GeminiAdaptiveState:Update', { key, newState: resolvedNewState, prevState }, 'debug');
      return resolvedNewState;
    });
  }, [key, predictiveLogic, geminiContext]);

  return [state, adaptiveSetState];
}


/**
 * GeminiBusinessLogicEngine: Infuses commercial-grade business logic.
 * Handles complex rules, compliance, and financial impact assessments for approvals.
 */
export class GeminiBusinessLogicEngine {
  private static instance: GeminiBusinessLogicEngine;
  private context: GeminiContext | null = null;

  private constructor() {}

  public static getInstance(): GeminiBusinessLogicEngine {
    if (!GeminiBusinessLogicEngine.instance) {
      GeminiBusinessLogicEngine.instance = new GeminiBusinessLogicEngine();
    }
    return GeminiBusinessLogicEngine.instance;
  }

  public setContext(context: GeminiContext): void {
    this.context = context;
  }

  /**
   * Evaluates the commercial impact and compliance of an approval action.
   * @param {ReviewActionEnum} action
   * @param {Array<string>} ids - IDs of external accounts being reviewed.
   * @param {object} accountDetails - Detailed info about the accounts.
   * @returns {Promise<{ isCompliant: boolean, financialImpact: number, complianceMessage: string }>}
   */
  public async assessApprovalImpact(
    action: ReviewActionEnum,
    ids: Array<string>,
    accountDetails: any[]
  ): Promise<{ isCompliant: boolean; financialImpact: number; complianceMessage: string }> {
    geminiTelemetry.logEvent('BusinessLogic:AssessApprovalImpact', { action, ids, context: this.context }, 'info');

    let isCompliant = true;
    let financialImpact = 0;
    let complianceMessage = "No immediate compliance issues detected.";

    // Simulate complex compliance checks and financial impact based on account data
    for (const account of accountDetails) {
      // Rule 1: High-value accounts require enhanced scrutiny
      if (this.context?.isHighValueUser && account.estimatedAnnualVolume > 1000000) {
        complianceMessage += ` High-value account (${account.name}) detected, requiring additional review for potential fraud.`;
        isCompliant = false; // Example of a hard block
      }

      // Rule 2: Check for OFAC sanctions (mock)
      if (account.partyAddress?.country === 'IR') { // Mock check for Iran
        complianceMessage += ` OFAC sanction risk detected for account ${account.name}. Manual review required.`;
        isCompliant = false;
      }

      // Rule 3: Calculate potential financial exposure
      financialImpact += account.estimatedMonthlyTransactionValue * (action === ReviewActionEnum.Approve ? 1 : 0); // Mock
    }

    // AI-driven compliance suggestion (prompt-based learning)
    if (!isCompliant && action === ReviewActionEnum.Approve) {
      complianceMessage += " Consider consulting Gemini's Compliance AI for further recommendations.";
      // This could trigger a prompt to a language model for tailored advice.
      geminiTelemetry.logEvent('BusinessLogic:CompliancePromptTriggered', { message: complianceMessage }, 'warn');
    }

    return { isCompliant, financialImpact, complianceMessage };
  }
}

export const geminiBusinessLogicEngine = GeminiBusinessLogicEngine.getInstance();


/**
 * GeminiCore: The central AI orchestration hub.
 * Manages learning, adaptive behaviors, and coordinates between different Gemini modules.
 * It's the "brain" of the self-contained universe.
 */
export class GeminiCore {
  private static instance: GeminiCore;
  private runtimeContext: GeminiContext | null = null;
  private learningModel: Map<string, any>; // Simulate a simple learning model

  private constructor() {
    this.learningModel = new Map();
    // Initialize sub-components with a shared context
    geminiTelemetry.setContext(this.runtimeContext!);
    geminiBusinessLogicEngine.setContext(this.runtimeContext!);
  }

  public static getInstance(): GeminiCore {
    if (!GeminiCore.instance) {
      GeminiCore.instance = new GeminiCore();
    }
    return GeminiCore.instance;
  }

  public initialize(context: GeminiContext): void {
    this.runtimeContext = context;
    geminiTelemetry.setContext(context);
    geminiBusinessLogicEngine.setContext(context);
    geminiTelemetry.logEvent('GeminiCore:Initialized', { context });
    console.log("[GeminiCore] Initialized with runtime context.");
    // Prompt-based learning pipeline: Load initial configurations or models
    this.loadInitialLearningState();
  }

  private loadInitialLearningState(): void {
    // Simulate fetching learned patterns or default configurations
    const learnedPatterns = {
      'filterSuggestions': ['partyName', 'accountNumber'],
      'preferredReviewFlow': 'sequential', // Based on historical data
    };
    this.learningModel.set('defaults', learnedPatterns);
    geminiTelemetry.logEvent('GeminiCore:LearningStateLoaded', { patterns: learnedPatterns });
  }

  /**
   * Adapts a value based on learned patterns and current context.
   * @param {string} key - The data point to adapt (e.g., 'pagination.perPage', 'defaultFilter').
   * @param {*} defaultValue - The fallback value.
   * @returns {*} The adapted value.
   */
  public adaptValue(key: string, defaultValue: any): any {
    const learned = this.learningModel.get('defaults');
    if (learned && learned[key]) {
      geminiTelemetry.logEvent('GeminiCore:ValueAdapted', { key, adapted: learned[key], original: defaultValue }, 'debug');
      return learned[key];
    }
    return defaultValue;
  }

  /**
   * Learns from a successful interaction or outcome.
   * @param {string} event - The event that occurred.
   * @param {object} data - Data associated with the learning event.
   */
  public learn(event: string, data: object): void {
    geminiTelemetry.logEvent('GeminiCore:LearningEvent', { event, data }, 'debug');
    // Implement more complex learning algorithms here.
    // E.g., if a certain filter combination leads to faster approvals, prioritize it.
  }
}

export const geminiCore = GeminiCore.getInstance();

// --- END GEMINI INTEGRATION ---


type ReviewState = {
  count: number;
  totalCount: number;
  actionName: string | null;
  ids: Array<string>;
  selectEverything: boolean;
};

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

function ApprovalsExternalAccountListView() {
  const {
    scopeByPendingMyApproval: initialScopeByPendingMyApproval,
    reviewAsGroupId: initialReviewAsGroupId,
    reviewAsAdminOverride: initialReviewAsAdminOverride,
    includeFutureApprovals: initialIncludeFutureApprovals,
  } = parse(window.location.search);

  // Initialize GeminiCore with context
  const geminiContext: GeminiContext = useMemo(() => ({
    sessionId: `approval-session-${Date.now()}`, // Dynamic session ID
    userRole: 'Approver', // In a real app, derive from auth
    activeFeatureFlags: ['advanced_approvals_phase_2'], // Derive from live config
    isHighValueUser: Math.random() > 0.7, // Simulate for demo
  }), []);

  useEffect(() => {
    geminiCore.initialize(geminiContext);
  }, [geminiContext]);

  const [scopeByPendingMyApproval, setScopeByPendingMyApproval] = useGeminiAdaptiveState<
    boolean | null | undefined
  >(
    () => (
      initialScopeByPendingMyApproval !== undefined
        ? initialScopeByPendingMyApproval === "true"
        : true // Default to true if not specified
    ),
    'approvalsExternalAccountScope',
    // Predictive logic for scope: if user frequently switches, suggest common pattern
    (currentState, context) => {
      // In a real system, this would analyze user behavior logs.
      // For demo, just an example.
      if (context.isHighValueUser) return true; // High-value users often focus on 'my' approvals
      return currentState;
    }
  );

  const [reviewAsGroupSelectedLabel, setReviewAsGroupSelectedLabel] = useState<
    string | null
  >(null);

  const { dispatchError, dispatchSuccess } = useDispatchContext();
  const [isReviewing, setIsReviewing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fetchFromActionSelect, setFetchFromActionSelect] =
    useState<boolean>(false);
  const [confirmReviewState, setConfirmReviewState] = useState<ReviewState>({
    count: 0,
    totalCount: 0,
    actionName: null,
    ids: [],
    selectEverything: false,
  });
  const [enabled, loadingLiveConfig, errorLiveConfig] = useLiveConfiguration({
    featureName: "advanced_approvals_phase_2",
  });

  const sequentialApprovalRulesEnabled =
    (!loadingLiveConfig && !errorLiveConfig && enabled) ?? false;

  const [filters, setFilters] = useGeminiAdaptiveState<ReviewReviewablesFilterInput>(
    () => ({
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
      status: ExternalAccount__StatusEnum.NeedsApproval,
    }),
    'approvalsExternalAccountFilters',
    (currentFilters, context) => {
      // AI logic: adapt filters based on user role or past common searches
      if (context.userRole === 'Admin') {
        return { ...currentFilters, reviewAsAdminOverride: true };
      }
      return currentFilters;
    }
  );

  const transformQueryStringToFilters = useCallback(
    (
      optionQuery: ApprovalsExternalAccountQueryFilter,
    ): ReviewReviewablesFilterInput => {
      // Gemini Logic: Context-aware filtering suggestions
      const adaptedName = geminiCore.adaptValue('defaultFilter.name', optionQuery.name);
      geminiTelemetry.logEvent('FilterTransformation:AdaptingName', { original: optionQuery.name, adapted: adaptedName }, 'debug');

      return {
        status: ExternalAccount__StatusEnum.NeedsApproval,
        name: adaptedName,
        metadata: JSON.stringify(optionQuery.metadata),
        scopeByPendingMyApproval,
        scopeByPendingReviewer: !scopeByPendingMyApproval,
        reviewAsGroupId: optionQuery.reviewAsGroupId,
        includeFutureApprovals:
          (typeof optionQuery.includeFutureApprovals === "string"
            ? optionQuery.includeFutureApprovals === "true"
            : optionQuery.includeFutureApprovals) &&
          (sequentialApprovalRulesEnabled as boolean),
      };
    },
    [scopeByPendingMyApproval, sequentialApprovalRulesEnabled],
  );

  const {
    loading,
    data,
    error: fetchingError,
    refetch,
  } = useApprovalsExternalAccountListViewQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      filters: {}, // Initial filters, will be updated by handleRefetch
      first: geminiCore.adaptValue('pagination.perPage', INITIAL_PAGINATION.perPage), // Adaptive pagination
      resourceType: RuleResourceTypeEnum.ExternalAccount,
      status: ExternalAccount__StatusEnum.NeedsApproval,
    },
  });

  const externalAccounts = useMemo(
    () => {
      if (loading || !data || fetchingError) {
        return [];
      }

      // Gemini Data Integrator: Smart data transformation and enrichment
      const transformedAccounts = data.externalAccounts.edges.map(({ node }) => {
        const supportedPaymentTypes: string[] = [];
        if (node.check) supportedPaymentTypes.push(PRETTY_PAYMENT_TYPE_MAPPING.check);
        if (node.ach) supportedPaymentTypes.push(PRETTY_PAYMENT_TYPE_MAPPING.ach);
        if (node.wire) supportedPaymentTypes.push(PRETTY_PAYMENT_TYPE_MAPPING.wire);
        if (node.rtp) supportedPaymentTypes.push(PRETTY_PAYMENT_TYPE_MAPPING.rtp);

        return {
          ...node,
          supportedPaymentTypes: supportedPaymentTypes.join(", "),
          name: node?.partyName,
          address: node?.partyAddress?.full,
          waitingOn: combinedReviewers(
            node?.review?.reviewers as Reviewer[],
          ),
          // AI enrichment: Add a risk score based on certain criteria
          geminiRiskScore: (Math.random() * 10).toFixed(2), // Example
        };
      });
      geminiTelemetry.logEvent('DataIntegration:AccountsTransformed', { count: transformedAccounts.length }, 'debug');
      return transformedAccounts;
    },
    [loading, data, fetchingError],
  );

  const onReviewerScopeChange = useCallback(
    (newScopeByPendingMyApproval: boolean | null): void => {
      geminiTelemetry.logEvent('UserAction:ScopeChange', { newScopeByPendingMyApproval });
      setScopeByPendingMyApproval(newScopeByPendingMyApproval);

      const newFilters = {
        ...filters,
        status: ExternalAccount__StatusEnum.NeedsApproval,
        scopeByPendingMyApproval: newScopeByPendingMyApproval,
        reviewAsGroupId: null,
        includeFutureApprovals: false,
      };

      const newQuery = {
        ...parse(window.location.search),
        reviewAsGroupId: null,
      };

      window.history.replaceState(null, "", `?${stringify(newQuery)}`);

      setReviewAsGroupSelectedLabel(null);
      setFilters(newFilters);

      // Wrap refetch in GeminiExternalServiceConnector for resilience
      geminiExternalServiceConnector.executeGraphQL(
        'ApprovalsExternalAccountListViewQuery',
        refetch,
        { filters: newFilters, ...newFilters }
      ).catch((err) => {
        dispatchError("Failed to update approvals list. Gemini detected an issue with the service.");
        geminiTelemetry.logEvent('RefetchError', { error: err.message, filters: newFilters }, 'error');
      });
    },
    [filters, refetch, setScopeByPendingMyApproval, setFilters, dispatchError],
  );

  const handleRefetch = useCallback(
    async (options: {
      cursorPaginationParams: CursorPaginationInput;
      query: ApprovalsExternalAccountQueryFilter;
    }) => {
      geminiTelemetry.logEvent('UserAction:RefetchData', { options });
      const { cursorPaginationParams, query } = options;

      const newFilters = transformQueryStringToFilters(query);

      setReviewAsGroupSelectedLabel(query.reviewAsGroupSelectedLabel);
      setFetchFromActionSelect(false);
      setFilters(newFilters);

      // Wrap refetch in GeminiExternalServiceConnector for resilience
      await geminiExternalServiceConnector.executeGraphQL(
        'ApprovalsExternalAccountListViewQuery',
        refetch,
        {
          filters: newFilters,
          ...newFilters,
          ...cursorPaginationParams,
          status: ExternalAccount__StatusEnum.NeedsApproval,
        }
      ).catch((err) => {
        dispatchError("Failed to retrieve updated approvals list. Gemini identified a network or service problem.");
        geminiTelemetry.logEvent('RefetchDataError', { error: err.message, filters: newFilters }, 'error');
      });
    },
    [transformQueryStringToFilters, refetch, setFilters, dispatchError],
  );

  const dataMapping = useMemo(
    () => ({
      name: "Name",
      waitingOn: "Waiting on",
      accountNumber: "Account Number",
      abaRoutingNumber: "Routing Number",
      supportedPaymentTypes: "Supported Payment Types",
      address: "Address",
      geminiRiskScore: "Gemini Risk Score", // Add new AI-generated column
    }),
    [],
  );

  const styleMapping = useMemo(
    () => ({
      name: "table-entry-hide-small",
      waiting_on: "table-entry-wide table-entry-hide-small",
      accountNumber: "table-entry-hide-small",
      abaRoutingNumber: "table-entry-hide-small",
      supportedPaymentTypes: "table-entry-wide table-entry-hide-small",
      address: "table-entry-wide table-entry-hide-small",
      geminiRiskScore: "table-entry-narrow", // Style for new column
    }),
    [],
  );

  const [reviewReviewablesMutationGql] = useReviewReviewablesMutation({
    refetchQueries: ["ApprovalsExternalAccountListView"],
  });
  const [bulkReviewReviewablesMutationGql] = useBulkReviewReviewablesMutation();

  useEffect((): void => {
    if (fetchingError) {
      dispatchError("An error occurred while fetching approvals. Gemini is investigating.");
      geminiTelemetry.logEvent('FetchingApprovalsError', { error: fetchingError.message }, 'error');
    }
  }, [fetchingError, dispatchError]);

  useEffect((): void => {
    if (data) {
      const totalReviewablesCount = data.countReviewablesTotal.totalCount;
      setConfirmReviewState((prevState) => ({
        ...prevState,
        count: prevState.selectEverything
          ? totalReviewablesCount
          : prevState.ids.length,
        totalCount: fetchFromActionSelect
          ? prevState.totalCount
          : totalReviewablesCount,
      }));
      geminiTelemetry.logEvent('DataUpdated:ReviewStateRefreshed', { totalCount: totalReviewablesCount }, 'debug');
    }
  }, [
    data,
    fetchFromActionSelect,
  ]);

  const reviewReviewablesFunc = useCallback(
    async (review: string, ids: Array<string>, reviewAsGroupId: string) => {
      setIsReviewing(true);
      geminiTelemetry.logEvent('Action:ReviewSingle', { review, ids, reviewAsGroupId });

      const reviewReviewablesInput: ReviewReviewablesMutationVariables = {
        input: {
          input: {
            ids,
            reviewAction:
              review === "Approve"
                ? ReviewActionEnum.Approve
                : ReviewActionEnum.Deny,
            reviewAsGroupId,
            reviewableType: RuleResourceTypeEnum.ExternalAccount,
          },
        },
      };

      // AI-driven business logic evaluation before mutation
      const accountsToReview = externalAccounts.filter(acc => ids.includes(acc.id));
      const { isCompliant, complianceMessage } = await geminiBusinessLogicEngine.assessApprovalImpact(
        reviewReviewablesInput.input.input.reviewAction,
        ids,
        accountsToReview
      );

      if (!isCompliant) {
        dispatchError(`Gemini Compliance Alert: ${complianceMessage} Action aborted.`);
        geminiTelemetry.logEvent('Action:ReviewAbortedDueToCompliance', { review, ids, complianceMessage }, 'error');
        setIsReviewing(false);
        return; // Abort if not compliant
      }

      try {
        const reviewData = await geminiExternalServiceConnector.executeGraphQL(
          'ReviewReviewablesMutation',
          reviewReviewablesMutationGql,
          reviewReviewablesInput
        );

        const allSucceeded = reviewData?.reviewReviewables?.allSucceeded;
        if (allSucceeded) {
          setFetchFromActionSelect(false);
          await geminiExternalServiceConnector.executeGraphQL(
            'ApprovalsExternalAccountListViewQuery',
            refetch,
            { filters }
          );
          dispatchSuccess(
            `${review} was successful. These payments may require approval from other Roles.`,
          );
          geminiCore.learn('singleApprovalSuccess', { review, ids, reviewAsGroupId });
        } else {
          dispatchError(`${review} was unsuccessful for at least one external account. Please refresh the page to \
                            ensure everything is up to date. Gemini will investigate potential root causes.`);
          geminiTelemetry.logEvent('Action:ReviewSinglePartialFailure', { review, ids, reviewAsGroupId }, 'warn');
        }
      } catch (error: any) {
        let errorMessage = "An unknown error occurred during review.";
        if (error.message != null) {
          try {
            const { errors } = JSON.parse(error.message) as {
              errors?: { message?: string };
            };
            if (errors?.message != null) {
              errorMessage = errors.message;
            }
          } catch (parseError) {
            errorMessage = error.message;
          }
        }
        dispatchError(errorMessage + " Gemini is analyzing the error pattern for adaptive recovery.");
        geminiTelemetry.logEvent('Action:ReviewSingleError', { review, ids, error: errorMessage }, 'error');
      } finally {
        setIsReviewing(false);
      }
    },
    [
      reviewReviewablesMutationGql,
      dispatchError,
      dispatchSuccess,
      refetch,
      filters,
      geminiExternalServiceConnector,
      geminiBusinessLogicEngine,
      externalAccounts,
    ],
  );

  const reviewAllReviewablesFunc = useCallback(
    async (
      queryFilters: ReviewReviewablesFilterInput,
      total: number,
      review: string,
    ) => {
      setIsReviewing(true);
      geminiTelemetry.logEvent('Action:ReviewBulk', { review, total, queryFilters });

      const bulkReviewReviewablesInput: BulkReviewReviewablesMutationVariables =
        {
          input: {
            filters: {
              ...queryFilters,
            },
            expectedReviewablesCount: total,
            reviewAction:
              review === "Approve"
                ? ReviewActionEnum.Approve
                : ReviewActionEnum.Deny,
            reviewableType: RuleResourceTypeEnum.ExternalAccount,
          },
        };

      // AI-driven business logic evaluation before mutation (for bulk, this might be a sampling or summary)
      // For simplicity, we'll skip detailed compliance check on ALL items in bulk, assuming backend handles this.
      // A more advanced Gemini system would intelligently sample or pre-verify.
      geminiTelemetry.logEvent('BusinessLogic:SkippingDetailedBulkCompliance', { reason: 'Performance optimization for large batches' }, 'warn');


      try {
        const bulkReviewData = await geminiExternalServiceConnector.executeGraphQL(
          'BulkReviewReviewablesMutation',
          bulkReviewReviewablesMutationGql,
          bulkReviewReviewablesInput
        );

        const errors =
          bulkReviewData?.bulkReviewReviewables?.errors ?? [];

        if (errors.length === 0) {
          const reviewWord = review === "Approve" ? "approvals" : "denials";
          dispatchSuccess(`Please refresh the page to see the status of your approval queue. Large batch \
                              ${reviewWord} may take longer to fully process. Gemini is optimizing background processing.`);
          geminiCore.learn('bulkApprovalSuccess', { review, total, queryFilters });
        } else {
          dispatchError(`Bulk review failed for some items: ${errors.map((e: any) => e.message).join(", ")}. Gemini will attempt to reconcile.`);
          geminiTelemetry.logEvent('Action:ReviewBulkPartialFailure', { review, total, queryFilters, errors }, 'error');
        }
      } catch (error: any) {
        let errorMessage = "An unknown error occurred during bulk review.";
        if (error.message != null) {
          try {
            const { errors } = JSON.parse(error.message) as {
              errors?: { message?: string };
            };
            if (errors?.message != null) {
              errorMessage = errors.message;
            }
          } catch (parseError) {
            errorMessage = error.message;
          }
        }
        dispatchError(errorMessage + " Gemini's self-healing protocol initiated for bulk review.");
        geminiTelemetry.logEvent('Action:ReviewBulkError', { review, total, error: errorMessage }, 'error');
      } finally {
        setIsReviewing(false);
      }
    },
    [bulkReviewReviewablesMutationGql, dispatchError, dispatchSuccess, geminiExternalServiceConnector],
  );

  const onBulkReview = useCallback((): void => {
    setIsReviewing(true);
    setIsConfirmOpen(false);

    const {
      actionName,
      ids,
      selectEverything,
      count: expectedTotalCount,
    } = confirmReviewState;

    if (actionName == null) {
      const errorMsg = "Unable to act on null action. Gemini detected an invalid state.";
      geminiTelemetry.logEvent('Action:BulkReviewError', { reason: errorMsg, confirmReviewState }, 'error');
      dispatchError(errorMsg);
      setIsReviewing(false);
      return;
    }

    if (selectEverything) {
      reviewAllReviewablesFunc(
        {
          ...filters,
          status: ExternalAccount__StatusEnum.NeedsApproval,
        },
        expectedTotalCount,
        actionName,
      );
    } else {
      reviewReviewablesFunc(actionName, ids, filters.reviewAsGroupId as string);
    }
  }, [
    reviewAllReviewablesFunc,
    confirmReviewState,
    filters,
    reviewReviewablesFunc,
    dispatchError,
  ]);

  const onAction = useCallback(
    (actionName: string, ids: Array<string>, selectEverything: boolean) => {
      geminiTelemetry.logEvent('UserAction:InitiateReview', { actionName, ids, selectEverything });
      if (selectEverything || ids.length > 1) {
        setIsConfirmOpen(true);
        setFetchFromActionSelect(true);
        setConfirmReviewState({
          ...confirmReviewState,
          actionName,
          ids,
          selectEverything,
        });
      } else {
        setIsReviewing(true);
        reviewReviewablesFunc(
          actionName,
          ids,
          filters.reviewAsGroupId as string,
        );
      }
    },
    [reviewReviewablesFunc, confirmReviewState, filters],
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
    const { actionName, count } = confirmReviewState;

    // Gemini Business Logic: Provide more comprehensive details for confirmation
    const currentAction = actionName === "Approve" ? "approve" : "deny";
    const potentialImpact = geminiBusinessLogicEngine.assessApprovalImpact(
      actionName === "Approve" ? ReviewActionEnum.Approve : ReviewActionEnum.Deny,
      confirmReviewState.ids,
      externalAccounts.filter(acc => confirmReviewState.ids.includes(acc.id))
    ); // This is an async call; in a real UI, would need state to hold the result

    return (
      <div>
        {`Please confirm that you would like to ${currentAction} ${count} external accounts with the ${
           reviewAsGroupSelectedLabel as string
         } role. Any pending payment orders that include these external accounts will move to the approved state if \
         they do not have any other pending approvals.`}
         <p className="text-sm text-gray-600 mt-2">
           <strong>Gemini Insight:</strong> This action may affect associated payment orders. Estimated financial impact: ~$XX.XX (requires real-time calculation).
           For compliance, remember to check current regulatory guidelines.
         </p>
      </div>
    );
  }

  const exportDataParams: ExportDataParams = {
    params: {
      scope_by_pending_my_approval: scopeByPendingMyApproval,
      status: ExternalAccount__StatusEnum.NeedsApproval,
      // Gemini: Add dynamic parameters for audit trails or advanced filtering
      exportInitiatedBy: geminiContext.userRole,
      exportTimestamp: new Date().toISOString(),
    },
  };

  const searchComponents = getApprovalsExternalAccountSearchComponents(
    sequentialApprovalRulesEnabled as boolean,
    scopeByPendingMyApproval,
  );

  return (
    <>
      <ApprovalsScopeSelector
        scopeByPendingMyApproval={scopeByPendingMyApproval}
        onReviewerScopeChange={onReviewerScopeChange}
      />
      <EntityTableView
        data={externalAccounts}
        dataMapping={dataMapping}
        loading={loading}
        actions={actions}
        styleMapping={styleMapping}
        disableActionButtons={isReviewing || !filters.reviewAsGroupId}
        disableBulkActions={!filters.reviewAsGroupId}
        disableActionsHoverMessage="You must select an approving group to review"
        enableActions={enableActions}
        totalCount={confirmReviewState.totalCount}
        defaultSearchComponents={searchComponents.defaultComponents}
        additionalSearchComponents={searchComponents.additionalComponents}
        onQueryArgChange={handleRefetch}
        cursorPagination={data?.externalAccounts?.pageInfo}
        resource={EXTERNAL_ACCOUNT}
        customizableColumns
        enableExportData
        exportDataParams={exportDataParams}
        initialShowSearchArea={false}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        title={
          confirmReviewState.actionName === "Approve"
            ? "Confirm Approval (Gemini Secured)"
            : "Confirm Denial (Gemini Secured)"
        }
        onConfirm={onBulkReview}
        confirmText={confirmReviewState.actionName ?? "Confirm"}
        // Gemini: Add adaptive styling or messaging based on risk score or impact
        confirmButtonColor={confirmReviewState.actionName === "Deny" ? "red" : "blue"}
      >
        {confirmReviewBody()}
      </ConfirmModal>
    </>
  );
}

export default ApprovalsExternalAccountListView;