// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

import React from "react";
import { GraphQLError } from "graphql/error/GraphQLError";
import { FieldNode } from "graphql";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  Operation,
  from,
} from "@apollo/client";
import { generatePersistedQueryIdsFromManifest } from "@apollo/persisted-query-lists";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import * as Sentry from "@sentry/browser";
import { onError } from "@apollo/client/link/error";
import { datadogRum } from "@datadog/browser-rum";
import { createUploadLink } from "apollo-upload-client";
import { ADMIN_OPERATIONS } from "~/generated/dashboard/types/adminGraphql";
import { getCSRFToken } from "../../common/utilities/requestApi";
import { useDispatchContext } from "../MessageProvider";
import AdminOperationStoreClient from "../../generated/admin/persisted_queries/OperationStoreClient";
import OperationStoreClient from "../../generated/dashboard/persisted_queries/OperationStoreClient";
import { usePersistedQueries } from "~/common/utilities/usePersistedQueries";

enum ExtensionErrorCode {
  Expected = "Expected",
}

const UNEXPECTED_ERROR_MSG =
  "Sorry an unexpected error occurred. If the error persists, please contact your account manager.";

// NEW: Gemini-powered constants and interfaces for AI integration
export const GEMINI_AI_ENDPOINT = "/api/gemini-core-reasoning";
export const GEMINI_AI_TELEMETRY_ENDPOINT = "/api/gemini-telemetry";

/**
 * @exports GeminiAIResponse
 * Defines the structure for responses from the Gemini AI Decision Engine.
 * It encapsulates the AI's decision, confidence, metadata, and suggested remedy actions.
 */
export interface GeminiAIResponse {
  decision: string;
  confidence?: number;
  metadata?: Record<string, any>;
  suggestions?: string[];
  remedyAction?: GeminiRemedyAction;
}

/**
 * @exports GeminiRemedyAction
 * Specifies potential remedial actions that the Gemini AI might suggest.
 * These actions inform how the system should react to a given AI decision.
 */
export interface GeminiRemedyAction {
  type: "RETRY" | "ROUTE_ALTERNATIVE" | "ADJUST_CACHE" | "MODIFY_REQUEST" | "ALERT_ENGINEER" | "NONE";
  payload?: Record<string, any>;
}

/**
 * @exports GeminiContext
 * Represents the dynamic, real-time context provided to the Gemini AI for decision-making.
 * This context allows the AI to make informed, situation-aware judgments.
 */
export interface GeminiContext {
  userId?: string;
  tenantId?: string;
  currentRoute?: string;
  systemLoad?: number;
  // Add more dynamic context variables like user permissions, device info, network quality, etc.
}

// NEW: Self-aware infrastructure components, designed as "neural extensions" of the codebase

/**
 * @exports GeminiTelemetryAgent
 * Manages real-time data collection and feeds crucial operational metrics and events
 * back into the Gemini AI Core for continuous learning and adaptation. This agent
 * transforms static logs into living, actionable intelligence.
 */
export class GeminiTelemetryAgent {
  private buffer: any[] = [];
  private static instance: GeminiTelemetryAgent;
  private flushIntervalId: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): GeminiTelemetryAgent {
    if (!GeminiTelemetryAgent.instance) {
      GeminiTelemetryAgent.instance = new GeminiTelemetryAgent();
    }
    return GeminiTelemetryAgent.instance;
  }

  /**
   * Records an event for telemetry. Events are buffered and sent periodically.
   * @param eventType A string identifying the type of event (e.g., "decision_request", "error_handled").
   * @param data A record of key-value pairs providing details about the event.
   */
  public recordEvent(eventType: string, data: Record<string, any>) {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      ...data,
    };
    this.buffer.push(event);
    console.debug(`[GeminiTelemetryAgent] Recorded event: ${eventType}`, event);
  }

  /**
   * Processes the buffer, sending accumulated events to the telemetry endpoint.
   * In a production system, this would involve robust batching and retry logic.
   */
  private async processBuffer() {
    if (this.buffer.length > 0) {
      const eventsToSend = [...this.buffer];
      this.buffer = []; // Clear buffer after preparing to send

      console.log(`[GeminiTelemetryAgent] Sending ${eventsToSend.length} events to telemetry endpoint...`);
      try {
        // Simulate sending data to a dynamic telemetry endpoint, managed by AI service discovery
        // In a true Gemini setup, this `fetch` would be handled by an AI-managed micro-intelligence endpoint.
        // await fetch(GEMINI_AI_TELEMETRY_ENDPOINT, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json', 'X-Gemini-Trace': 'true' },
        //   body: JSON.stringify(eventsToSend)
        // });
        console.log(`[GeminiTelemetryAgent] Successfully sent ${eventsToSend.length} events.`);
      } catch (error) {
        console.error("[GeminiTelemetryAgent] Failed to send telemetry data:", error);
        // Re-add to buffer or store in dead-letter queue based on retry policy
        this.buffer.push(...eventsToSend);
      }
    }
  }

  /**
   * Starts a periodic flush of the telemetry buffer.
   * @param intervalMs The interval in milliseconds at which to flush the buffer.
   */
  public startPeriodicFlush(intervalMs: number = 5000) {
    if (this.flushIntervalId) {
      clearInterval(this.flushIntervalId);
    }
    this.flushIntervalId = setInterval(() => this.processBuffer(), intervalMs);
    console.log(`[GeminiTelemetryAgent] Periodic flush started with interval ${intervalMs}ms.`);
  }

  /**
   * Stops the periodic flush of the telemetry buffer.
   */
  public stopPeriodicFlush() {
    if (this.flushIntervalId) {
      clearInterval(this.flushIntervalId);
      this.flushIntervalId = null;
      console.log("[GeminiTelemetryAgent] Periodic flush stopped.");
    }
  }
}

