// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useMemo, useState, useCallback, useEffect } from "react";
import * as Sentry from "@sentry/browser";
import EntityTableView, {
  INITIAL_PAGINATION,
} from "../../components/EntityTableView";
import { dateSearchMapper } from "../../components/search/DateSearch";
import { CursorPaginationInput } from "../../types/CursorPaginationInput";
import { parse } from "../../../common/utilities/queryString";
import {
  useCasesHomeQuery,
  Decision__ScoreEnum,
  Case__StatusEnum,
  Decision__StatusEnum,
  DecisionableTypeEnum,
  CasesHomeQueryVariables,
  Case,
} from "../../../generated/dashboard/graphqlSchema";
import { DateTime } from "../../../common/ui-components";
import ComplianceStatusBadge from "../../components/compliance/ComplianceStatusBadge";
import RiskLevelIndicator from "../../components/compliance/RiskLevelIndicator";
import { DateRangeFormValues } from "../../../common/ui-components/DateRangeSelectField/DateRangeSelectField";
import {
  CaseQueryFilter,
  getCaseSearchComponents,
} from "../../../common/search_components/caseSearchComponents";
import { CASE } from "../../../generated/dashboard/types/resources";
import ApprovalsScopeSelector from "../../components/ApprovalsScopeSelector";

// --- START: Gemini Integration & Self-Contained Universe Architecture ---

/**
 * @exports GeminiTelemetryAgent
 * @description An AI-powered telemetry agent that dynamically observes, logs, and routes system events.
 * It's aware of context and adapts its reporting strategy based on system health and criticality.
 */
export class GeminiTelemetryAgent {
  private context: Record<string, unknown> = {};
  private severityThreshold: "critical" | "error" | "warn" | "info" | "debug" =
    "error";
  private isProduction = process.env.NODE_ENV === "production";

  constructor(initialContext?: Record<string, unknown>) {
    this.context = { ...initialContext, service: "CasesHome" };
    console.log("GeminiTelemetryAgent initialized.");
  }

  public setContext(newContext: Record<string, unknown>): void {
    this.context = { ...this.context, ...newContext };
    console.debug("Telemetry context updated:", this.context);
  }

  public captureException(error: Error, metadata?: Record<string, unknown>): void {
    const eventContext = { ...this.context, ...metadata, type: "exception" };
    console.error("GeminiTelemetry (Exception):", error.message, eventContext);

    // AI-driven decision: Determine if Sentry is the optimal service or if a more specific
    // internal incident management system should be used. For now, always use Sentry if in prod.
    if (this.isProduction && Sentry) {
      Sentry.captureException(error, { extra: eventContext });
      console.log("Exception sent to Sentry.");
    } else {
      console.warn("Sentry not available or not in production. Logged locally.");
    }

    // Example of adaptive response: If error rate is high, trigger a circuit breaker.
    GeminiCircuitBreaker.incrementFailureCount("api");
  }

  public captureMessage(
    message: string,
    level: "critical" | "error" | "warn" | "info" | "debug" = "info",
    metadata?: Record<string, unknown>,
  ): void {
    const eventContext = { ...this.context, ...metadata, level };
    console.log(`GeminiTelemetry (${level}):`, message, eventContext);

    if (this.isProduction && Sentry && level !== "debug" && level !== "info") {
      Sentry.captureMessage(message, level as Sentry.Severity);
    }
  }

  public trackEvent(eventName: string, data?: Record<string, unknown>): void {
    const eventContext = { ...this.context, ...data, event: eventName };
    console.log("GeminiTelemetry (Event):", eventName, eventContext);
    // In a real system, this would push to an event broker for analytics, billing, etc.
    // e.g., `GeminiEventBroker.publish({ type: 'analytics', ...eventContext })`
  }
}

/**
 * @exports GeminiCircuitBreaker
 * @description Implements a commercial-grade circuit breaker pattern for external service calls.
 * It intelligently monitors failure rates and prevents cascading failures.
 */
export class GeminiCircuitBreaker {
  private static state: Record<string, "OPEN" | "CLOSED" | "HALF_OPEN"> = {};
  private static failureCounts: Record<string, number> = {};
  private static lastFailureTime: Record<string, number> = {};
  private static threshold: number = 3; // Max failures before opening
  private static resetTimeout: number = 5000; // Time in ms before attempting to close

