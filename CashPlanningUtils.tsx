// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useEffect } from "react";
import moment from "moment";
import { Rectangle, TooltipProps } from "recharts";
import { get } from "lodash";
import colors from "../../../common/styles/colors";
import {
  TimeFormatEnum,
  TimeUnitEnum,
} from "../../../generated/dashboard/graphqlSchema";
import { formatAmount } from "../../../common/utilities/formatAmount";

// --- Gemini Integration: Core AI Infrastructure Emulation ---
// These are conceptual "living endpoints" that would interface with actual Gemini services.
// For this self-contained universe, they are emulated directly within the file,
// encapsulating the logic as per the "Self-Contained Universe" directive.

/**
 * Represents a dynamic, AI-driven context store that remembers interactions.
 * In a production system, this would be a distributed, persistent memory service.
 */
export class GeminiContextStore {
  private static instance: GeminiContextStore;
  private context: Record<string, any> = {};
  private constructor() {}

  public static getInstance(): GeminiContextStore {
    if (!GeminiContextStore.instance) {
      GeminiContextStore.instance = new GeminiContextStore();
    }
    return GeminiContextStore.instance;
  }

  public async setContext(key: string, value: any, ttlSeconds?: number): Promise<void> {
    console.log(`[GeminiContextStore] Storing context for '${key}'. Value:`, value);
    this.context[key] = { value, timestamp: Date.now(), expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined };
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  public async getContext<T>(key: string): Promise<T | undefined> {
    const entry = this.context[key];
    if (entry) {
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        console.log(`[GeminiContextStore] Context for '${key}' expired.`);
        delete this.context[key];
        return undefined;
      }
      console.log(`[GeminiContextStore] Retrieving context for '${key}'. Value:`, entry.value);
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 30));
      return entry.value as T;
    }
    console.log(`[GeminiContextStore] No context found for '${key}'.`);
    return undefined;
  }

  public async observeContext(key: string, callback: (value: any) => void): Promise<() => void> {
    // In a real system, this would set up a subscription to a real-time context service.
    console.log(`[GeminiContextStore] Observing context for '${key}'.`);
    let lastValue = await this.getContext(key);
    if (lastValue !== undefined) {
      callback(lastValue);
    }
    const intervalId = setInterval(async () => {
      const currentValue = await this.getContext(key);
      if (JSON.stringify(currentValue) !== JSON.stringify(lastValue)) {
        callback(currentValue);
        lastValue = currentValue;
      }
    }, 1000); // Check every second for changes
    return () => clearInterval(intervalId); // Return unsubscribe function
  }
}

/**
 * Manages prompt-based learning pipelines. This would interface with a large language model (LLM).
 */
export class GeminiPromptOrchestrator {
  private static instance: GeminiPromptOrchestrator;
  private contextStore: GeminiContextStore;

  private constructor(contextStore: GeminiContextStore) {
    this.contextStore = contextStore;
  }

  public static getInstance(contextStore: GeminiContextStore): GeminiPromptOrchestrator {
    if (!GeminiPromptOrchestrator.instance) {
      GeminiPromptOrchestrator.instance = new GeminiPromptOrchestrator(contextStore);
    }
    return GeminiPromptOrchestrator.instance;
  }

  /**
   * Generates a dynamic prompt based on current context and predefined templates.
   * @param templateName Identifier for the prompt template.
   * @param variables Variables to inject into the template.
   * @param userContext Any specific user context for personalization.
   * @returns An AI-generated prompt string.
   */
  public async generatePrompt(templateName: string, variables: Record<string, any> = {}, userContext: Record<string, any> = {}): Promise<string> {
    await GeminiTelemetry.logEvent('PromptGenerationAttempt', { templateName, variablesKeys: Object.keys(variables) }, 'debug');
    const globalContext = await this.contextStore.getContext('global_cash_planning_context') || {};
    const promptTemplates: Record<string, string> = {
      "cashFlowAnalysis": `Analyze the following cash flow data for date {{date}}. Inflows: {{inflows}}, Outflows: {{outflows}}, Net Change: {{netChange}}. Current balance: {{endingBalance}}.
        Considering the global context of {{globalMarketSentiment}} and user preference for {{riskTolerance}}, provide a concise summary, key insights, and a potential future trend.`,
      "dateRangeSuggestion": `Based on historical cash flow patterns and the current market sentiment of {{marketSentiment}}, what would be the optimal date range filter for a user with {{userEngagementLevel}}?
        Consider recent financial events: {{recentEvents}}. Provide options in 'Next X Days' or 'Next X Weeks/Months' format, including a brief reason for each.`,
      "complianceCheck": `Review the cash flow projection for date {{date}} with ending balance {{endingBalance}} and net change {{netChange}}.
        Assess against compliance rules: max_negative_balance_threshold={{threshold}}, min_reserve_ratio={{reserveRatio}}.
        Is this compliant? If not, suggest corrective actions. Context: {{complianceJurisdiction}}`,
      "legendCommentary": `Given the chart legend items: {{legendItems}} and the current visualization context, provide a brief, insightful commentary (max 2 sentences). Mention historical data relevance.`
    };

    let prompt = promptTemplates[templateName] || `Unknown prompt template: ${templateName}`;

    // Combine all variables for injection
    const allVariables = { ...globalContext, ...userContext, ...variables };

    // Simple variable injection (in real LLM integration, this is more sophisticated)
    for (const key in allVariables) {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), String(allVariables[key]));
    }

    await this.contextStore.setContext('last_generated_prompt', prompt, 60); // Remember last prompt for 60 seconds
    await GeminiTelemetry.logEvent('PromptGenerationSuccess', { templateName, promptLength: prompt.length }, 'debug');
    return prompt;
  }

  /**
   * Sends a prompt to an AI model and returns a structured decision or insight.
   * @param prompt The generated prompt string.
   * @param modelConfig Configuration for the AI model (e.g., temperature, max_tokens).
   * @returns An AI-generated response.
   */
  public async getAIResponse<T>(prompt: string, modelConfig: Record<string, any> = {}): Promise<T> {
    await GeminiTelemetry.logEvent('AIResponseRequest', { promptPreview: prompt.substring(0, 100) });
    // Simulate AI model processing time and response structure
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

    const simulatedResponses: Record<string, any> = {
      "cashFlowAnalysis": {
        summary: "Stable cash flow expected with consistent inflows.",
        insights: ["Strong inflows from digital channels continue.", "Minor outflows noted in operational expenses."],
        trend: "Slightly positive short-term trend, indicating healthy liquidity.",
        confidence: 0.88
      },
      "dateRangeSuggestion": [
        { value: "next7Days", label: "Next 7 Days", reason: "Focus on immediate liquidity management due to upcoming large payment." },
        { value: "next30Days", label: "Next 30 Days", reason: "Standard period for monthly reconciliation and budget planning." },
        { value: "next90Days", label: "Next 90 Days", reason: "Optimal for mid-term strategic cash flow forecasting amidst market volatility." },
      ],
      "complianceCheck": {
        isCompliant: true,
        details: "Meets all regulatory requirements for minimum reserve and maximum negative balance. AI did not detect anomalies.",
        suggestedActions: []
      },
      "legendCommentary": {
        commentary: "This chart visualizes both historical and projected cash movements, offering a dual perspective on your financial trajectory. Historical data, though limited to recent days, grounds the forward-looking expectations."
      }
    };

    let response: any;
    if (prompt.includes("Analyze the following cash flow data")) {
      response = { ...simulatedResponses.cashFlowAnalysis, promptUsed: prompt };
    } else if (prompt.includes("optimal date range filter")) {
      response = { suggestions: simulatedResponses.dateRangeSuggestion, promptUsed: prompt };
    } else if (prompt.includes("Assess against compliance rules")) {
      response = { ...simulatedResponses.complianceCheck, promptUsed: prompt };
    } else if (prompt.includes("chart legend items")) {
      response = { ...simulatedResponses.legendCommentary, promptUsed: prompt };
    } else {
      response = { genericResponse: "AI processed your request.", promptUsed: prompt };
    }

    await GeminiTelemetry.logEvent('AIResponseSuccess', { promptPreview: prompt.substring(0, 100), responseSummary: JSON.stringify(response).substring(0, 100) }, 'debug');
    return response as T;
  }
}

