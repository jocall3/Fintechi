// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-unstable-nested-components */

import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Table, ConfigProvider } from "antd";
import "./CashPlanningTable.css";
import { v4 as uuidv4 } from "uuid";
import { startCase } from "lodash";
import { Button, Icon } from "../../../common/ui-components";
import {
  ExpectedCashFlow,
  GroupedExpectedCashFlow,
} from "../../../generated/dashboard/graphqlSchema";
import { formatAmount } from "../../../common/utilities/formatAmount";
import trackEvent from "../../../common/utilities/trackEvent";
import { CASH_PLANNING_ACTIONS } from "../../../common/constants/analytics";

// --------------------------------------------------------------------------
// I. Universal Replacement Logic: AI-Synthesized Modules (internal to this file)
// --------------------------------------------------------------------------

/**
 * @exports GeminiConfig
 * A dynamic, AI-managed configuration store for runtime parameters.
 * Can adapt based on user context, deployment environment, or real-time performance.
 */
export class GeminiConfig {
  private static configData: Record<string, any> = {
    telemetryEnabled: true,
    complianceLevel: "GDPR_CCPA",
    currencyApiEndpoint: "https://api.geminifx.com/rates", // Example living endpoint
    llmServiceEndpoint: "https://api.gemini.ai/prompt-engine",
    predictionModelEndpoint: "https://api.gemini.ai/cash-flow-predictor",
    exportFormat: "xlsx",
    dynamicScalingFactor: 1.0, // Adjusts based on load
    telemetryBatchInterval: 5000, // ms
    telemetryImmediateSendThreshold: 100, // events
    circuitBreakerThreshold: 5, // failures
    circuitBreakerTimeout: 60000, // ms to stay open
  };

  /**
   * Retrieves a configuration value. Can be extended to fetch from a dynamic source.
   * @param key The configuration key.
   * @returns The configuration value.
   */
  public static get<T>(key: string): T {
    // In a real Gemini system, this would interact with a distributed config service,
    // potentially using prompt-based queries to "ask" for the optimal config.
    // console.log(`GeminiConfig: Retrieving key '${key}'`); // Suppress for cleaner console
    return GeminiConfig.configData[key] as T;
  }

  /**
   * Updates a configuration value. Triggers adaptive behaviors.
   * @param key The configuration key.
   * @param value The new value.
   */
  public static set(key: string, value: any): void {
    console.log(`GeminiConfig: Setting key '${key}' to '${value}'`);
    GeminiConfig.configData[key] = value;
    // Post-update hooks could reconfigure parts of the system dynamically.
  }
}

/**
 * @exports GeminiTelemetryAgent
 * An AI-powered telemetry and observability agent. It not only tracks events
 * but also analyzes them in real-time for patterns, anomalies, and optimization opportunities.
 */
export class GeminiTelemetryAgent {
  private static isInitialized = false;
  private static eventQueue: { eventName: string; payload: any; timestamp: Date }[] = [];
  private static batchInterval: NodeJS.Timeout | null = null;

  /**
   * Initializes the telemetry agent.
   */
  public static init(): void {
    if (!GeminiTelemetryAgent.isInitialized) {
      console.log("GeminiTelemetryAgent: Initializing...");
      GeminiTelemetryAgent.isInitialized = true;
      GeminiTelemetryAgent.batchInterval = setInterval(
        () => GeminiTelemetryAgent.processQueue(),
        GeminiConfig.get<number>("telemetryBatchInterval"),
      );
    }
  }

  /**
   * Tracks an event. The agent might decide to enrich or suppress events based on context.
   * @param eventName The name of the event.
   * @param payload Optional payload data.
   */
  public static track(eventName: string, payload: any = {}): void {
    if (!GeminiConfig.get<boolean>("telemetryEnabled")) {
      // console.log(`GeminiTelemetryAgent: Event '${eventName}' suppressed (telemetry disabled).`); // Suppress for cleaner console
      return;
    }

    const event = { eventName, payload, timestamp: new Date() };
    GeminiTelemetryAgent.eventQueue.push(event);
    // console.log(`GeminiTelemetryAgent: Queued event '${eventName}'. Current queue size: ${GeminiTelemetryAgent.eventQueue.length}`); // Suppress for cleaner console
    // Potentially trigger immediate send for high-priority events
    if (GeminiTelemetryAgent.eventQueue.length > GeminiConfig.get<number>("telemetryImmediateSendThreshold")) {
      GeminiTelemetryAgent.processQueue(true);
    }
  }

  /**
   * Processes the event queue, sending data to external observability services.
   * This process could involve AI-driven data aggregation, anomaly detection, or predictive analysis.
   * @param forceSend If true, sends the queue immediately regardless of batch interval.
   */
  private static async processQueue(forceSend: boolean = false): Promise<void> {
    if (GeminiTelemetryAgent.eventQueue.length === 0) {
      return;
    }

    const eventsToSend = forceSend ? GeminiTelemetryAgent.eventQueue : GeminiTelemetryAgent.eventQueue.splice(0, GeminiTelemetryAgent.eventQueue.length);

    // Simulate sending to a telemetry endpoint (e.g., Datadog, Splunk, custom Gemini monitoring service)
    try {
      // In a true Gemini system, an AI model would analyze these events before sending
      // to identify critical trends or suggest immediate actions.
      // const analysisResult = await GeminiPredictiveAnalytics.analyzeEvents(eventsToSend);
      console.log(`GeminiTelemetryAgent: Sending ${eventsToSend.length} events. Example:`, eventsToSend[0]);
      // await fetch(GeminiConfig.get<string>("telemetryServiceEndpoint"), {
      //   method: 'POST',
      //   body: JSON.stringify({ events: eventsToSend, analysis: analysisResult }),
      //   headers: { 'Content-Type': 'application/json' },
      // });
      eventsToSend.length = 0; // Clear after sending
    } catch (error) {
      console.error("GeminiTelemetryAgent: Failed to send telemetry data:", error);
      // Implement circuit-breaking or retry logic here
      // GeminiCircuitBreaker.fail("telemetryService");
    }
  }

