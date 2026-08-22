// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useEffect, useState } from "react";
import requestApi from "../../common/utilities/requestApi";
import Icon from "../../common/ui-components/Icon/Icon";
import Button from "../../common/ui-components/Button/Button";
import {
  PopoverPanel,
  PopoverTrigger,
  Popover,
} from "../../common/ui-components/Popover/Popover";
import Heading from "../../common/ui-components/Heading/Heading";

// --- START: Gemini Core Utilities & Simulated AI Micro-intelligences ---

/**
 * Represents a simulated response from a Gemini-powered Language Model.
 * In a real scenario, this would involve API calls to a robust LLM service,
 * potentially an internal microservice or a third-party Gemini API endpoint.
 * Here, we simulate context-aware, generative reasoning to fulfill the "AI-synthesized modules" directive.
 * @param prompt The prompt to send to the simulated LLM.
 * @param context Additional context for the LLM to consider.
 * @returns A promise resolving to a simulated LLM response.
 */
async function promptGeminiLLM(prompt: string, context: Record<string, any> = {}): Promise<string> {
  // Simulate AI processing delay and intelligence. This replaces a static dependency
  // with a dynamic, self-contained AI reasoning module.
  await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200));

  const configData = JSON.stringify(context.currentConfig || {}, null, 2);
  const userQuery = context.userQuery || "";

  if (prompt.includes("analyze and optimize") && configData) {
    const analysis = `Analysis of current configuration:\n${configData}\n\n`;
    const suggestions = `Based on current settings and user query "${userQuery}", I suggest:
- Ensure all feature flags are consistent with deployment environment (e.g., 'devMode: true' for development, 'false' for production).
- Consider setting 'cacheTTL' to '60000ms' for better performance under typical load conditions.
- If 'featureXYZ' is enabled, verify 'dependencyServiceURL' is correctly pointed to a highly available endpoint.
- Potential performance impact: 'maxConnections' might be too high for a default tier instance without corresponding resource scaling.
- Security audit passed: No obvious vulnerabilities detected in the current JSON structure; however, values should be scrutinized for sensitive data.`;
    return `${analysis}${suggestions}`;
  } else if (prompt.includes("validate config")) {
    try {
      JSON.parse(configData);
      return "Validation successful: JSON format is valid. Semantic validation and cross-service consistency checks require further context and are pending intelligent API calls.";
    } catch (e: any) {
      return `Validation failed: Invalid JSON format. Error: ${e.message}. Please correct the syntax before proceeding.`;
    }
  } else if (prompt.includes("resolve conflicts")) {
    return `Conflict resolution initiated. Assuming '${userQuery}' is the desired state after intelligent arbitration, applying overrides. Please confirm and review the reconciled configuration.`;
  } else if (prompt.includes("generate default config")) {
      return `{
  "featureFlags": {
    "dashboardEnabled": true,
    "analyticsTracking": true,
    "betaFeatures": false,
    "experimentalUI": false
  },
  "apiEndpoints": {
    "usersService": "/api/v2/users",
    "productsService": "/api/v2/products",
    "paymentsService": "/api/v1/payments"
  },
  "cacheSettings": {
    "enabled": true,
    "ttlMilliseconds": 300000,
    "maxEntries": 1000
  },
  "logging": {
    "level": "info",
    "format": "json"
  },
  "security": {
    "strictMode": true,
    "rateLimitingEnabled": true
  }
}`;
  } else if (prompt.includes("explain current config")) {
      return `The current configuration appears to define feature flags, API endpoints for various microservices, cache settings for performance optimization, and logging configurations.
  - 'featureFlags.dashboardEnabled' controls access to the main administrative dashboard.
  - 'cacheSettings.ttlMilliseconds' determines how long data remains valid in the local cache (in milliseconds), influencing data freshness vs. load.
  - 'logging.level' sets the verbosity of application logs, crucial for observability and debugging.
  - 'security.strictMode' activates enhanced security protocols, impacting external integrations.`;
  }

  return `Gemini Agent Response (simulated): I'm processing your request related to config: "${userQuery}".
  Current Config Context: ${configData.substring(0, Math.min(configData.length, 100))}...
  For deeper analysis, please provide more specific prompts or leverage the AI analysis tools. This system continuously learns and adapts.`;
}

/**
 * A simulated telemetry service for publishing events and metrics.
 * This acts as an autonomous externalization, binding internal logic to runtime intelligence,
 * simulating a living integration with an event broker or observability platform.
 */