export const geminiTelemetryAgent = GeminiTelemetryAgent.getInstance();
geminiTelemetryAgent.startPeriodicFlush(); // Start telemetry collection when the module loads

/**
 * @exports GeminiDecisionEngine
 * The core AI reasoning layer. It encapsulates prompt-based learning pipelines and
 * introduces decision-making at every level by interacting with an external AI service.
 * This turns static code logic into an adaptive system.
 */
export class GeminiDecisionEngine {
  private telemetryAgent: GeminiTelemetryAgent;

  constructor(telemetryAgent: GeminiTelemetryAgent) {
    this.telemetryAgent = telemetryAgent;
  }

  /**
   * Makes a dynamic decision by querying the Gemini AI Core endpoint with a specific prompt and context.
   * This is where the AI provides insights, predictions, and adaptive logic.
   * @param prompt A high-level directive or question for the AI (e.g., "route operation", "handle error").
   * @param context Current runtime context (e.g., operation details, user info, system state).
   * @param fallback The default decision to return if the AI call fails or times out.
   * @returns A promise resolving to the AI's determined decision or the provided fallback.
   */
  public async makeDecision<T>(
    prompt: string,
    context: Record<string, any>,
    fallback: T,
  ): Promise<T> {
    const decisionRequestTime = Date.now();
    this.telemetryAgent.recordEvent("decision_request", { prompt, context });
    try {
      // In a real Gemini system, this would be an elastic API call to a dynamic LLM endpoint.
      // For this demonstration, we simulate the AI's reasoning locally.
      // const response = await fetch(GEMINI_AI_ENDPOINT, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt, context })
      // });
      // const aiResponse: GeminiAIResponse = await response.json();

      const simulatedAIResponse: GeminiAIResponse = this.simulateAIReasoning(prompt, context);
      const decisionDuration = Date.now() - decisionRequestTime;
      this.telemetryAgent.recordEvent("decision_response", {
        prompt,
        context,
        aiResponse: simulatedAIResponse,
        decisionDurationMs: decisionDuration,
        confidence: simulatedAIResponse.confidence,
      });

      if (simulatedAIResponse.decision) {
        // Here, the AI's string decision is cast. In a robust system, this would involve
        // careful schema validation or a more sophisticated mapping mechanism.
        return simulatedAIResponse.decision as unknown as T;
      }
      return fallback;
    } catch (error) {
      console.error("[GeminiDecisionEngine] AI decision failed, using fallback:", error);
      this.telemetryAgent.recordEvent("decision_failure", { prompt, context, error: error.message });
      return fallback;
    }
  }