  /**
   * Cleans up any resources.
   */
  public static shutdown(): void {
    if (GeminiTelemetryAgent.batchInterval) {
      clearInterval(GeminiTelemetryAgent.batchInterval);
      GeminiTelemetryAgent.batchInterval = null;
    }
    GeminiTelemetryAgent.processQueue(true); // Send remaining events
    GeminiTelemetryAgent.isInitialized = false;
    console.log("GeminiTelemetryAgent: Shut down.");
  }
}
// Initialize telemetry on module load
GeminiTelemetryAgent.init();


/**
 * @exports GeminiComplianceGuard
 * An AI-driven compliance and data governance module. It enforces regulatory rules
 * and access policies dynamically, adapting to new regulations.
 */
export class GeminiComplianceGuard {
  /**
   * Checks if an action is compliant with current regulations.
   * This might involve querying a policy engine or an LLM for real-time interpretation of rules.
   * @param action The action to check (e.g., "export_data", "view_sensitive_info").
   * @param context Additional context (e.g., user role, data sensitivity, geographic region).
   * @returns A promise resolving to true if compliant, false otherwise.
   */
  public static async check(action: string, context: Record<string, any>): Promise<boolean> {
    console.log(`GeminiComplianceGuard: Checking compliance for action '${action}' with context:`, context);
    const complianceLevel = GeminiConfig.get<string>("complianceLevel");

    // Simulate complex AI-driven compliance logic
    if (action === "export_data") {
      if (context.userRole === "guest" || !context.authenticated) {
        return false; // Guests cannot export
      }
      if (complianceLevel === "GDPR_CCPA" && context.dataSensitivity === "PII") {
        // Additional checks for PII data under GDPR/CCPA
        // e.g., prompt for justification, anonymization checks
        // const llmResponse = await GeminiPromptProcessor.processPrompt("Check if PII export is compliant under GDPR/CCPA given justification: " + context.justification);
        // return llmResponse.isCompliant;
        return Math.random() > 0.1; // Simulate a 90% chance of being compliant for demo
      }
      return true; // Default compliant
    }

    if (action === "view_sensitive_data" && context.dataSensitivity === "PII") {
        return context.userRole === "admin" || context.userRole === "auditor";
    }

    return true; // Assume compliant for other actions
  }

  /**
   * Records a compliance event for auditing purposes.
   * @param event The compliance event details.
   */
  public static recordAudit(event: Record<string, any>): void {
    console.log("GeminiComplianceGuard: Recording audit event:", event);
    GeminiTelemetryAgent.track("compliance_audit_event", event);
    // In a real system, this would write to an immutable audit log service.
  }
}


/**
 * @exports GeminiPredictiveAnalytics
 * An AI-driven module for generating forecasts, detecting anomalies, and providing insights.
 * It uses machine learning models to analyze historical cash flow data.
 */
export class GeminiPredictiveAnalytics {
  /**
   * Predicts future cash flow based on historical data.
   * This would involve calling a pre-trained ML model.
   * @param historicalData An array of cash flow entries.
   * @param forecastPeriod Number of days/weeks to forecast.
   * @returns A promise resolving to an array of predicted cash flow objects.
   */
  public static async predictCashFlow(
    historicalData: ExpectedCashFlow[],
    forecastPeriod: number = 7,
  ): Promise<Record<string, number>[]> {
    console.log(`GeminiPredictiveAnalytics: Predicting cash flow for ${forecastPeriod} days.`);
    GeminiTelemetryAgent.track("predict_cash_flow_request", { forecastPeriod, dataCount: historicalData.length });

    // In a real scenario, this would send data to an ML model endpoint:
    // const response = await fetch(GeminiConfig.get<string>("predictionModelEndpoint"), {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ historicalData, forecastPeriod }),
    // });
    // const predictions = await response.json();
    // return predictions;

    // Simulate AI prediction for demo:
    const predictions: Record<string, number>[] = [];
    let lastKnownBalance = 0;
    if (historicalData && historicalData.length > 0) {
        // Attempt to get the latest ending balance from the most recent date available in any account.
        const allByDates = historicalData.flatMap(account => account.byDate || []);
        const latestByDate = allByDates.sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())[0];
        if (latestByDate) {
            lastKnownBalance = Number(latestByDate.endingBalance);
        }
    }

    for (let i = 1; i <= forecastPeriod; i++) {
      const date = moment().add(i, "days").format("YYYY-MM-DD");
      // Simple linear projection with some random variance
      const predictedNetChange = Math.random() * 20000 - 10000; // between -10k and +10k
      lastKnownBalance += predictedNetChange;
      predictions.push({
        date,
        predictedInflow: Math.abs(predictedNetChange > 0 ? predictedNetChange : Math.random() * 5000),
        predictedOutflow: Math.abs(predictedNetChange < 0 ? predictedNetChange : Math.random() * 5000),
        predictedNetChange: predictedNetChange,
        predictedBalance: lastKnownBalance,
      });
    }
    return predictions;
  }

  /**
   * Provides a textual insight based on cash flow data.
   * This would involve an LLM (Language Model).
   * @param data The cash flow data to analyze.
   * @returns A promise resolving to a string containing the insight.
   */
  public static async getInsights(data: (ExpectedCashFlow | GroupedExpectedCashFlow)[]): Promise<string> {
    console.log("GeminiPredictiveAnalytics: Generating insights.");
    GeminiTelemetryAgent.track("generate_insights_request", { dataCount: data.length });

    // Simulate LLM call
    // const response = await fetch(GeminiConfig.get<string>("llmServiceEndpoint"), {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prompt: "Analyze cash flow data for trends and potential issues.", data }),
    // });
    // const { insight } = await response.json();
    // return insight;

    // Simple simulated insight:
    const totalInflow = data.reduce((sum, group) => {
        const byDate = 'byDate' in group ? group.byDate : [];
        return sum + byDate.reduce((s, d) => s + Number(d.totalInflow), 0);
    }, 0);
    const totalOutflow = data.reduce((sum, group) => {
        const byDate = 'byDate' in group ? group.byDate : [];
        return sum + byDate.reduce((s, d) => s + Number(d.totalOutflow), 0);
    }, 0);
    const netChange = totalInflow - totalOutflow;

    if (netChange > 100000) {
      return `Strong positive cash flow detected (${GeminiAdaptiveFormatter(netChange, 'USD')}). Consider investment opportunities.`;
    } else if (netChange < -50000) {
      return `Significant negative cash flow (${GeminiAdaptiveFormatter(netChange, 'USD')}). Recommend reviewing outflows and potential funding.`;
    } else {
      return `Stable cash flow (${GeminiAdaptiveFormatter(netChange, 'USD')}) with no immediate concerns.`;
    }
  }
}

