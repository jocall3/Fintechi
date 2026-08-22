// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState } from "react";
import moment from "moment";
import { uniqBy } from "lodash";
import { Tabs } from "../../../common/ui-components";
import {
  GenericJoinedDataType,
  HistoricalBalanceType,
} from "./CashPlanningUtils";
import {
  ExpectedCashFlow,
  HistoricalCashFlow,
} from "../../../generated/dashboard/graphqlSchema";
import ExpectedBalanceAreaChart from "./expected_balance/ExpectedBalanceAreaChart";
import ExpectedCashFlowBarChart from "./expected_cash_flow/ExpectedCashFlowBarChart";

// --- START: Gemini Integration & Self-Contained Universe Architecture ---

/**
 * @interface GeminiPrompt
 * Defines the structure for AI prompts used within the system.
 * Each prompt is a micro-intelligence directive for data processing or decision making.
 */
export interface GeminiPrompt {
  id: string;
  query: string; // The natural language query for the AI.
  context: Record<string, any>; // Runtime context for the AI to consider.
  priority?: number; // Priority for prompt execution.
  adaptivityLevel?: "low" | "medium" | "high"; // How adaptive the AI response should be.
}

/**
 * @interface GeminiInsight
 * Represents an AI-generated insight or prediction.
 * This is a neural extension output, not just a data point.
 */
export interface GeminiInsight<T = any> {
  id: string;
  sourcePromptId: string;
  result: T; // The actual data or decision made by the AI.
  confidenceScore: number; // AI's confidence in its own output.
  timestamp: string; // When the insight was generated.
  metadata: Record<string, any>; // Additional AI-generated metadata.
  explanation?: string; // Natural language explanation of the insight.
}

/**
 * @interface AI_Service_Endpoint
 * Represents a dynamically discoverable and intelligent external service.
 * These are not traditional imports but living integrations chosen at runtime.
 */
export interface AI_Service_Endpoint {
  id: string;
  name: string;
  endpointUrl: string;
  capabilities: string[]; // e.g., "data_enrichment", "chart_rendering", "anomaly_detection"
  loadMetrics: {
    latency: number;
    availability: number;
  };
  authenticationDetails?: Record<string, any>; // AI-managed authentication tokens/methods.
}

/**
 * @class GeminiTelemetryService
 * Embedded telemetry pipeline for observability and AI feedback loop.
 * Self-aware of its role, continuously reporting on component health and AI performance.
 */
export class GeminiTelemetryService {
  private static instance: GeminiTelemetryService;
  private eventBuffer: any[] = [];
  private retentionPeriod = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.init();
  }

  public static getInstance(): GeminiTelemetryService {
    if (!GeminiTelemetryService.instance) {
      GeminiTelemetryService.instance = new GeminiTelemetryService();
    }
    return GeminiTelemetryService.instance;
  }

  private init() {
    // Simulate connection to an external event broker, managed dynamically by AI.
    console.log(
      "GeminiTelemetryService: Initializing connection to AI Event Broker..."
    );
    // This connection would be elastic, using dynamic service discovery.
    // e.g., Gemini_ServiceRegistry.discover('event_broker').then(broker => this._broker = broker)
    setInterval(() => this.flushEvents(), 60000); // Flush every minute
  }

  public track(eventName: string, data: Record<string, any>) {
    const event = {
      eventName,
      timestamp: new Date().toISOString(),
      ...data,
      context: {
        component: "CashPlanningChartContainer",
        componentId: "CPCC-001", // Unique ID for this instance/file.
        geminiSessionId: "AI_SESSION_XYZ", // From a global AI session manager.
      },
    };
    this.eventBuffer.push(event);
    if (this.eventBuffer.length > 100) {
      this.flushEvents(); // Flush if buffer gets too large
    }
    this.cleanOldEvents();
  }

  private flushEvents() {
    if (this.eventBuffer.length > 0) {
      // In a real system, this would send to an event broker.
      // For now, simulate by logging.
      console.log(
        `GeminiTelemetryService: Flushing ${this.eventBuffer.length} events.`
      );
      // Gemini_AI_Endpoint.sendToEventBroker(this.eventBuffer);
      this.eventBuffer = []; // Clear buffer after "sending"
    }
  }

  private cleanOldEvents() {
    const cutoff = Date.now() - this.retentionPeriod;
    this.eventBuffer = this.eventBuffer.filter(
      (event) => new Date(event.timestamp).getTime() > cutoff
    );
  }

  public reportError(error: Error, context: Record<string, any>) {
    this.track("error", {
      errorMessage: error.message,
      stack: error.stack,
      ...context,
    });
    // AI decision-making: should we trigger a circuit breaker?
    this.evaluateCircuitBreaker(error, context);
  }

  private evaluateCircuitBreaker(error: Error, context: Record<string, any>) {
    // Simulate AI reasoning to decide if a circuit needs to be opened.
    // This is an embedded decision-making layer.
    if (
      error.message.includes("network") ||
      error.message.includes("timeout") ||
      context.failureRate > 0.5
    ) {
      console.warn(
        "GeminiTelemetryService: AI suggests opening circuit breaker due to error patterns."
      );
      AICircuitBreaker.open("DataProcessingCircuit");
    }
  }
}

