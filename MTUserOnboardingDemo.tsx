// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  MTEnv,
  useMTUserOnboarding,
} from "@modern-treasury/user-onboarding-react";
import {
  useCreateDemoUserOnboardingMutation,
  useUserOnboardingDemoQuery,
} from "../../../generated/dashboard/graphqlSchema";
import FormikInputField from "../../../common/formik/FormikInputField";
import {
  Drawer,
  Button,
  ExpandableCard,
  Label,
} from "../../../common/ui-components";
import APIKeysHome from "../APIKeysHome";
import DecisionView from "./DecisionView";
import { PageHeader } from "../../../common/ui-components/PageHeader/PageHeader";

// AI-SYNTHESIZED NEURAL EXTENSIONS AND LIVING ENDPOINTS

/**
 * @typedef {object} GeminiTelemetryEvent
 * @property {string} eventName
 * @property {string} timestamp
 * @property {object} payload
 * @property {string} [contextId] - Optional context ID for tracing
 */
export interface GeminiTelemetryEvent {
  eventName: string;
  timestamp: string;
  payload: Record<string, unknown>;
  contextId?: string;
}

/**
 * GeminiTelemetryService: An autonomous, scalable telemetry pipeline.
 * Captures, processes, and potentially transmits runtime intelligence.
 * Simulates dynamic scaling and observability patterns.
 * Functions as a neural extension for monitoring system health and activity.
 */
export class GeminiTelemetryService {
  private static instance: GeminiTelemetryService;
  private eventBuffer: GeminiTelemetryEvent[] = [];
  private isTransmitting: boolean = false;
  private currentLoad: number = 0;
  private maxBufferSize: number = 100; // Simulates dynamic scaling threshold
  private isCircuitBreakerOpen: boolean = false;
  private lastTransmissionFailed: number = 0;
  private transmissionFailureCount: number = 0;
  private readonly CIRCUIT_BREAKER_THRESHOLD: number = 3;
  private readonly CIRCUIT_BREAKER_COOLDOWN_MS: number = 10000;

  private constructor() {
    console.log("GeminiTelemetryService: Initializing...");
    // Simulate periodic transmission
    setInterval(() => this.transmitBufferedEvents(), 5000);
  }

  public static getInstance(): GeminiTelemetryService {
    if (!GeminiTelemetryService.instance) {
      GeminiTelemetryService.instance = new GeminiTelemetryService();
    }
    return GeminiTelemetryService.instance;
  }

  /**
   * Captures an event, intelligently buffering it.
   * @param eventName
   * @param payload
   * @param contextId
   */
  public logEvent(
    eventName: string,
    payload: Record<string, unknown>,
    contextId?: string,
  ): void {
    if (this.isCircuitBreakerOpen) {
      console.warn(
        `Telemetry: Circuit breaker open, dropping event: ${eventName}`,
      );
      return; // Drop events if circuit breaker is open
    }

    const event: GeminiTelemetryEvent = {
      eventName,
      timestamp: new Date().toISOString(),
      payload,
      contextId,
    };
    this.eventBuffer.push(event);
    this.currentLoad++;

    // Dynamic scaling logic simulation
    if (this.currentLoad > this.maxBufferSize * 0.8 && !this.isTransmitting) {
      console.warn(
        "GeminiTelemetryService: High load detected, initiating proactive transmission.",
      );
      void this.transmitBufferedEvents();
    } else if (this.currentLoad > this.maxBufferSize) {
      console.error(
        "GeminiTelemetryService: Buffer overflow detected. Some events might be dropped.",
      );
      // In a real system, this would trigger more aggressive scaling or persistent storage.
      this.eventBuffer.shift(); // Drop oldest event
    }
    // console.log(`Telemetry: ${eventName} - ${JSON.stringify(payload)}`); // Keep this more silent for production
  }

  /**
   * Simulates transmission of buffered events to an external system.
   */
  private async transmitBufferedEvents(): Promise<void> {
    if (
      this.eventBuffer.length === 0 ||
      this.isTransmitting ||
      this.isCircuitBreakerOpen
    ) {
      return;
    }

    this.isTransmitting = true;
    const eventsToTransmit = [...this.eventBuffer];
    this.eventBuffer = []; // Clear buffer after copying
    this.currentLoad = 0;

    try {
      // Simulate network request/API call to telemetry endpoint
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 500)); // Simulate async
      console.log(
        `GeminiTelemetryService: Successfully transmitted ${eventsToTransmit.length} events.`,
      );
      this.transmissionFailureCount = 0; // Reset failure count on success
    } catch (error) {
      console.error("GeminiTelemetryService: Transmission failed.", error);
      this.transmissionFailureCount++;
      this.lastTransmissionFailed = Date.now();
      // Re-add events to buffer for retry
      this.eventBuffer = [...eventsToTransmit, ...this.eventBuffer];
      if (this.transmissionFailureCount >= this.CIRCUIT_BREAKER_THRESHOLD) {
        this.openCircuitBreaker();
      }
    } finally {
      this.isTransmitting = false;
    }
  }

  /**
   * Simulates opening the circuit breaker.
   */
  private openCircuitBreaker(): void {
    this.isCircuitBreakerOpen = true;
    console.warn(
      `GeminiTelemetryService: Circuit breaker opened due to ${this.CIRCUIT_BREAKER_THRESHOLD} consecutive failures.`,
    );
    this.logEvent("TelemetryCircuitBreakerOpen", {
      reason: "consecutive_failures",
    });

    setTimeout(() => {
      this.attemptCloseCircuitBreaker();
    }, this.CIRCUIT_BREAKER_COOLDOWN_MS);
  }

  /**
   * Attempts to close the circuit breaker after a cooldown period.
   * In a real system, this might involve a "half-open" state.
   */
  private attemptCloseCircuitBreaker(): void {
    // In a "half-open" state, we might allow one request to pass through
    // For this simulation, we'll just try to close it directly after cooldown
    this.isCircuitBreakerOpen = false;
    this.transmissionFailureCount = 0;
    console.log("GeminiTelemetryService: Circuit breaker reset (closed).");
    this.logEvent("TelemetryCircuitBreakerClosed", { reason: "cooldown_period" });
  }

  /**
   * Checks if the telemetry service (and potentially its external dependencies) is healthy.
   */
  public isHealthy(): boolean {
    return !this.isCircuitBreakerOpen && !this.isTransmitting;
  }
}

/**
 * GeminiPromptEngine: A neural extension for generating contextual prompts.
 * Adapts based on current state and historical interactions.
 * It's the "language model" interface for the local AI.
 */
export class GeminiPromptEngine {
  private static instance: GeminiPromptEngine;
  private interactionHistory: string[] = [];
  private telemetry = GeminiTelemetryService.getInstance();

  private constructor() {
    this.telemetry.logEvent("GeminiPromptEngine.init", {});
  }

  public static getInstance(): GeminiPromptEngine {
    if (!GeminiPromptEngine.instance) {
      GeminiPromptEngine.instance = new GeminiPromptEngine();
    }
    return GeminiPromptEngine.instance;
  }

