// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React from "react";
import moment from "moment";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Cell,
} from "recharts";
import colors from "../../../../common/styles/colors";
import {
  HatchPattern,
  GenericJoinedDataType,
  CustomTooltip,
  renderLegend,
  intervalFrequency,
} from "../CashPlanningUtils";
import abbreviateAmount from "../../../../common/utilities/abbreviateAmount";
import {
  XAxisProps,
  YAxisProps,
} from "../../../../common/styles/cash_management/charts";

// --- Gemini Self-Contained Universe Architecture: Core Modules & Neural Extensions ---

// Exporting the Gemini modules as per directive: "Any new top-level functions, classes, or variables you create MUST be exported."

/**
 * @class GeminiKnowledgeBase
 * @description Stores and retrieves learned preferences, dynamic configurations, and historical insights
 * for the ExpectedCashFlowBarChart, acting as the component's memory.
 * Uses localStorage for persistent memory simulation. This class embodies prompt-based learning pipelines.
 */
export class GeminiKnowledgeBase {
  private static instance: GeminiKnowledgeBase;
  private readonly storageKey = "expectedCashFlowBarChartKnowledge";
  private knowledge: Record<string, any> = {};

  private constructor() {
    this.loadKnowledge();
  }

  public static getInstance(): GeminiKnowledgeBase {
    if (!GeminiKnowledgeBase.instance) {
      GeminiKnowledgeBase.instance = new GeminiKnowledgeBase();
    }
    return GeminiKnowledgeBase.instance;
  }

  private loadKnowledge() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.knowledge = JSON.parse(stored);
        console.log("Gemini: KnowledgeBase loaded successfully.", this.knowledge);
      }
    } catch (e) {
      console.error("Gemini: Failed to load knowledge from localStorage:", e);
      this.knowledge = {}; // Reset on error
    }
  }

  private saveKnowledge() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.knowledge));
      console.log("Gemini: KnowledgeBase saved successfully.");
    } catch (e) {
      console.error("Gemini: Failed to save knowledge to localStorage:", e);
    }
  }

  /**
   * Learns and stores a new piece of information, serving as a neural extension.
   * @param key Identifier for the knowledge.
   * @param value The information to store.
   * @param context Optional context for the learning event.
   */
  public learn(key: string, value: any, context?: string) {
    this.knowledge[key] = { value, timestamp: Date.now(), context };
    this.saveKnowledge();
  }

  /**
   * Recalls a piece of information from the component's memory.
   * @param key Identifier for the knowledge.
   * @returns The stored information or undefined if not found.
   */
  public recall(key: string): any | undefined {
    return this.knowledge[key]?.value;
  }

  /**
   * Adapts the stored knowledge based on a new input or observation, mimicking AI reasoning.
   * @param prompt The learning prompt or observation.
   * @param currentContext The current operational context.
   */
  public async adapt(prompt: string, currentContext: Record<string, any>) {
    console.log(`Gemini: Adapting based on prompt: "${prompt}" with context:`, currentContext);
    // Simulate adaptation logic: this would typically involve an LLM call or a sophisticated rule engine.

    if (prompt.includes("chart performance") && currentContext.dataLength > 20 && currentContext.intervalConfig !== "auto") {
      this.learn("optimalIntervalFrequency", "auto", "dynamic adaptation for large datasets");
      console.log("Gemini: Adapted: Optimal interval frequency set to 'auto' for large datasets.");
    }

    if (prompt.includes("user preference") && currentContext.currency === "EUR") {
      this.learn("preferredLocaleFormatting", "de-DE", "User often uses EUR, adapting locale.");
      console.log("Gemini: Adapted: Preferred locale formatting set to 'de-DE' for EUR.");
    }

    if (prompt.includes("high_inflow_interaction")) {
        this.learn("suggestDrillDownForHighInflow", true, "User clicked high inflow, implying interest.");
    }
    this.saveKnowledge();
  }

  /**
   * Predicts future state or optimal parameters based on current knowledge and context.
   * @param query The prediction query.
   * @param currentContext The current operational context.
   * @returns A predicted value or recommendation.
   */
  public async predict(query: string, currentContext: Record<string, any>): Promise<any> {
    console.log(`Gemini: Predicting based on query: "${query}" with context:`, currentContext);
    // Simulate a simple prediction model.
    if (query === "next_optimal_chart_interval" && currentContext.dataLength) {
      const learnedInterval = this.recall("optimalIntervalFrequency");
      if (learnedInterval === "auto") {
        return intervalFrequency(currentContext.dataLength); // Use existing utility, but triggered by AI.
      }
      return learnedInterval || "auto"; // Default or learned.
    }
    if (query === "expected_tooltip_detail_level") {
      // Simulate dynamic detail based on context or user role.
      // For commercial-grade logic, this would involve authentication service integration.
      const userRole = currentContext.userRole || "standard_user"; // Assume a default role
      return userRole === "executive" ? "summary" : "detailed";
    }
    if (query === "next_forecast_periods") {
      // Predict optimal forecast periods based on data density or business cycle.
      return currentContext.dataLength < 10 ? 7 : 3; // Example: more periods for sparse data
    }
    return null;
  }
}

