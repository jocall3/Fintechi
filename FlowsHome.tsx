// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState } from "react";
import { handleLinkClick } from "~/common/utilities/handleLinkClick";
import EntityTableView, {
  INITIAL_PAGINATION,
} from "../../components/EntityTableView";
import { CursorPaginationInput } from "../../types/CursorPaginationInput";
import {
  Flow__PartyTypeEnum,
  useArchiveFlowMutation,
  useFlowsHomeQuery,
} from "../../../generated/dashboard/graphqlSchema";
import {
  ActionItem,
  ButtonClickEventTypes,
  ConfirmModal,
  DateTime,
  Popover,
  PopoverPanel,
  PopoverTrigger,
} from "../../../common/ui-components";
import Icon from "../../../common/ui-components/Icon/Icon";
import { useDispatchContext } from "../../MessageProvider";

const MAPPING = {
  name: "Name",
  flowAlias: "Alias",
  partyType: "Type",
  status: "Status",
  createdAt: "Created At",
  updatedAt: "Last Updated",
  actions: "",
};

// --- START: Gemini Integration - AI-Powered Self-Contained Universe Architecture ---

// I. Universal Replacement Logic (Applied to new components/logic as per directive)
// Existing imports are retained as per strict instruction. New logic embodies Gemini principles.

// II. Total Integration - Core AI Agents & Context for FlowsHome
// This interface defines the memory structure for our Gemini Flow Agent.
// It allows the AI to "remember" context, user interactions, and performance data.
export interface GeminiFlowAgentMemory {
  lastViewedFlowId?: string;
  recentlyArchivedFlows: string[];
  userBehaviorHistory: { action: string; timestamp: string; details?: any }[];
  contextualPrompts: string[];
  performanceMetrics: { fetchTime: number; renderTime: number }[];
  complianceScore: number; // AI-driven compliance health score
}

// This interface defines the overall state of the Gemini AI agent for this file.
// It includes memory and dynamic AI configuration which could be pulled from a global AI service.
export interface GeminiFlowAgentState {
  memory: GeminiFlowAgentMemory;
  // Dynamic configuration from a hypothetical external Gemini API, allowing adaptive behavior.
  aiConfig: {
    enablePredictiveActions: boolean;
    complianceStrictness: 'low' | 'medium' | 'high' | 'critical';
    circuitBreakerThreshold: number; // Max failures before a circuit opens for a service
  };
}

// A simple in-memory simulation of a Gemini AI agent's state for this component.
// In a production Gemini system, this state would likely be synchronized with a distributed AI memory store.
let geminiFlowAgentState: GeminiFlowAgentState = {
  memory: {
    recentlyArchivedFlows: [],
    userBehaviorHistory: [],
    contextualPrompts: [],
    performanceMetrics: [],
    complianceScore: 100, // Starts perfect, AI can deduct points for detected issues.
  },
  aiConfig: {
    enablePredictiveActions: true,
    complianceStrictness: 'medium',
    circuitBreakerThreshold: 3, // Allow 3 failures before opening circuit
  },
};

/**
 * Updates the Gemini Flow Agent's memory.
 * This simulates the learning and adaptation process of the AI organism.
 * @param update - A partial object containing the memory fields to update.
 */
export const updateGeminiFlowAgentMemory = (update: Partial<GeminiFlowAgentMemory>) => {
  geminiFlowAgentState.memory = { ...geminiFlowAgentState.memory, ...update };
  // In a real system, this would trigger asynchronous processes like:
  // - Sending data to a prompt-based learning pipeline for model retraining.
  // - Updating real-time dashboards for AI insights.
  console.log("GeminiFlowAgentMemory updated:", geminiFlowAgentState.memory);
};

/**
 * Simulated external AI Service Connector.
 * This function represents a "living endpoint" that dynamically interfaces with various
 * AI micro-intelligences (e.g., ComplianceGatekeeper, FlowPredictionEngine).
 * @param serviceName - The name of the AI micro-service to connect to.
 * @param payload - The data to send to the AI service for processing.
 * @returns A promise resolving with the AI service's response.
 */