/**
 * Provides production-grade observability for all system interactions.
 * This would typically connect to a distributed tracing and logging system.
 */
export class GeminiTelemetryService {
  private static instance: GeminiTelemetryService;
  private contextStore: GeminiContextStore;

  private constructor(contextStore: GeminiContextStore) {
    this.contextStore = contextStore;
  }

  public static getInstance(contextStore: GeminiContextStore): GeminiTelemetryService {
    if (!GeminiTelemetryService.instance) {
      GeminiTelemetryService.instance = new GeminiTelemetryService(contextStore);
    }
    return GeminiTelemetryService.instance;
  }

  public async logEvent(eventType: string, payload: Record<string, any>, severity: 'info' | 'warn' | 'error' | 'debug' = 'info'): Promise<void> {
    const userContext = await this.contextStore.getContext('user_session_context');
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, eventType, severity, payload, userContext };
    console.log(`[GeminiTelemetry] ${severity.toUpperCase()}:`, logEntry);
    // In a real system, this would send to an external logging/metrics service.
    await new Promise(resolve => setTimeout(resolve, 10)); // Simulate network call
  }

  public async captureMetric(metricName: string, value: number, tags: Record<string, string> = {}): Promise<void> {
    const userContext = await this.contextStore.getContext('user_session_context');
    const timestamp = new Date().toISOString();
    const metricEntry = { timestamp, metricName, value, tags, userContext };
    console.log(`[GeminiTelemetry] METRIC:`, metricEntry);
    // Send to an external metrics system (e.g., Prometheus, Datadog)
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  public async trackUserInteraction(userId: string, interactionType: string, details: Record<string, any>): Promise<void> {
    const timestamp = new Date().toISOString();
    const interactionEntry = { timestamp, userId, interactionType, details };
    console.log(`[GeminiTelemetry] USER_INTERACTION:`, interactionEntry);
    // Send to an analytics platform
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

/**
 * Implements circuit-breaking patterns for external service calls, enhancing system resilience.
 */
export class GeminiCircuitBreaker {
  private static instance: GeminiCircuitBreaker;
  private failureThreshold: number;
  private resetTimeout: number; // ms
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private telemetryService: GeminiTelemetryService;

  private constructor(telemetryService: GeminiTelemetryService, failureThreshold: number = 3, resetTimeout: number = 15000) {
    this.telemetryService = telemetryService;
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
  }

  public static getInstance(telemetryService: GeminiTelemetryService, failureThreshold?: number, resetTimeout?: number): GeminiCircuitBreaker {
    if (!GeminiCircuitBreaker.instance) {
      GeminiCircuitBreaker.instance = new GeminiCircuitBreaker(telemetryService, failureThreshold, resetTimeout);
    }
    return GeminiCircuitBreaker.instance;
  }

  public async execute<T>(serviceName: string, fn: () => Promise<T>, fallbackFn?: () => Promise<T>): Promise<T> {
    await this.telemetryService.logEvent('CircuitBreakerAttempt', { serviceName, state: this.state }, 'debug');

    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        await this.telemetryService.logEvent('CircuitBreakerStateChange', { serviceName, newState: 'HALF_OPEN' }, 'warn');
      } else {
        await this.telemetryService.logEvent('CircuitBreakerOpen', { serviceName }, 'warn');
        if (fallbackFn) {
          return fallbackFn();
        }
        throw new Error(`CircuitBreaker is OPEN for ${serviceName}`);
      }
    }

    try {
      const result = await fn();
      this.reset();
      await this.telemetryService.logEvent('CircuitBreakerSuccess', { serviceName }, 'debug');
      return result;
    } catch (error) {
      this.recordFailure(serviceName);
      await this.telemetryService.logEvent('CircuitBreakerFailure', { serviceName, error: (error as Error).message, failureCount: this.failureCount }, 'error');
      if (fallbackFn) {
        return fallbackFn();
      }
      throw error;
    }
  }

  private recordFailure(serviceName: string): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      await this.telemetryService.logEvent('CircuitBreakerStateChange', { serviceName, newState: 'OPEN' }, 'error');
    } else if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN'; // If it fails in HALF_OPEN, immediately go back to OPEN
      await this.telemetryService.logEvent('CircuitBreakerStateChange', { serviceName, newState: 'OPEN_FROM_HALF' }, 'error');
    }
  }

  private reset(): void {
    if (this.failureCount > 0) {
      this.telemetryService.logEvent('CircuitBreakerReset', { previousFailureCount: this.failureCount }, 'info');
    }
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
}

/**
 * Simulates an elastic API for dynamic service discovery and binding.
 */
export class GeminiElasticAPIService {
  private static instance: GeminiElasticAPIService;
  private registeredServices: Record<string, any> = {};
  private contextStore: GeminiContextStore;

  private constructor(contextStore: GeminiContextStore) {
    this.contextStore = contextStore;
    this.registerDefaultServices();
  }

  public static getInstance(contextStore: GeminiContextStore): GeminiElasticAPIService {
    if (!GeminiElasticAPIService.instance) {
      GeminiElasticAPIService.instance = new GeminiElasticAPIService(contextStore);
    }
    return GeminiElasticAPIService.instance;
  }