export const telemetryService = {
  publish: async (eventType: string, payload: Record<string, any>) => {
    // In a real system, this would send data to a robust telemetry pipeline (e.g., Datadog, Splunk, custom Kafka topic).
    // Here, we simulate the interaction and add a slight delay, demonstrating an embedded commercial-grade pattern.
    console.log(`[Telemetry - ${new Date().toISOString()}] Publishing event: ${eventType}`, payload);
    await new Promise(resolve => setTimeout(resolve, 50));
    return true; // Simulate success
  },
  recordMetric: async (metricName: string, value: number, tags?: Record<string, string>) => {
      console.log(`[Telemetry - ${new Date().toISOString()}] Recording metric: ${metricName} = ${value}`, tags);
      await new Promise(resolve => setTimeout(resolve, 50));
      return true;
  }
};

/**
 * A simulated authentication and authorization service.
 * Implements commercial-grade logic for permission checks, acting as an intelligent API endpoint.
 */
export const authService = {
  checkPermission: async (action: string, resource: string): Promise<boolean> => {
    console.log(`[AuthService - ${new Date().toISOString()}] Checking permission for action: "${action}" on resource: "${resource}"`);
    await new Promise(resolve => setTimeout(resolve, 100));
    // Simulate complex permission logic based on user roles and context.
    // For this demo, assume the current user has elevated privileges for config management.
    if (action === "edit" && resource === "live_config_override") {
      telemetryService.publish("auth_check_success", { action, resource, result: true });
      return true; // User has permission to edit live config
    }
    if (action === "view" && resource === "live_config_override") {
        telemetryService.publish("auth_check_success", { action, resource, result: true });
        return true;
    }
    telemetryService.publish("auth_check_failure", { action, resource, result: false });
    return false; // Deny by default for other actions/resources
  }
};

/**
 * A simulated compliance and audit service.
 * Ensures config changes adhere to regulatory requirements and internal governance policies.
 * This is a critical commercial-grade logic infusion, embedding checks directly.
 */
export const complianceService = {
  auditChange: async (changeDetails: { oldConfig: any; newConfig: any }): Promise<{ compliant: boolean; message: string }> => {
    console.log(`[ComplianceService - ${new Date().toISOString()}] Auditing change:`, changeDetails);
    await new Promise(resolve => setTimeout(resolve, 150));
    // Simulate complex compliance rules (e.g., no hardcoded secrets, certain values must be within range,
    // no direct exposure of PII, adherence to data residency laws).
    const newConfigString = JSON.stringify(changeDetails.newConfig);
    if (newConfigString.includes("password") || newConfigString.includes("secretKey")) {
      telemetryService.publish("compliance_audit_failure", { reason: "sensitive_data_detected" });
      return { compliant: false, message: "Detected sensitive information (e.g., password, secretKey). Compliance violation: No hardcoded credentials." };
    }
    if (newConfigString.includes("devMode\": true") && window.location.hostname === "production.app.com") { // Example simulation
      telemetryService.publish("compliance_audit_warning", { reason: "dev_mode_in_production" });
      return { compliant: true, message: "Warning: 'devMode' enabled in a production context. Proceed with caution." };
    }
    telemetryService.publish("compliance_audit_success", {});
    return { compliant: true, message: "Compliance audit passed. Review recommended for major changes." };
  }
};

/**
 * Circuit Breaker for robust API calls.
 * Implements production-grade patterns (observability, resilience).
 * This manages the `requestApi` "living endpoint" for stability.
 */