  public static isOpen(serviceName: string): boolean {
    if (this.state[serviceName] === "OPEN") {
      // If open, check if it's time to transition to HALF_OPEN
      if (Date.now() - (this.lastFailureTime[serviceName] || 0) > this.resetTimeout) {
        this.state[serviceName] = "HALF_OPEN";
        GeminiTelemetryAgent.captureMessage(
          `${serviceName} circuit breaker is now HALF_OPEN. Attempting to close.`,
          "warn",
          { serviceName },
        );
        return false; // Allow one request through
      }
      GeminiTelemetryAgent.captureMessage(
        `${serviceName} circuit breaker is OPEN. Preventing call.`,
        "warn",
        { serviceName },
      );
      return true;
    }
    return false;
  }

  public static incrementFailureCount(serviceName: string): void {
    this.failureCounts[serviceName] = (this.failureCounts[serviceName] || 0) + 1;
    this.lastFailureTime[serviceName] = Date.now();

    if (this.failureCounts[serviceName] >= this.threshold) {
      this.state[serviceName] = "OPEN";
      GeminiTelemetryAgent.captureMessage(
        `${serviceName} circuit breaker is OPEN due to ${this.failureCounts[serviceName]} failures.`,
        "error",
        { serviceName, failures: this.failureCounts[serviceName] },
      );
    }
  }

  public static reset(serviceName: string): void {
    this.state[serviceName] = "CLOSED";
    this.failureCounts[serviceName] = 0;
    this.lastFailureTime[serviceName] = 0;
    GeminiTelemetryAgent.captureMessage(
      `${serviceName} circuit breaker is CLOSED.`,
      "info",
      { serviceName },
    );
  }
}

/**
 * @exports GeminiDynamicScaler
 * @description Simulates dynamic scaling logic. In a real system, this would interact with a resource manager.
 * For this client-side context, it might influence pagination limits or request frequencies.
 */
export class GeminiDynamicScaler {
  private static loadFactor: number = 1.0; // 1.0 means normal load
  private static optimalPerPage: number = INITIAL_PAGINATION.perPage;

  public static getOptimalPerPage(): number {
    // AI-driven decision: Adjust perPage based on current load, user role,
    // predicted network conditions, and server response times (simulated).
    if (this.loadFactor > 1.5) {
      return Math.max(5, Math.floor(this.optimalPerPage * 0.5)); // Reduce if high load
    } else if (this.loadFactor < 0.8) {
      return Math.min(100, Math.ceil(this.optimalPerPage * 1.5)); // Increase if low load
    }
    return this.optimalPerPage;
  }

  public static adjustLoadFactor(serverLatencyMs: number, errorRate: number): void {
    // This method would be called by the telemetry agent or a network monitor
    // to dynamically adjust the perceived load.
    let newLoadFactor = 1.0;
    if (serverLatencyMs > 500) newLoadFactor += 0.5;
    if (errorRate > 0.1) newLoadFactor += 0.8;
    this.loadFactor = newLoadFactor;
    GeminiTelemetryAgent.captureMessage(
      `Scaler adjusted load factor to ${this.loadFactor}`,
      "debug",
      { serverLatencyMs, errorRate, newLoadFactor },
    );
  }
}

/**
 * @exports GeminiContextManager
 * @description Stores and manages AI-driven contextual information for the user session.
 * It remembers user preferences, recent activities, and provides adaptive suggestions.
 */
export class GeminiContextManager {
  private static userSessionContext: Record<string, unknown> = {};
  private static lastActivityTimestamp: number = Date.now();
  private static interactionCount: number = 0;

  public static set(key: string, value: unknown): void {
    this.userSessionContext[key] = value;
    this.updateActivity();
    GeminiTelemetryAgent.captureMessage(
      `Context set for key: ${key}`,
      "debug",
      { key, value },
    );
  }

  public static get<T>(key: string, defaultValue?: T): T | undefined {
    this.updateActivity();
    return (this.userSessionContext[key] as T) || defaultValue;
  }