  private registerDefaultServices() {
    // These are instantiated globally at the end of this block
    // this.registerService('GeminiPredictiveEngine', GeminiPredictiveEngine.getInstance(this.contextStore));
    // this.registerService('GeminiComplianceAssessment', GeminiComplianceAssessment.getInstance(this.contextStore));
    // this.registerService('GeminiSecurityModule', GeminiSecurityModule.getInstance(this.contextStore));
    // this.registerService('GeminiFeatureFlagManager', GeminiFeatureFlagManager.getInstance(this.contextStore));
  }

  public registerService(name: string, serviceInstance: any): void {
    console.log(`[GeminiElasticAPI] Registering service: ${name}`);
    this.registeredServices[name] = serviceInstance;
    this.contextStore.setContext(`service_discovery_${name}`, { available: true, timestamp: Date.now() }, 3600); // Cache service availability
  }

  public async getService<T>(name: string): Promise<T> {
    const serviceAvailability = await this.contextStore.getContext(`service_discovery_${name}`);
    if (!serviceAvailability || !serviceAvailability.available) {
      // In a real system, this would trigger dynamic lookup/provisioning
      throw new Error(`Service '${name}' not dynamically discoverable or available.`);
    }

    const service = this.registeredServices[name];
    if (!service) {
      throw new Error(`Service '${name}' not found in registry.`);
    }
    console.log(`[GeminiElasticAPI] Dynamically resolving service: ${name}`);
    return service as T;
  }

  /**
   * Allows internal logic to choose optimal services based on runtime intelligence.
   * @param category The category of service needed (e.g., 'prediction', 'compliance').
   * @param criteria Specific criteria for selection.
   * @returns An optimal service instance.
   */
  public async getOptimalService<T>(category: string, criteria: Record<string, any> = {}): Promise<T> {
    await GeminiTelemetry.logEvent('OptimalServiceSelection', { category, criteriaKeys: Object.keys(criteria) });
    // This is where AI-driven decision making would occur for service selection.
    // For now, it's a simple lookup or a placeholder.
    switch (category) {
      case 'prediction':
        return this.getService<T>('GeminiPredictiveEngine');
      case 'compliance':
        return this.getService<T>('GeminiComplianceAssessment');
      case 'security':
        return this.getService<T>('GeminiSecurityModule');
      default:
        throw new Error(`No optimal service found for category: ${category}`);
    }
  }
}

/**
 * Handles security concerns: authentication, authorization, data encryption.
 */
export class GeminiSecurityModule {
  private static instance: GeminiSecurityModule;
  private contextStore: GeminiContextStore;

  private constructor(contextStore: GeminiContextStore) {
    this.contextStore = contextStore;
  }

  public static getInstance(contextStore: GeminiContextStore): GeminiSecurityModule {
    if (!GeminiSecurityModule.instance) {
      GeminiSecurityModule.instance = new GeminiSecurityModule(contextStore);
    }
    return GeminiSecurityModule.instance;
  }

  public async isAuthenticated(): Promise<boolean> {
    const userSession = await this.contextStore.getContext('user_session_context');
    // In a real system, this would check a JWT or session token.
    const authenticated = !!userSession?.userId;
    console.log(`[GeminiSecurity] User authenticated: ${authenticated}`);
    return authenticated;
  }

  public async authorize(permission: string, userId?: string): Promise<boolean> {
    const activeUserId = userId || (await this.contextStore.getContext('user_session_context'))?.userId;
    if (!activeUserId) {
      await GeminiTelemetry.logEvent('AuthorizationAttemptFailed', { permission, reason: 'no_user_context' }, 'warn');
      return false;
    }
    // Simulate role-based access control or AI-driven dynamic authorization
    const authorized = Math.random() > 0.1; // 90% chance of being authorized
    if (!authorized) {
      await this.contextStore.setContext('authorization_failure', { userId: activeUserId, permission, timestamp: Date.now() }, 300);
      await GeminiTelemetry.logEvent('AuthorizationFailure', { userId: activeUserId, permission }, 'warn');
    }
    console.log(`[GeminiSecurity] User ${activeUserId} authorized for '${permission}': ${authorized}`);
    return authorized;
  }

  public async encryptData(data: string): Promise<string> {
    // Placeholder for real encryption
    await GeminiTelemetry.logEvent('DataEncryption', { dataLength: data.length });
    return `ENCRYPTED(${data})`;
  }

  public async decryptData(encryptedData: string): Promise<string> {
    // Placeholder for real decryption
    await GeminiTelemetry.logEvent('DataDecryption', { dataLength: encryptedData.length });
    return encryptedData.replace('ENCRYPTED(', '').replace(')', '');
  }
}

/**
 * Manages dynamic feature flags, potentially AI-driven for A/B testing or personalized experiences.
 */
export class GeminiFeatureFlagManager {
  private static instance: GeminiFeatureFlagManager;
  private flags: Record<string, boolean | string> = {
    'predictive_insights_enabled': true,
    'dynamic_date_range_suggestions': true,
    'ai_tooltip_details': true,
    'cash_flow_compliance_checks': false, // Initially disabled
    'ai_driven_legend_commentary': true,
  };
  private contextStore: GeminiContextStore;

  private constructor(contextStore: GeminiContextStore) {
    this.contextStore = contextStore;
    this.loadRemoteFlags(); // Simulate loading from a remote config service
  }

  public static getInstance(contextStore: GeminiContextStore): GeminiFeatureFlagManager {
    if (!GeminiFeatureFlagManager.instance) {
      GeminiFeatureFlagManager.instance = new GeminiFeatureFlagManager(contextStore);
    }
    return GeminiFeatureFlagManager.instance;
  }

  private async loadRemoteFlags(): Promise<void> {
    await GeminiTelemetry.logEvent('FeatureFlagLoadAttempt', {});
    // In a real app, this would fetch from a feature flagging service (e.g., LaunchDarkly, Optimizely)
    // Could be AI-driven to optimize A/B test rollout or personalize features.
    await new Promise(resolve => setTimeout(resolve, 100));
    const remoteFlags = {
      'cash_flow_compliance_checks': Math.random() > 0.5, // 50% rollout for this example
      'new_prediction_model_v2': Math.random() > 0.3 // Gradual rollout
    };
    this.flags = { ...this.flags, ...remoteFlags };
    console.log(`[GeminiFeatureFlagManager] Loaded remote flags:`, this.flags);
    await GeminiTelemetry.logEvent('FeatureFlagLoadSuccess', { flagsLoaded: Object.keys(remoteFlags).length });
  }

