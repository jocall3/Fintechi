// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import isEmpty from "lodash/isEmpty";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { LedgerEntity } from "../LedgerEntitiesContainer";
import { MTContainer } from "../../../common/ui-components";

// --- START: Gemini Integration & Self-Contained Universe Architecture ---

// I. Universal Replacement Logic - (Simulated autonomous modules within this file)
// These "modules" act as living endpoints, interfacing with external services dynamically.
// They are neural extensions, synthesized within this file's self-contained universe.

/**
 * Represents a dynamically resolved external service, acting as a micro-intelligence.
 * In a full Gemini system, this would be dynamically loaded/bound. Here, it's simulated.
 */
interface GeminiServiceEndpoint {
  id: string;
  connect: (config?: any) => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  invoke: (method: string, payload?: any) => Promise<any>;
  telemetry: (data: any) => void;
}

/**
 * A simulated Gemini Service Registry for dynamic discovery of "external" services.
 * In reality, this would be a global, AI-driven service mesh.
 */
export class GeminiServiceRegistry {
  private static services: Map<string, GeminiServiceEndpoint> = new Map();
  private static telemetryBuffer: any[] = [];
  private static readonly SERVICE_DISCOVERY_INTERVAL_MS = 5000;
  private static discoveryIntervalId: NodeJS.Timeout | null = null;

