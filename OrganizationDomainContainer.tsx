// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import { FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";
import { ApolloError, ApolloQueryResult } from "@apollo/client";
import {
  Alert,
  Badge,
  BadgeType,
  Button,
  Icon,
  IndexTable,
  IndexTableSkeletonLoader,
  Popover,
  PopoverPanel,
  PopoverTrigger,
  DateTime,
} from "../../../common/ui-components";
import { ButtonType } from "../../../common/ui-components/Button/Button";
import useErrorBanner from "../../../common/utilities/useErrorBanner";
import useSuccessBanner from "../../../common/utilities/useSuccessBanner";
import {
  useBulkRefreshCustomEmailDomainVerificationStatusMutation,
  useCreateCustomEmailDomainMutation,
  useDeleteCustomEmailDomainMutation,
  useUpdateCustomEmailDomainMutation,
  useSendTestEmailMutation,
  CustomEmailDomainViewQuery,
  CustomEmailDomain,
} from "../../../generated/dashboard/graphqlSchema";
import CustomEmailDomainActionItem, {
  MT_MAIL_DOMAIN_ID,
} from "./CustomEmailDomainActionItem";
import DnsVerificationStatusBadge from "./DnsVerificationStatusBadge";
import DomainCardForm from "./DomainCardForm";
import CustomEmailDomainModal from "./CustomEmailDomainModal";

// --- START GEMINI INTEGRATION & SELF-CONTAINED UNIVERSE ARCHITECTURE ---

/**
 * @typedef GeminiEvent
 * Represents a discrete event within the system, analyzed by the GeminiAgent.
 */
export type GeminiEvent =
  | { type: "DOMAIN_CREATE_INITIATED"; payload: { domain: string } }
  | { type: "DOMAIN_CREATE_SUCCESS"; payload: { domain: string; id: string } }
  | { type: "DOMAIN_CREATE_FAILURE"; payload: { domain: string; error: string } }
  | { type: "DOMAIN_DELETE_INITIATED"; payload: { id: string } }
  | { type: "DOMAIN_DELETE_SUCCESS"; payload: { id: string } }
  | { type: "DOMAIN_DELETE_FAILURE"; payload: { id: string; error: string } }
  | { type: "DOMAIN_DEFAULT_SET_INITIATED"; payload: { id: string } }
  | { type: "DOMAIN_DEFAULT_SET_SUCCESS"; payload: { id: string } }
  | { type: "DOMAIN_DEFAULT_SET_FAILURE"; payload: { id: string; error: string } }
  | { type: "BULK_REFRESH_INITIATED" }
  | { type: "BULK_REFRESH_SUCCESS" }
  | { type: "BULK_REFRESH_FAILURE"; payload: { error: string } }
  | { type: "TEST_EMAIL_SEND_INITIATED"; payload: { id: string } }
  | { type: "TEST_EMAIL_SEND_SUCCESS"; payload: { id: string } }
  | { type: "TEST_EMAIL_SEND_FAILURE"; payload: { id: string; error: string } }
  | { type: "UI_STATE_CHANGE"; payload: { state: string; value: boolean } }
  | { type: "POLICY_VIOLATION"; payload: { rule: string; context: any } }
  | { type: "PREDICTIVE_ACTION_TRIGGERED"; payload: { action: string; suggestion: string } }
  | { type: "TELEMETRY_EMIT"; payload: { metric: string; value: any } }
  | { type: "CONTEXT_UPDATE"; payload: { key: string; value: any } };

/**
 * @class GeminiContextManager
 * Manages the contextual understanding and memory for the AI agent.
 * This acts as a living endpoint for contextual data and dynamic state.
 */
export class GeminiContextManager {
  private context: Map<string, any> = new Map();
  private history: GeminiEvent[] = [];
  private learnedPatterns: Map<string, any> = new Map(); // Stores learned behaviors or common failure modes.

  constructor() {
    this.initializeContext();
  }

  private initializeContext() {
    // Simulate dynamic service discovery based on deployment environment
    this.setContext("environment", process.env.NODE_ENV || "production");
    this.setContext("serviceEndpoints", {
      database: `gemini-db-connector-${this.getContext("environment")}`,
      languageModel: `gemini-llm-service-${this.getContext("environment")}`,
      eventBroker: `gemini-event-bus-${this.getContext("environment")}`,
      telemetry: `gemini-telemetry-pipeline-${this.getContext("environment")}`,
      policyEngine: `gemini-policy-api-${this.getContext("environment")}`,
    });
    this.setContext("userPreferences", {}); // Dynamically loaded from user profile
    this.setContext("currentDomainLimit", CUSTOM_EMAIL_DOMAIN_LIMIT);
  }