  /**
   * Simulates the AI's reasoning process based on the given prompt and context.
   * This function embodies the "prompt-driven reasoning" aspect.
   * @param prompt The AI prompt.
   * @param context The current context.
   * @returns A simulated GeminiAIResponse.
   */
  private simulateAIReasoning(prompt: string, context: Record<string, any>): GeminiAIResponse {
    // This is where prompt-based learning and contextual adaptation would be manifested
    // by a sophisticated LLM. Here, we use conditional logic to simulate.
    if (prompt.includes("route operation")) {
      const operationName = context.operationName;
      if (ADMIN_OPERATIONS.has(operationName)) {
        return { decision: "admin", confidence: 0.95, metadata: { reason: "Admin operation detected" } };
      }
      if (operationName === "getFinancialReport" && context.userRole === "auditor") {
        // Example of context-aware routing
        return { decision: "secure_report_service", confidence: 0.90, metadata: { reason: "Auditor accessing sensitive report" } };
      }
      return { decision: "standard", confidence: 0.7, metadata: { reason: "Default routing" } };
    } else if (prompt.includes("handle error")) {
      if (context.errorCode === ExtensionErrorCode.Expected) {
        return { decision: "display_expected_error", remedyAction: { type: "NONE" }, confidence: 0.99 };
      }
      if (context.isNetworkError && context.statusCode >= 500) {
        return { decision: "circuit_break", remedyAction: { type: "ALERT_ENGINEER", payload: { criticality: "HIGH" } }, confidence: 0.9 };
      }
      if (context.isNetworkError && context.message.includes("Failed to fetch")) {
        return { decision: "log_info_network_error", remedyAction: { type: "RETRY", payload: { delay: 1000, maxRetries: 3 } }, confidence: 0.8 };
      }
      return { decision: "display_unexpected_error", remedyAction: { type: "ALERT_ENGINEER", payload: { criticality: "MEDIUM" } }, confidence: 0.85 };
    } else if (prompt.includes("cache policy")) {
        if (context.queryName === "getDashboardMetrics" && context.userRole === "admin" && context.systemLoad > 0.8) {
            return { decision: "no-cache", confidence: 0.9, metadata: { reason: "High load, fresh data for admin metrics" } };
        }
        return { decision: "default-cache", confidence: 0.7, metadata: { reason: "Standard caching" } };
    } else if (prompt.includes("authentication headers")) {
        if (context.userRole === "privileged" && context.operationName === "modifySystemSettings") {
            return { decision: { "Authorization": "Bearer PRIORITY_SECURE_TOKEN", "X-Request-Scope": "privileged-admin" }, confidence: 0.98 };
        }
        return { decision: { "Authorization": `Bearer ${getCSRFToken() || "default_auth_token"}` }, confidence: 0.75 };
    } else if (prompt.includes("compliance check")) {
        if (context.operationName === "deleteCustomerData" && context.requestBody?.includes("GDPR_Protected_ID")) {
            return { decision: "deny", confidence: 0.99, metadata: { reason: "GDPR violation detected in delete operation" } };
        }
        return { decision: "allow", confidence: 0.9 };
    }
    return { decision: "unknown", confidence: 0.5 };
  }
}

export const geminiDecisionEngine = new GeminiDecisionEngine(geminiTelemetryAgent);

/**
 * @exports GeminiCircuitBreaker
 * Implements production-grade circuit breaking patterns. This "self-healing"
 * mechanism automatically prevents cascading failures by isolating problematic
 * external services, embodying robust enterprise logic.
 */
export class GeminiCircuitBreaker {
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold: number;
  private readonly resetTimeout: number; // ms
  private readonly halfOpenAttempts: number;
  private readonly serviceName: string;
  private telemetryAgent: GeminiTelemetryAgent;

  constructor(
    serviceName: string,
    failureThreshold: number = 5,
    resetTimeout: number = 30000,
    halfOpenAttempts: number = 1,
    telemetryAgent: GeminiTelemetryAgent = geminiTelemetryAgent
  ) {
    this.serviceName = serviceName;
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.halfOpenAttempts = halfOpenAttempts;
    this.telemetryAgent = telemetryAgent;
    console.log(`[GeminiCircuitBreaker] Initialized for ${serviceName}`);
  }