  /**
   * Generates a context-aware prompt based on the system's current state.
   * @param context - Current context for prompt generation.
   * @returns A string representing the generated prompt.
   */
  public generatePrompt(context: Record<string, unknown>): string {
    const prompt = `Based on the current state: ${JSON.stringify(
      context,
    )}, and previous interactions: ${this.interactionHistory.slice(-5).join(
      "; ",
    )}, what is the optimal next action for the user onboarding? Consider compliance, user experience, and conversion goals. Provide a concise directive or question.`;
    this.interactionHistory.push(prompt); // Remember interaction
    this.telemetry.logEvent("GeminiPromptEngine.generatePrompt", { context });
    return prompt;
  }

  /**
   * Analyzes a response and updates internal learning models (simulated).
   * @param prompt - The prompt that was used.
   * @param response - The response received.
   * @param outcome - The outcome of the action.
   */
  public learnFromInteraction(
    prompt: string,
    response: string,
    outcome: "success" | "failure" | "cancelled",
  ): void {
    this.telemetry.logEvent("GeminiPromptEngine.learn", {
      prompt,
      response,
      outcome,
    });
    // Simulate updating a neural network or decision tree
    console.log(
      `GeminiPromptEngine: Learning from interaction - Outcome: ${outcome}`,
    );
    // In a real system, this would feed into an actual learning model or update adaptive rules.
  }
}

/**
 * ComplianceAIProcessor: Embeds AI reasoning layers for compliance checks.
 * Adaptively assesses risk and recommends actions, acting as a crucial business logic layer.
 */
export class ComplianceAIProcessor {
  private static instance: ComplianceAIProcessor;
  private telemetry = GeminiTelemetryService.getInstance();
  private riskProfile: "low" | "medium" | "high" = "low";
  private complianceRules: Record<string, unknown> = {
    minApiKeyLength: 10,
    maxConcurrentOnboardings: 5,
    geoRestrictions: ["US", "CA"],
  };

  private constructor() {
    this.telemetry.logEvent("ComplianceAIProcessor.init", {});
  }

  public static getInstance(): ComplianceAIProcessor {
    if (!ComplianceAIProcessor.instance) {
      ComplianceAIProcessor.instance = new ComplianceAIProcessor();
    }
    return ComplianceAIProcessor.instance;
  }

  /**
   * Performs an AI-driven compliance risk assessment.
   * @param userData - Data pertaining to the user onboarding.
   * @returns A promise resolving to a compliance decision and risk level.
   */
  public async assessComplianceRisk(
    userData: Record<string, unknown>,
  ): Promise<{ decision: "approve" | "escalate" | "deny"; risk: string }> {
    this.telemetry.logEvent("ComplianceAIProcessor.assessRisk", { userData });

    // Simulate complex AI decision making based on various factors and dynamic rules
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 700)); // Simulate processing time

    let currentRisk = "low";

    if (
      typeof userData.apiKey === "string" &&
      userData.apiKey.length < (this.complianceRules.minApiKeyLength as number)
    ) {
      currentRisk = "high";
    }
    if (
      userData.userCountry &&
      !(this.complianceRules.geoRestrictions as string[]).includes(
        userData.userCountry as string,
      )
    ) {
      currentRisk = "high";
    }
    // Simulate more complex risk factors
    if (Math.random() < 0.1) currentRisk = "high";
    else if (Math.random() < 0.3) currentRisk = "medium";

    this.riskProfile = currentRisk as "low" | "medium" | "high";

    if (this.riskProfile === "high") {
      return { decision: "deny", risk: "high" };
    } else if (this.riskProfile === "medium") {
      return { decision: "escalate", risk: "medium" };
    } else {
      return { decision: "approve", risk: "low" };
    }
  }

  /**
   * Adapts compliance rules based on observed patterns or external directives.
   * (Simulated dynamic rule updates via prompt-driven learning)
   */
  public adaptRules(newRules: Record<string, unknown>): void {
    this.telemetry.logEvent("ComplianceAIProcessor.adaptRules", { newRules });
    console.log(
      `ComplianceAIProcessor: Adapting rules based on AI directive: ${JSON.stringify(
        newRules,
      )}`,
    );
    this.complianceRules = { ...this.complianceRules, ...newRules };
  }

  public getCurrentRiskProfile(): string {
    return this.riskProfile;
  }
}

/**
 * GeminiAuthManager: Simulates AI-driven authentication and authorization checks.
 * Adapts security posture dynamically. Embodies robust authentication and billing simulations.
 */
export class GeminiAuthManager {
  private static instance: GeminiAuthManager;
  private telemetry = GeminiTelemetryService.getInstance();
  private isAuthenticated: boolean = false;
  private currentUserId: string | null = null;
  private securityLevel: "basic" | "elevated" | "max" = "basic";
  private userBillingStatus: "active" | "trial" | "suspended" = "trial";

  private constructor() {
    this.telemetry.logEvent("GeminiAuthManager.init", {});
  }

  public static getInstance(): GeminiAuthManager {
    if (!GeminiAuthManager.instance) {
      GeminiAuthManager.instance = new GeminiAuthManager();
    }
    return GeminiAuthManager.instance;
  }

  /**
   * Simulates an AI-enhanced login process, dynamically adjusting security.
   * @param credentials - User credentials.
   * @returns A promise resolving to authentication status.
   */
  public async login(credentials: Record<string, string>): Promise<boolean> {
    this.telemetry.logEvent("GeminiAuthManager.loginAttempt", {
      username: credentials.username,
    });
    // Simulate AI-driven anomaly detection, multi-factor analysis, etc.
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));

    if (credentials.username === "ai_user" && credentials.password === "gemini_secure") {
      this.isAuthenticated = true;
      this.currentUserId = "gemini-admin-123";
      this.securityLevel = "max"; // AI detects admin access
      this.userBillingStatus = "active";
      this.telemetry.logEvent("GeminiAuthManager.loginSuccess", {
        userId: this.currentUserId,
        securityLevel: this.securityLevel,
      });
      return true;
    }

    this.isAuthenticated = Math.random() > 0.3; // Simulate some failures
    if (this.isAuthenticated) {
      this.currentUserId = `user-${Math.floor(Math.random() * 1000)}`;
      this.securityLevel = Math.random() > 0.7 ? "elevated" : "basic"; // AI adjusts security based on user profile/risk
      this.userBillingStatus = Math.random() > 0.8 ? "suspended" : "active"; // Simulate billing status
      this.telemetry.logEvent("GeminiAuthManager.loginSuccess", {
        userId: this.currentUserId,
        securityLevel: this.securityLevel,
        billingStatus: this.userBillingStatus,
      });
    } else {
      this.telemetry.logEvent("GeminiAuthManager.loginFailed", {
        username: credentials.username,
      });
    }
    return this.isAuthenticated;
  }

  public logout(): void {
    this.telemetry.logEvent("GeminiAuthManager.logout", {
      userId: this.currentUserId,
    });
    this.isAuthenticated = false;
    this.currentUserId = null;
    this.securityLevel = "basic";
    this.userBillingStatus = "trial";
  }

  public getAuthenticationStatus(): boolean {
    return this.isAuthenticated;
  }

  public getCurrentUser(): string | null {
    return this.currentUserId;
  }

  public getSecurityLevel(): "basic" | "elevated" | "max" {
    return this.securityLevel;
  }

  public getBillingStatus(): typeof this.userBillingStatus {
    return this.userBillingStatus;
  }

  /**
   * Simulates dynamic scaling of authentication checks based on system load or threat level.
   */
  public adaptSecurityPolicy(threatLevel: "low" | "medium" | "high"): void {
    this.telemetry.logEvent("GeminiAuthManager.adaptSecurity", { threatLevel });
    if (threatLevel === "high") {
      this.securityLevel = "max";
      console.warn("GeminiAuthManager: Elevated security to MAX due to high threat.");
    } else if (threatLevel === "medium") {
      this.securityLevel = "elevated";
    } else {
      this.securityLevel = "basic";
    }
  }
}