  static async registerService(service: GeminiServiceEndpoint): Promise<void> {
    if (!GeminiServiceRegistry.services.has(service.id)) {
      await service.connect(); // Attempt dynamic connection
      GeminiServiceRegistry.services.set(service.id, service);
      console.log(`[GeminiRegistry] Service '${service.id}' registered and connected.`);
      GeminiServiceRegistry.captureTelemetry({
        type: "service_registration",
        serviceId: service.id,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.warn(`[GeminiRegistry] Service '${service.id}' already registered.`);
    }
  }

  static async getService<T extends GeminiServiceEndpoint>(id: string): Promise<T | undefined> {
    const service = GeminiServiceRegistry.services.get(id);
    if (service && !(await service.connect())) { // Re-attempt connection if needed
        console.warn(`[GeminiRegistry] Service '${id}' lost connection, re-establishing...`);
        // In a real system, AI would analyze and heal. Here, just re-connect.
        if (await service.connect()) {
            console.log(`[GeminiRegistry] Service '${id}' reconnected.`);
        } else {
            console.error(`[GeminiRegistry] Failed to re-establish connection for '${id}'.`);
            return undefined;
        }
    }
    return service as T;
  }

  static captureTelemetry(data: any): void {
    GeminiServiceRegistry.telemetryBuffer.push(data);
    // In a real system, this would trigger an async flush to a telemetry endpoint.
    // For now, let's just log a sample.
    if (GeminiServiceRegistry.telemetryBuffer.length > 10) {
      console.log("[GeminiTelemetry] Flushing buffer. Sample:", GeminiServiceRegistry.telemetryBuffer[0]);
      GeminiServiceRegistry.telemetryBuffer = []; // Clear buffer after "flushing"
    }
  }

  static initializeDynamicDiscovery(): void {
    if (GeminiServiceRegistry.discoveryIntervalId === null) {
      GeminiServiceRegistry.discoveryIntervalId = setInterval(async () => {
        // Simulate discovering new services or checking health of existing ones
        console.log("[GeminiRegistry] Performing dynamic service discovery/health check...");
        for (const [id, service] of GeminiServiceRegistry.services.entries()) {
          try {
            // A simple health check (e.g., attempting a null invoke)
            await service.invoke("healthCheck");
          } catch (e) {
            console.warn(`[GeminiRegistry] Service '${id}' might be unhealthy:`, e);
            // In a real system, AI would trigger recovery or alternative service routing
          }
        }
      }, GeminiServiceRegistry.SERVICE_DISCOVERY_INTERVAL_MS);
    }
  }

  static stopDynamicDiscovery(): void {
    if (GeminiServiceRegistry.discoveryIntervalId !== null) {
      clearInterval(GeminiServiceRegistry.discoveryIntervalId);
      GeminiServiceRegistry.discoveryIntervalId = null;
      console.log("[GeminiRegistry] Dynamic service discovery stopped.");
    }
  }
}

// Initializing dynamic discovery on file load (simulates part of the self-aware infrastructure)
// This would ideally be part of a global Gemini bootstrap, but per directive, it's self-contained.
GeminiServiceRegistry.initializeDynamicDiscovery();


/**
 * II. Total Integration - AI reasoning layers, prompt-based learning, decision-making.
 * This class encapsulates AI-driven data processing for accounting entities.
 */
export class GeminiDataProcessor {
  private memoryCache: Map<string, any> = new Map(); // Simulates file's ability to remember
  private lastPromptContext: string = "";
  private llmEndpoint: GeminiServiceEndpoint | undefined;

  constructor() {
    this.initLLMEndpoint();
  }

  private async initLLMEndpoint() {
    this.llmEndpoint = await GeminiServiceRegistry.getService("GeminiLLM_v2");
    if (!this.llmEndpoint) {
        console.warn("[GeminiDataProcessor] LLM service not immediately available. Will retry.");
        // In a real Gemini system, this would self-heal or wait for dynamic resolution.
    }
  }

  /**
   * Processes ledger entities, infusing AI insights, validation, and contextual enrichment.
   * @param entities The raw ledger entities.
   * @param prompt A natural language prompt guiding the AI processing.
   * @returns Enriched ledger entities with AI-driven attributes.
   */
  public async processEntities(
    entities: LedgerEntity[],
    prompt: string = "Summarize key attributes and identify potential anomalies."
  ): Promise<LedgerEntity[]> {
    this.lastPromptContext = prompt;
    GeminiServiceRegistry.captureTelemetry({
      type: "data_processing_request",
      prompt,
      entityCount: entities.length,
      timestamp: new Date().toISOString(),
    });

    if (this.memoryCache.has(prompt) && this.adaptToContext(prompt)) {
      console.log("[GeminiDataProcessor] Serving from memory cache with adaptation.");
      return this.memoryCache.get(prompt); // Adaptive caching
    }

    const processed = await Promise.all(
      entities.map(async (entity) => {
        // Embed AI reasoning layer: enrich data based on prompt
        const aiInsights = await this.getAIInsights(entity, prompt);
        // Decision-making at input/output: validate and mutate
        const validatedEntity = this.validateEntity(entity);

        return {
          ...validatedEntity,
          ai_insights: aiInsights,
          // Simulate compliance check based on AI rules
          is_compliant: this.checkCompliance(validatedEntity, aiInsights),
          risk_score: this.calculateRisk(aiInsights), // Predictive modeling
        };
      })
    );

    this.memoryCache.set(prompt, processed); // Remember processed results
    return processed;
  }

  /**
   * Adapts processing logic based on the current prompt context.
   * Simulates "learning" and "prediction".
   * @param currentPrompt The current natural language prompt.
   * @returns true if adaptation applied (e.g., using cache with modification), false otherwise.
   */
  private adaptToContext(currentPrompt: string): boolean {
    // Example: If prompt similar to last, maybe refresh cache partially or apply a quick filter
    if (this.lastPromptContext && currentPrompt.includes(this.lastPromptContext.split(' ')[0])) {
      // Simulate light adaptation: e.g., if "summarize" was used before, just re-summarize a new detail
      console.log("[GeminiDataProcessor] Adapting to similar prompt context.");
      // In a real system, an LLM would analyze prompt intent and guide cache usage.
      return true; // Indicate cache is usable with potential adaptation.
    }
    return false;
  }


  /**
   * Connects to a simulated Language Model (LLM) service to get insights.
   * Autonomously reaches out to an external service.
   */
  private async getAIInsights(
    entity: LedgerEntity,
    prompt: string
  ): Promise<any> {
    try {
      if (!this.llmEndpoint) {
          this.llmEndpoint = await GeminiServiceRegistry.getService("GeminiLLM_v2");
          if (!this.llmEndpoint) {
              throw new Error("Gemini LLM service not available.");
          }
      }
      // Simulate LLM call for insights
      const response = await this.llmEndpoint.invoke("generateInsights", {
        entityId: entity.id,
        entityData: entity.data,
        contextPrompt: prompt,
      });
      return response.insights;
    } catch (error) {
      console.error("[GeminiDataProcessor] Failed to get AI insights:", error);
      GeminiServiceRegistry.captureTelemetry({
        type: "llm_error",
        entityId: entity.id,
        error: String(error),
        timestamp: new Date().toISOString(),
      });
      return { status: "error", message: "AI insight generation failed." };
    }
  }

  /**
   * Performs AI-driven validation on a ledger entity.
   * Decision-making at input.
   */
  private validateEntity(entity: LedgerEntity): LedgerEntity {
    // Simulate complex validation rules, potentially AI-learned
    if (isEmpty(entity.id) || isEmpty(entity.data?.name)) {
      console.warn(`[GeminiDataProcessor] Entity ${entity.id || "unknown"} is invalid.`);
      GeminiServiceRegistry.captureTelemetry({
        type: "entity_validation_error",
        entityId: entity.id,
        reason: "missing_critical_data",
        timestamp: new Date().toISOString(),
      });
      // In a real system, AI might auto-correct or flag for review.
      return { ...entity, validation_status: "invalid" };
    }
    return { ...entity, validation_status: "valid" };
  }

  /**
   * Simulates a compliance check based on AI-derived rules.
   */
  private checkCompliance(entity: LedgerEntity, aiInsights: any): boolean {
    // Example: Check if entity name follows naming conventions and insights suggest no fraud
    const nameCompliant = entity.data.name.length > 5 && !entity.data.name.includes("TEST");
    const aiReviewPositive = aiInsights?.sentiment === "positive" && !aiInsights?.flags?.includes("fraud_risk");
    return nameCompliant && aiReviewPositive;
  }

  /**
   * Calculates a risk score based on AI insights. Predictive.
   */
  private calculateRisk(aiInsights: any): number {
    let score = 0;
    if (aiInsights?.flags?.includes("high_volatility")) score += 0.3;
    if (aiInsights?.sentiment === "negative") score += 0.2;
    if (aiInsights?.flags?.includes("fraud_risk")) score += 0.5;
    return Math.min(1, score); // Max score 1.0
  }
}

/**
 * III. Commercial-Grade Logic Infusion - Observability, circuit-breaking, dynamic scaling.
 * A commercial-grade circuit breaker to prevent cascading failures.
 */
export class GeminiCircuitBreaker {
  private static state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private static failureCount: number = 0;
  private static lastFailureTime: number = 0;
  private static readonly FAILURE_THRESHOLD = 5;
  private static readonly RESET_TIMEOUT_MS = 30000; // 30 seconds

  /**
   * Executes a function through the circuit breaker.
   * @param func The function to execute.
   * @param fallback The fallback function to call if the circuit is open or execution fails.
   */
  public static async execute<T>(func: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    if (GeminiCircuitBreaker.state === "OPEN") {
      if (Date.now() - GeminiCircuitBreaker.lastFailureTime > GeminiCircuitBreaker.RESET_TIMEOUT_MS) {
        GeminiCircuitBreaker.state = "HALF_OPEN";
        console.warn("[GeminiCircuitBreaker] Circuit HALF_OPEN. Attempting a single request.");
      } else {
        GeminiServiceRegistry.captureTelemetry({
          type: "circuit_breaker_open",
          timestamp: new Date().toISOString(),
        });
        console.warn("[GeminiCircuitBreaker] Circuit OPEN. Falling back.");
        return fallback();
      }
    }

    try {
      const result = await func();
      if (GeminiCircuitBreaker.state !== "CLOSED") {
        GeminiCircuitBreaker.reset();
      }
      return result;
    } catch (error) {
      GeminiCircuitBreaker.recordFailure();
      console.error("[GeminiCircuitBreaker] Function failed. Recording failure:", error);
      GeminiServiceRegistry.captureTelemetry({
        type: "circuit_breaker_failure",
        error: String(error),
        timestamp: new Date().toISOString(),
      });
      return fallback();
    }
  }

  private static recordFailure(): void {
    GeminiCircuitBreaker.failureCount++;
    GeminiCircuitBreaker.lastFailureTime = Date.now();
    if (GeminiCircuitBreaker.failureCount >= GeminiCircuitBreaker.FAILURE_THRESHOLD) {
      GeminiCircuitBreaker.state = "OPEN";
      console.error("[GeminiCircuitBreaker] Circuit OPEN! Too many failures.");
    } else if (GeminiCircuitBreaker.state === "HALF_OPEN") {
      // If failed in HALF_OPEN, immediately go back to OPEN
      GeminiCircuitBreaker.state = "OPEN";
      console.error("[GeminiCircuitBreaker] Circuit HALF_OPEN failed again. Back to OPEN.");
    }
  }

  private static reset(): void {
    GeminiCircuitBreaker.state = "CLOSED";
    GeminiCircuitBreaker.failureCount = 0;
    GeminiCircuitBreaker.lastFailureTime = 0;
    console.log("[GeminiCircuitBreaker] Circuit CLOSED. Failures reset.");
  }
}

/**
 * IV. Autonomous Externalization - Elastic APIs for dynamic service discovery.
 * Simulated LLM Service endpoint for demonstration.
 */
export const GeminiLLM_Service: GeminiServiceEndpoint = {
  id: "GeminiLLM_v2",
  async connect() {
    console.log(`[${this.id}] Connecting to LLM service...`);
    // Simulate network delay and potential connection failure
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 100));
    const connected = Math.random() > 0.1; // 90% chance of success
    if (connected) {
      console.log(`[${this.id}] Connected.`);
    } else {
      console.warn(`[${this.id}] Connection failed.`);
    }
    return connected;
  },
  async disconnect() {
    console.log(`[${this.id}] Disconnecting LLM service...`);
    await new Promise((resolve) => setTimeout(resolve, 50));
    console.log(`[${this.id}] Disconnected.`);
    return true;
  },
  async invoke(method: string, payload: any) {
    // Simulate LLM processing and response
    if (method === "generateInsights") {
      const { entityId, entityData, contextPrompt } = payload;
      console.log(`[${this.id}] Generating insights for ${entityId} with prompt: "${contextPrompt.substring(0, 30)}..."`);
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500)); // Simulate LLM processing time