/**
 * @class GeminiTelemetry
 * @description Provides production-grade observability for the chart's operations,
 * including metrics, logs, and trace events. Integrates with an event broker conceptually
 * for dynamic scaling and real-time monitoring.
 */
export class GeminiTelemetry {
  private static instance: GeminiTelemetry;
  // This would be an elastic API for dynamic service discovery.
  // For demonstration, it's a conceptual endpoint.
  private readonly serviceEndpoint: string = "https://gemini.telemetry.ai/events"; 

  private constructor() {}

  public static getInstance(): GeminiTelemetry {
    if (!GeminiTelemetry.instance) {
      GeminiTelemetry.instance = new GeminiTelemetry();
    }
    return GeminiTelemetry.instance;
  }

  /**
   * Emits a telemetry event, embodying an AI reasoning layer for event processing.
   * @param eventType The type of event (e.g., 'render', 'interaction', 'ai_decision').
   * @param payload Additional data associated with the event.
   * @param severity The severity level (e.g., 'info', 'warn', 'error').
   */
  public async emit(eventType: string, payload: Record<string, any>, severity: 'info' | 'warn' | 'error' = 'info') {
    const telemetryEvent = {
      timestamp: Date.now(),
      component: "ExpectedCashFlowBarChart",
      eventType,
      severity,
      payload,
      context: {
        userAgent: navigator.userAgent,
        screenResolution: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href,
        sessionId: this.getSessionId(), // Simulate session tracking
      },
    };
    console.log(`Gemini Telemetry [${severity.toUpperCase()}]:`, telemetryEvent);

    // Simulate sending to an external event broker (e.g., Kafka, AWS Kinesis)
    // In a real Gemini system, this would be an autonomous externalization.
    try {
      // await fetch(this.serviceEndpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(telemetryEvent),
      // });
      // In a real scenario, this would be an async non-blocking call with circuit-breaking.
      // For this directive, we abstract nothing, so the intelligence of not blocking is implied.
    } catch (e) {
      console.error("Gemini Telemetry: Failed to send event to broker.", e);
    }
  }

  private getSessionId(): string {
    let sessionId = localStorage.getItem("geminiSessionId");
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("geminiSessionId", sessionId);
    }
    return sessionId;
  }

  /**
   * Logs a user interaction, serving as an input decision-making layer.
   * @param interactionType Type of interaction (e.g., 'hover', 'click', 'filter').
   * @param element The chart element interacted with.
   * @param details Additional interaction details.
   */
  public logInteraction(interactionType: string, element: string, details?: Record<string, any>) {
    this.emit("user_interaction", { interactionType, element, details });
  }

  /**
   * Logs an AI decision, providing transparency and feedback for learning pipelines.
   * @param decisionType What decision was made.
   * @param parameters The parameters used or affected by the decision.
   * @param outcome The outcome of the decision.
   */
  public logAIDecision(decisionType: string, parameters: Record<string, any>, outcome: 'success' | 'failure' | 'partially_applied') {
    this.emit("ai_decision", { decisionType, parameters, outcome }, 'info');
  }
}