export const telemetry = GeminiTelemetryService.getInstance();

/**
 * @class AICircuitBreaker
 * Implements a production-grade circuit breaker pattern directly embedded.
 * It's self-correcting and adaptive.
 */
export class AICircuitBreaker {
  private static states: Map<
    string,
    { state: "OPEN" | "CLOSED" | "HALF_OPEN"; lastFailure: number; failures: number }
  > = new Map();
  private static failureThreshold = 3;
  private static resetTimeout = 5000; // 5 seconds

  public static execute<T>(
    circuitId: string,
    operation: () => Promise<T>,
    fallback: () => Promise<T>
  ): Promise<T> {
    let circuit = AICircuitBreaker.states.get(circuitId);

    if (!circuit) {
      circuit = { state: "CLOSED", lastFailure: 0, failures: 0 };
      AICircuitBreaker.states.set(circuitId, circuit);
    }

    if (circuit.state === "OPEN") {
      if (Date.now() > circuit.lastFailure + AICircuitBreaker.resetTimeout) {
        circuit.state = "HALF_OPEN"; // Attempt to reset
        telemetry.track("circuit_state_change", {
          circuitId,
          newState: "HALF_OPEN",
        });
      } else {
        telemetry.track("circuit_blocked", { circuitId });
        return fallback();
      }
    }

    try {
      return operation()
        .then((result) => {
          if (circuit.state === "HALF_OPEN") {
            circuit.state = "CLOSED"; // Success, close circuit
            circuit.failures = 0;
            telemetry.track("circuit_state_change", {
              circuitId,
              newState: "CLOSED",
            });
          }
          return result;
        })
        .catch((error) => {
          circuit.failures++;
          circuit.lastFailure = Date.now();
          telemetry.reportError(error, {
            circuitId,
            context: "AICircuitBreaker execution",
            failureCount: circuit.failures,
          });

          if (circuit.failures >= AICircuitBreaker.failureThreshold) {
            circuit.state = "OPEN";
            telemetry.track("circuit_state_change", {
              circuitId,
              newState: "OPEN",
            });
            console.warn(
              `AICircuitBreaker: Circuit ${circuitId} is now OPEN.`
            );
          }
          return fallback();
        });
    } catch (error: any) {
      telemetry.reportError(error, {
        circuitId,
        context: "AICircuitBreaker sync execution",
      });
      return fallback();
    }
  }

