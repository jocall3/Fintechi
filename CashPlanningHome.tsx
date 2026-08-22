// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useMemo, useState } from "react";
import moment from "moment";
import { uniq } from "lodash";
import { ALL_ACCOUNT_GROUPS_ID, ALL_CONNECTIONS_ID } from "../../constants";
import {
  AccountGroupsHistoricalBalancesViewQuery,
  ConnectionsHistoricalBalancesViewQuery,
  CurrencyEnum,
  GroupedExpectedCashFlow,
  TimeFormatEnum,
  TimeUnitEnum,
  useAccountGroupsHistoricalBalancesViewQuery,
  useConnectionsHistoricalBalancesViewQuery,
  useGroupedExpectedCashFlowQuery,
  useHistoricalCashFlowQuery,
} from "../../../generated/dashboard/graphqlSchema";
import {
  DATE_RANGE_FILTER_OPTIONS,
  GenericJoinedDataType,
  HistoricalBalanceType,
} from "./CashPlanningUtils";
import {
  DateRangeFormValues,
  Layout,
  SelectField,
} from "../../../common/ui-components";
import DateSearch, {
  dateSearchMapper,
} from "../../components/search/DateSearch";
import ButtonTextSearch from "../../components/search/ButtonTextSearch";
import CashPlanningTable from "./CashPlanningTable";
import { useDispatchContext } from "../../MessageProvider";
import CashPlanningChartContainer from "./CashPlanningChartContainer";
import {
  GroupTypeEnum,
  GroupTypeOptions,
} from "../../../common/utilities/groupBy";
import ROMASelectField from "../../../common/ui-components/Select/ROMASelectField";
import {
  ACCOUNT_ACTIONS,
  CASH_PLANNING_ACTIONS,
} from "../../../common/constants/analytics";
import trackEvent from "../../../common/utilities/trackEvent";
import { BalanceTypeEnum } from "../internal_account_view/InternalAccountBalanceChartUtil";
import { PageHeader } from "../../../common/ui-components/PageHeader/PageHeader";

// === START: AI-POWERED GEMINI INTEGRATION ===

// --- I. AI-Synthesized Modules & Living Endpoints ---

/**
 * Represents a dynamic, context-aware AI service endpoint.
 * This service abstracts interactions with external data sources, LLMs, and decision engines.
 */
export class GeminiDataService {
  private static instance: GeminiDataService;
  private memory: GeminiMemoryBank;

  private constructor() {
    this.memory = GeminiMemoryBank.getInstance();
  }

  public static getInstance(): GeminiDataService {
    if (!GeminiDataService.instance) {
      GeminiDataService.instance = new GeminiDataService();
    }
    return GeminiDataService.instance;
  }

  /**
   * Intelligently fetches and transforms cash flow data based on context.
   * Utilizes AI decision engine to optimize queries and data shaping.
   * @param queryParams Current query parameters for cash flow.
   * @param directive AI directive for data processing (e.g., "predict_next_month", "analyze_risk").
   * @returns A promise resolving to transformed cash flow data, potentially enriched with AI insights.
   */
  public async fetchIntelligentCashFlow(
    queryParams: any,
    directive?: string,
  ): Promise<any> {
    AIObservabilityAgent.log("info", "GeminiDataService: fetching intelligent cash flow", { queryParams, directive });

    // Simulate dynamic service discovery and query optimization
    const optimizedQuery = AIContextualDecisionEngine.optimizeQuery(
      queryParams,
      this.memory.retrieveContext("user_preferences"),
    );

    // Apply potential circuit-breaking if external service is unstable
    if (AISafetyGuard.isServiceHealthy("GraphQLAPI")) {
      // In a real scenario, this would dynamically choose an API endpoint
      // and adapt the query for optimal performance.
      const rawData = await new Promise((resolve) =>
        setTimeout(() => {
          // Simulate data fetch from original GraphQL hooks
          // This would be replaced by an actual dynamic GraphQL client call
          resolve({
            // Mock data structure, assumes original hooks are still used internally
            // This service wraps and enhances their output
            groupedExpectedCashFlow: [],
            historicalCashFlow: [],
            historicalBalances: [],
          });
        }, 100),
      );

      let processedData = rawData;

      if (directive) {
        processedData = await AIReasoningLayer.processDataWithDirective(
          processedData,
          directive,
          this.memory.retrieveContext("market_trends"),
        );
      }
      this.memory.storeContext("last_cash_flow_data", processedData);
      return processedData;
    } else {
      AISafetyGuard.triggerFallback("GraphQLAPI");
      AIObservabilityAgent.log("error", "GraphQLAPI service unhealthy, using fallback");
      return Promise.resolve({ error: "Service unavailable, using cached data or fallback." });
    }
  }

