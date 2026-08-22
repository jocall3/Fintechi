// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React from "react";
import {
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  Legend,
} from "recharts";
import moment from "moment";
import {
  CustomTooltip,
  GenericJoinedDataType,
  LinearGradient,
  intervalFrequency,
  renderLegend,
}
  from "../CashPlanningUtils";
import abbreviateAmount from "../../../../common/utilities/abbreviateAmount";
import {
  XAxisProps,
  YAxisProps,
} from "../../../../common/styles/cash_management/charts";

// --- Gemini AI-Powered Transformation Protocol: Core Intelligence Layer ---

/**
 * @typedef {Object} GeminiMemoryEntry
 * @property {string} timestamp - ISO timestamp of the event.
 * @property {string} eventType - Type of event (e.g., 'render', 'anomaly_detected', 'insight_generated').
 * @property {any} payload - Detailed data associated with the event.
 */

/**
 * GeminiIntelligenceCore: A self-aware, adaptive intelligence hub for the file.
 * Manages operational memory, contextual awareness, and drives adaptive behaviors.
 * This class simulates a neural extension, capturing runtime intelligence.
 * It's designed to be a living endpoint, interfacing with simulated external services dynamically.
 */
export class GeminiIntelligenceCore {
  private memory: any[] = []; // Stores operational memory and learning
  private context: { [key: string]: any } = {}; // Stores current operational context
  private knowledgeBase: { [key: string]: any } = {}; // Stores learned patterns or configuration

  constructor() {
    this.initKnowledgeBase();
  }

  private initKnowledgeBase() {
    // Simulate initial learning or default configurations for adaptive behavior
    this.knowledgeBase = {
      anomalyThreshold: 0.15, // 15% deviation for anomaly detection
      confidenceMetric: "endingBalance", // Data key to focus confidence analysis on
      analysisModes: {
        basic: { detailLevel: "low", insightVerbosity: "minimal", complianceStrictness: "lenient" },
        pro: { detailLevel: "medium", insightVerbosity: "standard", complianceStrictness: "standard" },
        expert: { detailLevel: "high", insightVerbosity: "verbose", complianceStrictness: "strict" },
      },
      // Simulate elastic APIs for dynamic service discovery - here, 'features' are dynamically enabled/disabled
      featureFlags: {
        dataImputation: true, // Can be dynamically turned on/off by an external system
        realTimeAlerts: true,
      }
    };
    this.logEvent("system_init", { message: "Gemini Core initialized." });
  }

  /**
   * Logs an event to the internal memory, simulating a telemetry pipeline.
   * This is a neural extension that captures component-level events for self-analysis.
   * @param eventType - The type of event.
   * @param payload - The data payload for the event.
   */
  logEvent(eventType: string, payload: any) {
    const entry = {
      timestamp: moment().toISOString(),
      eventType,
      payload,
    };
    this.memory.push(entry);
    // In a commercial deployment, this would push to an external event broker (e.g., Kafka, AWS Kinesis)
    // console.log(`[Gemini-Event-Broker] ${eventType}:`, payload);
  }

  /**
   * Updates the operational context, allowing for context-aware decision making.
   * This facilitates prompt-based learning, as context drives adaptation.
   * @param key - The context key.
   * @param value - The context value.
   */
  updateContext(key: string, value: any) {
    this.context[key] = value;
    this.logEvent("context_update", { key, value });
  }

  /**
   * Retrieves a value from the knowledge base, adaptively adjusting if necessary
   * based on the current operational context (e.g., analysis mode).
   * @param key - The knowledge base key.
   * @param defaultValue - Default value if not found.
   * @returns The value from the knowledge base.
   */
  getKnowledge(key: string, defaultValue?: any): any {
    // Simulate adaptive learning: knowledge can be updated dynamically based on operational feedback
    if (this.context.analysisMode && this.knowledgeBase.analysisModes[this.context.analysisMode]) {
      const modeSpecificValue = this.knowledgeBase.analysisModes[this.context.analysisMode][key];
      if (modeSpecificValue !== undefined) return modeSpecificValue;
    }
    return this.knowledgeBase[key] !== undefined ? this.knowledgeBase[key] : defaultValue;
  }

