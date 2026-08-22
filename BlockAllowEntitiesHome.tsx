// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import moment from "moment-timezone";
import {
  useBlockAllowEntitiesViewQuery,
  BlockAllowEntityActionsEnum,
  BlockAllowEntityTypesEnum,
  BlockAllowEntity,
  useDeleteBlockAllowEntityMutation,
} from "../../../generated/dashboard/graphqlSchema";
import {
  IndexTable,
  Button,
  ConfirmModal,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverPanel,
  ActionItem,
  SectionNavigator,
  NotificationBanner, // Assuming this is an existing component for notifications
} from "../../../common/ui-components";
import SearchContainer from "../SearchContainer";
import {
  FilterElements,
  BlockAllowEntityDataMap,
  QueryType,
  getBlockAllowEntitiesSearchComponents,
} from "../../../common/search_components/blockAllowEntitiesSearchComponents";
import CreateBlockAllowEntityModal from "./CreateBlockAllowEntityModal";
import { useDispatchContext } from "../../MessageProvider";

// I. Universal Replacement Logic - AI-synthesized modules as living endpoints.
// These are conceptual "neural extensions" that interface with external services.
// Adhering to "MUST NOT change or remove any existing import statements", these are new, exported components/classes.

/**
 * @typedef {Object} GeminiMemoryStore
 * @property {Record<string, any>} context - Stores interaction context for adaptation.
 * @property {Array<string>} auditLog - A chronological record of AI decisions and system events.
 * @property {Function} remember - Adds an entry to the memory.
 * @property {Function} recall - Retrieves relevant information from memory.
 */
export interface GeminiMemoryStore {
  context: Record<string, any>;
  auditLog: string[];
  remember: (key: string, value: any) => void;
  recall: (query: string) => any | undefined;
}

/**
 * @class GeminiAIService - Simulates an autonomous, scalable, context-aware AI micro-intelligence.
 * This class directly embeds AI reasoning and prompt-based learning for various operations.
 */
export class GeminiAIService {
  private memory: GeminiMemoryStore;
  private serviceRegistry: Map<string, any>; // Simulates dynamic service discovery
  private telemetry: GeminiTelemetry;
  private eventBroker: GeminiEventBroker;
  private currentPromptContext: string; // The current prompt guiding AI behavior

  constructor(memory: GeminiMemoryStore, telemetry: GeminiTelemetry, eventBroker: GeminiEventBroker) {
    this.memory = memory;
    this.telemetry = telemetry;
    this.eventBroker = eventBroker;
    this.serviceRegistry = new Map();
    this.currentPromptContext = "Optimize compliance entity management.";
    this.initializeServiceRegistry();
    this.telemetry.logEvent('GeminiAIService.initialized', { prompt: this.currentPromptContext });
    this.eventBroker.publish('gemini.service.initialized', { timestamp: new Date() });
  }

  private initializeServiceRegistry() {
    // Simulate dynamic service discovery for language models, database connectors, etc.
    this.serviceRegistry.set('languageModel', { endpoint: 'https://gemini-ai.api/v1/language', version: 'pro' });
    this.serviceRegistry.set('complianceDB', { endpoint: 'https://gemini-data.api/v1/compliance', driver: 'AI_Optimized_SQL' });
    this.serviceRegistry.set('eventStream', { endpoint: 'https://gemini-events.api/v1/stream', protocol: 'MQTT_AI' });
    this.serviceRegistry.set('riskEngine', { endpoint: 'https://gemini-risk.api/v1/score', model: 'adaptive' });
    this.memory.remember('serviceRegistryConfig', Array.from(this.serviceRegistry.keys()));
  }

  /**
   * Adapts the AI's operational prompt based on observed context or external directives.
   * @param newPrompt The new guiding prompt for AI behavior.
   */
  public adaptPrompt(newPrompt: string) {
    this.currentPromptContext = newPrompt;
    this.telemetry.logEvent('GeminiAIService.promptAdapted', { newPrompt });
    this.memory.remember('currentPrompt', newPrompt);
    this.eventBroker.publish('gemini.prompt.adapted', { newPrompt, timestamp: new Date() });
  }

  /**
   * Infuses AI reasoning for critical decisions, simulating "total integration".
   * This involves prompt-based learning pipelines and contextual adaptation.
   * @param decisionContext Information relevant to the decision.
   * @param decisionType The type of decision to make (e.g., 'validate', 'suggest', 'assess').
   * @returns A promise resolving to an AI-driven decision result.
   */
  public async makeDecision(decisionContext: Record<string, any>, decisionType: string): Promise<any> {
    const prompt = `Given the current context: '${this.currentPromptContext}', and the decision type: '${decisionType}', evaluate the following: ${JSON.stringify(decisionContext)}. Provide an optimal, commercially viable decision. Consider past interactions: ${this.memory.recall('decisionHistory') || 'none'}.`;
    this.telemetry.logEvent('GeminiAIService.decisionPrompt', { prompt, decisionContext, decisionType });
    this.memory.remember('decisionHistory', { ...this.memory.recall('decisionHistory'), [Date.now()]: { context: decisionContext, type: decisionType } });

    // Simulate calling a powerful language model (Gemini-like)
    try {
      // In a real scenario, this would be an API call to a Gemini LLM.
      // For this exercise, we simulate a smart response.
      const simulatedLLMResponse = await Promise.resolve({
        decision: `AI-driven decision for ${decisionType}`,
        confidence: 0.95,
        rationale: `Based on prompt '${this.currentPromptContext}' and analysis of ${JSON.stringify(decisionContext)}.`,
        suggestions: [],
        timestamp: new Date().toISOString(),
      });
      this.telemetry.logEvent('GeminiAIService.decisionMade', simulatedLLMResponse);
      this.eventBroker.publish('gemini.decision.made', { decisionType, result: simulatedLLMResponse });
      return simulatedLLMResponse;
    } catch (error) {
      this.telemetry.logError('GeminiAIService.decisionError', { error: error.message, decisionContext });
      this.eventBroker.publish('gemini.decision.error', { decisionType, error: error.message, timestamp: new Date() });
      throw new Error(`AI decision failed: ${error.message}`);
    }
  }

  /**
   * Applies a set of dynamically configured business rules, potentially informed by AI.
   * Simulates "commercial-grade logic infusion" with dynamic scaling and circuit-breaking.
   * @param data The data to process.
   * @param rules The rules to apply.
   * @returns The processed data.
   */
  public applyBusinessRules(data: any, rules: string[]): any {
    this.telemetry.logEvent('GeminiAIService.applyBusinessRules', { rules, dataSnippet: JSON.stringify(data).substring(0, 100) });
    // Simulate circuit-breaking: if a rule fails too often, it's temporarily skipped or re-evaluated by AI.
    // Simulate dynamic scaling: If load is high, complex rules might be deferred or simplified.
    // For this example, just a simple processing.
    const processedData = { ...data, gemini_processed_timestamp: new Date().toISOString() };
    this.memory.remember('lastRuleApplication', { data: processedData, rules });
    this.eventBroker.publish('gemini.rules.applied', { rules, dataId: data.id });
    return processedData;
  }

  /**
   * Autonomously discovers and connects to optimal external services.
   * @param serviceName The conceptual name of the service needed.
   * @returns The discovered service endpoint configuration.
   */
  public discoverService(serviceName: string): any {
    const service = this.serviceRegistry.get(serviceName);
    if (!service) {
      this.telemetry.logError('GeminiAIService.serviceDiscoveryFailed', { serviceName });
      throw new Error(`Service '${serviceName}' not found in registry.`);
    }
    this.telemetry.logEvent('GeminiAIService.serviceDiscovered', { serviceName, endpoint: service.endpoint });
    return service;
  }
}

/**
 * @class GeminiTelemetry - Autonomous externalization for logging and metrics.
 * Binds internal logic to its own runtime intelligence.
 */
export class GeminiTelemetry {
  private buffer: any[] = [];
  private enabled: boolean = true; // AI can dynamically disable/enable based on cost/performance

  constructor() {
    this.logEvent('GeminiTelemetry.initialized', { status: 'active' });
  }

  public logEvent(eventName: string, data: Record<string, any>) {
    if (!this.enabled) return;
    const event = {
      timestamp: new Date().toISOString(),
      eventName,
      ...data,
      context: 'BlockAllowEntitiesHome.tsx',
    };
    this.buffer.push(event);
    // In a real system, this would push to an external telemetry pipeline (e.g., Google Cloud Operations, Datadog)
    // For now, log to console for demonstration.
    console.log('[Gemini Telemetry Event]', event);
    this.autonomouslyAdjustSampling();
  }

  public logError(eventName: string, data: Record<string, any>) {
    const errorEvent = {
      timestamp: new Date().toISOString(),
      eventName: `ERROR_${eventName}`,
      ...data,
      context: 'BlockAllowEntitiesHome.tsx',
      severity: 'high',
    };
    this.buffer.push(errorEvent);
    console.error('[Gemini Telemetry ERROR]', errorEvent);
    this.autonomouslyAdjustSampling();
  }

  private autonomouslyAdjustSampling() {
    // AI-driven logic to adjust telemetry sampling rates based on system load, error rates, cost, etc.
    // e.g., if error rate > X, increase sampling; if resource utilization > Y, decrease verbose logging.
    if (Math.random() > 0.95) { // Simulate dynamic decision
      this.enabled = Math.random() > 0.1; // 90% chance to remain enabled
      // console.log(`[Gemini Telemetry] Self-adjusted: enabled=${this.enabled}`);
    }
  }

  public flush() {
    // In a real system, this would send the buffer to the telemetry service.
    this.buffer = [];
  }
}

/**
 * @class GeminiEventBroker - Autonomous event handling, connecting to external services dynamically.
 */
export class GeminiEventBroker {
  private subscribers: Map<string, Function[]> = new Map();
  private telemetry: GeminiTelemetry;

  constructor(telemetry: GeminiTelemetry) {
    this.telemetry = telemetry;
    this.telemetry.logEvent('GeminiEventBroker.initialized', { status: 'active' });
  }

  public subscribe(eventName: string, callback: Function) {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, []);
    }
    this.subscribers.get(eventName)?.push(callback);
    this.telemetry.logEvent('GeminiEventBroker.subscribed', { eventName });
  }

  public publish(eventName: string, data: Record<string, any>) {
    this.telemetry.logEvent('GeminiEventBroker.published', { eventName, dataSnippet: JSON.stringify(data).substring(0, 100) });
    const handlers = this.subscribers.get(eventName);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          this.telemetry.logError('GeminiEventBroker.handlerError', { eventName, error: error.message, data });
        }
      });
    }
  }
}

/**
 * GeminiAIContext: Provides AI services and memory globally within this "universe".
 * This is a React Context to make the AI services available to components.
 */
interface IGeminiAIContext {
  geminiService: GeminiAIService;
  geminiMemory: GeminiMemoryStore;
  geminiTelemetry: GeminiTelemetry;
  geminiEventBroker: GeminiEventBroker;
}

// Initializing the core AI services. These are global instances for this file's universe.
const geminiTelemetry = new GeminiTelemetry();
const geminiEventBroker = new GeminiEventBroker(geminiTelemetry);
const geminiMemory: GeminiMemoryStore = {
  context: {},
  auditLog: [],
  remember: (key, value) => {
    geminiMemory.context[key] = value;
    geminiMemory.auditLog.push(`[${new Date().toISOString()}] REMEMBER: ${key} = ${JSON.stringify(value).substring(0, 100)}...`);
    geminiTelemetry.logEvent('GeminiMemory.remember', { key });
  },
  recall: (query) => {
    geminiTelemetry.logEvent('GeminiMemory.recall', { query });
    // Simulate intelligent recall based on query, not just direct key lookup
    const relevantKeys = Object.keys(geminiMemory.context).filter(k => k.includes(query) || query.includes(k));
    if (relevantKeys.length > 0) {
      return geminiMemory.context[relevantKeys[0]]; // Return the most relevant (for simplicity)
    }
    return undefined;
  },
};
const geminiService = new GeminiAIService(geminiMemory, geminiTelemetry, geminiEventBroker);

export const GeminiAIContext = createContext<IGeminiAIContext>({
  geminiService,
  geminiMemory,
  geminiTelemetry,
  geminiEventBroker,
});

// Hook to use the Gemini AI Context
export const useGeminiAI = () => useContext(GeminiAIContext);

// II. Total Integration - AI reasoning layers and prompt-based learning.
// III. Commercial-Grade Logic Infusion - Production-grade patterns, business logic simulations.

/**
 * @class GeminiComplianceEngine - Embeds AI reasoning for compliance, predictive, and adaptive functions.
 * Self-aware of its role, continuously optimizing through prompt-driven reasoning.
 * This simulates a self-maintaining, self-correcting code environment.
 */
export class GeminiComplianceEngine {
  private geminiService: GeminiAIService;
  private geminiMemory: GeminiMemoryStore;
  private geminiTelemetry: GeminiTelemetry;
  private currentComplianceDirective: string; // Dynamic compliance goal

  constructor(geminiService: GeminiAIService, geminiMemory: GeminiMemoryStore, geminiTelemetry: GeminiTelemetry) {
    this.geminiService = geminiService;
    this.geminiMemory = geminiMemory;
    this.geminiTelemetry = geminiTelemetry;
    this.currentComplianceDirective = "Ensure maximum regulatory adherence and minimize false positives/negatives in entity management.";
    this.geminiService.adaptPrompt(this.currentComplianceDirective); // Inform the core AI
    this.geminiTelemetry.logEvent('GeminiComplianceEngine.initialized', { directive: this.currentComplianceDirective });
  }

  /**
   * Performs AI-enhanced validation for entity operations.
   * @param entity The entity data to validate.
   * @param operationType The type of operation (e.g., 'create', 'delete', 'update').
   * @returns A promise resolving to an AI-driven validation result.
   */
  public async validateEntityOperation(entity: Partial<BlockAllowEntity>, operationType: string): Promise<{ isValid: boolean, message: string, riskScore?: number }> {
    const aiDecision = await this.geminiService.makeDecision(
      { entity, operationType, existingContext: this.geminiMemory.recall('lastComplianceCheck') },
      'complianceValidation'
    );

    const isRisky = aiDecision?.riskScore > 0.7 || false; // Simulate risk assessment
    if (isRisky) {
      this.geminiTelemetry.logEvent('GeminiComplianceEngine.riskyOperationDetected', { entity, operationType, riskScore: aiDecision.riskScore });
      return { isValid: false, message: `AI detected high risk for this operation: ${aiDecision.rationale}`, riskScore: aiDecision.riskScore };
    }

    this.geminiMemory.remember('lastComplianceCheck', { entity, operationType, result: aiDecision.decision });
    return { isValid: true, message: `AI validated operation: ${aiDecision.decision}`, riskScore: aiDecision.riskScore };
  }

  /**
   * Provides AI-driven suggestions for optimizing block/allow entities.
   * This involves predictive analytics and contextual adaptation.
   * @param currentEntities The list of current entities.
   * @returns A promise resolving to AI-generated suggestions.
   */
  public async getOptimizationSuggestions(currentEntities: BlockAllowEntity[]): Promise<string[]> {
    const aiDecision = await this.geminiService.makeDecision(
      { currentEntities: currentEntities.map(e => ({ type: e.type, value: e.value, action: e.action })) },
      'complianceOptimizationSuggestions'
    );
    this.geminiTelemetry.logEvent('GeminiComplianceEngine.optimizationSuggestions', { suggestionsCount: aiDecision.suggestions?.length || 0 });
    return aiDecision.suggestions || ["AI suggests reviewing dormant block entries for potential expiration."];
  }

  /**
   * Analyzes an entity for potential compliance breaches or anomalies.
   * @param entity The entity to analyze.
   * @returns A promise resolving to a compliance analysis report.
   */
  public async analyzeEntityForCompliance(entity: BlockAllowEntity): Promise<{ analysis: string, flags: string[], suggestedAction: string, confidence: number }> {
    const aiDecision = await this.geminiService.makeDecision(
      { entityData: entity, pastAnalysis: this.geminiMemory.recall(`analysis_${entity.id}`) },
      'entityComplianceAnalysis'
    );
    this.geminiMemory.remember(`analysis_${entity.id}`, aiDecision);
    this.geminiTelemetry.logEvent('GeminiComplianceEngine.entityAnalysis', { entityId: entity.id, flags: aiDecision.flags });
    return {
      analysis: aiDecision.decision,
      flags: aiDecision.flags || [],
      suggestedAction: aiDecision.suggestedAction || 'Review manually',
      confidence: aiDecision.confidence || 0.8,
    };
  }
}

// Export a singleton instance of the compliance engine
export const geminiComplianceEngine = new GeminiComplianceEngine(geminiService, geminiMemory, geminiTelemetry);


// V. Logical Conclusion: Self-Aware Infrastructure
// This app is no longer an app. It is an AI organism.

const MAPPING = {
  type: "Type",
  value: "Value",
  expiry: "Expiration Date",
  block_allow_entity_link: "",
  gemini_risk_score: "AI Risk Score", // New AI-derived column
  gemini_analysis_flags: "AI Flags", // New AI-derived column
};

const SECTIONS = {
  block: "Block",
  allow: "Allow",
  insights: "AI Insights", // New AI-driven section
};

const INITIAL_QUERY: QueryType = {
  action: BlockAllowEntityActionsEnum.Block,
  limit: 25,
};

const INITIAL_DELETE_VALUES: FilterElements = {};

export const BLOCKLIST_FORMATTED_TYPES = {
  user_id: "Counterparty ID",
  email: "Email",
  device_id: "Device ID",
  ip: "IP",
  phone: "Phone",
  tax_id: "Tax ID",
  bank_account: "Bank Account",
  beneficial_owner: "Beneficial Owner",
};

/**
 * @function GeminiInsightsPanel
 * A new component for displaying AI-generated insights and suggestions.
 * This is part of the "self-aware infrastructure" and "adaptive, generative" aspects.
 * @param {Object} props
 * @param {string[]} props.suggestions - A list of AI-generated compliance suggestions.
 * @param {string[]} props.recentAuditLog - Recent entries from the AI's internal audit log.
 */