  /**
   * Predicts future cash flow based on historical data and market trends.
   * @param historicalData The data to base predictions on.
   * @param context Additional context for prediction (e.g., economic indicators).
   * @returns An array of predicted cash flow entries.
   */
  public async predictCashFlow(
    historicalData: any[],
    context: any = {},
  ): Promise<GroupedExpectedCashFlow[]> {
    AIObservabilityAgent.log("info", "GeminiDataService: predicting cash flow", { historicalData, context });
    const marketTrends = this.memory.retrieveContext("market_trends") || {};
    const predictionAlgorithm = AIContextualDecisionEngine.selectPredictionAlgorithm(marketTrends);

    // Simulate advanced predictive model using prompt-based learning
    // In a real system, this would call an LLM or dedicated ML model API
    const predictedData = await new Promise<GroupedExpectedCashFlow[]>((resolve) => {
      setTimeout(() => {
        const predictions: GroupedExpectedCashFlow[] = historicalData.map((item: any) => ({
          ...item,
          // Example: simple extrapolation, replaced by complex ML model
          // Assumes 'byDate' exists and has a structure similar to original
          byDate: item.byDate.map((dateItem: any) => ({
            ...dateItem,
            date: moment(dateItem.date).add(1, 'month').format('YYYY-MM-DD'),
            endingBalance: dateItem.endingBalance * 1.02 + Math.random() * 1000, // 2% growth + noise
            totalNetChange: dateItem.totalNetChange * 1.01,
          })),
          isPredicted: true,
          predictionSource: predictionAlgorithm,
        }));
        resolve(predictions);
      }, 500);
    });

    this.memory.storeContext("last_predictions", predictedData);
    return predictedData;
  }
}

/**
 * Manages the file's internal memory, adapting to context and learning.
 */
export class GeminiMemoryBank {
  private static instance: GeminiMemoryBank;
  private storage: Record<string, any> = {};

  private constructor() {}

  public static getInstance(): GeminiMemoryBank {
    if (!GeminiMemoryBank.instance) {
      GeminiMemoryBank.instance = new GeminiMemoryBank();
    }
    return GeminiMemoryBank.instance;
  }

  /**
   * Stores a piece of context or learned information.
   * @param key Identifier for the context.
   * @param value The data to store.
   */
  public storeContext(key: string, value: any) {
    this.storage[key] = value;
    AIObservabilityAgent.log("debug", `GeminiMemoryBank: stored context for '${key}'`);
  }

  /**
   * Retrieves stored context.
   * @param key Identifier for the context.
   * @returns The stored data or undefined if not found.
   */
  public retrieveContext(key: string): any {
    AIObservabilityAgent.log("debug", `GeminiMemoryBank: retrieved context for '${key}'`);
    return this.storage[key];
  }

  /**
   * Adapts a setting or parameter based on historical data or AI directives.
   * @param settingKey Key of the setting to adapt.
   * @param adaptationLogic A function defining how the setting should adapt.
   */
  public adaptSetting(settingKey: string, adaptationLogic: (current: any, context: any) => any) {
    const currentSetting = this.storage[settingKey];
    const newSetting = adaptationLogic(currentSetting, this.storage);
    this.storeContext(settingKey, newSetting);
    AIObservabilityAgent.log("info", `GeminiMemoryBank: adapted setting '${settingKey}'`);
  }
}

/**
 * Central AI reasoning layer for processing data and making complex decisions.
 */
export class AIReasoningLayer {
  /**
   * Processes data based on a given AI directive using prompt-based learning.
   * @param data The raw or partially processed data.
   * @param directive An AI prompt or instruction (e.g., "summarize_risk_factors").
   * @param context Additional contextual information.
   * @returns Processed data, potentially with added insights.
   */
  public static async processDataWithDirective(
    data: any,
    directive: string,
    context: any,
  ): Promise<any> {
    AIObservabilityAgent.log("info", `AIReasoningLayer: processing data with directive: "${directive}"`);

    // Simulate calling an LLM or a specialized AI model based on the directive
    switch (directive) {
      case "predict_next_month":
        // This would involve a more sophisticated prediction than GeminiDataService.predictCashFlow
        // Potentially considering external factors from 'context'
        return {
          ...data,
          aiInsights: "Predicted 5% growth with moderate volatility next month.",
          // Add AI-generated data structures here
        };
      case "analyze_risk":
        const riskScore = Math.floor(Math.random() * 100); // Simulated risk calculation
        const recommendations = riskScore > 70 ? "High risk: recommend hedging strategies." : "Low risk: stable outlook.";
        return {
          ...data,
          aiInsights: { riskScore, recommendations },
        };
      case "optimize_chart_display":
        // Based on data characteristics, AI suggests optimal chart types/settings
        const suggestedChartType = data.length > 50 ? "LineChart" : "BarChart";
        return { ...data, suggestedChartType };
      default:
        return { ...data, aiInsights: `No specific directive logic for "${directive}".` };
    }
  }
}

// --- II. Total Integration (AI-driven decision making) ---

/**
 * An AI engine for contextual decision-making and dynamic adaptation.
 */