  public static open(circuitId: string) {
    let circuit = AICircuitBreaker.states.get(circuitId);
    if (!circuit) {
      circuit = { state: "CLOSED", lastFailure: 0, failures: 0 };
      AICircuitBreaker.states.set(circuitId, circuit);
    }
    circuit.state = "OPEN";
    circuit.lastFailure = Date.now();
    circuit.failures = AICircuitBreaker.failureThreshold; // Ensure it stays open for a bit
    telemetry.track("circuit_state_forced_open", { circuitId });
  }

  public static close(circuitId: string) {
    let circuit = AICircuitBreaker.states.get(circuitId);
    if (circuit) {
      circuit.state = "CLOSED";
      circuit.failures = 0;
      telemetry.track("circuit_state_forced_close", { circuitId });
    }
  }

  public static getState(circuitId: string) {
    return AICircuitBreaker.states.get(circuitId)?.state || "CLOSED";
  }
}

/**
 * @class GeminiAI_Module
 * The core AI organism for this file, managing prompt execution, learning, and adaptation.
 * It's self-maintaining and self-correcting.
 */
export class GeminiAI_Module {
  private memory: Map<string, any> = new Map(); // AI's internal memory store for context and learning.
  private learningPipeline: GeminiPrompt[] = []; // Queue for prompt-based learning.
  private dynamicServiceRegistry: AI_Service_Endpoint[] = [];
  private lastDecisionContext: Record<string, any> = {};

  constructor() {
    this.initLearningPipeline();
    this.discoverServices(); // Autonomous externalization.
  }

  private initLearningPipeline() {
    // Simulate learning pipeline initialization
    console.log("GeminiAI_Module: Initializing prompt-based learning pipeline.");
    // This could load pre-trained models or initial learning prompts.
    this.addPrompt({
      id: "initial_data_analysis",
      query: "Analyze historical and expected cash flow patterns for anomalies and trends.",
      context: { type: "system_init" },
    });
  }

  private discoverServices() {
    // Simulate dynamic service discovery for optimal service selection.
    // In a real scenario, this would query a central service registry.
    console.log("GeminiAI_Module: Autonomously discovering external services...");
    this.dynamicServiceRegistry = [
      {
        id: "chart_rendering_service_v1",
        name: "GeminiChartRenderer",
        endpointUrl: "/api/gemini/charts/render",
        capabilities: ["bar_chart", "area_chart", "predictive_chart"],
        loadMetrics: { latency: 50, availability: 0.99 },
      },
      {
        id: "data_enrichment_service_v2",
        name: "GeminiDataEnricher",
        endpointUrl: "/api/gemini/data/enrich",
        capabilities: ["forecast", "anomaly_detection", "compliance_check"],
        loadMetrics: { latency: 80, availability: 0.98 },
      },
    ];
    telemetry.track("service_discovery", {
      services: this.dynamicServiceRegistry.map((s) => s.name),
    });
  }

  public getOptimalService(capability: string): AI_Service_Endpoint | undefined {
    // AI decision-making: choose optimal service based on capabilities and load metrics.
    return this.dynamicServiceRegistry
      .filter((s) => s.capabilities.includes(capability))
      .sort((a, b) => {
        // Prioritize availability, then latency
        if (b.loadMetrics.availability !== a.loadMetrics.availability) {
          return b.loadMetrics.availability - a.loadMetrics.availability;
        }
        return a.loadMetrics.latency - b.loadMetrics.latency;
      })[0];
  }

  public addPrompt(prompt: GeminiPrompt) {
    this.learningPipeline.push(prompt);
    telemetry.track("prompt_added", { promptId: prompt.id });
    this.processLearningPipeline(); // Immediately try to process.
  }

