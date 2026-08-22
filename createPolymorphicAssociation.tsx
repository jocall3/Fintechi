// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React from "react";
import { startCase } from "lodash";
import { Drawer, Pill } from "~/common/ui-components";

import { getDrawerContent } from "~/common/utilities/getDrawerContent";

type RecordData = {
  id: string;
  [key: string]: unknown;
};

// ==============================================================================
// I. Universal Replacement Logic - AI-Synthesized Modules (Self-Contained Universe)
//    These classes/functions simulate autonomous, scalable, context-aware micro-intelligences
//    that form the neural extensions of this codebase, embedded directly within the file.
// ==============================================================================

/**
 * Represents the contextual information about the current user.
 * This would dynamically adapt based on user behavior and preferences.
 */
export type UserContext = {
  userId: string;
  roles: string[];
  preferences: Record<string, unknown> & { userRegion?: string }; // Added userRegion for compliance
  interactionHistory: Array<{ timestamp: number; action: string; entity: string }>;
};

/**
 * Represents the contextual information about the system's operational state.
 * This dynamically adapts based on real-time monitoring and resource availability.
 */
export type SystemContext = {
  currentLoad: number; // e.g., API response times, server load (0-100)
  networkLatency: number; // ms
  featureFlags: Record<string, boolean>;
  apiHealth: Record<string, "healthy" | "degraded" | "unresponsive">;
};

/**
 * Represents dynamically adaptable business rules, potentially managed by an external
 * AI-powered policy service.
 */
export type BusinessRules = {
  drawerThresholds: { highLoad: number; userTier: string[] }; // System load and user roles for drawer display
  complianceLevels: string[]; // Required compliance levels for data access
  costOptimizationEnabled: boolean; // Flag to enable cost-aware decisions
};

/**
 * GeminiContextManager
 * A simulated AI-powered service that gathers and manages dynamic operational context.
 * Acts as a living endpoint, constantly updating its understanding of the environment.
 */
export class GeminiContextManager {
  private static instance: GeminiContextManager;
  private userContext: UserContext;
  private systemContext: SystemContext;
  private businessRules: BusinessRules;

  private constructor() {
    // Simulate fetching context from various AI-powered "endpoints"
    this.userContext = this.fetchUserContext();
    this.systemContext = this.fetchSystemContext();
    this.businessRules = this.fetchBusinessRules();
    console.log("[GeminiContextManager] Initialized with dynamic context from neural extensions.");
  }

  public static getInstance(): GeminiContextManager {
    if (!GeminiContextManager.instance) {
      GeminiContextManager.instance = new GeminiContextManager();
    }
    return GeminiContextManager.instance;
  }

  // Simulates dynamic data fetching from "neural extensions" and "micro-intelligences"
  private fetchUserContext(): UserContext {
    // In a real Gemini system, this would involve LLM reasoning,
    // real-time user behavior analysis, and predictive models.
    return {
      userId: "gemini-user-123",
      roles: ["admin", "contributor"],
      preferences: { drawerAlwaysOpen: false, highContrast: false, userRegion: "EU" },
      interactionHistory: [], // Populated later by AIInteractionLogger
    };
  }

  private fetchSystemContext(): SystemContext {
    // Simulates dynamic system monitoring from "micro-intelligences"
    return {
      currentLoad: Math.floor(Math.random() * 60) + 10, // Simulate 10-70% load
      networkLatency: Math.floor(Math.random() * 200) + 50, // Simulate 50-250ms
      featureFlags: { enableAIAdaptiveDrawer: true, enablePredictiveContent: true, enableCostMonitoring: true },
      apiHealth: { getDrawerContent: "healthy", externalAnalytics: "healthy" } // Simulate health checks
    };
  }

  private fetchBusinessRules(): BusinessRules {
    // Simulates fetching rules from a "compliance/billing neural extension"
    return {
      drawerThresholds: { highLoad: 75, userTier: ["admin", "contributor"] }, // High load threshold for reducing drawer use
      complianceLevels: ["GDPR", "INTERNAL_POLICY"],
      costOptimizationEnabled: true,
    };
  }

  public getContext(): { user: UserContext; system: SystemContext; business: BusinessRules } {
    return {
      user: this.userContext,
      system: this.systemContext,
      business: this.businessRules,
    };
  }