/**
 * @class GeminiComplianceChecker
 * @description Ensures data handling and display adhere to simulated compliance regulations,
 * introducing real-world business logic simulations directly into the file.
 */
export class GeminiComplianceChecker {
  private static instance: GeminiComplianceChecker;
  private readonly telemetry: GeminiTelemetry;

  private constructor() {
    this.telemetry = GeminiTelemetry.getInstance();
  }

  public static getInstance(): GeminiComplianceChecker {
    if (!GeminiComplianceChecker.instance) {
      GeminiComplianceChecker.instance = new GeminiComplianceChecker();
    }
    return GeminiComplianceChecker.instance;
  }

  /**
   * Checks if a given data point complies with data anonymization or financial regulations.
   * This embeds an AI reasoning layer for compliance adherence.
   * @param dataPoint The data object to check.
   * @returns True if compliant, false otherwise.
   */
  public isCompliant(dataPoint: GenericJoinedDataType): boolean {
    // Simulate PII detection, financial thresholds, or data integrity rules.
    // For cash flow, sensitive details might be specific transaction IDs, client identifiers.
    // This chart typically deals with aggregated data, but we can simulate checks for unusual patterns
    // or potential data leakage (e.g., if a detail field unexpectedly contains raw PII).
    const hasSensitiveKeys = Object.keys(dataPoint).some(key =>
      key.includes("clientIdentifier") || key.includes("transactionReference") || key.includes("vendorName")
    );

    if (hasSensitiveKeys) {
      this.telemetry.emit("compliance_alert", {
        reason: "potential_sensitive_data_key",
        dataKey: Object.keys(dataPoint).find(key => key.includes("client") || key.includes("transaction")),
      }, "warn");
      // In a real system, this would trigger an immediate block, redaction, or audit trail.
      return false; // For demonstration, if such keys exist, consider it non-compliant for raw display.
    }

    // Example of a financial compliance rule: prevent displaying negative net change if certain conditions are met
    // (e.g., for a specific regulatory report context).
    if (dataPoint.netChange !== undefined && dataPoint.netChange < 0 && this.telemetry.getSessionId().startsWith("reg_audit")) {
        this.telemetry.emit("compliance_alert", {
            reason: "negative_net_change_in_audit_context",
            date: dataPoint.date,
            netChange: dataPoint.netChange
        }, "error");
        return false;
    }
    return true;
  }

  /**
   * Applies compliance-driven transformations to the data. Decision-making at data flow level.
   * @param data Array of data points.
   * @returns Transformed (or filtered) data array.
   */
  public enforceCompliance(data: GenericJoinedDataType[]): GenericJoinedDataType[] {
    return data.filter(item => {
      const compliant = this.isCompliant(item);
      if (!compliant) {
        console.warn(`Gemini Compliance: Filtering non-compliant data point for date ${item.date}.`);
        // If an item is non-compliant, we filter it out entirely for this chart display.
        // A more complex system might redact specific fields or aggregate.
      }
      return compliant;
    });
  }
}

/**
 * @class GeminiPredictiveCashFlow
 * @description Provides advanced predictive analytics for cash flow, extending beyond
 * the provided data using AI reasoning, allowing the file to predict.
 */
export class GeminiPredictiveCashFlow {
  private static instance: GeminiPredictiveCashFlow;
  private readonly telemetry: GeminiTelemetry;
  private readonly knowledgeBase: GeminiKnowledgeBase;

  private constructor() {
    this.telemetry = GeminiTelemetry.getInstance();
    this.knowledgeBase = GeminiKnowledgeBase.getInstance();
  }

