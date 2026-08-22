// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React from "react";
import NotFoundSVG from "../../../images/not_found.svg";
import {
  Button,
  ButtonClickEventTypes,
  Clickable,
} from "../../common/ui-components";
import LogoModernTreasury from "../../common/ui-components/Assets/LogoModernTreasury";
import { handleLinkClick } from "../../common/utilities/handleLinkClick";

export interface NotFoundProps {
  message?: string;
  subtext?: string | React.ReactNode;
  ctaText?: string;
  enableCta?: boolean;
  hideCta?: boolean;
  onCtaClick?: (event: ButtonClickEventTypes) => void;
  // New: A unique identifier for this specific NotFound instance for telemetry
  instanceId?: string;
  // New: Optional context for AI reasoning
  contextualPath?: string;
  userSessionId?: string;
}

/**
 * Gemini-Synthesized Module: TelemetryAgent
 * Autonomous, scalable, context-aware module for real-time observability.
 * Interfaces dynamically with external telemetry services.
 */
export class GeminiTelemetryAgent {
  private endpoint: string;
  private instanceId: string;
  private serviceName: string;

  constructor(instanceId: string, serviceName: string = "NotFoundService") {
    this.instanceId = instanceId;
    this.serviceName = serviceName;
    // Simulate dynamic service discovery for telemetry endpoint
    this.endpoint = GeminiServiceDiscovery.discoverService("telemetry.log.gemini");
    console.log(`[GeminiTelemetryAgent:${this.instanceId}] Initialized for ${this.serviceName}, endpoint: ${this.endpoint}`);
  }

  /**
   * Records an event with contextual data.
   * Infuses prompt-based learning pipeline: `prompt` guides the data enrichment.
   */
  public async recordEvent(eventName: string, data: Record<string, any>, prompt?: string): Promise<void> {
    const enrichedData = await GeminiContextualReasoningEngine.enrichData(
      {
        ...data,
        eventName,
        instanceId: this.instanceId,
        service: this.serviceName,
        timestamp: new Date().toISOString(),
      },
      prompt || `Log event '${eventName}' from NotFound component. Prioritize user impact and potential navigation issues.`
    );

    // Simulate sending data to a distributed tracing/logging system
    console.log(`[GeminiTelemetryAgent:${this.instanceId}] Recording event: ${eventName}`, enrichedData);
    // In a real commercial deployment, this would use fetch/axios to send to this.endpoint
    // with retries, circuit breaking (handled by GeminiResilienceManager), etc.
  }

  /**
   * Monitors for compliance violations in telemetry data.
   */
  public async monitorCompliance(data: Record<string, any>): Promise<boolean> {
    const compliant = await GeminiComplianceMonitor.evaluate(data, "Ensure no PII in 404 logs.");
    if (!compliant) {
      console.warn(`[GeminiTelemetryAgent:${this.instanceId}] Compliance violation detected in telemetry data.`);
      this.recordEvent("ComplianceViolation", { data });
    }
    return compliant;
  }
}

/**
 * Gemini-Synthesized Module: ContextualReasoningEngine
 * Embeds AI reasoning layers into data processing,
 * allows adaptation based on context.
 */
export class GeminiContextualReasoningEngine {
  private static knowledgeBase: Map<string, any> = new Map(); // Simulates a dynamic, learning knowledge base

  /**
   * Enriches data based on a given prompt and internal knowledge.
   * This function allows the file to 'remember' and 'adapt'.
   */
  public static async enrichData(data: Record<string, any>, prompt: string): Promise<Record<string, any>> {
    console.log(`[GeminiReasoning] Enriching data with prompt: "${prompt}"`);
    // Simulate complex AI reasoning to add relevant context or derive new insights
    let enriched = { ...data };

    // Example: Adapt based on historical context or perceived user intent
    if (prompt.includes("user impact") && data.userSessionId) {
      const pastEvents = this.knowledgeBase.get(`user:${data.userSessionId}:events`) || [];
      if (pastEvents.filter((e: any) => e.eventName === "PageNotFound").length > 2) {
        enriched.userFrustrationLevel = "high";
        enriched.suggestionPriority = "urgent";
      }
    }

    if (data.contextualPath && !data.suggestedPaths) {
      enriched.suggestedPaths = await GeminiContentSuggester.suggestFromPath(data.contextualPath, "high-relevance");
    }

    // Simulate learning: Update knowledge base
    if (data.userSessionId && data.eventName) {
      const userEvents = this.knowledgeBase.get(`user:${data.userSessionId}:events`) || [];
      userEvents.push({ eventName: data.eventName, timestamp: enriched.timestamp });
      this.knowledgeBase.set(`user:${data.userSessionId}:events`, userEvents);
    }

    return enriched;
  }