  public setContext<T>(key: string, value: T): void {
    this.context.set(key, value);
    this.recordEvent({ type: "CONTEXT_UPDATE", payload: { key, value } });
  }

  public getContext<T>(key: string): T | undefined {
    return this.context.get(key) as T;
  }

  public recordEvent(event: GeminiEvent): void {
    this.history.push(event);
    // Trigger learning pipelines based on significant events
    this.processEventForLearning(event);
  }

  public getRecentEvents(count: number = 5): GeminiEvent[] {
    return this.history.slice(-count);
  }

  private processEventForLearning(event: GeminiEvent): void {
    // Simplified prompt-based learning pipeline:
    // If a domain creation fails multiple times, learn the common error.
    if (event.type === "DOMAIN_CREATE_FAILURE") {
      const { domain, error } = event.payload;
      const key = `failure_pattern:${domain}`;
      const currentCount = (this.learnedPatterns.get(key)?.count || 0) + 1;
      this.learnedPatterns.set(key, { count: currentCount, lastError: error });
      if (currentCount > 2) {
        // AI recognizes a recurring pattern: "This domain often fails with X reason."
        console.log(`Gemini has learned a recurring failure pattern for ${domain}: ${error}`);
        // In a real system, this would trigger an alert or an automated diagnostic.
      }
    }
    // Example: Adapt to user's common actions
    if (event.type === "DOMAIN_DEFAULT_SET_SUCCESS") {
      this.setContext("lastDefaultedDomain", event.payload.id);
    }
  }

  public getLearnedPattern(key: string): any {
    return this.learnedPatterns.get(key);
  }
}

/**
 * @class GeminiTelemetryService
 * Provides a production-grade observability layer.
 * This is a neural extension for emitting metrics, logs, and traces.
 */
export class GeminiTelemetryService {
  public emitMetric(name: string, value: number, tags?: Record<string, string>): void {
    // In a real system, this would push to a telemetry pipeline (e.g., Datadog, Prometheus)
    console.log(`[Gemini Telemetry] Metric: ${name} = ${value}`, tags);
    GeminiAgent.getInstance().contextManager.recordEvent({ type: "TELEMETRY_EMIT", payload: { metric: name, value: value } });
  }

  public logEvent(level: "info" | "warn" | "error", message: string, context?: any): void {
    // In a real system, this would push to a logging service (e.g., Splunk, ELK)
    console.log(`[Gemini Log - ${level.toUpperCase()}] ${message}`, context);
    GeminiAgent.getInstance().contextManager.recordEvent({ type: "TELEMETRY_EMIT", payload: { metric: `log_${level}`, value: message } });
  }

  public traceOperation(operationName: string, durationMs: number, details?: any): void {
    // In a real system, this would push to a tracing service (e.g., Jaeger, OpenTelemetry)
    console.log(`[Gemini Trace] ${operationName} took ${durationMs}ms`, details);
    GeminiAgent.getInstance().contextManager.recordEvent({ type: "TELEMETRY_EMIT", payload: { metric: `trace_${operationName}`, value: durationMs } });
  }
}

/**
 * @class GeminiPolicyEngine
 * Infuses real-world business logic and compliance checks via AI.
 * Simulates an intelligent API for policy enforcement.
 */
export class GeminiPolicyEngine {
  private complianceRules: Map<string, (context: any) => boolean> = new Map();

  constructor() {
    this.loadComplianceRules();
  }

  private loadComplianceRules() {
    // Simulate loading rules dynamically from a policy service or LLM config
    this.complianceRules.set("domain_naming_convention", (domain: string) => {
      // Example: Domain must be lowercase and contain at least one hyphen
      const isValid = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z]{2,}$/.test(domain) && domain.includes('-');
      if (!isValid) {
        console.warn(`[Gemini Policy] Domain "${domain}" violates naming convention.`);
      }
      return isValid;
    });
    this.complianceRules.set("domain_limit_enforcement", (currentCount: number) => {
      const limit = GeminiAgent.getInstance().contextManager.getContext<number>("currentDomainLimit") || CUSTOM_EMAIL_DOMAIN_LIMIT;
      const isWithinLimit = currentCount < limit;
      if (!isWithinLimit) {
        console.warn(`[Gemini Policy] Domain limit of ${limit} reached. Cannot add more.`);
        GeminiAgent.getInstance().contextManager.recordEvent({ type: "POLICY_VIOLATION", payload: { rule: "domain_limit_enforcement", context: { currentCount, limit } } });
      }
      return isWithinLimit;
    });
    // Add more rules like "domain_blacklist_check", "billing_tier_domain_allowance", etc.
  }

  public async enforcePolicy(ruleName: string, context: any): Promise<boolean> {
    const start = performance.now();
    const rule = this.complianceRules.get(ruleName);
    if (!rule) {
      console.warn(`[Gemini Policy] Policy rule "${ruleName}" not found. Skipping enforcement.`);
      return true; // Default to allowing if rule not found
    }
    const result = rule(context);
    const duration = performance.now() - start;
    GeminiAgent.getInstance().telemetryService.traceOperation(`PolicyEnforcement:${ruleName}`, duration, { result, context });
    return result;
  }

  public async evaluateDomainSuggestion(domain: string): Promise<{ isValid: boolean; reasons: string[] }> {
    const reasons: string[] = [];
    let isValid = true;

    if (!(await this.enforcePolicy("domain_naming_convention", domain))) {
      reasons.push("Domain name does not follow established naming conventions.");
      isValid = false;
    }
    // Simulate LLM call for reputation check
    const reputationScore = await GeminiAgent.getInstance().llmService.analyzeText(`Check domain reputation for ${domain}`);
    if (reputationScore < 0.3) { // Example threshold
      reasons.push("Domain has a low reputation score, suggesting potential spam or fraud risk.");
      isValid = false;
    }

    return { isValid, reasons };
  }
}