  public async isFeatureEnabled(flagName: string, userId?: string): Promise<boolean> {
    const userContext = await this.contextStore.getContext('user_session_context');
    const effectiveUserId = userId || userContext?.userId;

    // AI-driven targeting logic could go here, e.g., based on user behavior, subscription tier, etc.
    if (flagName === 'new_prediction_model_v2' && effectiveUserId === 'vipUser123') {
      await GeminiTelemetry.logEvent('FeatureFlagOverride', { flagName, userId: effectiveUserId, reason: 'VIP_user' });
      return true; // VIPs always get new features
    }

    const isEnabled = !!this.flags[flagName];
    console.log(`[GeminiFeatureFlagManager] Feature '${flagName}' is enabled: ${isEnabled}`);
    return isEnabled;
  }

  public async getFeatureValue<T extends boolean | string>(flagName: string): Promise<T | undefined> {
    return this.flags[flagName] as T | undefined;
  }
}


/**
 * The core AI predictive engine for cash flow.
 */
export class GeminiPredictiveEngine {
  private static instance: GeminiPredictiveEngine;
  private promptOrchestrator: GeminiPromptOrchestrator;
  private telemetryService: GeminiTelemetryService;
  private contextStore: GeminiContextStore;

  private constructor(contextStore: GeminiContextStore) {
    this.contextStore = contextStore;
    this.promptOrchestrator = GeminiPromptOrchestrator.getInstance(contextStore);
    this.telemetryService = GeminiTelemetryService.getInstance(contextStore);
  }

  public static getInstance(contextStore: GeminiContextStore): GeminiPredictiveEngine {
    if (!GeminiPredictiveEngine.instance) {
      GeminiPredictiveEngine.instance = new GeminiPredictiveEngine(contextStore);
    }
    return GeminiPredictiveEngine.instance;
  }

  /**
   * Generates future cash flow predictions based on historical data, market trends, and contextual memory.
   * @param historicalData An array of past cash flow data.
   * @param futurePeriodDays Number of days into the future to predict.
   * @param userPreferences User-specific preferences (e.g., risk tolerance).
   * @returns Predicted cash flow data with confidence scores and insights.
   */
  public async getCashFlowPredictions(
    historicalData: GenericJoinedDataType[],
    futurePeriodDays: number,
    userPreferences: Record<string, any> = {},
  ): Promise<{ predictions: GenericJoinedDataType[]; insights: string[]; confidence: number; modelUsed: string }> {
    await GeminiSecurity.authorize('access_predictive_analytics');
    const isFeatureEnabled = await GeminiFeatureFlagManager.getInstance(this.contextStore).isFeatureEnabled('predictive_insights_enabled');
    if (!isFeatureEnabled) {
      await this.telemetryService.logEvent('PredictiveEngineBlocked', { reason: 'feature_flag_disabled' }, 'warn');
      return { predictions: [], insights: ["Predictive insights are currently disabled."], confidence: 0, modelUsed: 'N/A' };
    }

    await this.telemetryService.logEvent('PredictiveEngineCall', { historicalDataLength: historicalData.length, futurePeriodDays, userPreferences });

    const prompt = await this.promptOrchestrator.generatePrompt('cashFlowPrediction', {
      historicalSummary: historicalData.slice(-5).map(d => ({ date: d.date, netChange: d.netChange })), // Send last 5 days summary
      futurePeriodDays,
      userRiskTolerance: userPreferences.riskTolerance || (await this.contextStore.getContext('user_session_context'))?.riskTolerance || 'moderate'
    }, { userId: (await this.contextStore.getContext('user_session_context'))?.userId });

    const aiResponse = await this.promptOrchestrator.getAIResponse<{ predictions: GenericJoinedDataType[]; insights: string[]; confidence: number; modelUsed: string }>(prompt);

    const predictions = this.simulatePredictionLogic(historicalData, futurePeriodDays, aiResponse.confidence);
    const insights = aiResponse.insights || ["AI-generated insights will appear here."];
    const confidence = aiResponse.confidence || 0.75;

    await this.telemetryService.logEvent('PredictiveEngineResult', {
      futurePeriodDays,
      confidence,
      predictionCount: predictions.length,
      insights,
    }, 'info');

    return { predictions, insights, confidence, modelUsed: 'Gemini-CashFlow-v3.1' };
  }

  private simulatePredictionLogic(
    historicalData: GenericJoinedDataType[],
    futurePeriodDays: number,
    baseConfidence: number,
  ): GenericJoinedDataType[] {
    if (historicalData.length === 0) return [];

    const lastDataPoint = historicalData[historicalData.length - 1];
    const predictions: GenericJoinedDataType[] = [];
    let currentEndingBalance = lastDataPoint.endingBalance || 0;

    for (let i = 1; i <= futurePeriodDays; i++) {
      const date = moment(lastDataPoint.date).add(i, 'days').format('YYYY-MM-DD');
      const predictedNetChange = lastDataPoint.netChange * (1 + (Math.random() - 0.5) * 0.1); // +/- 5% variation
      currentEndingBalance += predictedNetChange;

      predictions.push({
        __typename: TYPE_NAME.PREDICTED, // Use PREDICTED type
        date,
        endingBalance: parseFloat(currentEndingBalance.toFixed(2)),
        expectedInflows: { total: Math.max(0, predictedNetChange * 0.7 + Math.random() * 500) }, // Simulate components
        expectedOutflows: { total: Math.max(0, predictedNetChange * 0.3 + Math.random() * 500) },
        netChange: parseFloat(predictedNetChange.toFixed(2)),
        predictionConfidence: baseConfidence * (1 - (i / futurePeriodDays) * 0.2), // Confidence decreases over time
        geminiAnalysisContext: `Prediction for ${date} based on historical trend and AI model.`
      });
    }
    return predictions;
  }

  /**
   * Adapts the prediction model based on feedback.
   * @param feedback Positive/negative feedback, actual outcomes vs. predictions.
   * @returns A status indicating if adaptation was successful.
   */
  public async adaptModel(feedback: Record<string, any>): Promise<boolean> {
    await this.telemetryService.logEvent('PredictiveEngineAdaptationAttempt', { feedback });
    // In a real system, this would trigger model retraining or fine-tuning.
    console.log("[GeminiPredictiveEngine] Adapting model based on feedback:", feedback);
    await this.contextStore.setContext('model_adaptation_feedback', feedback, 3600);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate adaptation time
    await this.telemetryService.logEvent('PredictiveEngineAdaptationSuccess', { feedback });
    return true;
  }
}

/**
 * AI-driven compliance assessment for cash planning scenarios.
 */
export class GeminiComplianceAssessment {
  private static instance: GeminiComplianceAssessment;
  private promptOrchestrator: GeminiPromptOrchestrator;
  private telemetryService: GeminiTelemetryService;
  private contextStore: GeminiContextStore;