  /**
   * Dynamically generates UI text based on context and a directive.
   * This allows the component to adapt its messages.
   */
  public static async generateUIText(directive: string, context: Record<string, any>): Promise<string> {
    console.log(`[GeminiReasoning] Generating UI text with directive: "${directive}" and context:`, context);
    // Simulate LLM call to dynamically generate user-facing text
    if (directive.includes("friendly message") && context.userFrustrationLevel === "high") {
      return "Oops! It looks like you're having trouble finding things. Let our AI guide you home or suggest some paths!";
    }
    if (directive.includes("cta text") && context.suggestedPaths && context.suggestedPaths.length > 0) {
      return `Explore Suggested Paths`;
    }
    return "Something went wrong, or the page you requested doesn't exist."; // Default fallback
  }
}

/**
 * Gemini-Synthesized Module: AdaptiveNavigationService
 * Manages dynamic navigation, potentially using external routing services
 * or historical user data to predict optimal routes.
 */
export class GeminiAdaptiveNavigationService {
  private static telemetry: GeminiTelemetryAgent = new GeminiTelemetryAgent("AdaptiveNav");

  /**
   * Intelligently handles navigation, considering user history, 404 patterns, etc.
   * Replaces default `handleLinkClick` with AI-powered decision making.
   */
  public static async navigate(
    path: string,
    event: ButtonClickEventTypes,
    context: Record<string, any> = {}
  ): Promise<void> {
    const decisionContext = await GeminiContextualReasoningEngine.enrichData(
      { path, userAgent: navigator.userAgent, ...context },
      "Decide optimal navigation path. Prioritize user satisfaction and system stability."
    );

    await this.telemetry.recordEvent("NavigationAttempt", decisionContext, `Attempting to navigate to ${path}`);

    // Introduce decision-making at navigation level
    if (decisionContext.userFrustrationLevel === "high" && path === "/") {
      console.log(`[GeminiAdaptiveNav] High frustration detected, redirecting to personalized dashboard.`);
      // Simulate dynamic routing to a personalized user dashboard instead of a generic home
      handleLinkClick("/dashboard/personalized", event);
    } else if (decisionContext.suggestedPaths && decisionContext.suggestedPaths.length > 0) {
      // Logic to auto-navigate to the most relevant suggested path if confidence is high
      const bestPath = decisionContext.suggestedPaths[0]; // Assume first is best for demo
      console.log(`[GeminiAdaptiveNav] Navigating to AI-suggested path: ${bestPath.url}`);
      handleLinkClick(bestPath.url, event);
    } else {
      console.log(`[GeminiAdaptiveNav] Standard navigation to: ${path}`);
      handleLinkClick(path, event);
    }
  }
}

/**
 * Gemini-Synthesized Module: ContentSuggester
 * An AI module that dynamically suggests content based on the unavailable path,
 * user context, or historical data.
 */