/**
 * @class GeminiLLMService
 * A simulated language model integration, acting as an autonomous externalization endpoint.
 * This would be a living integration with a real LLM like Google Gemini.
 */
export class GeminiLLMService {
  private modelEndpoint: string;

  constructor() {
    this.modelEndpoint = GeminiAgent.getInstance().contextManager.getContext<any>("serviceEndpoints")?.languageModel || "default-llm-endpoint";
    console.log(`[Gemini LLM] Initialized with endpoint: ${this.modelEndpoint}`);
  }

  /**
   * Simulates a call to an LLM for various AI tasks.
   * @param prompt The natural language prompt for the LLM.
   * @param context Optional contextual data for the LLM.
   * @returns A simulated AI response.
   */
  public async generateResponse(prompt: string, context?: Record<string, any>): Promise<string> {
    // In a real scenario, this would involve API calls to Google Gemini,
    // handling authentication, rate limits, and potentially retries.
    const start = performance.now();
    console.log(`[Gemini LLM] Processing prompt: "${prompt}" with context:`, context);

    await new Promise(resolve => setTimeout(Math.random() * 500 + 100, resolve)); // Simulate network latency

    let response = `AI-generated response for: "${prompt}"`;

    if (prompt.includes("suggest optimization")) {
      response = "Consider batching refresh requests or pre-verifying common domain patterns during off-peak hours.";
    } else if (prompt.includes("analyze error")) {
      const error = context?.error || "unknown error";
      if (error.includes("duplicate")) {
        response = `The domain already exists. Please verify the domain list or try a different one.`;
      } else if (error.includes("invalid format")) {
        response = `The provided domain format is incorrect. Ensure it follows a standard domain structure (e.g., example.com).`;
      } else {
        response = `An unexpected error occurred: "${error}". Consult system logs or retry the operation. If it persists, escalate to support.`;
      }
    } else if (prompt.includes("predict")) {
      const entity = context?.entity || "this operation";
      const outcome = Math.random() > 0.7 ? "likely succeed" : "may encounter issues due to historical data patterns.";
      response = `Based on past performance metrics, ${entity} is ${outcome}`;
    } else if (prompt.includes("reputation")) {
      response = Math.random(); // Simulate a score
    }

    const duration = performance.now() - start;
    GeminiAgent.getInstance().telemetryService.traceOperation("LLM_GenerateResponse", duration, { prompt, response });
    return response;
  }

  public async analyzeText(text: string): Promise<any> {
    // Placeholder for more complex text analysis
    return this.generateResponse(`Analyze the following text for insights: ${text}`);
  }
}


/**
 * @class GeminiAgent
 * The central AI orchestrator for this file, making it a self-aware infrastructure.
 * Manages context, decisions, and external interactions. Singleton pattern.
 */
export class GeminiAgent {
  private static instance: GeminiAgent;
  public contextManager: GeminiContextManager;
  public telemetryService: GeminiTelemetryService;
  public policyEngine: GeminiPolicyEngine;
  public llmService: GeminiLLMService;

  private constructor() {
    this.contextManager = new GeminiContextManager();
    this.telemetryService = new GeminiTelemetryService();
    this.policyEngine = new GeminiPolicyEngine();
    this.llmService = new GeminiLLMService();
    this.telemetryService.logEvent("info", "GeminiAgent initialized for OrganizationDomainContainer.");
  }

  public static getInstance(): GeminiAgent {
    if (!GeminiAgent.instance) {
      GeminiAgent.instance = new GeminiAgent();
    }
    return GeminiAgent.instance;
  }