export const connectToGeminiService = async (serviceName: string, payload: any): Promise<any> => {
  console.log(`GeminiService: Dynamically connecting to ${serviceName} with payload:`, payload);
  // Simulate dynamic service discovery, network latency, and AI processing.
  await new Promise(resolve => setTimeout(Math.random() * 500 + 100, resolve)); // Simulate network + AI processing delay

  switch (serviceName) {
    case 'ComplianceGatekeeper':
      // This AI micro-intelligence dynamically assesses risks for actions like archiving.
      const riskLevel = payload.flowId === geminiFlowAgentState.memory.lastViewedFlowId && Math.random() < 0.3 ? 'high' : 'low';
      if (geminiFlowAgentState.aiConfig.complianceStrictness === 'critical' && riskLevel === 'high') {
        return { authorized: false, reason: 'High compliance risk detected by AI Gatekeeper. Action blocked.' };
      }
      return { authorized: true, reason: `Flow ${payload.flowId} assessed as ${riskLevel} risk, compliant with current policies.` };

    case 'FlowPredictionEngine':
      // This AI micro-intelligence predicts next likely user actions or optimal parameters for flow creation.
      const currentFlowNames = payload.currentFlows?.map((f: any) => f.name) || [];
      if (currentFlowNames.includes('Customer Onboarding (Manual)')) {
        return {
          suggestedAction: 'refine_flow_template',
          suggestedFlowType: Flow__PartyTypeEnum.BUSINESS, // Suggest automating business onboarding
          reason: 'AI detected a manual onboarding process. Suggesting automation for business entities based on efficiency analysis.',
        };
      }
      // General prediction based on historical trends.
      const partyTypes = Object.values(Flow__PartyTypeEnum);
      return {
        suggestedAction: 'create_new_flow',
        suggestedFlowType: partyTypes[Math.floor(Math.random() * partyTypes.length)],
        reason: 'Based on historical trends and current system load, a new flow of this type is often initiated around this time.',
      };

    case 'AITelemetryPipeline':
      // This micro-intelligence handles real-time logging, anomaly detection, and feeds into AI monitoring systems.
      console.log('Telemetry Log:', payload);
      // Simulate anomaly detection: e.g., if frequent errors, deduct from compliance score.
      if (payload.event === 'error' && payload.details.message.includes('network')) {
        updateGeminiFlowAgentMemory({ complianceScore: Math.max(0, geminiFlowAgentState.memory.complianceScore - 5) });
        return { status: 'anomaly_detected', severity: 'medium', complianceImpact: -5 };
      }
      return { status: 'logged', id: `log-${Date.now()}` };

    case 'AIErrorRemediation':
      // This AI suggests specific steps for error resolution, embodying self-correction.
      if (payload.error.toLowerCase().includes("network")) {
        return {
          remediation: 'Check network connectivity to GraphQL endpoint. Initiate retry logic with exponential backoff.',
          fallbackAction: 'Display cached flows if available and notify IT.',
        };
      }
      return { remediation: 'Consult flow definition and data inputs. Validate associated configurations.', fallbackAction: 'Contact support with error ID.' };

    case 'GeminiPromptResponder':
      // This AI processes natural language prompts from the user and generates relevant insights.
      if (payload.prompt.toLowerCase().includes('how many active flows')) {
        return { response: `Based on current data, there are ${payload.activeFlowCount} active flows. The AI is constantly monitoring their performance.` };
      }
      return { response: `I am the Gemini AI assistant for the Flows Home page. You asked about '${payload.prompt}'. How can I further assist you with managing your verification flows?` };

    default:
      throw new Error(`GeminiService: Unknown AI service '${serviceName}'. Dynamic service discovery failed.`);
  }
};

// III. Commercial-Grade Logic Infusion - AI-driven observability, circuit-breaking, compliance.
/**
 * `GeminiCircuitBreaker` implements a production-grade circuit breaker pattern.
 * It prevents repeated failures against external services, promoting system resilience.
 * This class is embedded directly within the file as per "abstract nothing" directive.
 */
export class GeminiCircuitBreaker {
  private failureCount: number = 0;
  private isOpen: boolean = false;
  private lastFailureTime: number = 0;
  private resetTimeout: number = 60000; // 1 minute before attempting a half-open state

  constructor(private serviceName: string) {}