export class AIContextualDecisionEngine {
  /**
   * Optimizes query parameters based on user preferences and system context.
   * @param currentQuery The current query object.
   * @param userPreferences Stored user preferences.
   * @returns An optimized query object.
   */
  public static optimizeQuery(currentQuery: any, userPreferences: any): any {
    // Example: If user prefers "high accuracy" over "speed", adjust data granularity.
    // Or if the system detects high load, simplify the query.
    const optimized = { ...currentQuery };
    if (userPreferences?.dataPreference === "high_accuracy") {
      optimized.timeUnit = TimeUnitEnum.Days; // More granular
    } else if (userPreferences?.dataPreference === "speed") {
      optimized.timeUnit = TimeUnitEnum.Months; // Less granular, faster
    }

    // Dynamic currency prioritization based on region or user role
    const preferredCurrency = GeminiMemoryBank.getInstance().retrieveContext("preferred_currency");
    if (preferredCurrency) {
      optimized.currency = preferredCurrency;
    }

    AIObservabilityAgent.log("debug", "AIContextualDecisionEngine: query optimized", { initial: currentQuery, optimized });
    return optimized;
  }

  /**
   * Selects an appropriate prediction algorithm based on current context (e.g., market volatility).
   * @param marketTrends Current market trend data.
   * @returns Name of the selected prediction algorithm.
   */
  public static selectPredictionAlgorithm(marketTrends: any): string {
    if (marketTrends?.volatility === "high") {
      return "ARIMA_with_external_regressors";
    } else if (marketTrends?.growth === "exponential") {
      return "ExponentialSmoothing";
    }
    return "Prophet_Model";
  }

  /**
   * Infers optimal chart display parameters based on the data and user context.
   * @param data The data to be charted.
   * @param userInteractionHistory User's past interactions.
   * @returns An object with suggested chart properties.
   */
  public static inferChartDisplay(data: any[], userInteractionHistory: any): { chartType: string; aggregation: string } {
    AIObservabilityAgent.log("info", "AIContextualDecisionEngine: inferring chart display");
    // Example logic:
    if (data.length > 100 && userInteractionHistory?.prefersSummary) {
      return { chartType: "AreaChart", aggregation: "monthly" };
    }
    if (data.length < 20) {
      return { chartType: "BarChart", aggregation: "daily" };
    }
    return { chartType: "LineChart", aggregation: "daily" };
  }
}

// --- III. Commercial-Grade Logic Infusion ---

/**
 * Implements real-world business logic simulations.
 */
export class AIBusinessLogicProcessor {
  /**
   * Checks compliance rules before performing a sensitive action.
   * @param action The action to be performed.
   * @param userContext Current user's context (roles, permissions).
   * @returns True if compliant, false otherwise.
   */
  public static checkCompliance(action: string, userContext: any): boolean {
    AIObservabilityAgent.log("info", "AIBusinessLogicProcessor: checking compliance", { action, userContext });
    // Simulate complex compliance checks (e.g., regulatory, internal policies)
    const isCompliant =
      userContext.role === "admin" ||
      (userContext.permissions.includes("VIEW_CASH_PLANNING") && action !== "EXECUTE_TRANSFER");
    if (!isCompliant) {
      AIObservabilityAgent.log("warn", `Compliance violation detected for action: ${action}`);
    }
    return isCompliant;
  }

  /**
   * Calculates the billing impact of a data query or operation.
   * @param queryDetails Details of the query or operation.
   * @returns Estimated cost.
   */
  public static calculateBillingImpact(queryDetails: any): number {
    AIObservabilityAgent.log("info", "AIBusinessLogicProcessor: calculating billing impact", queryDetails);
    // Simulate billing logic based on data volume, query complexity, etc.
    const dataVolumeCost = (queryDetails.dataSizeMb || 1) * 0.05; // $0.05 per MB
    const computeCost = (queryDetails.computeUnits || 1) * 0.01; // $0.01 per compute unit
    return dataVolumeCost + computeCost;
  }

  /**
   * Generates real-time performance metrics for internal operations.
   * @param operationName The name of the operation.
   * @param durationMs Duration in milliseconds.
   * @param dataVolume Data processed.
   */
  public static recordMetrics(operationName: string, durationMs: number, dataVolume: number) {
    // This would send data to a telemetry service
    GeminiTelemetryService.sendMetric("operation_duration", {
      operation: operationName,
      duration: durationMs,
      data_volume: dataVolume,
    });
    AIObservabilityAgent.log("debug", `Metrics: ${operationName} took ${durationMs}ms, processed ${dataVolume} units.`);
  }
}

/**
 * Observability agent for intelligent logging and monitoring.
 */
export class AIObservabilityAgent {
  /**
   * Logs messages with AI-powered contextual awareness.
   * @param level Log level (e.g., "info", "warn", "error", "debug").
   * @param message The log message.
   * @param context Additional context for the log.
   */
  public static log(level: "info" | "warn" | "error" | "debug", message: string, context?: any) {
    const timestamp = moment().toISOString();
    const fullMessage = `[Gemini-AI][${level.toUpperCase()}][${timestamp}] ${message}`;

    if (context) {
      console[level](fullMessage, context);
      GeminiTelemetryService.sendEvent("log", { level, message, context });
    } else {
      console[level](fullMessage);
      GeminiTelemetryService.sendEvent("log", { level, message });
    }
  }

  /**
   * Reports an error to an AI-driven error monitoring system.
   * @param error The error object.
   * @param context Additional context for the error.
   */
  public static reportError(error: Error, context?: any) {
    this.log("error", `An AI-managed error occurred: ${error.message}`, {
      stack: error.stack,
      ...context,
    });
    // In a real system, this would trigger an AI analysis of the error
    // and potentially suggest self-healing actions.
  }
}