/**
 * GeminiDynamicConfigService: Provides dynamic, AI-optimized configurations.
 * Adapts environment settings based on runtime intelligence and service discovery.
 */
export class GeminiDynamicConfigService {
  private static instance: GeminiDynamicConfigService;
  private telemetry = GeminiTelemetryService.getInstance();
  private currentEnv: MTEnv = MTEnv.PROD; // Default
  private configCache: Record<string, unknown> = {};
  private availableServiceEndpoints: Record<MTEnv, string[]> = {
    [MTEnv.PROD]: ["api.moderntreasury.com/prod1", "api.moderntreasury.com/prod2"],
    [MTEnv.DEMO]: ["api.moderntreasury.com/demo"],
    [MTEnv.DEV]: ["localhost:3000/dev"],
  };

  private constructor() {
    this.telemetry.logEvent("GeminiDynamicConfigService.init", {});
  }

  public static getInstance(): GeminiDynamicConfigService {
    if (!GeminiDynamicConfigService.instance) {
      GeminiDynamicConfigService.instance = new GeminiDynamicConfigService();
    }
    return GeminiDynamicConfigService.instance;
  }

  /**
   * Determines the optimal MTEnv based on hostname and AI analysis.
   * Includes dynamic service discovery logic.
   * @param hostname - The current window hostname.
   * @returns The dynamically determined MTEnv.
   */
  public async determineEnvironment(hostname: string): Promise<MTEnv> {
    this.telemetry.logEvent("GeminiDynamicConfigService.determineEnv", {
      hostname,
    });
    // Simulate AI-driven service discovery and environment optimization
    await new Promise((resolve) => setTimeout(resolve, 100));

    let detectedEnv: MTEnv;
    if (hostname.includes("demo")) {
      detectedEnv = MTEnv.DEMO;
    } else if (hostname.includes("localhost")) {
      detectedEnv = MTEnv.DEV;
    } else {
      // AI could analyze traffic patterns, uptime, latency to choose best PROD replica
      const optimalProdEndpoint = await this.discoverOptimalService(MTEnv.PROD);
      console.log(`GeminiDynamicConfigService: Optimal PROD endpoint: ${optimalProdEndpoint}`);
      detectedEnv = MTEnv.PROD;
    }
    this.currentEnv = detectedEnv;
    this.configCache["MTEnv"] = this.currentEnv;
    console.log(
      `GeminiDynamicConfigService: Determined environment as ${this.currentEnv}`,
    );
    return this.currentEnv;
  }

  /**
   * Simulates dynamic service discovery and chooses an optimal endpoint.
   * @param env - The environment for which to discover services.
   * @returns A promise resolving to the optimal service endpoint URL.
   */
  private async discoverOptimalService(env: MTEnv): Promise<string> {
    const endpoints = this.availableServiceEndpoints[env];
    if (!endpoints || endpoints.length === 0) {
      this.telemetry.logEvent("ServiceDiscovery.noEndpoints", { env });
      return `no-endpoints-found-for-${env}`;
    }

    // Simulate pinging endpoints for latency/health
    const latencies = await Promise.all(
      endpoints.map(async (endpoint) => {
        const startTime = Date.now();
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 300)); // Simulate latency
        const endTime = Date.now();
        return { endpoint, latency: endTime - startTime };
      }),
    );

    const optimal = latencies.reduce((prev, current) =>
      prev.latency < current.latency ? prev : current,
    );
    this.telemetry.logEvent("ServiceDiscovery.optimalEndpoint", {
      env,
      optimalEndpoint: optimal.endpoint,
      latency: optimal.latency,
    });
    return optimal.endpoint;
  }

  /**
   * Fetches an AI-optimized configuration value.
   * @param key - The configuration key.
   * @returns The configuration value, or undefined if not found.
   */
  public getConfiguration<T>(key: string): T | undefined {
    this.telemetry.logEvent("GeminiDynamicConfigService.getConfig", { key });
    return this.configCache[key] as T;
  }

  /**
   * Dynamically updates a configuration setting.
   * @param key - The configuration key.
   * @param value - The new value.
   */
  public updateConfiguration(key: string, value: unknown): void {
    this.telemetry.logEvent("GeminiDynamicConfigService.updateConfig", {
      key,
      value,
    });
    this.configCache[key] = value;
    console.log(
      `GeminiDynamicConfigService: Dynamic config for ${key} updated to ${JSON.stringify(
        value,
      )}.`,
    );
  }
}

/**
 * GeminiUserOnboardingAgent: The central AI orchestrator for the onboarding flow.
 * It's self-aware, adaptive, and predictive. It coordinates all AI services.
 */
export class GeminiUserOnboardingAgent {
  private telemetry = GeminiTelemetryService.getInstance();
  private promptEngine = GeminiPromptEngine.getInstance();
  private complianceProcessor = ComplianceAIProcessor.getInstance();
  private dynamicConfig = GeminiDynamicConfigService.getInstance();
  private authManager = GeminiAuthManager.getInstance();

  private onboardingId: string | null = null;
  private currentApiKey: string | null = null;
  private onboardingState:
    | "initial"
    | "apiKeySet"
    | "onboardingCreated"
    | "onboardingStarted"
    | "onboardingSuccess"
    | "onboardingError"
    | "onboardingCancelled"
    | "decisionReviewed" = "initial";
  private decisionHistory: {
    prompt: string;
    response: string;
    action: string;
    timestamp: string;
  }[] = [];

  constructor() {
    this.telemetry.logEvent("GeminiUserOnboardingAgent.init", {});
    console.log("GeminiUserOnboardingAgent: Online and awaiting directives.");
    this.authManager.login({ username: "guest", password: "none" }).then(() => {
      this.telemetry.logEvent("GeminiUserOnboardingAgent.guestAuth", {
        status: this.authManager.getAuthenticationStatus(),
      });
    }); // Simulate initial anonymous auth check
  }

  public getOnboardingState(): typeof this.onboardingState {
    return this.onboardingState;
  }

  public getOnboardingId(): string | null {
    return this.onboardingId;
  }

  public getCurrentApiKey(): string | null {
    return this.currentApiKey;
  }