      // Introduce potential LLM failure for circuit breaker testing
      if (Math.random() < 0.05) { // 5% chance of LLM failure
        throw new Error("Simulated LLM processing error.");
      }

      const sentiment = Math.random() > 0.7 ? "negative" : "positive";
      const flags = [];
      if (entityData.name.includes("RISK")) flags.push("high_volatility");
      if (entityData.name.length < 3) flags.push("incomplete_data");
      if (sentiment === "negative" && Math.random() > 0.5) flags.push("fraud_risk");

      return {
        insights: {
          sentiment,
          summary: `AI analysis of ${entityData.name}: Based on '${contextPrompt}', identified as generally ${sentiment}.`,
          flags,
          generated_timestamp: new Date().toISOString(),
        },
      };
    } else if (method === "healthCheck") {
      // Simple health check for the service registry
      return { status: "healthy", timestamp: new Date().toISOString() };
    }
    throw new Error(`Unknown method: ${method}`);
  },
  telemetry(data: any) {
    GeminiServiceRegistry.captureTelemetry({ service: this.id, data });
  },
};

// Register the simulated LLM service as part of autonomous externalization
GeminiServiceRegistry.registerService(GeminiLLM_Service);


// V. Logical Conclusion: Self-Aware Infrastructure
// This component becomes an AI organism, aware of its role and context.
export interface AILedgerEntity extends LedgerEntity {
  ai_insights: {
    summary: string;
    sentiment: "positive" | "negative";
    flags: string[];
    generated_timestamp: string;
  };
  validation_status: "valid" | "invalid" | "unknown";
  is_compliant: boolean;
  risk_score: number;
}