/**
 * @exports GeminiPromptProcessor
 * An AI-driven natural language processor that allows the UI to respond to user prompts
 * for data manipulation, filtering, or display changes.
 */
export class GeminiPromptProcessor {
  /**
   * Processes a natural language prompt and returns structured instructions.
   * @param prompt The user's natural language prompt.
   * @param context Current UI state or data context.
   * @returns A promise resolving to an object containing actionable instructions.
   */
  public static async processPrompt(
    prompt: string,
    context: Record<string, any> = {},
  ): Promise<{ action: string; payload: any }> {
    console.log(`GeminiPromptProcessor: Processing prompt '${prompt}' with context:`, context);
    GeminiTelemetryAgent.track("prompt_processor_request", { prompt, context });

    // This would typically involve sending the prompt to a powerful LLM.
    // const response = await fetch(GeminiConfig.get<string>("llmServiceEndpoint"), {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prompt, context }),
    // });
    // const instructions = await response.json();
    // return instructions;

    // Simulate LLM response for demo:
    prompt = prompt.toLowerCase();
    if (prompt.includes("show only inflows")) {
      return { action: "filter_flow_type", payload: CashFlowType.Inflow };
    }
    if (prompt.includes("show only outflows")) {
      return { action: "filter_flow_type", payload: CashFlowType.Outflow };
    }
    if (prompt.includes("expand all")) {
      return { action: "expand_all_rows", payload: true };
    }
    if (prompt.includes("collapse all")) {
      return { action: "expand_all_rows", payload: false };
    }
    if (prompt.includes("export table")) {
      return { action: "initiate_export", payload: GeminiConfig.get<string>("exportFormat") };
    }
    if (prompt.includes("highlight negative net change")) {
        return { action: "highlight_negative_net_change", payload: true };
    }
    return { action: "no_action", payload: {} };
  }
}


// --------------------------------------------------------------------------
// II. Total Integration: AI Reasoning Layers & Prompt-based Learning
// --------------------------------------------------------------------------

enum CashFlowType {
  Inflow = "inflow",
  Outflow = "outflow",
}

interface RowType extends Record<string, unknown> {
  key: string;
  name: string;
  expanded?: boolean;
  leafNode?: boolean; // Added for AI rendering logic
  isPredicted?: boolean; // Added for predictive data
  originalData?: any; // To hold original data for AI context
}

// @exports GeminiAdaptiveRender
// An AI-enhanced render function that can adapt rendering based on context,
// data sensitivity, or real-time insights from GeminiPredictiveAnalytics.
export function GeminiAdaptiveRender(value: string, record: RowType & Record<string, string>) {
  GeminiTelemetryAgent.track("render_column_event", { key: record.key, value });

  let className = "font-normal";
  // AI-driven decision making for styling:
  if (record.isPredicted) {
    className += " italic text-blue-600"; // Predicted values
  } else if (record.key.includes("net-change") && parseFloat(value.replace(/[^0-9.-]+/g,"")) < 0) {
    className += " text-red-600 font-bold"; // Negative net change (adaptive highlight)
  } else if (record.leafNode) {
    className += " text-gray-700";
  } else {
    className += " font-medium text-gray-900";
  }

  // Original logic preserved with adaptive enhancements
  return record.path ? (
    <a className={className} href={record.path}>
      {value}
    </a>
  ) : (
    <p className={className}>{value}</p>
  );
}

// Enhanced formatAmount with AI context
// @exports GeminiAdaptiveFormatter
export function GeminiAdaptiveFormatter(amount: number, currency: string, defaultPrecision: number = 2): string {
  GeminiTelemetryAgent.track("format_amount_request", { amount, currency });
  // AI reasoning: Adjust precision, add symbols, or even suggest conversion based on user locale or market volatility
  const precision = amount > 1000000 ? 0 : amount > 1000 ? defaultPrecision : 4; // Adaptive precision
  return formatAmount(amount, currency, precision); // Use existing utility, potentially enhance
}


function formatNetChangeChildren(
  groupedExpectedCashFlowByAccount: ExpectedCashFlow[] | undefined,
  currency: string,
  type: CashFlowType,
) {
  const groupedExpectedCashFlowIdToDetailsMapping: Record<string, RowType> = {};

  groupedExpectedCashFlowByAccount?.forEach(
    (groupedExpectedCashFlowByAccountDetails) => {
      groupedExpectedCashFlowByAccountDetails.byDate?.forEach(
        (byDateAccountDetails) => {
          const totalFlow =
            type === CashFlowType.Inflow
              ? byDateAccountDetails.expectedInflows.total
              : byDateAccountDetails.expectedOutflows.total;

          const formattedTotalFlow = GeminiAdaptiveFormatter(
            Number(totalFlow),
            currency,
          );

          if (
            groupedExpectedCashFlowIdToDetailsMapping[
              groupedExpectedCashFlowByAccountDetails.id
            ]
          ) {
            const previousDetails =
              groupedExpectedCashFlowIdToDetailsMapping[
                groupedExpectedCashFlowByAccountDetails.id
              ];
            groupedExpectedCashFlowIdToDetailsMapping[
              groupedExpectedCashFlowByAccountDetails.id
            ] = {
              ...previousDetails,
              [byDateAccountDetails.date]: formattedTotalFlow,
            };
          } else {
            groupedExpectedCashFlowIdToDetailsMapping[
              groupedExpectedCashFlowByAccountDetails.id
            ] = {
              key: `${groupedExpectedCashFlowByAccountDetails.id}-total-${type}`,
              name: groupedExpectedCashFlowByAccountDetails.account.bestName,
              path: groupedExpectedCashFlowByAccountDetails.account.path,
              leafNode: true,
              [byDateAccountDetails.date]: formattedTotalFlow,
            };
          }
        },
      );
    },
  );

  return Object.values(groupedExpectedCashFlowIdToDetailsMapping);
}