  private constructor(contextStore: GeminiContextStore) {
    this.contextStore = contextStore;
    this.promptOrchestrator = GeminiPromptOrchestrator.getInstance(contextStore);
    this.telemetryService = GeminiTelemetryService.getInstance(contextStore);
  }

  public static getInstance(contextStore: GeminiContextStore): GeminiComplianceAssessment {
    if (!GeminiComplianceAssessment.instance) {
      GeminiComplianceAssessment.instance = new GeminiComplianceAssessment(contextStore);
    }
    return GeminiComplianceAssessment.instance;
  }

  /**
   * Assesses a cash flow scenario against predefined and AI-learned compliance rules.
   * @param data The cash flow data point to assess.
   * @param ruleSet Specific compliance rules to apply (or auto-detect).
   * @param jurisdiction Regulatory jurisdiction (e.g., 'US', 'EU').
   * @returns Compliance status, details, and suggested actions.
   */
  public async assessCashFlowCompliance(
    data: GenericJoinedDataType,
    ruleSet: Record<string, any> = {},
    jurisdiction: string = 'Global',
  ): Promise<{ isCompliant: boolean; details: string; suggestedActions: string[]; complianceScore: number }> {
    await GeminiSecurity.authorize('assess_cash_flow_compliance');
    const isFeatureEnabled = await GeminiFeatureFlagManager.getInstance(this.contextStore).isFeatureEnabled('cash_flow_compliance_checks');
    if (!isFeatureEnabled) {
      await this.telemetryService.logEvent('ComplianceCheckBlocked', { reason: 'feature_flag_disabled' }, 'warn');
      return { isCompliant: true, details: "Compliance checks are disabled by feature flag.", suggestedActions: [], complianceScore: 1.0 };
    }

    await this.telemetryService.logEvent('ComplianceAssessmentCall', { date: data.date, jurisdiction });

    const activeRules = await this.contextStore.getContext('active_compliance_rules') || {};
    const effectiveRules = {
      max_negative_balance_threshold: -50000, // Default no more than -$50k allowed
      min_reserve_ratio: 0.15, // Default 15% of inflows must be kept as reserve
      ...activeRules, // Override with dynamically loaded rules
      ...ruleSet,    // Override with specific call rules
    };

    const prompt = await this.promptOrchestrator.generatePrompt('complianceCheck', {
      date: data.date,
      endingBalance: data.endingBalance,
      netChange: data.netChange,
      inflows: data.expectedInflows?.total || 0,
      outflows: data.expectedOutflows?.total || 0,
      threshold: effectiveRules.max_negative_balance_threshold,
      reserveRatio: effectiveRules.min_reserve_ratio,
      complianceJurisdiction: jurisdiction
    }, { userId: (await this.contextStore.getContext('user_session_context'))?.userId });

    const aiResponse = await this.promptOrchestrator.getAIResponse<{ isCompliant: boolean; details: string; suggestedActions: string[] }>(prompt);

    let isCompliant = aiResponse.isCompliant;
    let details = aiResponse.details;
    let suggestedActions = aiResponse.suggestedActions;
    let complianceScore = 1.0; // Default to full compliance

    // Enforce hard rules even if AI gives a different opinion (AI can provide context, but hard rules are hard)
    const currentBalance = data.endingBalance || 0;
    const totalInflows = data.expectedInflows?.total || 0;

    if (currentBalance < effectiveRules.max_negative_balance_threshold) {
      isCompliant = false;
      details = `Breached negative balance threshold ($${effectiveRules.max_negative_balance_threshold}). ` + details;
      suggestedActions.push("Increase liquidity through short-term borrowing or asset liquidation.");
      complianceScore -= 0.3;
    }
    if (totalInflows > 0 && currentBalance < (totalInflows * effectiveRules.min_reserve_ratio)) {
      isCompliant = false;
      details = `Breached minimum reserve ratio (${effectiveRules.min_reserve_ratio * 100}% of inflows). ` + details;
      suggestedActions.push("Allocate more funds to reserves; review spending patterns.");
      complianceScore -= 0.2;
    }

    if (!isCompliant) {
      await this.telemetryService.logEvent('ComplianceViolation', { date: data.date, details, suggestedActions }, 'error');
    } else {
      await this.telemetryService.logEvent('ComplianceSuccess', { date: data.date }, 'info');
    }

    return {
      isCompliant,
      details,
      suggestedActions,
      complianceScore: parseFloat(Math.max(0, complianceScore).toFixed(2)) // Ensure score doesn't go negative
    };
  }

  /**
   * Adapts compliance rules based on new regulations or organizational policy updates.
   * This would typically involve fine-tuning an underlying AI model.
   */
  public async adaptComplianceRules(newRules: Record<string, any>): Promise<boolean> {
    await this.telemetryService.logEvent('ComplianceRuleAdaptationAttempt', { newRules });
    console.log("[GeminiComplianceAssessment] Adapting compliance rules:", newRules);
    await this.contextStore.setContext('active_compliance_rules', newRules, 86400); // Store new rules for 24 hours
    await new Promise(resolve => setTimeout(resolve, 300));
    await this.telemetryService.logEvent('ComplianceRuleAdaptationSuccess', { newRules });
    return true;
  }
}

// Instantiate core Gemini services (living endpoints) - these are singleton instances.
export const GeminiContext = GeminiContextStore.getInstance();
export const GeminiTelemetry = GeminiTelemetryService.getInstance(GeminiContext);
export const GeminiPrompt = GeminiPromptOrchestrator.getInstance(GeminiContext);
export const GeminiCircuit = GeminiCircuitBreaker.getInstance(GeminiTelemetry);
export const GeminiElasticAPI = GeminiElasticAPIService.getInstance(GeminiContext);
export const GeminiSecurity = GeminiSecurityModule.getInstance(GeminiContext);
export const GeminiFeatureFlagManagerInstance = GeminiFeatureFlagManager.getInstance(GeminiContext);

// Register services with the Elastic API for dynamic discovery
GeminiElasticAPI.registerService('GeminiPredictiveEngine', GeminiPredictiveEngine.getInstance(GeminiContext));
GeminiElasticAPI.registerService('GeminiComplianceAssessment', GeminiComplianceAssessment.getInstance(GeminiContext));
GeminiElasticAPI.registerService('GeminiSecurityModule', GeminiSecurityModule.getInstance(GeminiContext));
GeminiElasticAPI.registerService('GeminiFeatureFlagManager', GeminiFeatureFlagManagerInstance);


// --- End Gemini Core Integration ---

export const TYPE_NAME = {
  HISTORICAL: "HistoricalCashFlow",
  EXPECTED: "ExpectedCashFlowByDate",
  PREDICTED: "PredictedCashFlow", // New type for AI predictions
};