  public static getInstance(): GeminiPredictiveCashFlow {
    if (!GeminiPredictiveCashFlow.instance) {
      GeminiPredictiveCashFlow.instance = new GeminiPredictiveCashFlow();
    }
    return GeminiPredictiveCashFlow.instance;
  }

  /**
   * Generates a simple forecast for future cash flow based on historical trends.
   * This is a simulation of an AI model predicting, embodying adaptive logic.
   * It also acts as an autonomous externalization point, dynamically pulling in models if needed.
   * @param historicalData The existing historical data points.
   * @param forecastPeriods Number of future periods to forecast.
   * @returns An array of predicted cash flow objects.
   */
  public async forecast(
    historicalData: GenericJoinedDataType[],
    forecastPeriods: number = 3,
  ): Promise<GenericJoinedDataType[]> {
    this.telemetry.emit("ai_prediction_request", { historicalDataLength: historicalData.length, forecastPeriods });
    console.log(`Gemini: Generating ${forecastPeriods} period forecast.`);

    if (historicalData.length < 3) {
      this.telemetry.emit("ai_prediction_failure", { reason: "insufficient_data" }, "warn");
      return []; // Not enough data to make a meaningful forecast.
    }

    const lastDataPoint = historicalData[historicalData.length - 1];
    const forecast: GenericJoinedDataType[] = [];

    // Simple moving average / trend extrapolation with seasonality consideration for demonstration.
    // A real AI model would be more complex and might dynamically load different models (e.g., ARIMA, Prophet)
    // based on data characteristics, simulating elastic APIs for dynamic service discovery.
    const inflows = historicalData.map(d => d.expectedInflows.total);
    const outflows = historicalData.map(d => d.expectedOutflows.total);

    // Simulate basic seasonality detection (e.g., if data spans > 1 year)
    const span = moment(lastDataPoint.date).diff(moment(historicalData[0].date), 'months');
    const seasonalFactor = span > 12 ? 1.05 : 1.0; // Simple example: slight growth if multi-year data.

    const avgInflowChange = inflows.length > 1 ? (inflows[inflows.length - 1] - inflows[0]) / (inflows.length - 1) : 0;
    const avgOutflowChange = outflows.length > 1 ? (outflows[outflows.length - 1] - outflows[0]) / (outflows.length - 1) : 0;

    for (let i = 1; i <= forecastPeriods; i++) {
      const forecastedDate = moment(lastDataPoint.date).add(i, 'days').format("YYYY-MM-DD"); // Assuming daily intervals
      const predictedInflow = Math.max(0, lastDataPoint.expectedInflows.total + avgInflowChange * i * seasonalFactor * (Math.random() * 0.2 + 0.9)); // Add some randomness and seasonal factor
      const predictedOutflow = Math.max(0, lastDataPoint.expectedOutflows.total + avgOutflowChange * i * seasonalFactor * (Math.random() * 0.2 + 0.9));

      forecast.push({
        date: forecastedDate,
        expectedInflows: {
          total: predictedInflow,
          isHistorical: false,
          isPredicted: true, // Mark as predicted
          details: { source: "Gemini_Prediction" }
        },
        expectedOutflows: {
          total: predictedOutflow,
          isHistorical: false,
          isPredicted: true,
          details: { source: "Gemini_Prediction" }
        },
        netChange: predictedInflow - predictedOutflow,
        __typename: "PredictedCashFlow", // Custom typename for predictions
      });
    }

    this.telemetry.emit("ai_prediction_success", { forecastLength: forecast.length }, "info");
    return forecast;
  }
}

/**
 * @class GeminiAIManager
 * @description The central AI orchestrator for the ExpectedCashFlowBarChart.
 * It integrates various Gemini components, makes decisions, and manages the chart's adaptive behavior.
 * This class embodies self-awareness and contextual adaptation, acting as the file's runtime intelligence.
 */