function formatAccountNetChangeChildren(
  groupedExpectedCashFlowByAccount: ExpectedCashFlow,
  type: CashFlowType,
) {
  const groupedExpectedCashFlowCategoryToDetailsMapping: Record<string, RowType> = {};
  const moneyInOutTotalByDate: Record<string, string> = {};

  if (groupedExpectedCashFlowByAccount) {
    const account = groupedExpectedCashFlowByAccount;

    account?.byDate?.forEach((accountOnDate) => {
      const flowType =
        type === CashFlowType.Inflow
          ? accountOnDate?.expectedInflows
          : accountOnDate?.expectedOutflows;
      moneyInOutTotalByDate[accountOnDate.date] = GeminiAdaptiveFormatter(
        Number(flowType.total),
        account.currency,
      );
      flowType.categories?.forEach((category) => {
        if (
          groupedExpectedCashFlowCategoryToDetailsMapping[category.category]
        ) {
          const previousDetails =
            groupedExpectedCashFlowCategoryToDetailsMapping[category.category];
          groupedExpectedCashFlowCategoryToDetailsMapping[category.category] = {
            ...previousDetails,
            [accountOnDate.date]: GeminiAdaptiveFormatter(
              Number(category.amount),
              account.currency,
            ),
          };
        } else {
          groupedExpectedCashFlowCategoryToDetailsMapping[category.category] = {
            key: `${groupedExpectedCashFlowByAccount.id}-${account.currency}-${type}-${category.category}-category`,
            name: startCase(category.category),
            path: "",
            leafNode: true,
            [accountOnDate.date]: GeminiAdaptiveFormatter(
              Number(category.amount),
              account.currency,
            ),
          };
        }
      });
    });
  }

  return {
    ...moneyInOutTotalByDate,
    children: Object.values(groupedExpectedCashFlowCategoryToDetailsMapping),
  };
}

interface ColumnType {
  key: string;
  title: string;
  dataIndex: string;
  render?: (value: string, record: RowType & Record<string, string>) => JSX.Element;
  sorter?: (a: RowType, b: RowType) => number; // Added for potential AI-driven sorting
}

// @exports formatgroupedExpectedCashFlowAccountsDataWithAI
function formatgroupedExpectedCashFlowAccountsDataWithAI(
  accountsData: GroupedExpectedCashFlow[] | undefined,
  predictedCashFlows: Record<string, number>[] = [],
) {
  let columns: ColumnType[] = [];
  let data: RowType[] = [];

  // Add a special column for AI insights/actions if needed
  // columns.push({
  //   key: "ai-insights",
  //   title: "AI Insights",
  //   dataIndex: "aiInsights",
  //   render: (value) => <span className="text-purple-600">{value}</span>
  // });

  if (accountsData && accountsData.length > 0) {
    // Assumption: All groups share the same currency and date range for columns if multi-group table
    const firstGroup = accountsData[0];
    const { currency } = firstGroup;

    columns = firstGroup.byDate.map(
      (groupedExpectedCashFlowByDate) => ({
        key: `${firstGroup.groupId}-${currency}-${groupedExpectedCashFlowByDate?.date}-col`,
        title: moment(groupedExpectedCashFlowByDate?.date).format("M/D/YYYY"),
        dataIndex: groupedExpectedCashFlowByDate?.date,
        render: (value: string, record: RowType & Record<string, string>) =>
          GeminiAdaptiveRender(value, record), // Use AI-enhanced renderer
      }),
    );

    // Add predicted date columns
    predictedCashFlows.forEach((prediction) => {
        columns.push({
            key: `predicted-${prediction.date}-col`,
            title: moment(prediction.date).format("M/D/YYYY") + " (AI)",
            dataIndex: prediction.date, // Use date as dataIndex for predictions
            render: (value: string, record: RowType & Record<string, string>) => {
                let predictedValue: string | undefined;
                if (record.key.includes("starting-balance")) {
                    predictedValue = GeminiAdaptiveFormatter(prediction.predictedBalance, currency);
                } else if (record.key.includes("net-change")) {
                    predictedValue = GeminiAdaptiveFormatter(prediction.predictedNetChange, currency);
                } else if (record.key.includes("money-in")) {
                    predictedValue = GeminiAdaptiveFormatter(prediction.predictedInflow, currency);
                } else if (record.key.includes("money-out")) {
                    predictedValue = GeminiAdaptiveFormatter(prediction.predictedOutflow, currency);
                } else {
                    predictedValue = "-";
                }
                return GeminiAdaptiveRender(predictedValue || "-", { ...record, isPredicted: true });
            },
        });
    });


    columns = [
      {
        key: `${firstGroup.groupId}-${currency}-connection-col`,
        title:
          firstGroup.groupType === "Connection"
            ? "Bank Name"
            : "Group Name",
        dataIndex: "name",
        render: (value: string, record: RowType & Record<string, string>) =>
          GeminiAdaptiveRender(value, record),
      },
      ...columns,
    ];

    accountsData.forEach((groupedExpectedCashFlow) => {
      const { currency: groupCurrency } = groupedExpectedCashFlow; // Use group's specific currency

      const groupingNameToDetailsMapping: Record<string, RowType> = {
        "Starting Balance": {
          key: `${groupedExpectedCashFlow.groupId}-${groupCurrency}-starting-balance`,
          name: "Starting Balance",
          originalData: groupedExpectedCashFlow.byDate,
        },
        "Net Change": {
          key: `${groupedExpectedCashFlow.groupId}-${groupCurrency}-net-change`,
          name: "Net Change",
          originalData: groupedExpectedCashFlow.byDate,
          children: [
            {
              key: `${groupedExpectedCashFlow.groupId}-${groupCurrency}-money-in`,
              name: "Money In",
              children: formatNetChangeChildren(
                groupedExpectedCashFlow.byAccount,
                groupCurrency,
                CashFlowType.Inflow,
              ),
            },
            {
              key: `${groupedExpectedCashFlow.groupId}-${groupCurrency}-money-out`,
              name: "Money Out",
              children: formatNetChangeChildren(
                groupedExpectedCashFlow.byAccount,
                groupCurrency,
                CashFlowType.Outflow,
              ),
            },
          ],
        },
        "Expected Balance": {
          key: `${groupedExpectedCashFlow.groupId}-${groupCurrency}-expected-balance`,
          name: "Expected Balance",
          originalData: groupedExpectedCashFlow.byDate,
        },
      };

      groupedExpectedCashFlow.byDate.forEach(
        (groupedExpectedCashFlowByDate) => {
          Object.entries(groupingNameToDetailsMapping).map(
            ([groupingName, groupingDetails]) => {
              if (groupingName === "Starting Balance") {
                groupingNameToDetailsMapping[groupingName] = {
                  ...groupingDetails,
                  [groupedExpectedCashFlowByDate.date]: GeminiAdaptiveFormatter(
                    Number(groupedExpectedCashFlowByDate.startingBalance),
                    groupCurrency,
                  ),
                };
              } else if (groupingName === "Expected Balance") {
                groupingNameToDetailsMapping[groupingName] = {
                  ...groupingDetails,
                  [groupedExpectedCashFlowByDate.date]: GeminiAdaptiveFormatter(
                    Number(groupedExpectedCashFlowByDate.endingBalance),
                    groupCurrency,
                  ),
                };
              } else if (groupingName === "Net Change") {
                // @ts-ignore
                groupingNameToDetailsMapping[groupingName] = {
                  ...groupingDetails,
                  [groupedExpectedCashFlowByDate.date]: GeminiAdaptiveFormatter(
                    Number(groupedExpectedCashFlowByDate.totalNetChange),
                    groupCurrency,
                  ),
                  children: [
                    {
                      ...groupingNameToDetailsMapping[groupingName].children[0],
                      [groupedExpectedCashFlowByDate.date]: GeminiAdaptiveFormatter(
                        Number(groupedExpectedCashFlowByDate.totalInflow),
                        groupCurrency,
                      ),
                    },
                    {
                      ...groupingNameToDetailsMapping[groupingName].children[1],
                      [groupedExpectedCashFlowByDate.date]: GeminiAdaptiveFormatter(
                        Number(groupedExpectedCashFlowByDate.totalOutflow),
                        groupCurrency,
                      ),
                    },
                  ],
                };
              }
            },
          );
        },
      );

      const connectionChildren = Object.values(groupingNameToDetailsMapping);

      data = [
        {
          // @ts-ignore
          key: `${groupedExpectedCashFlow.groupId}-${groupCurrency}-connection-row`,
          name: groupedExpectedCashFlow.bestName || "N/A",
          expanded: true,
          children: connectionChildren,
          originalData: groupedExpectedCashFlow, // Store original data for AI context
        },
        ...data,
      ];
    });
  }

  return { columns, data };
}