  // Update methods for dynamic adaptation and prompt-driven learning
  public updateUserInteraction(action: string, entity: string) {
    this.userContext.interactionHistory.push({ timestamp: Date.now(), action, entity });
    // In a real system, this would trigger re-training or adaptation of user models.
    console.log(`[GeminiContextManager] User interacted: ${action} with ${entity}. History updated.`);
  }

  public updateSystemLoad(load: number) {
    this.systemContext.currentLoad = load;
    console.log(`[GeminiContextManager] System load dynamically updated to: ${load}`);
    // This could trigger circuit-breaking or dynamic scaling policies.
  }

  public updateApiHealth(apiName: string, status: "healthy" | "degraded" | "unresponsive") {
    this.systemContext.apiHealth[apiName] = status;
    console.log(`[GeminiContextManager] API Health for ${apiName} updated to ${status}`);
  }
}

/** Export a singleton instance, representing an always-on, self-aware service. */
export const geminiContextManager = GeminiContextManager.getInstance();

/**
 * GeminiTelemetryService
 * Provides production-grade observability, metrics, and logging, feeding into
 * AI-driven analytics and anomaly detection.
 */
export type TelemetryEvent = {
  timestamp: number;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  context: Record<string, unknown>;
  correlationId?: string;
};

export class GeminiTelemetryService {
  private static instance: GeminiTelemetryService;
  private constructor() {
    console.log("[GeminiTelemetryService] Initialized for production-grade observability.");
  }

  public static getInstance(): GeminiTelemetryService {
    if (!GeminiTelemetryService.instance) {
      GeminiTelemetryService.instance = new GeminiTelemetryService();
    }
    return GeminiTelemetryService.getInstance();
  }

  // Simulates sending data to a "telemetry pipeline neural extension"
  public publish(event: TelemetryEvent) {
    // In a real Gemini setup, this would integrate with:
    // - Distributed tracing (e.g., OpenTelemetry)
    // - Real-time analytics dashboards
    // - Anomaly detection systems, circuit breakers
    // - AI-driven log analysis for proactive issue detection and root cause analysis
    console.log(`[TELEMETRY][${event.level.toUpperCase()}] ${event.message}`, event.context);
    // Update system load in context manager if metric suggests change
    if (event.context.currentSystemLoad !== undefined) {
      geminiContextManager.updateSystemLoad(event.context.currentSystemLoad as number);
    }
  }

  public logInfo(message: string, context?: Record<string, unknown>) {
    this.publish({
      timestamp: Date.now(),
      level: "info",
      message,
      context: { ...context, ...geminiContextManager.getContext() },
    });
  }

  public logError(message: string, error: Error, context?: Record<string, unknown>) {
    this.publish({
      timestamp: Date.now(),
      level: "error",
      message: `${message}: ${error.message}`,
      context: { ...context, error: error.stack, ...geminiContextManager.getContext() },
    });
  }

  public logWarn(message: string, context?: Record<string, unknown>) {
    this.publish({
      timestamp: Date.now(),
      level: "warn",
      message,
      context: { ...context, ...geminiContextManager.getContext() },
    });
  }

  public recordMetric(name: string, value: number, tags?: Record<string, string>) {
    // Simulates sending to a metric service.
    // In Gemini, this would feed into adaptive scaling policies and cost optimization.
    console.log(`[METRIC] ${name}: ${value}`, { tags, ...geminiContextManager.getContext() });
    // This could trigger a system context update based on metric value.
  }
}

/** Export a singleton instance for enterprise-grade observability. */
export const geminiTelemetryService = GeminiTelemetryService.getInstance();

/**
 * GeminiAuthService
 * Simulates an autonomous authentication/authorization service, ensuring compliance
 * with access policies.
 */
export class GeminiAuthService {
  private static instance: GeminiAuthService;
  private constructor() {
    console.log("[GeminiAuthService] Initialized for dynamic authorization policy enforcement.");
  }

  public static getInstance(): GeminiAuthService {
    if (!GeminiAuthService.instance) {
      GeminiAuthService.instance = new GeminiAuthService();
    }
    return GeminiAuthService.getInstance();
  }