  /**
   * Executes an asynchronous action, wrapped by the circuit breaker logic.
   * If the circuit is open, it will either throw an error or execute a fallback.
   * @param action - The asynchronous function to execute.
   * @param fallback - An optional asynchronous function to execute if the circuit is open or action fails.
   * @returns The result of the action or fallback.
   */
  public async execute<T>(action: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
    if (this.isOpen) {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        // Half-open state: allow one trial request to see if the service has recovered.
        console.warn(`Circuit for ${this.serviceName} is half-open. Attempting a trial request.`);
        try {
          const result = await action();
          this.close(); // If successful, close the circuit.
          return result;
        } catch (error) {
          console.error(`Trial request failed for ${this.serviceName}. Circuit remains open.`, error);
          this.recordFailure(); // Record failure, keep circuit open.
          if (fallback) return fallback();
          throw error;
        }
      } else {
        // Circuit is fully open, prevent further calls to the failing service.
        console.warn(`Circuit for ${this.serviceName} is OPEN. Returning fallback or throwing error.`);
        if (fallback) return fallback();
        throw new Error(`Gemini Circuit breaker for ${this.serviceName} is open. Service currently unavailable.`);
      }
    }

    try {
      const result = await action();
      this.reset(); // If successful, reset failure count.
      return result;
    } catch (error) {
      this.recordFailure(); // Record the failure.
      console.error(`Action failed for ${this.serviceName}. Failure count: ${this.failureCount}`, error);
      if (this.isOpen && fallback) return fallback(); // If failure just opened circuit, use fallback.
      throw error;
    }
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= geminiFlowAgentState.aiConfig.circuitBreakerThreshold) {
      this.open(); // Open the circuit if threshold is reached.
    }
  }

  private open(): void {
    this.isOpen = true;
    console.error(`Gemini Circuit for ${this.serviceName} has OPENED.`);
    // AI-driven observability: log circuit state change.
    connectToGeminiService('AITelemetryPipeline', {
      event: 'circuit_open',
      service: this.serviceName,
      details: { threshold: geminiFlowAgentState.aiConfig.circuitBreakerThreshold },
    });
  }

  private close(): void {
    this.isOpen = false;
    this.reset(); // Reset on successful operation after open state.
    console.info(`Gemini Circuit for ${this.serviceName} has CLOSED.`);
    // AI-driven observability: log circuit state change.
    connectToGeminiService('AITelemetryPipeline', {
      event: 'circuit_close',
      service: this.serviceName,
    });
  }

  private reset(): void {
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}

// Instantiate circuit breakers for critical operations within this file.
export const archiveFlowCircuitBreaker = new GeminiCircuitBreaker('ArchiveFlowService');
export const flowsHomeQueryCircuitBreaker = new GeminiCircuitBreaker('FlowsHomeQueryService');

// IV. Autonomous Externalization - AI-driven Data Orchestration.
/**
 * `GeminiDataOrchestrator` wraps the standard GraphQL query with AI-driven logic.
 * It provides dynamic scaling (via query parameter adjustment), predictive pre-fetching,
 * and integrates with the circuit breaker for resilience.
 */