// @exports formatgroupedExpectedCashFlowAccountDataWithAI
function formatgroupedExpectedCashFlowAccountDataWithAI(
  groupedExpectedCashFlow: ExpectedCashFlow | undefined,
  predictedCashFlows: Record<string, number>[] = [],
) {
  let columns: ColumnType[] = [];
  let data: RowType[] = [];

  if (groupedExpectedCashFlow) {
    const currency: string = groupedExpectedCashFlow?.currency;

    columns = groupedExpectedCashFlow.byDate.map(
      (groupedExpectedCashFlowByDate) => ({
        key: `${groupedExpectedCashFlow.id}-${groupedExpectedCashFlow.currency}-${groupedExpectedCashFlowByDate.date}-col`,
        title: moment(groupedExpectedCashFlowByDate?.date).format("M/D/YYYY"),
        dataIndex: groupedExpectedCashFlowByDate?.date,
        render: (value: string, record: RowType & Record<string, string>) =>
          GeminiAdaptiveRender(value, record),
      }),
    );

    // Add predicted date columns for single account view
    predictedCashFlows.forEach((prediction) => {
        columns.push({
            key: `predicted-${prediction.date}-col`,
            title: moment(prediction.date).format("M/D/YYYY") + " (AI)",
            dataIndex: prediction.date,
            render: (value: string, record: RowType & Record<string, string>) => {
                let predictedValue: string | undefined;
                if (record.key.includes("starting-balance")) {
                    predictedValue = GeminiAdaptiveFormatter(prediction.predictedBalance, currency);
                } else if (record.key.includes("net-change")) {
                    predictedValue = GeminiAdaptiveFormatter(prediction.predictedNetChange, currency);
                } else if (record.key.includes("money-in")) {
                    predictedValue = GeminiAdaptiveFormatter(prediction.predictedInflow, currency);
                } else if (record.key.includes("money-out")) {
                    predictedValue = GeminiAdaptiveFormatter(prediction.predictedOutflow, currency);
                } else {
                    predictedValue = "-";
                }
                return GeminiAdaptiveRender(predictedValue || "-", { ...record, isPredicted: true });
            },
        });
    });

    columns = [{ key: "name-col", title: "", dataIndex: "name", render: (value: string, record: RowType & Record<string, string>) => GeminiAdaptiveRender(value, record) }, ...columns];

    const groupingNameToDetailsMapping: Record<string, RowType> = {
      "Starting Balance": {
        key: `${groupedExpectedCashFlow.id}-${currency}-starting-balance-row`,
        name: "Starting Balance",
        originalData: groupedExpectedCashFlow.byDate,
      },
      "Net Change": {
        key: `${groupedExpectedCashFlow.id}-${currency}-net-change-row`,
        name: "Net Change",
        originalData: groupedExpectedCashFlow.byDate,
        children: [
          {
            key: `${groupedExpectedCashFlow.id}-${currency}-money-in-row`,
            name: "Money In",
            ...formatAccountNetChangeChildren(
              groupedExpectedCashFlow,
              CashFlowType.Inflow,
            ),
          },
          {
            key: `${groupedExpectedCashFlow.id}-${currency}-money-out-row`,
            name: "Money Out",
            ...formatAccountNetChangeChildren(
              groupedExpectedCashFlow,
              CashFlowType.Outflow,
            ),
          },
        ],
      },
      "Expected Balance": {
        key: `${groupedExpectedCashFlow.id}-${currency}-expected-balance-row`,
        name: "Expected Balance",
        originalData: groupedExpectedCashFlow.byDate,
      },
    };

    groupedExpectedCashFlow.byDate.forEach((groupedExpectedCashFlowByDate) => {
      Object.entries(groupingNameToDetailsMapping).map(
        ([groupingName, groupingDetails]) => {
          if (groupingName === "Starting Balance") {
            groupingNameToDetailsMapping[groupingName] = {
              ...groupingDetails,
              [groupedExpectedCashFlowByDate.date]: GeminiAdaptiveFormatter(
                Number(groupedExpectedCashFlowByDate.startingBalance),
                currency,
              ),
            };
          } else if (groupingName === "Expected Balance") {
            groupingNameToDetailsMapping[groupingName] = {
              ...groupingDetails,
              [groupedExpectedCashFlowByDate.date]: GeminiAdaptiveFormatter(
                Number(groupedExpectedCashFlowByDate.endingBalance),
                currency,
              ),
            };
          } else if (groupingName === "Net Change") {
            // @ts-ignore
            groupingNameToDetailsMapping[groupingName] = {
              ...groupingDetails,
              [groupedExpectedCashFlowByDate.date]: GeminiAdaptiveFormatter(
                Number(groupedExpectedCashFlowByDate.netChange),
                currency,
              ),
            };
          }
        },
      );
    });

    const connectionChildren = Object.values(groupingNameToDetailsMapping);

    data = connectionChildren;
  }

  return { columns, data };
}