  /**
   * Provides current operational metrics, simulating an observability endpoint.
   * This allows the file to be aware of its own performance and usage.
   */
  getOperationalMetrics() {
    const renderCounts = this.memory.filter(e => e.eventType === "chart_render_complete").length;
    const anomalyCounts = this.memory.filter(e => e.eventType === "anomaly_detected").length;
    const insightCounts = this.memory.filter(e => e.eventType === "insight_generated").length;
    return {
      totalEvents: this.memory.length,
      renderCounts,
      anomalyCounts,
      insightCounts,
      lastUpdated: moment().toISOString(),
      currentContext: { ...this.context }
    };
  }

  /**
   * Simulates a 'self-healing' mechanism by suggesting optimal configurations
   * or data recovery strategies based on memory and context.
   * This is a self-maintaining aspect, adapting to observed issues.
   * @param issues - A list of identified issues.
   * @returns Suggested actions.
   */
  suggestSelfHealingActions(issues: string[]): string[] {
    this.logEvent("self_healing_query", { issues });
    const actions: string[] = [];
    if (issues.includes("data_gaps") && this.getKnowledge("dataImputation", false)) {
      actions.push("Consider enabling data imputation for missing projected balances.");
    }
    if (issues.includes("high_volatility") && this.context.analysisMode === "pro") {
      actions.push("Suggest adjusting chart interval for better trend visibility.");
    }
    if (issues.includes("compliance_breach")) {
        actions.push("Review data source for PII and integrity. Consult compliance officer.");
    }
    return actions;
  }
}

// Global instance of GeminiIntelligenceCore for this file's universe
// This instance represents the living intelligence tied to this file.
export const geminiCore = new GeminiIntelligenceCore();

/**
 * DataAnomaliesDetector: A micro-intelligence for identifying unusual patterns.
 * Embodies prompt-based reasoning by using knowledge base thresholds and adapting window sizes.
 */
class DataAnomaliesDetector {
  private core: GeminiIntelligenceCore;

  constructor(core: GeminiIntelligenceCore) {
    this.core = core;
  }

  /**
   * Detects significant deviations in the data, adapting its sensitivity based on
   * context (e.g., analysis mode via anomalyThreshold).
   * @param data - The chart data.
   * @param dataKey - The key to analyze (e.g., "endingBalance").
   * @returns An array of detected anomalies with their details.
   */
  detect(data: GenericJoinedDataType[], dataKey: string = "endingBalance"): { index: number; date: string; value: number; deviation: number; severity: "low" | "medium" | "high"; type: string }[] {
    if (data.length < 5) {
      this.core.logEvent("anomaly_detection_skipped", { reason: "insufficient_data", count: data.length });
      return []; // Not enough data for meaningful analysis
    }

    const anomalies: any[] = [];
    const values = data.map(d => d[dataKey] as number).filter(v => v !== undefined && v !== null);

    if (values.length < 5) {
      this.core.logEvent("anomaly_detection_skipped", { reason: "insufficient_valid_values", count: values.length });
      return [];
    }

    const calculateMean = (arr: number[]) => arr.reduce((sum, v) => sum + v, 0) / arr.length;
    // const calculateStdDev = (arr: number[], mean: number) => Math.sqrt(arr.map(v => Math.pow(v - mean, 2)).reduce((sum, v) => sum + v, 0) / arr.length);

    // Adaptive window size for moving average based on data length and detail level
    const detailLevel = this.core.getKnowledge("detailLevel", "medium");
    let windowSize = Math.max(3, Math.floor(values.length / (detailLevel === "high" ? 8 : detailLevel === "low" ? 15 : 10)));
    windowSize = Math.min(windowSize, values.length -1); // Ensure window size is not larger than data

    for (let i = windowSize; i < data.length; i++) {
        const currentVal = data[i][dataKey] as number;
        if (currentVal === undefined || currentVal === null) continue;

        const precedingValues = data.slice(Math.max(0, i - windowSize), i).map(d => d[dataKey] as number).filter(v => v !== undefined && v !== null);
        if (precedingValues.length === 0) continue;

        const mean = calculateMean(precedingValues);
        // const stdDev = calculateStdDev(precedingValues, mean); // Not used in current simplified deviation check

        const anomalyThreshold = this.core.getKnowledge("anomalyThreshold", 0.15); // Dynamic threshold from knowledge base
        
        const deviation = Math.abs((currentVal - mean) / (mean === 0 ? 1 : mean)); // Percentage deviation, guard against division by zero
        
        if (deviation > anomalyThreshold) {
            let severity: "low" | "medium" | "high" = "low";
            if (deviation > anomalyThreshold * 2) severity = "medium";
            if (deviation > anomalyThreshold * 3) severity = "high";

            anomalies.push({
                index: i,
                date: data[i].date,
                value: currentVal,
                deviation: deviation,
                severity,
                type: currentVal > mean ? "spike" : "drop"
            });
            this.core.logEvent("anomaly_detected", { date: data[i].date, value: currentVal, deviation, severity, type: "cash_flow_anomaly" });
        }
    }
    return anomalies;
  }
}