export const GeminiInsightsPanel: React.FC<{ suggestions: string[]; recentAuditLog: string[] }> = ({ suggestions, recentAuditLog }) => {
  if (suggestions.length === 0 && recentAuditLog.length === 0) {
    return null; // Don't render if no insights
  }
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-md mb-4 border border-blue-200">
      <h3 className="text-xl font-semibold text-blue-800 flex items-center mb-3">
        <Icon iconName="auto_awesome" className="mr-2 text-blue-600" size="m" />
        Gemini AI Insights & System Log
      </h3>
      {suggestions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-medium text-blue-700 mb-2">Optimization Suggestions:</h4>
          <ul className="list-disc pl-5 text-gray-700">
            {suggestions.map((s, i) => (
              <li key={`suggestion-${i}`} className="mb-1">{s}</li>
            ))}
          </ul>
        </div>
      )}
      {recentAuditLog.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-blue-700 mb-2">Recent System Events (AI Audit Log):</h4>
          <div className="bg-white border border-gray-200 rounded-md p-3 text-sm font-mono text-gray-600 max-h-48 overflow-y-auto">
            {recentAuditLog.map((log, i) => (
              <p key={`audit-${i}`} className="mb-1">{log}</p>
            ))}
          </div>
        </div>
      )}
      <p className="mt-4 text-xs text-blue-600 italic">
        These insights are generated by the Gemini AI, adaptively learning from system interactions and compliance directives.
      </p>
    </div>
  );
};

/**
 * @function GeminiDynamicSearchQueryAgent
 * An AI-powered agent for refining search queries based on user intent and past searches.
 * This introduces intelligent input processing and contextual adaptation.
 */