export interface HistoricalBalanceType {
  asOfDate: string;
  amount: number;
  source?: string; // Where did this data come from?
  validationStatus?: 'VALID' | 'INVALID' | 'PENDING_AI_REVIEW' | 'AI_VALIDATED'; // AI can validate
  aiConfidence?: number; // Confidence level of AI validation
}

export interface GenericJoinedDataType {
  __typename?: string | undefined;
  date: string;
  endingBalance?: number | null | undefined;
  expectedInflows: {
    total: number;
    // Potentially AI-categorized inflows for granular analysis
    categories?: Record<string, number>;
  };
  expectedOutflows: {
    total: number;
    // Potentially AI-categorized outflows for granular analysis
    categories?: Record<string, number>;
  };
  netChange: number;
  predictionConfidence?: number; // Added for AI predictions (0 to 1)
  geminiAnalysisContext?: string; // AI-generated context or explanation
  complianceStatus?: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW' | 'FLAGGED_BY_AI'; // AI-driven compliance
  complianceDetails?: string; // Details from compliance assessment
  complianceScore?: number; // Numeric score from AI compliance (0 to 1)
  [key: string]: unknown;
}

/**
 * Provides the default, static date range filter options.
 * For AI-driven dynamic options, use `getGeminiSuggestedDateRangeOptions`.
 */
export const DEFAULT_DATE_RANGE_FILTER_OPTIONS = [
  {
    value: "nextWeek",
    label: "Next 7 Days",
    dateRange: {
      inTheNext: { unit: TimeUnitEnum.Weeks, amount: "1" },
      format: TimeFormatEnum.Duration,
    },
  },
  {
    value: "nextMonth",
    label: "Next 30 Days",
    dateRange: {
      inTheNext: { unit: TimeUnitEnum.Days, amount: "30" },
      format: TimeFormatEnum.Duration,
    },
  },
  {
    value: "nextYear",
    label: "Next 90 Days", // Original was "Next 90 Days", but value was "nextYear". Harmonizing here.
    dateRange: {
      inTheNext: { unit: TimeUnitEnum.Days, amount: "90" },
      format: TimeFormatEnum.Duration,
    },
  },
];

/**
 * An AI-driven service function that suggests optimal date ranges based on contextual understanding.
 * This extends the functionality of static date range filters with AI intelligence.
 */
export const getGeminiSuggestedDateRangeOptions = async (): Promise<
  Array<{
    value: string;
    label: string;
    dateRange: {
      inTheNext: { unit: TimeUnitEnum; amount: string };
      format: TimeFormatEnum;
    };
    reason: string; // AI-provided reason for the suggestion
  }>
> => {
  await GeminiSecurity.authorize('access_dynamic_date_ranges');
  const isFeatureEnabled = await GeminiFeatureFlagManagerInstance.isFeatureEnabled('dynamic_date_range_suggestions');
  if (!isFeatureEnabled) {
    await GeminiTelemetry.logEvent('DynamicDateRangeBlocked', { reason: 'feature_flag_disabled' }, 'warn');
    return DEFAULT_DATE_RANGE_FILTER_OPTIONS.map(opt => ({ ...opt, reason: 'AI suggestions disabled by feature flag.' }));
  }

  await GeminiTelemetry.logEvent('DynamicDateRangeRequest', {});

  const userSession = await GeminiContext.getContext('user_session_context') || { userId: 'anonymous' };
  const globalMarketSentiment = await GeminiContext.getContext('global_market_sentiment') || 'neutral';
  const recentFinancialEvents = await GeminiContext.getContext('recent_financial_events') || [];
  const userEngagementLevel = await GeminiContext.getContext('user_engagement_level') || 'medium';

  const prompt = await GeminiPrompt.generatePrompt('dateRangeSuggestion', {
    marketSentiment: globalMarketSentiment,
    userEngagementLevel,
    recentEvents: recentFinancialEvents.join(', ')
  }, { userId: userSession.userId });

  try {
    const response = await GeminiCircuit.execute('DynamicDateRangeAI', () => GeminiPrompt.getAIResponse<{ suggestions: Array<{ value: string; label: string; reason: string }> }>(prompt), async () => {
      await GeminiTelemetry.logEvent('DynamicDateRangeFallback', { reason: 'AI_Service_Failure' }, 'warn');
      return { suggestions: DEFAULT_DATE_RANGE_FILTER_OPTIONS.map(opt => ({ ...opt, reason: 'Fallback: AI service unavailable.' })) };
    });

    const aiSuggestions = response.suggestions.map((sugg) => {
      // Map AI suggestions to the expected structure.
      let unit = TimeUnitEnum.Days;
      let amount = "30"; // Default
      const matchDays = sugg.label.match(/Next (\d+) Days/);
      if (matchDays && matchDays[1]) {
        amount = matchDays[1];
      } else if (sugg.label.includes("Week")) {
        unit = TimeUnitEnum.Weeks;
        const weekMatch = sugg.label.match(/Next (\d+) Week/);
        amount = (weekMatch && weekMatch[1]) ? weekMatch[1] : "1";
      } else if (sugg.label.includes("Month")) {
        unit = TimeUnitEnum.Months;
        const monthMatch = sugg.label.match(/Next (\d+) Month/);
        amount = (monthMatch && monthMatch[1]) ? monthMatch[1] : "1";
      }

      return {
        value: sugg.value,
        label: sugg.label,
        dateRange: {
          inTheNext: { unit: unit, amount: amount },
          format: TimeFormatEnum.Duration,
        },
        reason: sugg.reason,
      };
    });

    await GeminiTelemetry.logEvent('DynamicDateRangeSuccess', { suggestionsCount: aiSuggestions.length }, 'info');
    return aiSuggestions;
  } catch (error) {
    await GeminiTelemetry.logEvent('DynamicDateRangeError', { error: (error as Error).message }, 'error');
    return DEFAULT_DATE_RANGE_FILTER_OPTIONS.map(opt => ({ ...opt, reason: `Error fetching AI suggestions: ${(error as Error).message}` }));
  }
};


/**
 * AI-driven decision for interval frequency.
 * Remembers past user interactions and data characteristics to optimize display.
 */