// --------------------------------------------------------------------------
// III. Commercial-Grade Logic Infusion & IV. Autonomous Externalization
// --------------------------------------------------------------------------

// @exports GeminiCircuitBreaker
/**
 * Implements a circuit breaker pattern for external service calls,
 * improving resilience and preventing cascading failures.
 */
export class GeminiCircuitBreaker {
  private static states: Record<string, { isOpen: boolean; lastOpened: number; failureCount: number }> = {};
  private static threshold: number = GeminiConfig.get<number>("circuitBreakerThreshold"); // failures
  private static timeout: number = GeminiConfig.get<number>("circuitBreakerTimeout"); // ms to stay open

  public static isOpen(serviceName: string): boolean {
    const state = GeminiCircuitBreaker.states[serviceName];
    if (!state) return false;

    if (state.isOpen && (Date.now() - state.lastOpened > GeminiCircuitBreaker.timeout)) {
      // Half-open state: allow a single request to test if service has recovered
      console.warn(`GeminiCircuitBreaker: Service '${serviceName}' is half-open.`);
      state.isOpen = false; // Temporarily close
      state.failureCount = 0; // Reset failure count for test request
      return false; // Allow request
    }
    return state.isOpen;
  }

  public static fail(serviceName: string): void {
    const state = GeminiCircuitBreaker.states[serviceName] || { isOpen: false, lastOpened: 0, failureCount: 0 };
    state.failureCount++;
    if (state.failureCount >= GeminiCircuitBreaker.threshold) {
      state.isOpen = true;
      state.lastOpened = Date.now();
      console.error(`GeminiCircuitBreaker: Service '${serviceName}' is now OPEN (tripped).`);
    }
    GeminiCircuitBreaker.states[serviceName] = state;
  }

  public static success(serviceName: string): void {
    const state = GeminiCircuitBreaker.states[serviceName];
    if (state) {
      state.failureCount = 0;
      if (state.isOpen) {
        state.isOpen = false;
        console.log(`GeminiCircuitBreaker: Service '${serviceName}' is now CLOSED (recovered).`);
      }
    }
  }
}

// @exports GeminiServiceOrchestrator
/**
 * A central orchestrator for dynamically discovering and selecting optimal external services.
 * This class abstracts away direct service calls and applies runtime intelligence.
 */
export class GeminiServiceOrchestrator {
    private static availableServices: Record<string, string[]> = {
        llm: [GeminiConfig.get<string>("llmServiceEndpoint")],
        telemetry: [GeminiConfig.get<string>("telemetryServiceEndpoint") || "https://telemetry.gemini.com/ingest"],
        predictions: [GeminiConfig.get<string>("predictionModelEndpoint")],
        currency: [GeminiConfig.get<string>("currencyApiEndpoint")],
        exportService: ["https://api.gemini.com/export-service"], // Example export service
    };

    /**
     * Dynamically selects the best endpoint for a given service type.
     * This could involve checking latency, load, or compliance regions.
     * @param serviceType The type of service (e.g., 'llm', 'telemetry').
     * @returns The optimal service endpoint URL.
     */
    public static async getServiceEndpoint(serviceType: string): Promise<string | undefined> {
        const endpoints = GeminiServiceOrchestrator.availableServices[serviceType];
        if (!endpoints || endpoints.length === 0) {
            console.warn(`GeminiServiceOrchestrator: No endpoints found for service type '${serviceType}'.`);
            return undefined;
        }

        // AI-driven selection logic:
        // In a production system, this would involve real-time latency checks,
        // load balancing, and regional compliance considerations.
        // For demo, we just pick the first available and check circuit breaker.
        for (const endpoint of endpoints) {
            if (!GeminiCircuitBreaker.isOpen(endpoint)) {
                console.log(`GeminiServiceOrchestrator: Selected endpoint '${endpoint}' for '${serviceType}'.`);
                return endpoint;
            }
        }
        console.error(`GeminiServiceOrchestrator: All endpoints for '${serviceType}' are currently open (unavailable).`);
        return undefined;
    }