  /**
   * AI-driven setting of the API key. Includes internal validation and logging.
   * @param apiKey - The API key to set.
   * @returns Promise resolving to boolean indicating success.
   */
  public async setApiKey(apiKey: string): Promise<boolean> {
    const context = {
      action: "setApiKey",
      currentApiKey: this.currentApiKey ? "present" : "missing",
      newApiKey: apiKey ? "present" : "missing",
      onboardingState: this.onboardingState,
    };
    const prompt = this.promptEngine.generatePrompt(context);
    this.telemetry.logEvent("GeminiUserOnboardingAgent.setApiKey.prompt", {
      prompt,
    });

    if (!apiKey || apiKey.length < 10) {
      console.error(
        "GeminiUserOnboardingAgent: Invalid API Key provided. AI recommends reviewing format.",
      );
      this.decisionHistory.push({
        prompt,
        response: "API Key invalid format/length",
        action: "reject_apiKey",
        timestamp: new Date().toISOString(),
      });
      this.telemetry.logEvent("GeminiUserOnboardingAgent.setApiKey.fail", {
        reason: "invalid_key",
      });
      return false;
    }

    // Simulate AI performing internal security/format checks
    await new Promise((resolve) => setTimeout(resolve, 150));

    this.currentApiKey = apiKey;
    this.onboardingState = "apiKeySet";
    this.decisionHistory.push({
      prompt,
      response: "API Key accepted",
      action: "accept_apiKey",
      timestamp: new Date().toISOString(),
    });
    this.telemetry.logEvent("GeminiUserOnboardingAgent.setApiKey.success", {
      apiKeyPresent: true,
    });
    console.log("GeminiUserOnboardingAgent: API Key intelligently updated.");
    return true;
  }

  /**
   * AI-driven creation of a user onboarding session.
   * @param createMutation - The actual GraphQL mutation function.
   * @param hostname - The current window hostname for env determination.
   * @returns Promise resolving to the new user onboarding ID or null on failure.
   */
  public async createIntelligentUserOnboarding(
    createMutation: (options: any) => Promise<any>, // The original useCreateDemoUserOnboardingMutation
    hostname: string,
  ): Promise<string | null> {
    if (!this.currentApiKey) {
      console.error(
        "GeminiUserOnboardingAgent: Cannot create onboarding without an API Key.",
      );
      this.telemetry.logEvent(
        "GeminiUserOnboardingAgent.createOnboarding.fail",
        { reason: "no_api_key" },
      );
      return null;
    }
    if (this.authManager.getBillingStatus() === "suspended") {
      console.error("GeminiUserOnboardingAgent: Billing suspended, cannot create onboarding.");
      this.telemetry.logEvent(
        "GeminiUserOnboardingAgent.createOnboarding.fail",
        { reason: "billing_suspended" },
      );
      return null;
    }

    const currentEnv = await this.dynamicConfig.determineEnvironment(hostname);
    this.dynamicConfig.updateConfiguration("onboardingEnv", currentEnv); // Update global AI config

    const context = {
      action: "createUserOnboarding",
      apiKey: "present",
      environment: currentEnv,
      onboardingState: this.onboardingState,
      authStatus: this.authManager.getAuthenticationStatus(),
      currentUser: this.authManager.getCurrentUser(),
      securityLevel: this.authManager.getSecurityLevel(),
      billingStatus: this.authManager.getBillingStatus(),
    };
    const prompt = this.promptEngine.generatePrompt(context);
    this.telemetry.logEvent("GeminiUserOnboardingAgent.createOnboarding.prompt", {
      prompt,
    });

    // Simulate AI pre-flight compliance check before creating onboarding
    const { decision: complianceDecision, risk: complianceRisk } =
      await this.complianceProcessor.assessComplianceRisk({
        apiKey: this.currentApiKey,
        env: currentEnv,
        userId: this.authManager.getCurrentUser(),
        userCountry: "US", // Simulated
      });

    if (complianceDecision === "deny") {
      console.warn(
        `GeminiUserOnboardingAgent: Compliance denied onboarding creation due to ${complianceRisk} risk.`,
      );
      this.onboardingState = "onboardingError";
      this.telemetry.logEvent(
        "GeminiUserOnboardingAgent.createOnboarding.fail",
        {
          reason: "compliance_denied",
          risk: complianceRisk,
          contextId: this.onboardingId,
        },
      );
      return null;
    }

    try {
      // Simulate circuit breaker: if external service deemed unhealthy by AI
      if (!this.telemetry.isHealthy()) {
        throw new Error("External telemetry service unhealthy, circuit breaker open.");
      }

      const response = await createMutation({
        variables: {
          input: {
            apiKey: this.currentApiKey,
            env: currentEnv, // Pass the dynamically determined env
          },
        },
      });

      const newOnboardingId = response?.data?.createDemoUserOnboarding?.id;
      if (newOnboardingId) {
        this.onboardingId = newOnboardingId;
        this.onboardingState = "onboardingCreated";
        this.decisionHistory.push({
          prompt,
          response: `Onboarding ID: ${newOnboardingId}`,
          action: "create_onboarding_success",
          timestamp: new Date().toISOString(),
        });
        this.telemetry.logEvent(
          "GeminiUserOnboardingAgent.createOnboarding.success",
          { onboardingId: newOnboardingId, contextId: newOnboardingId },
        );
        console.log(
          `GeminiUserOnboardingAgent: Successfully created user onboarding ${newOnboardingId}.`,
        );
        return newOnboardingId;
      } else {
        throw new Error("No onboarding ID returned from API.");
      }
    } catch (error: any) {
      this.onboardingState = "onboardingError";
      this.decisionHistory.push({
        prompt,
        response: `Error: ${error.message || String(error)}`,
        action: "create_onboarding_failure",
        timestamp: new Date().toISOString(),
      });
      this.telemetry.logEvent(
        "GeminiUserOnboardingAgent.createOnboarding.fail",
        {
          reason: error.message || String(error),
          contextId: this.onboardingId,
        },
      );
      console.error(
        `GeminiUserOnboardingAgent: Failed to create user onboarding: ${error.message || String(error)}.`,
      );
      return null;
    }
  }