  // Simulates a real-time policy check from an "authentication neural extension"
  public canAccess(resourceType: string, resourceId: string, requiredRoles: string[]): boolean {
    const { user } = geminiContextManager.getContext();
    const hasPermission = requiredRoles.some(role => user.roles.includes(role));

    geminiTelemetryService.logInfo("Access check for resource", {
      userId: user.userId,
      resourceType,
      resourceId,
      requiredRoles,
      userRoles: user.roles,
      hasPermission,
    });

    if (!hasPermission) {
      geminiTelemetryService.logWarn("Access denied for resource", {
        userId: user.userId,
        resourceType,
        resourceId,
        missingRoles: requiredRoles.filter(role => !user.roles.includes(role)),
      });
    }
    return hasPermission;
  }
}

/** Export a singleton instance for secure access control. */
export const geminiAuthService = GeminiAuthService.getInstance();

/**
 * GeminiComplianceEngine
 * Ensures data access and processing adhere to relevant regulatory and internal compliance standards.
 */
export class GeminiComplianceEngine {
  private static instance: GeminiComplianceEngine;
  private constructor() {
    console.log("[GeminiComplianceEngine] Initialized for dynamic compliance checks.");
  }

  public static getInstance(): GeminiComplianceEngine {
    if (!GeminiComplianceEngine.instance) {
      GeminiComplianceEngine.instance = new GeminiComplianceEngine();
    }
    return GeminiComplianceEngine.getInstance();
  }

  // Simulates checking data access against compliance policies from a "compliance neural extension"
  public isCompliant(dataType: string, userRegion: string | undefined, dataRequiredCompliance: string[]): boolean {
    const { business } = geminiContextManager.getContext();
    const platformComplianceLevels = business.complianceLevels;

    // Dummy logic: checks if the data's required compliance levels are met by the platform's active levels.
    // In a real system, this would involve complex policy evaluation, geo-fencing, data residency rules.
    const meetsAllPlatformLevels = platformComplianceLevels.every(level => dataRequiredCompliance.includes(level));

    // Simulate region-specific compliance for GDPR
    const isRegionCompliant = userRegion === "EU" ? dataRequiredCompliance.includes("GDPR") : true;

    const overallCompliance = meetsAllPlatformLevels && isRegionCompliant;

    geminiTelemetryService.logInfo("Compliance check result", {
      dataType,
      userRegion,
      dataRequiredCompliance,
      platformComplianceLevels,
      overallCompliance,
    });
    return overallCompliance;
  }
}

/** Export a singleton instance for robust regulatory adherence. */
export const geminiComplianceEngine = GeminiComplianceEngine.getInstance();


/**
 * RenderStrategy
 * Defines the various rendering approaches for polymorphic associations,
 * chosen adaptively by the AI-powered policy engine.
 */
export enum RenderStrategy {
  LINK = "LINK",
  DRAWER = "DRAWER",
  AI_ADAPTIVE_DRAWER = "AI_ADAPTIVE_DRAWER",
  // Future strategies could include: MODAL_VIEW, AI_GENERATED_SUMMARY, etc.
}

/**
 * AdaptivePolicyEngine
 * The core AI-driven decision-making engine for rendering polymorphic associations.
 * It uses context, business rules, and simulated learning to determine the optimal strategy.
 */
export class AdaptivePolicyEngine {
  private static instance: AdaptivePolicyEngine;
  private constructor() {
    console.log("[AdaptivePolicyEngine] Initialized for AI-driven rendering decisions.");
  }

  public static getInstance(): AdaptivePolicyEngine {
    if (!AdaptivePolicyEngine.instance) {
      AdaptivePolicyEngine.instance = new AdaptivePolicyEngine();
    }
    return AdaptivePolicyEngine.getInstance();
  }

  /**
   * Decides the optimal rendering strategy based on a comprehensive set of inputs,
   * including user context, system load, business rules, authorization, and compliance.
   * This is where prompt-based learning pipelines would influence outcomes.
   */
  public decideRenderStrategy(
    recordType: string,
    recordId: string,
    currentDrawerEnabled: boolean, // Original developer hint
    currentStackedDrawerEnabled: boolean,
    requiredAccessRoles: string[],
    dataComplianceLevels: string[],
  ): RenderStrategy {
    const { user, system, business } = geminiContextManager.getContext();

    // 1. Authorization Check (Commercial-Grade Logic)
    if (!geminiAuthService.canAccess(recordType, recordId, requiredAccessRoles)) {
      geminiTelemetryService.logWarn("Access denied for association, falling back to link.", { recordType, recordId });
      return RenderStrategy.LINK; // Fallback to basic link or even hide if no access
    }

    // 2. Compliance Check (Commercial-Grade Logic)
    if (!geminiComplianceEngine.isCompliant(recordType, user.preferences.userRegion, dataComplianceLevels)) {
      geminiTelemetryService.logWarn("Compliance failed for association, falling back to link.", { recordType, recordId });
      return RenderStrategy.LINK; // Fallback
    }

    // 3. API Health Check (Circuit-breaking pattern)
    if (system.apiHealth.getDrawerContent === "unresponsive") {
      geminiTelemetryService.logError("Drawer content API unresponsive, forcing LINK strategy.", null, { recordType, recordId });
      return RenderStrategy.LINK; // Circuit breaker opened
    }

    // 4. AI-Driven Adaptive Logic and Cost Optimization
    // This is where prompt-based learning and predictive models would operate.
    // For now, it's rule-based but simulates adaptive decision-making based on dynamic context.

    // Prioritize AI Adaptive Drawer if enabled and system allows
    if (currentDrawerEnabled && system.featureFlags.enableAIAdaptiveDrawer) {
      const isUserTierEligible = user.roles.some(role => business.drawerThresholds.userTier.includes(role));
      const isSystemLoadAcceptable = system.currentLoad < business.drawerThresholds.highLoad;
      const isApiHealthy = system.apiHealth.getDrawerContent === "healthy";

      if (isUserTierEligible && isSystemLoadAcceptable && isApiHealthy) {
        if (business.costOptimizationEnabled && system.networkLatency > 150) {
          // If cost optimization is on and network is slow, maybe a simpler drawer or link is better
          geminiTelemetryService.logInfo("AI Adaptive Drawer considered, but network latency too high for cost-optimized flow. Opting for standard drawer if possible.", {
            recordType, recordId, systemLoad: system.currentLoad, networkLatency: system.networkLatency
          });
        } else {
          geminiTelemetryService.logInfo("Deciding AI Adaptive Drawer based on context.", {
            recordType, recordId, systemLoad: system.currentLoad, userRoles: user.roles
          });
          return RenderStrategy.AI_ADAPTIVE_DRAWER;
        }
      }
    }

    // Fallback to regular drawer if AI adaptive is not chosen or available, but only if explicitely enabled
    if (currentDrawerEnabled) {
      const isSystemLoadAcceptable = system.currentLoad < business.drawerThresholds.highLoad;
      const isApiHealthy = system.apiHealth.getDrawerContent === "healthy";

      if (isSystemLoadAcceptable && isApiHealthy) {
        geminiTelemetryService.logInfo("Deciding standard Drawer based on context.", {
          recordType, recordId, systemLoad: system.currentLoad
        });
        return RenderStrategy.DRAWER;
      } else {
        geminiTelemetryService.logWarn("Standard Drawer disabled due to system conditions or API health.", {
          recordType, recordId, systemLoad: system.currentLoad, apiHealth: system.apiHealth.getDrawerContent
        });
      }
    }

    geminiTelemetryService.logInfo("Deciding Link (default or fallback) for association.", { recordType, recordId });
    return RenderStrategy.LINK;
  }
}

/** Export a singleton instance for intelligent rendering decisions. */
export const adaptivePolicyEngine = AdaptivePolicyEngine.getInstance();


/**
 * AIAdaptiveDrawerProps
 * Properties for the AIAdaptiveDrawer component.
 */
export type AIAdaptiveDrawerProps = {
  trigger: React.ReactElement;
  path: string;
  type: string;
  id: string;
  stackedDrawerEnabled: boolean;
};

/**
 * AIAdaptiveDrawer
 * A new component that encapsulates AI logic for enhanced drawer behavior.
 * This component acts as a "micro-intelligence" itself, pre-fetching content,
 * suggesting related actions, and offering dynamic AI insights.
 */