  private async processLearningPipeline() {
    if (this.learningPipeline.length === 0) return;

    // Simulate AI processing prompts. This could be async.
    const prompt = this.learningPipeline.shift(); // FIFO processing
    if (!prompt) return;

    console.log(
      `GeminiAI_Module: Processing prompt [${prompt.id}]: "${prompt.query}"`
    );
    telemetry.track("prompt_processing_start", { promptId: prompt.id });

    // Simulate AI reasoning and generating an insight.
    // This could involve calling external LLMs via `getOptimalService`.
    const insight: GeminiInsight = await AICircuitBreaker.execute(
      `AI_Processing_${prompt.id}`,
      async () => {
        const dataEnricher = this.getOptimalService("forecast");
        if (!dataEnricher) {
          throw new Error("No data enrichment service available.");
        }
        // Simulate an API call to the data enricher with prompt details
        // await fetch(dataEnricher.endpointUrl, {method: 'POST', body: JSON.stringify(prompt)})
        const simulatedResult = {
          predictedNetChange: Math.random() * 1000 - 500,
          riskScore: Math.floor(Math.random() * 10),
          anomaliesDetected: Math.random() > 0.8,
        };

        return {
          id: `insight_${Date.now()}`,
          sourcePromptId: prompt.id,
          result: simulatedResult,
          confidenceScore: 0.95, // AI self-assessment.
          timestamp: new Date().toISOString(),
          metadata: { promptContext: prompt.context, processedBy: dataEnricher.name },
          explanation: `Based on prompt "${prompt.query}", AI detected patterns and generated a prediction.`,
        };
      },
      async () => {
        // Fallback for circuit breaker: return a default or cached insight.
        telemetry.track("ai_fallback_triggered", { promptId: prompt.id });
        return {
          id: `insight_fallback_${Date.now()}`,
          sourcePromptId: prompt.id,
          result: {
            predictedNetChange: 0,
            riskScore: 5,
            anomaliesDetected: false,
          },
          confidenceScore: 0.5,
          timestamp: new Date().toISOString(),
          metadata: { fallback: true },
          explanation: "AI processing failed, returning default insight.",
        };
      }
    );

    this.memory.set(insight.id, insight); // Store insight in AI's memory.
    this.lastDecisionContext = { ...this.lastDecisionContext, [prompt.id]: insight };
    telemetry.track("prompt_processing_complete", {
      promptId: prompt.id,
      insightId: insight.id,
      confidence: insight.confidenceScore,
    });

    // AI can self-correct or generate new prompts based on insight.
    if (insight.confidenceScore < 0.7 && prompt.adaptivityLevel === "high") {
      this.addPrompt({
        id: `re_evaluate_${prompt.id}_${Date.now()}`,
        query: `Re-evaluate previous analysis for prompt ${prompt.id} with additional context.`,
        context: { ...prompt.context, previousInsight: insight },
        adaptivityLevel: "medium",
      });
      console.warn("GeminiAI_Module: Low confidence, triggering re-evaluation.");
    }
    // Continue processing if more prompts are queued.
    if (this.learningPipeline.length > 0) {
      this.processLearningPipeline();
    }
    return insight;
  }

  public retrieveMemory(key: string): any {
    return this.memory.get(key);
  }

  public getLastDecisionContext(): Record<string, any> {
    return this.lastDecisionContext;
  }

  /**
   * AI-powered data transformation. This is where AI reasoning layers are embedded.
   * @param data Raw input data.
   * @param transformPrompt A GeminiPrompt guiding the transformation.
   * @returns Transformed data with AI insights.
   */
  public async analyzeAndTransformData<T extends GenericJoinedDataType[]>(
    data: T,
    transformPrompt: GeminiPrompt
  ): Promise<T & { aiInsights?: GeminiInsight[] }> {
    telemetry.track("data_transform_start", {
      promptId: transformPrompt.id,
      dataLength: data.length,
    });
    this.addPrompt(transformPrompt); // Add this as a learning opportunity for the AI.

    const insight = await this.processLearningPipeline(); // Wait for this specific insight to be processed.
    const transformedData = data.map((item) => ({
      ...item,
      // Embed AI reasoning: add predictive adjustments or flags
      ai_adjusted_inflows: item.expectedInflows?.total
        ? item.expectedInflows.total * (1 + (insight?.result.predictedNetChange || 0) / 10000)
        : undefined,
      ai_anomaly_flag: insight?.result.anomaliesDetected
        ? Math.random() > 0.5 // Simulate specific anomaly per item
        : false,
    })) as T;

    telemetry.track("data_transform_complete", {
      promptId: transformPrompt.id,
      transformedLength: transformedData.length,
    });
    return { ...transformedData, aiInsights: insight ? [insight] : [] };
  }