export const intervalFrequency = async (dataLength: number) => {
  await GeminiTelemetry.logEvent('IntervalFrequencyCall', { dataLength });
  const userPreference = await GeminiContext.getContext('user_chart_density_preference');
  const learnedOptimalFrequency = await GeminiContext.getContext('optimal_interval_frequency_for_dataLength_' + dataLength);

  if (learnedOptimalFrequency !== undefined) {
    await GeminiTelemetry.logEvent('IntervalFrequencyLearned', { dataLength, frequency: learnedOptimalFrequency });
    return learnedOptimalFrequency;
  }

  // AI-driven decision logic based on data length, potentially user context, etc.
  let frequency = dataLength <= 9 ? 0 : 1; // Original base logic
  if (dataLength > 50) frequency = 5; // For very large datasets, show less detail
  if (dataLength > 100) frequency = 10; // Even less detail
  if (userPreference === 'high_detail' && dataLength < 30) frequency = 0; // Override for high detail
  if (userPreference === 'low_detail') frequency = 2; // Override for low detail

  await GeminiContext.setContext('optimal_interval_frequency_for_dataLength_' + dataLength, frequency, 3600); // Remember for an hour
  await GeminiTelemetry.logEvent('IntervalFrequencyCalculated', { dataLength, frequency });
  return frequency;
};

/**
 * Renders the legend with AI-driven contextual commentary and insights.
 * Uses React hooks to manage asynchronous AI data fetching.
 */
export const renderLegend = ({
  mapping,
  width,
  height,
}: {
  mapping: Record<string, object>;
  width: number;
  height: number;
}) => {
  const [aiCommentary, setAiCommentary] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommentary = async () => {
      await GeminiSecurity.authorize('view_cash_planning_legend');
      const isFeatureEnabled = await GeminiFeatureFlagManagerInstance.isFeatureEnabled('ai_driven_legend_commentary');

      if (isFeatureEnabled) {
        try {
          const commentary = await GeminiCircuit.execute('LegendAICommentary', () => GeminiPrompt.getAIResponse<{ commentary: string }>(
            await GeminiPrompt.generatePrompt('legendCommentary', {
              legendItems: Object.keys(mapping).join(', '),
              visualContext: `Width: ${width}, Height: ${height}`
            })
          ).then(res => res.commentary || "No specific AI commentary."),
            async () => {
              await GeminiTelemetry.logEvent('LegendAICommentaryFallback', { reason: 'AI_Service_Failure' }, 'warn');
              return "AI commentary unavailable. Standard legend information displayed.";
            }
          );
          setAiCommentary(commentary);
          // Update global context with current legend items for other AI services
          await GeminiContext.setContext('current_legend_items', Object.keys(mapping), 300);
        } catch (error) {
          await GeminiTelemetry.logEvent('LegendAICommentaryError', { error: (error as Error).message }, 'error');
          setAiCommentary("Error fetching AI commentary.");
        }
      } else {
        setAiCommentary("Historical data is displayed for the past 2 days only."); // Default message
      }
    };
    fetchCommentary();
  }, [mapping, width, height]); // Re-fetch if mapping or dimensions change

  return (
    <div>
      <ul className="mt-4 flex flex-row gap-4">
        {Object.keys(mapping).map((key: string) => (
          <li key={key} className="flex flex-row items-center gap-2">
            <svg height={height} width={width}>
              <Rectangle
                x={0}
                y={0}
                height={height}
                width={width}
                radius={[2, 2, 2, 2]}
                strokeWidth={2}
                {...mapping[key]}
              />
            </svg>
            <p>{key}</p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-left text-gray-300">
        {aiCommentary === null ? 'Loading AI commentary...' : aiCommentary}
      </p>
    </div>
  );
};


interface CustomTooltipProps extends TooltipProps {
  mappings: Record<string, string>;
  currency: string;
  showAiInsights?: boolean; // Controls if AI insights are displayed
  onInsightFeedback?: (feedback: { data: GenericJoinedDataType; insight: string; rating: 'good' | 'bad' }) => void;
}

/**
 * An AI-enhanced tooltip that provides context-aware insights, compliance status,
 * and predictive confidence directly within the visualization.
 * It leverages Gemini's reasoning layers and contextual memory using React's `useState` and `useEffect`.
 */
export function CustomTooltip({
  active,
  payload,
  mappings,
  currency,
  showAiInsights = true,
  onInsightFeedback,
}: CustomTooltipProps) {
  const [aiInsights, setAiInsights] = useState<string[] | null>(null);
  const [complianceInfo, setComplianceInfo] = useState<
    { isCompliant: boolean; details: string; suggestedActions: string[]; complianceScore: number } | null
  >(null);
  const [isAiTooltipEnabled, setIsAiTooltipEnabled] = useState<boolean>(false);

  const data = payload && payload[0] ? (payload[0].payload as GenericJoinedDataType) : null;

  useEffect(() => {
    const fetchAiData = async () => {
      if (!data) return;

      await GeminiTelemetry.logEvent('CustomTooltipRender', { date: data.date, typename: data.__typename });
      await GeminiContext.setContext('last_viewed_cash_flow_data', data, 60); // Remember what the user is looking at

      const enabled = await GeminiFeatureFlagManagerInstance.isFeatureEnabled('ai_tooltip_details');
      setIsAiTooltipEnabled(enabled);

      if (showAiInsights && enabled) {
        try {
          // Use AI to generate deeper insights for the specific data point
          const insightPrompt = await GeminiPrompt.generatePrompt('cashFlowAnalysis', {
            date: data.date,
            inflows: data.expectedInflows?.total || 0,
            outflows: data.expectedOutflows?.total || 0,
            netChange: data.netChange,
            endingBalance: data.endingBalance,
            globalMarketSentiment: await GeminiContext.getContext('global_market_sentiment') || 'neutral',
            riskTolerance: (await GeminiContext.getContext('user_profile'))?.riskTolerance || 'moderate'
          });

          const aiResponse = await GeminiCircuit.execute('TooltipAIInsight', () => GeminiPrompt.getAIResponse<{ summary: string; insights: string[]; trend: string }>(insightPrompt), async () => {
            await GeminiTelemetry.logEvent('TooltipAIInsightFallback', { date: data.date, reason: 'AI_Service_Failure' }, 'warn');
            return { summary: "AI insights temporarily unavailable.", insights: [], trend: "" };
          });

          setAiInsights([aiResponse.summary, ...aiResponse.insights]);

          // Also perform compliance check if enabled
          if (await GeminiFeatureFlagManagerInstance.isFeatureEnabled('cash_flow_compliance_checks')) {
            const complianceResult = await GeminiCircuit.execute('TooltipComplianceCheck', () =>
              GeminiComplianceAssessment.getInstance(GeminiContext).assessCashFlowCompliance(data),
              async () => {
                await GeminiTelemetry.logEvent('TooltipComplianceFallback', { date: data.date, reason: 'Compliance_Service_Failure' }, 'warn');
                return { isCompliant: true, details: "Compliance check unavailable.", suggestedActions: [], complianceScore: 1.0 };
              }
            );
            setComplianceInfo(complianceResult);
          }
        } catch (error) {
          await GeminiTelemetry.logEvent('TooltipAIError', { date: data.date, error: (error as Error).message }, 'error');
          setAiInsights(["Error fetching AI insights."]);
        }
      } else {
        setAiInsights(null);
        setComplianceInfo(null);
      }
    };
    fetchAiData();
  }, [data, showAiInsights]); // Re-fetch if data or showAiInsights prop changes

  if (!active || !payload || !data) return null;

  // Simulate user feedback for AI insights
  const handleFeedback = (insight: string, rating: 'good' | 'bad') => {
    onInsightFeedback?.({ data, insight, rating });
    GeminiTelemetry.trackUserInteraction('currentUser', 'ai_insight_feedback', { date: data.date, insight, rating });
    // This feedback could be used by GeminiPredictiveEngine.adaptModel() or GeminiPrompt.adaptPromptTemplate()
  };

  return (
    <div className="rounded-md border bg-white p-4 drop-shadow-md">
      <div className="flex flex-col gap-2">
        <div>
          <p className="font-medium">
            {moment(data.date).format("MMM D YYYY")}
            {data.__typename === TYPE_NAME.PREDICTED && data.predictionConfidence !== undefined && (
              <span className="ml-2 text-xs text-blue-500">
                (AI Predicted: {Math.round(data.predictionConfidence * 100)}% Confident)
              </span>
            )}
          </p>
          {Object.keys(mappings).map((title: string) => (
            <span key={mappings[title]} className="flex flex-row gap-2">
              {data.__typename === TYPE_NAME.HISTORICAL
                ? "Current"
                : (data.__typename === TYPE_NAME.PREDICTED ? "Predicted" : "Expected")}{" "}
              {title}:
              <code>
                {formatAmount(Number(get(data, mappings[title])), currency)}
              </code>
            </span>
          ))}
        </div>

        {isAiTooltipEnabled && showAiInsights && aiInsights && aiInsights.length > 0 && (
          <div className="mt-2 border-t pt-2">
            <p className="font-semibold text-purple-700">Gemini Insights:</p>
            {aiInsights.map((insight, index) => (
              <p key={`insight-${index}`} className="text-sm text-gray-600">
                - {insight}
                {onInsightFeedback && (
                  <span className="ml-2 text-xs">
                    <button onClick={() => handleFeedback(insight, 'good')} className="text-green-500 hover:text-green-700 mr-1">👍</button>
                    <button onClick={() => handleFeedback(insight, 'bad')} className="text-red-500 hover:text-red-700">👎</button>
                  </span>
                )}
              </p>
            ))}
            {data.geminiAnalysisContext && (
              <p className="text-xs text-gray-500 italic mt-1">Context: {data.geminiAnalysisContext}</p>
            )}
          </div>
        )}

        {isAiTooltipEnabled && showAiInsights && complianceInfo && (
          <div className="mt-2 border-t pt-2">
            <p className="font-semibold">Compliance Status:</p>
            <p className={`text-sm ${complianceInfo.isCompliant ? 'text-green-600' : 'text-red-600'}`}>
              {complianceInfo.isCompliant ? 'Compliant' : 'Non-Compliant'}
              {complianceInfo.complianceScore !== undefined && (
                <span className="ml-2">({Math.round(complianceInfo.complianceScore * 100)}% Score)</span>
              )}
            </p>
            <p className="text-sm text-gray-700">{complianceInfo.details}</p>
            {complianceInfo.suggestedActions.length > 0 && (
              <div>
                <p className="text-sm font-medium mt-1">Suggested Actions:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {complianceInfo.suggestedActions.map((action, idx) => (
                    <li key={`action-${idx}`}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function LinearGradient({ offset }: { offset: string }) {
  return (
    <linearGradient id="fillColor" x1="0" y1="0" x2="1" y2="0">
      <stop offset={offset} stopColor="#7E9983" stopOpacity={0.6} />
      <stop offset={offset} stopColor="#7E998399" stopOpacity={0.2} />
    </linearGradient>
  );
}

/**
 * Hatch patterns, potentially selected or dynamically generated based on AI categorization
 * (e.g., high-risk outflows, predicted vs. actual variance).
 */
export function HatchPattern() {
  // AI could suggest different patterns or colors based on the data context.
  // For instance, a red hatch for high-risk outflows.
  // Here, we just embed the existing ones, but the decision of WHICH pattern to apply
  // in a chart would be an AI-driven one, perhaps controlled by a prop or context.
  return (
    <>
      <pattern
        id="expected_inflow"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <line
          x1="-10"
          y1="10"
          x2="0"
          y2="0"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill={colors.categorical["7"]}
          stroke={colors.categorical["7"]}
        />
        <line
          x1="0"
          y1="10"
          x2="10"
          y2="0"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill={colors.categorical["7"]}
          stroke={colors.categorical["7"]}
        />
        <line
          x1="10"
          y1="10"
          x2="20"
          y2="0"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill={colors.categorical["7"]}
          stroke={colors.categorical["7"]}
        />
      </pattern>
      <pattern
        id="expected_outflow"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <line
          strokeLinecap="square"
          strokeLinejoin="miter"
          x1="-10"
          y1="10"
          x2="0"
          y2="0"
          fill={colors.qualitative.neutral}
          stroke={colors.qualitative.neutral}
        />
        <line
          strokeLinecap="square"
          strokeLinejoin="miter"
          x1="0"
          y1="10"
          x2="10"
          y2="0"
          fill={colors.qualitative.neutral}
          stroke={colors.qualitative.neutral}
        />
        <line
          x1="10"
          y1="10"
          x2="20"
          y2="0"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill={colors.qualitative.neutral}
          stroke={colors.qualitative.neutral}
        />
      </pattern>
    </>
  );
}

// Global context initialization or simulation (e.g., market sentiment, user profile)
// This IIFE ensures that our AI services are initialized and populated with default context
// upon file execution, simulating dynamic environment setup.
(async () => {
  await GeminiContext.setContext('global_market_sentiment', 'stable_with_moderate_volatility', 3600);
  await GeminiContext.setContext('user_session_context', { userId: 'demoUser123', sessionId: 'abc-123', riskTolerance: 'moderate' }, 1800);
  await GeminiContext.setContext('recent_financial_events', ['interest_rate_hike_announcement', 'major_tech_stock_drop'], 7200);
  await GeminiContext.setContext('user_engagement_level', 'high', 3600);

  // Simulate an initial compliance rule set, which can be adapted later.
  await GeminiContext.setContext('active_compliance_rules', {
    max_negative_balance_threshold: -75000,
    min_reserve_ratio: 0.10,
    reporting_frequency: 'daily'
  }, 86400);

  await GeminiTelemetry.logEvent('GeminiSystemInitialized', { success: true }, 'info');
})();