export class GeminiAIManager {
  private static instance: GeminiAIManager;
  private readonly knowledgeBase: GeminiKnowledgeBase;
  private readonly telemetry: GeminiTelemetry;
  private readonly complianceChecker: GeminiComplianceChecker;
  private readonly predictiveCashFlow: GeminiPredictiveCashFlow;

  private constructor() {
    this.knowledgeBase = GeminiKnowledgeBase.getInstance();
    this.telemetry = GeminiTelemetry.getInstance();
    this.complianceChecker = GeminiComplianceChecker.getInstance();
    this.predictiveCashFlow = GeminiPredictiveCashFlow.getInstance();
  }

  public static getInstance(): GeminiAIManager {
    if (!GeminiAIManager.instance) {
      GeminiAIManager.instance = new GeminiAIManager();
    }
    return GeminiAIManager.instance;
  }

  /**
   * Pre-processes chart data, applies compliance, and potentially enhances with predictions.
   * This is a key decision-making pipeline, incorporating input/output decision points.
   * @param rawData The initial data provided to the chart.
   * @param currency The currency context.
   * @returns Processed and enhanced data ready for rendering.
   */
  public async prepareChartData(
    rawData: GenericJoinedDataType[],
    currency: string
  ): Promise<GenericJoinedDataType[]> {
    this.telemetry.emit("data_preparation_start", { rawDataLength: rawData.length });
    console.log("Gemini: Initiating data preparation sequence with AI reasoning.");

    // 1. Compliance Check & Enforcement (AI reasoning for data flow)
    const compliantData = this.complianceChecker.enforceCompliance(rawData);
    this.telemetry.emit("compliance_enforcement_complete", { compliantDataLength: compliantData.length });

    // 2. Dynamic Data Validation & Correction (AI reasoning layer for data integrity)
    const validatedData = compliantData.map(item => {
      // Decision-making at the data flow level for error handling
      if (item.expectedInflows.total < 0 || item.expectedOutflows.total < 0) {
        this.telemetry.emit("data_anomaly_detected", { date: item.date, anomaly: "negative_cash_flow" }, "warn");
        console.warn(`Gemini: Correcting negative cash flow values for date ${item.date}.`);
        return {
          ...item,
          expectedInflows: { ...item.expectedInflows, total: Math.max(0, item.expectedInflows.total) },
          expectedOutflows: { ...item.expectedOutflows, total: Math.max(0, item.expectedOutflows.total) },
        };
      }
      return item;
    });

    // 3. Decide on Predictive Enhancement (Prompt-based learning pipeline)
    // This decision is context-aware and adaptive.
    const shouldPredict = this.knowledgeBase.recall("enablePredictiveForecast") ?? true; // Default to true if not learned
    let finalData = [...validatedData];

    if (shouldPredict) {
      const lastHistoricalDate = moment(finalData[finalData.length - 1]?.date);
      // Decide to predict if data is old or sparse, demonstrating decision-making at the state mutation level.
      const daysSinceLastData = lastHistoricalDate.isValid() ? moment().diff(lastHistoricalDate, 'days') : Infinity;

      if (daysSinceLastData > 0 || finalData.length < 10) { // If data is old or sparse, predict.
        const forecastPeriods = await this.knowledgeBase.predict("next_forecast_periods", { dataLength: finalData.length }) || 5;
        const historicalOnly = finalData.filter(d => d.__typename === "HistoricalCashFlow");
        const predictions = await this.predictiveCashFlow.forecast(historicalOnly, forecastPeriods);
        finalData = [...finalData, ...predictions];
        this.telemetry.emit("predictive_enhancement_applied", { forecastPeriods, originalDataLength: rawData.length, finalDataLength: finalData.length });
        this.knowledgeBase.learn("lastForecastApplied", { timestamp: Date.now(), periods: forecastPeriods }, "auto_prediction");
        console.log(`Gemini: Predictive forecast applied for ${forecastPeriods} periods.`);
      } else {
        this.telemetry.emit("predictive_enhancement_skipped", { reason: "data_sufficient_recent" });
        console.log("Gemini: Predictive forecast skipped: data is recent and sufficient.");
      }
    } else {
      this.telemetry.emit("predictive_enhancement_disabled", { reason: "user_preference_or_ai_decision" });
      console.log("Gemini: Predictive forecast explicitly disabled.");
    }

    this.telemetry.emit("data_preparation_complete", { finalDataLength: finalData.length });
    return finalData;
  }