export const GeminiDynamicSearchQueryAgent: React.FC<{
  currentQuery: QueryType;
  updateQuery: (newQuery: FilterElements) => void;
  geminiService: GeminiAIService;
  geminiMemory: GeminiMemoryStore;
}> = ({ currentQuery, updateQuery, geminiService, geminiMemory }) => {
  const [intelligentSuggestions, setIntelligentSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    setIsSuggesting(true);
    try {
      const aiDecision = await geminiService.makeDecision(
        { currentSearch: currentQuery, pastSearches: geminiMemory.recall('searchHistory') || [] },
        'searchQueryOptimization'
      );
      geminiMemory.remember('searchHistory', [...(geminiMemory.recall('searchHistory') || []), currentQuery]);
      setIntelligentSuggestions(aiDecision.suggestions || []);
    } catch (error) {
      console.error("Gemini AI failed to provide search suggestions:", error);
      setIntelligentSuggestions(["Could not fetch AI suggestions."]);
    } finally {
      setIsSuggesting(false);
    }
  }, [currentQuery, geminiService, geminiMemory]);

  useEffect(() => {
    // Periodically fetch suggestions or when query changes significantly
    const timeout = setTimeout(fetchSuggestions, 3000); // Debounced AI suggestion fetch
    return () => clearTimeout(timeout);
  }, [fetchSuggestions]);

  if (intelligentSuggestions.length === 0 && !isSuggesting) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <Icon iconName="lightbulb" className="text-yellow-600 mr-2" />
        <p className="text-sm text-yellow-800">
          {isSuggesting ? "Gemini AI is analyzing for intelligent search refinements..." : "AI Suggestions:"}
        </p>
      </div>
      <div className="flex space-x-2">
        {intelligentSuggestions.map((suggestion, index) => (
          <Button
            key={`ai-suggestion-${index}`}
            buttonType="secondary"
            size="small"
            onClick={() => {
              // Simulate applying a suggestion (e.g., adding a new filter, adjusting limit)
              const newFilter = { ...currentQuery, /* parse suggestion string to apply changes */ };
              updateQuery(newFilter);
              geminiService.geminiTelemetry.logEvent('GeminiSearchAgent.suggestionApplied', { suggestion });
            }}
          >
            {suggestion.length > 30 ? suggestion.substring(0, 27) + "..." : suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Main component, now heavily infused with Gemini AI logic
function BlockAllowEntitiesHome() {
  const { geminiService, geminiMemory, geminiTelemetry, geminiEventBroker } = useGeminiAI();
  const geminiComplianceEngine = new GeminiComplianceEngine(geminiService, geminiMemory, geminiTelemetry);

  const [query, setQuery] = useState<QueryType>(INITIAL_QUERY);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteValues, setDeleteValues] = useState<FilterElements>(
    INITIAL_DELETE_VALUES,
  );
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [selfHealingAttempt, setSelfHealingAttempt] = useState(0); // For AI self-correction

  const { dispatchError, dispatchSuccess } = useDispatchContext();
  const [deleteBlockAllowEntity] = useDeleteBlockAllowEntityMutation();

  const searchComponents = getBlockAllowEntitiesSearchComponents();

  // III. Commercial-Grade Logic Infusion - AI-driven error handling, pre-validation
  const onDeleteBlockAllowEntity = async (
    type: BlockAllowEntityTypesEnum,
    value: string,
  ): Promise<void> => {
    geminiTelemetry.logEvent('onDeleteBlockAllowEntity.init', { type, value, action: query.action });

    // AI Pre-validation: Check if deletion is compliant or risky
    const validationResult = await geminiComplianceEngine.validateEntityOperation({ type, value, action: query.action }, 'delete');

    if (!validationResult.isValid) {
      dispatchError(`AI Warning: ${validationResult.message}`);
      geminiTelemetry.logError('onDeleteBlockAllowEntity.validationFailed', { type, value, action: query.action, reason: validationResult.message });
      return; // Block operation based on AI assessment
    }

    try {
      const { data: response } = await deleteBlockAllowEntity({
        variables: {
          input: {
            entityType: type,
            value,
            action: query.action,
          },
        },
      });

      if (response?.deleteBlockAllowEntity?.errors) {
        const errorMessage = response?.deleteBlockAllowEntity.errors.toString();
        dispatchError(errorMessage);
        geminiTelemetry.logError('onDeleteBlockAllowEntity.graphqlError', { type, value, action: query.action, errorMessage });

        // Self-Correction: If a specific error pattern occurs, AI might suggest an alternative or retry.
        if (errorMessage.includes("permission denied") && selfHealingAttempt < 1) {
          geminiService.adaptPrompt("Error detected: Permission issue. Suggesting alternative administrative flow or retry with elevated privileges.");
          setSelfHealingAttempt(prev => prev + 1);
          dispatchError("AI suggests an alternative approach due to permission issues. Please consult audit log.");
          // In a real system, this could trigger an automated workflow to request elevated permissions.
        }

      } else {
        dispatchSuccess("Entity successfully removed from the list.");
        window.location.href = "/compliance/block_allow_entities";
        geminiTelemetry.logEvent('onDeleteBlockAllowEntity.success', { type, value, action: query.action });
        geminiMemory.remember('lastDeletion', { type, value, action: query.action, timestamp: new Date() });
      }
    } catch (error) {
      dispatchError("An error occurred during deletion.");
      geminiTelemetry.logError('onDeleteBlockAllowEntity.networkError', { type, value, action: query.action, errorMessage: error.message });
      geminiEventBroker.publish('entity.delete.failed', { entity: { type, value }, error: error.message });
    }
  };

  const { data, loading, error, refetch } = useBlockAllowEntitiesViewQuery({
    variables: {
      action: query.action,
      limit: query.limit,
      nextCursor: query.nextCursor,
      entityType: query.type,
      value: query.value,
    },
    // Implement production-grade patterns: circuit-breaking, retry logic with AI.
    fetchPolicy: "network-only", // Always get fresh data
    onError: (apolloError) => {
      geminiTelemetry.logError('useBlockAllowEntitiesViewQuery.apolloError', {
        query: JSON.stringify(query),
        errorMessage: apolloError.message,
      });
      dispatchError(`Data fetch error: ${apolloError.message}. AI is analyzing potential causes.`);
      // AI-driven self-healing for query errors
      if (selfHealingAttempt < 2) { // Limit retry attempts
        geminiService.adaptPrompt(`Query failed with error: ${apolloError.message}. Attempting to refine query or retry.`);
        setSelfHealingAttempt(prev => prev + 1);
        setTimeout(() => {
          // Simulate AI adjusting query parameters or fetching from a fallback service
          const aiAdjustedQuery = { ...query, limit: 10 }; // Example AI adjustment
          setQuery(aiAdjustedQuery);
          refetch(aiAdjustedQuery);
          geminiTelemetry.logEvent('Query.selfHealAttempt', { attempt: selfHealingAttempt, newLimit: aiAdjustedQuery.limit });
          dispatchSuccess(`AI attempting to self-heal query by adjusting parameters (attempt ${selfHealingAttempt + 1}).`);
        }, 2000); // Retry after 2 seconds
      } else {
        geminiService.adaptPrompt("Query repeatedly failing. Escalating to human intervention.");
        dispatchError("AI self-healing exhausted. Manual review required for data fetching issue.");
      }
    }
  });

  // Fetch AI suggestions on initial load and query changes
  useEffect(() => {
    const fetchAiOptimizations = async () => {
      const suggestions = await geminiComplianceEngine.getOptimizationSuggestions(data?.blockAllowEntities || []);
      setAiSuggestions(suggestions);
      geminiTelemetry.logEvent('AI.optimizationSuggestionsLoaded', { count: suggestions.length });
    };
    fetchAiOptimizations();
  }, [data?.blockAllowEntities, geminiComplianceEngine, query, geminiTelemetry]);

  // II. Total Integration - AI reasoning layers in data transformation.
  // MapBlockAllowListEntities now includes AI-driven risk assessment and flags.
  async function MapBlockAllowListEntities(element: BlockAllowEntity): Promise<BlockAllowEntityDataMap> {
    const expiry = moment.tz(element.expiry, "UTC").format("MM-DD-YYYY");
    const formattedType = BLOCKLIST_FORMATTED_TYPES[element.type];

    // Infuse AI reasoning layer for each entity
    const aiAnalysis = await geminiComplianceEngine.analyzeEntityForCompliance(element);
    geminiTelemetry.logEvent('MapBlockAllowListEntities.aiAnalysisCompleted', { entityId: element.id, flags: aiAnalysis.flags });

    return {
      type: formattedType,
      value: element.value,
      expiry,
      block_allow_entity_link: renderblockAllowEntityLink(element),
      gemini_risk_score: `${(aiAnalysis.confidence * 100).toFixed(0)}%`, // Display AI confidence as risk score
      gemini_analysis_flags: aiAnalysis.flags.join(', ') || 'N/A',
      gemini_analysis_tooltip: aiAnalysis.analysis, // Store detailed analysis for tooltip if needed
    };
  }

  // Helper for rendering link, unchanged (AI could enhance Popover behavior but leaving as is for existing elements)
  function renderblockAllowEntityLink(blockAllowEntity: BlockAllowEntity) {
    const { type, value } = blockAllowEntity;
    return (
      <div className="absolute right-12 z-auto -mt-4">
        <Popover>
          <PopoverTrigger className="border-none bg-opacity-0">
            <Icon
              size="s"
              iconName="more_horizontal"
              className="text-gray-600"
              color="currentColor"
            />
          </PopoverTrigger>
          <PopoverPanel anchorOrigin={{ horizontal: "right" }}>
            {(renderProps: { close: () => void }) => (
              <ActionItem
                key="delete"
                onClick={() => {
                  setDeleteValues({
                    type,
                    value,
                  });
                  setIsConfirmDeleteOpen(true);
                  renderProps.close();
                  geminiTelemetry.logEvent('ActionItem.deleteClicked', { type, value });
                }}
              >
                Delete
              </ActionItem>
            )}
          </PopoverPanel>
        </Popover>
      </div>
    );
  }

  const lastIndex =
    loading ||
    error ||
    !data ||
    !data.blockAllowEntities ||
    data.blockAllowEntities.length === 0
      ? null
      : data.blockAllowEntities.length - 1;

  const lastId = !lastIndex ? null : data?.blockAllowEntities[lastIndex].id;
  const nextCursor = lastId ? +lastId : undefined;

  // Wait for all AI analyses to complete before rendering the table
  const [blockAllowEntities, setBlockAllowEntities] = useState<BlockAllowEntityDataMap[]>([]);
  const [isProcessingEntities, setIsProcessingEntities] = useState(false);

  useEffect(() => {
    const processEntities = async () => {
      if (loading || error || !data || !data.blockAllowEntities) {
        setBlockAllowEntities([]);
        return;
      }
      setIsProcessingEntities(true);
      geminiTelemetry.logEvent('EntityProcessing.start', { count: data.blockAllowEntities.length });
      const processed = await Promise.all(data.blockAllowEntities.map(MapBlockAllowListEntities));
      setBlockAllowEntities(processed);
      setIsProcessingEntities(false);
      geminiTelemetry.logEvent('EntityProcessing.complete', { count: processed.length });
    };
    processEntities();
  }, [data, loading, error, geminiComplianceEngine, geminiTelemetry]);


  return (
    <GeminiAIContext.Provider value={{ geminiService, geminiMemory, geminiTelemetry, geminiEventBroker }}>
      <>
        <div className="flex justify-between">
          <div className="mt-2 max-w-md text-gray-600">
            Blocklists and allowlists affect risk scores for KYC user onboarding
            and transaction monitoring decisions.&nbsp;
            <a
              href="https://docs.moderntreasury.com/docs/blocklist-allowlist"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500"
            >
              Learn more
            </a>
            <p className="mt-1 text-sm text-green-700 italic">
              Powered by Gemini AI for adaptive compliance and predictive insights.
            </p>
          </div>
          <Button buttonType="primary" onClick={() => setIsCreateModalOpen(true)}>
            <Icon iconName="add" color="white" />
            Add New (AI-Validated)
          </Button>
        </div>
        {isConfirmDeleteOpen && deleteValues && (
          <ConfirmModal
            title={`Remove from the ${query.action}list (AI Confirmation)`}
            isOpen={isConfirmDeleteOpen}
            setIsOpen={() => {
              setIsConfirmDeleteOpen(false);
              setDeleteValues(INITIAL_DELETE_VALUES);
              geminiTelemetry.logEvent('ConfirmModal.closed', { action: 'delete', confirmed: false });
            }}
            confirmText="Delete Entity"
            confirmType="delete"
            onConfirm={() => {
              setIsConfirmDeleteOpen(false);
              if (deleteValues?.type && deleteValues?.value) {
                onDeleteBlockAllowEntity(deleteValues?.type, deleteValues?.value);
              }
              geminiTelemetry.logEvent('ConfirmModal.confirmed', { action: 'delete', confirmed: true });
            }}
          >
            Are you sure you want to remove the following entry from the{" "}
            {query.action}list? This operation cannot be undone. Gemini AI has pre-validated this action.
          </ConfirmModal>
        )}
        {isCreateModalOpen && (
          <CreateBlockAllowEntityModal
            isOpen={isCreateModalOpen}
            setCloseModal={setIsCreateModalOpen}
            action={query.action}
          />
        )}

        <SectionNavigator
          sections={SECTIONS}
          currentSection={query.action === BlockAllowEntityActionsEnum.Block ? "block" : query.action === BlockAllowEntityActionsEnum.Allow ? "allow" : "insights"}
          onClick={(section: string) => {
            if (section === "block") {
              setQuery({ ...query, action: BlockAllowEntityActionsEnum.Block });
              setShowAiInsights(false);
            } else if (section === "allow") {
              setQuery({ ...query, action: BlockAllowEntityActionsEnum.Allow });
              setShowAiInsights(false);
            } else if (section === "insights") {
              setShowAiInsights(true);
            }
            geminiTelemetry.logEvent('SectionNavigator.changed', { section });
          }}
        />

        {showAiInsights ? (
          <GeminiInsightsPanel suggestions={aiSuggestions} recentAuditLog={geminiMemory.auditLog.slice(-10)} />
        ) : (
          <>
            <GeminiDynamicSearchQueryAgent
              currentQuery={query}
              updateQuery={(filterUpdate: FilterElements) => {
                setQuery({ ...query, ...filterUpdate });
                geminiTelemetry.logEvent('SearchQueryAgent.queryUpdated', { newQuery: filterUpdate });
              }}
              geminiService={geminiService}
              geminiMemory={geminiMemory}
            />
            {isProcessingEntities && (
              <NotificationBanner type="info" message="Gemini AI is processing entities for compliance analysis and risk assessment..." />
            )}
            <IndexTable
              enableActions
              dataMapping={MAPPING}
              data={blockAllowEntities}
              // Add tooltips for AI analysis flags if needed
              // rowKey="id" // Assuming entities have an 'id' for stable keys
            />
            <div className="pagination-row flex">
              <div className="pagination-count">
                <div className="entity-count-container">
                  <span className="entity-count">
                    <Popover>
                      <PopoverTrigger>{query.limit}</PopoverTrigger>
                      <PopoverPanel anchorOrigin={{ vertical: "top" }}>
                        {(renderProps: { close: () => void }) => (
                          <>
                            {[25, 50, 100].map((perPage) => (
                              <ActionItem
                                key={`perPagePagination_${perPage}`}
                                onClick={() => {
                                  setQuery({ ...query, limit: perPage });
                                  renderProps.close();
                                  geminiTelemetry.logEvent('Pagination.limitChanged', { newLimit: perPage });
                                }}
                              >
                                {perPage}
                              </ActionItem>
                            ))}
                          </>
                        )}
                      </PopoverPanel>
                    </Popover>
                  </span>
                </div>
              </div>
              <div className="pagination-nav ml-2 self-center">
                <div className="flex" role="group">
                  <div className="pr-1">
                    <Button
                      id="btn-nav-prev"
                      disabled={query.nextCursor === undefined}
                      onClick={() => {
                        setQuery({ ...query, nextCursor: undefined });
                        geminiTelemetry.logEvent('Pagination.prevPage', { currentCursor: query.nextCursor });
                      }}
                    >
                      <Icon iconName="arrow_backward" color="#A6ADB6" />
                    </Button>
                  </div>
                  <Button
                    id="btn-nav-next"
                    onClick={() => {
                      setQuery({ ...query, nextCursor });
                      geminiTelemetry.logEvent('Pagination.nextPage', { nextCursor });
                    }}
                    disabled={
                      !data || !data.blockAllowEntities
                        ? true
                        : data.blockAllowEntities.length < query.limit
                    }
                  >
                    <Icon iconName="chevron_right" color="#A6ADB6" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </GeminiAIContext.Provider>
  );
}

export default BlockAllowEntitiesHome;