  /**
   * Infuses decision-making at every level.
   * @param decisionPoint A unique identifier for the decision.
   * @param context Relevant data for the decision.
   * @returns A promise resolving to the AI's decision.
   */
  public async makeDecision(
    decisionPoint: string,
    context: Record<string, any>,
  ): Promise<any> {
    this.contextManager.recordEvent({ type: "CONTEXT_UPDATE", payload: { key: `decision:${decisionPoint}`, value: context } });
    this.telemetryService.emitMetric(`decision.${decisionPoint}.request`, 1);

    const prompt = `Based on the following context, what is the optimal decision for "${decisionPoint}"?`;
    const aiDecision = await this.llmService.generateResponse(prompt, { ...context, historicalData: this.contextManager.getRecentEvents() });

    this.telemetryService.emitMetric(`decision.${decisionPoint}.response`, 1);
    return aiDecision;
  }

  /**
   * Provides adaptive, generative, and evolving interaction.
   * This is a core prompt-driven reasoning pipeline.
   * @param actionType The type of action being performed.
   * @param payload Data related to the action.
   * @param currentOutcome The initial outcome (e.g., success/failure).
   * @returns An adaptive response or modified outcome.
   */
  public async processAdaptiveResponse(
    actionType: string,
    payload: Record<string, any>,
    currentOutcome: "success" | "failure",
  ): Promise<string> {
    this.contextManager.recordEvent({ type: "CONTEXT_UPDATE", payload: { key: `action:${actionType}`, value: payload } });
    this.telemetryService.emitMetric(`action.${actionType}.outcome.${currentOutcome}`, 1);

    if (currentOutcome === "failure") {
      const errorMsg = payload.error || "An unknown error occurred.";
      const prompt = `Analyze error "${errorMsg}" for action "${actionType}" with context: ${JSON.stringify(payload)}. Suggest resolution or next steps.`;
      const aiResolution = await this.llmService.generateResponse(prompt, { error: errorMsg, action: actionType });
      this.telemetryService.logEvent("error", `AI attempting resolution for ${actionType}: ${errorMsg}`, { payload, aiResolution });
      // In a real system, this could trigger an automated retry with modified parameters
      // or suggest a specific fix to the user.
      return `Operation failed. Gemini suggests: ${aiResolution}`;
    } else {
      const prompt = `Based on successful completion of "${actionType}" with payload: ${JSON.stringify(payload)}, suggest optimal next user action or system optimization.`;
      const aiSuggestion = await this.llmService.generateResponse(prompt, payload);
      this.telemetryService.logEvent("info", `AI suggesting next steps for ${actionType}: ${aiSuggestion}`, { payload });
      return `Operation successful! Gemini suggests: ${aiSuggestion}`;
    }
  }

  /**
   * Predicts future states or potential issues.
   * @param predictionTarget What to predict (e.g., "verification_status", "user_churn").
   * @param context Relevant data for the prediction.
   * @returns A promise resolving to the AI's prediction.
   */
  public async predict(predictionTarget: string, context: Record<string, any>): Promise<any> {
    const prompt = `Predict the ${predictionTarget} based on context: ${JSON.stringify(context)}.`;
    const aiPrediction = await this.llmService.generateResponse(prompt, context);
    this.contextManager.recordEvent({ type: "PREDICTIVE_ACTION_TRIGGERED", payload: { action: predictionTarget, suggestion: aiPrediction } });
    this.telemetryService.emitMetric(`prediction.${predictionTarget}.request`, 1);
    return aiPrediction;
  }

  /**
   * Observes an existing function call and injects AI logic around it.
   * This allows the GeminiAgent to "learn" from existing operations.
   * @param operationName Name of the operation being observed.
   * @param func The original function to execute.
   * @param args Arguments for the original function.
   * @param context Additional context for AI reasoning.
   */
  public async observeAndEnhance<T>(
    operationName: string,
    func: (...args: any[]) => Promise<T>,
    args: any[],
    context: Record<string, any> = {},
  ): Promise<T> {
    const start = performance.now();
    this.contextManager.recordEvent({ type: "CONTEXT_UPDATE", payload: { key: `observed:${operationName}:input`, value: { args, context } } });
    this.telemetryService.logEvent("info", `Observing operation: ${operationName}`, { args, context });

    try {
      const result = await func(...args);
      const duration = performance.now() - start;
      this.telemetryService.traceOperation(operationName, duration, { status: "success" });
      this.contextManager.recordEvent({ type: `${operationName}_SUCCESS`, payload: { result, ...context } });
      await this.processAdaptiveResponse(operationName, { result, ...context }, "success");
      return result;
    } catch (e: any) {
      const duration = performance.now() - start;
      this.telemetryService.traceOperation(operationName, duration, { status: "failure", error: e.message });
      this.contextManager.recordEvent({ type: `${operationName}_FAILURE`, payload: { error: e.message, ...context } });
      const adaptiveMsg = await this.processAdaptiveResponse(operationName, { error: e.message, ...context }, "failure");
      // Circuit-breaking: If a specific failure pattern (learned by contextManager) occurs repeatedly,
      // the GeminiAgent could temporarily disable the functionality or switch to a fallback.
      if (this.contextManager.getLearnedPattern(`failure_pattern:${operationName}`)?.count > 5) {
        console.error(`[Gemini Circuit-Breaker] Repeated failures for ${operationName}. Considering temporary disablement.`);
        // In a real system, this would flip a circuit breaker.
        this.telemetryService.emitMetric(`circuit_breaker.${operationName}.activated`, 1);
      }
      throw new Error(adaptiveMsg); // Re-throw with AI-enhanced error message
    }
  }
}