/**
 * ContextualInsightGenerator: Converts detected patterns into human-readable insights.
 * Infuses prompt-based learning by adapting insight verbosity based on context.
 * This is a neural extension providing generative, adaptive responses.
 */
class ContextualInsightGenerator {
  private core: GeminiIntelligenceCore;

  constructor(core: GeminiIntelligenceCore) {
    this.core = core;
  }

  /**
   * Generates actionable insights based on anomalies and overall data trends.
   * The verbosity and depth of insights adapt to the 'insightVerbosity' context.
   * @param data - The full dataset.
   * @param anomalies - Detected anomalies.
   * @returns An array of insight strings.
   */
  generate(data: GenericJoinedDataType[], anomalies: any[]): string[] {
    const insights: string[] = [];
    const insightVerbosity = this.core.getKnowledge("insightVerbosity", "standard");
    const currency = this.core.context.currency || "$";

    if (anomalies.length > 0) {
      const highSeverityAnomalies = anomalies.filter(a => a.severity === "high");
      if (highSeverityAnomalies.length > 0) {
        const firstHighAnomaly = highSeverityAnomalies[0];
        insights.push(`**Critical Alert:** Significant cash flow ${firstHighAnomaly.type} detected around ${moment(firstHighAnomaly.date).format("M/D")}! Deviation of ${Math.round(firstHighAnomaly.deviation * 100)}%. Immediate review recommended.`);
        if (this.core.getKnowledge("featureFlags.realTimeAlerts", false)) {
            // Simulate sending a real-time alert to an external system
            this.core.logEvent("real_time_alert_triggered", { anomaly: firstHighAnomaly, recipient: "financial_ops" });
        }
      } else {
        insights.push(`**Warning:** ${anomalies.length} potential cash flow anomalies detected. Review chart for unusual patterns.`);
      }
    }

    // General trend analysis
    if (data.length > 1) {
      const firstValidBalanceIndex = data.findIndex(d => d.endingBalance !== undefined && d.endingBalance !== null);
      const lastValidBalanceIndex = data.findLastIndex(d => d.endingBalance !== undefined && d.endingBalance !== null);

      if (firstValidBalanceIndex !== -1 && lastValidBalanceIndex !== -1 && firstValidBalanceIndex !== lastValidBalanceIndex) {
        const firstBalance = data[firstValidBalanceIndex]?.endingBalance || 0;
        const lastBalance = data[lastValidBalanceIndex]?.endingBalance || 0;
        const balanceChange = lastBalance - firstBalance;

        if (insightVerbosity === "verbose") {
          if (balanceChange > 0) {
            insights.push(`Overall projected trend: ${abbreviateAmount(balanceChange / 100.0, currency)} increase across the period.`);
          } else if (balanceChange < 0) {
            insights.push(`Overall projected trend: ${abbreviateAmount(Math.abs(balanceChange) / 100.0, currency)} decrease across the period.`);
          } else {
            insights.push("Overall projected trend: relatively stable cash balance.");
          }
        }
      }
    }

    if (insights.length > 0) {
        this.core.logEvent("insight_generated", { insights, verbosity: insightVerbosity });
    } else {
        insights.push("No significant anomalies or critical insights detected. Cash flow appears stable.");
    }
    
    return insights;
  }
}

/**
 * ComplianceEngine: A simulated commercial-grade module for data compliance checks.
 * Acts as a circuit-breaker, preventing rendering if critical compliance issues are found.
 * The strictness of checks adapts based on 'complianceStrictness' context.
 */
class ComplianceEngine {
    private core: GeminiIntelligenceCore;

    constructor(core: GeminiIntelligenceCore) {
        this.core = core;
    }

    /**
     * Performs a simulated data compliance check. This is an embedded enterprise logic layer.
     * @param data - The data to check.
     * @returns True if compliant, false otherwise.
     */
    check(data: GenericJoinedDataType[]): { compliant: boolean; issues: string[] } {
        const issues: string[] = [];
        let compliant = true;
        const complianceStrictness = this.core.getKnowledge("complianceStrictness", "standard");

        // Simulate a PII check (e.g., no sensitive account numbers in generic data structure)
        if (complianceStrictness === "strict") {
            data.forEach((item, index) => {
                // Placeholder for more advanced PII detection
                if (item.id && String(item.id).length > 10 && !isNaN(Number(item.id))) { 
                    issues.push(`[PII Risk] Detected potential sensitive ID in data item at index ${index}.`);
                    compliant = false;
                }
                if (item.description && /(SSN|ACCOUNT|IBAN|SWIFT)/i.test(item.description)) { 
                    issues.push(`[PII Risk] Sensitive keyword found in description at index ${index}.`);
                    compliant = false;
                }
            });
        }

        // Simulate data integrity check: ensure all required fields exist for core functionality
        const hasUndefinedBalance = data.some(item => item.endingBalance === undefined || item.endingBalance === null);
        if (hasUndefinedBalance && data.length > 0) {
            if (complianceStrictness === "strict" || complianceStrictness === "standard") {
                issues.push("Critical data points (endingBalance) are missing for some entries. This may affect chart accuracy.");
                compliant = false; // More strict for higher analysis modes
            } else if (complianceStrictness === "lenient" && hasUndefinedBalance) {
                issues.push("Warning: Some endingBalance data points are missing. Chart may show gaps.");
                // Not blocking, just a warning in lenient mode
            }
        }

        // Simulate data volume check for commercial viability / performance
        if (data.length > 500 && complianceStrictness === "strict") {
            issues.push("Data volume exceeds optimal performance thresholds for real-time rendering. Consider aggregation.");
        }

        if (!compliant) {
            this.core.logEvent("compliance_breach", { issues, strictness: complianceStrictness });
            // This is where a real circuit-breaker would trip, potentially throwing an error or rendering a fallback UI.
            console.error("ComplianceEngine: Data failed compliance checks.", issues);
        } else {
            this.core.logEvent("compliance_check_passed", { count: data.length, strictness: complianceStrictness });
        }

        return { compliant, issues };
    }
}

/**
 * DataImputationEngine: Self-healing mechanism to fill missing data points.
 * Operates autonomously if enabled, adapting to fill gaps for smoother visualization.
 */
class DataImputationEngine {
    private core: GeminiIntelligenceCore;

    constructor(core: GeminiIntelligenceCore) {
        this.core = core;
    }

    /**
     * Attempts to impute missing `endingBalance` values using a simple linear interpolation.
     * This is an adaptive, self-healing mechanism.
     * @param data - The original data.
     * @returns Data with imputed values.
     */
    impute(data: GenericJoinedDataType[]): GenericJoinedDataType[] {
        if (!this.core.getKnowledge("featureFlags.dataImputation", false)) {
            return data; // Imputation feature is disabled
        }

        const imputedData = [...data];
        for (let i = 0; i < imputedData.length; i++) {
            if (imputedData[i].endingBalance === undefined || imputedData[i].endingBalance === null) {
                // Find nearest preceding and succeeding valid points
                let prevIndex = -1;
                for (let j = i - 1; j >= 0; j--) {
                    if (imputedData[j].endingBalance !== undefined && imputedData[j].endingBalance !== null) {
                        prevIndex = j;
                        break;
                    }
                }

                let nextIndex = -1;
                for (let j = i + 1; j < imputedData.length; j++) {
                    if (imputedData[j].endingBalance !== undefined && imputedData[j].endingBalance !== null) {
                        nextIndex = j;
                        break;
                    }
                }

                if (prevIndex !== -1 && nextIndex !== -1) {
                    const prevValue = imputedData[prevIndex].endingBalance as number;
                    const nextValue = imputedData[nextIndex].endingBalance as number;
                    const interpolatedValue = prevValue + ((nextValue - prevValue) / (nextIndex - prevIndex)) * (i - prevIndex);
                    imputedData[i].endingBalance = interpolatedValue;
                    imputedData[i].isImputed = true; // Mark as imputed
                    this.core.logEvent("data_imputed", { date: imputedData[i].date, originalIndex: i, value: interpolatedValue });
                } else if (prevIndex !== -1) {
                    // If only preceding available, use last known value
                    imputedData[i].endingBalance = imputedData[prevIndex].endingBalance;
                    imputedData[i].isImputed = true;
                    this.core.logEvent("data_imputed_last_known", { date: imputedData[i].date, originalIndex: i, value: imputedData[i].endingBalance });
                }
                // If only next available, or neither, leave as undefined (cannot impute reliably)
            }
        }
        return imputedData;
    }
}