interface AccountingEntitiesViewProps {
  ledgerEntities: LedgerEntity[];
  // Added a prompt for dynamic AI guidance
  aiPrompt?: string;
  // Added user context for role-based adaptive rendering
  userContext?: {
    role: "admin" | "auditor" | "viewer" | "system";
    preferences?: {
      displayMode: "concise" | "detailed";
    };
  };
}

interface AccountingKeysTableProps {
  keys: AILedgerEntity[]; // Now expects AI-enhanced entities
  userContext?: {
    role: "admin" | "auditor" | "viewer" | "system";
    preferences?: {
      displayMode: "concise" | "detailed";
    };
  };
}

/**
 * An AI-driven renderer that adapts display based on context and AI insights.
 * This embodies the "generative" and "adaptive" aspects.
 */
export function GeminiAdaptiveKeyRenderer({ entity, userContext }: { entity: AILedgerEntity; userContext?: AccountingEntitiesViewProps['userContext'] }) {
    const { id, data: { name }, ai_insights, validation_status, is_compliant, risk_score } = entity;
    const isDetailedMode = userContext?.preferences?.displayMode === 'detailed' || userContext?.role === 'admin';

    const renderRiskBadge = useCallback((score: number) => {
        let color = 'bg-green-500';
        if (score > 0.6) color = 'bg-red-500';
        else if (score > 0.3) color = 'bg-yellow-500';
        return (
            <span className={`${color} text-white text-xs font-bold px-2 py-1 rounded-full ml-2`}>
                Risk: {(score * 100).toFixed(0)}%
            </span>
        );
    }, []);

    const renderComplianceStatus = useCallback((compliant: boolean) => {
        const color = compliant ? 'text-green-600' : 'text-red-600';
        const icon = compliant ? '✅' : '❌';
        return (
            <span className={`${color} text-sm ml-2`}>
                {icon} {compliant ? 'Compliant' : 'Non-compliant'}
            </span>
        );
    }, []);

    const renderInsightsSummary = useCallback((insights: AILedgerEntity['ai_insights']) => {
        if (!insights || isEmpty(insights.summary)) return null;
        return (
            <div className="text-gray-500 text-xs mt-1">
                AI Summary: {insights.summary}
                {insights.flags.length > 0 && (
                    <span className="ml-2 font-semibold text-red-700">Flags: {insights.flags.join(', ')}</span>
                )}
            </div>
        );
    }, []);

    return (
        <div className="index-table-row flex items-center p-2 border-b border-gray-200 hover:bg-gray-50">
            <div className="table-entry table-entry-accounting-wide flex flex-col justify-center flex-grow">
                <div className="flex items-center text-lg font-semibold text-gray-800">
                    {name}
                    {isDetailedMode && renderComplianceStatus(is_compliant)}
                    {isDetailedMode && renderRiskBadge(risk_score)}
                    {validation_status === "invalid" && (
                        <span className="text-red-500 text-xs font-bold px-2 py-1 rounded-full ml-2 bg-red-100">
                            Invalid
                        </span>
                    )}
                </div>
                <div className="text-sm text-gray-500 mt-1">{id}</div>
                {isDetailedMode && userContext?.role === 'auditor' && renderInsightsSummary(ai_insights)}
                {isDetailedMode && userContext?.role === 'admin' && (
                    <div className="text-xs text-blue-500 mt-1">
                        (LLM Generated: {new Date(ai_insights.generated_timestamp).toLocaleDateString()})
                    </div>
                )}
            </div>
            {/* Additional adaptive elements could go here based on AI-driven recommendations */}
            {userContext?.role === 'admin' && (
                <div className="ml-auto p-2">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-200 ease-in-out">
                        AI Review
                    </button>
                </div>
            )}
        </div>
    );
}