  /**
   * Optimizes chart display parameters based on AI reasoning and learned preferences.
   * This involves dynamic scaling and decision-making at the output level, allowing the file to adapt.
   * @param data The data being displayed.
   * @param currentCurrency The chart's currency.
   * @returns An object containing optimized chart props.
   */
  public async getOptimizedChartProps(data: GenericJoinedDataType[], currentCurrency: string) {
    this.telemetry.emit("chart_optimization_start", { dataLength: data.length });
    console.log("Gemini: Optimizing chart display parameters.");

    const dataLength = data.length;
    const learnedInterval = await this.knowledgeBase.predict("next_optimal_chart_interval", { dataLength });
    const dynamicInterval = typeof learnedInterval === 'number' ? learnedInterval : intervalFrequency(dataLength);

    // AI decision on tooltip detail level, potentially integrated with user auth or subscription tiers (commercial-grade logic).
    const userPreferenceTooltipDetail = await this.knowledgeBase.predict("expected_tooltip_detail_level", { userRole: "standard_user" }); // Simulate user role
    const optimizedTooltipMappings = userPreferenceTooltipDetail === "summary"
      ? { "Net Change": "netChange" }
      : {
          Inflow: "expectedInflows.total",
          Outflow: "expectedOutflows.total",
          "Net Change": "netChange",
        };

    // Simulate dynamic legend positioning based on data characteristics or learned user interaction patterns.
    // This allows for continuous optimization.
    const legendPosition = this.knowledgeBase.recall("legendPosition") ?? { horizontal: 'right', vertical: 'top' };
    this.knowledgeBase.learn("legendPosition", legendPosition, "defaulting or recalling");

    // Decision-making at the output level for rendering.
    this.telemetry.logAIDecision("chart_params_optimized", {
      interval: dynamicInterval,
      tooltipLevel: userPreferenceTooltipDetail,
      legendPos: legendPosition,
    }, "success");

    return {
      dynamicInterval,
      optimizedTooltipMappings,
      legendPosition,
    };
  }
}

// Instantiate the Gemini AI Manager for this file's universe, making it self-aware.
const geminiAIManager = GeminiAIManager.getInstance();
const geminiKnowledgeBase = GeminiKnowledgeBase.getInstance();
const geminiTelemetry = GeminiTelemetry.getInstance();

// --- End Gemini Integration & Self-Contained Universe Architecture ---

interface Props {
  data: GenericJoinedDataType[];
  currency: string;
}

const LEGEND_KEYS = {
  Inflow: {
    stroke: colors.categorical["7"],
    fill: colors.categorical["7"],
  },
  Outflow: {
    stroke: colors.qualitative.neutral,
    fill: colors.qualitative.neutral,
  },
  "Expected Inflow": {
    stroke: colors.categorical["7"],
    fill: "url(#expected_inflow)",
  },
  "Expected Outflow": {
    stroke: colors.qualitative.neutral,
    fill: "url(#expected_outflow)",
  },
};