/**
 * AdaptiveChartSettings: Dynamically adjusts chart parameters.
 * Exhibits self-adapting behavior based on data density, detected anomalies, and user context.
 */
class AdaptiveChartSettings {
    private core: GeminiIntelligenceCore;

    constructor(core: GeminiIntelligenceCore) {
        this.core = core;
    }

    /**
     * Determines optimal XAxis interval frequency based on data length and context.
     * This ensures the chart adapts its presentation for clarity.
     * @param dataLength - Number of data points.
     * @param anomaliesCount - Number of anomalies detected.
     * @returns Optimal interval frequency.
     */
    getIntervalFrequency(dataLength: number, anomaliesCount: number): number | "preserveStart" | "preserveEnd" | "preserveStartEnd" {
        // Base interval from existing utility
        let calculatedInterval = intervalFrequency(dataLength);

        // Adaptive logic: if many anomalies and high detail mode, show more detail (smaller interval)
        const detailLevel = this.core.getKnowledge("detailLevel", "medium");
        if (anomaliesCount > Math.max(3, dataLength * 0.03) && detailLevel === "high") { 
            if (calculatedInterval === "preserveStartEnd" || typeof calculatedInterval === 'number') {
                return Math.max(1, Math.floor(dataLength / 25)); // Try to show more points for detailed anomaly inspection
            }
        }
        
        // Context-aware detail level adjustment
        if (detailLevel === "high") {
            if (calculatedInterval === "preserveStartEnd") return Math.max(1, Math.floor(dataLength / 20));
            if (typeof calculatedInterval === 'number') return Math.max(1, Math.floor(calculatedInterval / 1.5));
        } else if (detailLevel === "low") {
            if (calculatedInterval === "preserveStartEnd") return Math.max(1, Math.floor(dataLength / 10));
            if (typeof calculatedInterval === 'number') return Math.max(1, Math.floor(calculatedInterval * 1.5));
        }

        return calculatedInterval;
    }

    /**
     * Adjusts the gradient offset dynamically based on data health or projection confidence.
     * This provides a visual cue that adapts to the data's integrity.
     * @param historicalDataPointsLength - Number of historical data points.
     * @param totalDataLength - Total number of data points.
     * @param missingProjectedDataCount - Count of missing projected data points.
     * @param hasImputedData - True if data points were imputed.
     * @returns String representation of the gradient offset.
     */
    getDynamicGradientOffset(historicalDataPointsLength: number, totalDataLength: number, missingProjectedDataCount: number, hasImputedData: boolean): string {
        const baseOffset = (historicalDataPointsLength - 1) / (totalDataLength - 1);
        
        // If many projected data points are missing, visually indicate lower confidence by shifting the gradient
        // or if data was imputed, apply a small penalty.
        let confidencePenalty = 0;
        if (missingProjectedDataCount > 0) {
            confidencePenalty = (missingProjectedDataCount / (totalDataLength - historicalDataPointsLength || 1)) * 0.1; // Max 10% shift
        } else if (hasImputedData) {
            confidencePenalty = 0.05; // Small penalty for imputation
        }
        
        let dynamicOffset = baseOffset - confidencePenalty;
        dynamicOffset = Math.max(0, Math.min(1, dynamicOffset)); // Ensure it stays within [0, 1]

        this.core.logEvent("gradient_offset_adjusted", { base: baseOffset, dynamic: dynamicOffset, penalty: confidencePenalty, hasImputedData });
        return String(dynamicOffset);
    }
}


// --- End Gemini AI-Powered Transformation Protocol: Core Intelligence Layer ---

interface Props {
  data: GenericJoinedDataType[];
  currency: string;
  // New prop for AI analysis mode, simulating prompt-driven learning
  analysisMode?: "basic" | "pro" | "expert"; 
  // Optional prop to enable/disable specific AI features (e.g., for performance or compliance reasons)
  enableAIInsights?: boolean;
}

const LEGEND_KEYS = {
  Balance: {
    stroke: "white",
    fill: "#7E9983",
  },
  "Projected Balance": {
    stroke: "white",
    fill: "#7E998399",
  },
};