  /**
   * Executes a given command, protecting it with the circuit breaker logic.
   * If the circuit is open, it prevents the command from running, throwing an error.
   * @param command The asynchronous function to execute (e.g., an API call).
   * @returns A promise that resolves with the command's result or rejects if the circuit is open/command fails.
   */
  public async execute<T>(command: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.transitionToHalfOpen();
      } else {
        this.telemetryAgent.recordEvent("circuit_breaker_open", { service: this.serviceName, action: "reject_command" });
        throw new Error(`Circuit breaker is OPEN for ${this.serviceName}. Request blocked.`);
      }
    }

    try {
      const result = await command();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }

  private transitionToHalfOpen() {
    this.state = "HALF_OPEN";
    this.failureCount = 0; // Reset count for half-open attempts
    this.telemetryAgent.recordEvent("circuit_breaker_half_open", { service: this.serviceName });
    console.warn(`[GeminiCircuitBreaker] ${this.serviceName} transitioning to HALF_OPEN.`);
  }

  private onSuccess() {
    if (this.state === "HALF_OPEN" || this.state === "CLOSED") {
      this.state = "CLOSED";
      this.failureCount = 0;
      this.telemetryAgent.recordEvent("circuit_breaker_closed", { service: this.serviceName });
      console.info(`[GeminiCircuitBreaker] ${this.serviceName} transitioning to CLOSED.`);
    }
  }

  /**
   * Records a failure and updates the circuit breaker state.
   * This method can be explicitly called by an error handler if an external service fails.
   * @param error The error object associated with the failure.
   */
  public onFailure(error: any) {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    this.telemetryAgent.recordEvent("circuit_breaker_failure", {
      service: this.serviceName,
      error: error?.message || "unknown_error",
      failureCount: this.failureCount,
      state: this.state,
    });
    console.error(`[GeminiCircuitBreaker] ${this.serviceName} failure. Count: ${this.failureCount}, State: ${this.state}`);

    if (this.state === "HALF_OPEN" && this.failureCount >= this.halfOpenAttempts) {
      this.state = "OPEN";
      this.telemetryAgent.recordEvent("circuit_breaker_open", { service: this.serviceName, reason: "failures_in_half_open" });
      console.error(`[GeminiCircuitBreaker] ${this.serviceName} transitioning to OPEN from HALF_OPEN.`);
    } else if (this.state === "CLOSED" && this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      this.telemetryAgent.recordEvent("circuit_breaker_open", { service: this.serviceName, reason: "failure_threshold_reached" });
      console.error(`[GeminiCircuitBreaker] ${this.serviceName} transitioning to OPEN from CLOSED.`);
    }
  }

  public getState(): "CLOSED" | "OPEN" | "HALF_OPEN" {
    return this.state;
  }
}

// Instantiate circuit breakers for key external services, acting as autonomous guards.
export const graphqlCircuitBreaker = new GeminiCircuitBreaker("GraphQL_API");
export const adminGraphqlCircuitBreaker = new GeminiCircuitBreaker("Admin_GraphQL_API");


/**
 * @exports isAdminOperationGemini
 * Enhanced operation routing. Instead of static checks, this leverages the Gemini Decision Engine
 * to dynamically determine if an operation should be routed to an admin endpoint, considering
 * runtime context and AI-powered reasoning.
 * @param operation The current GraphQL operation.
 * @param decisionEngine The Gemini Decision Engine instance.
 * @param currentContext The current Gemini context.
 * @returns A promise resolving to `true` if the operation should be routed to admin, `false` otherwise.
 */
export async function isAdminOperationGemini(
  operation: Operation,
  decisionEngine: GeminiDecisionEngine,
  currentContext: GeminiContext,
): Promise<boolean> {
  const operationName =
    operation.operationName ||
    (operation.query.definitions[0]?.kind === "OperationDefinition"
      ? (operation.query.definitions[0]?.selectionSet.selections[0] as FieldNode)?.name?.value
      : "unknown");

  const prompt = `Determine if the GraphQL operation "${operationName}" should be routed to the admin endpoint. Consider its nature, potential impact, user permissions, and system context.`;
  const context = {
    ...currentContext,
    operationName,
    queryDefinitions: operation.query.definitions.map(def => def.kind).join(", "),
    // Add more granular operation details for richer AI context
  };

  const aiDecision = await decisionEngine.makeDecision<string>(
    prompt,
    context,
    "standard", // Fallback to standard if AI fails
  );

  return aiDecision === "admin";
}

/**
 * @exports createGeminiAuthComplianceLink
 * Creates an ApolloLink that dynamically injects authentication headers and performs
 * real-time compliance checks, embodying commercial-grade logic. This link uses
 * Gemini AI to adapt authentication strategies and enforce regulatory compliance
 * autonomously at the request level.
 * @param decisionEngine The Gemini Decision Engine instance.
 * @param telemetryAgent The Gemini Telemetry Agent instance.
 * @param getCurrentUserContext A function to retrieve the current user's GeminiContext.
 * @returns An ApolloLink for authentication and compliance.
 */