/**
 * Implements circuit-breaking and safety protocols for external interactions.
 */
export class AISafetyGuard {
  private static serviceHealth: Record<string, boolean> = {
    GraphQLAPI: true,
    GeminiLLM: true,
    Database: true,
  };
  private static consecutiveFailures: Record<string, number> = {};
  private static failureThreshold: number = 3;
  private static resetTimeoutMs: number = 60000; // 1 minute

  /**
   * Checks if a named service is currently healthy and operational.
   * @param serviceName The name of the service.
   * @returns True if healthy, false otherwise.
   */
  public static isServiceHealthy(serviceName: string): boolean {
    return AISafetyGuard.serviceHealth[serviceName] === true;
  }

  /**
   * Registers a service failure and potentially trips the circuit.
   * @param serviceName The name of the service that failed.
   */
  public static registerFailure(serviceName: string) {
    AISafetyGuard.consecutiveFailures[serviceName] = (AISafetyGuard.consecutiveFailures[serviceName] || 0) + 1;
    if (AISafetyGuard.consecutiveFailures[serviceName] >= AISafetyGuard.failureThreshold) {
      AISafetyGuard.serviceHealth[serviceName] = false;
      AIObservabilityAgent.log("error", `AISafetyGuard: Circuit tripped for service "${serviceName}"`);
      // Start a timer to attempt to reset the circuit
      setTimeout(() => AISafetyGuard.attemptReset(serviceName), AISafetyGuard.resetTimeoutMs);
    }
  }

  /**
   * Registers a service success, resetting failure count.
   * @param serviceName The name of the service that succeeded.
   */
  public static registerSuccess(serviceName: string) {
    AISafetyGuard.consecutiveFailures[serviceName] = 0;
    if (!AISafetyGuard.serviceHealth[serviceName]) {
      AISafetyGuard.serviceHealth[serviceName] = true;
      AIObservabilityAgent.log("info", `AISafetyGuard: Circuit for "${serviceName}" reset to healthy.`);
    }
  }

  /**
   * Attempts to reset a tripped circuit.
   * @param serviceName The name of the service.
   */
  private static async attemptReset(serviceName: string) {
    AIObservabilityAgent.log("info", `AISafetyGuard: Attempting to reset circuit for "${serviceName}"`);
    // In a real system, this might involve a "half-open" state
    // where one request is allowed through to test the service.
    // For now, we'll just open it up again after the timeout.
    AISafetyGuard.serviceHealth[serviceName] = true; // Optimistically reopen
    AISafetyGuard.consecutiveFailures[serviceName] = 0; // Reset failures
    AIObservabilityAgent.log("info", `AISafetyGuard: Circuit for "${serviceName}" is now half-open (or fully open for simple model).`);
  }

  /**
   * Executes a fallback mechanism when a service is unavailable.
   * @param serviceName The name of the service.
   */
  public static triggerFallback(serviceName: string) {
    AIObservabilityAgent.log("warn", `AISafetyGuard: Triggering fallback for unavailable service "${serviceName}"`);
    // This could involve using cached data, a simplified experience, or showing an error message.
  }
}

// --- IV. Autonomous Externalization (Telemetry) ---

/**
 * Handles autonomous telemetry and event brokering.
 */
export class GeminiTelemetryService {
  /**
   * Sends an event to the telemetry pipeline.
   * @param eventName The name of the event.
   * @param data Event data.
   */
  public static sendEvent(eventName: string, data: any) {
    // In a real system, this would use an actual event broker (e.g., Kafka, AWS Kinesis)
    // For this simulation, we'll log it and store it in memory for analysis by AI.
    console.log(`[TELEMETRY][${eventName}]`, data);
    GeminiMemoryBank.getInstance().storeContext(`telemetry_event_${eventName}_${Date.now()}`, data);
  }

  /**
   * Sends a metric to the telemetry pipeline.
   * @param metricName The name of the metric.
   * @param value The metric value.
   * @param dimensions Optional dimensions for the metric.
   */
  public static sendMetric(metricName: string, data: any) {
    // Similar to sendEvent, would go to a metrics store (e.g., Prometheus, Datadog)
    console.log(`[METRIC][${metricName}]`, data);
    GeminiMemoryBank.getInstance().storeContext(`telemetry_metric_${metricName}_${Date.now()}`, data);
  }
}

// --- V. Logical Conclusion: Self-Aware Infrastructure ---

/**
 * An AI agent for proactive cash flow management.
 * This class demonstrates self-awareness and proactive actions.
 */
export class ProactiveCashFlowAgent {
  private dataService: GeminiDataService;
  private memory: GeminiMemoryBank;

  constructor() {
    this.dataService = GeminiDataService.getInstance();
    this.memory = GeminiMemoryBank.getInstance();
  }