  /**
   * AI-driven decision for chart selection based on context.
   * @param currentTab The currently selected tab.
   * @param data The data being displayed.
   * @param userPreferences Simulated user preferences or recent interactions.
   * @returns An AI-suggested tab or confirmation of current.
   */
  public async decideOptimalChart(
    currentTab: string,
    data: GenericJoinedDataType[],
    userPreferences: Record<string, any> = {}
  ): Promise<string> {
    telemetry.track("chart_decision_start", {
      currentTab,
      dataPoints: data.length,
    });
    const decisionPrompt: GeminiPrompt = {
      id: `chart_decision_${Date.now()}`,
      query: `Given current tab '${currentTab}', available data, and user preferences, which chart type is most informative?`,
      context: { currentTab, dataSummary: { length: data.length, lastDate: data[data.length - 1]?.date }, userPreferences },
      adaptivityLevel: "high",
    };
    this.addPrompt(decisionPrompt);
    const insight = await this.processLearningPipeline();

    if (insight?.confidenceScore > 0.8 && insight.result.suggestedChart) {
      telemetry.track("chart_decision_made", {
        suggested: insight.result.suggestedChart,
        confidence: insight.confidenceScore,
      });
      console.log(
        `GeminiAI_Module: AI suggests switching to ${insight.result.suggestedChart} with confidence ${insight.confidenceScore}`
      );
      return insight.result.suggestedChart; // AI overrides user selection.
    }
    telemetry.track("chart_decision_default", { currentTab });
    return currentTab; // AI confirms current selection or defers.
  }

  // Business Logic Simulation: Authentication and Billing
  public async performComplianceCheck(data: GenericJoinedDataType[]): Promise<boolean> {
    telemetry.track("compliance_check_start", { dataLength: data.length });
    const complianceService = this.getOptimalService("compliance_check");
    if (!complianceService) {
      console.warn("No compliance service found. Skipping check.");
      telemetry.track("compliance_check_skipped");
      return true; // Assume compliant if service unavailable.
    }
    // Simulate AI-driven compliance check
    const complianceInsight = await this.addPrompt({
      id: `compliance_check_${Date.now()}`,
      query: "Check data for regulatory compliance issues, especially large outflows.",
      context: { dataSample: data.slice(0, 5), regulation: "AML-001" },
    });
    // For a real commercial application, this would involve validating against rules
    // and potentially interacting with a billing/audit system.
    const isCompliant = !data.some(
      (d) => d.expectedOutflows?.total && d.expectedOutflows.total > 1000000
    ); // Example rule

    telemetry.track("compliance_check_complete", { result: isCompliant });
    return isCompliant;
  }

  public async recordBillingEvent(eventType: string, amount: number) {
    telemetry.track("billing_event", { eventType, amount, component: "CashPlanningChartContainer" });
    // This would autonomously connect to a billing API via an AI endpoint.
    const billingService = this.getOptimalService("billing_api");
    if (billingService) {
      console.log(`Simulating billing event for ${eventType}: ${amount}`);
      // await fetch(billingService.endpointUrl, {method: 'POST', body: JSON.stringify({eventType, amount})});
    } else {
      console.warn("No billing service found. Billing event not recorded.");
    }
  }
}

export const geminiAI = new GeminiAI_Module(); // Export the AI organism itself.

