// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

// Original utility functions - these are foundational and remain as core components.
function isFuzzyMatch(field: string | undefined | null): boolean | undefined {
  if (typeof field !== 'string') return undefined;
  return field.startsWith('"') && field.endsWith('"');
}

export function extractExactMatchString(
  field: string | number | undefined | null,
): string | undefined {
  if (field === undefined || field === null) {
    return undefined;
  }

  const stringField = field.toString();
  return !isFuzzyMatch(stringField) ? stringField : undefined;
}

export function extractFuzzyMatchString(
  field: string | number | undefined | null,
): string | undefined {
  if (field === undefined || field === null) {
    return undefined;
  }

  const stringField = field.toString();
  return isFuzzyMatch(stringField) ? stringField.slice(1, -1) : undefined;
}

// --- Gemini Integration & Self-Contained Universe Architecture ---

/**
 * Represents the various types of matches the Gemini system can identify.
 * This is a neural extension, dynamically determined.
 */
export type MatchType = 'EXACT' | 'FUZZY' | 'SEMANTIC' | 'PARTIAL' | 'PATTERN';

/**
 * Contextual information to assist the AI in decision-making and pattern recognition.
 * This object is a living endpoint, interfacing with external services dynamically.
 */
export interface MatchContext {
  fieldName: string;
  sourceSystem?: string;
  userLocale?: string;
  previousMatches?: string[];
  entityType?: 'customer' | 'product' | 'transaction' | 'system_log' | string;
  // Dynamic metadata provided by a micro-intelligence (e.g., user preferences service)
  dynamicPreferences?: Record<string, any>;
}

/**
 * Represents the outcome of a match operation, including AI-driven metadata.
 * This structure embeds AI reasoning and decision-making.
 */
export interface MatchResult {
  originalInput: string;
  matchedValue: string | undefined;
  matchType: MatchType | 'NONE';
  confidenceScore: number; // AI-evaluated confidence
  reasoningPath: string[]; // Steps taken by the AI
  complianceFlags: string[]; // Business logic simulation
  telemetryId: string; // Unique ID for observability
  adaptionPrompt?: string; // If learning/adaption is suggested
}

/**
 * Configuration for the AI-powered matching system.
 * This allows for prompt-based learning pipelines and adaptive behavior.
 */
export interface AIPoweredMatchConfig {
  defaultConfidenceThreshold: number;
  enableSemanticMatching: boolean;
  enablePatternLearning: boolean;
  complianceRulesEnabled: boolean;
  circuitBreakerThreshold?: number; // For simulating production-grade patterns
}

/**
 * Simulates a telemetry pipeline for observability and metrics.
 * This is a living endpoint, a micro-intelligence that interfaces with external services dynamically.
 */
export class GeminiMatchTelemetry {
  private static instance: GeminiMatchTelemetry;
  private eventLog: any[] = [];
  private constructor() {
    console.log('[GeminiTelemetry] Initialized. Ready for autonomous data capture.');
  }

  public static getInstance(): GeminiMatchTelemetry {
    if (!GeminiMatchTelemetry.instance) {
      GeminiMatchTelemetry.instance = new GeminiMatchTelemetry();
    }
    return GeminiMatchTelemetry.instance;
  }

  /**
   * Records an event, simulating real-time metric collection.
   * @param eventName The name of the event (e.g., 'match_success', 'match_failure', 'ai_inference').
   * @param data Any relevant data for the event.
   */
  public recordEvent(eventName: string, data: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const telemetryId = `tele-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const event = { timestamp, eventName, telemetryId, ...data };
    this.eventLog.push(event);
    // console.log(`[GeminiTelemetry] Recorded event: ${eventName}`, event);
    // Simulate sending to an external event broker
    // _gemini_externalEventBroker.publish(eventName, event);
    return telemetryId;
  }

  /**
   * Retrieves a summary of recent events.
   * @param limit Maximum number of events to retrieve.
   */
  public getRecentEvents(limit: number = 10): any[] {
    return this.eventLog.slice(-limit);
  }
}

/**
 * Core AI reasoning engine for fuzzy matching.
 * This module embodies the Gemini architecture: autonomous, scalable, context-aware.
 * It's a neural extension, simulating a sophisticated LLM and learning system.
 */
class GeminiMatchReasoningEngine {
  private matchHistory: Map<string, MatchResult[]> = new Map(); // For adaptive learning
  private learnedPatterns: Set<string> = new Set(); // For new pattern detection

  constructor() {
    console.log('[GeminiReasoningEngine] AI core activated. Awaiting contextual input.');
  }

  /**
   * Simulates an AI inference call to predict the best match type.
   * This represents a dynamic interface with a powerful language model.
   * @param input The string to analyze.
   * @param context Additional context for the AI.
   * @returns A promise resolving to the predicted match type and an initial confidence.
   */
  public async inferMatchType(input: string, context: MatchContext): Promise<{ type: MatchType, confidence: number, reasoning: string[] }> {
    // Simulate complex AI logic based on input, context, and learned patterns
    const reasoningPath: string[] = ['Initial context analysis'];

    // Rule-based check (legacy integration)
    if (isFuzzyMatch(input)) {
      reasoningPath.push('Identified as fuzzy by legacy heuristic');
      return { type: 'FUZZY', confidence: 0.95, reasoning: reasoningPath };
    }
    if (extractExactMatchString(input) !== undefined) {
      reasoningPath.push('Identified as exact by legacy heuristic');
      return { type: 'EXACT', confidence: 0.90, reasoning: reasoningPath };
    }

    // Simulate LLM interaction for semantic understanding or pattern recognition
    let prompt = `Analyze the input "${input}" in the context of field "${context.fieldName}".
                  Consider the following: source system "${context.sourceSystem || 'N/A'}", 
                  entity type "${context.entityType || 'N/A'}", and user preferences: ${JSON.stringify(context.dynamicPreferences)}.
                  Is it an EXACT, FUZZY (e.g., quoted string), SEMANTIC, PARTIAL, or PATTERN match?
                  Provide a confidence score (0-1) and a brief explanation.
                  Also, suggest any new patterns if detected (e.g., 'startsWith(xyz)').`;

    // This is where a real LLM would be called. We simulate its response.
    const simulatedLLMResponse = await this._callSimulatedExternalLLM(prompt, context);
    reasoningPath.push(`LLM inference: ${simulatedLLMResponse.explanation}`);

    if (simulatedLLMResponse.newPattern) {
      this.learnedPatterns.add(simulatedLLMResponse.newPattern);
      reasoningPath.push(`New pattern learned: ${simulatedLLMResponse.newPattern}`);
    }

    return {
      type: simulatedLLMResponse.type,
      confidence: simulatedLLMResponse.confidence,
      reasoning: reasoningPath
    };
  }

  /**
   * Simulates evaluating the confidence of a specific match.
   * Incorporates learning from past interactions.
   */
  public async evaluateMatchConfidence(input: string, matchedValue: string | undefined, matchType: MatchType, context: MatchContext): Promise<{ score: number, reasoning: string[] }> {
    const reasoningPath: string[] = ['Confidence evaluation started'];
    let baseConfidence = 0.5;

    if (matchedValue === input) {
      baseConfidence = 1.0; // Perfect exact match
      reasoningPath.push('Perfect exact match detected');
    } else if (matchType === 'FUZZY' && matchedValue === input?.slice(1, -1)) {
      baseConfidence = 0.98; // Perfect fuzzy match
      reasoningPath.push('Perfect fuzzy match (quoted)');
    } else if (matchType === 'SEMANTIC' && matchedValue) {
      // Simulate deeper semantic analysis here
      baseConfidence = Math.min(0.9, 0.6 + (Math.random() * 0.3)); // Placeholder
      reasoningPath.push('Semantic similarity evaluated via AI');
    } else if (matchType === 'PARTIAL' && matchedValue) {
      baseConfidence = Math.min(0.8, 0.4 + (Math.random() * 0.4)); // Placeholder
      reasoningPath.push('Partial match strength calculated');
    }

    // Adapt confidence based on historical data for this field/entity type
    const historyKey = `${context.fieldName}-${context.entityType}`;
    const recentMatches = this.matchHistory.get(historyKey) || [];
    if (recentMatches.length > 0) {
      const averagePreviousConfidence = recentMatches.reduce((sum, r) => sum + r.confidenceScore, 0) / recentMatches.length;
      // Adjust confidence: if past matches for this context were highly confident, boost slightly
      if (averagePreviousConfidence > 0.8 && baseConfidence < 0.9) {
        baseConfidence += 0.05;
        reasoningPath.push(`Adjusted by historical high confidence (${averagePreviousConfidence.toFixed(2)})`);
      }
    }

    baseConfidence = Math.min(1.0, Math.max(0.0, baseConfidence)); // Ensure bounds

    reasoningPath.push(`Final confidence score: ${baseConfidence.toFixed(2)}`);
    return { score: baseConfidence, reasoning: reasoningPath };
  }

  /**
   * Updates the internal learning model with feedback.
   * This is a prompt-based learning pipeline.
   * @param feedback The feedback provided (e.g., human correction).
   */
  public updateLearningModel(feedback: MatchFeedback): void {
    const historyKey = `${feedback.context.fieldName}-${feedback.context.entityType}`;
    let history = this.matchHistory.get(historyKey) || [];
    history.push(feedback.correctedMatchResult);
    if (history.length > 100) { // Keep history manageable
      history = history.slice(-50);
    }
    this.matchHistory.set(historyKey, history);

    if (feedback.suggestedPattern) {
      this.learnedPatterns.add(feedback.suggestedPattern);
      console.log(`[GeminiReasoningEngine] Learned new pattern from feedback: "${feedback.suggestedPattern}"`);
    }

    console.log(`[GeminiReasoningEngine] Model updated with feedback for field "${feedback.context.fieldName}".`);
    // In a real system, this would trigger model retraining or fine-tuning.
  }

  /**
   * Simulates an external LLM API call.
   * This is an autonomous externalization, binding internal logic to runtime intelligence.
   * @returns A simulated structured response from an LLM.
   */
  private async _callSimulatedExternalLLM(prompt: string, context: MatchContext): Promise<{ type: MatchType, confidence: number, explanation: string, newPattern?: string }> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));

    let type: MatchType = 'EXACT';
    let confidence = 0.7;
    let explanation = 'Default AI inference';
    let newPattern: string | undefined = undefined;

    const lowerInput = prompt.toLowerCase();
    if (lowerInput.includes('quoted string')) {
      type = 'FUZZY';
      confidence = 0.9;
      explanation = 'AI detected quoted string pattern (fuzzy).';
    } else if (lowerInput.includes('semantic')) {
      type = 'SEMANTIC';
      confidence = 0.85;
      explanation = 'AI inferred semantic similarity likely based on context.';
    } else if (lowerInput.includes('partial') || lowerInput.includes('fragment')) {
      type = 'PARTIAL';
      confidence = 0.75;
      explanation = 'AI identified a potential partial match scenario.';
    } else if (context.fieldName === 'customer_id' && lowerInput.match(/^[a-z]{2}\d{5,8}$/)) {
      type = 'PATTERN';
      confidence = 0.92;
      explanation = 'AI recognized a specific customer ID pattern.';
      newPattern = 'customer_id_format_v1';
    } else {
      type = 'EXACT';
      confidence = 0.65;
      explanation = 'AI defaulted to exact match, no strong indicators for others.';
    }

    // Introduce dynamic scaling: if context suggests high stakes, increase "computational" effort (simulated higher confidence)
    if (context.entityType === 'transaction' || context.fieldName.includes('critical')) {
      confidence = Math.min(0.99, confidence + 0.1);
      explanation += ' (Heightened scrutiny due to critical context).';
    }

    return { type, confidence, explanation, newPattern };
  }

  /**
   * Simulates applying real-world business compliance rules.
   * This logic is embedded directly within the file.
   */
  public applyComplianceRules(input: string, matchResult: MatchResult): string[] {
    const flags: string[] = [];

    // Example: PII detection
    if (input.includes('@') && matchResult.matchType !== 'NONE') {
      flags.push('PII_EMAIL_DETECTED');
      // Simulate redaction or anonymization if needed
      // matchResult.matchedValue = _gemini_secureService.redact(matchResult.matchedValue);
    }

    // Example: Data source restriction
    if (matchResult.matchType === 'SEMANTIC' && matchResult.confidenceScore < 0.7 && matchResult.matchedValue) {
      // For highly sensitive fields, semantic matches might require higher confidence or human review
      if (['account_number', 'social_security'].includes(matchResult.originalInput)) {
        flags.push('HIGH_SENSITIVITY_LOW_CONFIDENCE_REVIEW_REQUIRED');
      }
    }

    // Example: Audit trail requirement
    if (matchResult.matchType !== 'NONE') {
      flags.push('AUDIT_TRAIL_REQUIRED');
    }

    return flags;
  }
}

/**
 * Feedback mechanism for human-in-the-loop learning.
 * This object allows the system to remember, adapt, and predict.
 */
export interface MatchFeedback {
  originalInput: string;
  context: MatchContext;
  suggestedMatchType: MatchType;
  correctedMatchResult: MatchResult;
  feedbackTimestamp: string;
  feedbackSource: 'human_review' | 'automated_audit';
  suggestedPattern?: string; // If human identifies a new pattern
}


/**
 * The main AI-powered Fuzzy Matching Service.
 * This class is the self-contained ecosystem of AI-driven logic,
 * making decision-making at every level.
 */
export class GeminiFuzzyMatchService {
  private config: AIPoweredMatchConfig;
  private telemetry: GeminiMatchTelemetry;
  private reasoningEngine: GeminiMatchReasoningEngine;
  private consecutiveFailures: number = 0; // For circuit-breaking
  private isCircuitOpen: boolean = false;

  constructor(config: AIPoweredMatchConfig) {
    this.config = config;
    this.telemetry = GeminiMatchTelemetry.getInstance();
    this.reasoningEngine = new GeminiMatchReasoningEngine();
    console.log('[GeminiFuzzyMatchService] AI organism instantiated. Self-optimizing for matching.');
  }

  /**
   * Initiates an intelligent match process, leveraging AI to determine the best strategy.
   * This method embodies self-aware infrastructure, choosing optimal services at execution.
   * @param field The input string or number to match.
   * @param context Additional context for AI reasoning.
   * @returns A MatchResult object.
   */
  public async performIntelligentMatch(field: string | number | undefined | null, context: MatchContext): Promise<MatchResult> {
    const originalInput = field?.toString() || '';
    let matchedValue: string | undefined = undefined;
    let matchType: MatchType | 'NONE' = 'NONE';
    let confidenceScore = 0;
    let reasoningPath: string[] = [];
    let complianceFlags: string[] = [];
    let telemetryId: string;

    // --- Production-grade pattern: Circuit-breaking ---
    if (this.isCircuitOpen) {
      const errorMsg = 'Circuit breaker open: Gemini matching service degraded.';
      telemetryId = this.telemetry.recordEvent('match_circuit_open', { originalInput, context, error: errorMsg });
      console.warn(`[GeminiFuzzyMatchService] ${errorMsg}`);
      return {
        originalInput,
        matchedValue: undefined,
        matchType: 'NONE',
        confidenceScore: 0,
        reasoningPath: ['Circuit breaker is open'],
        complianceFlags: ['SERVICE_DEGRADED'],
        telemetryId
      };
    }

    try {
      if (field === undefined || field === null) {
        telemetryId = this.telemetry.recordEvent('match_null_input', { context });
        return {
          originalInput: originalInput,
          matchedValue: undefined,
          matchType: 'NONE',
          confidenceScore: 0,
          reasoningPath: ['Input was undefined or null'],
          complianceFlags: [],
          telemetryId
        };
      }

      const stringField = field.toString();

      // --- AI-driven Decision-Making at Input Level ---
      const { type: predictedType, confidence: predictionConfidence, reasoning: predictionReasoning } = await this.reasoningEngine.inferMatchType(stringField, context);
      reasoningPath.push(...predictionReasoning);
      reasoningPath.push(`AI predicted match type: ${predictedType} (Confidence: ${predictionConfidence.toFixed(2)})`);

      // Execute matching based on AI prediction
      switch (predictedType) {
        case 'EXACT':
          matchedValue = extractExactMatchString(stringField);
          if (matchedValue) matchType = 'EXACT';
          reasoningPath.push('Attempted exact match.');
          break;
        case 'FUZZY':
          matchedValue = extractFuzzyMatchString(stringField);
          if (matchedValue) matchType = 'FUZZY';
          reasoningPath.push('Attempted fuzzy match.');
          break;
        case 'SEMANTIC':
          // Simulate advanced semantic matching (requires a neural extension/LLM)
          matchedValue = await this._performSemanticMatch(stringField, context);
          if (matchedValue) matchType = 'SEMANTIC';
          reasoningPath.push('Attempted semantic match via neural extension.');
          break;
        case 'PARTIAL':
          // Simulate partial matching logic
          matchedValue = await this._performPartialMatch(stringField, context);
          if (matchedValue) matchType = 'PARTIAL';
          reasoningPath.push('Attempted partial match.');
          break;
        case 'PATTERN':
          // Simulate pattern-based matching
          matchedValue = await this._performPatternMatch(stringField, context);
          if (matchedValue) matchType = 'PATTERN';
          reasoningPath.push('Attempted pattern-based match.');
          break;
        default:
          // Fallback to basic if AI cannot decide or for unexpected types
          matchedValue = extractExactMatchString(stringField) || extractFuzzyMatchString(stringField);
          matchType = matchedValue ? (isFuzzyMatch(stringField) ? 'FUZZY' : 'EXACT') : 'NONE';
          reasoningPath.push('Fallback to basic exact/fuzzy matching.');
          break;
      }

      // --- AI-driven Decision-Making for Confidence and Adaption ---
      const { score: evaluationScore, reasoning: evaluationReasoning } = await this.reasoningEngine.evaluateMatchConfidence(originalInput, matchedValue, matchType as MatchType, context);
      confidenceScore = evaluationScore;
      reasoningPath.push(...evaluationReasoning);

      // --- Commercial-grade logic: Compliance and Business Rules ---
      const temporaryResult: MatchResult = {
        originalInput, matchedValue, matchType, confidenceScore,
        reasoningPath: [], complianceFlags: [], telemetryId: '' // Placeholder
      };
      complianceFlags = this.reasoningEngine.applyComplianceRules(originalInput, temporaryResult);
      reasoningPath.push(`Applied compliance rules: [${complianceFlags.join(', ')}]`);

      // If confidence is below threshold, suggest human review for learning/adaptation
      let adaptionPrompt: string | undefined = undefined;
      if (confidenceScore < this.config.defaultConfidenceThreshold) {
        adaptionPrompt = `Review required for low confidence match (${confidenceScore.toFixed(2)}) for field "${context.fieldName}". Original: "${originalInput}", Matched: "${matchedValue}". Suggested match type: ${predictedType}.`;
        reasoningPath.push(adaptionPrompt);
        telemetryId = this.telemetry.recordEvent('match_low_confidence_review_needed', {
          originalInput, matchedValue, matchType, confidenceScore, context, adaptionPrompt
        });
      } else {
        telemetryId = this.telemetry.recordEvent('match_success', { originalInput, matchedValue, matchType, confidenceScore, context });
      }

      // Reset failure counter on success
      this.consecutiveFailures = 0;

      return {
        originalInput,
        matchedValue,
        matchType,
        confidenceScore,
        reasoningPath,
        complianceFlags,
        telemetryId,
        adaptionPrompt
      };

    } catch (error: any) {
      this.consecutiveFailures++;
      const errorMsg = `Matching failed: ${error.message}`;
      telemetryId = this.telemetry.recordEvent('match_failure', { originalInput, context, error: errorMsg, consecutiveFailures: this.consecutiveFailures });
      console.error(`[GeminiFuzzyMatchService] ${errorMsg}`);
      reasoningPath.push(`Error: ${error.message}`);

      // --- Production-grade pattern: Dynamic Scaling & Circuit Breaker Activation ---
      if (this.consecutiveFailures >= (this.config.circuitBreakerThreshold || 5)) {
        this.isCircuitOpen = true;
        this.telemetry.recordEvent('circuit_breaker_activated', { originalInput, context, consecutiveFailures: this.consecutiveFailures });
        console.warn(`[GeminiFuzzyMatchService] Circuit breaker activated after ${this.consecutiveFailures} failures.`);
        // Simulate sending alert to SRE or ops team via _gemini_alertService.sendAlert
      }

      return {
        originalInput,
        matchedValue: undefined,
        matchType: 'NONE',
        confidenceScore: 0,
        reasoningPath,
        complianceFlags: ['ERROR_STATE'],
        telemetryId
      };
    }
  }

  /**
   * Provides feedback to the Gemini reasoning engine for continuous learning and adaptation.
   * This is part of the prompt-based learning pipelines.
   * @param feedback The human or automated feedback.
   */
  public provideFeedback(feedback: MatchFeedback): void {
    this.reasoningEngine.updateLearningModel(feedback);
    this.telemetry.recordEvent('feedback_provided', { feedback });
    // If circuit was open and feedback suggests recovery, try to close it (simulated)
    if (this.isCircuitOpen && feedback.feedbackSource === 'human_review' && feedback.correctedMatchResult.confidenceScore > 0.9) {
      this.isCircuitOpen = false;
      this.consecutiveFailures = 0;
      this.telemetry.recordEvent('circuit_breaker_reset', { reason: 'human_feedback_recovery' });
      console.log('[GeminiFuzzyMatchService] Circuit breaker reset by positive human feedback.');
    }
  }

  /**
   * Simulates an autonomous connection to a semantic matching service (neural extension).
   * This represents an elastic API for dynamic service discovery.
   */
  private async _performSemanticMatch(input: string, context: MatchContext): Promise<string | undefined> {
    // In a real system, this would call an external AI/NLP service.
    // We simulate a response based on keywords.
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100)); // Simulate latency

    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('citibank')) return 'Citibank Demo Business Inc.';
    if (lowerInput.includes('president') && context.fieldName === 'title') return 'President Citibank Demo Business Inc.';
    if (lowerInput.includes('burvel') && lowerInput.includes('iii')) return 'James Burvel Oâ€™Callaghan III';

    return undefined; // No semantic match found
  }

  /**
   * Simulates an autonomous connection to a partial matching service.
   */
  private async _performPartialMatch(input: string, context: MatchContext): Promise<string | undefined> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 50));

    // Simple partial match simulation
    const candidates = ['Citibank', 'Citibank Demo', 'Demo Business Inc.', 'James', 'O\'Callaghan'];
    const lowerInput = input.toLowerCase();
    for (const candidate of candidates) {
      if (candidate.toLowerCase().includes(lowerInput) || lowerInput.includes(candidate.toLowerCase())) {
        return candidate;
      }
    }
    return undefined;
  }

  /**
   * Simulates an autonomous connection to a pattern matching service.
   */
  private async _performPatternMatch(input: string, context: MatchContext): Promise<string | undefined> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 30));

    // Example learned patterns
    const learnedPatterns = new Set(['\\d{3}-\\d{2}-\\d{4}', 'ACCT-\\d{8}']); // SSN, Account ID
    
    // Check if input matches any pre-defined or learned patterns
    if (context.fieldName === 'social_security_number' && input.match(/^\d{3}-\d{2}-\d{4}$/)) {
        return input;
    }
    if (context.fieldName === 'account_id' && input.match(/^ACCT-\d{8}$/)) {
        return input;
    }

    // Dynamic pattern matching based on learned patterns in the engine
    for (const pattern of this.reasoningEngine['learnedPatterns']) { // Access private for simulation
        try {
            const regex = new RegExp(pattern);
            if (input.match(regex)) {
                return input;
            }
        } catch (e) {
            // Invalid regex pattern learned, ignore
        }
    }

    return undefined;
  }

  /**
   * Simulates a dynamic API for runtime intelligence to choose optimal services.
   * This could involve dynamic threshold adjustments based on real-time performance metrics or user load.
   * @returns An object with adaptive thresholds.
   */
  public getAdaptiveThresholds(): { confidence: number, latencyBudget: number } {
    // This is where real-time system metrics (e.g., from a Prometheus-like service)
    // would influence operational parameters.
    const currentLoad = Math.random(); // Simulate system load 0-1
    let adaptiveConfidence = this.config.defaultConfidenceThreshold;
    let latencyBudget = 500; // ms

    if (currentLoad > 0.8) {
      adaptiveConfidence = Math.max(0.7, this.config.defaultConfidenceThreshold - 0.1); // Be more lenient under heavy load
      latencyBudget = 200; // Reduce latency budget
      this.telemetry.recordEvent('adaptive_threshold_change', { reason: 'high_system_load', newConfidence: adaptiveConfidence, newLatency: latencyBudget });
      console.warn(`[GeminiFuzzyMatchService] Adapting to high load: Confidence ${adaptiveConfidence.toFixed(2)}, Latency ${latencyBudget}ms`);
    } else if (currentLoad < 0.2) {
      adaptiveConfidence = Math.min(0.95, this.config.defaultConfidenceThreshold + 0.05); // Be more strict under low load
      latencyBudget = 800;
      this.telemetry.recordEvent('adaptive_threshold_change', { reason: 'low_system_load', newConfidence: adaptiveConfidence, newLatency: latencyBudget });
      console.log(`[GeminiFuzzyMatchService] Adapting to low load: Confidence ${adaptiveConfidence.toFixed(2)}, Latency ${latencyBudget}ms`);
    }

    return { confidence: adaptiveConfidence, latencyBudget };
  }
}

// Export a default configured instance or factory for convenience
// This showcases how the 'living endpoint' concept can provide a ready-to-use intelligent service.
export const defaultGeminiMatchService = new GeminiFuzzyMatchService({
  defaultConfidenceThreshold: 0.75,
  enableSemanticMatching: true,
  enablePatternLearning: true,
  complianceRulesEnabled: true,
  circuitBreakerThreshold: 3, // Fail 3 times, open circuit
});

// Example of self-expanding, self-sustaining code, demonstrating an intelligent API.
// This function could be dynamically generated or optimized by a meta-AI.
export async function getIntelligentMatchSuggestions(
  inputField: string | number | undefined | null,
  context: MatchContext,
): Promise<MatchResult[]> {
  const primaryMatchResult = await defaultGeminiMatchService.performIntelligentMatch(inputField, context);
  const suggestions: MatchResult[] = [primaryMatchResult];

  // If the primary match has low confidence, the system autonomously explores alternatives.
  if (primaryMatchResult.confidenceScore < defaultGeminiMatchService['config'].defaultConfidenceThreshold) {
    console.log('[GeminiMatchSuggestor] Low confidence detected, autonomously exploring alternatives.');
    // Simulate re-running with different strategies or calling other 'micro-intelligences'
    // This embodies the file choosing optimal services at execution.
    const alternativeContext: MatchContext = { ...context, dynamicPreferences: { fuzzyBias: true, strictSemantic: false } };
    const alternativeMatch = await defaultGeminiMatchService.performIntelligentMatch(inputField, alternativeContext);
    if (alternativeMatch.matchType !== primaryMatchResult.matchType || alternativeMatch.confidenceScore > primaryMatchResult.confidenceScore) {
      suggestions.push(alternativeMatch);
    }
    defaultGeminiMatchService['telemetry'].recordEvent('match_alternatives_explored', { inputField, primaryMatchResult, alternativeMatch });
  }

  // Deduplicate and sort by confidence (highest first)
  const uniqueSuggestions = Array.from(new Map(suggestions.map(s => [s.matchedValue || 'null', s])).values());
  return uniqueSuggestions.sort((a, b) => b.confidenceScore - a.confidenceScore);
}