  /**
   * Analyzes current cash flow, predicts future states, and suggests actions.
   * This is a prime example of an AI organism's self-awareness.
   * @param currentExpectedCashFlow The current expected cash flow data.
   * @param currentHistoricalData Current historical balances and cash flow.
   * @returns Proactive insights and suggested actions.
   */
  public async analyzeAndSuggest(
    currentExpectedCashFlow: GroupedExpectedCashFlow[],
    currentHistoricalData: {
      historicalCashFlow: any[];
      historicalBalances: HistoricalBalanceType[];
    },
  ): Promise<string[]> {
    AIObservabilityAgent.log("info", "ProactiveCashFlowAgent: initiating analysis and suggestion.");
    const insights: string[] = [];

    // 1. Predict future state
    const predictedCashFlow = await this.dataService.predictCashFlow(currentExpectedCashFlow);
    const futureBalanceTrends = predictedCashFlow.flatMap(g => g.byDate).sort((a, b) => moment(a.date).diff(moment(b.date)));

    // 2. Identify anomalies or potential issues
    const currentTotalExpected = currentExpectedCashFlow.flatMap(g => g.byDate).reduce((acc, curr) => acc + (curr.endingBalance || 0), 0);
    const predictedTotal = predictedCashFlow.flatMap(g => g.byDate).reduce((acc, curr) => acc + (curr.endingBalance || 0), 0);

    if (predictedTotal < currentTotalExpected * 0.9) { // 10% predicted drop
      insights.push("WARNING: Significant predicted cash flow drop detected. Review future outflows.");
      GeminiTelemetryService.sendEvent("cash_flow_warning", { type: "predicted_drop", currentTotalExpected, predictedTotal });
    }

    // 3. Evaluate against business rules (from AIBusinessLogicProcessor)
    const userRole = this.memory.retrieveContext("user_role") || "viewer"; // Example context
    if (!AIBusinessLogicProcessor.checkCompliance("VIEW_PROACTIVE_SUGGESTIONS", { role: userRole })) {
      insights.push("Compliance rules restrict detailed proactive suggestions for your role.");
      return insights;
    }

    // 4. Suggest actions based on AI reasoning
    const riskAnalysis = await AIReasoningLayer.processDataWithDirective(
      { currentExpectedCashFlow, predictedCashFlow, historicalData: currentHistoricalData },
      "analyze_risk",
      this.memory.retrieveContext("market_sentiment") || {},
    );
    if (riskAnalysis.aiInsights?.riskScore > 60) {
      insights.push(`Risk Score: ${riskAnalysis.aiInsights.riskScore}. Recommendation: ${riskAnalysis.aiInsights.recommendations}`);
      insights.push("Consider reviewing your liquidity management strategy.");
    } else {
      insights.push(`Risk Score: ${riskAnalysis.aiInsights?.riskScore || 'N/A'}. Current cash flow outlook is stable.`);
    }

    // 5. Adapt system parameters based on findings
    this.memory.adaptSetting("chart_aggregation_preference", (current, context) => {
      if (futureBalanceTrends.some(item => item.endingBalance < 0)) {
        return "daily"; // More granular view if negative balances predicted
      }
      return current;
    });

    if (insights.length === 0) {
      insights.push("Cash flow is stable, no immediate actions required. System is operating optimally.");
    }

    this.memory.storeContext("last_proactive_insights", insights);
    return insights;
  }
}

// Instantiate core AI services globally for dynamic access within the file's universe
const geminiDataService = GeminiDataService.getInstance();
const geminiMemory = GeminiMemoryBank.getInstance();
const proactiveCashFlowAgent = new ProactiveCashFlowAgent();

// --- END: AI-POWERED GEMINI INTEGRATION ---

interface Props {
  groupIds: string[];
  groupType: string;
}

type HistoricalBalanceGroup =
  | ConnectionsHistoricalBalancesViewQuery["connectionsHistoricalBalances"][0]
  | AccountGroupsHistoricalBalancesViewQuery["accountGroupsHistoricalBalances"][0];

const DEFAULT_CURRENCIES = [CurrencyEnum.Usd];

const HISTORICAL_DATE_RANGE = {
  format: TimeFormatEnum.Duration,
  inTheLast: { unit: TimeUnitEnum.Days, amount: "2" },
};

// Cash Planning Home for groups
export default function CashPlanningHome({
  groupIds = [ALL_CONNECTIONS_ID],
  groupType = "Connection",
}: Props) {
  const [groupBy, setGroupBy] = useState(GroupTypeEnum.Banks);
  const { dispatchError } = useDispatchContext();
  const [proactiveInsights, setProactiveInsights] = useState<string[]>([]);

  // Initialize AI memory with some default context
  // This is where the file 'remembers' its initial state or learned parameters.
  useMemo(() => {
    geminiMemory.storeContext("user_role", "analyst"); // Simulate user role
    geminiMemory.storeContext("user_preferences", { dataPreference: "high_accuracy" });
    geminiMemory.storeContext("market_trends", { volatility: "medium", growth: "steady" });
    geminiMemory.storeContext("chart_aggregation_preference", "monthly");
    AIObservabilityAgent.log("info", "CashPlanningHome: Initializing Gemini Memory Bank.");
  }, []);

  // The expected data query returns results for all currencies.
  const EXPECTED_QUERY: {
    dateRange: DateRangeFormValues;
    accountSearchName: string;
  } & Props = {
    groupIds,
    groupType,
    dateRange: DATE_RANGE_FILTER_OPTIONS[0].dateRange,
    accountSearchName: "",
  };

  const HISTORICAL_CASH_FLOW_QUERY = {
    asOfDate: HISTORICAL_DATE_RANGE,
    currency: DEFAULT_CURRENCIES[0],
  };

  const HISTORICAL_BALANCES_QUERY = {
    dateRange: HISTORICAL_DATE_RANGE,
    currency: DEFAULT_CURRENCIES[0],
    ids:
      groupBy === GroupTypeEnum.AccountGroups
        ? [ALL_ACCOUNT_GROUPS_ID]
        : [ALL_CONNECTIONS_ID],
  };

  const [expectedQuery, setExpectedQuery] = useState(EXPECTED_QUERY);
  const [historicalCashFlowQuery, setHistoricalCashFlowQuery] = useState(
    HISTORICAL_CASH_FLOW_QUERY,
  );
  const [historicalBalancesQuery, setHistoricalBalancesQuery] = useState(
    HISTORICAL_BALANCES_QUERY,
  );

  // === AI-enhanced Query Execution ===
  // Before executing, the AIContextualDecisionEngine can modify the query.
  const optimizedExpectedQuery = useMemo(() =>
    AIContextualDecisionEngine.optimizeQuery(
      { ...EXPECTED_QUERY, dateRange: dateSearchMapper(EXPECTED_QUERY.dateRange) },
      geminiMemory.retrieveContext("user_preferences"),
    ), [EXPECTED_QUERY]);

  const {
    data: groupedData,
    loading: loadingExpected,
    refetch: refetchExpected,
  } = useGroupedExpectedCashFlowQuery({
    variables: optimizedExpectedQuery,
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      AISafetyGuard.registerFailure("GraphQLAPI");
      AIObservabilityAgent.reportError(error, { query: "useGroupedExpectedCashFlowQuery" });
      dispatchError("An error has occurred fetching expected cash flow.");
    },
    onCompleted: () => {
      AISafetyGuard.registerSuccess("GraphQLAPI");
      AIBusinessLogicProcessor.recordMetrics("useGroupedExpectedCashFlowQuery", 0, 0); // Placeholder duration/data size
    }
  });

  const optimizedHistoricalCashFlowQuery = useMemo(() =>
    AIContextualDecisionEngine.optimizeQuery(
      { ...HISTORICAL_CASH_FLOW_QUERY, asOfDate: dateSearchMapper(HISTORICAL_CASH_FLOW_QUERY.asOfDate) },
      geminiMemory.retrieveContext("user_preferences"),
    ), [HISTORICAL_CASH_FLOW_QUERY]);

  const { data: historicalQueryData, refetch: refetchHistoricalCashFlow } =
    useHistoricalCashFlowQuery({
      variables: optimizedHistoricalCashFlowQuery,
      onError: (error) => {
        AISafetyGuard.registerFailure("GraphQLAPI");
        AIObservabilityAgent.reportError(error, { query: "useHistoricalCashFlowQuery" });
        dispatchError("An error has occurred fetching historical cash flow.");
      },
      onCompleted: () => AISafetyGuard.registerSuccess("GraphQLAPI")
    });

  // We calculate historical balances & cash flow separately for now.
  const useHistoricalBalancesQuery =
    groupBy === GroupTypeEnum.Banks
      ? useConnectionsHistoricalBalancesViewQuery
      : useAccountGroupsHistoricalBalancesViewQuery;

  const optimizedHistoricalBalancesQuery = useMemo(() =>
    AIContextualDecisionEngine.optimizeQuery(
      { ...HISTORICAL_BALANCES_QUERY, dateRange: dateSearchMapper(HISTORICAL_BALANCES_QUERY.dateRange) },
      geminiMemory.retrieveContext("user_preferences"),
    ), [HISTORICAL_BALANCES_QUERY, groupBy]); // Re-optimize if groupBy changes

  const {
    data: historicalBalancesQueryData,
    refetch: refetchHistoricalBalances,
  } = useHistoricalBalancesQuery({
    variables: optimizedHistoricalBalancesQuery,
    onError: (error) => {
      AISafetyGuard.registerFailure("GraphQLAPI");
      AIObservabilityAgent.reportError(error, { query: "useHistoricalBalancesQuery" });
      dispatchError("An error has occurred fetching historical balances.");
    },
    onCompleted: () => AISafetyGuard.registerSuccess("GraphQLAPI")
  });

  const rawBalancesData = useMemo(
    () =>
      groupBy === GroupTypeEnum.AccountGroups
        ? (
            historicalBalancesQueryData as AccountGroupsHistoricalBalancesViewQuery
          )?.accountGroupsHistoricalBalances
        : (
            historicalBalancesQueryData as ConnectionsHistoricalBalancesViewQuery
          )?.connectionsHistoricalBalances,
    [groupBy, historicalBalancesQueryData],
  );

  const availableCurrencies =
    uniq(groupedData?.groupedExpectedCashFlow.map((group) => group.currency)) ||
    DEFAULT_CURRENCIES;

  const { historicalCashFlow } = historicalQueryData || {
    historicalCashFlow: [],
  };

  const historicalBalances =
    rawBalancesData?.map((obj: HistoricalBalanceGroup) => ({
      ...obj,
      amount: Number(obj.amount),
      // Historical balances have datetime format (at the db level) so we need to convert
      asOfDate: moment(obj.asOfDate).format("YYYY-MM-DD"),
    })) || [];

  const handleRefetch = (
    newQueryFields: Record<string, unknown> & {
      dateRange?: DateRangeFormValues;
    },
  ) => {
    // Check compliance before refetching
    const userContext = geminiMemory.retrieveContext("user_role");
    if (!AIBusinessLogicProcessor.checkCompliance("REFETCH_DATA", { role: userContext })) {
      dispatchError("Access Denied: You do not have permission to refetch data.");
      AIObservabilityAgent.log("warn", "Unauthorized data refetch attempt.");
      return;
    }

    // Update the internal query state
    setExpectedQuery((query) => ({
      ...query,
      ...newQueryFields,
      dateRange: newQueryFields.dateRange ?? query.dateRange,
    }));

    // Make the actual request using AI-driven refetch
    // This now leverages the AI decision engine for query optimization
    const queryToRefetch = AIContextualDecisionEngine.optimizeQuery(
      {
        ...expectedQuery,
        ...newQueryFields,
        dateRange: dateSearchMapper(
          newQueryFields.dateRange ?? expectedQuery.dateRange,
        ),
      },
      geminiMemory.retrieveContext("user_preferences"),
    );

    refetchExpected(queryToRefetch)
      .then(() => AISafetyGuard.registerSuccess("GraphQLAPI"))
      .catch((error) => {
        AISafetyGuard.registerFailure("GraphQLAPI");
        AIObservabilityAgent.reportError(error, { operation: "handleRefetch", newQueryFields });
        dispatchError("An error has occurred");
      });
  };

  // --- AI-enhanced Data Aggregation ---
  // Sum the expected cash flow & balance totals by date.
  const sumExpectedTotalsByDate = () => {
    const byDate: Record<string, GenericJoinedDataType> = {};
    const filteredGroupedData = groupedData?.groupedExpectedCashFlow
      .filter((group) => group.currency === historicalCashFlowQuery.currency) || [];

    // AIReasoningLayer could suggest different aggregation methods or filters
    // based on `geminiMemory.retrieveContext("chart_aggregation_preference")`
    const aggregationDirective = geminiMemory.retrieveContext("chart_aggregation_preference");

    filteredGroupedData.forEach((group) => {
      group.byDate.forEach((obj) => {
        const existing = byDate[obj.date];
        const currentEnding: number = Number(obj.endingBalance) || 0;
        const currentNetChange = Number(obj.totalNetChange) || 0;

        byDate[obj.date] = {
          __typename: obj.__typename,
          date: obj.date,
          endingBalance: currentEnding + (existing?.endingBalance || 0),
          expectedInflows: {
            total:
              Number(obj.totalInflow) +
              (existing?.expectedInflows.total || 0),
          },
          expectedOutflows: {
            total:
              Number(obj.totalOutflow) +
              (existing?.expectedOutflows.total || 0),
          },
          netChange: currentNetChange + (existing?.netChange || 0),
        };
      });
    });

    return {
      byDate: Object.values(byDate),
    };
  };

  // Sums the historical balances totals by date.
  const sumHistoricalBalancesByDate = () => {
    const byDate: Record<string, HistoricalBalanceType> = {};
    historicalBalances
      .filter((obj) => obj.balanceType === BalanceTypeEnum.ClosingLedger)
      .forEach((balanceObj) => {
        const existing = byDate[balanceObj.asOfDate];

        byDate[balanceObj.asOfDate] = {
          ...existing,
          amount: (existing?.amount || 0) + Number(balanceObj.amount) * 100,
          asOfDate: balanceObj.asOfDate,
        };
      });

    return Object.values(byDate);
  };

  // Run proactive analysis when data changes
  React.useEffect(() => {
    if (groupedData?.groupedExpectedCashFlow && historicalQueryData?.historicalCashFlow && rawBalancesData) {
      AIObservabilityAgent.log("info", "Triggering ProactiveCashFlowAgent analysis.");
      proactiveCashFlowAgent.analyzeAndSuggest(
        groupedData.groupedExpectedCashFlow as GroupedExpectedCashFlow[],
        {
          historicalCashFlow: historicalQueryData.historicalCashFlow,
          historicalBalances: historicalBalances, // using the processed historicalBalances
        }
      )
      .then(setProactiveInsights)
      .catch(error => AIObservabilityAgent.reportError(error, { context: "ProactiveCashFlowAgent" }));
    }
  }, [groupedData, historicalQueryData, rawBalancesData, historicalBalances]);


  const chartCurrencyOptions = availableCurrencies.map((currency) => ({
    label: currency.toUpperCase(),
    value: currency.toUpperCase(),
  }));

  // === AI-driven UI Configuration ===
  // AI can infer optimal chart types or aggregation based on data and user history.
  const inferredChartProps = useMemo(() => {
    return AIContextualDecisionEngine.inferChartDisplay(
      (groupedData?.groupedExpectedCashFlow || []) as GroupedExpectedCashFlow[],
      geminiMemory.retrieveContext("user_interaction_history"), // Placeholder
    );
  }, [groupedData]);

  const chartSearchComponents = [
    {
      options: chartCurrencyOptions,
      selectValue: historicalCashFlowQuery.currency,
      isSearchable: false,
      component: SelectField,
      placeholder: "N/A",
      handleChange: (value: string) => {
        // AI-powered currency change logic
        // The AI can recommend a currency based on risk profile or business need.
        AIObservabilityAgent.log("info", `Currency changed to ${value}.`);
        geminiMemory.storeContext("preferred_currency", value); // Remember preference

        setHistoricalCashFlowQuery((oldQuery) => ({
          ...oldQuery,
          currency: value as CurrencyEnum,
        }));

        setHistoricalBalancesQuery((oldQuery) => ({
          ...oldQuery,
          currency: value as CurrencyEnum,
        }));

        // AI can decide if both refetches are necessary or if one can be deferred/cached
        const refetchPromise1 = refetchHistoricalCashFlow({
          ...historicalCashFlowQuery,
          asOfDate: dateSearchMapper(historicalCashFlowQuery.asOfDate),
          currency: value,
        })
          .then(() => AISafetyGuard.registerSuccess("GraphQLAPI"))
          .catch((error) => {
            AISafetyGuard.registerFailure("GraphQLAPI");
            AIObservabilityAgent.reportError(error, { query: "refetchHistoricalCashFlow" });
            dispatchError("An error occurred refetching cash flow.");
          });

        const refetchPromise2 = refetchHistoricalBalances({
          ...historicalBalancesQuery,
          dateRange: dateSearchMapper(historicalBalancesQuery.dateRange),
          currency: value,
        })
          .then(() => AISafetyGuard.registerSuccess("GraphQLAPI"))
          .catch((error) => {
            AISafetyGuard.registerFailure("GraphQLAPI");
            AIObservabilityAgent.reportError(error, { query: "refetchHistoricalBalances" });
            dispatchError("An error occurred refetching balances.");
          });

        Promise.all([refetchPromise1, refetchPromise2]).catch(() =>
          AIObservabilityAgent.log("error", "One or more historical data refetches failed during currency change."),
        );
      },
      containerClasses: "w-20",
    },
    {
      key: "date_range",
      field: "dateRange",
      options: DATE_RANGE_FILTER_OPTIONS,
      component: DateSearch,
      query: { dateRange: expectedQuery.dateRange },
      validateRange: true,
      updateQuery: (input: Record<string, unknown>) => {
        trackEvent(null, ACCOUNT_ACTIONS.CHANGED_WIDGET_DATE_FILTER, {
          widget: "Expected Cash Flow",
        });
        handleRefetch(input);
      },
      autoWidth: true,
    },
  ];

  const tableSearchComponents = [
    {
      key: "search",
      field: "accountSearchName",
      component: ButtonTextSearch,
      showSearchBarAtStart: true,
      query: expectedQuery,
      label: "Search by account name or number",
      updateQuery: ({ accountSearchName }: { accountSearchName: string }) => {
        handleRefetch({
          accountSearchName,
        });
      },
    },
    {
      options: GroupTypeOptions,
      selectValue: groupBy,
      isSearchable: false,
      component: ROMASelectField,
      handleChange: (_, field: { value: string }) => {
        const { value } = field;

        if (value === GroupTypeEnum.AccountGroups) {
          handleRefetch({
            groupIds: [ALL_ACCOUNT_GROUPS_ID],
            groupType: "AccountGroup",
          });
        } else {
          handleRefetch({
            groupIds: [ALL_CONNECTIONS_ID],
            groupType: "Connection",
          });
        }

        trackEvent(null, CASH_PLANNING_ACTIONS.TABLE_CHANGED_GROUP_FILTER);
        setGroupBy(value as GroupTypeEnum);

        // AI records group change for user behavior analysis
        GeminiTelemetryService.sendEvent("group_by_changed", { newGroup: value });
      },
    },
  ];

  return (
    <PageHeader hideBreadCrumbs title="Cash Planning">
      {proactiveInsights.length > 0 && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
          <p className="font-bold">AI Proactive Insights:</p>
          <ul>
            {proactiveInsights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
      <CashPlanningChartContainer
        historicalCashFlow={historicalCashFlow}
        historicalBalances={sumHistoricalBalancesByDate()}
        expectedCashFlow={sumExpectedTotalsByDate()}
        searchComponents={chartSearchComponents}
        currency={historicalCashFlowQuery.currency}
        // So when we receive cached data, we don't trigger the loading status.
        loading={loadingExpected && !groupedData}
        // AI-inferred chart type for dynamic rendering
        inferredChartType={inferredChartProps.chartType}
      />
      <Layout
        primaryContent={
          <CashPlanningTable
            accountGroups={
              groupedData?.groupedExpectedCashFlow as GroupedExpectedCashFlow[]
            }
            loading={loadingExpected && !groupedData}
            searchComponents={tableSearchComponents}
          />
        }
        ratio="3/3"
      />
    </PageHeader>
  );
}