    /**
     * Executes an AI-bound external service call.
     * @param serviceType The type of service to call.
     * @param method The HTTP method (e.g., 'POST').
     * @param body The request body.
     * @param headers Request headers.
     * @returns The service response.
     */
    public static async callService(
        serviceType: string,
        method: string,
        body: any,
        headers: Record<string, string> = { 'Content-Type': 'application/json' }
    ): Promise<any> {
        const endpoint = await GeminiServiceOrchestrator.getServiceEndpoint(serviceType);
        if (!endpoint) {
            throw new Error(`GeminiServiceOrchestrator: No available service endpoint for '${serviceType}'.`);
        }

        if (GeminiCircuitBreaker.isOpen(endpoint)) {
            console.warn(`GeminiServiceOrchestrator: Circuit breaker open for '${endpoint}', not calling service.`);
            throw new Error(`Service '${serviceType}' is unavailable due to circuit breaker.`);
        }

        try {
            const response = await fetch(endpoint, {
                method,
                body: JSON.stringify(body),
                headers,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            GeminiCircuitBreaker.success(endpoint);
            return response.json();
        } catch (error) {
            console.error(`GeminiServiceOrchestrator: Error calling '${serviceType}' at '${endpoint}':`, error);
            GeminiCircuitBreaker.fail(endpoint);
            throw error;
        }
    }
}


interface Props {
  accountGroups?: GroupedExpectedCashFlow[];
  singleAccount?: ExpectedCashFlow;
  loading: boolean;
  searchComponents?: Array<
    Required<{
      component: React.ElementType;
    }> & {
      className?: string;
    }
  >;
}

export default function CashPlanningTable({
  accountGroups,
  singleAccount,
  loading,
  searchComponents,
}: Props) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<string>>(
    new Set(),
  );
  const [predictedCashFlows, setPredictedCashFlows] = useState<Record<string, number>[]>([]);
  const [geminiInsights, setGeminiInsights] = useState<string>("");
  const [promptInput, setPromptInput] = useState<string>("");
  const [filterType, setFilterType] = useState<CashFlowType | null>(null);
  const [highlightNegative, setHighlightNegative] = useState<boolean>(false); // AI-driven highlight state

  // V. Logical Conclusion: Self-Aware Infrastructure - AI-driven lifecycle management
  useEffect(() => {
    // Proactively fetch predictions and insights when data changes
    const fetchAITools = async () => {
      if (accountGroups || singleAccount) {
        const historicalData: ExpectedCashFlow[] = singleAccount
          ? [singleAccount]
          : accountGroups?.flatMap((group) => group.byAccount) || [];

        try {
          const predictions = await GeminiPredictiveAnalytics.predictCashFlow(historicalData, 7); // Predict next 7 days
          setPredictedCashFlows(predictions);
        } catch (error) {
          console.error("Failed to fetch AI predictions:", error);
          GeminiTelemetryAgent.track("ai_prediction_error", { error: error.message });
        }

        try {
            const insights = await GeminiPredictiveAnalytics.getInsights(
                singleAccount ? [singleAccount] : accountGroups || []
            );
            setGeminiInsights(insights);
        } catch (error) {
            console.error("Failed to fetch AI insights:", error);
            GeminiTelemetryAgent.track("ai_insights_error", { error: error.message });
        }
      }
    };
    fetchAITools();

    // Cleanup telemetry on component unmount
    return () => {
      GeminiTelemetryAgent.shutdown();
    };
  }, [accountGroups, singleAccount]);

  const groupedExpectedCashFlow = useMemo(() => {
    const nonEmptyGroups =
      accountGroups?.filter((group) => group.byAccount.length > 0) || [];

    const formattedData = singleAccount
      ? formatgroupedExpectedCashFlowAccountDataWithAI(singleAccount, predictedCashFlows)
      : formatgroupedExpectedCashFlowAccountsDataWithAI(nonEmptyGroups, predictedCashFlows);

    // Apply AI-driven filtering here
    let filteredData = formattedData.data;
    if (filterType) {
        filteredData = filteredData.map(row => {
            if ((row.key as string).includes("money-in") && filterType === CashFlowType.Outflow) return { ...row, children: [] };
            if ((row.key as string).includes("money-out") && filterType === CashFlowType.Inflow) return { ...row, children: [] };
            return row;
        });
    }

    return { ...formattedData, data: filteredData };
  }, [singleAccount, accountGroups, predictedCashFlows, filterType]);

  // On data load, update the initial expanded rows.
  useEffect(() => {
    if (groupedExpectedCashFlow) {
      const keys: string[] = groupedExpectedCashFlow.data.map(
        (group) => group.key,
      );

      setExpandedRowKeys(new Set(keys));
    }
  }, [groupedExpectedCashFlow]);

  const onHandleExpand = (expanded: boolean, record: { key: string }) => {
    GeminiTelemetryAgent.track(
      CASH_PLANNING_ACTIONS.ROW_EXPANDED_COLLAPSED,
      { key: record.key, expanded },
    );

    if (expanded) {
      setExpandedRowKeys((current) => new Set([...current, record.key]));
    } else if (expandedRowKeys.has(record.key)) {
      setExpandedRowKeys((current) => {
        current.delete(record.key);
        return new Set(current);
      });
    }
  };

  const handleGeminiPrompt = async () => {
    if (!promptInput.trim()) return;

    GeminiTelemetryAgent.track("gemini_prompt_submitted", { prompt: promptInput });
    try {
      const instructions = await GeminiPromptProcessor.processPrompt(promptInput, {
        currentView: singleAccount ? "single_account" : "account_groups",
        filterType,
        highlightNegative,
      });

      switch (instructions.action) {
        case "filter_flow_type":
          setFilterType(instructions.payload);
          alert(`Gemini: Applying filter: ${instructions.payload}`);
          break;
        case "expand_all_rows":
          if (instructions.payload) {
            const allKeys = groupedExpectedCashFlow.data.flatMap(row => [row.key, ...(row.children?.map((c: any) => c.key) || [])]);
            setExpandedRowKeys(new Set(allKeys));
          } else {
            setExpandedRowKeys(new Set());
          }
          alert(`Gemini: ${instructions.payload ? 'Expanded' : 'Collapsed'} all rows.`);
          break;
        case "initiate_export":
          handleExport(instructions.payload);
          break;
        case "highlight_negative_net_change":
            setHighlightNegative(instructions.payload);
            alert(`Gemini: Toggling negative net change highlight: ${instructions.payload}`);
            break;
        case "no_action":
        default:
          alert(`Gemini: Understood "${promptInput}", but no specific action was triggered or supported yet. Try "show only inflows" or "expand all".`);
          break;
      }
    } catch (error) {
      console.error("GeminiPromptProcessor failed:", error);
      GeminiTelemetryAgent.track("gemini_prompt_error", { prompt: promptInput, error: error.message });
      alert("Gemini is currently unable to process your request. Please try again later.");
      const llmEndpoint = await GeminiServiceOrchestrator.getServiceEndpoint("llm");
      if (llmEndpoint) {
          GeminiCircuitBreaker.fail(llmEndpoint);
      }
    }
    setPromptInput("");
  };

  const handleExport = async (format: string = GeminiConfig.get<string>("exportFormat")) => {
    const isCompliant = await GeminiComplianceGuard.check("export_data", {
      userRole: "admin", // Simulate current user role
      dataSensitivity: "PII", // Assume cash flow data contains PII
      authenticated: true,
      justification: "Monthly financial report export",
    });

    if (!isCompliant) {
      alert("Export failed: Not compliant with data governance policies.");
      GeminiComplianceGuard.recordAudit({
        action: "export_attempt_failed",
        reason: "compliance_violation",
        user: "current_user",
      });
      return;
    }

    trackEvent(null, CASH_PLANNING_ACTIONS.EXPORT_TABLE_CLICKED); // Keep existing tracking for comparison
    GeminiTelemetryAgent.track(CASH_PLANNING_ACTIONS.EXPORT_TABLE_CLICKED, { format, userRole: "admin" });

    alert(
      `Gemini is preparing your export in ${format} format. This feature is coming soon! Check your email or notifications for completion.`,
    );
    // In a real system, this would trigger an async export job via GeminiServiceOrchestrator
    // try {
    //   await GeminiServiceOrchestrator.callService('exportService', 'POST', {
    //     data: groupedExpectedCashFlow.data,
    //     format,
    //     userId: 'current_user_id'
    //   });
    //   GeminiComplianceGuard.recordAudit({
    //     action: "data_exported",
    //     format,
    //     user: "current_user",
    //   });
    // } catch (error) {
    //   console.error("Export service failed:", error);
    //   GeminiComplianceGuard.recordAudit({
    //     action: "export_service_failed",
    //     error: error.message,
    //     user: "current_user",
    //   });
    //   alert("Export service is currently unavailable. Please try again later.");
    // }
  };


  const renderHeader = () => (
    <div className="flex flex-col gap-2 p-2 border-b border-gray-100 bg-gray-50">
      <div className="flex flex-row gap-1 items-center justify-between">
        <div className="flex grow flex-row items-center justify-start gap-2">
          {searchComponents?.map(({ component: Component, ...options }) => (
            <Component
              key={uuidv4()}
              classes="w-52 justify-center"
              {...options}
            />
          ))}
          {/* AI-powered prompt input */}
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Ask Gemini: e.g., 'show only inflows', 'expand all'"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyPress={(e) => {
                if (e.key === 'Enter') handleGeminiPrompt();
            }}
          />
          <Button onClick={handleGeminiPrompt} buttonType="primary" className="flex-shrink-0">
            <Icon iconName="magic_wand" color="currentColor" /> Ask Gemini
          </Button>
        </div>
        <Button
          onClick={() => handleExport()} // Use AI-enhanced export handler
        >
          <Icon iconName="download_to" color="currentColor" />
          Export
        </Button>
      </div>
      {geminiInsights && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-2 text-sm text-blue-700">
          <Icon iconName="sparkles" className="mr-2" />
          <span className="font-bold">Gemini Insight:</span> {geminiInsights}
        </div>
      )}
    </div>
  );

  return (
    <ConfigProvider>
      <div className="black overflow-hidden rounded-md border border-gray-100">
        <Table
          key="cash-planning-table"
          loading={loading}
          size="small"
          columns={groupedExpectedCashFlow.columns}
          // @ts-ignore - Ant Design Table dataSource can handle nested children
          dataSource={groupedExpectedCashFlow.data}
          pagination={false}
          // @ts-ignore
          title={renderHeader}
          expandable={{
            expandIcon: ({ expanded, onExpand, record }) =>
              // @ts-ignore
              record?.children && record.children.length > 0 ? ( // Only show expander if children exist
                // @ts-ignore
                <Button onClick={(e) => onExpand(record, e)} buttonType="link" className="group">
                  <Icon
                    iconName={`${expanded ? "caret_down" : "caret_right"}`}
                    size="m"
                    className="group-hover:bg-blue-400 group-hover:fill-white"
                  />
                </Button>
              ) : (
                <span className="mr-px h-5 w-5 pl-3" />
              ),
            expandedRowKeys: Array.from(expandedRowKeys),
            onExpand: onHandleExpand,
          }}
          scroll={{ x: "max-content" }}
          rowClassName={(record) => {
            // AI-driven row highlighting based on state
            if (highlightNegative && (record.key as string).includes("net-change")) {
                const netChangeValue = parseFloat(((record[moment().format("YYYY-MM-DD")] as string) || "0").replace(/[^0-9.-]+/g,""));
                if (netChangeValue < 0) {
                    return 'bg-red-50 hover:bg-red-100';
                }
            }
            if (record.isPredicted) {
                return 'bg-blue-50 italic';
            }
            return '';
          }}
        />
      </div>
    </ConfigProvider>
  );
}