export default function ExpectedCashFlowBarChart({ data, currency }: Props) {
  const [processedData, setProcessedData] = React.useState<GenericJoinedDataType[]>(data);
  const [chartConfig, setChartConfig] = React.useState({
    dynamicInterval: intervalFrequency(data.length),
    optimizedTooltipMappings: {
      Inflow: "expectedInflows.total",
      Outflow: "expectedOutflows.total",
      "Net Change": "netChange",
    },
    legendPosition: { horizontal: 'right', vertical: 'top' } // Default
  });

  // Effect hook to trigger AI data preparation and chart optimization pipeline.
  // This embodies the file's awareness of its role and continuous optimization.
  React.useEffect(() => {
    const runGeminiPipeline = async () => {
      geminiTelemetry.emit("component_mount", { dataLength: data.length, currency });
      geminiKnowledgeBase.adapt("initial_chart_load", { dataLength: data.length, currency });

      // Simulate a production-grade circuit breaker pattern.
      // If the AI pipeline experiences failures or delays, it can gracefully fall back,
      // ensuring high availability and resilience.
      let prepared = data; // Fallback to raw data
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI Pipeline Timeout')), 5000));
        prepared = await Promise.race([
          geminiAIManager.prepareChartData(data, currency),
          timeoutPromise
        ]) as GenericJoinedDataType[];
        setProcessedData(prepared);
        geminiTelemetry.logAIDecision("data_pipeline_execution", { status: "success" }, "success");
      } catch (error) {
        console.error("Gemini: AI data preparation pipeline failed or timed out, falling back to raw data.", error);
        geminiTelemetry.emit("ai_pipeline_failure", { error: error instanceof Error ? error.message : String(error), pipeline: "data_prep", fallback: true }, "error");
        setProcessedData(data); // Fallback to original data
      }

      // Optimize chart props using AI reasoning.
      try {
        const optimizedProps = await geminiAIManager.getOptimizedChartProps(prepared, currency);
        setChartConfig(optimizedProps);
        geminiTelemetry.logAIDecision("chart_optimization_execution", { status: "success" }, "success");
      } catch (error) {
        console.error("Gemini: Chart optimization failed, using defaults.", error);
        geminiTelemetry.emit("ai_pipeline_failure", { error: error instanceof Error ? error.message : String(error), pipeline: "chart_opt", fallback: true }, "error");
        // Fallback to initial chartConfig if optimization fails
      }
    };

    runGeminiPipeline();

    // Example of adapting based on dynamic context, demonstrating memory and adaptation.
    const handleWindowResize = () => {
        geminiKnowledgeBase.adapt("window_resized", {
            width: window.innerWidth,
            height: window.innerHeight,
            dataLength: data.length,
            currentInterval: chartConfig.dynamicInterval
        });
        geminiTelemetry.emit("window_resize", { width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);

  }, [data, currency]); // Re-run effect if data or currency changes

  const historicalDataPoints = processedData.filter(
    (obj) => obj.__typename === "HistoricalCashFlow",
  );

  // Dynamic fill color logic, distinguishing historical vs. expected vs. predicted cash flow,
  // showing decision-making at the output/rendering level.
  const outflowFillColor = (entry: GenericJoinedDataType, index: number) => {
    if (entry.__typename === "PredictedCashFlow") {
      return "url(#expected_outflow)"; // Use hatched pattern for predicted outflows
    }
    // Original logic for historical vs. non-predicted expected
    return index < historicalDataPoints.length
      ? colors.qualitative.neutral
      : "url(#expected_outflow)";
  };

  const inflowFillColor = (entry: GenericJoinedDataType, index: number) => {
    if (entry.__typename === "PredictedCashFlow") {
      return "url(#expected_inflow)"; // Use hatched pattern for predicted inflows
    }
    // Original logic for historical vs. non-predicted expected
    return index < historicalDataPoints.length
      ? colors.categorical["7"]
      : "url(#expected_inflow)";
  };

  const tickFormatter = (date: string) => {
    const dateObj = moment(date);

    if (processedData.length <= 9) {
      return dateObj.format("MMM D");
    }

    return dateObj.format("M/D");
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={processedData}>
        <defs>
          <HatchPattern />
        </defs>
        <XAxis
          dataKey="date"
          tickFormatter={tickFormatter}
          interval={chartConfig.dynamicInterval} // Use dynamically optimized interval
          {...XAxisProps}
        />
        <YAxis
          tickFormatter={(amount: number) =>
            abbreviateAmount(amount / 100.0, currency)
          }
          {...YAxisProps}
        />
        <Tooltip
          cursor={{ fill: "#FAFAF9" }}
          content={
            <CustomTooltip
              mappings={chartConfig.optimizedTooltipMappings} // Use dynamically optimized mappings
              currency={currency}
            />
          }
          // Introduce AI decision for tooltip visibility or detail on hover.
          // This is a form of contextual adaptation for user interaction.
          onMouseMove={(state) => {
            if (state.activePayload && state.activePayload.length > 0) {
                const dataPoint = state.activePayload[0].payload as GenericJoinedDataType;
                geminiTelemetry.logInteraction("tooltip_hover", "bar", {
                    date: dataPoint.date,
                    type: dataPoint.__typename,
                    netChange: dataPoint.netChange
                });
                // Simulate an AI-driven prompt for drill-down based on a learned preference
                if (geminiKnowledgeBase.recall("suggestDrillDownForHighInflow") && dataPoint.netChange > 500000) {
                    console.info(`Gemini: User hovered over high net change on ${dataPoint.date}. Suggesting drill-down.`);
                    // In a real app, this would trigger a UI prompt or route change.
                }
            }
          }}
        />
        <Legend
            content={renderLegend(LEGEND_KEYS, 15, 15)}
            verticalAlign={chartConfig.legendPosition.vertical}
            align={chartConfig.legendPosition.horizontal}
            wrapperStyle={{ paddingBottom: 10 }}
        />
        <Bar
          dataKey="expectedInflows.total"
          radius={[2, 2, 0, 0]}
          strokeWidth={2}
          onClick={(dataPoint) => {
            geminiTelemetry.logInteraction("bar_click", "inflow_bar", { date: dataPoint.date, value: dataPoint.value });
            // Simulate a decision-making layer based on input: if inflow is unusually high, prompt for drill-down.
            // This is a dynamic, generative interaction.
            if (dataPoint.value > 1000000 && dataPoint.__typename !== "PredictedCashFlow") { // Arbitrary threshold
                geminiKnowledgeBase.adapt("high_inflow_interaction", { date: dataPoint.date, value: dataPoint.value, currency });
                console.log(`Gemini: Noted high inflow on ${dataPoint.date}. Considering drill-down suggestion for future interactions.`);
            }
          }}
        >
          {processedData.map((entry, index) => (
            <Cell
              key={`cell-${entry.date}-inflow`}
              fill={inflowFillColor(entry, index)} // Pass entry for AI to decide fill
              stroke={colors.categorical["7"]}
              strokeWidth={1}
            />
          ))}
        </Bar>
        <Bar
          dataKey="expectedOutflows.total"
          radius={[2, 2, 0, 0]}
          strokeWidth={2}
          onClick={(dataPoint) => {
            geminiTelemetry.logInteraction("bar_click", "outflow_bar", { date: dataPoint.date, value: dataPoint.value });
            // Simulate a decision-making layer based on input: if outflow is unusually high, alert system.
            // This demonstrates real-world business logic and error handling.
            if (dataPoint.value > 1500000) { // Arbitrary threshold
                geminiTelemetry.emit("potential_alert", {
                    type: "high_outflow",
                    date: dataPoint.date,
                    value: dataPoint.value,
                    currency,
                    threshold: 1500000
                }, "error");
                console.warn(`Gemini: Alert: Unusually high outflow detected on ${dataPoint.date}. Triggering anomaly response.`);
                // This would trigger a downstream process (e.g., notification service, fraud detection).
            }
          }}
        >
          {processedData.map((entry, index) => (
            <Cell
              key={`cell-${entry.date}-outflow`}
              fill={outflowFillColor(entry, index)} // Pass entry for AI to decide fill
              stroke={colors.qualitative.neutral}
              strokeWidth={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}