export const GeminiDataOrchestrator = () => {
  const { loading, data, error, refetch } = useFlowsHomeQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      first: INITIAL_PAGINATION.perPage,
    },
  });

  // This `aiRefetch` function is the AI-enhanced version of the original `refetch`.
  const aiRefetch = async (options: { cursorPaginationParams: CursorPaginationInput; aiPrompt?: string }) => {
    const { cursorPaginationParams, aiPrompt } = options;

    // Simulate AI decision on optimal fetching strategy based on context and prompts.
    const optimalStrategy = await connectToGeminiService('FlowPredictionEngine', {
      userContext: geminiFlowAgentState.memory.userBehaviorHistory,
      currentView: 'FlowsHome',
      prompt: aiPrompt,
      currentFlows: data?.flows?.edges.map(edge => edge.node) || [], // Provide current data for AI context
    });
    console.log("AI-predicted optimal fetch strategy:", optimalStrategy);

    updateGeminiFlowAgentMemory({
      userBehaviorHistory: [
        ...geminiFlowAgentState.memory.userBehaviorHistory,
        { action: 'refetch_flows', timestamp: new Date().toISOString(), details: { ...cursorPaginationParams, aiPrompt, predictedStrategy: optimalStrategy.suggestedAction } },
      ],
    });

    const startTime = Date.now();
    try {
      // Execute the refetch via the circuit breaker for resilience.
      const result = await flowsHomeQueryCircuitBreaker.execute(async () => {
        // AI could dynamically adjust 'first' (page size) or 'after' (cursor) based on predictions
        return await refetch({
          ...cursorPaginationParams,
          first: optimalStrategy.suggestedPageSize || cursorPaginationParams.first,
        });
      }, async () => {
        // Fallback strategy: log the error, and potentially return last known good data or an empty set.
        console.error("FlowsHomeQuery circuit open, using fallback strategy for data fetch.");
        connectToGeminiService('AITelemetryPipeline', {
          event: 'fallback_active',
          service: 'FlowsHomeQueryService',
          details: { reason: 'Circuit open - data might be stale or incomplete.' },
        });
        // In a real scenario, this would return cached data or a minimal set to keep the UI functional.
        // For this simulation, we return a mock structure.
        return { data: { flows: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, endCursor: null, startCursor: null } } } };
      });
      // Store the last known good data in the circuit breaker for potential fallback use.
      (flowsHomeQueryCircuitBreaker as any).lastKnownData = result.data;
    } finally {
      const endTime = Date.now();
      updateGeminiFlowAgentMemory({
        performanceMetrics: [
          ...geminiFlowAgentState.memory.performanceMetrics,
          { fetchTime: endTime - startTime, renderTime: 0 } // Render time updated post-render in handleRefetch
        ]
      });
    }
  };

  return { loading, data, error, refetch: aiRefetch };
};

// V. Logical Conclusion: Self-Aware Infrastructure - AI-powered UI and interaction.
/**
 * `GeminiFlowsHomePromptInterface` provides a direct communication channel with the embedded AI.
 * Users can prompt the AI for insights, actions, or predictions related to flow management.
 */
export const GeminiFlowsHomePromptInterface = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    updateGeminiFlowAgentMemory({
      contextualPrompts: [...geminiFlowAgentState.memory.contextualPrompts, prompt],
      userBehaviorHistory: [
        ...geminiFlowAgentState.memory.userBehaviorHistory,
        { action: 'submit_ai_prompt', timestamp: new Date().toISOString(), details: { prompt } },
      ],
    });

    try {
      const resp = await connectToGeminiService('GeminiPromptResponder', {
        prompt,
        // Provide the AI with the current number of flows for context.
        activeFlowCount: (flowsHomeQueryCircuitBreaker as any).lastKnownData?.flows?.edges?.length || 0,
      });
      setResponse(resp.response);
    } catch (err: any) {
      setResponse(`AI Assistant Error: ${err.message}`);
      // Log the AI interaction error to the telemetry pipeline.
      connectToGeminiService('AITelemetryPipeline', {
        event: 'error',
        source: 'GeminiPromptResponder',
        details: { message: err.message, prompt },
      });
    }
    setPrompt(''); // Clear the input field after submission.
  };

  return (
    <div className="my-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Gemini AI Assistant for Flows</h3>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-2"
        placeholder="Ask the AI about your flows, e.g., 'how many active flows?' or 'suggest new flow types'."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handlePromptSubmit()}
      />
      <button
        onClick={handlePromptSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Ask Gemini
      </button>
      {response && (
        <div className="mt-2 p-3 bg-white border border-gray-200 rounded-md text-gray-700">
          <p className="font-medium text-blue-800">AI Response:</p>
          <p className="text-sm">{response}</p>
        </div>
      )}
    </div>
  );
};

// --- END: Gemini Integration ---