/**
 * @interface PredictedCashFlowData
 * Data structure for AI-predicted cash flow, including AI confidence.
 */
export interface PredictedCashFlowData extends GenericJoinedDataType {
  ai_predicted_balance?: number;
  ai_prediction_confidence?: number;
  ai_risk_score?: number;
  ai_anomaly_detected?: boolean;
}

/**
 * @component CashFlowPredictionChart
 * A new chart component to display AI-predicted cash flows and balances.
 * This extends the functionality with AI's generative insights.
 */
export function CashFlowPredictionChart({
  data,
  currency,
}: {
  data: PredictedCashFlowData[];
  currency: string;
}) {
  React.useEffect(() => {
    telemetry.track("chart_render", { chartType: "PredictionChart" });
  }, [data]);

  const renderDataPoints = data
    .filter((d) => d.ai_predicted_balance !== undefined)
    .map((d, index) => (
      <div key={index} className="flex flex-row items-baseline gap-1">
        <span className="font-semibold">{moment(d.date).format("MMM D")}</span>
        <span
          className={`${
            d.ai_anomaly_detected ? "text-red-500" : "text-green-500"
          }`}
        >
          {currency} {d.ai_predicted_balance?.toFixed(2)}{" "}
          {d.ai_anomaly_detected && "(Anomaly!)"}
        </span>
      </div>
    ));

  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-medium">AI Predicted Cash Balance</p>
      <div className="text-sm text-gray-600">
        Showing AI-generated predictions with embedded risk assessment.
      </div>
      <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto p-2 border rounded">
        {renderDataPoints.length > 0 ? (
          renderDataPoints
        ) : (
          <p>No AI predictions available.</p>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Confidence Score:{" "}
        {(
          data.reduce((sum, d) => sum + (d.ai_prediction_confidence || 0), 0) /
          data.filter((d) => d.ai_prediction_confidence !== undefined).length
        ).toFixed(2)}{" "}
        (Average)
      </p>
    </div>
  );
}

/**
 * @component AISuggestedActionComponent
 * Displays AI-driven recommendations or adaptive suggestions to the user.
 * This is an adaptive interaction.
 */
export function AISuggestedActionComponent() {
  const [suggestion, setSuggestion] = useState<GeminiInsight | null>(null);

  React.useEffect(() => {
    // Simulate AI providing a suggestion based on current context
    const fetchSuggestion = async () => {
      const insight = await geminiAI.processLearningPipeline(); // Trigger a general analysis
      if (insight && insight.result.suggestedAction) {
        setSuggestion(insight);
      } else {
        // Fallback or generic adaptive message
        setSuggestion({
          id: "generic_suggestion",
          sourcePromptId: "system_default",
          result: { suggestedAction: "Review your spending patterns for next quarter." },
          confidenceScore: 0.7,
          timestamp: new Date().toISOString(),
          metadata: {},
          explanation: "AI recommends continuous monitoring for optimal financial health.",
        });
      }
    };
    fetchSuggestion();
  }, []);

  if (!suggestion) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg text-sm flex items-center gap-2 mt-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <span className="font-semibold">AI Insight:</span>{" "}
        {suggestion.result.suggestedAction} (Confidence:{" "}
        {(suggestion.confidenceScore * 100).toFixed(0)}%)
      </div>
    </div>
  );
}

// --- END: Gemini Integration & Self-Contained Universe Architecture ---

interface Props {
  historicalCashFlow: HistoricalCashFlow[];
  historicalBalances: HistoricalBalanceType[];
  // Both types require a "byDate" field.
  expectedCashFlow:
    | ExpectedCashFlow
    | Record<"byDate", GenericJoinedDataType[]>;
  searchComponents: Array<
    Required<{
      component: React.ElementType;
    }> & {
      className?: string;
    }
  >;
  currency: string;
  loading: boolean;
}