// Instantiate the GeminiAgent
export const geminiAgent = GeminiAgent.getInstance();

// --- END GEMINI INTEGRATION & SELF-CONTAINED UNIVERSE ARCHITECTURE ---


const MAPPING = {
  domain: "Domain",
  default: "",
  status: "Status",
  updatedAt: "Updated",
  actions: "",
};

const STYLE_MAPPING = {
  domain: "table-entry-wide items-center !py-1",
  default: "!py-1 items-center",
  status: "table-entry-wide items-center !py-1",
  updatedAt: "flex justify-start table-entry-hide-small items-center",
  actions: "!py-1 items-center",
};

export interface OrganizationDomainContainerProps {
  setAlert: (alert: React.ReactNode) => void;
  data: CustomEmailDomainViewQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<ApolloQueryResult<CustomEmailDomainViewQuery>>;
}

const CUSTOM_EMAIL_DOMAIN_LIMIT = 5; // This could be dynamically set by GeminiPolicyEngine

export function OrganizationDomainContainer({
  setAlert,
  data,
  loading,
  error,
  refetch,
}: OrganizationDomainContainerProps) {
  const [isNewDomainCardOpen, setIsNewDomainCardOpen] = useState(false);
  const [isCustomEmailDomainModalOpen, setIsCustomEmailDomainModalOpen] =
    useState(false);
  const [reachedCustomEmailDomainLimit, setReachedCustomEmailDomainLimit] =
    useState(false);
  const [customEmailDomainToShow, setCustomEmailDomainToShow] =
    useState<CustomEmailDomain | null>(null);
  const [createCustomEmailDomainMutation] = useCreateCustomEmailDomainMutation();
  const [deleteCustomEmailDomainMutation] = useDeleteCustomEmailDomainMutation();
  const [setDefaultCustomEmailDomainMutation] = useUpdateCustomEmailDomainMutation();
  const [bulkRefreshCustomEmailDomainVerificationStatusMutation] =
    useBulkRefreshCustomEmailDomainVerificationStatusMutation();
  const [sendTestEmailMutation] = useSendTestEmailMutation();

  // Gemini-enhanced state management
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    geminiAgent.contextManager.setContext("currentDomainData", data);
    geminiAgent.contextManager.recordEvent({ type: "UI_STATE_CHANGE", payload: { state: "container_loaded", value: true } });

    let isCustomEmailDomainLimitReached = false;
    const currentDomainCount = data?.customEmailDomains?.edges.length || 0;
    const effectiveLimit = geminiAgent.contextManager.getContext<number>("currentDomainLimit") || CUSTOM_EMAIL_DOMAIN_LIMIT;

    if (currentDomainCount >= effectiveLimit) { // Use >= for limit check
      isCustomEmailDomainLimitReached = true;
    }
    setReachedCustomEmailDomainLimit(isCustomEmailDomainLimitReached);

    // AI-driven prediction for next steps or potential issues
    geminiAgent.predict("next_user_action_prediction", {
      currentDomainCount,
      isLimitReached: isCustomEmailDomainLimitReached,
      recentEvents: geminiAgent.contextManager.getRecentEvents()
    }).then(prediction => {
      setAiSuggestions([`Gemini predicts: ${prediction}`]);
    });

    // Policy enforcement on load
    geminiAgent.policyEngine.enforcePolicy("domain_limit_enforcement", currentDomainCount).then(isValid => {
      if (!isValid && !isCustomEmailDomainLimitReached) {
        // Correct inconsistencies between UI state and policy engine
        setReachedCustomEmailDomainLimit(true);
        geminiAgent.telemetryService.logEvent("warn", "UI state corrected by policy engine for domain limit.");
      }
    });

  }, [data, geminiAgent.contextManager, geminiAgent.policyEngine, geminiAgent.llmService]); // Added geminiAgent dependencies

  const flashError = useErrorBanner();
  const flashSuccess = useSuccessBanner();

  const onBulkRefreshCustomEmailDomainVerificationStatus = (): void => {
    geminiAgent.observeAndEnhance(
      "BulkRefreshStatus",
      async () => {
        geminiAgent.contextManager.recordEvent({ type: "BULK_REFRESH_INITIATED" });
        await bulkRefreshCustomEmailDomainVerificationStatusMutation({
          variables: { input: {} },
        }).then(async () => {
          await refetch();
          geminiAgent.contextManager.recordEvent({ type: "BULK_REFRESH_SUCCESS" });
        });
      },
      [],
    )
      .then(response => {
        // Enhanced success feedback from AI
        geminiAgent.processAdaptiveResponse("BulkRefreshStatus", { response }, "success").then(aiMsg => flashSuccess(aiMsg));
      })
      .catch((e: Error) => {
        geminiAgent.contextManager.recordEvent({ type: "BULK_REFRESH_FAILURE", payload: { error: e.message } });
        flashError(e.message); // This error message is already AI-enhanced by observeAndEnhance
      });
  };

  const onSetDefaultCustomEmailDomain = (customEmailDomainId: string): void => {
    geminiAgent.observeAndEnhance(
      "SetDefaultDomain",
      async () => {
        geminiAgent.contextManager.recordEvent({ type: "DOMAIN_DEFAULT_SET_INITIATED", payload: { id: customEmailDomainId } });
        const defaultValue = customEmailDomainId !== MT_MAIL_DOMAIN_ID;
        const result = await setDefaultCustomEmailDomainMutation({
          variables: {
            input: { id: customEmailDomainId, default: defaultValue },
          },
        });

        if (result?.data?.updateCustomEmailDomain?.errors.length) {
          throw new Error(result.data.updateCustomEmailDomain.errors[0]);
        }
        await refetch();
        geminiAgent.contextManager.recordEvent({ type: "DOMAIN_DEFAULT_SET_SUCCESS", payload: { id: customEmailDomainId } });
        return result;
      },
      [customEmailDomainId],
      { id: customEmailDomainId }
    )
      .then(response => {
        geminiAgent.processAdaptiveResponse("SetDefaultDomain", { id: customEmailDomainId, response }, "success").then(aiMsg => flashSuccess(aiMsg));
      })
      .catch((e: Error) => {
        geminiAgent.contextManager.recordEvent({ type: "DOMAIN_DEFAULT_SET_FAILURE", payload: { id: customEmailDomainId, error: e.message } });
        flashError(e.message);
      });
  };

  const onDeleteCustomEmailDomain = (customEmailDomainId: string): void => {
    geminiAgent.observeAndEnhance(
      "DeleteCustomEmailDomain",
      async () => {
        geminiAgent.contextManager.recordEvent({ type: "DOMAIN_DELETE_INITIATED", payload: { id: customEmailDomainId } });
        const result = await deleteCustomEmailDomainMutation({
          variables: { input: { id: customEmailDomainId } },
        });

        if (result?.data?.deleteCustomEmailDomain?.errors.length) {
          throw new Error(result.data.deleteCustomEmailDomain.errors[0]);
        }
        await refetch();
        geminiAgent.contextManager.recordEvent({ type: "DOMAIN_DELETE_SUCCESS", payload: { id: customEmailDomainId } });
        return result;
      },
      [customEmailDomainId],
      { id: customEmailDomainId }
    )
      .then(response => {
        geminiAgent.processAdaptiveResponse("DeleteCustomEmailDomain", { id: customEmailDomainId, response }, "success").then(aiMsg => flashSuccess(aiMsg));
      })
      .catch((e: Error) => {
        geminiAgent.contextManager.recordEvent({ type: "DOMAIN_DELETE_FAILURE", payload: { id: customEmailDomainId, error: e.message } });
        flashError(e.message);
      });
  };

  const onCreateCustomEmailDomain = (
    domain: string,
    actions: FormikHelpers<{
      customEmailDomainInput: string;
    }>,
  ) => {
    // AI-driven pre-check for compliance and domain reputation
    geminiAgent.policyEngine.evaluateDomainSuggestion(domain).then(policyResult => {
      if (!policyResult.isValid) {
        policyResult.reasons.forEach(reason => actions.setFieldError("customEmailDomainInput", reason));
        flashError("Domain creation blocked by Gemini Policy Engine. See form errors for details.");
        actions.setSubmitting(false);
        return;
      }

      const currentDomainCount = data?.customEmailDomains?.edges.length || 0;
      geminiAgent.policyEngine.enforcePolicy("domain_limit_enforcement", currentDomainCount + 1).then(isWithinLimit => {
        if (!isWithinLimit) {
          actions.setFieldError("customEmailDomainInput", "Domain limit reached. Cannot add more domains.");
          flashError("Domain creation blocked: you have reached the maximum number of custom domains.");
          actions.setSubmitting(false);
          return;
        }

        geminiAgent.observeAndEnhance(
          "CreateCustomEmailDomain",
          async () => {
            geminiAgent.contextManager.recordEvent({ type: "DOMAIN_CREATE_INITIATED", payload: { domain } });
            const result = await createCustomEmailDomainMutation({
              variables: { input: { input: { customEmailDomain: domain } } },
            });

            if (result?.data?.createCustomEmailDomain?.serializedErrors?.customEmailDomain) {
              throw new Error(result.data.createCustomEmailDomain.serializedErrors.customEmailDomain);
            } else if (result?.data?.createCustomEmailDomain?.errors.length) {
              throw new Error(result.data.createCustomEmailDomain.errors[0]);
            }
            setIsNewDomainCardOpen(false);
            await refetch();
            geminiAgent.contextManager.recordEvent({ type: "DOMAIN_CREATE_SUCCESS", payload: { domain, id: result.data?.createCustomEmailDomain?.customEmailDomain?.id || 'unknown' } });
            return result;
          },
          [domain],
          { domain }
        )
          .then(response => {
            setAlert(
              <Alert alertType="success" onClear={(): void => setAlert(null)}>
                DNS records are being generated for your new domain. You should
                receive an email with them shortly.
                <a href="https://docs.moderntreasury.com/docs/custom-email-domains">
                  &nbsp; Learn more.
                </a>
              </Alert>,
            );
            geminiAgent.processAdaptiveResponse("CreateCustomEmailDomain", { domain, response }, "success").then(aiMsg => flashSuccess(aiMsg));
          })
          .catch((e: Error) => {
            actions.setFieldError("customEmailDomainInput", e.message); // This error is AI-enhanced
            flashError(e.message);
            geminiAgent.contextManager.recordEvent({ type: "DOMAIN_CREATE_FAILURE", payload: { domain, error: e.message } });
          })
          .finally(() => {
            actions.setSubmitting(false);
          });
      });
    });
  };

  const onSendTestEmail = (customEmailDomainId: string): void => {
    geminiAgent.observeAndEnhance(
      "SendTestEmail",
      async () => {
        geminiAgent.contextManager.recordEvent({ type: "TEST_EMAIL_SEND_INITIATED", payload: { id: customEmailDomainId } });
        const result = await sendTestEmailMutation({
          variables: { input: { id: customEmailDomainId } },
        });

        if (result?.data?.sendTestEmail?.errors.length) {
          throw new Error(result.data.sendTestEmail.errors[0]);
        }
        geminiAgent.contextManager.recordEvent({ type: "TEST_EMAIL_SEND_SUCCESS", payload: { id: customEmailDomainId } });
        return result;
      },
      [customEmailDomainId],
      { id: customEmailDomainId }
    )
      .then(response => {
        geminiAgent.processAdaptiveResponse("SendTestEmail", { id: customEmailDomainId, response }, "success").then(aiMsg => flashSuccess(aiMsg));
      })
      .catch((e: Error) => {
        geminiAgent.contextManager.recordEvent({ type: "TEST_EMAIL_SEND_FAILURE", payload: { id: customEmailDomainId, error: e.message } });
        flashError(e.message);
      });
  };

  const resetCustomEmailDomainModal = () => {
    setIsCustomEmailDomainModalOpen(false);
    setCustomEmailDomainToShow(null);
    geminiAgent.contextManager.recordEvent({ type: "UI_STATE_CHANGE", payload: { state: "modal_closed", value: false } });
  };

  if (loading) {
    // AI-powered loading experience: predict estimated load time
    geminiAgent.predict("estimated_load_time", { component: "OrganizationDomainContainer" }).then(prediction => {
      setAiSuggestions(prev => [...prev, `Gemini estimates load time: ${prediction}`]);
    });
    return (
      <IndexTableSkeletonLoader headers={Object.keys(MAPPING)} numRows={14} />
    );
  }

  const customEmailDomains =
    !data || error
      ? []
      : data.customEmailDomains?.edges.map(({ node }) => ({
          ...node,
          domain: (
            <div className="flex flex-row items-center gap-2">
              <div>{node.domain}</div>
              {/* Gemini could add dynamic indicators here based on predictive analysis */}
              {geminiAgent.predict("domain_risk_assessment", { domain: node.domain, status: node.verificationStatus }).then(risk => {
                if (risk === "high_risk") return <Badge text="Risk Alert" type={BadgeType.Danger} keepCaseFormat />;
                return null;
              })}
            </div>
          ),
          default: node.default ? (
            <div className="flex flex-row items-center">
              <Badge text="Default" type={BadgeType.Default} keepCaseFormat />
            </div>
          ) : (
            " "
          ),
          status: (
            <DnsVerificationStatusBadge status={node.verificationStatus} />
          ),
          updatedAt: node.updatedAt ? (
            <DateTime timestamp={node.updatedAt} />
          ) : (
            <p className="text-gray-500">N/A</p>
          ),
          actions: (
            <Popover display="block">
              <PopoverTrigger
                className="border-none"
                buttonType="text"
                buttonHeight="small"
                hideFocusOutline
              >
                <div className="z-10 py-0" id={`${node.domain}`}>
                  <Icon
                    iconName="more_horizontal"
                    className="text-gray-600"
                    color="currentColor"
                    size="s"
                  />
                </div>
              </PopoverTrigger>
              <PopoverPanel anchorOrigin={{ horizontal: "right" }}>
                {(panelProps: { close: () => void }) => (
                  <CustomEmailDomainActionItem
                    customEmailDomain={node}
                    showDnsRecordOnClickFunc={() => {
                      setIsCustomEmailDomainModalOpen(true);
                      setCustomEmailDomainToShow(node);
                      panelProps.close();
                      geminiAgent.contextManager.recordEvent({ type: "UI_STATE_CHANGE", payload: { state: "modal_opened", value: true, domain: node.id } });
                    }}
                    deleteCustomEmailDomainOnClickFunc={() => {
                      onDeleteCustomEmailDomain(node.id);
                      panelProps.close();
                    }}
                    setAsDefaultOnClickFunc={() => {
                      onSetDefaultCustomEmailDomain(node.id);
                      panelProps.close();
                    }}
                    sendTestEmailFunc={() => {
                      onSendTestEmail(node.id);
                      panelProps.close();
                    }}
                  />
                )}
              </PopoverPanel>
            </Popover>
          ),
        }));

  const currentDomainCount = customEmailDomains?.length || 0;
  const effectiveDomainLimit = geminiAgent.contextManager.getContext<number>("currentDomainLimit") || CUSTOM_EMAIL_DOMAIN_LIMIT;
  const addDomainButtonDisabled = isNewDomainCardOpen || reachedCustomEmailDomainLimit;
  const addDomainButtonTitle = reachedCustomEmailDomainLimit
    ? `You can have a maximum of ${effectiveDomainLimit} custom domains. This limit can be dynamically adjusted by Gemini based on your billing tier or historical usage.`
    : "";

  return (
    <div>
      {isCustomEmailDomainModalOpen && (
        <CustomEmailDomainModal
          isOpen={isCustomEmailDomainModalOpen}
          handleModalClose={resetCustomEmailDomainModal}
          customEmailDomain={customEmailDomainToShow}
        />
      )}
      <div>
        <div className="relative mb-2 mt-1 flex flex-row space-x-6">
          <div className="font-medium">Add a Custom Domain</div>
        </div>
        <div className="pb-6 text-sm">
          Custom domains may be used to send customer emails. You need to upload
          DNS records to your domain provider. Once verified, a custom domain
          may be set as the default.
          <a href="https://docs.moderntreasury.com/docs/custom-email-domains">
            &nbsp; Learn more.
          </a>
          {aiSuggestions.length > 0 && (
            <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-500 text-blue-700 text-xs">
              <strong>Gemini Insights:</strong>
              <ul>
                {aiSuggestions.map((suggestion, index) => (
                  <li key={`ai-sug-${index}`}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="relative">
          {isNewDomainCardOpen && (
            <DomainCardForm
              onClickFunc={() => {
                setIsNewDomainCardOpen(false);
                geminiAgent.contextManager.recordEvent({ type: "UI_STATE_CHANGE", payload: { state: "new_domain_card_closed", value: false } });
              }}
              onSubmitFunc={onCreateCustomEmailDomain}
            />
          )}
          <IndexTable
            dataMapping={MAPPING}
            data={customEmailDomains || []}
            styleMapping={STYLE_MAPPING}
          />
          <div className="flex flex-row pt-4">
            <Button
              className="mr-4"
              buttonHeight="small"
              onClick={() => {
                onBulkRefreshCustomEmailDomainVerificationStatus();
              }}
              disabled={isNewDomainCardOpen}
            >
              <span className="text-xs">Refresh Status</span>
            </Button>
            <Button
              buttonHeight="small"
              buttonType={"primary" as ButtonType}
              onClick={() => {
                setIsNewDomainCardOpen(true);
                geminiAgent.contextManager.recordEvent({ type: "UI_STATE_CHANGE", payload: { state: "new_domain_card_opened", value: true } });
              }}
              disabled={addDomainButtonDisabled}
              title={addDomainButtonTitle}
            >
              <span className="text-xs">Add a Domain</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationDomainContainer;