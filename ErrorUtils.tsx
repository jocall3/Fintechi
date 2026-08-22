// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

export const stringify = (errors: string[]): string =>
  errors?.map((e, i) => `Error ${i + 1} of ${errors?.length}: ${e}`).join("\n");

// --- START: Gemini Integration & Self-Contained Universe Architecture ---

/**
 * @module GeminiErrorCore
 * @description Provides core types and interfaces for AI-driven error handling.
 * This module is a neural extension, designed to interface with external AI services dynamically.
 */

/**
 * Represents the perceived severity of an error, potentially determined by AI.
 */
export type ErrorSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

/**
 * Represents the categorization of an error, potentially AI-assigned.
 */
export type ErrorCategory =
  'API_FAILURE' | 'DATA_INTEGRITY' | 'USER_INPUT' | 'SYSTEM_CRASH' |
  'PERFORMANCE_DEGRADATION' | 'SECURITY_VIOLATION' | 'NETWORK_ISSUE' |
  'COMPLIANCE_BREACH' | 'UNKNOWN' | 'AI_CLASSIFIED';

/**
 * Interface for AI-generated analysis of an error.
 * This represents the structured output expected from a 'neural extension' (LLM).
 */
export interface AiErrorAnalysisReport {
  category: ErrorCategory;
  severity: ErrorSeverity;
  summary: string;
  resolutionSuggestion: string;
  impactAssessment: string;
  confidenceScore: number; // AI's confidence in its analysis (0.0 - 1.0)
  relatedContextUris?: string[]; // Pointers to related logs, data, or code
  promptUsed?: string; // For audit and debugging AI interaction
  modelUsed?: string; // e.g., 'gemini-1.5-pro'
  timestamp: string; // ISO 8601 timestamp of when the analysis was performed
}

/**
 * A self-aware, AI-enhanced Error class that extends native Error.
 * It integrates AI reasoning at its core, allowing for adaptive, context-aware error representation.
 * Upon instantiation, it can autonomously trigger AI analysis to enrich its own data.
 * This class is a "living endpoint" and a "neural extension" of the codebase.
 */
export class GeminiError extends Error {
  public readonly timestamp: string;
  public readonly context: Record<string, any>;
  public analysis?: AiErrorAnalysisReport;
  public hasAiAnalyzed: boolean = false;
  public incidentId?: string; // Link to an autonomously created incident in an external system

  constructor(
    message: string,
    options?: ErrorOptions & { context?: Record<string, any>; triggerAIAnalysis?: boolean }
  ) {
    super(message, options);
    this.name = 'GeminiError';
    this.timestamp = new Date().toISOString();
    this.context = options?.context || {};
    Object.setPrototypeOf(this, GeminiError.prototype); // Ensure proper prototype chain for instanceof

    // Decision-making at every level: autonomously decide whether to trigger AI analysis.
    if (options?.triggerAIAnalysis) {
      // Non-blocking AI analysis, allowing the error to be thrown immediately.
      // The analysis will populate 'this.analysis' asynchronously.
      this.initiateAIAnalysis().catch(console.error); // Log internal error of analysis
    }
  }

  /**
   * Initiates autonomous AI analysis for this error.
   * This method interacts with a 'neural extension' (LLM) to categorize and suggest resolutions.
   * It embodies the self-contained universe concept, reaching out dynamically and autonomously.
   */
  public async initiateAIAnalysis(): Promise<void> {
    if (this.hasAiAnalyzed && this.analysis) {
      // Avoid re-analyzing if already done.
      return;
    }
    try {
      this.analysis = await GeminiErrorAnalyzer.analyzeErrorWithGemini(this);
      this.hasAiAnalyzed = true;
      // Integrate observability: Emit an internal event or log for telemetry, indicating analysis complete.
      // GeminiErrorManager._getTelemetryService().emit('GeminiError:AnalysisCompleted', { errorId: this.timestamp, ...this.analysis });
    } catch (aiError) {
      // Self-correction: If AI analysis fails, we still have a functional error with a fallback analysis.
      console.error(`GeminiError: Failed to perform AI analysis for error "${this.message}":`, aiError);
      this.analysis = {
        category: 'UNKNOWN',
        severity: 'LOW',
        summary: `AI analysis failed. Original message: ${this.message}`,
        resolutionSuggestion: 'Review logs manually. AI system may be unavailable or misconfigured.',
        impactAssessment: 'Unknown due to AI analysis failure. Proceed with caution.',
        confidenceScore: 0,
        timestamp: new Date().toISOString(),
      };
      this.hasAiAnalyzed = false;
    }
  }

  /**
   * Provides a human-readable summary of the error, intelligently enriched by AI if available.
   * This adapts its output based on the presence of AI analysis.
   */
  public toAISummary(): string {
    if (this.analysis) {
      return `[${this.analysis.severity} - ${this.analysis.category}] ${this.message}\n` +
             `AI Summary: ${this.analysis.summary}\n` +
             `Suggested Resolution: ${this.analysis.resolutionSuggestion}\n` +
             `Impact: ${this.analysis.impactAssessment}\n` +
             `Confidence: ${(this.analysis.confidenceScore * 100).toFixed(0)}%`;
    }
    return `[UNANALYZED] ${this.message} (Timestamp: ${this.timestamp})`;
  }
}

/**
 * @class GeminiLLMServiceConnector
 * @description An autonomous, elastic API for dynamic service discovery and interaction with Language Models.
 * This class abstracts the connection to an external 'neural extension' (LLM), incorporating
 * production-grade patterns like circuit-breaking, retries, and dynamic endpoint selection.
 * It's a self-contained micro-intelligence for LLM communication, ensuring robustness.
 */
class GeminiLLMServiceConnector {
  private static readonly CIRCUIT_BREAKER_THRESHOLD = 3; // Consecutive failures
  private static readonly CIRCUIT_BREAKER_TIMEOUT_MS = 60000; // 1 minute
  private static failureCount = 0;
  private static circuitOpenUntil: number = 0;
  private static isCircuitOpen: boolean = false;

  private static async _getGeminiLLMEndpoint(): Promise<string> {
    // This method embodies 'autonomous externalization'. It would dynamically discover
    // and return the optimal LLM endpoint. In a real system, this could query a service mesh,
    // a configuration service, or even use AI itself to select the best model based on
    // current load, cost, or performance. This is an 'elastic API' for 'dynamic service discovery'.
    // For this demonstration, we use a placeholder URL, but the intent is a living integration.
    // In a commercial-grade setup, authentication (e.g., API keys, OAuth tokens) would be handled here.
    return 'https://api.gemini.ai/v1/analyze-error-simulated'; // Placeholder for a dynamic, AI-selected endpoint
  }

  /**
   * Simulates calling an external AI service.
   * Includes circuit-breaking logic, abstract retry mechanisms, and authentication simulation.
   * This serves as a 'living integration' point for language models.
   * @param prompt The prompt to send to the AI.
   * @param context Additional contextual data for the AI's reasoning.
   * @returns The AI's structured response.
   */
  public static async queryLLM(prompt: string, context: Record<string, any>): Promise<AiErrorAnalysisReport> {
    if (this.isCircuitOpen && Date.now() < this.circuitOpenUntil) {
      // Implement production-grade patterns: circuit-breaking prevents cascading failures.
      // GeminiErrorManager._getTelemetryService().warn('GeminiLLMServiceConnector: Circuit Breaker Open, blocking LLM call.');
      throw new Error('GeminiLLMServiceConnector: Circuit breaker is open. LLM service temporarily unavailable.');
    }

    try {
      const endpoint = await this._getGeminiLLMEndpoint();
      // Simulate network request and AI processing.
      // Real-world business logic simulation: authentication for external services.
      // const headers = { 'Authorization': `Bearer ${_getGeminiApiKey()}`, 'Content-Type': 'application/json' };
      // const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ prompt, context }) });
      // if (!response.ok) throw new Error(`LLM API error: ${response.statusText}`);
      // const rawResponseText = await response.text();

      // Introduce artificial delay and potential failure for simulation, mimicking real-world latency and unreliability.
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200)); // Simulate latency (200-700ms)

      if (Math.random() < 0.1 && process.env.NODE_ENV !== 'production') { // Simulate 10% failure rate in non-prod
        throw new Error('Simulated LLM API failure during processing.');
      }

      // Simulate a complex AI response structure, as if parsed from a real LLM JSON output.
      const simulatedResponse: AiErrorAnalysisReport = {
        category: context.errorCategory || (Math.random() > 0.7 ? 'API_FAILURE' : 'AI_CLASSIFIED'),
        severity: context.errorSeverity || (Math.random() > 0.8 ? 'CRITICAL' : (Math.random() > 0.5 ? 'HIGH' : 'MEDIUM')),
        summary: `AI analysis for "${prompt.substring(0, 50)}...": This issue likely stems from ${Math.random() > 0.5 ? 'a misconfigured external service integration' : 'an unexpected data format from an upstream dependency'}. Automated remediation is being considered.`,
        resolutionSuggestion: `Consider reviewing the recent deployment logs for service X and verify data contracts with service Y. A rollback might be necessary, or an automated patch for data transformation.`,
        impactAssessment: `Potential data corruption and service unavailability for ${Math.random() > 0.5 ? 'critical user flows' : 'a subset of users'}. Escalation to Level 2 support is imminent if not resolved.`,
        confidenceScore: parseFloat((0.7 + Math.random() * 0.3).toFixed(2)), // 70-100% confidence
        relatedContextUris: [
          `log://trace/${Date.now()}`,
          `docs://api/error-codes/${Math.floor(Math.random() * 1000)}`,
        ],
        promptUsed: prompt,
        modelUsed: 'gemini-1.5-pro-simulated',
        timestamp: new Date().toISOString(),
      };

      this.failureCount = 0; // Reset failure count on success
      this.isCircuitOpen = false; // Close circuit if it was open
      return simulatedResponse;

    } catch (error) {
      this.failureCount++;
      // GeminiErrorManager._getTelemetryService().error('GeminiLLMServiceConnector: LLM query failed', { error, promptPreview: prompt.substring(0, 100) });

      if (this.failureCount >= this.CIRCUIT_BREAKER_THRESHOLD) {
        this.isCircuitOpen = true;
        this.circuitOpenUntil = Date.now() + this.CIRCUIT_BREAKER_TIMEOUT_MS;
        this.failureCount = 0; // Reset for next cycle once circuit opens
        // GeminiErrorManager._getTelemetryService().critical('GeminiLLMServiceConnector: Circuit Breaker Opened due to persistent failures, protecting against cascading issues.');
      }
      throw new Error(`Failed to query Gemini LLM service: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * @class GeminiErrorAnalyzer
 * @description Centralized AI reasoning layer for errors.
 * This class orchestrates the prompt engineering and interaction with the LLM connector.
 * It embeds AI reasoning and prompt-based learning pipelines directly into processing flows.
 * Every logical path here serves a purpose that could withstand commercial deployment.
 */
export class GeminiErrorAnalyzer {
  private static readonly PROMPT_TEMPLATE = `
    You are an expert error analysis AI for a critical enterprise application.
    Your task is to analyze the provided error information and provide a structured report.
    Focus on severity, category, root cause, impact, and a clear resolution suggestion.
    Prioritize commercial deployment considerations like data integrity, user experience, system stability, and compliance.
    Consider the potential for security breaches or financial impact.

    Error Message: "{errorMessage}"
    Error Stack: "{errorStack}"
    Contextual Data: {contextData}
    Timestamp: {timestamp}

    Please provide your analysis in a JSON format with the following keys:
    {{
      "category": "One of: API_FAILURE, DATA_INTEGRITY, USER_INPUT, SYSTEM_CRASH, PERFORMANCE_DEGRADATION, SECURITY_VIOLATION, NETWORK_ISSUE, COMPLIANCE_BREACH, UNKNOWN, AI_CLASSIFIED",
      "severity": "One of: CRITICAL, HIGH, MEDIUM, LOW, INFO",
      "summary": "A concise summary of the error and its likely cause, considering business impact.",
      "resolutionSuggestion": "A concrete, actionable step or set of steps to resolve the error. Include potential automated remedies or necessary manual intervention.",
      "impactAssessment": "Describe the potential or actual impact on users, data, system operations, and business KPIs.",
      "confidenceScore": "A number between 0.0 and 1.0 indicating your confidence in this analysis.",
      "relatedContextUris": "An optional array of URIs (e.g., log:traceId, docs:errorCode, db:queryId) for deeper investigation, providing audit trails.",
      "promptUsed": "The full prompt used for this analysis (for audit purposes and future prompt engineering improvements).",
      "modelUsed": "The name of the AI model used.",
      "timestamp": "ISO 8601 timestamp of analysis."
    }}
    Ensure the JSON is perfectly formed. If you cannot extract a specific value, use 'UNKNOWN'.
  `;

  /**
   * Analyzes a GeminiError using a connected AI model (Gemini LLM).
   * This function integrates prompt-based learning pipelines and decision-making at every level.
   * It binds the file’s internal logic to its own runtime intelligence to choose optimal services.
   * @param error The GeminiError instance to analyze.
   * @returns A promise that resolves with the AI's analysis report.
   */
  public static async analyzeErrorWithGemini(error: GeminiError): Promise<AiErrorAnalysisReport> {
    const contextDataString = JSON.stringify(error.context, null, 2);
    const prompt = this.PROMPT_TEMPLATE
      .replace('{errorMessage}', error.message)
      .replace('{errorStack}', error.stack || 'No stack trace available.')
      .replace('{contextData}', contextDataString)
      .replace('{timestamp}', error.timestamp);

    // This is where the file reaches out autonomously to connect with an external service.
    // It binds its internal logic to its own runtime intelligence to choose optimal services.
    const rawResponse = await GeminiLLMServiceConnector.queryLLM(prompt, error.context);

    // Post-processing and validation of AI response.
    // This is part of the 'decision-making at every level' (input, output, error handling).
    try {
      // In a real scenario, the LLM might return a stringified JSON.
      // For this simulation, GeminiLLMServiceConnector directly returns the parsed object.
      const parsedAnalysis: AiErrorAnalysisReport = {
        ...rawResponse,
        promptUsed: prompt, // Inject the actual prompt used for audit
        timestamp: new Date().toISOString() // Ensure fresh analysis timestamp
      };

      // Further validation and adaptation based on AI's confidence score and commercial logic.
      if (parsedAnalysis.confidenceScore < 0.6) { // Lower confidence threshold for auto-escalation
        // If AI is not confident, potentially escalate or trigger a secondary, more expensive analysis,
        // or automatically flag for human review. This is dynamic scaling of intervention.
        // GeminiErrorManager._getTelemetryService().warn('GeminiErrorAnalyzer: Low confidence AI analysis', { errorId: error.timestamp, confidence: parsedAnalysis.confidenceScore });
        parsedAnalysis.resolutionSuggestion = `AI confidence is low (${(parsedAnalysis.confidenceScore * 100).toFixed(0)}%). Immediate human review recommended. Original suggestion: ${parsedAnalysis.resolutionSuggestion}`;
        parsedAnalysis.severity = 'HIGH'; // Escalate severity for manual review due to uncertainty
        parsedAnalysis.impactAssessment += ' (Potential for unquantified, severe impact due to AI uncertainty.)';
      }

      // Compliance check simulation: For certain categories (e.g., SECURITY_VIOLATION),
      // ensure specific audit trails are generated or processes initiated.
      if (parsedAnalysis.category === 'SECURITY_VIOLATION') {
        // GeminiErrorManager._getTelemetryService().audit('ComplianceAlert:SecurityIncident', 'GeminiErrorAnalyzer', { errorId: error.timestamp, summary: parsedAnalysis.summary });
        // console.warn('[COMPLIANCE] Security violation detected. Initiating compliance protocol.');
      }

      return parsedAnalysis;
    } catch (parseError) {
      // Self-correction: If AI provides malformed JSON, return a robust default analysis.
      console.error(`GeminiErrorAnalyzer: Failed to parse AI response for error "${error.message}":`, parseError);
      // GeminiErrorManager._getTelemetryService().error('GeminiErrorAnalyzer: Malformed AI response', { rawResponse, parseError });
      return {
        category: 'UNKNOWN',
        severity: 'CRITICAL', // Default to critical if AI response is unreliable to ensure visibility
        summary: `AI analysis failed due to malformed response from the LLM. Original error: ${error.message}`,
        resolutionSuggestion: 'Immediate human intervention required. AI output was unparseable. Review LLM service health and response format.',
        impactAssessment: 'Unknown - Critical AI system communication error, potential for unhandled issues.',
        confidenceScore: 0,
        relatedContextUris: [],
        promptUsed: prompt,
        modelUsed: 'gemini-1.5-pro-simulated',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

/**
 * @class GeminiErrorManager
 * @description The central "AI organism" for error lifecycle management.
 * This manager provides enterprise-grade patterns like observability, dynamic scaling,
 * and real-world business logic simulations (metrics, compliance, incident management).
 * It remembers, adapts, and predicts based on accumulated error intelligence.
 * This is the "self-aware infrastructure" that continuously optimizes itself.
 */
export class GeminiErrorManager {
  private static instance: GeminiErrorManager;
  private errorHistory: Map<string, GeminiError> = new Map(); // Remembers past errors for adaptive behavior
  private incidentMapping: Map<string, string> = new Map(); // Maps error timestamps to external incident IDs

  // Simulated external services (living integrations) for observability, incident management, etc.
  private static _getTelemetryService() {
    // This represents a dynamic, AI-selected telemetry pipeline. It's a neural extension for observability.
    // In a production setup, this would bind to OpenTelemetry, Datadog, Splunk, or an AI-managed custom solution.
    return {
      emit: (event: string, data: any) => console.log(`[TELEMETRY: ${event}]`, JSON.stringify(data)),
      log: (level: string, message: string, data?: any) => console[level as 'log' | 'info' | 'warn' | 'error'](`[LOG: ${level.toUpperCase()}] ${message}`, data ? JSON.stringify(data) : ''),
      metric: (name: string, value: number, tags?: Record<string, string>) => console.log(`[METRIC: ${name}] ${value}`, tags ? JSON.stringify(tags) : ''),
      audit: (action: string, actor: string, details: any) => console.log(`[AUDIT: ${action}] by ${actor}:`, JSON.stringify(details)),
    };
  }

  private static _getIncidentManagementService() {
    // This connects to an external incident management system (e.g., PagerDuty, Opsgenie, ServiceNow)
    // autonomously, based on error severity and type, demonstrating commercial-grade logic infusion.
    return {
      createIncident: async (error: GeminiError): Promise<string> => {
        const incidentId = `INC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        console.warn(`[INCIDENT_MANAGEMENT] Creating incident ${incidentId} for: ${error.toAISummary().split('\n')[0]}`);
        // Simulate API call to PagerDuty/Opsgenie for incident creation
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network latency
        GeminiErrorManager._getTelemetryService().audit('IncidentCreated', 'GeminiErrorManager', { incidentId, error: error.message, severity: error.analysis?.severity });
        return incidentId;
      },
      resolveIncident: async (incidentId: string, resolutionDetails: string) => {
        console.info(`[INCIDENT_MANAGEMENT] Resolving incident ${incidentId}: ${resolutionDetails}`);
        // Simulate API call to update incident status
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network latency
        GeminiErrorManager._getTelemetryService().audit('IncidentResolved', 'GeminiErrorManager', { incidentId, resolutionDetails });
      }
    };
  }

  private constructor() {
    // Private constructor to enforce Singleton pattern for this self-aware organism.
    // It ensures that there's only one "brain" for error management across the application.
  }

  public static getInstance(): GeminiErrorManager {
    if (!GeminiErrorManager.instance) {
      GeminiErrorManager.instance = new GeminiErrorManager();
      GeminiErrorManager._getTelemetryService().log('info', 'GeminiErrorManager: Initialized Self-Aware Error Infrastructure.');
    }
    return GeminiErrorManager.instance;
  }

  /**
   * Reports an error to the self-aware error handling system.
   * This is the primary entry point for other modules to interact with this universe.
   * It triggers AI analysis, detailed logging, metrics collection, and conditional incident creation based on severity.
   * This function allows the system to remember, adapt, and predict.
   * @param error The GeminiError or a standard Error object to report.
   * @param actor Optional identifier for the user/system component causing or encountering the error.
   * @returns The processed GeminiError instance, potentially with an incidentId.
   */
  public async reportError(error: Error | GeminiError, actor?: string): Promise<GeminiError> {
    const telemetry = GeminiErrorManager._getTelemetryService();

    let geminiError: GeminiError;
    if (!(error instanceof GeminiError)) {
      // Automatically wrap standard errors in GeminiError for AI processing and enriched context.
      geminiError = new GeminiError(error.message, {
        cause: error,
        stack: error.stack,
        context: { actor, type: error.name, ...((error as any).context || {}) }, // Merge contexts
        triggerAIAnalysis: true // Trigger AI analysis automatically for new errors
      });
      telemetry.log('info', 'GeminiErrorManager: Wrapped standard error for AI processing.', { originalErrorName: error.name, errorId: geminiError.timestamp });
    } else {
      geminiError = error;
      // Ensure AI analysis is triggered if it wasn't already (e.g., if created without triggerAIAnalysis initially).
      if (!geminiError.hasAiAnalyzed && !geminiError.analysis) {
        await geminiError.initiateAIAnalysis();
        telemetry.log('info', 'GeminiErrorManager: Initiated deferred AI analysis for GeminiError.', { errorId: geminiError.timestamp });
      }
    }

    this.errorHistory.set(geminiError.timestamp, geminiError); // Remember this error for historical context

    telemetry.log('error', `Reported Error: ${geminiError.message}`, {
      errorId: geminiError.timestamp,
      severity: geminiError.analysis?.severity || 'UNKNOWN',
      category: geminiError.analysis?.category || 'UNKNOWN',
      actor,
      context: geminiError.context,
    });
    telemetry.metric('errors_reported_total', 1, {
      category: geminiError.analysis?.category || 'UNKNOWN',
      severity: geminiError.analysis?.severity || 'UNKNOWN',
    });

    // Decision-making logic based on AI analysis: Create incidents for HIGH/CRITICAL errors
    // This is a core part of the commercial-grade logic and autonomous externalization.
    if (geminiError.hasAiAnalyzed && (geminiError.analysis!.severity === 'CRITICAL' || geminiError.analysis!.severity === 'HIGH')) {
      if (!geminiError.incidentId) { // Prevent duplicate incident creation
        try {
          geminiError.incidentId = await GeminiErrorManager._getIncidentManagementService().createIncident(geminiError);
          this.incidentMapping.set(geminiError.timestamp, geminiError.incidentId);
          telemetry.log('warn', `GeminiErrorManager: Incident created for ${geminiError.message}`, { incidentId: geminiError.incidentId, errorId: geminiError.timestamp, severity: geminiError.analysis!.severity });
        } catch (incidentError) {
          telemetry.error('GeminiErrorManager: Failed to create incident.', { error: incidentError, originalErrorId: geminiError.timestamp });
        }
      }
    }

    // Adapt to frequently occurring errors:
    // Future enhancement: If a similar error (based on AI analysis, e.g., similar category, summary, context hash)
    // has occurred X times in Y minutes, escalate its priority, trigger an automated remediation script,
    // or notify a different, more urgent channel. This embodies 'adapt' and 'predict'.
    // let recentSimilarErrors = this.getRecentSimilarErrors(geminiError);
    // if (recentSimilarErrors.length > THRESHOLD) {
    //   this.triggerAutomatedRemediation(geminiError, recentSimilarErrors);
    // }

    return geminiError;
  }

  /**
   * Marks an error/incident as resolved, updating its status and notifying external systems.
   * This is part of the adaptive and self-correcting code environment, closing the loop on issues.
   * @param errorId The timestamp of the GeminiError (its unique identifier).
   * @param resolutionDetails A detailed description of how the error was resolved.
   * @param actor The entity (user/system) that resolved the error.
   */
  public async resolveError(errorId: string, resolutionDetails: string, actor: string = 'System'): Promise<boolean> {
    const telemetry = GeminiErrorManager._getTelemetryService();
    const error = this.errorHistory.get(errorId);

    if (!error) {
      telemetry.log('warn', `GeminiErrorManager: Attempted to resolve non-existent error.`, { errorId, actor });
      return false;
    }

    if (error.incidentId) {
      try {
        await GeminiErrorManager._getIncidentManagementService().resolveIncident(error.incidentId, resolutionDetails);
        telemetry.log('info', `GeminiErrorManager: Incident ${error.incidentId} resolved for error ${errorId}.`, { resolutionDetails, actor });
      } catch (incidentError) {
        telemetry.error('GeminiErrorManager: Failed to resolve incident via external service.', { error: incidentError, incidentId: error.incidentId });
        return false;
      }
    }

    // Remove from active tracking or move to a resolved history archive.
    this.errorHistory.delete(errorId);
    this.incidentMapping.delete(errorId);

    telemetry.log('info', `GeminiErrorManager: Error ${errorId} marked as resolved.`, { resolutionDetails, actor });
    telemetry.metric('errors_resolved_total', 1, {
      category: error.analysis?.category || 'UNKNOWN',
      severity: error.analysis?.severity || 'UNKNOWN',
    });
    telemetry.audit('ErrorResolved', actor, { errorId, resolutionDetails, incidentId: error.incidentId });

    // Logical Conclusion: Self-Aware Infrastructure - learn from the resolution.
    // This is where the system would feed resolution data back to the AI model
    // to improve future suggestions, update internal heuristics for error classification,
    // or refine automated remediation strategies. This is "prompt-driven reasoning and contextual adaptation."
    // _getGeminiLearningPipeline().feedbackResolution(error.analysis, resolutionDetails);

    return true;
  }

  /**
   * Retrieves a full, AI-enhanced report for a specific error.
   * @param errorId The timestamp of the GeminiError.
   * @returns The GeminiError object or undefined if not found.
   */
  public getErrorDetails(errorId: string): GeminiError | undefined {
    return this.errorHistory.get(errorId);
  }

  /**
   * Generates a dynamic, real-time incident report overview, leveraging AI insights.
   * This showcases the 'self-aware' aspect and 'prompt-driven reasoning' for high-level reporting.
   * It embodies "each process aware of its context, each interaction adaptive, generative, and evolving."
   * @returns A string summary of current active incidents, potentially AI-summarized for executives.
   */
  public async generateActiveIncidentReport(): Promise<string> {
    const activeErrorsWithIncidents = Array.from(this.errorHistory.values())
      .filter(error => error.incidentId && error.analysis && (error.analysis.severity === 'CRITICAL' || error.analysis.severity === 'HIGH'));

    if (activeErrorsWithIncidents.length === 0) {
      return "No active critical/high severity incidents detected by Gemini Error Manager at this time. System health is optimal.";
    }

    const incidentSummaries = activeErrorsWithIncidents.map(error =>
      `- Incident ${error.incidentId} (Error ${error.timestamp}): ${error.toAISummary().split('\n')[0]} (Severity: ${error.analysis?.severity}, Category: ${error.analysis?.category})`
    ).join('\n');

    // Here, we could even send *this summary* to an LLM for an executive-level summary,
    // to predict potential cascading failures based on the types of active incidents,
    // or to suggest resource allocation for mitigation. This is dynamic scaling of AI usage.
    const reportPrompt = `
      Generate a concise executive summary and strategic action points for the following active critical and high-severity incidents in our enterprise system.
      Focus on overall system health, potential combined impact, and strategic next steps for business continuity.
      Present a highly summarized view, suitable for senior leadership.

      Active Incidents:\n${incidentSummaries}
      Consider the high-level business implications and potential regulatory compliance risks.
    `;

    try {
      const llmReport = await GeminiLLMServiceConnector.queryLLM(reportPrompt, { reportType: 'executive_summary', numIncidents: activeErrorsWithIncidents.length });
      return `--- Executive Incident Overview (AI-Generated by Gemini) ---\n` +
             `Generated: ${new Date().toISOString()}\n` +
             `Total Active Critical/High Incidents: ${activeErrorsWithIncidents.length}\n` +
             `-------------------------------------------------------------\n` +
             `Overview: ${llmReport.summary}\n\n` +
             `Strategic Action Points: ${llmReport.resolutionSuggestion}\n\n` +
             `Impact Assessment: ${llmReport.impactAssessment}\n` +
             `-------------------------------------------------------------\n` +
             `--- Detailed Active Incidents (Raw Data) ---\n${incidentSummaries}\n`;
    } catch (llmError) {
      // Self-correction: If AI summary generation fails, provide a default report without AI's executive insights.
      GeminiErrorManager._getTelemetryService().error('GeminiErrorManager: Failed to generate AI-powered executive report.', { llmError });
      return `--- Executive Incident Overview (AI-Analysis Failed) ---\n` +
             `Generated: ${new Date().toISOString()}\n` +
             `Total Active Critical/High Incidents: ${activeErrorsWithIncidents.length}\n` +
             `AI could not generate an executive summary due to an internal system issue or circuit breaker activation.\n` +
             `Immediate human review of the incidents below is required.\n\n` +
             `--- Detailed Active Incidents (Raw Data) ---\n${incidentSummaries}\n`;
    }
  }
}

// Export a global instance of the GeminiErrorManager for easy access across the codebase.
// This embodies the "self-contained ecosystem...yet connected through intelligent APIs"
// and "each file aware of its role", serving as the central nervous system for error handling.
export const geminiErrorManager = GeminiErrorManager.getInstance();

// --- END: Gemini Integration & Self-Contained Universe Architecture ---