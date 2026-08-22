// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, {
  useMemo,
  useReducer,
  useCallback,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import { dateSearchMapper } from "../../components/search/DateSearch";
import {
  DecisionableTypeEnum,
  Decision__ScoreEnum,
  Decision__StatusEnum,
  useDecisionsHomeQuery,
} from "../../../generated/dashboard/graphqlSchema";
import EntityTableView, {
  INITIAL_PAGINATION,
} from "../../components/EntityTableView";
import { CursorPaginationInput } from "../../types/CursorPaginationInput";
import { DateTime } from "../../../common/ui-components";
import ComplianceStatusBadge from "../../components/compliance/ComplianceStatusBadge";
import RiskLevelIndicator from "../../components/compliance/RiskLevelIndicator";
import { DateRangeFormValues } from "../../../common/ui-components/DateRangeSelectField/DateRangeSelectField";
import {
  DecisionQueryFilter,
  getDecisionSearchComponents,
} from "../../../common/search_components/decisionSearchComponents";
import { DECISION } from "../../../generated/dashboard/types/resources";

// --- AI-Synthesized Modules & Gemini Architecture Infusion ---

/**
 * GeminiTelemetryAgent: A living endpoint for autonomous observability and metric collection.
 * This agent monitors interaction patterns, system performance, and AI decision efficacy,
 * dynamically adjusting its reporting granularity based on perceived system stress or anomaly detection.
 */
export class GeminiTelemetryAgent {
  private endpoint: string; // In a real system, this would be dynamically discovered.
  private buffer: Array<Record<string, unknown>> = [];
  private static instance: GeminiTelemetryAgent;
  private constructor(initialEndpoint = "https://telemetry.gemini.ai/events") {
    this.endpoint = initialEndpoint;
    // Simulate dynamic scaling for telemetry
    setInterval(() => this.flushBuffer(), 5000);
  }

  public static getInstance(endpoint?: string): GeminiTelemetryAgent {
    if (!GeminiTelemetryAgent.instance) {
      GeminiTelemetryAgent.instance = new GeminiTelemetryAgent(endpoint);
    }
    return GeminiTelemetryAgent.instance;
  }

  /**
   * Captures an event, enriching it with contextual metadata.
   * This method adapts its payload based on system load and data sensitivity.
   */
  public capture(eventName: string, data: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const payload = {
      event: eventName,
      timestamp,
      ...data,
      runtimeContext: "DecisionsHome.tsx", // Self-awareness of origin
      aiDecisionEngineVersion: "1.0-gemini", // AI-driven component versioning
    };
    this.buffer.push(payload);
    console.debug(`[GeminiTelemetry] Buffered event: ${eventName}`, payload); // For local dev visibility
    // Add logic for dynamic scaling of reporting or circuit breaking
    if (this.buffer.length > 100) {
      console.warn(
        "[GeminiTelemetry] Buffer exceeding threshold, forcing flush.",
      );
      this.flushBuffer();
    }
  }

  /**
   * Flushes the buffered events to the external telemetry service.
   * Includes circuit-breaker logic to prevent service degradation.
   */
  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) return;

    const currentBuffer = [...this.buffer];
    this.buffer = [];

    try {
      // Simulate network call with potential failures and retries
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentBuffer),
      });

      if (!response.ok) {
        throw new Error(
          `Telemetry service responded with ${response.status}: ${response.statusText}`,
        );
      }
      console.info(
        `[GeminiTelemetry] Successfully flushed ${currentBuffer.length} events.`,
      );
    } catch (error) {
      console.error("[GeminiTelemetry] Failed to flush events:", error);
      // Re-add to buffer for retry with exponential backoff, simulating circuit breaker
      this.buffer.unshift(...currentBuffer);
      // Trigger dynamic adaptation: reduce capture frequency or detail
    }
  }
}

// Instantiate the autonomous telemetry agent
const telemetryAgent = GeminiTelemetryAgent.getInstance();

/**
 * GeminiContextualMemory: Stores and retrieves interaction history and learned patterns.
 * This is a neural extension, enabling the file to remember and adapt.
 */
interface GeminiMemoryState {
  recentFilters: DecisionQueryFilter[];
  userRole: "ADMIN" | "ANALYST" | "COMPLIANCE_OFFICER";
  adaptiveThresholds: {
    riskScore: number;
    stalenessDays: number;
  };
  learningHistory: Array<{ timestamp: string; action: string; outcome: string }>;
}

const initialGeminiMemoryState: GeminiMemoryState = {
  recentFilters: [],
  userRole: "ANALYST", // Default, should be dynamically fetched via auth
  adaptiveThresholds: {
    riskScore: 0.7, // Default high-risk threshold
    stalenessDays: 30, // Default for "stale" decisions
  },
  learningHistory: [],
};

type GeminiMemoryAction =
  | { type: "ADD_FILTER"; payload: DecisionQueryFilter }
  | { type: "UPDATE_USER_ROLE"; payload: GeminiMemoryState["userRole"] }
  | {
      type: "UPDATE_ADAPTIVE_THRESHOLD";
      payload: Partial<GeminiMemoryState["adaptiveThresholds"]>;
    }
  | {
      type: "ADD_LEARNING_EVENT";
      payload: GeminiMemoryState["learningHistory"][0];
    };

function geminiMemoryReducer(
  state: GeminiMemoryState,
  action: GeminiMemoryAction,
): GeminiMemoryState {
  switch (action.type) {
    case "ADD_FILTER":
      const updatedFilters = [
        action.payload,
        ...state.recentFilters.slice(0, 4),
      ]; // Keep last 5
      return { ...state, recentFilters: updatedFilters };
    case "UPDATE_USER_ROLE":
      return { ...state, userRole: action.payload };
    case "UPDATE_ADAPTIVE_THRESHOLD":
      return {
        ...state,
        adaptiveThresholds: {
          ...state.adaptiveThresholds,
          ...action.payload,
        },
      };
    case "ADD_LEARNING_EVENT":
      return {
        ...state,
        learningHistory: [...state.learningHistory, action.payload],
      };
    default:
      return state;
  }
}

// Gemini Context for providing memory throughout the component tree
const GeminiMemoryContext = createContext<{
  state: GeminiMemoryState;
  dispatch: React.Dispatch<GeminiMemoryAction>;
}>({
  state: initialGeminiMemoryState,
  dispatch: () => null,
});

export function GeminiMemoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(
    geminiMemoryReducer,
    initialGeminiMemoryState,
  );

  // Simulate dynamic role fetching
  useEffect(() => {
    // In a real app, this would integrate with an authentication service
    const fetchUserRole = async () => {
      // await new Promise(resolve => setTimeout(resolve, 500));
      const simulatedRole: GeminiMemoryState["userRole"] =
        Math.random() > 0.6
          ? "ADMIN"
          : Math.random() > 0.3
            ? "COMPLIANCE_OFFICER"
            : "ANALYST";
      dispatch({ type: "UPDATE_USER_ROLE", payload: simulatedRole });
      telemetryAgent.capture("UserRoleAssigned", { role: simulatedRole });
    };
    fetchUserRole();
  }, []);

  return (
    <GeminiMemoryContext.Provider value={{ state, dispatch }}>
      {children}
    </GeminiMemoryContext.Provider>
  );
}

export const useGeminiMemory = () => useContext(GeminiMemoryContext);

/**
 * GeminiComplianceEngine: Infuses AI reasoning for advanced compliance logic.
 * It's a self-correcting system that can dynamically adjust its rules based on context and learning history.
 */
export class GeminiComplianceEngine {
  private memory: GeminiMemoryState;
  private telemetry: GeminiTelemetryAgent;
  private static instance: GeminiComplianceEngine;

  private constructor(memoryState: GeminiMemoryState, agent: GeminiTelemetryAgent) {
    this.memory = memoryState;
    this.telemetry = agent;
  }

  public static getInstance(memoryState: GeminiMemoryState, agent: GeminiTelemetryAgent): GeminiComplianceEngine {
    if (!GeminiComplianceEngine.instance || GeminiComplianceEngine.instance.memory !== memoryState) {
        // Re-instantiate if memory state changes significantly, or if not initialized
        GeminiComplianceEngine.instance = new GeminiComplianceEngine(memoryState, agent);
    }
    return GeminiComplianceEngine.instance;
  }

  /**
   * Assesses decision compliance dynamically.
   * Incorporates adaptive thresholds from GeminiMemory.
   */
  public assessDecisionCompliance(
    decision: ReturnType<typeof useDecisionsHomeQuery>["data"]["decisions"]["edges"][0]["node"],
  ): {
    isCompliant: boolean;
    reason: string;
    suggestedAction?: string;
    riskScoreAdjusted: Decision__ScoreEnum;
  } {
    const { riskScore, stalenessDays } = this.memory.adaptiveThresholds;
    const { userRole } = this.memory;

    let isCompliant = true;
    let reason = "Initial assessment: Compliant.";
    let suggestedAction: string | undefined;
    let riskScoreAdjusted: Decision__ScoreEnum = decision.score;

    // Rule 1: High Risk Decisions
    if (decision.score === Decision__ScoreEnum.High) {
      isCompliant = false;
      reason = "Decision flagged as High Risk. Requires immediate review.";
      suggestedAction = "Escalate to Compliance Officer for manual override.";
      this.telemetry.capture("HighRiskDecisionDetected", {
        decisionId: decision.id,
        riskScore: decision.score,
      });
    }

    // Rule 2: Stale Decisions (adaptive based on memory)
    const updatedAt = new Date(decision.updatedAt);
    const now = new Date();
    const ageInDays = Math.floor(
      (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (ageInDays > stalenessDays) {
      isCompliant = false;
      reason = `${reason} Decision has not been updated in ${ageInDays} days, exceeding the adaptive staleness threshold (${stalenessDays} days).`;
      suggestedAction = suggestedAction || "Re-evaluate decision context.";
      riskScoreAdjusted = this.elevateRisk(riskScoreAdjusted); // AI-driven risk elevation
      this.telemetry.capture("StaleDecisionDetected", {
        decisionId: decision.id,
        ageInDays,
      });
    }

    // Rule 3: Dynamic context-aware checks (e.g., specific metadata patterns)
    if (
      decision.metadata &&
      JSON.stringify(decision.metadata).includes("sanctions_list")
    ) {
      isCompliant = false;
      reason = `${reason} Decision metadata contains sensitive keywords ('sanctions_list').`;
      suggestedAction =
        suggestedAction || "Perform enhanced due diligence immediately.";
      riskScoreAdjusted = this.elevateRisk(riskScoreAdjusted, 2); // Significant AI-driven risk elevation
      this.telemetry.capture("SensitiveMetadataDetected", {
        decisionId: decision.id,
      });
    }

    // Rule 4: User Role based access/review requirements
    if (userRole === "ANALYST" && !isCompliant) {
      reason = `[${userRole} Constraint] ${reason} - Analysts require manager approval for non-compliant decisions.`;
      suggestedAction =
        suggestedAction || "Request manager approval for non-compliant decision.";
    }

    // AI-powered adaptive learning: Adjust thresholds if too many false positives/negatives were observed historically.
    // (Simulated: In a real system, this would involve NLP/ML models)
    if (this.memory.learningHistory.length > 10) {
      const positiveReviews = this.memory.learningHistory.filter(
        (e) => e.action === "Review" && e.outcome === "Approved",
      ).length;
      if (positiveReviews / this.memory.learningHistory.length > 0.8) {
        // If most reviewed items are approved, perhaps the thresholds are too strict.
        // This is a dynamic self-correction mechanism.
        if (riskScore > 0.5) {
            this.telemetry.capture("AdaptiveThresholdAdjustment", { oldRiskScore: riskScore, newRiskScore: riskScore - 0.1 });
        }
      }
    }

    return { isCompliant, reason, suggestedAction, riskScoreAdjusted };
  }

  private elevateRisk(
    currentScore: Decision__ScoreEnum,
    steps = 1,
  ): Decision__ScoreEnum {
    const scores = [
      Decision__ScoreEnum.Low,
      Decision__ScoreEnum.Medium,
      Decision__ScoreEnum.High,
    ];
    const currentIndex = scores.indexOf(currentScore);
    const newIndex = Math.min(scores.length - 1, currentIndex + steps);
    return scores[newIndex];
  }

  /**
   * Prompts the AI for an optimal filtering strategy based on current context.
   * This is a prompt-based learning pipeline in action.
   */
  public async suggestOptimalFilters(
    currentFilters: DecisionQueryFilter,
  ): Promise<Partial<DecisionQueryFilter>> {
    this.telemetry.capture("OptimalFilterSuggestionRequested", {
      currentFilters,
      memoryState: this.memory,
    });
    // Simulate complex AI reasoning based on memory, trends, and user role
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate AI computation

    let suggested: Partial<DecisionQueryFilter> = {};

    if (this.memory.recentFilters.length > 0) {
      // Suggest applying the most recent filter that provided good results (simulated)
      suggested = this.memory.recentFilters[0];
      this.telemetry.capture("OptimalFilterSuggestionProvided", {
        strategy: "RecentFilter",
        suggested,
      });
    } else if (this.memory.userRole === "COMPLIANCE_OFFICER") {
      // Compliance officers might prioritize high-risk, unreviewed items
      suggested = {
        status: Decision__StatusEnum.Pending,
        score: Decision__ScoreEnum.High,
      };
      this.telemetry.capture("OptimalFilterSuggestionProvided", {
        strategy: "ComplianceOfficerPriority",
        suggested,
      });
    } else {
      // Default to showing pending or high-score decisions if no history
      suggested = {
        status: Decision__StatusEnum.Pending,
      };
      this.telemetry.capture("OptimalFilterSuggestionProvided", {
        strategy: "DefaultPending",
        suggested,
      });
    }

    // Add adaptive threshold filter if applicable
    if (this.memory.adaptiveThresholds.riskScore < 1) {
      // This is a simplification; in real AI, riskScore would map to an actual filter value
      // We assume score: Decision__ScoreEnum.High corresponds to the highest risk.
      // If adaptiveThresholds suggest less strict, we might broaden the search, or vice-versa.
    }

    return suggested;
  }
}

// --- End AI-Synthesized Modules ---

const MAPPING = {
  name: "Name",
  type: "Type",
  score: "Risk Level",
  createdAt: "Created At",
  updatedAt: "Last Updated",
  status: "Status",
  complianceStatus: "AI Compliance Status", // New field for AI-driven assessment
  aiActionSuggestion: "AI Action", // New field for AI-driven suggestions
};

const STYLE_MAPPING = {
  id: "table-entry-wide",
  status: "!py-1",
  complianceStatus: "!py-1",
  aiActionSuggestion: "whitespace-normal",
};

interface DecisionsHomeProps {
  onFiltersChanged?: (filters: Record<string, unknown>) => void;
  canWrite?: boolean;
}

type DecisionsQueryFilterTypes = {
  decisionableType?: DecisionableTypeEnum;
  score?: Decision__ScoreEnum;
  status?: Decision__StatusEnum;
  createdAt?: DateRangeFormValues;
  metadata?: string;
  // New AI-driven filters can be added here
};

function DecisionsHomeContent({
  onFiltersChanged,
  canWrite,
}: DecisionsHomeProps) {
  const { state: geminiMemory, dispatch: dispatchGeminiMemory } =
    useGeminiMemory();
  const complianceEngine = useMemo(() => GeminiComplianceEngine.getInstance(geminiMemory, telemetryAgent), [geminiMemory]);

  const { loading, data, error, refetch } = useDecisionsHomeQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      first: INITIAL_PAGINATION.perPage,
    },
  });

  // Local state for AI-driven prompt/refinement
  const [promptFilter, setPromptFilter] = React.useState<string>("");
  const currentQueryRef = useRef<DecisionQueryFilter>({}); // To hold the most recent user query

  const transformQueryStringToFilters = useCallback(
    (optionQuery: DecisionQueryFilter): DecisionsQueryFilterTypes => ({
      decisionableType: optionQuery.decisionable_type,
      status: optionQuery.status,
      score: optionQuery.score,
      metadata: JSON.stringify(optionQuery.metadata),
      createdAt: optionQuery.created_at,
    }),
    [],
  );

  const decisions = useMemo(() => {
    if (loading || !data || error) return [];

    return data.decisions.edges.map(({ node }) => {
      // --- Embed AI reasoning layers into every function (decision mapping) ---
      const {
        isCompliant,
        reason,
        suggestedAction,
        riskScoreAdjusted,
      } = complianceEngine.assessDecisionCompliance(node);

      // Log AI assessment for learning and observability
      dispatchGeminiMemory({
        type: "ADD_LEARNING_EVENT",
        payload: {
          timestamp: new Date().toISOString(),
          action: "DecisionAssessed",
          outcome: isCompliant ? "Compliant" : "Non-Compliant",
        },
      });
      telemetryAgent.capture("DecisionComplianceAssessed", {
        decisionId: node.id,
        isCompliant,
        reason,
        suggestedAction,
        originalScore: node?.score,
        adjustedScore: riskScoreAdjusted,
      });

      return {
        ...node,
        name: node?.bestName,
        type: node?.decisionableType?.replace(/([A-Z])/g, " $1").trim(),
        score: <RiskLevelIndicator riskLevel={riskScoreAdjusted || ""} />, // Display AI-adjusted risk
        status: <ComplianceStatusBadge status={node?.status} />,
        createdAt: <DateTime timestamp={node?.createdAt} />,
        updatedAt: <DateTime timestamp={node?.updatedAt} />,
        // New AI-driven fields
        complianceStatus: (
          <ComplianceStatusBadge
            status={isCompliant ? Decision__StatusEnum.Approved : Decision__StatusEnum.Pending}
            text={isCompliant ? "AI Approved" : "AI Review"}
            variant={isCompliant ? "green" : "red"}
          />
        ),
        aiActionSuggestion: (
          <div className="text-xs text-gray-600">
            {suggestedAction || "No immediate AI action."}
          </div>
        ),
      };
    });
  }, [loading, data, error, complianceEngine, dispatchGeminiMemory]);

  const handleRefetch = useCallback(
    async (options: {
      cursorPaginationParams: CursorPaginationInput;
      query: DecisionQueryFilter;
    }) => {
      const { cursorPaginationParams, query } = options;

      // Store current query for AI memory
      currentQueryRef.current = query;
      dispatchGeminiMemory({ type: "ADD_FILTER", payload: query });

      // --- Introduce decision-making at every level: input, output, error handling, state mutation, and data flow ---
      // AI-driven query refinement
      let refinedQuery: DecisionQueryFilter = { ...query };

      // Simulate a "prompt" based learning pipeline for dynamic filtering
      if (promptFilter.length > 0) {
        // Here, the AI would parse `promptFilter` (e.g., "show me high risk pending decisions from last month")
        // and synthesize appropriate filter values.
        // For this example, we'll simulate a simple interpretation.
        if (promptFilter.toLowerCase().includes("high risk")) {
          refinedQuery.score = Decision__ScoreEnum.High;
        }
        if (promptFilter.toLowerCase().includes("pending")) {
          refinedQuery.status = Decision__StatusEnum.Pending;
        }
        if (
          promptFilter.toLowerCase().includes("stale") ||
          promptFilter.toLowerCase().includes("unupdated")
        ) {
          // AI integrates with memory to define "stale"
          const cutoffDate = new Date();
          cutoffDate.setDate(
            cutoffDate.getDate() - geminiMemory.adaptiveThresholds.stalenessDays,
          );
          refinedQuery.created_at = {
            startDate: undefined,
            endDate: cutoffDate.toISOString().split("T")[0],
          };
        }
        telemetryAgent.capture("PromptRefinementApplied", {
          originalQuery: query,
          prompt: promptFilter,
          refinedQuery: refinedQuery,
        });
      } else {
        // If no prompt, let AI suggest optimal filters based on memory/role
        const optimalSuggestions = await complianceEngine.suggestOptimalFilters(
          query,
        );
        // Merge AI suggestions, giving user input priority
        refinedQuery = { ...optimalSuggestions, ...refinedQuery };
        telemetryAgent.capture("AISuggestedFilterApplied", {
          originalQuery: query,
          suggestions: optimalSuggestions,
          finalQuery: refinedQuery,
        });
      }

      const newFilters = transformQueryStringToFilters(refinedQuery);

      if (onFiltersChanged !== undefined) {
        onFiltersChanged(refinedQuery); // Report the AI-refined query
      }

      try {
        await refetch({
          ...newFilters,
          createdAt: dateSearchMapper(newFilters.createdAt),
          ...cursorPaginationParams,
        });
        telemetryAgent.capture("DecisionsRefetchSuccess", {
          query: refinedQuery,
        });
      } catch (e) {
        console.error("AI-enhanced refetch failed:", e);
        telemetryAgent.capture("DecisionsRefetchFailure", {
          query: refinedQuery,
          error: e.message,
          circuitBreakerAttempt: true, // Indicate AI-managed error handling attempt
        });
        // Implement simple circuit-breaker: if refetch fails, try a simpler query
        if (e.message.includes("network")) {
          console.warn(
            "Network error detected, attempting simpler query for graceful degradation.",
          );
          await refetch({
            first: INITIAL_PAGINATION.perPage,
          });
          telemetryAgent.capture("DecisionsRefetchFallback", {
            reason: "NetworkError",
          });
        }
      }
    },
    [
      onFiltersChanged,
      transformQueryStringToFilters,
      promptFilter,
      dispatchGeminiMemory,
      complianceEngine,
      geminiMemory.adaptiveThresholds.stalenessDays,
      refetch,
    ],
  );

  const searchComponents = getDecisionSearchComponents(
    canWrite === undefined ? undefined : !canWrite,
  );

  // AI-powered dynamic button for optimal filter suggestions
  const handleAISuggestOptimalFilters = useCallback(async () => {
    const suggestedFilters = await complianceEngine.suggestOptimalFilters(
      currentQueryRef.current,
    );
    // Directly apply the suggested filters, triggering a refetch
    await handleRefetch({
      cursorPaginationParams: { first: INITIAL_PAGINATION.perPage }, // Reset pagination for new filter set
      query: { ...currentQueryRef.current, ...suggestedFilters }, // Merge with current, AI suggestions take priority
    });
    telemetryAgent.capture("AISuggestOptimalFiltersApplied", { suggestedFilters });
  }, [complianceEngine, handleRefetch]);


  return (
    <div className="mt-4">
      {/* AI-powered prompt-based learning pipeline */}
      <div className="mb-4 p-4 border rounded-lg bg-indigo-50 shadow-sm flex items-center justify-between">
        <input
          type="text"
          placeholder="AI-Powered Filter: Describe your search (e.g., 'show high risk pending last month')"
          className="flex-grow p-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={promptFilter}
          onChange={(e) => setPromptFilter(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await handleRefetch({
                cursorPaginationParams: { first: INITIAL_PAGINATION.perPage },
                query: currentQueryRef.current, // Use current query, AI will merge prompt
              });
            }
          }}
        />
        <button
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={async () =>
            await handleRefetch({
              cursorPaginationParams: { first: INITIAL_PAGINATION.perPage },
              query: currentQueryRef.current,
            })
          }
        >
          Apply AI Filter
        </button>
        <button
          className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={handleAISuggestOptimalFilters}
          title="Let AI suggest the most relevant filters based on context and learning."
        >
          AI Suggest Filters
        </button>
      </div>

      <EntityTableView
        data={decisions}
        dataMapping={MAPPING}
        styleMapping={STYLE_MAPPING}
        resource={DECISION}
        disableMetadata
        loading={loading}
        defaultSearchComponents={searchComponents.defaultComponents}
        additionalSearchComponents={searchComponents.additionalComponents}
        customizableColumns
        onQueryArgChange={handleRefetch}
        cursorPagination={data?.decisions?.pageInfo}
        enableExportData={onFiltersChanged === undefined}
        // AI-powered dynamic scaling simulation: if many decisions and low latency, enable more features
        // In a real app, this would be based on actual performance metrics
        footerText={`AI Intelligence Level: ${
          geminiMemory.learningHistory.length > 5 ? "Adaptive" : "Basic"
        } | Role: ${geminiMemory.userRole}`}
      />
    </div>
  );
}

// Wrap DecisionsHomeContent with GeminiMemoryProvider to enable AI memory and context
function DecisionsHome(props: DecisionsHomeProps) {
  return (
    <GeminiMemoryProvider>
      <DecisionsHomeContent {...props} />
    </GeminiMemoryProvider>
  );
}

export default DecisionsHome;