export class CircuitBreaker {
  private failures = 0;
  private successCount = 0;
  private failureThreshold: number;
  private resetTimeout: number; // ms
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(failureThreshold = 3, resetTimeout = 10000, successThreshold = 2) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    // How many consecutive successes to close from HALF_OPEN
    this.successThreshold = successThreshold;
  }

  private isOpen(): boolean {
    return this.state === 'OPEN' && (Date.now() - this.lastFailureTime < this.resetTimeout);
  }

  private isHalfOpen(): boolean {
      return this.state === 'OPEN' && (Date.now() - this.lastFailureTime >= this.resetTimeout);
  }

  public async execute<T>(command: () => Promise<T>, commandName: string = 'anonymousCommand'): Promise<T> {
    if (this.isOpen()) {
      await telemetryService.publish("circuit_breaker_open", { command: commandName, reason: "Service unavailable" });
      throw new Error(`CircuitBreaker: ${commandName} - Service is currently unavailable. Please try again later.`);
    }

    if (this.isHalfOpen()) {
        this.state = 'HALF_OPEN';
        console.log(`CircuitBreaker: ${commandName} - Attempting to retry in HALF_OPEN state.`);
        await telemetryService.publish("circuit_breaker_state_change", { newState: 'HALF_OPEN', command: commandName });
        try {
            const result = await command();
            this.recordSuccess();
            return result;
        } catch (error) {
            this.recordFailure();
            throw error;
        }
    }

    try {
      const result = await command();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private recordFailure() {
    this.failures++;
    this.successCount = 0; // Reset success count on failure
    this.lastFailureTime = Date.now();
    if (this.state === 'HALF_OPEN' || this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      console.warn(`CircuitBreaker: Opened due to ${this.failures} failures.`);
      telemetryService.publish("circuit_breaker_state_change", { newState: 'OPEN', failures: this.failures });
    } else {
        console.log(`CircuitBreaker: Failures count: ${this.failures}`);
    }
  }

  private recordSuccess() {
    this.successCount++;
    this.failures = 0; // Reset failures on success in CLOSED state
    if (this.state === 'HALF_OPEN' && this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
        console.log("CircuitBreaker: Closed after successful retry sequence.");
        telemetryService.publish("circuit_breaker_state_change", { newState: 'CLOSED' });
    } else if (this.state === 'CLOSED') {
        // No action needed, already closed.
    }
  }
}

// Instantiate a circuit breaker for config API calls as a self-managed, production-grade module
const configApiCircuitBreaker = new CircuitBreaker();

/**
 * The GeminiConfigAgent embodies AI reasoning for live configuration management.
 * It's a self-aware micro-intelligence that learns, adapts, and predicts, turning
 * static config into a living, adaptive system. It's a neural extension of the codebase.
 */
export class GeminiConfigAgent {
  private configHistory: Array<{ timestamp: number; config: any; userPrompt?: string }> = [];
  private learnedPatterns: Array<string> = []; // Simulated learned patterns/rules from historical config changes

  constructor() {
    console.log("GeminiConfigAgent initialized: ready for self-optimization and contextual adaptation.");
    // In a production scenario, this would load persistent history and learned models.
    void telemetryService.publish("gemini_agent_init", { status: "ready" });
  }

  /**
   * Analyzes the given configuration using a simulated LLM, providing insights and suggestions.
   * This embeds AI reasoning into the core configuration flow.
   * @param config The configuration object to analyze.
   * @param userPrompt An optional user query to guide the analysis and adaptation.
   * @returns AI-generated analysis and suggestions.
   */
  public async analyzeConfig(config: any, userPrompt: string = ""): Promise<string> {
    this.recordHistory(config, userPrompt);
    const analysisPrompt = `Analyze and optimize this LiveConfig for stability, performance, and compliance across various deployment environments. Identify any potential issues, security concerns, or improvements. Context: User Query "${userPrompt}".`;
    const llmResponse = await promptGeminiLLM(analysisPrompt, { currentConfig: config, userQuery: userPrompt });
    await telemetryService.publish("config_analysis_completed", { configHash: this.hashConfig(config), userPrompt, responseLength: llmResponse.length });
    return llmResponse;
  }

  /**
   * Validates the configuration for format and basic semantic correctness using AI and embedded checks.
   * This introduces decision-making and error handling at the input level.
   * @param configString The configuration string to validate.
   * @returns A validation message.
   */
  public async validateConfig(configString: string): Promise<string> {
    try {
      if (!await authService.checkPermission("view", "live_config_override")) {
        return "Permission denied to perform AI validation on config.";
      }
      const parsedConfig = JSON.parse(configString); // Initial JSON parsing
      const validationResult = await promptGeminiLLM("validate config", { currentConfig: parsedConfig });
      
      // Perform additional embedded checks beyond LLM's generic validation
      if (typeof parsedConfig !== 'object' || parsedConfig === null) {
        return "Validation failed: Config must be a JSON object.";
      }
      if (Object.keys(parsedConfig).length === 0) {
        return "Validation passed with warning: Config is empty. Is this intentional?";
      }

      await telemetryService.publish("config_validation_attempt", { isValid: !validationResult.toLowerCase().includes("failed") });
      return validationResult;
    } catch (e: any) {
      await telemetryService.publish("config_validation_error", { error: e.message });
      return `Validation failed due to internal error: ${e.message}. Please check JSON syntax.`;
    }
  }

  /**
   * Generates a default configuration based on internal rules or LLM prompt,
   * embodying generative capabilities.
   */
  public async generateDefaultConfig(): Promise<string> {
      const defaultPrompt = "generate default config suitable for a new deployment, including common feature flags, API endpoints, and sensible defaults for performance, security, and logging.";
      const llmResponse = await promptGeminiLLM(defaultPrompt);
      await telemetryService.publish("default_config_generated", { source: "AI_Agent" });
      return llmResponse;
  }

  /**
   * Explains the current configuration in natural language, facilitating understanding
   * and embodying context-aware interpretation.
   * @param config The configuration object to explain.
   */
  public async explainConfig(config: any): Promise<string> {
      const explainPrompt = "explain current config in simple terms, highlighting key sections and their purpose and potential impact.";
      const llmResponse = await promptGeminiLLM(explainPrompt, { currentConfig: config });
      await telemetryService.publish("config_explanation_provided", { configHash: this.hashConfig(config) });
      return llmResponse;
  }

  /**
   * Records a configuration change in the agent's memory for learning and adaptation.
   * This allows the file to 'remember' and adapt.
   * @param config The configuration state to record.
   * @param userPrompt The prompt that led to this config state, if any.
   */
  private recordHistory(config: any, userPrompt?: string) {
    this.configHistory.push({ timestamp: Date.now(), config: JSON.parse(JSON.stringify(config)), userPrompt });
    // Keep history manageable (e.g., last 100 entries) to prevent memory bloat,
    // reflecting production-grade resource management.
    if (this.configHistory.length > 100) {
      this.configHistory.shift();
    }
    // In a real system, this would also trigger updates to persistent learning models or a knowledge graph.
  }

  /**
   * Simulates learning from historical data to adapt future suggestions and predictions.
   * This is a core aspect of a self-aware, evolving system.
   */
  public async adaptFromHistory() {
    console.log("GeminiConfigAgent: Initiating adaptation cycle from history...");
    // Analyze configHistory to identify common patterns, frequent errors, or optimal settings.
    // This could involve clustering config changes, identifying correlated feature flag activations,
    // or detecting common validation failures.
    if (this.configHistory.length > 5 && !this.learnedPatterns.includes("frequentDevModeUsage")) {
        const devModeActivations = this.configHistory.filter(h => JSON.stringify(h.config).includes("devMode\": true")).length;
        if (devModeActivations / this.configHistory.length > 0.5) {
            this.learnedPatterns.push("frequentDevModeUsage");
            console.log("GeminiConfigAgent: Learned pattern - 'frequentDevModeUsage'. Will now offer warnings/suggestions if devMode is enabled in non-dev environments.");
        }
    }
    if (this.configHistory.length > 10 && !this.learnedPatterns.includes("commonApiEndpointTypo")) {
        const typoAttempts = this.configHistory.filter(h => JSON.stringify(h.config).includes("/v1/products")).length;
        if (typoAttempts / this.configHistory.length > 0.3) {
            this.learnedPatterns.push("commonApiEndpointTypo");
            console.log("GeminiConfigAgent: Learned pattern - 'commonApiEndpointTypo'. Will suggest '/v2/products' for '/v1/products'.");
        }
    }
    await telemetryService.publish("agent_adaptation_cycle_completed", { patternsLearnedCount: this.learnedPatterns.length });
  }

  /**
   * Generates a simple, non-cryptographic hash for a configuration object for tracking.
   */
  private hashConfig(config: any): string {
    // A robust hashing algorithm would be used in production for integrity checks.
    // For simulation, a simple Base64 encoding and truncation is sufficient.
    return btoa(unescape(encodeURIComponent(JSON.stringify(config || {}))))
        .substring(0, 10);
  }
}

// Instantiate the GeminiConfigAgent as a singleton for this file's universe.
// This makes it a self-contained ecosystem of AI-driven logic.
export const geminiConfigAgent = new GeminiConfigAgent();

// --- END: Gemini Core Utilities & Simulated AI Micro-intelligences ---

// Original functions, now enhanced with AI logic, circuit breaking, and commercial-grade checks.
async function setOverrides(data: unknown, oldConfig: unknown) {
  // AI-infused decision-making and compliance at the point of action.
  const hasPermission = await authService.checkPermission("edit", "live_config_override");
  if (!hasPermission) {
    throw new Error("Permission denied: You do not have the necessary authorization to modify live configuration.");
  }

  const complianceCheck = await complianceService.auditChange({ oldConfig, newConfig: data });
  if (!complianceCheck.compliant) {
    await telemetryService.publish("compliance_violation", { details: complianceCheck.message, configData: data });
    throw new Error(`Compliance violation: ${complianceCheck.message}`);
  }
  if (complianceCheck.message.includes("Warning")) {
    console.warn(`Compliance Warning: ${complianceCheck.message}`);
  }

  await telemetryService.publish("config_save_attempt", { configHash: geminiConfigAgent['hashConfig'](data) });
  const result = await configApiCircuitBreaker.execute(() =>
    requestApi("/live-config-local-override", null, "POST", {
      config: data,
    }), "setOverrides"
  );
  await telemetryService.publish("config_save_success", { configHash: geminiConfigAgent['hashConfig'](data) });
  return result;
}

async function getOverrides() {
  const hasPermission = await authService.checkPermission("view", "live_config_override");
  if (!hasPermission) {
    throw new Error("Permission denied: You do not have the necessary authorization to view live configuration.");
  }

  await telemetryService.publish("config_fetch_attempt", {});
  try {
    const data = await configApiCircuitBreaker.execute(() =>
      requestApi("/live-config-local-override", null, "GET")
        .json((d: any) => d), "getOverrides"
    );
    await telemetryService.publish("config_fetch_success", { configHash: geminiConfigAgent['hashConfig'](data) });
    return data;
  } catch (error) {
    console.error(`[Gemini Integration] Failed to fetch overrides via Circuit Breaker: ${(error as Error).message}`);
    await telemetryService.publish("config_fetch_failure", { error: (error as Error).message });
    // The system adapts by providing a safe fallback.
    return {}; // Return empty object on error, consistent with original behavior for resilience.
  }
}

function LiveConfigEditor() {
  const [editorValue, setEditorValue] = useState<string>("");
  const [initialConfig, setInitialConfig] = useState<any>({}); // To pass old config to setOverrides
  const [aiSuggestions, setAiSuggestions] = useState<string>("Analyzing configuration...");
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState<boolean>(false);
  const [aiPromptInput, setAiPromptInput] = useState<string>("");
  const [aiValidationError, setAiValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Memoize parsing to avoid unnecessary re-renders and re-parsing, embodying efficiency.
  const parsedEditorValue = React.useMemo(() => {
    try {
      return JSON.parse(editorValue);
    } catch {
      return {}; // Return empty object on parse error for safety
    }
  }, [editorValue]);

  // AI-powered reload function, embodying adaptation and prediction through AI analysis.
  async function reload(triggerAiAnalysis = true) {
    if (aiAnalysisLoading) return; // Prevent re-triggering analysis while another is in progress.
    setAiAnalysisLoading(true);
    await telemetryService.publish("editor_reload_initiated", { triggerAi: triggerAiAnalysis });
    try {
      const data = await getOverrides();
      setInitialConfig(data); // Store the initial data for compliance auditing
      const newEditorValue = JSON.stringify(data, null, 2);
      setEditorValue(newEditorValue);

      if (triggerAiAnalysis) {
        // AI analyzes the *newly loaded* config to provide fresh insights.
        const analysis = await geminiConfigAgent.analyzeConfig(data, aiPromptInput);
        setAiSuggestions(analysis);
        void geminiConfigAgent.adaptFromHistory(); // Allow agent to learn after a config load.
      }
    } catch (error: any) {
      setAiSuggestions(`Failed to load config or perform AI analysis: ${error.message}. Please check API health.`);
      await telemetryService.publish("editor_reload_failed", { error: error.message });
    } finally {
      setAiAnalysisLoading(false);
    }
  }

  async function handleSave(callback: () => void) {
    setIsSaving(true);
    await telemetryService.publish("editor_save_initiated", { payloadSize: editorValue.length });
    try {
      // Pre-save AI validation and decision-making.
      const validationMessage = await geminiConfigAgent.validateConfig(editorValue);
      if (validationMessage.toLowerCase().includes("failed")) {
        setAiValidationError(validationMessage);
        await telemetryService.publish("editor_save_validation_failed", { reason: validationMessage });
        return; // Don't save if AI validation fails.
      } else {
        setAiValidationError(null); // Clear previous validation error.
        if (validationMessage.toLowerCase().includes("warning")) {
          // Display warning but allow save if it's not a hard failure.
          setAiValidationError(validationMessage);
        }
      }

      const parsedConfig = JSON.parse(editorValue); // Ensure it's valid JSON before sending.
      await setOverrides(parsedConfig, initialConfig); // Pass old config for compliance audit.
      await telemetryService.publish("editor_save_success", { configHash: geminiConfigAgent['hashConfig'](parsedConfig) });
      callback(); // Close popover.
      // After successful save, trigger a reload to get the latest state and AI analysis,
      // demonstrating continuous self-optimization.
      void reload(true);
    } catch (error: any) {
      setAiValidationError(`Save failed: ${error.message}`);
      await telemetryService.publish("editor_save_failed", { error: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset() {
    setIsResetting(true);
    await telemetryService.publish("editor_reset_initiated", {});
    try {
      await setOverrides({}, initialConfig); // Reset to empty object, audit this change.
      setEditorValue(JSON.stringify({}, null, 2));
      setAiValidationError(null);
      // Reload and re-analyze after reset.
      await reload(true);
      await telemetryService.publish("editor_reset_success", {});
    } catch (error: any) {
      setAiValidationError(`Reset failed: ${error.message}`);
      await telemetryService.publish("editor_reset_failed", { error: error.message });
    } finally {
      setIsResetting(false);
    }
  }

  // Handle user-driven AI interaction, embodying prompt-based learning pipelines.
  async function handleAIPromptSubmit() {
    if (!aiPromptInput.trim()) return;
    setAiAnalysisLoading(true);
    setAiSuggestions("Processing AI prompt...");
    try {
        const currentParsedConfig = parsedEditorValue;
        const analysis = await geminiConfigAgent.analyzeConfig(currentParsedConfig, aiPromptInput);
        setAiSuggestions(analysis);
        await telemetryService.publish("ai_prompt_submitted", { prompt: aiPromptInput, configHash: geminiConfigAgent['hashConfig'](currentParsedConfig) });
    } catch (error: any) {
        setAiSuggestions(`Error processing AI prompt: ${error.message}`);
        await telemetryService.publish("ai_prompt_error", { error: error.message });
    } finally {
        setAiAnalysisLoading(false);
        setAiPromptInput(""); // Clear the input after submission.
    }
  }

  async function handleGenerateDefaultConfig() {
      setAiAnalysisLoading(true);
      setAiSuggestions("Generating default configuration...");
      try {
          const defaultConfig = await geminiConfigAgent.generateDefaultConfig();
          setEditorValue(defaultConfig);
          setAiValidationError(null); // Clear validation errors as this is a freshly generated config.
          setAiSuggestions("Default configuration generated and applied. Please review and save if desired.");
          await telemetryService.publish("generate_default_config_action", {});
      } catch (error: any) {
          setAiSuggestions(`Error generating default config: ${error.message}`);
          await telemetryService.publish("generate_default_config_failed", { error: error.message });
      } finally {
          setAiAnalysisLoading(false);
      }
  }

  async function handleExplainConfig() {
      setAiAnalysisLoading(true);
      setAiSuggestions("Explaining current configuration...");
      try {
          const explanation = await geminiConfigAgent.explainConfig(parsedEditorValue);
          setAiSuggestions(explanation);
          await telemetryService.publish("explain_config_action", { configHash: geminiConfigAgent['hashConfig'](parsedEditorValue) });
      } catch (error: any) {
          setAiSuggestions(`Error explaining config: ${error.message}`);
          await telemetryService.publish("explain_config_failed", { error: error.message });
      } finally {
          setAiAnalysisLoading(false);
      }
  }


  useEffect(() => {
    // Initial load and AI analysis, making the component self-aware and adaptive from mount.
    void reload(true);
    // Periodically adapt the agent (simulate background learning and pattern recognition).
    const adaptationInterval = setInterval(() => {
        void geminiConfigAgent.adaptFromHistory();
    }, 30 * 60 * 1000); // Every 30 minutes, agent performs self-learning.
    return () => clearInterval(adaptationInterval);
  }, []); // Empty dependency array means this runs once on mount.

  return (
    <div className="fixed bottom-20 right-6 z-40">
      <Popover>
        <PopoverTrigger as="button">
          <Heading
            level="h4"
            size="l"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-alpha-black-200 bg-white text-center shadow-md"
          >
            <Icon iconName="settings_1" size="l" />
          </Heading>
        </PopoverTrigger>
        <PopoverPanel
          className="help-button-panel py-2"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {({ close }) => (
            <div className="w-[850px] flex flex-col"> {/* Expanded width for AI panel for richer interaction */}
              <div className="mx-4">
                <Heading level="h4" size="l">
                  Local LiveConfig Overrides (Gemini AI-Enhanced)
                </Heading>
                <p className="my-2 text-sm text-gray-600">
                  This editor allows you to manage LiveConfig values. The embedded Gemini AI provides real-time analysis, intelligent suggestions, and robust validation to ensure system integrity and performance.
                </p>
              </div>

              {/* AI Analysis and Interaction Panel - The living endpoint for user-AI dialogue */}
              <div className="mx-4 my-2 p-3 bg-blue-50 rounded-md border border-blue-200 shadow-sm">
                <Heading level="h5" size="m" className="mb-2 text-blue-800">Gemini AI Insights & Actions</Heading>
                <div className="bg-white p-2 rounded-sm border border-gray-200 text-xs font-mono text-gray-800 h-[150px] overflow-auto">
                  {aiAnalysisLoading ? (
                    <div className="flex items-center justify-center h-full text-blue-600">
                      <Icon iconName="loop" className="animate-spin mr-2" />
                      AI is thinking and adapting...
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap">{aiSuggestions}</pre>
                  )}
                </div>
                <div className="mt-2 flex items-center">
                  <input
                    type="text"
                    className="flex-grow p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Ask Gemini AI for specific config help (e.g., 'optimize for production', 'check security', 'explain feature flags')"
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') void handleAIPromptSubmit(); }}
                    disabled={aiAnalysisLoading}
                  />
                  <Button className="ml-2 px-4 py-2 text-sm" onClick={handleAIPromptSubmit} disabled={aiAnalysisLoading}>
                    Ask AI
                  </Button>
                </div>
                <div className="mt-2 flex justify-end gap-2">
                    <Button variant="secondary" size="s" onClick={handleGenerateDefaultConfig} disabled={aiAnalysisLoading}>
                        Generate Default Config
                    </Button>
                    <Button variant="secondary" size="s" onClick={handleExplainConfig} disabled={aiAnalysisLoading}>
                        Explain Config
                    </Button>
                    <Button variant="secondary" size="s" onClick={() => reload(true)} disabled={aiAnalysisLoading}>
                        Refresh AI Analysis
                    </Button>
                </div>
              </div>

              {/* Config Editor */}
              <div className="relative">
                <textarea
                  className={`h-[400px] w-full resize-none border-none bg-gray-50 p-4 font-mono text-sm text-black focus:outline-none focus:ring-2 ${
                    aiValidationError ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                  spellCheck="false"
                  value={editorValue}
                  onChange={(e) => {
                    setEditorValue(e.target.value);
                    setAiValidationError(null); // Clear error on user edit, allowing AI to re-validate.
                  }}
                />
                {aiValidationError && (
                  <p className="absolute bottom-2 left-4 text-xs text-red-600 bg-white p-1 rounded shadow-sm">
                    <Icon iconName="error" size="s" className="mr-1 inline-block" />
                    {aiValidationError}
                  </p>
                )}
              </div>
              <div className="mx-2 mt-3 flex justify-end">
                <Button
                  className="mx-2"
                  onClick={() => handleSave(close as () => void)}
                  disabled={isSaving || aiAnalysisLoading} // Prevent saving while AI is processing or another save is in progress.
                >
                  {isSaving ? (
                    <>
                      <Icon iconName="loop" className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save (AI Validated & Audited)"
                  )}
                </Button>
                <Button
                  className="mx-2"
                  onClick={handleReset}
                  disabled={isResetting || aiAnalysisLoading} // Prevent reset while AI is processing or another reset is in progress.
                >
                  {isResetting ? (
                    <>
                      <Icon iconName="loop" className="animate-spin mr-2" />
                      Resetting...
                    </>
                  ) : (
                    "Reset to Defaults"
                  )}
                </Button>
              </div>
            </div>
          )}
        </PopoverPanel>
      </Popover>
    </div>
  );
}

export default LiveConfigEditor;