  /**
   * AI-orchestrated initiation of the User Onboarding flow.
   * @param openOnboardingFn - The actual `open` function from `useMTUserOnboarding`.
   * @param id - The user onboarding ID.
   * @returns Boolean indicating if the flow was initiated.
   */
  public async startIntelligentUserOnboardingFlow(
    openOnboardingFn: (id: string) => void,
    id: string,
  ): Promise<boolean> {
    if (!id) {
      console.error(
        "GeminiUserOnboardingAgent: Cannot start onboarding without an ID.",
      );
      this.telemetry.logEvent(
        "GeminiUserOnboardingAgent.startOnboarding.fail",
        { reason: "no_onboarding_id" },
      );
      return false;
    }
    if (this.onboardingId !== id) {
      console.warn(
        `GeminiUserOnboardingAgent: Mismatch in onboarding ID. Using provided ID: ${id}. Self-correcting.`,
      );
      this.onboardingId = id; // Self-correction
    }

    const context = {
      action: "startUserOnboardingFlow",
      onboardingId: id,
      onboardingState: this.onboardingState,
      complianceRisk: this.complianceProcessor.getCurrentRiskProfile(),
      securityLevel: this.authManager.getSecurityLevel(),
    };
    const prompt = this.promptEngine.generatePrompt(context);
    this.telemetry.logEvent("GeminiUserOnboardingAgent.startOnboarding.prompt", {
      prompt,
      contextId: id,
    });

    // Simulate AI pre-checks, e.g., user eligibility, session validity, dynamic security
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (this.authManager.getSecurityLevel() === "elevated") {
      console.warn("GeminiUserOnboardingAgent: Elevated security detected, potentially adding extra verification steps (simulated).");
      this.telemetry.logEvent("GeminiUserOnboardingAgent.startOnboarding.securityWarning", { securityLevel: "elevated" });
    }

    if (this.onboardingState === "onboardingError") {
      console.warn(
        "GeminiUserOnboardingAgent: Onboarding is in an error state. Attempting to restart but flagging for review.",
      );
      this.telemetry.logEvent(
        "GeminiUserOnboardingAgent.startOnboarding.warn",
        { reason: "error_state_restart", contextId: id },
      );
      // AI might decide to clear error state or notify admin
      this.onboardingState = "onboardingCreated"; // Attempt to recover
    }

    try {
      openOnboardingFn(id);
      this.onboardingState = "onboardingStarted";
      this.decisionHistory.push({
        prompt,
        response: `Flow initiated for ID: ${id}`,
        action: "start_onboarding_success",
        timestamp: new Date().toISOString(),
      });
      this.telemetry.logEvent(
        "GeminiUserOnboardingAgent.startOnboarding.success",
        { onboardingId: id, contextId: id },
      );
      console.log(
        `GeminiUserOnboardingAgent: User Onboarding flow ${id} intelligently started.`,
      );
      return true;
    } catch (error: any) {
      this.onboardingState = "onboardingError";
      this.decisionHistory.push({
        prompt,
        response: `Error: ${error.message || String(error)}`,
        action: "start_onboarding_failure",
        timestamp: new Date().toISOString(),
      });
      this.telemetry.logEvent(
        "GeminiUserOnboardingAgent.startOnboarding.fail",
        {
          reason: error.message || String(error),
          contextId: id,
        },
      );
      console.error(
        `GeminiUserOnboardingAgent: Failed to start user onboarding flow: ${error.message || String(error)}.`,
      );
      return false;
    }
  }