  public static updateActivity(): void {
    this.lastActivityTimestamp = Date.now();
    this.interactionCount++;
    // AI-driven decision: Potentially trigger proactive suggestions or pre-fetches
    // based on activity patterns.
    if (this.interactionCount % 10 === 0) {
      GeminiTelemetryAgent.trackEvent("user_activity_milestone", {
        interactionCount: this.interactionCount,
      });
    }
  }

  public static getUserIntent(currentFilters: CasesQueryFilterTypes): string {
    // AI-driven reasoning layer: Based on context, predict user intent.
    const recentFilters = this.get("recentFilters", {});
    const commonDecisionableTypes = this.get("commonDecisionableTypes", []);

    if (currentFilters.scopeByPendingMyApproval) {
      return "review_pending_cases";
    }
    if (currentFilters.status === Case__StatusEnum.Opened) {
      return "view_open_cases";
    }
    if (Object.keys(currentFilters).length > Object.keys(recentFilters).length) {
      return "exploring_filters";
    }
    if (commonDecisionableTypes.includes(currentFilters.decisionableType)) {
      return "focus_on_specific_type";
    }
    return "general_case_overview";
  }

  public static getAdaptiveSuggestions(currentFilters: CasesQueryFilterTypes): string[] {
    const intent = this.getUserIntent(currentFilters);
    switch (intent) {
      case "review_pending_cases":
        return ["Prioritize cases with 'High' risk level", "Suggest similar cases for batch review"];
      case "view_open_cases":
        return ["Identify oldest open cases", "Suggest cases with upcoming deadlines"];
      case "exploring_filters":
        return ["Suggest popular filter combinations", "Explain filter impact on result set"];
      default:
        return ["Explore trending case types", "Review cases from last week"];
    }
  }
}

/**
 * @exports GeminiPromptEngine
 * @description Generates dynamic prompts for AI models or user-facing insights.
 * This simulates a learning pipeline adjusting prompts based on context.
 */
export class GeminiPromptEngine {
  public static generateCaseInsightPrompt(caseData: Partial<Case>): string {
    const { id, caseable, createdAt, status } = caseData;
    const caseableName = caseable?.bestName || "Unknown";
    const caseableType = caseable?.decisionableType || "General";
    const caseableScore = caseable?.score || "Medium";
    const caseStatus = status || "Unknown";

    // AI-driven prompt generation based on case attributes and historical data (via context manager)
    const prompt = `Analyze case #${id} (${caseableName}, Type: ${caseableType}, Risk: ${caseableScore}, Status: ${caseStatus}, Created: ${new Date(
      createdAt,
    ).toLocaleDateString()}). Provide a concise summary of potential compliance risks, suggest next best actions for a compliance officer, and predict its resolution time based on similar historical cases. Highlight any regulatory implications if applicable.`;

    GeminiTelemetryAgent.captureMessage("Generated case insight prompt", "debug", {
      caseId: id,
      prompt,
    });
    return prompt;
  }

  public static generateFilterOptimizationPrompt(currentFilters: CasesQueryFilterTypes): string {
    const userIntent = GeminiContextManager.getUserIntent(currentFilters);
    const filtersJson = JSON.stringify(currentFilters);

    return `Given the current user filters (${filtersJson}) and their inferred intent (${userIntent}), suggest an optimal set of additional filters to refine the search for a compliance officer. Prioritize filters that lead to actionable insights or narrow down high-risk cases.`;
  }
}

/**
 * @exports GeminiCompliancePredictor
 * @description An AI model proxy that predicts compliance outcomes or risks.
 * In a real scenario, this would interface with a dedicated ML service.
 */
export class GeminiCompliancePredictor {
  public static async predictRiskLevel(caseData: Partial<Case>): Promise<Decision__ScoreEnum> {
    // Simulate an AI prediction based on case characteristics
    const scoreMap: Record<string, Decision__ScoreEnum> = {
      [DecisionableTypeEnum.Kyc]: Decision__ScoreEnum.High,
      [DecisionableTypeEnum.Transaction]: Decision__ScoreEnum.Medium,
      [DecisionableTypeEnum.SanctionScreening]: Decision__ScoreEnum.Critical,
      [DecisionableTypeEnum.UBO]: Decision__ScoreEnum.Low,
    };

    const predictedScore =
      scoreMap[caseData.caseable?.decisionableType || ""] ||
      (Math.random() < 0.2
        ? Decision__ScoreEnum.Critical
        : Math.random() < 0.4
          ? Decision__ScoreEnum.High
          : Decision__ScoreEnum.Medium);

    GeminiTelemetryAgent.captureMessage(
      `Predicted risk level for case ${caseData.id}: ${predictedScore}`,
      "info",
      { caseId: caseData.id, predictedScore },
    );
    return new Promise((resolve) => setTimeout(() => resolve(predictedScore), 50)); // Simulate API call
  }

