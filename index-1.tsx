// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import { defaultTemplate } from "~/app/containers/dashboard/templates/default";
import { ledgersTemplate } from "~/app/containers/dashboard/templates/ledgers";
import { ledgersPaymentsTemplate } from "~/app/containers/dashboard/templates/ledgers_payments";
import { paymentsTemplate } from "~/app/containers/dashboard/templates/payments";
import { paymentsComplianceTemplate } from "~/app/containers/dashboard/templates/payments_compliance";
import { paymentsComplianceReconLedgersTemplate } from "~/app/containers/dashboard/templates/payments_compliance_ledgers";
import { complianceLedgersTemplate } from "~/app/containers/dashboard/templates/ledgers_compliance";
import { DashboardProps } from "~/common/ui-components/Dashboard/Dashboard";

/**
 * Dashboard layout configurations for specific combinations of Modern Treasury products.
 */
export const dashboardTemplates: {
  [key: string]: DashboardProps;
} = {
  default: defaultTemplate,
  payments: paymentsTemplate,
  payments_compliance: paymentsComplianceTemplate,
  payments_compliance_ledgers: paymentsComplianceReconLedgersTemplate,
  ledgers: ledgersTemplate,
  ledgers_payments: ledgersPaymentsTemplate,
  ledgers_compliance: complianceLedgersTemplate,
};

// --- Total Gemini Integration & Self-Contained Universe Architecture ---

/**
 * Interface for AI-driven template metadata.
 * These are neural extensions of the codebase, informing the AI's decisions.
 */
export interface TemplateMetadata {
  description: string;
  tags: string[];
  productLines: string[];
  accessRoles: string[];
  version: string;
  ai_confidence_score?: number; // How confident is the AI in this template's relevance
  last_adaptive_update?: string; // Timestamp of the last AI adaptation
}

/**
 * Context for requesting an adaptive dashboard template.
 * This drives the prompt-based learning pipelines.
 */
export interface TemplateRequestContext {
  userId: string;
  tenantId: string;
  preferredProduct: string | null;
  currentRoute: string;
  userRoles: string[];
  featureFlags: { [key: string]: boolean };
  sessionHistory: string[]; // Recent user interactions/pages
  queryParameters: { [key: string]: string };
  // Additional context for AI reasoning
  userIntent?: string;
  businessContext?: {
    transactionVolume?: number;
    riskProfile?: 'low' | 'medium' | 'high';
  };
}

/**
 * Feedback provided by the user or system for template adaptation.
 * Used by the system to remember, adapt, and predict.
 */
export interface TemplateFeedback {
  templateId: string;
  wasUseful: boolean;
  engagementScore: number; // e.g., time spent, clicks
  reason?: string;
  timestamp: string;
}

/**
 * Represents a user profile for predictive analysis.
 */
export interface UserProfile {
  userId: string;
  preferences: {
    layoutDensity: 'compact' | 'standard' | 'spacious';
    theme: 'light' | 'dark';
    focusArea: 'payments' | 'ledgers' | 'compliance' | 'all';
  };
  historicalUsage: {
    [templateId: string]: {
      views: number;
      avgEngagement: number;
      lastAccessed: string;
    };
  };
  currentLocation: string; // Geo-location for compliance/latency
}

/**
 * Represents a commercially-tuned dashboard template, enhanced by AI.
 */
export interface AIDrivenDashboardTemplate extends DashboardProps {
  id: string; // Unique identifier for the AI system
  metadata: TemplateMetadata;
  // AI-injected observability and state attributes
  ai_generated_variant_id?: string;
  ai_adaptation_log?: string[];
  ai_predicted_performance?: {
    load_time_ms: number;
    engagement_rate: number;
  };
}

/**
 * Internal conceptual module for interacting with the Gemini Language Model.
 * This embodies an AI-synthesized module as a living endpoint.
 */
class GeminiLLMConnector {
  private static instance: GeminiLLMConnector;
  private apiKey: string = 'sk-gemini-xxxxxxxxxxxxxx'; // Placeholder for dynamic secret management

  private constructor() {
    console.log("Gemini LLM Connector initialized. Ready for dynamic prompt execution.");
  }

  public static getInstance(): GeminiLLMConnector {
    if (!GeminiLLMConnector.instance) {
      GeminiLLMConnector.instance = new GeminiLLMConnector();
    }
    return GeminiLLMConnector.instance;
  }

  /**
   * Invokes the Gemini LLM for complex reasoning and content generation.
   * This function simulates an elastic API for dynamic service discovery and LLM interaction.
   * @param prompt The AI prompt to send.
   * @param context Additional contextual data for the LLM.
   * @returns A promise resolving to the LLM's response.
   */
  public async invoke(prompt: string, context: Record<string, any>): Promise<string> {
    console.log(`[GeminiLLMConnector] Invoking LLM with prompt: "${prompt.substring(0, 100)}..." and context:`, context);
    // Simulate API call to Gemini, potentially selecting optimal endpoint dynamically
    // based on region, load, or compliance requirements.
    await new Promise(resolve => setTimeout(Math.random() * 500 + 100, resolve)); // Simulate network latency

    // This is where real-world business logic simulations would occur:
    // 1. Prompt engineering for optimal output
    // 2. Content moderation checks
    // 3. Cost estimation for the LLM call
    // 4. Fallback mechanisms if LLM fails

    const simulatedResponse = this.simulateLLMResponse(prompt, context);
    console(`[GeminiLLMConnector] Received simulated LLM response.`);
    return simulatedResponse;
  }

  /**
   * Simulates various LLM responses based on prompt.
   * Introduces decision-making at the output level.
   */
  private simulateLLMResponse(prompt: string, context: Record<string, any>): string {
    if (prompt.includes("generate a new template")) {
      const product = context.preferredProduct || 'payments';
      const userRoles = context.userRoles.join(', ');
      return JSON.stringify({
        description: `AI-generated dynamic template for ${product} tailored for ${userRoles}.`,
        layout: [
          // Simulate generating a new DashboardProps structure
          {
            component: 'CustomMetricCard',
            props: { title: 'AI-Generated Metric', value: '1.2M', trend: 'up' }
          },
          {
            component: 'DynamicDataGrid',
            props: { dataSource: `ai_dynamic_data_for_${product}`, filters: context.userRoles }
          }
        ],
        metadata: {
          description: `AI-synthesized template for product '${product}' and user roles '${userRoles}'.`,
          tags: ['AI-generated', product, ...context.userRoles],
          productLines: [product],
          accessRoles: context.userRoles,
          version: '1.0.AI',
          ai_confidence_score: 0.95,
          last_adaptive_update: new Date().toISOString()
        }
      });
    }
    if (prompt.includes("adapt existing template")) {
      const templateName = context.templateName || 'default';
      return `Adapted version of ${templateName} template: Enhanced with AI-driven widget placement for higher engagement based on session history.`;
    }
    if (prompt.includes("predict optimal template")) {
      return context.userProfile?.preferences?.focusArea === 'payments' ? 'payments_compliance' : 'default';
    }
    return "AI-powered insight: Please refine your request for a more specific output.";
  }
}

/**
 * Internal conceptual module for telemetry, monitoring, and observability.
 * Implements production-grade patterns.
 */
class TelemetryAgent {
  private static instance: TelemetryAgent;
  private eventBuffer: any[] = []; // Simulate event batching

  private constructor() {
    console.log("Telemetry Agent initialized. Ready to capture system metrics.");
    setInterval(() => this.flushEvents(), 5000); // Simulate periodic flushing
  }

  public static getInstance(): TelemetryAgent {
    if (!TelemetryAgent.instance) {
      TelemetryAgent.instance = new TelemetryAgent();
    }
    return TelemetryAgent.instance;
  }

  public logEvent(eventType: string, payload: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    this.eventBuffer.push({ timestamp, eventType, payload });
    console.log(`[TelemetryAgent] Buffered event: ${eventType}`, payload);
    // Introduce decision-making: if buffer critical, flush immediately.
    if (this.eventBuffer.length > 50) {
      this.flushEvents();
    }
  }

  private flushEvents(): void {
    if (this.eventBuffer.length > 0) {
      // Simulate sending to an external telemetry service (e.g., DataDog, Prometheus)
      console.log(`[TelemetryAgent] Flushing ${this.eventBuffer.length} events:`, this.eventBuffer);
      this.eventBuffer = []; // Clear buffer after "sending"
    }
  }

  public recordMetric(metricName: string, value: number, tags?: Record<string, string>): void {
    console.log(`[TelemetryAgent] Recording metric: ${metricName}=${value}`, tags);
    // Simulate sending to a metrics aggregator
  }
}

/**
 * Internal conceptual module for a Circuit Breaker pattern.
 * Enhances resilience for external service calls, a production-grade pattern.
 */
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private resetTimeout: number = 30000; // 30 seconds
  private failureThreshold: number = 5;

  /**
   * Executes a command, wrapped by the circuit breaker logic.
   * @param command The function to execute.
   * @param fallback The fallback function to call if the circuit is open or tripped.
   */
  public async execute<T>(command: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        console.warn("[CircuitBreaker] State: HALF_OPEN - attempting a trial call.");
      } else {
        console.warn("[CircuitBreaker] State: OPEN - falling back without executing command.");
        TelemetryAgent.getInstance().logEvent('circuit_breaker_open', { component: 'GeminiLLM', action: 'fallback' });
        return fallback();
      }
    }

    try {
      const result = await command();
      this.reset();
      return result;
    } catch (error: any) {
      this.recordFailure();
      console.error(`[CircuitBreaker] Command failed. Current failures: ${this.failureCount}. State: ${this.state}. Error:`, error.message);
      TelemetryAgent.getInstance().logEvent('circuit_breaker_failure', { component: 'GeminiLLM', error: error.message });
      return fallback();
    }
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      console.error("[CircuitBreaker] State: OPEN - failure threshold reached.");
      TelemetryAgent.getInstance().logEvent('circuit_breaker_tripped', { component: 'GeminiLLM' });
    } else if (this.state === 'HALF_OPEN') {
      // If half-open and failure, return to open immediately
      this.state = 'OPEN';
      console.error("[CircuitBreaker] State: HALF_OPEN failed, returning to OPEN.");
    }
  }

  private reset(): void {
    if (this.state !== 'CLOSED') {
      console.info("[CircuitBreaker] State: CLOSED - reset due to successful command.");
      TelemetryAgent.getInstance().logEvent('circuit_breaker_reset', { component: 'GeminiLLM' });
    }
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}

/**
 * Internal conceptual module for authentication and authorization.
 * Simulates enterprise-grade authentication logic.
 */
class AuthService {
  private static instance: AuthService;
  private authorizedRoles: { [templateId: string]: string[] } = {};

  private constructor() {
    console.log("Auth Service initialized.");
    // Pre-seed some authorization rules
    this.authorizedRoles['default'] = ['admin', 'user', 'viewer'];
    this.authorizedRoles['payments'] = ['admin', 'payments_manager'];
    this.authorizedRoles['payments_compliance'] = ['admin', 'compliance_officer', 'payments_manager'];
    this.authorizedRoles['payments_compliance_ledgers'] = ['admin', 'compliance_officer', 'payments_manager', 'auditor'];
    this.authorizedRoles['ledgers'] = ['admin', 'accountant'];
    this.authorizedRoles['ledgers_payments'] = ['admin', 'accountant', 'payments_manager'];
    this.authorizedRoles['ledgers_compliance'] = ['admin', 'accountant', 'compliance_officer'];
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public isAuthorized(userId: string, userRoles: string[], templateId: string): boolean {
    const requiredRoles = this.authorizedRoles[templateId] || ['admin']; // Default to admin if no explicit roles
    const hasPermission = userRoles.some(role => requiredRoles.includes(role));
    if (!hasPermission) {
      TelemetryAgent.getInstance().logEvent('authorization_denied', { userId, templateId, userRoles });
      console.warn(`[AuthService] User ${userId} with roles ${userRoles.join(', ')} denied access to template ${templateId}`);
    } else {
      console.log(`[AuthService] User ${userId} authorized for template ${templateId}`);
    }
    return hasPermission;
  }

  public updateAuthorization(templateId: string, roles: string[]): void {
    this.authorizedRoles[templateId] = roles;
    console.log(`[AuthService] Updated authorization for template ${templateId}: ${roles.join(', ')}`);
  }
}

/**
 * Internal conceptual module for billing and resource tracking.
 * Simulates commercial-grade logic for AI usage.
 */
class BillingService {
  private static instance: BillingService;
  private usageRecords: { [userId: string]: { llmCalls: number, aiComputeUnits: number } } = {};

  private constructor() {
    console.log("Billing Service initialized.");
  }

  public static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  public recordLLMUsage(userId: string, calls: number = 1, computeUnits: number = 10): void {
    if (!this.usageRecords[userId]) {
      this.usageRecords[userId] = { llmCalls: 0, aiComputeUnits: 0 };
    }
    this.usageRecords[userId].llmCalls += calls;
    this.usageRecords[userId].aiComputeUnits += computeUnits;
    TelemetryAgent.getInstance().recordMetric('billing.llm_calls', this.usageRecords[userId].llmCalls, { userId });
    TelemetryAgent.getInstance().recordMetric('billing.ai_compute_units', this.usageRecords[userId].aiComputeUnits, { userId });
    console.log(`[BillingService] Recorded LLM usage for ${userId}: ${calls} calls, ${computeUnits} CUs.`);
  }

  public getUsage(userId: string): { llmCalls: number, aiComputeUnits: number } | undefined {
    return this.usageRecords[userId];
  }
}

/**
 * Internal conceptual module for compliance checks.
 * Ensures adherence to regulatory and internal policies.
 */
class ComplianceEngine {
  private static instance: ComplianceEngine;
  private policies: { [policyName: string]: (data: any, context: any) => boolean } = {};

  private constructor() {
    console.log("Compliance Engine initialized. Loading policies...");
    this.loadDefaultPolicies();
  }

  public static getInstance(): ComplianceEngine {
    if (!ComplianceEngine.instance) {
      ComplianceEngine.instance = new ComplianceEngine();
    }
    return ComplianceEngine.instance;
  }

  private loadDefaultPolicies(): void {
    // Simulate loading various compliance policies
    this.policies['data_classification_PFI'] = (templateData: AIDrivenDashboardTemplate, context: TemplateRequestContext) => {
      // Example: Check if template data contains PFI and if user has appropriate clearance
      const containsPFI = JSON.stringify(templateData).includes('PFI_DATA_ELEMENT');
      const hasClearance = context.userRoles.includes('data_officer') || context.userRoles.includes('admin');
      if (containsPFI && !hasClearance) {
        TelemetryAgent.getInstance().logEvent('compliance_violation', {
          policy: 'data_classification_PFI',
          templateId: templateData.id,
          userId: context.userId
        });
        return false;
      }
      return true;
    };
    this.policies['region_data_residency'] = (templateData: AIDrivenDashboardTemplate, context: TemplateRequestContext) => {
      // Example: If user is in EU, ensure template doesn't display US-only sensitive data
      // This would require more sophisticated context about the template's data sources
      return true; // Placeholder
    };
  }

  public checkCompliance(templateData: AIDrivenDashboardTemplate, context: TemplateRequestContext): boolean {
    for (const policyName in this.policies) {
      if (!this.policies[policyName](templateData, context)) {
        console.warn(`[ComplianceEngine] Template ${templateData.id} failed compliance for policy: ${policyName}`);
        return false;
      }
    }
    console.log(`[ComplianceEngine] Template ${templateData.id} passed all compliance checks.`);
    return true;
  }

  public addPolicy(policyName: string, policyFunction: (data: any, context: any) => boolean): void {
    this.policies[policyName] = policyFunction;
    console.log(`[ComplianceEngine] Added new compliance policy: ${policyName}`);
  }
}


/**
 * The core AI-Driven Template Registry, a self-contained ecosystem of AI-driven logic.
 * This class becomes its own universe, managing, adapting, and generating templates.
 */
export class AIDrivenTemplateRegistry {
  private static instance: AIDrivenTemplateRegistry;
  private registeredTemplates: Map<string, AIDrivenDashboardTemplate>;
  private templateMetadata: Map<string, TemplateMetadata>;
  private templateUsageHistory: Map<string, TemplateFeedback[]>;
  private userProfileCache: Map<string, UserProfile>; // To remember and predict for users

  // Internal AI and commercial-grade service instances – autonomous externalization
  private geminiConnector: GeminiLLMConnector;
  private telemetryAgent: TelemetryAgent;
  private circuitBreaker: CircuitBreaker;
  private authService: AuthService;
  private billingService: BillingService;
  private complianceEngine: ComplianceEngine;

  private constructor() {
    this.registeredTemplates = new Map();
    this.templateMetadata = new Map();
    this.templateUsageHistory = new Map();
    this.userProfileCache = new Map();

    // Initialize internal AI-driven and commercial-grade services
    this.geminiConnector = GeminiLLMConnector.getInstance();
    this.telemetryAgent = TelemetryAgent.getInstance();
    this.circuitBreaker = new CircuitBreaker();
    this.authService = AuthService.getInstance();
    this.billingService = BillingService.getInstance();
    this.complianceEngine = ComplianceEngine.getInstance();

    // Load initial templates from the legacy export, infusing Gemini logic
    this.loadInitialTemplates();

    console.log("AIDrivenTemplateRegistry initialized: A self-aware infrastructure for dashboard templates is active.");
  }

  public static getInstance(): AIDrivenTemplateRegistry {
    if (!AIDrivenTemplateRegistry.instance) {
      AIDrivenTemplateRegistry.instance = new AIDrivenTemplateRegistry();
    }
    return AIDrivenTemplateRegistry.instance;
  }

  /**
   * Loads initial static templates into the AI-driven registry.
   * Each static import is now treated as a seed for an AI-managed template.
   */
  private loadInitialTemplates(): void {
    for (const key in dashboardTemplates) {
      if (dashboardTemplates.hasOwnProperty(key)) {
        const legacyTemplate = dashboardTemplates[key];
        const defaultMetadata: TemplateMetadata = {
          description: `Legacy template for ${key}. Initialized by AI system.`,
          tags: ['legacy', 'static', key],
          productLines: [key.split('_')[0]], // Simple product line inference
          accessRoles: ['admin', 'user'], // Default access
          version: '1.0.0',
          ai_confidence_score: 0.7, // Lower initial confidence for static templates
          last_adaptive_update: new Date().toISOString()
        };

        const aiTemplate: AIDrivenDashboardTemplate = {
          ...legacyTemplate,
          id: key,
          metadata: defaultMetadata,
        };
        this.registeredTemplates.set(key, aiTemplate);
        this.templateMetadata.set(key, defaultMetadata);
        console.log(`[AIDrivenTemplateRegistry] Initialized template: ${key} with AI metadata.`);
      }
    }
  }

  /**
   * Registers a new template or updates an existing one, making it available for AI management.
   * @param name The unique identifier for the template.
   * @param template The base DashboardProps.
   * @param meta Optional metadata. AI will infer if not provided.
   */
  public async registerTemplate(name: string, template: DashboardProps, meta?: Partial<TemplateMetadata>): Promise<AIDrivenDashboardTemplate> {
    const existingMeta = this.templateMetadata.get(name);
    const inferredMeta: TemplateMetadata = {
      description: meta?.description || `Dynamically registered template: ${name}.`,
      tags: [...(existingMeta?.tags || []), ...(meta?.tags || []), 'dynamic', 'AI-managed'],
      productLines: [...(existingMeta?.productLines || []), ...(meta?.productLines || [])],
      accessRoles: [...(existingMeta?.accessRoles || []), ...(meta?.accessRoles || ['user'])],
      version: meta?.version || '1.0.AI-dynamic',
      ai_confidence_score: meta?.ai_confidence_score || 0.8,
      last_adaptive_update: new Date().toISOString(),
      ...existingMeta, // Preserve existing if not overridden
      ...meta,
    };

    const aiTemplate: AIDrivenDashboardTemplate = {
      ...template,
      id: name,
      metadata: inferredMeta,
    };

    this.registeredTemplates.set(name, aiTemplate);
    this.templateMetadata.set(name, inferredMeta);
    this.authService.updateAuthorization(name, inferredMeta.accessRoles); // Bind to auth service

    this.telemetryAgent.logEvent('template_registered', { templateId: name, metadata: inferredMeta });
    console.log(`[AIDrivenTemplateRegistry] Registered/Updated AI-managed template: ${name}.`);
    return aiTemplate;
  }

  /**
   * Retrieves an adaptive dashboard template based on the given context.
   * This embeds AI reasoning layers and introduces decision-making at every level.
   * @param context The current request context.
   * @returns A promise resolving to an AI-driven dashboard template.
   */
  public async getAdaptiveTemplate(context: TemplateRequestContext): Promise<AIDrivenDashboardTemplate> {
    this.telemetryAgent.logEvent('template_request', { userId: context.userId, context });
    this.billingService.recordLLMUsage(context.userId, 0, 1); // Record a minor charge for context processing

    let selectedTemplateId: string | null = null;
    let templateSource: 'cached' | 'generated' | 'adapted' | 'default' = 'default';

    // Phase 1: Authentication & Authorization
    const availableTemplates = Array.from(this.registeredTemplates.values()).filter(template =>
      this.authService.isAuthorized(context.userId, context.userRoles, template.id)
    );

    if (availableTemplates.length === 0) {
      this.telemetryAgent.logEvent('template_access_denied_no_match', { userId: context.userId });
      throw new Error("No authorized templates found for this user and context.");
    }

    // Phase 2: Predictive Selection (Memory & Prediction)
    const userProfile = await this.getUserProfile(context.userId);
    if (userProfile && Object.keys(userProfile.historicalUsage).length > 0) {
      selectedTemplateId = await this.predictOptimalTemplate(userProfile, availableTemplates.map(t => t.id));
      if (selectedTemplateId && this.registeredTemplates.has(selectedTemplateId)) {
        templateSource = 'adapted'; // Assume predictive is an adaptation
        console.log(`[AIDrivenTemplateRegistry] Predicted optimal template: ${selectedTemplateId}`);
      }
    }

    if (!selectedTemplateId) {
      // Phase 3: Context-aware Selection or Generation
      selectedTemplateId = await this.circuitBreaker.execute(
        async () => {
          this.billingService.recordLLMUsage(context.userId, 1, 50); // Record higher charge for LLM invocation
          const llmPrompt = `Given the user's current context: preferred product=${context.preferredProduct}, route=${context.currentRoute}, user roles=${context.userRoles.join(',')}, and session history=${context.sessionHistory.join(' -> ')}.
          And available templates: ${availableTemplates.map(t => t.id + ' (tags: ' + (t.metadata?.tags || []).join(',') + ')').join('; ')}.
          Suggest the single best template ID. If no exact match, consider generating a highly adaptive template if appropriate, otherwise suggest 'default'.
          Prioritize templates that align with 'userIntent': '${context.userIntent || 'general dashboard view'}'.
          Output ONLY the template ID or 'GENERATE_NEW_TEMPLATE' if appropriate.`;

          const llmResponse = await this.geminiConnector.invoke(llmPrompt, context);
          const suggestedId = llmResponse.trim().replace(/"/g, ''); // Clean LLM output

          if (suggestedId === 'GENERATE_NEW_TEMPLATE' && context.featureFlags['enableDynamicTemplateGeneration']) {
            templateSource = 'generated';
            console.log(`[AIDrivenTemplateRegistry] AI decided to GENERATE_NEW_TEMPLATE.`);
            return this.generateNewTemplate(context); // This will return a temporary ID or actual ID
          } else if (this.registeredTemplates.has(suggestedId)) {
            templateSource = 'adapted';
            return suggestedId;
          }
          console.warn(`[AIDrivenTemplateRegistry] LLM suggested unknown template '${suggestedId}'. Falling back to default.`);
          return 'default';
        },
        async () => {
          // Fallback logic if Gemini LLM or service discovery fails
          this.telemetryAgent.logEvent('llm_fallback_triggered', { userId: context.userId, reason: 'circuit_open_or_failure' });
          console.warn("[AIDrivenTemplateRegistry] Falling back to rule-based template selection due to LLM failure.");
          // Rule-based fallback:
          if (context.preferredProduct) {
            const matchingTemplate = availableTemplates.find(t => t.id.startsWith(context.preferredProduct!));
            if (matchingTemplate) return matchingTemplate.id;
          }
          return 'default'; // Always have a safe default
        }
      );
    }

    let finalTemplate = this.registeredTemplates.get(selectedTemplateId || 'default');
    if (!finalTemplate) {
      console.error(`[AIDrivenTemplateRegistry] Final template '${selectedTemplateId}' not found after all selection attempts. Using hardcoded default.`);
      finalTemplate = this.registeredTemplates.get('default')!; // Should always exist
      selectedTemplateId = 'default';
    }

    // Phase 4: Compliance Check
    if (!this.complianceEngine.checkCompliance(finalTemplate, context)) {
      this.telemetryAgent.logEvent('template_blocked_by_compliance', { userId: context.userId, templateId: finalTemplate.id });
      // Decision-making: if non-compliant, serve a redacted/safe version or error.
      // For now, we will return a minimal safe default.
      console.warn(`[AIDrivenTemplateRegistry] Compliance check failed for ${finalTemplate.id}. Serving safe default.`);
      finalTemplate = this.getSafeDefaultTemplate(context.userId);
      selectedTemplateId = finalTemplate.id;
      templateSource = 'compliance_safe_default';
    }

    // Phase 5: Dynamic Adaptation (if not already fully AI-generated)
    if (templateSource !== 'generated' && finalTemplate.ai_confidence_score && finalTemplate.metadata.ai_confidence_score < 0.9) {
      // Simulate further adaptation of the existing template
      const adaptationPrompt = `Refine the layout and components of template '${finalTemplate.id}' for user '${context.userId}' considering their session history: ${context.sessionHistory.join(' -> ')}. Focus on: ${context.userIntent || 'general efficiency'}. Provide minor component adjustments.`;
      const adaptationResult = await this.circuitBreaker.execute(
        () => this.geminiConnector.invoke(adaptationPrompt, { template: finalTemplate, context }),
        async () => "Minor layout tweaks for better user engagement." // Fallback adaptation
      );

      // Apply simulated adaptation (this would parse the LLM's suggested changes and apply them)
      finalTemplate = {
        ...finalTemplate,
        metadata: {
          ...finalTemplate.metadata,
          ai_confidence_score: Math.min(finalTemplate.metadata.ai_confidence_score + 0.05, 0.99),
          last_adaptive_update: new Date().toISOString(),
          ai_adaptation_log: [...(finalTemplate.metadata.ai_adaptation_log || []), adaptationResult]
        },
        // Simulate minor changes to layout based on adaptationResult
        layout: finalTemplate.layout.map((item, index) => ({
          ...item,
          // Example: dynamically adjust size or order based on AI feedback
          size: index === 0 && Math.random() > 0.7 ? 12 : item.size // Simulate one component growing
        }))
      };
      console.log(`[AIDrivenTemplateRegistry] Applied dynamic adaptation to template ${finalTemplate.id}.`);
      templateSource = 'adapted_refined';
    }

    this.telemetryAgent.logEvent('template_served', {
      userId: context.userId,
      templateId: selectedTemplateId,
      source: templateSource,
      aiConfidence: finalTemplate.metadata.ai_confidence_score,
      version: finalTemplate.metadata.version
    });
    this.updateUserProfile(context.userId, selectedTemplateId!, 'view', context.sessionHistory[context.sessionHistory.length - 1]);

    return finalTemplate;
  }

  /**
   * Generates a brand new, highly adaptive template using the Gemini LLM.
   * This is a core feature of the self-building, self-expanding code.
   * @param context The request context for generation.
   * @returns The ID of the newly generated template.
   */
  private async generateNewTemplate(context: TemplateRequestContext): Promise<string> {
    const prompt = `Generate a JSON object representing a new DashboardProps template. Focus on product: '${context.preferredProduct || 'general'}', user intent: '${context.userIntent || 'data overview'}', and roles: '${context.userRoles.join(', ')}'. Include components like MetricCards, DataGrids, and Charts relevant to financial operations. Ensure the structure is valid for a DashboardProps. Also include 'metadata' in the root object.`;

    const llmResponse = await this.geminiConnector.invoke(prompt, context);
    this.billingService.recordLLMUsage(context.userId, 1, 200); // Higher cost for generation

    try {
      const generatedContent = JSON.parse(llmResponse);
      const newTemplateId = `ai_generated_${context.userId}_${Date.now()}`;

      const aiTemplate: AIDrivenDashboardTemplate = {
        id: newTemplateId,
        metadata: {
          description: generatedContent.metadata?.description || `AI-generated template for ${context.preferredProduct} by ${context.userId}.`,
          tags: ['AI-generated', 'dynamic', context.preferredProduct || 'general', ...context.userRoles],
          productLines: [context.preferredProduct || 'general'],
          accessRoles: context.userRoles,
          version: '1.0.AI-Gen',
          ai_confidence_score: 0.99, // High confidence for fresh generation
          last_adaptive_update: new Date().toISOString(),
          ai_generated_variant_id: `variant_${Date.now()}`
        },
        layout: generatedContent.layout || [] // Ensure layout is always an array
      };

      if (!aiTemplate.layout || aiTemplate.layout.length === 0) {
        throw new Error("Generated template has no layout components.");
      }

      this.registeredTemplates.set(newTemplateId, aiTemplate);
      this.templateMetadata.set(newTemplateId, aiTemplate.metadata);
      this.authService.updateAuthorization(newTemplateId, aiTemplate.metadata.accessRoles);

      this.telemetryAgent.logEvent('template_generated_new', { templateId: newTemplateId, context });
      console.log(`[AIDrivenTemplateRegistry] Successfully generated and registered new template: ${newTemplateId}`);
      return newTemplateId;
    } catch (error: any) {
      console.error(`[AIDrivenTemplateRegistry] Error parsing or registering AI-generated template: ${error.message}. Falling back to default.`);
      this.telemetryAgent.logEvent('template_generation_failed', { userId: context.userId, error: error.message, llmResponse });
      return 'default'; // Fallback
    }
  }

  /**
   * Processes user feedback to enable self-correction and continuous optimization.
   * This allows the system to learn and evolve.
   * @param feedback The feedback object.
   */
  public async learnFromFeedback(feedback: TemplateFeedback): Promise<void> {
    const { templateId, wasUseful, engagementScore, reason } = feedback;
    if (!this.registeredTemplates.has(templateId)) {
      console.warn(`[AIDrivenTemplateRegistry] Received feedback for unknown template ID: ${templateId}`);
      return;
    }

    if (!this.templateUsageHistory.has(templateId)) {
      this.templateUsageHistory.set(templateId, []);
    }
    this.templateUsageHistory.get(templateId)!.push(feedback);

    const template = this.registeredTemplates.get(templateId)!;
    const currentConfidence = template.metadata.ai_confidence_score || 0.5;

    let newConfidence = currentConfidence;
    if (wasUseful) {
      newConfidence = Math.min(1.0, currentConfidence + (engagementScore * 0.01)); // Boost confidence
    } else {
      newConfidence = Math.max(0.1, currentConfidence - (1.0 - engagementScore) * 0.05); // Reduce confidence
      // Introduce AI reasoning for why it failed
      const LLM_reasoning_prompt = `Template ${templateId} received negative feedback (engagement: ${engagementScore}, reason: '${reason || 'N/A'}'). Suggest specific improvements to its layout or component selection based on this feedback. Focus on 'payments' product if applicable.`;
      const aiImprovementSuggestion = await this.circuitBreaker.execute(
        () => this.geminiConnector.invoke(LLM_reasoning_prompt, { template, feedback }),
        async () => "Consider minor layout adjustments or a different primary metric for the 'payments' view."
      );
      template.metadata.ai_adaptation_log = [...(template.metadata.ai_adaptation_log || []), `Feedback-driven adaptation suggestion: ${aiImprovementSuggestion}`];
      console.log(`[AIDrivenTemplateRegistry] AI suggested improvement for ${templateId}: ${aiImprovementSuggestion}`);
      // In a real system, this would trigger an actual template modification process
    }

    template.metadata.ai_confidence_score = newConfidence;
    template.metadata.last_adaptive_update = new Date().toISOString();
    this.registeredTemplates.set(templateId, template); // Update the registry

    this.telemetryAgent.logEvent('template_feedback_processed', { templateId, wasUseful, engagementScore, newConfidence });
    console.log(`[AIDrivenTemplateRegistry] Processed feedback for ${templateId}. New AI Confidence: ${newConfidence.toFixed(2)}`);
  }

  /**
   * Predicts the optimal template for a user based on their profile and historical data.
   * This is part of the file's ability to remember, adapt, and predict.
   * @param userProfile The user's profile.
   * @param availableTemplateIds List of template IDs the user is authorized for.
   * @returns The ID of the predicted optimal template.
   */
  public async predictOptimalTemplate(userProfile: UserProfile, availableTemplateIds: string[]): Promise<string | null> {
    this.telemetryAgent.logEvent('predict_optimal_template', { userId: userProfile.userId });
    this.billingService.recordLLMUsage(userProfile.userId, 0, 5); // Minor cost for predictive analysis

    let bestTemplateId: string | null = null;
    let highestScore = -1;

    for (const templateId of availableTemplateIds) {
      const templateMeta = this.templateMetadata.get(templateId);
      if (!templateMeta) continue;

      let score = 0;

      // Factor 1: Historical Usage (prioritize frequently used and engaged templates)
      const historical = userProfile.historicalUsage[templateId];
      if (historical) {
        score += historical.views * 0.2; // View count
        score += historical.avgEngagement * 0.5; // Engagement is strong indicator
        const daysSinceLastAccess = (Date.now() - new Date(historical.lastAccessed).getTime()) / (1000 * 60 * 60 * 24);
        score -= daysSinceLastAccess * 0.01; // Decay over time
      }

      // Factor 2: User Preferences
      if (templateMeta.productLines.includes(userProfile.preferences.focusArea)) {
        score += 0.3;
      }
      // Add more sophisticated preference matching, e.g., density, theme
      // This would require templates to have metadata about their density/theme compatibility

      // Factor 3: AI Confidence Score
      score += (templateMeta.ai_confidence_score || 0.5) * 0.2; // AI's own confidence in the template

      // Factor 4: Contextual relevance (can be enhanced by LLM)
      const relevancePrompt = `Given user preferences (focus: ${userProfile.preferences.focusArea}) and template tags (${templateMeta.tags.join(',')}), score relevance (0-1).`;
      const llmRelevanceScoreString = await this.circuitBreaker.execute(
        () => this.geminiConnector.invoke(relevancePrompt, { userProfile, templateMeta }),
        async () => "0.5" // Fallback
      );
      const llmRelevanceScore = parseFloat(llmRelevanceScoreString) || 0.5;
      score += llmRelevanceScore * 0.1;

      console.log(`[AIDrivenTemplateRegistry] Prediction score for ${templateId} (user ${userProfile.userId}): ${score.toFixed(2)}`);

      if (score > highestScore) {
        highestScore = score;
        bestTemplateId = templateId;
      }
    }

    if (!bestTemplateId && availableTemplateIds.length > 0) {
      bestTemplateId = 'default'; // Fallback if no specific best is found
    }

    return bestTemplateId;
  }

  /**
   * Simulates dynamic scaling of backend resources based on anticipated load.
   * This demonstrates autonomous adaptation to production-grade patterns.
   * @param load The predicted load (e.g., number of concurrent users).
   */
  public dynamicallyScaleResources(load: number): void {
    let scaleAction = 'no_change';
    if (load > 1000) {
      scaleAction = 'scale_up_aggressive';
      console.log(`[AIDrivenTemplateRegistry] High load (${load}). Initiating aggressive scaling up of compute resources.`);
      // Trigger actual autoscaling groups, serverless function concurrency limits, etc.
    } else if (load > 500) {
      scaleAction = 'scale_up_moderate';
      console.log(`[AIDrivenTemplateRegistry] Moderate load (${load}). Scaling up compute resources.`);
    } else if (load < 100 && load > 0) {
      scaleAction = 'scale_down';
      console.log(`[AIDrivenTemplateRegistry] Low load (${load}). Scaling down idle resources.`);
    }
    this.telemetryAgent.logEvent('dynamic_scaling_action', { predictedLoad: load, action: scaleAction });
  }

  /**
   * Retrieves or creates a user profile.
   * @param userId The ID of the user.
   * @returns The user's profile.
   */
  private async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    if (this.userProfileCache.has(userId)) {
      return this.userProfileCache.get(userId);
    }
    // Simulate fetching from a user profile service or database
    await new Promise(resolve => setTimeout(50, resolve));
    const newProfile: UserProfile = {
      userId,
      preferences: {
        layoutDensity: 'standard',
        theme: 'light',
        focusArea: 'all'
      },
      historicalUsage: {},
      currentLocation: 'unknown'
    };
    this.userProfileCache.set(userId, newProfile);
    return newProfile;
  }

  /**
   * Updates a user's profile with new usage data.
   * @param userId The ID of the user.
   * @param templateId The template that was accessed.
   * @param action The action performed (e.g., 'view', 'interact').
   * @param currentPage The page where the action occurred.
   */
  private updateUserProfile(userId: string, templateId: string, action: 'view' | 'interact', currentPage: string): void {
    const userProfile = this.userProfileCache.get(userId);
    if (userProfile) {
      if (!userProfile.historicalUsage[templateId]) {
        userProfile.historicalUsage[templateId] = { views: 0, avgEngagement: 0, lastAccessed: '' };
      }
      userProfile.historicalUsage[templateId].views++;
      userProfile.historicalUsage[templateId].lastAccessed = new Date().toISOString();
      // Simulate engagement increase, could be more sophisticated
      userProfile.historicalUsage[templateId].avgEngagement =
        ((userProfile.historicalUsage[templateId].avgEngagement * (userProfile.historicalUsage[templateId].views - 1)) + (action === 'view' ? 0.5 : 1.0)) / userProfile.historicalUsage[templateId].views;
      userProfile.currentLocation = currentPage;
      this.userProfileCache.set(userId, userProfile);
      this.telemetryAgent.logEvent('user_profile_updated', { userId, templateId, action });
    }
  }

  /**
   * Provides a minimal, safe default template in case of compliance issues or critical errors.
   */
  private getSafeDefaultTemplate(userId: string): AIDrivenDashboardTemplate {
    return {
      id: 'safe_default',
      metadata: {
        description: `A minimal, safe default template provided due to system constraints or compliance.`,
        tags: ['system-safe', 'default', 'compliance'],
        productLines: ['general'],
        accessRoles: ['user'], // Broad access
        version: '1.0.Safe',
        ai_confidence_score: 0.1,
        last_adaptive_update: new Date().toISOString(),
        ai_adaptation_log: [`Served as fallback for user ${userId}`]
      },
      layout: [
        {
          component: 'CustomMetricCard',
          props: { title: 'Welcome', value: 'Data Restricted', trend: 'neutral' }
        },
        {
          component: 'CustomTextComponent',
          props: { text: 'Your full dashboard content is currently unavailable due to security or compliance policies. Please contact support if you believe this is an error.' }
        }
      ]
    };
  }
}

// Export a singleton instance of the AI-Driven Template Registry
// This makes the AI organism the central point of access for dashboard templates.
export const aiDrivenTemplateRegistry = AIDrivenTemplateRegistry.getInstance();

// The original `dashboardTemplates` is kept as per directive constraints,
// but its role shifts to being the initial seed data for the `AIDrivenTemplateRegistry`.
// It is no longer the primary access point for templates.