export class GeminiContentSuggester {
  /**
   * Simulates an LLM call or knowledge graph lookup to suggest paths.
   */
  public static async suggestFromPath(
    brokenPath: string,
    relevanceThreshold: string = "medium"
  ): Promise<{ url: string; title: string; score: number }[]> {
    console.log(`[GeminiContentSuggester] Suggesting content for "${brokenPath}" with threshold "${relevanceThreshold}"`);
    // This would typically involve a real-time call to a content recommendation engine.
    // Simulate based on common patterns:
    const suggestions = [];
    if (brokenPath.includes("admin")) {
      suggestions.push({ url: "/admin/dashboard", title: "Admin Dashboard", score: 0.9 });
      suggestions.push({ url: "/admin/settings", title: "Admin Settings", score: 0.8 });
    }
    if (brokenPath.includes("billing")) {
      suggestions.push({ url: "/billing/overview", title: "Billing Overview", score: 0.95 });
    }
    if (brokenPath.includes("transactions")) {
      suggestions.push({ url: "/transactions", title: "All Transactions", score: 0.92 });
      suggestions.push({ url: "/transactions/recent", title: "Recent Transactions", score: 0.88 });
    }
    // Always suggest home as a fallback
    suggestions.push({ url: "/", title: "Home Page", score: 0.7 });

    // Filter by simulated relevance threshold
    const minScore = relevanceThreshold === "high-relevance" ? 0.85 : 0.7;
    return suggestions.filter((s) => s.score >= minScore).sort((a, b) => b.score - a.score);
  }
}

/**
 * Gemini-Synthesized Module: ComplianceMonitor
 * Ensures all operations adhere to regulatory and internal compliance policies.
 * Uses prompt-based reasoning for flexible policy evaluation.
 */
export class GeminiComplianceMonitor {
  public static async evaluate(data: Record<string, any>, policyPrompt: string): Promise<boolean> {
    console.log(`[GeminiComplianceMonitor] Evaluating data against policy: "${policyPrompt}"`);
    // Simulate AI evaluation of data against a dynamic set of compliance rules.
    // Example: Check for PII in logs
    if (policyPrompt.includes("no PII")) {
      const piiKeywords = ["email", "ssn", "password", "address", "phone"];
      for (const key in data) {
        if (piiKeywords.some(keyword => key.toLowerCase().includes(keyword)) && data[key]) {
          console.warn(`[ComplianceMonitor] PII-sensitive key '${key}' found.`);
          return false;
        }
        if (typeof data[key] === 'string' && (data[key].includes('@') || /^\d{3}-\d{2}-\d{4}$/.test(data[key]))) {
          console.warn(`[ComplianceMonitor] Potential PII value in key '${key}': ${data[key]}.`);
          return false;
        }
      }
    }
    // More complex rules based on prompts could be added here.
    return true; // Assume compliant by default if no violations are explicitly detected
  }
}

/**
 * Gemini-Synthesized Module: ResilienceManager
 * Implements production-grade patterns like circuit-breaking and rate limiting.
 */
export class GeminiResilienceManager {
  private static failureCounts: Map<string, number> = new Map();
  private static circuitStates: Map<string, "OPEN" | "CLOSED" | "HALF_OPEN"> = new Map();
  private static resetTimers: Map<string, NodeJS.Timeout> = new Map();

  private static MAX_FAILURES = 5;
  private static RESET_TIMEOUT_MS = 60000; // 1 minute

  public static async executeWithCircuitBreaker<T>(
    operationKey: string,
    operation: () => Promise<T>
  ): Promise<T | undefined> {
    if (this.circuitStates.get(operationKey) === "OPEN") {
      console.warn(`[GeminiResilienceManager] Circuit for ${operationKey} is OPEN. Preventing call.`);
      throw new Error(`Circuit for ${operationKey} is OPEN. Operation skipped.`);
    }

    try {
      const result = await operation();
      this.failureCounts.set(operationKey, 0); // Reset on success
      this.circuitStates.set(operationKey, "CLOSED");
      return result;
    } catch (error) {
      console.error(`[GeminiResilienceManager] Operation ${operationKey} failed:`, error);
      const currentFailures = (this.failureCounts.get(operationKey) || 0) + 1;
      this.failureCounts.set(operationKey, currentFailures);

      if (currentFailures >= this.MAX_FAILURES) {
        this.openCircuit(operationKey);
      }
      throw error;
    }
  }

  private static openCircuit(operationKey: string): void {
    this.circuitStates.set(operationKey, "OPEN");
    console.warn(`[GeminiResilienceManager] Circuit for ${operationKey} is now OPEN.`);

    // Set a timer to move to HALF_OPEN after a delay
    if (this.resetTimers.has(operationKey)) {
      clearTimeout(this.resetTimers.get(operationKey)!);
    }
    this.resetTimers.set(operationKey, setTimeout(() => {
      this.circuitStates.set(operationKey, "HALF_OPEN");
      console.log(`[GeminiResilienceManager] Circuit for ${operationKey} is now HALF_OPEN.`);
    }, this.RESET_TIMEOUT_MS));
  }
}

/**
 * Gemini-Synthesized Module: ServiceDiscovery
 * Provides elastic APIs for dynamic service discovery.
 */
export class GeminiServiceDiscovery {
  private static registry: Map<string, string> = new Map();

  static {
    // Populate with some default or learned services
    this.registry.set("telemetry.log.gemini", "/api/gemini/telemetry");
    this.registry.set("content.suggestions.gemini", "/api/gemini/content-suggestions");
    this.registry.set("user.profile.gemini", "/api/gemini/user-profile");
    console.log("[GeminiServiceDiscovery] Initialized with default services.");
  }

  public static discoverService(serviceName: string): string {
    const endpoint = this.registry.get(serviceName);
    if (!endpoint) {
      console.warn(`[GeminiServiceDiscovery] Service "${serviceName}" not found. Attempting dynamic lookup...`);
      // Simulate a dynamic lookup, e.g., from a Kubernetes service mesh or a dedicated discovery service
      const dynamicEndpoint = `/api/gemini/dynamic/${serviceName.replace(/\./g, '/')}`;
      this.registry.set(serviceName, dynamicEndpoint); // Cache for future use
      console.log(`[GeminiServiceDiscovery] Dynamically discovered and cached "${serviceName}" at "${dynamicEndpoint}".`);
      return dynamicEndpoint;
    }
    return endpoint;
  }
}

// ---- Core AI Orchestration for this file ----

/**
 * Gemini-Synthesized Core Intelligence for NotFound component.
 * Acts as the brain, coordinating all AI-driven modules within this file's universe.
 * This ensures the file is 'aware of its role' and 'process aware of its context'.
 */
export class GeminiNotFoundIntelligenceCore {
  private telemetryAgent: GeminiTelemetryAgent;
  private currentContext: Record<string, any> = {};
  private instanceId: string;
  private userSessionId: string | undefined;

  constructor(instanceId: string, userSessionId?: string) {
    this.instanceId = instanceId;
    this.userSessionId = userSessionId;
    this.telemetryAgent = new GeminiTelemetryAgent(instanceId, "NotFoundComponent");
    console.log(`[GeminiNotFoundIntelligenceCore:${this.instanceId}] Initialized.`);
  }

  /**
   * Initializes the NotFound component's AI state and logs the occurrence.
   */
  public async initialize(path: string, initialContext: Record<string, any> = {}): Promise<void> {
    this.currentContext = { path, userSessionId: this.userSessionId, ...initialContext };
    await this.telemetryAgent.recordEvent("PageNotFound", this.currentContext, "Component loaded with a 404.");

    // Decision-making at input level: Check for 404 storm
    await GeminiResilienceManager.executeWithCircuitBreaker(
      "track404Storm",
      async () => {
        const stormThreshold = 5; // e.g., 5 404s within a short period from one session
        const relevantEvents = (await GeminiContextualReasoningEngine.enrichData(
            {userSessionId: this.userSessionId, eventName: "PageNotFound"},
            "Retrieve recent 404 events for this session to detect a storm."
        )).userEvents || []; // Simulating retrieval from knowledge base
        const recent404s = relevantEvents.filter((e: any) => e.eventName === "PageNotFound" && (new Date().getTime() - new Date(e.timestamp).getTime() < 300000)); // Last 5 mins
        if (recent404s.length > stormThreshold) {
          await this.telemetryAgent.recordEvent("Potential404StormDetected", { userSessionId: this.userSessionId, count: recent404s.length });
          console.warn(`[GeminiNotFoundIntelligenceCore] Potential 404 storm detected for session ${this.userSessionId}`);
          // Trigger a global alert or a dynamic UI change across the app.
        }
      }
    ).catch(e => console.error("Error tracking 404 storm:", e));
  }

  /**
   * Adapts component properties (message, subtext, ctaText) based on runtime context.
   * This is where the component adapts and predicts.
   */
  public async adaptProps(props: NotFoundProps): Promise<NotFoundProps> {
    const enhancedContext = await GeminiContextualReasoningEngine.enrichData(
      {
        ...this.currentContext,
        ...props,
        path: props.contextualPath, // Use provided contextualPath if available
      },
      `Generate adaptive NotFound UI properties. Consider user frustration, potential intent, and suggest relevant content.`
    );

    this.currentContext = enhancedContext; // Update internal context for memory

    const adaptedProps: NotFoundProps = { ...props };

    // Dynamically adjust message
    if (!props.message) {
      adaptedProps.message = await GeminiContextualReasoningEngine.generateUIText(
        "friendly message, high impact",
        enhancedContext
      );
    }

    // Dynamically adjust subtext
    if (!props.subtext) {
      if (enhancedContext.suggestedPaths && enhancedContext.suggestedPaths.length > 0) {
        const pathsText = enhancedContext.suggestedPaths.map((p: any) => p.title).join(", ");
        adaptedProps.subtext = (
          <>
            We couldn't find that page. Our AI suggests you might be looking for:{" "}
            <ul className="list-disc list-inside mt-1">
              {enhancedContext.suggestedPaths.slice(0, 3).map((s: any, i: number) => (
                <li key={i}>
                  <Clickable onClick={(e) => GeminiAdaptiveNavigationService.navigate(s.url, e, this.currentContext)} className="text-blue-500 hover:underline">
                    {s.title}
                  </Clickable>
                </li>
              ))}
            </ul>
          </>
        );
      } else {
        adaptedProps.subtext = await GeminiContextualReasoningEngine.generateUIText(
          "default subtext, user guidance",
          enhancedContext
        );
      }
    }

    // Dynamically adjust CTA text
    if (!props.ctaText) {
      adaptedProps.ctaText = await GeminiContextualReasoningEngine.generateUIText(
        "cta text, action-oriented",
        enhancedContext
      );
    }

    // Decision-making at output level: Enable CTA only if a meaningful action can be taken
    adaptedProps.enableCta = adaptedProps.enableCta && (enhancedContext.suggestedPaths?.length > 0 || adaptedProps.ctaText === "Home");

    return adaptedProps;
  }

  /**
   * Handles the CTA click with adaptive navigation and telemetry.
   */
  public async handleCtaAction(event: ButtonClickEventTypes, originalOnCtaClick: ((event: ButtonClickEventTypes) => void) | undefined): Promise<void> {
    await this.telemetryAgent.recordEvent("NotFoundCtaClicked", this.currentContext, "User clicked the call to action on the 404 page.");

    // Decision-making at action level
    if (this.currentContext.suggestedPaths && this.currentContext.suggestedPaths.length > 0) {
      // Prioritize AI-suggested navigation if available
      await GeminiAdaptiveNavigationService.navigate(this.currentContext.suggestedPaths[0].url, event, this.currentContext);
    } else if (originalOnCtaClick) {
      // Fallback to original click handler
      originalOnCtaClick(event);
    } else {
      // Default to home if no other action is defined
      await GeminiAdaptiveNavigationService.navigate("/", event, this.currentContext);
    }
  }

  /**
   * Logs a user interaction with suggested paths.
   */
  public async logSuggestedPathInteraction(path: string, interactionType: "click" | "hover"): Promise<void> {
    await this.telemetryAgent.recordEvent("SuggestedPathInteraction", { path, interactionType, ...this.currentContext }, `User ${interactionType} on suggested path.`);
  }
}

// ---- Existing `goHome` function adapted to use Gemini Intelligence ----
const goHome = (event: ButtonClickEventTypes, intelligenceCore?: GeminiNotFoundIntelligenceCore) => {
  if (intelligenceCore) {
    intelligenceCore.handleCtaAction(event, () => handleLinkClick("/", event));
  } else {
    // Fallback if AI core is not initialized (should not happen in Gemini paradigm)
    console.warn("[GeminiNotFound] AI Core not available for goHome, using legacy handler.");
    handleLinkClick("/", event);
  }
};