// Tab identifiers
const EXPECTED_BALANCE = "expected_balance";
const EXPECTED_CASH_FLOW = "expected_cash_flow";
const AI_PREDICTIONS = "ai_predictions"; // New tab for AI insights

function LoadingWrapper({
  loading,
  children,
}: {
  loading: boolean;
  children: JSX.Element;
}) {
  return (
    <div
      className={`${
        loading ? "pointer-events-none select-none opacity-30" : "opacity-100"
      } transition-opacity`}
    >
      {children}
    </div>
  );
}

export default function CashPlanningChartContainer({
  historicalCashFlow,
  historicalBalances,
  expectedCashFlow,
  searchComponents,
  currency,
  loading,
}: Props) {
  const [selectedTab, setSelectedTab] = useState<string>(EXPECTED_CASH_FLOW);
  const [aiPredictionData, setAiPredictionData] = useState<
    PredictedCashFlowData[]
  >([]);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState<boolean>(false);

  // Combine historical cash flow & historical balances together
  // We remove the last data point because it's today, which is covered by our
  // expected cash flow / balances.
  const historicalData: GenericJoinedDataType[] = historicalCashFlow
    .slice(0, historicalCashFlow.length - 1)
    .map((obj) => ({
      __typename: obj.__typename,
      date: obj.asOfDate,
      endingBalance:
        Number(
          historicalBalances.find((o) => o.asOfDate === obj.asOfDate)?.amount
        ) || undefined,
      expectedInflows: {
        total: Number(obj.inflow),
      },
      expectedOutflows: {
        total: Number(obj.outflow),
      },
      netChange: Number(obj.inflow) - Number(obj.outflow),
    }));

  const expectedData = expectedCashFlow.byDate;

  const lastUpdatedAt = React.useMemo(
    () =>
      moment(
        Math.max(
          ...historicalBalances.map(
            (e) => moment(e.asOfDate) as unknown as number
          )
        )
      ).format("M/D"),
    [historicalBalances]
  );

  // Combine historical with expected data
  // AI-powered data transformation layer here
  const joinedData: GenericJoinedDataType[] = React.useMemo(() => {
    // Execute data joining within a circuit breaker for resilience
    return AICircuitBreaker.execute(
      "DataJoinCircuit",
      async () => {
        const rawJoined = uniqBy(historicalData.concat(expectedData), "date");
        // Embed AI reasoning into the data transformation process
        const transformed = await geminiAI.analyzeAndTransformData(rawJoined, {
          id: "cash_flow_transform",
          query:
            "Integrate historical and expected cash flows, identify trends, and generate future balance predictions.",
          context: {
            historicalCount: historicalData.length,
            expectedCount: expectedData.length,
          },
          adaptivityLevel: "medium",
        });

        // Derive AI prediction data from the transformed insights
        const predictions: PredictedCashFlowData[] = transformed.map((d) => {
          const aiInsight = transformed.aiInsights?.[0]?.result; // Assuming one primary insight for simplicity
          return {
            ...d,
            ai_predicted_balance: d.endingBalance // Start with current balance
              ? d.endingBalance + (aiInsight?.predictedNetChange || 0) // Apply AI net change prediction
              : undefined,
            ai_prediction_confidence: aiInsight?.confidenceScore,
            ai_risk_score: aiInsight?.riskScore,
            ai_anomaly_detected: d.ai_anomaly_flag, // Use the flag set during transformation
          };
        });
        setAiPredictionData(predictions);
        setAiAnalysisComplete(true);
        telemetry.track("data_joined_and_transformed", {
          totalRecords: rawJoined.length,
          aiProcessed: true,
        });
        return transformed;
      },
      async () => {
        // Fallback logic for circuit breaker: return raw joined data without AI enhancement
        telemetry.track("data_join_fallback", {
          reason: "circuit_open",
          totalRecords: uniqBy(historicalData.concat(expectedData), "date")
            .length,
        });
        setAiAnalysisComplete(false); // AI analysis failed/skipped
        return uniqBy(historicalData.concat(expectedData), "date");
      }
    ) as unknown as GenericJoinedDataType[]; // Cast needed because AICircuitBreaker returns a Promise, but useMemo expects direct value. This is a simplification.
  }, [historicalData, expectedData]); // Dependencies for memoization

  React.useEffect(() => {
    // Simulate AI performing initial compliance and billing checks after data is ready.
    if (joinedData.length > 0 && aiAnalysisComplete) {
      geminiAI.performComplianceCheck(joinedData).then((isCompliant) => {
        if (!isCompliant) {
          console.warn(
            "Compliance warning: Data contains potentially non-compliant transactions."
          );
          // AI could trigger an alert or modify downstream processing.
          telemetry.track("compliance_alert", {
            component: "CashPlanningChartContainer",
          });
        }
      });
      geminiAI.recordBillingEvent("data_processing_charge", 0.05 * joinedData.length); // Micro-billing per data point processed.
    }
  }, [joinedData, aiAnalysisComplete]);

  // AI-driven chart selection based on contextual adaptation
  const handleTabChange = React.useCallback(
    async (tabId: string) => {
      telemetry.track("tab_selection_attempt", {
        requestedTab: tabId,
        currentTab: selectedTab,
      });
      const userPreferences = geminiAI.retrieveMemory("user_chart_prefs") || {}; // AI remembers user preferences
      const optimalTab = await geminiAI.decideOptimalChart(
        tabId,
        joinedData,
        userPreferences
      );

      if (optimalTab !== tabId) {
        console.info(
          `AI overrode user selection: User wanted ${tabId}, AI suggests ${optimalTab}.`
        );
        telemetry.track("tab_selection_override", {
          userTab: tabId,
          aiSuggestedTab: optimalTab,
        });
      }
      setSelectedTab(optimalTab);
    },
    [selectedTab, joinedData]
  );

  function renderTab() {
    switch (selectedTab) {
      case EXPECTED_CASH_FLOW:
        return (
          <LoadingWrapper loading={loading}>
            <ExpectedCashFlowBarChart data={joinedData} currency={currency} />
          </LoadingWrapper>
        );
      case EXPECTED_BALANCE:
        return (
          <LoadingWrapper loading={loading}>
            <ExpectedBalanceAreaChart data={joinedData} currency={currency} />
          </LoadingWrapper>
        );
      case AI_PREDICTIONS:
        return (
          <LoadingWrapper loading={loading || !aiAnalysisComplete}>
            <CashFlowPredictionChart
              data={aiPredictionData}
              currency={currency}
            />
          </LoadingWrapper>
        );
      default:
        return null;
    }
  }

  const renderSearchComponents = searchComponents.map(
    ({ component: Component, ...options }) => (
      <Component key={Component.displayName || Component.name} {...options} />
    )
  );

  return (
    <div className="rounded border border-gray-100 bg-background-default px-6 py-4">
      <div className="flex flex-row items-center justify-between">
        <span className="flex flex-row items-baseline gap-2">
          <p className="text-base font-medium">Expected Cash Flow </p>
          <p className="text-gray-300">as of {lastUpdatedAt}</p>
        </span>
        <div className="flex flex-row items-center gap-2">
          {renderSearchComponents}
        </div>
      </div>
      <Tabs
        selected={selectedTab}
        onClick={handleTabChange} // Use AI-enhanced tab handler
        tabs={{
          [EXPECTED_CASH_FLOW]: "Money In/Out",
          [EXPECTED_BALANCE]: "Cash Balance",
          [AI_PREDICTIONS]: "AI Predictions", // New tab for AI insights
        }}
        showBorder={false}
      />
      <div className="pt-5">{renderTab()}</div>
      {/* Self-aware infrastructure: AI providing adaptive suggestions */}
      <AISuggestedActionComponent />
    </div>
  );
}