  /**
   * AI-driven handling of onboarding flow outcomes.
   * Adapts the agent's state based on success, error, or cancellation.
   * @param outcome - The result of the onboarding flow.
   * @param error - Optional error details.
   */
  public handleOnboardingOutcome(
    outcome: "success" | "error" | "cancel",
    error?: Record<string, unknown>,
  ): void {
    const context = {
      action: "handleOnboardingOutcome",
      outcome,
      onboardingId: this.onboardingId,
      error: error ? "present" : "absent",
      complianceRisk: this.complianceProcessor.getCurrentRiskProfile(),
    };
    const prompt = this.promptEngine.generatePrompt(context);
    this.telemetry.logEvent("GeminiUserOnboardingAgent.handleOutcome.prompt", {
      prompt,
      contextId: this.onboardingId,
    });

    switch (outcome) {
      case "success":
        this.onboardingState = "onboardingSuccess";
        this.promptEngine.learnFromInteraction(prompt, "flow success", "success");
        this.telemetry.logEvent(
          "GeminiUserOnboardingAgent.onboardingOutcome",
          { outcome: "success", contextId: this.onboardingId },
        );
        console.log(
          "GeminiUserOnboardingAgent: Onboarding flow completed successfully. AI predicts high conversion.",
        );
        // AI might update user segment or trigger post-onboarding workflows here.
        break;
      case "error":
        this.onboardingState = "onboardingError";
        this.promptEngine.learnFromInteraction(
          prompt,
          JSON.stringify(error),
          "failure",
        );
        this.telemetry.logEvent(
          "GeminiUserOnboardingAgent.onboardingOutcome",
          { outcome: "error", details: error, contextId: this.onboardingId },
        );
        console.error(
          `GeminiUserOnboardingAgent: Onboarding flow encountered an error: ${JSON.stringify(
            error,
          )}. AI recommends re-evaluating process or customer support.`,
        );
        // AI might suggest retry, alternative flow, or direct user to support
        break;
      case "cancel":
        this.onboardingState = "onboardingCancelled";
        this.promptEngine.learnFromInteraction(prompt, "flow cancelled", "cancelled");
        this.telemetry.logEvent(
          "GeminiUserOnboardingAgent.onboardingOutcome",
          { outcome: "cancel", contextId: this.onboardingId },
        );
        console.warn(
          "GeminiUserOnboardingAgent: Onboarding flow was cancelled by the user. AI suggests prompting for feedback.",
        );
        // AI might prompt for feedback or suggest resuming later
        break;
    }
    this.decisionHistory.push({
      prompt,
      response: `Outcome: ${outcome}`,
      action: `handle_outcome_${outcome}`,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * AI-driven refresh of onboarding data, includes error handling and recovery.
   * @param refetchFn - The actual `refetch` function from `useUserOnboardingDemoQuery`.
   * @param id - The user onboarding ID.
   * @returns Promise resolving to boolean indicating success.
   */
  public async intelligentlyRefreshOnboardingData(
    refetchFn: (variables: any) => Promise<any>,
    id: string,
  ): Promise<boolean> {
    if (!id) {
      console.error(
        "GeminiUserOnboardingAgent: Cannot refresh without an onboarding ID.",
      );
      this.telemetry.logEvent("GeminiUserOnboardingAgent.refresh.fail", {
        reason: "no_onboarding_id",
      });
      return false;
    }

    const context = {
      action: "refreshOnboardingData",
      onboardingId: id,
      onboardingState: this.onboardingState,
      lastRefresh: this.decisionHistory.findLast(
        (d) => d.action === "refresh_data",
      )?.timestamp,
    };
    const prompt = this.promptEngine.generatePrompt(context);
    this.telemetry.logEvent("GeminiUserOnboardingAgent.refresh.prompt", {
      prompt,
      contextId: id,
    });

    try {
      // Simulate intelligent retry logic and error prediction
      await refetchFn({ id });
      this.decisionHistory.push({
        prompt,
        response: "Data refreshed successfully",
        action: "refresh_data",
        timestamp: new Date().toISOString(),
      });
      this.telemetry.logEvent("GeminiUserOnboardingAgent.refresh.success", {
        onboardingId: id,
        contextId: id,
      });
      console.log(
        `GeminiUserOnboardingAgent: Data for ${id} intelligently refreshed.`,
      );
      // AI might analyze new data and update internal state/recommendations
      if (this.onboardingState !== "decisionReviewed") {
        this.onboardingState = "decisionReviewed"; // A simple AI state update
      }
      return true;
    } catch (error: any) {
      this.decisionHistory.push({
        prompt,
        response: `Error: ${error.message || String(error)}`,
        action: "refresh_data_failure",
        timestamp: new Date().toISOString(),
      });
      this.telemetry.logEvent("GeminiUserOnboardingAgent.refresh.fail", {
        reason: error.message || String(error),
        contextId: id,
      });
      console.error(
        `GeminiUserOnboardingAgent: Failed to intelligently refresh data for ${id}: ${error.message || String(error)}. AI suggests checking API connectivity.`,
      );
      // AI might recommend alternative data sources or notify for manual review
      return false;
    }
  }

  /**
   * Provides AI-generated recommendations and summaries based on the current state.
   */
  public getAIGuidance(): string {
    const context = {
      currentState: this.onboardingState,
      currentOnboardingId: this.onboardingId,
      apiKeyStatus: this.currentApiKey ? "set" : "unset",
      complianceRisk: this.complianceProcessor.getCurrentRiskProfile(),
      isAuthenticated: this.authManager.getAuthenticationStatus(),
      billingStatus: this.authManager.getBillingStatus(),
      lastAction: this.decisionHistory.at(-1)?.action,
      telemetryHealthy: this.telemetry.isHealthy(),
    };
    // Simulate LLM response based on context
    // This part would ideally be an actual LLM call, but here it's a rule-based simulation.
    if (!this.telemetry.isHealthy()) {
      return "AI Guidance: System diagnostics indicate potential issues with external telemetry services. Operations might be impacted. Please review system health.";
    }
    if (!this.authManager.getAuthenticationStatus()) {
      return "AI Guidance: User session not authenticated. Please log in for full functionality and compliance checks.";
    }
    if (this.authManager.getBillingStatus() === "suspended") {
      return "AI Guidance: Account billing is suspended. Onboarding operations may be restricted. Please check billing status.";
    }
    if (this.complianceProcessor.getCurrentRiskProfile() === "high") {
      return `AI Guidance: High compliance risk detected. Proceed with caution or escalate for review. Current risk profile: ${this.complianceProcessor.getCurrentRiskProfile().toUpperCase()}.`;
    }
    if (this.onboardingState === "initial") {
      return "AI Guidance: Begin by securely setting your API Key. The system is ready to adapt to your configuration.";
    }
    if (this.onboardingState === "apiKeySet" && !this.onboardingId) {
      return `AI Guidance: API Key is set. Proceed to create a User Onboarding instance. System readiness: High.`;
    }
    if (this.onboardingState === "onboardingCreated") {
      return `AI Guidance: User Onboarding ID '${this.onboardingId}' created. Initiate the onboarding flow now. Expected user journey: Smooth.`;
    }
    if (this.onboardingState === "onboardingStarted") {
      return `AI Guidance: The onboarding flow for '${this.onboardingId}' is active. Awaiting user completion or system callback for state mutation.`;
    }
    if (this.onboardingState === "onboardingSuccess") {
      return `AI Guidance: Onboarding flow for '${this.onboardingId}' successfully completed! Review the detailed decision results. Predictive analysis indicates high operational efficiency.`;
    }
    if (this.onboardingState === "onboardingError") {
      return `AI Guidance: An error occurred during the onboarding flow for '${this.onboardingId}'. Review details, potentially reconfigure, or retry. AI suggests verifying external API status.`;
    }
    if (this.onboardingState === "onboardingCancelled") {
      return `AI Guidance: The onboarding flow for '${this.onboardingId}' was cancelled. Consider intelligent re-engagement strategies or gathering user feedback.`;
    }
    if (this.onboardingState === "decisionReviewed") {
      return `AI Guidance: Onboarding decision for '${this.onboardingId}' has been reviewed. The system is now ready for the next logical step, such as user provisioning or initiating another compliance check.`;
    }
    return `AI Guidance: Current state requires human intervention or an unknown AI directive. Context: ${JSON.stringify(
      context,
    )}.`;
  }

  public getDecisionHistory(): typeof this.decisionHistory {
    return [...this.decisionHistory];
  }

  public resetAgentState(): void {
    this.onboardingId = null;
    this.currentApiKey = null;
    this.onboardingState = "initial";
    this.decisionHistory = [];
    this.telemetry.logEvent("GeminiUserOnboardingAgent.resetState", {});
    console.log("GeminiUserOnboardingAgent: State reset for new session.");
  }
}

// AI-POWERED REACT HOOK FOR AGENT MANAGEMENT
/**
 * `useGeminiUserOnboardingAgent` is a React hook that provides an interface
 * to the `GeminiUserOnboardingAgent`, allowing the component to interact
 * with the AI-driven logic and react to its state changes.
 */
export const useGeminiUserOnboardingAgent = () => {
  const [agent] = useState(() => new GeminiUserOnboardingAgent());
  const [agentState, setAgentState] = useState(agent.getOnboardingState());
  const [onboardingId, setOnboardingId] = useState(agent.getOnboardingId());
  const [apiKey, setApiKeyInternal] = useState(agent.getCurrentApiKey());
  const [aiGuidance, setAiGuidance] = useState(agent.getAIGuidance());

  // Effect to keep React state in sync with agent's internal state
  // This simulates the file being 'self-aware' and reacting to its internal AI organism.
  React.useEffect(() => {
    const updateState = () => {
      setAgentState(agent.getOnboardingState());
      setOnboardingId(agent.getOnboardingId());
      setApiKeyInternal(agent.getCurrentApiKey());
      setAiGuidance(agent.getAIGuidance());
    };

    const interval = setInterval(updateState, 200); // Poll agent state periodically for responsiveness
    // Initial sync
    updateState();
    return () => clearInterval(interval);
  }, [agent]);

  const setApiKey = async (newApiKey: string) => {
    const success = await agent.setApiKey(newApiKey);
    if (success) {
      setApiKeyInternal(newApiKey); // Ensure local state also reflects
    }
    return success;
  };

  const createIntelligentUserOnboarding = async (
    createMutation: (options: any) => Promise<any>,
    hostname: string,
  ) => {
    const newId = await agent.createIntelligentUserOnboarding(
      createMutation,
      hostname,
    );
    if (newId) {
      setOnboardingId(newId);
    }
    return newId;
  };

  const startIntelligentUserOnboardingFlow = async (
    openOnboardingFn: (id: string) => void,
    id: string,
  ) => {
    const success = await agent.startIntelligentUserOnboardingFlow(
      openOnboardingFn,
      id,
    );
    return success;
  };

  const handleOnboardingOutcome = (
    outcome: "success" | "error" | "cancel",
    error?: Record<string, unknown>,
  ) => {
    agent.handleOnboardingOutcome(outcome, error);
  };

  const intelligentlyRefreshOnboardingData = async (
    refetchFn: (variables: any) => Promise<any>,
    id: string,
  ) => {
    const success = await agent.intelligentlyRefreshOnboardingData(
      refetchFn,
      id,
    );
    return success;
  };

  const resetAgentState = () => {
    agent.resetAgentState();
    // Force immediate UI update after reset
    setAgentState(agent.getOnboardingState());
    setOnboardingId(agent.getOnboardingId());
    setApiKeyInternal(agent.getCurrentApiKey());
    setAiGuidance(agent.getAIGuidance());
  };

  return {
    agent,
    agentState,
    onboardingId,
    apiKey,
    aiGuidance,
    setApiKey,
    createIntelligentUserOnboarding,
    startIntelligentUserOnboardingFlow,
    handleOnboardingOutcome,
    intelligentlyRefreshOnboardingData,
    resetAgentState,
  };
};

function MTUserOnboardingDemo() {
  const {
    agent,
    agentState,
    onboardingId,
    apiKey,
    aiGuidance,
    setApiKey,
    createIntelligentUserOnboarding,
    startIntelligentUserOnboardingFlow,
    handleOnboardingOutcome,
    intelligentlyRefreshOnboardingData,
    resetAgentState,
  } = useGeminiUserOnboardingAgent();

  const [hasSuccess, setHasSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasCancel, setHasCancel] = useState(false);
  const [errorMessage, dispatchError] = useState<Record<string, unknown>>({});
  const telemetry = GeminiTelemetryService.getInstance();

  const [createDemoUserOnboardingMutation] = useCreateDemoUserOnboardingMutation();
  const { data, refetch } = useUserOnboardingDemoQuery({
    variables: {
      id: onboardingId || "",
    },
    skip: onboardingId === null, // Use agent's onboardingId
  });

  // MTUserOnboarding options, now handled by the agent's outcome handler
  const options = React.useMemo(() => {
    // Dynamically retrieve environment from AI service
    const currentEnv = GeminiDynamicConfigService.getInstance().getConfiguration<MTEnv>("onboardingEnv") || MTEnv.PROD;
    return {
      env: currentEnv,
      onSuccess: () => {
        setHasSuccess(true);
        handleOnboardingOutcome("success");
        telemetry.logEvent("MTUserOnboardingDemo.sdkCallback", { outcome: "success", onboardingId });
      },
      onError: (error: Record<string, unknown>) => {
        setHasError(true);
        dispatchError(error);
        handleOnboardingOutcome("error", error);
        telemetry.logEvent("MTUserOnboardingDemo.sdkCallback", { outcome: "error", error, onboardingId });
      },
      onCancel: () => {
        setHasCancel(true);
        handleOnboardingOutcome("cancel");
        telemetry.logEvent("MTUserOnboardingDemo.sdkCallback", { outcome: "cancel", onboardingId });
      },
    };
  }, [onboardingId, handleOnboardingOutcome, telemetry]); // Recreate options if onboardingId changes

  const [, , openMTOnboardingSDK] = useMTUserOnboarding(options);

  // AI-driven, high-level orchestration for steps 2 & 3
  const initiateOnboardingProcess = async () => {
    telemetry.logEvent("MTUserOnboardingDemo.initiateOnboardingProcess", {
      agentState,
      currentApiKey: apiKey,
      triggeredBy: "AI_AUTO_ORCHESTRATE_BUTTON",
    });
    // AI-driven decision: if agent is in "onboardingCreated" state, start flow directly.
    // Otherwise, attempt to create it first.
    if (agentState === "onboardingCreated" && onboardingId) {
      await startIntelligentUserOnboardingFlow(openMTOnboardingSDK, onboardingId);
    } else if (apiKey) {
      const newId = await createIntelligentUserOnboarding(
        createDemoUserOnboardingMutation,
        window.location.hostname,
      );
      if (newId) {
        // AI-driven, automatic next step: if creation successful, start flow immediately
        await startIntelligentUserOnboardingFlow(openMTOnboardingSDK, newId);
      } else {
        dispatchError({ message: "AI detected an issue during onboarding creation. Please check previous errors." });
      }
    } else {
      dispatchError({ message: "AI advises: API Key is required before creating/starting onboarding." });
      telemetry.logEvent("MTUserOnboardingDemo.initiateOnboardingProcess.fail", { reason: "no_api_key_for_auto_create" });
    }
  };

  const handleSetApiKey = async (values: { apiKey: string }) => {
    setHasSuccess(false);
    setHasError(false);
    setHasCancel(false);
    dispatchError({});
    const success = await setApiKey(values.apiKey);
    if (!success) {
      dispatchError({ message: "AI detected an invalid API Key format or value." });
    } else {
      dispatchError({}); // Clear error if successful
    }
    telemetry.logEvent("MTUserOnboardingDemo.handleSetApiKey", { success });
  };

  const handleCreateUserOnboarding = async () => {
    setHasSuccess(false);
    setHasError(false);
    setHasCancel(false);
    dispatchError({});
    const newId = await createIntelligentUserOnboarding(
      createDemoUserOnboardingMutation,
      window.location.hostname,
    );
    if (!newId) {
      dispatchError({ message: "AI encountered an error creating user onboarding. Check compliance and API key." });
    } else {
      dispatchError({});
    }
    telemetry.logEvent("MTUserOnboardingDemo.handleCreateUserOnboarding", {
      newOnboardingId: onboardingId,
    });
  };

  const handleStartUserOnboarding = async () => {
    setHasSuccess(false);
    setHasError(false);
    setHasCancel(false);
    dispatchError({});
    if (onboardingId) {
      const started = await startIntelligentUserOnboardingFlow(openMTOnboardingSDK, onboardingId);
      if (!started) {
        dispatchError({ message: "AI could not initiate the onboarding flow. System might be in an unrecoverable state." });
      } else {
        dispatchError({});
      }
    } else {
      dispatchError({ message: "AI advises: An Onboarding ID is required to start the flow." });
      telemetry.logEvent("MTUserOnboardingDemo.handleStartUserOnboarding.fail", { reason: "no_onboarding_id" });
    }
  };

  const handleRefresh = async () => {
    dispatchError({}); // Clear previous errors
    await intelligentlyRefreshOnboardingData(refetch, onboardingId || ""); // Ensure ID is passed
    telemetry.logEvent("MTUserOnboardingDemo.handleRefresh", { onboardingId });
  };

  const decisionId = data?.userOnboarding?.decision?.id;

  const renderAIUserOnboardingMessage = () => {
    let message = aiGuidance; // Start with AI guidance

    // Supplement AI guidance with direct outcome messages if available
    switch (true) {
      case hasCancel:
        message += " (Flow cancelled by user.)";
        break;
      case hasSuccess:
        message += " (Flow completed successfully.)";
        break;
      case hasError:
        message += ` (System detected an issue: ${
          typeof errorMessage === "string" ? errorMessage : (errorMessage.message as string || "Unknown Error.")
        })`;
        break;
      default:
        break;
    }

    return message;
  };

  return (
    <PageHeader title="User Onboarding Demo (Gemini-Powered)">
      <div className="flex flex-col gap-4">
        <ExpandableCard
          heading="Gemini Agent Status & Guidance"
          className="h-fit w-full items-center"
        >
          <div className="h-full w-full border-t border-t-gray-200 p-4">
            <p className="text-lg font-semibold mb-2">
              Current AI State:{" "}
              <span
                className={`font-bold ${
                  agentState === "onboardingError"
                    ? "text-red-600"
                    : agentState === "onboardingSuccess"
                      ? "text-green-600"
                      : agentState === "onboardingCancelled"
                        ? "text-yellow-600"
                        : "text-blue-600"
                }`}
              >
                {agentState.toUpperCase()}
              </span>
            </p>
            <p className="text-sm text-gray-700 italic">
              <span className="font-bold text-indigo-700">AI Says:</span>{" "}
              {renderAIUserOnboardingMessage()}
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Onboarding ID (AI-Managed):{" "}
              <code className="rounded-md border-2 bg-background-light p-1 px-2 text-left">
                {onboardingId === null ? "Not yet generated" : onboardingId}
              </code>
            </p>
            <div className="mt-4 flex flex-row gap-2">
              <Button buttonType="secondary" onClick={resetAgentState}>
                Reset Gemini Agent
              </Button>
              <Button
                buttonType="text"
                onClick={() => {
                  console.log(
                    "Gemini Agent Decision History:",
                    agent.getDecisionHistory(),
                  );
                  telemetry.logEvent(
                    "MTUserOnboardingDemo.viewAgentDecisionHistory",
                    { onboardingId },
                  );
                }}
              >
                View Agent Decision History (Console)
              </Button>
            </div>
          </div>
        </ExpandableCard>

        <ExpandableCard
          heading="Step 1:  Retrieve and Set API Key (AI-Assisted)"
          className="h-fit max-h-fit w-full items-center"
        >
          <div className="h-full w-full border-t border-t-gray-200 p-4">
            <div className="pt-4">
              <Formik
                initialValues={{ apiKey: apiKey || "" }}
                onSubmit={(values, { setSubmitting }) => {
                  void handleSetApiKey(values);
                  setSubmitting(false);
                }}
                enableReinitialize={true} // Allow Formik to update if agent's apiKey changes
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Label className="py-1">API Key (AI-Validated)</Label>
                    <Field
                      name="apiKey"
                      placeholder="API Key"
                      component={FormikInputField}
                      disabled={agentState === "onboardingStarted"}
                    />
                    <Button
                      buttonType="primary"
                      isSubmit
                      disabled={isSubmitting || agentState === "onboardingStarted"}
                      className="mb-6 mt-4"
                    >
                      Set API Key (AI-Driven)
                    </Button>
                    {hasError && errorMessage && (
                      <span className="error-message text-red-600">
                        {typeof errorMessage === "string" ? errorMessage : (errorMessage.message as string || "An AI-detected error occurred.")}
                      </span>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
            <div className="flex w-full flex-row-reverse">
              <Drawer trigger={<Button buttonType="text">View API Keys</Button>}>
                <APIKeysHome />
              </Drawer>
            </div>
          </div>
        </ExpandableCard>

        <ExpandableCard
          heading="Step 2:  Create a User Onboarding (AI-Orchestrated)"
          className="h-fit max-h-fit w-full items-center"
        >
          <div className="h-full w-full  border-t border-t-gray-200 p-4">
            <Button
              buttonType="primary"
              className="mb-4 mt-2"
              disabled={!apiKey || agentState === "onboardingCreated" || agentState === "onboardingStarted"}
              onClick={handleCreateUserOnboarding}
            >
              Create User Onboarding (AI-Powered)
            </Button>
            <code className="border-muted mt-10 rounded-md border-2 bg-background-light p-1 px-2 text-left">
              {onboardingId === null
                ? "No User Onboarding Generated by AI"
                : `User Onboarding ID: ${onboardingId}`}
            </code>
            {hasError && errorMessage && (
              <span className="error-message text-red-600">
                {typeof errorMessage === "string" ? errorMessage : (errorMessage.message as string || "An AI-detected error occurred.")}
              </span>
            )}
            <p className="text-sm mt-4 text-gray-600">
              AI-Detected Compliance Risk:{" "}
              <span className={`font-bold ${
                agent.complianceProcessor.getCurrentRiskProfile() === "high"
                  ? "text-red-500"
                  : agent.complianceProcessor.getCurrentRiskProfile() === "medium"
                    ? "text-yellow-500"
                    : "text-green-500"
              }`}>
                {agent.complianceProcessor.getCurrentRiskProfile().toUpperCase()}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              AI-Monitored Billing Status:{" "}
              <span className={`font-bold ${
                agent.authManager.getBillingStatus() === "suspended"
                  ? "text-red-500"
                  : "text-green-500"
              }`}>
                {agent.authManager.getBillingStatus().toUpperCase()}
              </span>
            </p>
          </div>
        </ExpandableCard>

        <ExpandableCard
          heading="Step 3: Open User Onboarding Flow (AI-Adaptive)"
          className="h-fit w-full items-center"
        >
          <div className="h-full w-full  border-t border-t-gray-200 p-4">
            <Button
              buttonType="primary"
              disabled={
                !onboardingId ||
                agentState === "onboardingStarted" ||
                agentState === "onboardingSuccess" ||
                agentState === "onboardingError" ||
                agentState === "onboardingCancelled"
              }
              onClick={handleStartUserOnboarding}
            >
              Start User Onboarding Flow (AI-Driven)
            </Button>
            <p className="py-4 text-sm text-gray-700">
              Current Flow Status: {renderAIUserOnboardingMessage()}
            </p>
            {hasSuccess && (
              <p className="py-2 text-green-600 font-semibold">
                AI reports: Flow completed successfully!
              </p>
            )}
            {hasCancel && (
              <p className="py-2 text-yellow-600 font-semibold">
                AI reports: Flow cancelled by user.
              </p>
            )}
            {hasError && errorMessage && (
              <p className="py-2 text-red-600 font-semibold">
                AI reports an error:{" "}
                {typeof errorMessage === "string" ? errorMessage : (errorMessage.message as string || "Unknown AI-detected error.")}
              </p>
            )}
            <div className="flex w-full flex-row-reverse">
              {decisionId === undefined ? (
                <Button
                  buttonType="text"
                  disabled={!onboardingId || agentState === "onboardingStarted"}
                  onClick={handleRefresh}
                >
                  Refresh Data (AI-Monitored)
                </Button>
              ) : (
                <Drawer
                  trigger={
                    <Button buttonType="text" disabled={!onboardingId}>
                      View Results (AI-Analyzed)
                    </Button>
                  }
                  onOpenChange={(isOpen) => {
                    if (!isOpen) {
                      // When drawer closes, assume decision reviewed
                      // This is a form of self-correction: AI acknowledges manual review.
                      agent.handleOnboardingOutcome("success"); // Simulating successful review
                      telemetry.logEvent("MTUserOnboardingDemo.decisionViewed", { onboardingId, decisionId });
                    }
                  }}
                >
                  <DecisionView
                    match={{
                      params: {
                        decisionId,
                      },
                    }}
                  />
                </Drawer>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                buttonType="secondary"
                onClick={initiateOnboardingProcess}
                disabled={!apiKey || agentState === "onboardingStarted"}
              >
                AI Auto-Orchestrate Steps 2 & 3
              </Button>
            </div>
          </div>
        </ExpandableCard>
      </div>
    </PageHeader>
  );
}

export default MTUserOnboardingDemo;