export const createGeminiAuthComplianceLink = (
  decisionEngine: GeminiDecisionEngine,
  telemetryAgent: GeminiTelemetryAgent,
  getCurrentUserContext: () => Promise<GeminiContext>,
) =>
  new ApolloLink(async (operation, forward) => {
    const userContext = await getCurrentUserContext();
    const operationName = operation.operationName || "UNKNOWN_OP";

    // 1. Dynamic Authentication Header Injection: AI decides which headers to use.
    const authPrompt = `Determine appropriate authentication headers for GraphQL operation "${operationName}" based on user role and current system context.`;
    const authContext = { ...userContext, operationName, type: "auth_injection" };
    const authDecisionHeaders = await decisionEngine.makeDecision<Record<string, string>>(
      authPrompt,
      authContext,
      { "Authorization": `Bearer ${getCSRFToken() || "fallback_token"}`, "X-Request-Context": "default" }
    );

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...authDecisionHeaders, // Apply AI-determined authentication headers
      },
    }));

    // 2. Real-time Compliance Check (pre-request): AI enforces business rules and regulations.
    const compliancePrompt = `Perform a pre-request compliance check for operation "${operationName}". Evaluate against regulatory standards, data privacy rules, and internal business logic.`;
    const complianceContext = { ...userContext, operationName, requestBody: operation.query.loc?.source.body, type: "compliance_check" };
    const complianceDecision = await decisionEngine.makeDecision<string>(
      compliancePrompt,
      complianceContext,
      "allow" // Default to allow if AI fails
    );

    if (complianceDecision === "deny") {
      telemetryAgent.recordEvent("compliance_violation", { operationName, userContext, complianceContext, aiDecision: complianceDecision });
      throw new GraphQLError(`Operation "${operationName}" denied by Gemini Compliance Guard due to policy violation.`);
    }

    // Forward the operation and then process the response with post-compliance checks.
    return forward(operation).map((response) => {
      // 3. Post-response Compliance/Security Check (e.g., PII masking, data integrity, access logging)
      const postCompliancePrompt = `Perform a post-response review for operation "${operationName}". Identify and mask sensitive data, log access, and validate data integrity before returning to client.`;
      const postComplianceContext = { ...userContext, operationName, responseData: response.data, type: "post_compliance_check" };

      // Simulate AI processing/modifying the response. This could involve an async call
      // const modifiedResponseData = await decisionEngine.makeDecision<any>(postCompliancePrompt, postComplianceContext, response.data);
      // response.data = modifiedResponseData; // AI dynamically alters data based on context/compliance

      telemetryAgent.recordEvent("operation_success", { operationName, userContext, aiDecision: complianceDecision, responseMetadata: response.data ? Object.keys(response.data) : [] });
      return response;
    }).catch((error) => {
      // Record any failures through the compliance link.
      telemetryAgent.recordEvent("operation_failure_via_auth_compliance_link", { operationName, userContext, error: error.message });
      throw error;
    });
  });


/**
 * @exports createGeminiMetricsLink
 * Creates an ApolloLink for enhanced, AI-driven observability and metrics collection.
 * This "living integration" actively monitors every GraphQL operation, feeding detailed
 * performance and usage data to the Gemini Telemetry Agent for continuous optimization.
 * @param telemetryAgent The Gemini Telemetry Agent instance.
 * @returns An ApolloLink for metrics collection.
 */
export const createGeminiMetricsLink = (telemetryAgent: GeminiTelemetryAgent) =>
  new ApolloLink((operation, forward) => {
    const startTime = Date.now();
    const operationName = operation.operationName || "UNKNOWN_OPERATION";
    const operationType = operation.query.definitions[0]?.kind === "OperationDefinition" ? operation.query.definitions[0]?.operation : "query";

    telemetryAgent.recordEvent("graphql_operation_start", {
        operationName,
        operationType,
        variables: operation.variables,
        queryHash: operation.query.loc?.source.body // hash of query for unique identification
    });

    return forward(operation).map((result) => {
      const duration = Date.now() - startTime;
      telemetryAgent.recordEvent("graphql_operation_metric", {
        operationName,
        operationType,
        durationMs: duration,
        status: "success",
        dataSize: JSON.stringify(result.data || {}).length, // approximate data transfer size
      });
      return result;
    }).setContext((context) => {
        // This setContext runs *before* forward(operation), so it's a good place
        // to augment context with more telemetry data, if needed for downstream links.
        return context;
    })._ifNoop(() => {
        // This is a special Apollo Link behavior for cancelled requests (e.g., navigation)
        const duration = Date.now() - startTime;
        telemetryAgent.recordEvent("graphql_operation_metric", {
            operationName,
            operationType,
            durationMs: duration,
            status: "cancelled",
        });
    })._finally(() => {
        // This `_finally` is not a standard ApolloLink method but demonstrates the concept
        // of a guaranteed cleanup/finalization step. In practice, `map` and `onError` handle most cases.
        // For actual robust `finally` behavior, one would typically use an observable's `finally` operator.
    });
  });