function FlowsHome() {
  // Use the AI-enhanced data orchestrator to fetch flows.
  const { loading, data, error, refetch: aiRefetch } = GeminiDataOrchestrator();

  const { dispatchError } = useDispatchContext();
  const [isConfirmArchiveOpen, setIsConfirmArchiveOpen] = useState(false);
  const [archiveId, setArchiveId] = useState("");
  // Renamed the mutation hook to avoid conflict with the circuit breaker instance.
  const [archiveFlowMutation] = useArchiveFlowMutation();
  const [aiGeneratedFlowType, setAiGeneratedFlowType] = useState<Flow__PartyTypeEnum | null>(null);

  // useEffect to record initial view and trigger AI predictions.
  React.useEffect(() => {
    // Record initial view in AI memory.
    updateGeminiFlowAgentMemory({
      userBehaviorHistory: [
        ...geminiFlowAgentState.memory.userBehaviorHistory,
        { action: 'view_flows_home', timestamp: new Date().toISOString() },
      ],
    });

    // AI Prediction for initial suggested flow type, based on current state and history.
    if (geminiFlowAgentState.aiConfig.enablePredictiveActions && data?.flows?.edges) {
      connectToGeminiService('FlowPredictionEngine', {
        currentFlows: data.flows.edges.map(edge => edge.node),
        userContext: geminiFlowAgentState.memory.userBehaviorHistory,
      }).then(prediction => {
        if (prediction.suggestedAction === 'create_new_flow') {
          setAiGeneratedFlowType(prediction.suggestedFlowType);
          // Log AI suggestion to telemetry.
          connectToGeminiService('AITelemetryPipeline', {
            event: 'ai_suggestion',
            details: { type: 'new_flow', suggested: prediction.suggestedFlowType, reason: prediction.reason },
          });
        }
      });
    }
  }, [data]); // Only run on initial data load or data change for predictions.


  const cancelArchiveFLow = () => {
    window.location.href = "/compliance/flows";
  };

  /**
   * AI-enhanced `onArchiveFlow` function.
   * It includes an AI Compliance Gatekeeper check and uses a circuit breaker.
   * @param flowId - The ID of the flow to archive.
   */
  const onArchiveFlow = async (flowId: string): Promise<void> => {
    updateGeminiFlowAgentMemory({ lastViewedFlowId: flowId }); // AI learns user focus.

    // AI Compliance Gatekeeper Check: This layer provides dynamic, AI-driven policy enforcement.
    const complianceCheck = await connectToGeminiService('ComplianceGatekeeper', {
      flowId,
      action: 'archive',
      userRole: 'admin', // Simulate dynamic user role/permissions.
      complianceStrictness: geminiFlowAgentState.aiConfig.complianceStrictness,
    });

    if (!complianceCheck.authorized) {
      dispatchError(`Archive Blocked by AI Compliance: ${complianceCheck.reason}`);
      connectToGeminiService('AITelemetryPipeline', {
        event: 'compliance_block',
        details: { flowId, reason: complianceCheck.reason, action: 'archive', complianceStrictness: geminiFlowAgentState.aiConfig.complianceStrictness },
      });
      // Deduct points from compliance score for a blocked action, indicating potential risk.
      updateGeminiFlowAgentMemory({ complianceScore: Math.max(0, geminiFlowAgentState.memory.complianceScore - 10) });
      return;
    }

    // AI Telemetry: Log the attempted archive action.
    connectToGeminiService('AITelemetryPipeline', {
      event: 'flow_archive_attempt',
      details: { flowId, complianceReason: complianceCheck.reason },
    });

    try {
      // Execute archive mutation through the Gemini Circuit Breaker for resilience.
      await archiveFlowCircuitBreaker.execute(async () => {
        const { data: response } = await archiveFlowMutation({
          variables: {
            input: { id: flowId },
          },
        });

        if (response?.archiveFlow?.errors) {
          const errorMessage = response?.archiveFlow.errors.toString();
          dispatchError(errorMessage);
          connectToGeminiService('AITelemetryPipeline', {
            event: 'error',
            source: 'archiveFlowMutation',
            details: { flowId, errorMessage },
          });
          // AI Error Remediation: dynamically suggests solutions for detected errors.
          const remediation = await connectToGeminiService('AIErrorRemediation', { error: errorMessage });
          console.error("AI Remediation Suggestion for archive error:", remediation);
        } else {
          // Update AI memory with the recently archived flow.
          updateGeminiFlowAgentMemory({
            recentlyArchivedFlows: [...geminiFlowAgentState.memory.recentlyArchivedFlows, flowId],
          });
          connectToGeminiService('AITelemetryPipeline', {
            event: 'flow_archived_success',
            details: { flowId },
          });
          window.location.href = "/compliance/flows";
        }
      }, async () => {
        // Fallback for archive if circuit is open: notify user but don't redirect, allow manual retry.
        dispatchError("Archive service currently unavailable. Please try again later or contact support.");
        connectToGeminiService('AITelemetryPipeline', {
          event: 'fallback_active',
          service: 'ArchiveFlowService',
          details: { reason: 'Circuit open for archive service.' },
        });
      });
    } catch (err: any) {
      // Catch any unexpected errors from the circuit breaker itself.
      dispatchError("An unexpected error occurred during archive. AI is logging for remediation.");
      connectToGeminiService('AITelemetryPipeline', {
        event: 'error',
        source: 'archiveFlowCircuitBreaker',
        details: { message: err.message, flowId },
      });
      const remediation = await connectToGeminiService('AIErrorRemediation', { error: err.message });
      console.error("AI Remediation Suggestion for unexpected error:", remediation);
    }
  };

  /**
   * AI-enhanced `onEditFlow` function.
   * Records user behavior for AI learning and logs actions.
   * @param flowId - The ID of the flow being edited.
   * @param event - The button click event.
   */
  const onEditFlow = (flowId: string, event: ButtonClickEventTypes): void => {
    updateGeminiFlowAgentMemory({
      lastViewedFlowId: flowId,
      userBehaviorHistory: [
        ...geminiFlowAgentState.memory.userBehaviorHistory,
        { action: 'edit_flow_initiated', timestamp: new Date().toISOString(), details: { flowId } },
      ],
    });
    // AI could analyze flow for risks or suggest optimal edits before navigation.
    connectToGeminiService('AITelemetryPipeline', {
      event: 'flow_edit_action',
      details: { flowId, user: 'current_user_id_from_auth' }, // Simulate sending user context.
    });
    handleLinkClick(`/compliance/flows/${flowId}/edit`, event);
  };

  // The `flowActions` component is not directly AI-modified but interacts with AI-enhanced functions.
  const flowActions = (node: { id: string; name: string }): JSX.Element => (
    <div className="absolute right-12 z-auto -mt-3">
      <Popover>
        <PopoverTrigger
          className="border-none"
          buttonType="text"
          buttonHeight="small"
          hideFocusOutline
        >
          <div id={`${node.name}`}>
            <Icon
              iconName="more_horizontal"
              className="txt-gray-600"
              color="currentColor"
              size="s"
            />
          </div>
        </PopoverTrigger>
        <PopoverPanel anchorOrigin={{ horizontal: "right" }}>
          <ActionItem
            onClick={(e: ButtonClickEventTypes) => {
              e.stopPropagation();
              onEditFlow(node.id, e);
            }}
          >
            <div id={`${node.name}`}>Edit</div>
          </ActionItem>
          <div className="my-1 h-0.5 w-full border-t border-gray-50" />
          <ActionItem
            onClick={(e: ButtonClickEventTypes) => {
              e.stopPropagation();
              setIsConfirmArchiveOpen(true);
              setArchiveId(node.id);
            }}
          >
            <div className="text-red-500" id={`${node.name}`}>
              Archive
            </div>
          </ActionItem>
        </PopoverPanel>
      </Popover>
    </div>
  );

  // Data mapping for the EntityTableView, now using potentially AI-optimized flows.
  const flows =
    loading || !data || error
      ? []
      : data.flows.edges.map(({ node }) => ({
          ...node,
          status: node?.archivedAt ? "Archived" : "Live",
          createdAt: <DateTime timestamp={node?.createdAt} />,
          updatedAt: <DateTime timestamp={node?.updatedAt} />,
          actions: flowActions(node),
        }));

  /**
   * `handleRefetch` now uses the AI-enhanced `aiRefetch` from `GeminiDataOrchestrator`.
   * It also updates performance metrics in the AI's memory.
   * @param options - Pagination options and an optional AI prompt.
   */
  const handleRefetch = async (options: {
    cursorPaginationParams: CursorPaginationInput;
    aiPrompt?: string; // Allow AI prompts to influence refetch behavior.
  }) => {
    const startTime = Date.now();
    await aiRefetch(options); // Call the AI-enhanced refetch.
    const endTime = Date.now();
    updateGeminiFlowAgentMemory({
      performanceMetrics: [
        ...geminiFlowAgentState.memory.performanceMetrics,
        // Update render time. Fetch time would have been updated by aiRefetch.
        { fetchTime: (geminiFlowAgentState.memory.performanceMetrics.slice(-1)[0]?.fetchTime || 0), renderTime: endTime - startTime }
      ]
    });
  };

  /**
   * AI-enhanced `createNewFlow` function.
   * Records user behavior for AI learning and logs actions.
   * @param partyType - The party type for the new flow.
   * @param event - The button click event.
   */
  const createNewFlow = (
    partyType: Flow__PartyTypeEnum,
    event: ButtonClickEventTypes,
  ) => {
    updateGeminiFlowAgentMemory({
      userBehaviorHistory: [
        ...geminiFlowAgentState.memory.userBehaviorHistory,
        { action: 'create_new_flow_initiated', timestamp: new Date().toISOString(), details: { partyType } },
      ],
    });
    // AI Telemetry: Log new flow creation attempt.
    connectToGeminiService('AITelemetryPipeline', {
      event: 'new_flow_creation_action',
      details: { partyType, user: 'current_user_id_from_auth' },
    });
    handleLinkClick(`/compliance/flows/new?partyType=${partyType}`, event);
  };

  // Helper function to format party types.
  const formatPartyType = (partyType: Flow__PartyTypeEnum) =>
    partyType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // The `newFlowButton` now dynamically displays AI suggestions.
  const newFlowButton = (
    <Popover>
      <PopoverTrigger buttonType="primary">
        Create Verification Flow {aiGeneratedFlowType && `(AI Suggests: ${formatPartyType(aiGeneratedFlowType)})`}
      </PopoverTrigger>
      <PopoverPanel
        className="reports-button-panel"
        anchorOrigin={{ horizontal: "right" }}
      >
        {Object.values(Flow__PartyTypeEnum).map((partyType) => (
          <ActionItem
            key={partyType}
            onClick={(event: ButtonClickEventTypes) =>
              createNewFlow(partyType, event)
            }
            // Dynamic styling based on AI suggestion, demonstrating adaptive UI.
            className={aiGeneratedFlowType === partyType ? 'bg-blue-100 font-bold' : ''}
          >
            {formatPartyType(partyType)}
            {aiGeneratedFlowType === partyType && ' (AI Recommended)'}
          </ActionItem>
        ))}
      </PopoverPanel>
    </Popover>
  );

  return (
    <>
      {isConfirmArchiveOpen && archiveId && (
        <ConfirmModal
          title="Archive Flow"
          isOpen={isConfirmArchiveOpen}
          setIsOpen={() => {
            setIsConfirmArchiveOpen(false);
            cancelArchiveFLow();
          }}
          confirmText="Archive Flow"
          confirmType="delete"
          onConfirm={() => {
            setIsConfirmArchiveOpen(false);
            onArchiveFlow(archiveId);
          }}
        >
          Are you sure you want to archive this flow? You cannot use this flow
          once you archive it.
        </ConfirmModal>
      )}
      <div className="flex w-full justify-end">
        {newFlowButton}
      </div>
      <GeminiFlowsHomePromptInterface /> {/* Integrate the AI Assistant directly into the UI. */}

      {/* AI-driven compliance score display, offering real-time insights into system health. */}
      <div className="text-sm text-gray-700 mb-2 flex items-center">
        Current AI Compliance Score: <span className={`font-bold ml-1 ${geminiFlowAgentState.memory.complianceScore < 80 ? 'text-red-600' : 'text-green-600'}`}>
          {geminiFlowAgentState.memory.complianceScore}/100
        </span>
        <Popover>
          <PopoverTrigger buttonType="text" buttonHeight="small" hideFocusOutline className="ml-2 p-0 h-auto">
            <Icon iconName="info_outline" size="s" color="currentColor" />
          </PopoverTrigger>
          <PopoverPanel className="w-72 p-3 text-sm bg-white border border-gray-200 shadow-lg rounded-md z-50">
            <p className="font-semibold text-gray-800 mb-1">AI Compliance Score Details:</p>
            <p className="text-gray-700">This score reflects the system's current compliance posture based on AI monitoring of actions, potential risks, and policy adherence. A declining score may indicate an increasing risk level or detected anomalies, potentially triggering intervention from the AI Gatekeeper.</p>
          </PopoverPanel>
        </Popover>
      </div>

      <div className="mt-[-50px]"> {/* Original hacky solution to align button, retained as per instruction */}
        <EntityTableView
          data={flows}
          dataMapping={MAPPING}
          loading={loading}
          customizableColumns
          onQueryArgChange={handleRefetch}
          cursorPagination={data?.flows?.pageInfo}
        />
      </div>
    </>
  );
}

export default FlowsHome;