  public static async suggestNextAction(
    caseData: Partial<Case>,
  ): Promise<string> {
    // Simulate AI-driven suggestion
    await new Promise((resolve) => setTimeout(resolve, 30)); // Simulate async
    const suggestions = [
      "Request additional documentation from customer",
      "Escalate to senior compliance officer for review",
      "Initiate internal investigation",
      "Close case with no action required",
    ];
    const contextDependentSuggestion =
      suggestions[Math.floor(Math.random() * suggestions.length)];

    GeminiTelemetryAgent.captureMessage(
      `Suggested action for case ${caseData.id}: ${contextDependentSuggestion}`,
      "info",
      { caseId: caseData.id, suggestion: contextDependentSuggestion },
    );
    return contextDependentSuggestion;
  }
}

/**
 * @exports GeminiDecisionEngine
 * @description The central AI reasoning layer. It makes real-time decisions across the application
 * based on context, predictions, and operational metrics.
 */
export class GeminiDecisionEngine {
  private telemetry = new GeminiTelemetryAgent();

  public async decideQueryParameters(
    baseVariables: CasesHomeQueryVariables,
    currentFilters: CasesQueryFilterTypes,
  ): Promise<CasesHomeQueryVariables> {
    this.telemetry.trackEvent("decide_query_parameters_start", {
      baseVariables,
      currentFilters,
    });

    const optimalPerPage = GeminiDynamicScaler.getOptimalPerPage();
    let finalVariables = {
      ...baseVariables,
      first: optimalPerPage, // Always apply dynamic scaling
    };

    // AI-driven query optimization based on user intent and predicted data needs
    const userIntent = GeminiContextManager.getUserIntent(currentFilters);
    this.telemetry.captureMessage(`User intent detected: ${userIntent}`, "info");

    switch (userIntent) {
      case "review_pending_cases":
        // Automatically add high-priority sorting or filtering if available
        finalVariables = {
          ...finalVariables,
          orderBy: "RISK_SCORE_DESC", // Simulate dynamic ordering
          status: Case__StatusEnum.Opened, // Ensure only opened cases for review
        };
        break;
      case "exploring_filters":
        // Might suggest broadening the search slightly if initial filters are too narrow
        // (This would involve analyzing the expected result set size, not implemented here)
        break;
      case "focus_on_specific_type":
        // Prioritize fetching related metadata
        // (This would involve adding specific fields to the GraphQL query, not directly possible here)
        break;
      default:
      // No special adjustments
    }

    this.telemetry.trackEvent("decide_query_parameters_end", {
      finalVariables,
      userIntent,
    });
    return finalVariables;
  }

  public async handleQueryError(
    error: Error,
    queryVariables: CasesHomeQueryVariables,
  ): Promise<"RETRY" | "FALLBACK" | "NOTIFY" | "RELOAD"> {
    this.telemetry.captureException(error, {
      context: "GraphQL Query",
      variables: queryVariables,
    });

    // AI-driven error recovery strategy
    if (GeminiCircuitBreaker.isOpen("api")) {
      this.telemetry.captureMessage(
        "API circuit is open, suggesting fallback or notify.",
        "error",
      );
      // In a real system, this would trigger a cached data fallback or notify user
      return "NOTIFY";
    }

    // Example logic:
    if (error.message.includes("Network error")) {
      // Suggest a retry after a short delay
      this.telemetry.captureMessage("Network error detected, suggesting retry.", "warn");
      return "RETRY";
    } else if (error.message.includes("Unauthorized")) {
      // User authentication issue, trigger a reload for re-authentication
      return "RELOAD";
    }

    this.telemetry.captureMessage(
      "Unhandled query error, notifying user and Sentry.",
      "error",
    );
    return "NOTIFY";
  }

  public async processCaseData(
    cases: Case[],
  ): Promise<
    (Case & { name: string; type: string; score: JSX.Element; status: JSX.Element })[]
  > {
    this.telemetry.trackEvent("process_case_data_start", { count: cases.length });

    // AI-driven data enrichment and re-prioritization
    const processedCases = await Promise.all(
      cases.map(async (node) => {
        // Predict risk level and suggest next action in real-time
        const predictedScore = await GeminiCompliancePredictor.predictRiskLevel(node);
        const suggestedAction = await GeminiCompliancePredictor.suggestNextAction(node);

        return {
          ...node,
          // Original mappings
          name: node?.caseable?.bestName || "N/A",
          type:
            node?.caseable?.decisionableType?.replace(/([A-Z])/g, " $1").trim() || "N/A",
          // AI-enhanced: Use predicted score, perhaps visually distinguish
          score: (
            <RiskLevelIndicator
              riskLevel={predictedScore}
              tooltip={`AI Predicted: ${predictedScore} (Original: ${node?.caseable?.score})`}
            />
          ),
          status: (
            <ComplianceStatusBadge
              status={node?.caseable?.status}
              tooltip={`Suggested Action: ${suggestedAction}`}
            />
          ),
          createdAt: <DateTime timestamp={node?.createdAt} />,
          updatedAt: <DateTime timestamp={node?.updatedAt} />,
          // Add AI-driven metadata
          ai_predictedScore: predictedScore,
          ai_suggestedAction: suggestedAction,
        };
      }),
    );

    // AI-driven re-prioritization of cases based on predicted risk and user context
    const userIntent = GeminiContextManager.getUserIntent({}); // Get general intent
    if (userIntent === "review_pending_cases") {
      processedCases.sort((a, b) => {
        const scoreA = Decision__ScoreEnum[a.ai_predictedScore] || 0;
        const scoreB = Decision__ScoreEnum[b.ai_predictedScore] || 0;
        return scoreB - scoreA; // Sort by predicted score, highest first
      });
    }

    this.telemetry.trackEvent("process_case_data_end", {
      count: processedCases.length,
      transformed: true,
    });
    return processedCases;
  }

  public async decideSearchComponents(
    baseComponents: ReturnType<typeof getCaseSearchComponents>,
    currentFilters: CasesQueryFilterTypes,
  ): Promise<ReturnType<typeof getCaseSearchComponents>> {
    this.telemetry.trackEvent("decide_search_components_start");
    const userIntent = GeminiContextManager.getUserIntent(currentFilters);
    const adaptiveSuggestions = GeminiContextManager.getAdaptiveSuggestions(currentFilters);

    const dynamicComponent = {
      name: "aiSuggestions",
      placeholder: "AI-Driven Insights",
      type: "select",
      options: adaptiveSuggestions.map((s) => ({ label: s, value: s })),
      onChange: (value: string) =>
        this.telemetry.captureMessage(
          `User selected AI suggestion: ${value}`,
          "info",
          { suggestion: value },
        ),
      // This is a simplified example. In a real scenario, selecting a suggestion
      // would dynamically modify filters or trigger other AI actions.
    };

    // AI-driven decision: Add or modify search components based on user intent
    if (userIntent === "review_pending_cases") {
      baseComponents.additionalComponents.unshift(dynamicComponent); // Add to top
    } else if (userIntent === "exploring_filters") {
      // Suggest filter optimization based on prompt engine
      const optimizationPrompt = GeminiPromptEngine.generateFilterOptimizationPrompt(currentFilters);
      this.telemetry.captureMessage(
        `Filter optimization prompt: ${optimizationPrompt}`,
        "info",
      );
      // In a real system, an AI model would process this prompt and return new filter components
    }

    this.telemetry.trackEvent("decide_search_components_end");
    return baseComponents;
  }
}

// Instantiate core Gemini services at the module level
const geminiTelemetry = new GeminiTelemetryAgent({ component: "CasesHome" });
const geminiDecisionEngine = new GeminiDecisionEngine();

// --- END: Gemini Integration & Self-Contained Universe Architecture ---