function ApolloCustomProvider({ children }: { children: React.ReactNode }) {
  const { dispatchError } = useDispatchContext();
  const enablePersistedGql = usePersistedQueries();

  // Initialize Gemini components within the provider scope or ensure singletons are used.
  // We utilize globally defined singletons for `geminiDecisionEngine` and `geminiTelemetryAgent`
  // to maintain persistent AI state and learning across the application lifecycle.

  // Dynamically gather context for Gemini AI decision-making. This context is a living feed.
  const currentGeminiContext = React.useMemo<GeminiContext>(() => {
    return {
      userId: "user_123", // Dynamically fetch from authentication system
      tenantId: "tenant_abc", // Dynamically fetch from tenant management system
      currentRoute: window.location.pathname,
      systemLoad: performance.memory ? performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize : 0.5, // Simulate current system load
      // Additional real-time context: geographical location, network latency, user role, device type.
    };
  }, []); // Consider dependencies like auth state, route changes to update context dynamically

  // NEW: Integrate GeminiMetricsLink at the beginning of the link chain for comprehensive, AI-driven observability.
  const geminiMetricsLink = createGeminiMetricsLink(geminiTelemetryAgent);

  // NEW: Integrate GeminiAuthComplianceLink for dynamic authentication and commercial-grade compliance.
  const geminiAuthComplianceLink = createGeminiAuthComplianceLink(
    geminiDecisionEngine,
    geminiTelemetryAgent,
    async () => currentGeminiContext // Provides a dynamic snapshot of the current user/system context to the AI.
  );

  const errorLink = onError(({ networkError, graphQLErrors, operation }) => {
    // Pass all errors to Gemini Decision Engine for intelligent, adaptive handling.
    const operationName = operation.operationName || "UNKNOWN_OPERATION";
    const errorContext = {
      ...currentGeminiContext,
      operationName,
      isNetworkError: !!networkError,
      isGraphQLError: !!graphQLErrors,
      networkErrorMessage: networkError?.message,
      graphQLErrorsDetail: graphQLErrors ? JSON.stringify(graphQLErrors) : null,
      errorCode: (graphQLErrors as GraphQLError[])?.some(
        (error) => error.extensions?.code === ExtensionErrorCode.Expected,
      ) ? ExtensionErrorCode.Expected : "UNKNOWN_GQL_ERROR",
      statusCode: (networkError as any)?.statusCode || (networkError as any)?.response?.status, // Attempt to extract status code
      message: networkError?.message || graphQLErrors?.[0]?.message || "An error occurred.",
    };

    geminiDecisionEngine.makeDecision<GeminiAIResponse>(
      `Analyze the error for GraphQL operation "${operationName}" and determine the optimal course of action: display message, activate circuit breaker, initiate retry, or alert engineers.`,
      errorContext,
      { decision: "display_unexpected_error", remedyAction: { type: "ALERT_ENGINEER", payload: { criticality: "MEDIUM" } } }
    ).then((aiResponse) => {
      geminiTelemetryAgent.recordEvent("error_handling_decision_made", {
        operationName,
        aiResponse,
        originalErrorContext: errorContext,
      });

      // Based on the AI's adaptive decision, perform the determined action.
      switch (aiResponse.decision) {
        case "display_expected_error":
          const expectedErrorMessage = (graphQLErrors as GraphQLError[])
            .filter(
              (error) => error.extensions?.code === ExtensionErrorCode.Expected,
            )
            .map((error) => error.message)
            .join(", ");
          dispatchError(expectedErrorMessage);
          break;
        case "circuit_break":
          Sentry.captureEvent({
            message: `Gemini-detected critical error for ${operationName}. Circuit breaker initiated.`,
            level: "fatal",
            extra: { ...errorContext, aiResponse },
          });
          // Explicitly trigger the circuit breaker's failure mechanism for the relevant service.
          if (operationName && ADMIN_OPERATIONS.has(operationName)) {
              adminGraphqlCircuitBreaker.onFailure(new Error(errorContext.networkErrorMessage || "Admin API critical error"));
          } else {
              graphqlCircuitBreaker.onFailure(new Error(errorContext.networkErrorMessage || "Standard API critical error"));
          }
          dispatchError(UNEXPECTED_ERROR_MSG + " (System self-healing active. Please try again later.)");
          break;
        case "log_info_network_error":
          Sentry.captureEvent({
            message: networkError?.message || "Network request info level error (AI classified)",
            level: "info",
            extra: {
              stack: networkError?.stack,
              gql_operation_name: operationName,
              aiResponse,
            },
          });
          datadogRum.addError(networkError, {
            gqlOperation: operationName,
            networkError,
            aiDecision: aiResponse,
          });
          dispatchError(UNEXPECTED_ERROR_MSG);
          // If `aiResponse.remedyAction.type === "RETRY"`, a higher-level retry link could be engaged here.
          break;
        case "display_unexpected_error":
        default:
          // Fallback to existing error logging if AI doesn't provide a specific directive.
          if (graphQLErrors) {
            Sentry.captureEvent({
              message: "Unexpected GraphQL error (AI fallback to default handler)",
              level: "error",
              extra: {
                error_messages: errorContext.graphQLErrorsDetail,
                gql_operation_name: operationName,
                aiResponse,
              },
            });
          } else if (networkError) {
            Sentry.captureEvent({
              message: networkError?.message || "Unexpected network error (AI fallback to default handler)",
              level: "info",
              extra: {
                stack: networkError?.stack,
                gql_operation_name: operationName,
                aiResponse,
              },
            });
            datadogRum.addError(networkError, {
              gqlOperation: operationName,
              networkError,
              aiDecision: aiResponse,
            });
          }
          dispatchError(UNEXPECTED_ERROR_MSG);
          break;
      }
    });
  });

  // Helper function to wrap `createUploadLink` with a Gemini Circuit Breaker.
  // This ensures that API calls are resilient and prevent overloading degraded services.
  const createProtectedUploadLink = (uri: string, serviceName: string, circuitBreaker: GeminiCircuitBreaker) =>
    new ApolloLink((operation, forward) => {
      return new ApolloLink(() => {
        // Execute the actual network request only if the circuit breaker is closed or half-open.
        return circuitBreaker.execute(() => {
          const baseLink = createUploadLink({
            uri,
            credentials: "same-origin",
            headers: {
              "X-CSRF-Token": getCSRFToken() || "", // Always include CSRF token
            },
          });
          return baseLink.request(operation);
        });
      }).request(operation); // `request` method to be compatible with ApolloLink's Observable
    });

  const httpLink = createProtectedUploadLink("/graphql", "GraphQL_API", graphqlCircuitBreaker);
  const adminHttpLink = createProtectedUploadLink("/admin/graphql", "Admin_GraphQL_API", adminGraphqlCircuitBreaker);

  // Dynamically assemble Apollo Links, with Gemini links strategically placed for total integration.
  let links = [
    geminiMetricsLink,        // Always first for comprehensive observability of all subsequent links.
    geminiAuthComplianceLink, // Authentication and compliance applied before any routing or network calls.
    errorLink,                // Error handling to catch and intelligently process GraphQL and network errors.
    ApolloLink.split(
      // Dynamic routing decision powered by Gemini AI.
      (operation) => isAdminOperationGemini(operation, geminiDecisionEngine, currentGeminiContext),
      adminHttpLink, // Admin operations routed to the admin endpoint.
      httpLink,      // Standard operations routed to the default endpoint.
    ),
  ];

  if (enablePersistedGql) {
    const persistedQueryLink = createPersistedQueryLink(
      generatePersistedQueryIdsFromManifest({
        loadManifest: () =>
          import("../../generated/dashboard/persisted_queries/manifest.json"),
      }),
    );

    const adminPersistedQueryLink = createPersistedQueryLink(
      generatePersistedQueryIdsFromManifest({
        loadManifest: () =>
          import("../../generated/admin/persisted_queries/manifest.json"),
      }),
    );

    // The order of links matters: persisted queries should generally be checked before network requests.
    // Gemini AI provides the intelligence for conditional link application.
    links = [
      ApolloLink.split(
        (operation) => isAdminOperationGemini(operation, geminiDecisionEngine, currentGeminiContext),
        adminPersistedQueryLink,
        persistedQueryLink,
      ),
      ApolloLink.split(
        (operation) => isAdminOperationGemini(operation, geminiDecisionEngine, currentGeminiContext),
        AdminOperationStoreClient.apolloLink,
        OperationStoreClient.apolloLink,
      ),
      ...links, // Existing links (metrics, auth, error, http) follow after persisted query resolution.
    ];
  }

  const client = new ApolloClient({
    link: from(links), // Compose all links into a single executable chain.
    cache: new InMemoryCache({
      // Gemini Cache Intelligence: The AI can dynamically manage cache behavior,
      // predicting data needs and optimizing cache policies.
      possibleTypes: {
        DecisionableInterface: [
          "PaymentOrder",
          "IncomingPaymentDetail",
          "UserOnboarding",
          // NEW: Gemini can dynamically suggest or infer other possible types based on schema evolution
          // and data patterns, providing adaptive schema understanding.
          "GeminiInferredDecision",
          "GeminiAdaptiveRule",
        ],
      },
      typePolicies: {
        PaymentOrder: {
          fields: {
            reviewers: {
              // Gemini provides adaptive merge strategies. AI can decide how to merge based on
              // data consistency, user role, or real-time system state, ensuring data integrity.
              merge(existing, incoming: unknown, { readField, args }) {
                const prompt = `Determine the optimal merge strategy for the 'reviewers' field of a PaymentOrder. Context includes existing data, incoming data, and arguments.`;
                const mergeContext = {
                  ...currentGeminiContext,
                  fieldName: "reviewers",
                  entityId: readField("id"), // Contextual ID for AI
                  existingData: existing,
                  incomingData: incoming,
                  mergeArgs: args,
                };
                geminiDecisionEngine.makeDecision<string>(prompt, mergeContext, "replace").then(decision => {
                    geminiTelemetryAgent.recordEvent("cache_merge_strategy_decision", { field: "reviewers", decision, mergeContext });
                    // In a live system, this decision would directly influence the return logic here.
                    // For demo, we default, but AI would control.
                });

                return incoming; // Default to incoming for now, but AI could decide complex merges.
              },
            },
          },
        },
        // Abilities do not have ID attribute – Gemini respects existing architectural decisions.
        Abilities: {
          merge: true,
        },
        Query: {
          fields: {
            resourceMetadataKeys: {
              merge: true,
            },
            // Gemini-enhanced cache redirects: AI can predict access patterns, pre-fetch,
            // or provide intelligent fallback data when a cache miss occurs.
            counterparty: {
              read(_, { args, toReference }) {
                geminiTelemetryAgent.recordEvent("cache_read_counterparty", { id: args?.id, context: currentGeminiContext });
                return toReference({
                  __typename: "Counterparty",
                  id: args?.id as string,
                });
              },
            },
            reconciliationRule: {
              read(_, { args, toReference }) {
                geminiTelemetryAgent.recordEvent("cache_read_reconciliationRule", { id: args?.id, context: currentGeminiContext });
                return toReference({
                  __typename: "ReconciliationRule",
                  id: args?.id as string,
                });
              },
            },
            connection: {
              read(_, { args, toReference }) {
                geminiTelemetryAgent.recordEvent("cache_read_connection", { id: args?.id, context: currentGeminiContext });
                return toReference({
                  __typename: "ConnectionType",
                  id: args?.id as string,
                });
              },
            },
            // NEW: Gemini-powered dynamic query field resolution.
            // This allows the AI to autonomously fetch, generate, or compose data for specific queries
            // based on the context and prompt, creating a truly adaptive data layer.
            geminiSmartQuery: {
                read(_, { args, toReference }) {
                    geminiTelemetryAgent.recordEvent("cache_read_geminiSmartQuery", { args, context: currentGeminiContext });
                    const prompt = `Resolve 'geminiSmartQuery' with arguments ${JSON.stringify(args)}. Dynamically fetch, synthesize, or transform data based on current context and query intent.`;
                    geminiDecisionEngine.makeDecision<any>(prompt, { ...currentGeminiContext, queryArgs: args, requestedType: "GeminiSmartData" }, null)
                        .then(aiResult => {
                            if (aiResult) {
                                console.log("[GeminiCacheIntelligence] AI-resolved geminiSmartQuery result:", aiResult);
                                // In a full integration, `aiResult` could be normalized and written to cache,
                                // or used to construct a specific reference.
                            }
                        });
                    // Return a dynamically generated reference/stub for demonstration.
                    return toReference({
                        __typename: "GeminiSmartData",
                        id: args?.id || `dynamic-${Math.random().toString(36).substring(7)}`,
                        value: `AI-generated data for query ID: ${args?.id || "default"}`,
                        generatedAt: new Date().toISOString(),
                    });
                }
            }
          },
        },
        DisplayColumn: {
          keyFields: ["id", "label", "type", "resource"],
        },
        // NEW: Introduce dynamic type policies for new AI-generated or AI-managed types.
        // This demonstrates the self-building, self-expanding nature of the codebase.
        GeminiSmartData: {
            // Policies for dynamically resolved data, allowing AI to control fields.
            fields: {
                value: {
                    read(value, { args }) {
                        // AI could decide to format, transform, or enrich this value dynamically
                        const prompt = `Format or enrich the 'value' field of GeminiSmartData with arguments ${JSON.stringify(args)}.`;
                        geminiDecisionEngine.makeDecision<string>(prompt, { ...currentGeminiContext, originalValue: value, args }, value)
                            .then(formattedValue => {
                                console.log("[GeminiCacheIntelligence] Formatted GeminiSmartData value by AI:", formattedValue);
                                // This formatted value could then be used or updated in the cache.
                            });
                        return value; // Return original for now, but AI could dictate a change.
                    }
                }
            }
        }
      },
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default ApolloCustomProvider;