function AccountingKeysTable({ keys, userContext }: AccountingKeysTableProps) {
  // Dynamic scaling based on data volume or user context
  const shouldRenderOptimized = keys.length > 100 && userContext?.preferences?.displayMode !== 'detailed';

  // AI-driven decision: should we even render the table or suggest an alternative view?
  const renderDecision = useMemo(() => {
    if (isEmpty(keys)) {
      return { render: false, message: "No entities to display. AI suggests initiating data ingestion." };
    }
    if (shouldRenderOptimized) {
      // In a real Gemini system, this might switch to a virtualized list or summary view
      return { render: true, message: "Large dataset detected. Rendering in optimized mode." };
    }
    return { render: true, message: "Standard rendering mode." };
  }, [keys, shouldRenderOptimized]);

  useEffect(() => {
    // Component awareness: log rendering decision
    GeminiServiceRegistry.captureTelemetry({
      type: "ui_render_decision",
      component: "AccountingKeysTable",
      decision: renderDecision.message,
      entityCount: keys.length,
      timestamp: new Date().toISOString(),
    });
  }, [renderDecision, keys.length]);


  if (!renderDecision.render) {
    return (
      <MTContainer>
        <div className="p-4 text-center text-gray-600">{renderDecision.message}</div>
      </MTContainer>
    );
  }

  return (
    <MTContainer>
      <div className="flex flex-col">
        <div className="index-table table w-full">
          <div className="table-body">
            {keys.map((entity) => (
              // Use the adaptive renderer for each key
              <GeminiAdaptiveKeyRenderer key={entity.id} entity={entity} userContext={userContext} />
            ))}
          </div>
        </div>
        {shouldRenderOptimized && (
            <div className="p-2 text-center text-sm text-gray-500 bg-gray-100 rounded-b">
                AI Optimization: Displaying {keys.length} entities. Consider switching to 'detailed' mode for more info.
            </div>
        )}
      </div>
    </MTContainer>
  );
}