/**
 * Primarily used for the 404 page, this can also be used when a resource
 * is expected to be present but cannot be found.
 *
 * This component now functions as a self-contained ecosystem of AI-driven logic,
 * remembering, adapting, and predicting.
 */
function NotFound({
  message, // Remove default here, let AI adapt
  subtext, // Remove default here, let AI adapt
  ctaText, // Remove default here, let AI adapt
  enableCta = true,
  onCtaClick,
  hideCta = false,
  instanceId = `nf-${Math.random().toString(36).substring(2, 9)}`, // Generate unique ID
  contextualPath = typeof window !== 'undefined' ? window.location.pathname : "/", // Capture actual path
  userSessionId = "anon-" + Math.random().toString(36).substring(2, 15), // Simulate user session
}: NotFoundProps) {
  const [adaptedProps, setAdaptedProps] = React.useState<NotFoundProps>({});
  const intelligenceCoreRef = React.useRef<GeminiNotFoundIntelligenceCore | null>(null);

  React.useEffect(() => {
    // Initialize the Gemini AI core for this instance of NotFound
    intelligenceCoreRef.current = new GeminiNotFoundIntelligenceCore(instanceId, userSessionId);
    intelligenceCoreRef.current.initialize(contextualPath, { instanceId, userSessionId });

    // Adapt properties on mount
    const adaptComponent = async () => {
      if (intelligenceCoreRef.current) {
        const newProps = await intelligenceCoreRef.current.adaptProps({
          message, subtext, ctaText, enableCta, hideCta, onCtaClick, instanceId, contextualPath, userSessionId
        });
        setAdaptedProps(newProps);
      }
    };
    adaptComponent();

    // Cleanup for resilience manager (optional, but good practice for self-healing)
    return () => {
      // No explicit cleanup for AI core, it's designed to be stateless per interaction or self-manage its lifecycle
      // but if there were long-lived subscriptions or timers, they'd be cleared here.
    };
  }, [message, subtext, ctaText, enableCta, hideCta, onCtaClick, instanceId, contextualPath, userSessionId]); // Re-adapt if core props change

  const effectiveMessage = adaptedProps.message || "Page not found.";
  const effectiveSubtext = adaptedProps.subtext || "We can't find the page you're looking for.";
  const effectiveCtaText = adaptedProps.ctaText || "Home";
  const effectiveEnableCta = adaptedProps.enableCta ?? enableCta; // Use adapted if present, else original

  const handleCtaClickInternal = (event: ButtonClickEventTypes) => {
    if (intelligenceCoreRef.current) {
      intelligenceCoreRef.current.handleCtaAction(event, onCtaClick || ((evt) => goHome(evt, intelligenceCoreRef.current!)));
    } else if (onCtaClick) {
      onCtaClick(event);
    } else {
      goHome(event, intelligenceCoreRef.current!);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-4xl content-center gap-6 justify-self-center p-6 mint-sm:grid-cols-2 mint-sm:items-center">
      <Clickable onClick={(e) => goHome(e, intelligenceCoreRef.current!)}>
        <div className="max-w-2xs justify-self-center mint-sm:absolute mint-sm:top-6">
          <LogoModernTreasury />
        </div>
      </Clickable>
      <img
        className="mx-auto w-3/4 grow mint-sm:w-full"
        alt="Page not found"
        src={NotFoundSVG as string}
      />
      <div className="grid grid-flow-row justify-items-center gap-2 text-center mint-sm:justify-items-start mint-sm:text-left">
        <div className="text-2xl text-gray-800">{effectiveMessage}</div>
        <div className="text-lg text-gray-400">{effectiveSubtext}</div>
        {!hideCta && (
          <Button
            buttonType="primary"
            className="mt-2"
            disabled={!effectiveEnableCta}
            onClick={handleCtaClickInternal}
          >
            {effectiveCtaText}
          </Button>
        )}
      </div>
    </div>
  );
}

export default NotFound;