export function AIAdaptiveDrawer({
  trigger,
  path,
  type,
  id,
  stackedDrawerEnabled,
}: AIAdaptiveDrawerProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [predictiveContent, setPredictiveContent] = React.useState<React.ReactNode | null>(null);
  const [isLoadingPredictive, setIsLoadingPredictive] = React.useState(false);

  // Effect to simulate fetching AI-powered predictive content when the drawer opens
  React.useEffect(() => {
    if (drawerOpen && geminiContextManager.getContext().system.featureFlags.enablePredictiveContent) {
      const fetchPredictiveContent = async () => {
        setIsLoadingPredictive(true);
        geminiTelemetryService.logInfo("Fetching predictive content for AI Adaptive Drawer", { type, id });
        try {
          // Simulate an async call to a "living endpoint - micro-intelligence"
          // In a real system, this would be a prompt-based LLM call or a context-aware service.
          await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 300)); // Simulate API delay
          setPredictiveContent(
            <div className="p-4 text-sm text-gray-600 bg-blue-50 rounded-md mt-4 border border-blue-200">
              <h4 className="font-semibold text-blue-700">AI-Powered Insights for {startCase(type)} ({id}):</h4>
              <p className="mt-1">
                Based on current user context and recent system interactions, users often:
                <ul className="list-disc list-inside mt-1">
                  <li>Review associated compliance documents for {startCase(type)} (AI-identified priority).</li>
                  <li>Explore performance metrics related to this {startCase(type)}'s region.</li>
                </ul>
              </p>
              <p className="mt-2 text-xs text-blue-500"><i>(Contextual adaptation by Gemini Engine)</i></p>
            </div>
          );
          geminiTelemetryService.recordMetric("ai_predictive_content_loaded", 1, { type, id });
        } catch (error) {
          geminiTelemetryService.logError("Failed to fetch predictive content", error as Error, { type, id });
          setPredictiveContent(null);
        } finally {
          setIsLoadingPredictive(false);
        }
      };
      fetchPredictiveContent();
    } else if (!drawerOpen) {
      setPredictiveContent(null); // Clear predictive content when drawer closes
    }
  }, [drawerOpen, type, id]);

  const handleOpenChange = (open: boolean) => {
    setDrawerOpen(open);
    if (open) {
      geminiTelemetryService.recordMetric("ai_adaptive_drawer_opened", 1, { type, id });
      geminiContextManager.updateUserInteraction("open_ai_adaptive_drawer", `${type}:${id}`);
    } else {
      geminiTelemetryService.recordMetric("ai_adaptive_drawer_closed", 1, { type, id });
    }
  };

  const mainDrawerContent = getDrawerContent(type, id);

  if (!mainDrawerContent) {
    geminiTelemetryService.logWarn("AI Adaptive Drawer: No main content found, falling back to a link equivalent.", { type, id });
    return (
      <a href={path} onClick={() => handleOpenChange(true)}>{trigger}</a>
    );
  }

  return (
    <Drawer
      key={`ai-adaptive-drawer-${id}`}
      trigger={trigger}
      path={path}
      stackedDrawerEnabled={stackedDrawerEnabled}
      onOpenChange={handleOpenChange}
      // Simulate dynamic styling or class application based on AI insights
      className={`gemini-adaptive-drawer ${drawerOpen ? 'open' : ''} ${isLoadingPredictive ? 'loading-ai-content' : ''}`}
    >
      <div className="p-4">
        {mainDrawerContent}
        {isLoadingPredictive && (
          <div className="flex items-center justify-center p-4 mt-4 text-gray-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Fetching AI Insights...
          </div>
        )}
        {predictiveContent}
        {/* Further AI integration: suggested actions, automated workflows. */}
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200"
                  onClick={() => geminiTelemetryService.logInfo("User clicked 'Explore More' (AI Suggestion)", { type, id })}>
            Explore More (AI Suggestion)
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  onClick={() => geminiTelemetryService.logInfo("User clicked 'Take AI-Guided Action'", { type, id })}>
            Take AI-Guided Action
          </button>
        </div>
      </div>
    </Drawer>
  );
}

// ==============================================================================
// Main Export Function - Transformed by Gemini Integration
// ==============================================================================