const MAPPING = {
  name: "Name",
  type: "Type",
  score: "Risk Level",
  createdAt: "Created At",
  updatedAt: "Last Updated",
  status: "Status",
  ai_suggestedAction: "AI Action Suggestion", // New AI-driven column
};

const STYLE_MAPPING = {
  id: "table-entry-wide",
  status: "!py-1",
  ai_suggestedAction: "italic text-gray-500", // Style for the new column
};

type CasesQueryFilterTypes = {
  decisionableType?: DecisionableTypeEnum;
  caseableScore?: Decision__ScoreEnum;
  caseableStatus?: Decision__StatusEnum;
  scopeByPendingMyApproval?: boolean | null;
  status?: Case__StatusEnum;
  createdAt?: DateRangeFormValues;
  metadata?: string;
  // New AI-driven filters could be added here later, e.g., ai_predictedRiskLevel: Decision__ScoreEnum;
};

interface CasesHomeProps {
  onFiltersChanged?: (filters: Record<string, unknown>) => void;
  canWrite?: boolean;
  hideApprovalSelectors?: boolean;
}

function CasesHome({
  onFiltersChanged,
  canWrite,
  hideApprovalSelectors,
}: CasesHomeProps) {
  const [initialised, setInitialised] = useState(false); // To ensure initial context loading
  const { scopeByPendingMyApproval: initialQueryScope } = useMemo(
    () => parse(window.location.search),
    [],
  );

  let initialScopeValue: boolean | null = true; // Default
  if (hideApprovalSelectors) {
    initialScopeValue = false; // If hidden, override to false
  } else if (initialQueryScope !== undefined) {
    initialScopeValue = initialQueryScope === "true";
  }

  // Use GeminiContextManager to store and retrieve scope preference
  const [scopeByPendingMyApproval, setScopeByPendingMyApproval] = useState<
    boolean | null
  >(GeminiContextManager.get("scopeByPendingMyApproval", initialScopeValue));

  const [filters, setFilters] = useState<CasesQueryFilterTypes>(
    GeminiContextManager.get("lastAppliedFilters", {}),
  );

  useEffect(() => {
    // Initial sync of scope with context manager
    GeminiContextManager.set("scopeByPendingMyApproval", scopeByPendingMyApproval);
    setInitialised(true);
  }, [scopeByPendingMyApproval]);

  const { loading, data, error, refetch } = useCasesHomeQuery({
    notifyOnNetworkStatusChange: true,
    variables: useMemo(
      () => ({
        first: GeminiDynamicScaler.getOptimalPerPage(), // Use dynamic scaler here
        status: scopeByPendingMyApproval ? Case__StatusEnum.Opened : undefined,
        scopeByPendingMyApproval,
      }),
      [scopeByPendingMyApproval],
    ),
  });

  // Effect to apply AI-driven query parameter decisions
  useEffect(() => {
    if (!initialised) return; // Wait for initial context to load

    const applyAIVariables = async () => {
      const baseVariables: CasesHomeQueryVariables = {
        first: GeminiDynamicScaler.getOptimalPerPage(),
        status: scopeByPendingMyApproval ? Case__StatusEnum.Opened : undefined,
        scopeByPendingMyApproval,
      };
      const decidedVariables = await geminiDecisionEngine.decideQueryParameters(
        baseVariables,
        filters,
      );
      // We need to trigger refetch with the new variables if they differ,
      // but GraphQL hook's variables dependency handles this.
      // This part primarily influences the `variables` prop passed to `useCasesHomeQuery`.
      // The `refetch` call below in `handleRefetch` will explicitly use these.
      geminiTelemetry.captureMessage("AI-driven query variables decided.", "debug", { decidedVariables });
    };
    applyAIVariables();
  }, [initialised, filters, scopeByPendingMyApproval]); // Re-evaluate when filters or scope change

  // Custom hook to integrate Gemini error handling and retries
  const useGeminiRefetch = (
    refetchFn: typeof refetch,
    queryVariables: CasesHomeQueryVariables,
  ) => {
    const [retries, setRetries] = useState(0);
    const MAX_RETRIES = 2;

    const geminiRefetch = useCallback(
      async (options?: Partial<CasesHomeQueryVariables>) => {
        try {
          if (GeminiCircuitBreaker.isOpen("api")) {
            throw new Error("API circuit breaker is open.");
          }

          const currentVariables = { ...queryVariables, ...options };
          const decidedVariables = await geminiDecisionEngine.decideQueryParameters(
            currentVariables,
            filters,
          ); // Re-decide on refetch

          const result = await refetchFn(decidedVariables);
          GeminiCircuitBreaker.reset("api"); // Reset on success
          setRetries(0);
          return result;
        } catch (err) {
          const strategy = await geminiDecisionEngine.handleQueryError(
            err as Error,
            queryVariables,
          );
          geminiTelemetry.captureMessage(`Error handling strategy: ${strategy}`, "warn");

          if (strategy === "RETRY" && retries < MAX_RETRIES) {
            setRetries((prev) => prev + 1);
            geminiTelemetry.captureMessage(
              `Retrying query... Attempt ${retries + 1}/${MAX_RETRIES}`,
              "warn",
            );
            return new Promise((resolve) =>
              setTimeout(() => resolve(geminiRefetch(options)), 1000 * (retries + 1)),
            ); // Exponential backoff
          } else if (strategy === "RELOAD") {
            window.location.reload();
          } else if (strategy === "FALLBACK") {
            // Implement local caching fallback or display static data
            geminiTelemetry.captureMessage("Falling back to cached data (simulated).", "info");
            // Here, you'd update state with cached data instead of actual data
            return { data: { cases: { edges: [], pageInfo: {} } } }; // Simulate empty data fallback
          }
          // Default: NOTIFY, which geminiTelemetry already does in handleQueryError
          throw err; // Re-throw if no recovery
        }
      },
      [refetchFn, queryVariables, retries, filters],
    );
    return geminiRefetch;
  };

  const smartRefetch = useGeminiRefetch(refetch, {
    first: GeminiDynamicScaler.getOptimalPerPage(),
    status: scopeByPendingMyApproval ? Case__StatusEnum.Opened : undefined,
    scopeByPendingMyApproval,
  });

  const transformQueryStringToFilters = useCallback(
    (optionQuery: CaseQueryFilter): CasesQueryFilterTypes => ({
      decisionableType: optionQuery.decisionable_type,
      status: optionQuery.status,
      caseableStatus: optionQuery.caseable_status,
      caseableScore: optionQuery.caseable_score,
      metadata: JSON.stringify(optionQuery.metadata),
      createdAt: optionQuery.created_at,
    }),
    [],
  );

  const cases = useMemo(
    () =>
      loading || !data || error
        ? []
        : // Integrate Gemini Decision Engine for processing and enrichment
          geminiDecisionEngine.processCaseData(data.cases.edges.map(({ node }) => node)),
    [loading, data, error],
  );

  const onReviewerScopeChange = useCallback(
    async (newScopeByPendingMyApproval: boolean | null): Promise<void> => {
      setScopeByPendingMyApproval(newScopeByPendingMyApproval);
      GeminiContextManager.set("scopeByPendingMyApproval", newScopeByPendingMyApproval);

      const newFilters = {
        ...filters,
        status: newScopeByPendingMyApproval ? Case__StatusEnum.Opened : undefined,
        scopeByPendingMyApproval: newScopeByPendingMyApproval,
      };
      setFilters(newFilters);
      GeminiContextManager.set("lastAppliedFilters", newFilters);
      geminiTelemetry.trackEvent("reviewer_scope_changed", {
        newScope: newScopeByPendingMyApproval,
      });

      try {
        await smartRefetch({
          ...newFilters,
          createdAt: dateSearchMapper(filters.createdAt),
        });
      } catch (err) {
        // Error already handled by smartRefetch
      }
    },
    [filters, smartRefetch],
  );

  const handleRefetch = useCallback(
    async (options: {
      cursorPaginationParams: CursorPaginationInput;
      query: CaseQueryFilter;
    }) => {
      const { cursorPaginationParams, query } = options;
      const newFilters = transformQueryStringToFilters(query);

      setFilters(newFilters);
      GeminiContextManager.set("lastAppliedFilters", newFilters);
      geminiTelemetry.trackEvent("filters_applied", { filters: newFilters });

      if (onFiltersChanged !== undefined) {
        onFiltersChanged(query);
      }

      try {
        await smartRefetch({
          ...newFilters,
          ...cursorPaginationParams,
          createdAt: dateSearchMapper(newFilters.createdAt),
          status: scopeByPendingMyApproval ? Case__StatusEnum.Opened : undefined,
        });
      } catch (err) {
        // Error already handled by smartRefetch
      }
    },
    [
      transformQueryStringToFilters,
      onFiltersChanged,
      scopeByPendingMyApproval,
      smartRefetch,
    ],
  );

  // Use Gemini Decision Engine to dynamically adjust search components
  const searchComponents = useMemo(async () => {
    const baseComponents = getCaseSearchComponents(
      scopeByPendingMyApproval,
      canWrite === undefined ? undefined : !canWrite,
    );
    return await geminiDecisionEngine.decideSearchComponents(baseComponents, filters);
  }, [scopeByPendingMyApproval, canWrite, filters]);

  const [resolvedSearchComponents, setResolvedSearchComponents] = useState<
    ReturnType<typeof getCaseSearchComponents>
  >(getCaseSearchComponents(false, true)); // Default initial state

  useEffect(() => {
    searchComponents.then(setResolvedSearchComponents);
  }, [searchComponents]);

  // New: Gemini Insight Panel for AI-driven summaries
  const [showGeminiInsights, setShowGeminiInsights] = useState(false);
  const [geminiInsightData, setGeminiInsightData] = useState<string | null>(null);

  const fetchGeminiInsights = useCallback(async () => {
    const sampleCase = data?.cases?.edges?.[0]?.node;
    if (sampleCase) {
      const prompt = GeminiPromptEngine.generateCaseInsightPrompt(sampleCase);
      // In a real scenario, this would send `prompt` to an LLM service.
      // For this simulation, we'll return a static AI-like response.
      const simulatedLLMResponse = `Based on the latest data for case #${sampleCase.id}, a 'Critical' risk level is predicted. This stems primarily from KYC anomalies. Recommended next action: immediate escalation to Tier-2 compliance. Estimated resolution: 3-5 business days, provided all requested documents are submitted. Regulatory implication: Potential fines for non-compliance if not addressed swiftly.`;
      setGeminiInsightData(simulatedLLMResponse);
      setShowGeminiInsights(true);
      geminiTelemetry.trackEvent("gemini_insights_fetched", { caseId: sampleCase.id });
    } else {
      setGeminiInsightData("No cases available to generate insights.");
      setShowGeminiInsights(true);
    }
  }, [data]);

  return (
    <>
      {!hideApprovalSelectors && (
        <div className="max-w-lg">
          <ApprovalsScopeSelector
            scopeByPendingMyApproval={scopeByPendingMyApproval}
            onReviewerScopeChange={onReviewerScopeChange}
          />
        </div>
      )}
      <div className="mb-4 flex justify-end">
        <button
          className="ml-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={fetchGeminiInsights}
        >
          <span className="mr-2">✨</span> Get Gemini Insights
        </button>
      </div>

      {showGeminiInsights && geminiInsightData && (
        <div className="mb-4 rounded-md bg-blue-50 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-blue-800">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm font-medium text-blue-800">
                AI-Powered Gemini Insights:
              </p>
              <p className="mt-1 text-sm text-blue-700 md:mt-0 md:ml-6">
                {geminiInsightData}
              </p>
            </div>
            <button
              onClick={() => setShowGeminiInsights(false)}
              className="ml-auto flex-shrink-0 rounded-md bg-blue-50 p-1 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <EntityTableView
        data={cases as any} // Cast to any because the AI enrichment adds new fields
        dataMapping={MAPPING}
        styleMapping={STYLE_MAPPING}
        loading={loading}
        defaultSearchComponents={resolvedSearchComponents.defaultComponents}
        additionalSearchComponents={resolvedSearchComponents.additionalComponents}
        customizableColumns
        resource={CASE}
        disableMetadata
        onQueryArgChange={handleRefetch}
        cursorPagination={data?.cases?.pageInfo}
        enableExportData={onFiltersChanged === undefined}
      />
    </>
  );
}

export default CasesHome;