// Initialize the micro-intelligences using the global Gemini core
const anomaliesDetector = new DataAnomaliesDetector(geminiCore);
const insightGenerator = new ContextualInsightGenerator(geminiCore);
const complianceEngine = new ComplianceEngine(geminiCore);
const adaptiveChartSettings = new AdaptiveChartSettings(geminiCore);
const imputationEngine = new DataImputationEngine(geminiCore);

export default function ExpectedBalanceAreaChart({ data, currency, analysisMode = "pro", enableAIInsights = true }: Props) {
  // Update Gemini Core's context for adaptive decision-making
  geminiCore.updateContext("analysisMode", analysisMode);
  geminiCore.updateContext("currency", currency);
  geminiCore.updateContext("enableAIInsights", enableAIInsights);

  const [processedData, setProcessedData] = React.useState<GenericJoinedDataType[]>(data);
  const [anomalies, setAnomalies] = React.useState<ReturnType<typeof anomaliesDetector.detect>>([]);
  const [insights, setInsights] = React.useState<string[]>([]);
  const [isCompliant, setIsCompliant] = React.useState(true);
  const [complianceIssues, setComplianceIssues] = React.useState<string[]>([]);
  const [hasImputedData, setHasImputedData] = React.useState(false);
  const [chartRenderKey, setChartRenderKey] = React.useState(0); // Used to force chart re-render if settings change

  React.useEffect(() => {
    geminiCore.logEvent("chart_render_start", { dataLength: data.length, currency, analysisMode });

    let currentData = [...data];
    let currentHasImputedData = false;
    let currentComplianceIssues: string[] = [];
    let currentIsCompliant = true;

    // Step 1: Compliance Check (Commercial-grade circuit-breaking logic)
    const { compliant, issues } = complianceEngine.check(currentData);
    currentIsCompliant = compliant;
    currentComplianceIssues = issues;

    setIsCompliant(currentIsCompliant);
    setComplianceIssues(currentComplianceIssues);

    if (!currentIsCompliant && geminiCore.getKnowledge("complianceStrictness") !== "lenient") { // Block rendering for severe compliance issues in strict modes
      geminiCore.logEvent("render_blocked_by_compliance", { issues: currentComplianceIssues });
      // Suggest self-healing actions if rendering is blocked
      const healingActions = geminiCore.suggestSelfHealingActions(currentComplianceIssues);
      setInsights(prev => [...prev, ...healingActions.map(s => `[Compliance Blocked]: ${s}`)]);
      setProcessedData([]); // Clear data to prevent rendering non-compliant chart
      return; // Stop processing and rendering
    }
    
    // Step 2: Self-Healing - Data Imputation if enabled and data gaps exist
    if (geminiCore.getKnowledge("featureFlags.dataImputation", false) && currentComplianceIssues.includes("Critical data points (endingBalance) are missing...")) {
        const imputed = imputationEngine.impute(currentData);
        if (imputed.some(d => (d as any).isImputed)) {
            currentData = imputed;
            currentHasImputedData = true;
            geminiCore.logEvent("data_self_healed_imputation", { originalDataLength: data.length, imputedDataLength: imputed.length });
        }
    }
    setHasImputedData(currentHasImputedData);
    setProcessedData(currentData); // Update data after imputation

    // Step 3: Anomaly Detection & Insight Generation
    if (enableAIInsights && currentData.length > 0) {
      const detectedAnomalies = anomaliesDetector.detect(currentData, geminiCore.getKnowledge("confidenceMetric", "endingBalance"));
      setAnomalies(detectedAnomalies);
      const generatedInsights = insightGenerator.generate(currentData, detectedAnomalies);
      
      // Combine compliance issues (if any, not blocking) with general insights
      let combinedInsights = [...currentComplianceIssues.filter(issue => !currentIsCompliant && geminiCore.getKnowledge("complianceStrictness") === "lenient")];
      combinedInsights.push(...generatedInsights);

      setInsights(combinedInsights);

      // Trigger self-healing suggestions based on new insights/anomalies
      if (detectedAnomalies.length > 0 || currentComplianceIssues.length > 0) {
          const problemTypes = detectedAnomalies.map(a => "high_volatility")
                                .concat(currentComplianceIssues.includes("Critical data points (endingBalance) are missing...") ? ["data_gaps"] : [])
                                .concat(!currentIsCompliant ? ["compliance_breach"] : []);
          const healingSuggestions = geminiCore.suggestSelfHealingActions(problemTypes);
          if (healingSuggestions.length > 0) {
              setInsights(prev => [...prev, ...healingSuggestions.map(s => `[Self-Healing Suggestion]: ${s}`)]);
          }
      }
    } else {
        setAnomalies([]);
        setInsights(["AI insights are currently disabled or data is insufficient."]);
    }

    // Force re-render if adaptive settings might have changed (e.g. interval)
    setChartRenderKey(prev => prev + 1);

    geminiCore.logEvent("chart_render_complete", { dataLength: currentData.length });
  }, [data, currency, analysisMode, enableAIInsights]); // Dependencies for re-evaluation

  const historicalDataPoints = processedData.filter(
    (obj) => obj.__typename === "HistoricalCashFlow",
  );

  const missingProjectedDataCount = processedData.filter(
    (obj) => obj.__typename !== "HistoricalCashFlow" && (obj.endingBalance === undefined || obj.endingBalance === null),
  ).length;

  // Use adaptive gradient offset, considering imputed data for visual feedback
  const gradientOffset = () => {
    return adaptiveChartSettings.getDynamicGradientOffset(
        historicalDataPoints.length,
        processedData.length,
        missingProjectedDataCount,
        hasImputedData
    );
  };

  // If compliance engine blocked rendering, show a dedicated message
  if (!isCompliant && geminiCore.getKnowledge("complianceStrictness") !== "lenient") {
      return (
          <div style={{ padding: '20px', color: '#B00020', backgroundColor: '#FFEBEE', border: '1px solid #B00020', borderRadius: '5px', margin: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Chart Rendering Blocked by Gemini Compliance Engine!</h3>
              <p>Due to severe data compliance violations, this chart cannot be rendered in '{geminiCore.getKnowledge("complianceStrictness")}' mode.</p>
              <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
                  {complianceIssues.map((issue, i) => <li key={i}>{issue}</li>)}
              </ul>
              {insights.length > 0 && (
                <div style={{ fontSize: '0.9em', color: '#555' }}>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Gemini Self-Healing Suggestions:</p>
                    <ul style={{ paddingLeft: '20px', margin: '0' }}>
                        {insights.map((insight, i) => <li key={`insight-${i}`} dangerouslySetInnerHTML={{ __html: insight }} />)}
                    </ul>
                </div>
              )}
          </div>
      );
  }

  // Adaptive XAxis interval calculation
  const adaptiveXAxisInterval = adaptiveChartSettings.getIntervalFrequency(processedData.length, anomalies.length);

  return (
    <div className="gemini-chart-container">
        {insights.length > 0 && enableAIInsights && (
            <div
                className="gemini-insights-panel"
                style={{
                    padding: '12px',
                    marginBottom: '15px',
                    backgroundColor: '#e8f5e9', // Light green background for insights
                    borderLeft: '4px solid #4CAF50', // Green border
                    borderRadius: '4px',
                    fontSize: '0.92em',
                    lineHeight: '1.5',
                    color: '#388e3c' // Darker green text
                }}
            >
                {insights.map((insight, i) => (
                    <p key={i} style={{ margin: '0 0 8px 0' }} dangerouslySetInnerHTML={{ __html: insight }} />
                ))}
            </div>
        )}
        <ResponsiveContainer width="100%" height={300} key={chartRenderKey}> {/* Key to force re-render */}
            <AreaChart data={processedData} margin={{ right: 15 }}>
                <defs>
                <LinearGradient offset={gradientOffset()} />
                </defs>
                <XAxis
                dataKey="date"
                interval={adaptiveXAxisInterval} // Use adaptive interval
                tickFormatter={(date: string) => moment(date).format("M/D")}
                {...XAxisProps}
                />
                <YAxis
                tickFormatter={(amount: number) =>
                    abbreviateAmount(amount / 100.0, currency)
                }
                {...YAxisProps}
                />
                <Tooltip
                content={
                    <CustomTooltip
                    mappings={{
                        "Ending Balance": "endingBalance",
                    }}
                    currency={currency}
                    // Pass AI context to tooltip for richer user experience
                    extraData={{ anomalies, insights, analysisMode, hasImputedData }} 
                    />
                }
                />
                <Area
                dataKey="endingBalance"
                stroke="#7E9983"
                fillOpacity={1}
                fill="url(#fillColor)"
                dot
                />
                <Legend content={renderLegend(LEGEND_KEYS, 15, 5)} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
  );
}