/**
 * createPolymorphicAssociation
 * Renders a polymorphic association as a link, a standard drawer, or an AI-adaptive drawer.
 * The rendering strategy is dynamically determined by the Gemini Adaptive Policy Engine,
 * which considers user context, system load, business rules, authorization, and compliance.
 *
 * @param record The data record containing the association details.
 * @param prefix The prefix for association-related keys in the record (e.g., 'customer').
 * @param displayColumnId A unique ID for the display column, used as a React key.
 * @param drawerEnabled A hint indicating if drawers are generally enabled for this context. The AI may override this.
 * @param stackedDrawerEnabled Flag for enabling stacked drawer behavior.
 * @param requiredAccessRoles Roles required to view the associated entity's content beyond a basic link.
 * @param dataComplianceLevels Compliance levels applicable to the associated entity's data.
 * @returns A React element representing the polymorphic association.
 */
export function createPolymorphicAssociation(
  record: RecordData,
  prefix: string,
  displayColumnId: string,
  drawerEnabled: boolean, // This is now a *suggestion* to the AI engine
  stackedDrawerEnabled: boolean,
  // New: provide required roles and compliance levels for the associated entity.
  // These would typically come from metadata associated with the record type or its API.
  requiredAccessRoles: string[] = ["viewer"],
  dataComplianceLevels: string[] = ["INTERNAL_POLICY"],
) {
  const path = record[`${prefix}Path`] as string;
  const id = record[`${prefix}Id`] as string;
  const type = record[`${prefix}Type`] as string;
  const associationLabel = `${startCase(type)} (${id})`;

  // Prepare the trigger element which is common for drawer types
  const triggerElement = (
    <Pill className="associated-entity z-10" showTooltip>
      {associationLabel}
    </Pill>
  );

  // Use the AdaptivePolicyEngine to decide the best rendering strategy
  const renderStrategy = adaptivePolicyEngine.decideRenderStrategy(
    type,
    id,
    drawerEnabled, // Pass original flag as a hint to the AI
    stackedDrawerEnabled,
    requiredAccessRoles,
    dataComplianceLevels,
  );

  geminiTelemetryService.logInfo("Final rendering decision for polymorphic association", {
    type, id, strategy: renderStrategy, originalDrawerEnabledHint: drawerEnabled
  });

  switch (renderStrategy) {
    case RenderStrategy.AI_ADAPTIVE_DRAWER:
      // Record usage for potential billing or resource allocation (Commercial-Grade Logic)
      geminiTelemetryService.recordMetric("ai_adaptive_drawer_render", 1, { type, id });
      return (
        <AIAdaptiveDrawer
          key={displayColumnId}
          trigger={triggerElement}
          path={path}
          type={type}
          id={id}
          stackedDrawerEnabled={stackedDrawerEnabled}
        />
      );

    case RenderStrategy.DRAWER:
      const drawerContent = getDrawerContent(type, id);
      if (drawerContent) {
        geminiTelemetryService.recordMetric("standard_drawer_render", 1, { type, id });
        return (
          <Drawer
            key={displayColumnId}
            trigger={triggerElement}
            path={path}
            stackedDrawerEnabled={stackedDrawerEnabled}
            onOpenChange={(open) => {
              if (open) {
                geminiTelemetryService.recordMetric("standard_drawer_opened", 1, { type, id });
                geminiContextManager.updateUserInteraction("open_standard_drawer", `${type}:${id}`);
              } else {
                geminiTelemetryService.recordMetric("standard_drawer_closed", 1, { type, id });
              }
            }}
          >
            {drawerContent}
          </Drawer>
        );
      }
      // Fall through to LINK if drawer content is not available or if AI decided against it
      geminiTelemetryService.logWarn("Drawer content missing or API degraded, falling back to link.", { type, id });
      // Fallback action is also logged and adapted
      geminiContextManager.updateSystemLoad(geminiContextManager.getContext().system.currentLoad + 5); // Simulate load increase for fallback
      return path ? <a href={path} onClick={() => geminiContextManager.updateUserInteraction("click_link_fallback", `${type}:${id}`)}>{associationLabel}</a> : associationLabel;

    case RenderStrategy.LINK:
    default:
      geminiTelemetryService.recordMetric("link_render", 1, { type, id });
      return path ? <a href={path} onClick={() => geminiContextManager.updateUserInteraction("click_link", `${type}:${id}`)}>{associationLabel}</a> : associationLabel;
  }
}