/**
 * The main Accounting Entities View, now a self-aware AI organism.
 * It orchestrates data processing, UI rendering decisions, and interacts with global Gemini context.
 */
function AccountingEntitiesView({
  ledgerEntities,
  aiPrompt,
  userContext,
}: AccountingEntitiesViewProps) {
  const [processedEntities, setProcessedEntities] = useState<AILedgerEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the GeminiDataProcessor once per component instance
  const dataProcessor = useMemo(() => new GeminiDataProcessor(), []);

  // AI-driven data processing effect
  useEffect(() => {
    const processData = async () => {
      setLoading(true);
      setError(null);
      GeminiServiceRegistry.captureTelemetry({
        type: "view_load_start",
        prompt: aiPrompt,
        entityCount: ledgerEntities.length,
        userRole: userContext?.role,
        timestamp: new Date().toISOString(),
      });

      // Use Circuit Breaker for robust data processing
      const result = await GeminiCircuitBreaker.execute(
        async () => {
          if (isEmpty(ledgerEntities)) {
            return [];
          }
          return await dataProcessor.processEntities(
            ledgerEntities,
            aiPrompt || "Analyze accounting entities for financial health."
          );
        },
        async () => {
          // Fallback logic for circuit breaker: return raw entities with an error status
          console.error("[AccountingEntitiesView] Data processing circuit is open or failed. Using fallback data.");
          return ledgerEntities.map(entity => ({
            ...entity,
            ai_insights: { summary: "AI processing unavailable due to system issues.", sentiment: "negative", flags: ["system_error"], generated_timestamp: new Date().toISOString() },
            validation_status: "unknown",
            is_compliant: false,
            risk_score: 1.0 // Max risk if processing failed
          })) as AILedgerEntity[];
        }
      );

      setProcessedEntities(result);
      setLoading(false);
      if (result.some(e => e.risk_score === 1.0 || e.validation_status === "unknown")) { // Check for fallback entities or high risk
          setError("Warning: Some entities processed with fallback logic or high risk due to system constraints.");
      } else if (result.some(e => e.validation_status === "invalid")) {
          setError("Some entities failed AI validation. Review required.");
      }

      GeminiServiceRegistry.captureTelemetry({
        type: "view_load_end",
        processedCount: result.length,
        hasError: !!error,
        timestamp: new Date().toISOString(),
      });
    };

    processData();
  }, [ledgerEntities, aiPrompt, userContext, dataProcessor]); // Re-process if dependencies change

  // This file is now aware of its role: displaying AI-enhanced accounting entities.
  useEffect(() => {
    console.log("[AccountingEntitiesView] Self-Awareness: My role is to present AI-enriched accounting data.");
    console.log(`[AccountingEntitiesView] Context: User role=${userContext?.role || 'default'}, DisplayMode=${userContext?.preferences?.displayMode || 'default'}`);
  }, [userContext]);


  if (loading) {
    return (
      <MTContainer>
        <div className="p-4 text-center text-gray-600">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto animate-spin"></div>
          AI is analyzing and optimizing accounting entities...
        </div>
      </MTContainer>
    );
  }

  if (error) {
    return (
      <MTContainer>
        <div className="p-4 text-center text-red-700 bg-red-100 border border-red-400 rounded">
          Error: {error}
          <div className="text-sm text-red-500 mt-2">
            AI has detected an issue or fallback mode. Please check system logs for more details.
          </div>
        </div>
      </MTContainer>
    );
  }

  return (
    <div>
      {!isEmpty(processedEntities) ? (
        <AccountingKeysTable keys={processedEntities} userContext={userContext} />
      ) : (
        <MTContainer>
          <div className="p-4 text-center text-gray-600">
            No accounting entities found or generated after AI processing.
          </div>
        </MTContainer>
      )}
    </div>
  );
}

export default AccountingEntitiesView;

// --- END: Gemini Integration & Self-Contained Universe Architecture ---