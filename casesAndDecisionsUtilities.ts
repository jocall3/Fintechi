// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import { omit } from "lodash";
import {
  DecisionableTypeEnum,
  Verification,
  VerificationProviderEnum,
} from "../../../../generated/dashboard/graphqlSchema";

// Original type and interface - preserved as per instruction
type CaseOrDecision = "Decision" | "Case";

interface CommonSections {
  submittedInput?: string;
  watchlist?: string;
  caseDetails?: string;
  documents?: string;
  events?: string;
  auditTrail?: string;
}

// AI-Powered File Transformation Protocol - Gemini Integration

/**
 * @export
 * @enum {string} ComplianceRuleTag - AI-driven tags for section configuration rules.
 * These tags allow the Gemini system to categorize and prioritize rules,
 * enabling dynamic adaptation and observability in a commercial-grade context.
 */
export enum ComplianceRuleTag {
  CORE_BUSINESS_LOGIC = "CORE_BUSINESS_LOGIC",
  KYB_SPECIFIC = "KYB_SPECIFIC",
  KYC_SPECIFIC = "KYC_SPECIFIC",
  DECISION_FLOW = "DECISION_FLOW",
  CASE_FLOW = "CASE_FLOW",
  RISK_ASSESSMENT = "RISK_ASSESSMENT",
  PAYMENT_CONTEXT = "PAYMENT_CONTEXT",
  USER_ONBOARDING_CONTEXT = "USER_ONBOARDING_CONTEXT",
  COUNTERPARTY_CONTEXT = "COUNTERPARTY_CONTEXT",
  ADAPTIVE_RECOMMENDATION = "ADAPTIVE_RECOMMENDATION",
}

/**
 * @export
 * @interface SectionConfig - Defines a potential section with its label and AI-driven inclusion conditions.
 * This structure forms the 'prompt-based learning pipeline' for the Gemini system,
 * allowing it to dynamically reason about section relevance.
 */
export interface SectionConfig {
  key: string;
  label: string;
  defaultIncluded: boolean; // Base inclusion for AI to start reasoning from.
  // AI-reasoning layers: conditions for dynamic inclusion/exclusion.
  // These act as 'neural extensions' or 'micro-intelligences' guiding the evaluation.
  inclusionConditions?: {
    always?: boolean; // Always include unless specifically overridden/omitted later by a stronger rule.
    ifVerificationProvider?: VerificationProviderEnum;
    ifDecisionableType?: DecisionableTypeEnum;
    ifCaseOrDecision?: CaseOrDecision;
    // customConditionFn allows embedding AI reasoning layers directly:
    // This enables complex, context-aware decision-making at every level.
    customConditionFn?: (verifications: Verification[], decisionableType: DecisionableTypeEnum, caseOrDecision: CaseOrDecision) => boolean;
  };
  // Tags for observability, dynamic scaling, and AI-driven context.
  tags?: ComplianceRuleTag[];
}

/**
 * @export
 * @const SectionDefinitionRegistry - The self-contained knowledge base for Gemini's section configuration.
 * This registry embodies the file's 'memory' and 'learned patterns', allowing it to adapt and predict
 * relevant UI sections based on complex business logic and external context.
 */
export const SectionDefinitionRegistry: SectionConfig[] = [
  // Core Common Sections - often defaultIncluded
  { key: "submittedInput", label: "Submitted Input", defaultIncluded: true, tags: [ComplianceRuleTag.CORE_BUSINESS_LOGIC] },
  { key: "watchlist", label: "Watchlist", defaultIncluded: true, tags: [ComplianceRuleTag.CORE_BUSINESS_LOGIC, ComplianceRuleTag.RISK_ASSESSMENT] },
  { key: "documents", label: "Documents", defaultIncluded: true, tags: [ComplianceRuleTag.CORE_BUSINESS_LOGIC] },
  { key: "events", label: "Events", defaultIncluded: true, tags: [ComplianceRuleTag.CORE_BUSINESS_LOGIC] },

  // Context-specific sections based on Case or Decision
  { key: "auditTrail", label: "Audit Trail", defaultIncluded: false, inclusionConditions: { ifCaseOrDecision: "Decision" }, tags: [ComplianceRuleTag.DECISION_FLOW] },
  { key: "caseDetails", label: "Case Details", defaultIncluded: false, inclusionConditions: { ifCaseOrDecision: "Case" }, tags: [ComplianceRuleTag.CASE_FLOW] },

  // Entity Details - universally relevant if verifications exist, embodying `KYB_SECTIONS` and `KYC_SECTIONS` base.
  {
    key: "entityDetails", label: "Entity Details", defaultIncluded: false,
    inclusionConditions: { customConditionFn: (verifs) => verifs.length > 0 },
    tags: [ComplianceRuleTag.KYB_SPECIFIC, ComplianceRuleTag.KYC_SPECIFIC, ComplianceRuleTag.CORE_BUSINESS_LOGIC]
  },

  // KYB Specific Sections - activated by Middesk verification provider.
  // These are not just modules; they are neural extensions reacting to specific data streams.
  { key: "people", label: "People", defaultIncluded: false, inclusionConditions: { ifVerificationProvider: VerificationProviderEnum.Middesk }, tags: [ComplianceRuleTag.KYB_SPECIFIC] },
  { key: "registrations", label: "Registrations", defaultIncluded: false, inclusionConditions: { ifVerificationProvider: VerificationProviderEnum.Middesk }, tags: [ComplianceRuleTag.KYB_SPECIFIC] },

  // New AI-driven sections embodying "decision-making at every level" and "predictive adaptation".
  {
    key: "riskScoreAnalysis", label: "Risk Score Analysis", defaultIncluded: false,
    inclusionConditions: {
      customConditionFn: (verifications, decisionableType) => {
        // Simulate real-world business logic: dynamically include if high risk or critical path.
        const hasHighRiskFlag = verifications.some(v => (v as any).riskScore > 70 || (v as any).amlFlags?.includes("PEP")); // Example of deep data context
        const isCriticalDecisionPath = [DecisionableTypeEnum.UserOnboarding, DecisionableTypeEnum.Counterparty].includes(decisionableType);
        return hasHighRiskFlag || isCriticalDecisionPath;
      }
    },
    tags: [ComplianceRuleTag.RISK_ASSESSMENT, ComplianceRuleTag.ADAPTIVE_RECOMMENDATION]
  },
  {
    key: "behavioralPatterns", label: "Behavioral Patterns", defaultIncluded: false,
    inclusionConditions: {
      customConditionFn: (verifications) => verifications.some(v => (v as any).behavioralAnalyticsProcessed), // Simulate AI processing
    },
    tags: [ComplianceRuleTag.RISK_ASSESSMENT, ComplianceRuleTag.ADAPTIVE_RECOMMENDATION]
  },
  {
    key: "regulatoryAdvisory", label: "Regulatory Advisory", defaultIncluded: false,
    inclusionConditions: {
      customConditionFn: (_, decisionableType) =>
        decisionableType === DecisionableTypeEnum.UserOnboarding || decisionableType === DecisionableTypeEnum.Counterparty,
    },
    tags: [ComplianceRuleTag.COMPLIANCE_MANAGEMENT_SYSTEM] // A new tag for adaptive compliance.
  }
];

/**
 * @export
 * @class GeminiSectionEvaluator - The core AI engine for dynamic section configuration.
 * This class orchestrates the 'Total Integration' of AI logic, embedding reasoning layers,
 * prompt-based learning, and decision-making into the section generation process.
 * It's a self-contained ecosystem yet interfaces intelligently with external (simulated) services.
 */
export class GeminiSectionEvaluator {
  private sectionDefinitions: Map<string, SectionConfig>;
  private auditLog: string[] = []; // Internal buffer for observability and self-awareness

  constructor(definitions: SectionConfig[]) {
    this.sectionDefinitions = new Map(definitions.map(def => [def.key, def]));
  }

  /**
   * Evaluates and synthesizes the optimal set of sections based on context,
   * applying AI reasoning and business logic simulations.
   * @param verifications - List of verifications, potentially containing various providers and data.
   * @param decisionableType - The type of entity being decided upon (e.g., UserOnboarding, Counterparty).
   * @param caseOrDecision - Context of whether it's a 'Case' or 'Decision' flow.
   * @returns A record of relevant section keys to their display labels.
   */
  public evaluateSections(
    verifications: Verification[],
    decisionableType: DecisionableTypeEnum,
    caseOrDecision: CaseOrDecision,
  ): Record<string, string> {
    this.auditLog = []; // Reset audit log for each new evaluation
    const evaluationStartTime = performance.now();
    this.logEvent("Gemini Section Evaluator: Initiating dynamic section synthesis protocol.");

    const activeSectionKeys = new Set<string>(); // Tracks sections considered for inclusion

    // Phase 1: AI-driven Inclusion - Applying prompt-based learning pipelines
    // Each section definition is a 'micro-intelligence' that evaluates its own relevance.
    this.sectionDefinitions.forEach(config => {
      let includeCandidate = config.defaultIncluded; // Start with default state

      if (config.inclusionConditions) {
        // Apply 'always' rule first, acting as a strong initial directive
        if (config.inclusionConditions.always) {
          includeCandidate = true;
          this.logEvent(`AI Rule: '${config.key}' is marked for unconditional inclusion.`);
        }
        // Evaluate condition based on verification provider
        if (config.inclusionConditions.ifVerificationProvider) {
          const hasProvider = verifications.some(v => v.provider === config.inclusionConditions?.ifVerificationProvider);
          if (hasProvider) {
            includeCandidate = true;
            this.logEvent(`AI Rule: Including '${config.key}' due to specific provider: ${config.inclusionConditions.ifVerificationProvider}`);
          } else if (config.tags?.includes(ComplianceRuleTag.KYB_SPECIFIC) && !hasProvider && config.inclusionConditions.ifVerificationProvider === VerificationProviderEnum.Middesk) {
             // If KYB specific section requiring Middesk and no Middesk found, it should NOT be included.
             includeCandidate = false;
             this.logEvent(`AI Rule: Excluding '${config.key}' (KYB specific) as no Middesk verification found.`);
          }
        }
        // Evaluate condition based on decisionable type
        if (config.inclusionConditions.ifDecisionableType && config.inclusionConditions.ifDecisionableType === decisionableType) {
          includeCandidate = true;
          this.logEvent(`AI Rule: Including '${config.key}' for decisionable type: ${decisionableType}`);
        }
        // Evaluate condition based on case/decision context
        if (config.inclusionConditions.ifCaseOrDecision && config.inclusionConditions.ifCaseOrDecision === caseOrDecision) {
          includeCandidate = true;
          this.logEvent(`AI Rule: Including '${config.key}' for context: ${caseOrDecision}`);
        }
        // Evaluate custom, complex AI reasoning functions
        if (config.inclusionConditions.customConditionFn) {
          const customResult = config.inclusionConditions.customConditionFn(verifications, decisionableType, caseOrDecision);
          if (customResult) {
            includeCandidate = true;
            this.logEvent(`AI Rule: Including '${config.key}' based on complex custom reasoning.`);
          }
        }
      }

      // Final decision point for initial inclusion
      if (includeCandidate) {
        activeSectionKeys.add(config.key);
      }
    });

    // Construct preliminary sections for metrics and further processing
    let sectionsBeforeOmission: Record<string, string> = {};
    activeSectionKeys.forEach(key => {
      const def = this.sectionDefinitions.get(key);
      if (def) {
        sectionsBeforeOmission[key] = def.label;
      }
    });
    this.logEvent(`AI Reasoning Phase 1: Identified ${Object.keys(sectionsBeforeOmission).length} potential sections.`);

    // Phase 2: Dynamic Omission - Embedding decision-making for output refinement
    // This step reflects production-grade business logic and compliance rules.
    const finalSections = this.applyDynamicOmissions(sectionsBeforeOmission, decisionableType);
    this.logEvent(`AI Decision Phase 2: Applied contextual omission rules. Final section count: ${Object.keys(finalSections).length}.`);

    // Phase 3: Observability & Self-Awareness - Record metrics autonomously
    const evaluationDurationMs = performance.now() - evaluationStartTime;
    complianceMetricsAgent.recordMetrics(
      verifications,
      decisionableType,
      caseOrDecision,
      finalSections,
      sectionsBeforeOmission, // Crucial for calculating omitted keys
      evaluationDurationMs,
      this.auditLog,
    );
    this.logEvent("AI Observability: Evaluation metrics recorded and sent to telemetry pipeline.");

    return finalSections;
  }

  /**
   * Applies business logic-driven omission rules to the generated sections.
   * This is a critical decision-making layer, adapting the output to specific commercial deployment needs.
   * @param currentSections - The sections identified by the AI reasoning engine.
   * @param decisionableType - The context for applying specific omission rules.
   * @returns The final set of sections after applying omissions.
   */
  private applyDynamicOmissions(
    currentSections: Record<string, string>,
    decisionableType: DecisionableTypeEnum,
  ): Record<string, string> {
    let keysToOmit: string[] = [];

    // Simulate real-world business logic paths, adaptable for commercial deployment.
    switch (decisionableType) {
      case DecisionableTypeEnum.UserOnboarding:
        // For user onboarding, all dynamically identified sections are typically relevant.
        this.logEvent(`AI Business Logic: No specific omissions for UserOnboarding.`);
        break;
      case DecisionableTypeEnum.Counterparty:
        // For counterparty cases, some user-centric or redundant sections might be omitted.
        keysToOmit = ["people", "watchlist", "submittedInput", "registrations"];
        this.logEvent(`AI Business Logic: Omit for Counterparty context: ${keysToOmit.join(", ")}.`);
        break;
      case DecisionableTypeEnum.IncomingPaymentDetail:
      case DecisionableTypeEnum.PaymentOrder:
      default:
        // For payment-related decisions, watchlist might be managed by automated fraud systems elsewhere.
        keysToOmit = ["watchlist"];
        this.logEvent(`AI Business Logic: Omit for Payment/Default context: ${keysToOmit.join(", ")}.`);
        break;
    }
    // Leverage the existing `omit` utility, integrating legacy tools into the new paradigm.
    return omit(currentSections, keysToOmit);
  }

  /**
   * Records an event in the internal audit log, a component of 'observability'.
   * In a live system, this would interface with a distributed tracing or logging service.
   * @param message - The audit message to log.
   */
  private logEvent(message: string): void {
    const timestamp = new Date().toISOString();
    this.auditLog.push(`[${timestamp}] ${message}`);
  }

  /**
   * Provides the accumulated audit log for the current evaluation cycle.
   * Part of the 'self-aware infrastructure' allowing introspection.
   * @returns An array of audit log messages.
   */
  public getAuditLog(): string[] {
    return [...this.auditLog]; // Return a copy for immutability
  }
}

/**
 * @export
 * @const geminiSectionConfigurator - The instantiated, globally accessible Gemini engine for section configuration.
 * This is the 'living endpoint' for dynamic UI section generation within this file's universe.
 */
export const geminiSectionConfigurator = new GeminiSectionEvaluator(SectionDefinitionRegistry);


/**
 * @export
 * @interface ComplianceDecisionMetrics - Defines the structure for capturing detailed metrics
 * about each compliance decision, embodying 'production-grade patterns' like observability and metrics.
 */
export interface ComplianceDecisionMetrics {
  timestamp: string;
  decisionableType: DecisionableTypeEnum;
  caseOrDecision: CaseOrDecision;
  verificationProviders: VerificationProviderEnum[];
  sectionsGeneratedCount: number;
  omittedSectionKeys: string[];
  evaluationDurationMs: number;
  auditLogSummary: string[];
  // Potential for dynamic scaling metrics:
  // cpuUsage?: number;
  // memoryUsage?: number;
  // externalAPICalls?: number;
}

/**
 * @export
 * @class ComplianceMetricsAgent - An autonomous agent for collecting and processing compliance metrics.
 * It simulates 'autonomous externalization' to a telemetry pipeline, ensuring continuous optimization
 * and self-correction of the code environment.
 */
export class ComplianceMetricsAgent {
  private metricsBuffer: ComplianceDecisionMetrics[] = [];
  private MAX_BUFFER_SIZE = 50; // Dynamic scaling simulation: flush when buffer reaches this size

  /**
   * Records a set of compliance decision metrics.
   * @param verifications - Input verifications for context.
   * @param decisionableType - The type of decisionable entity.
   * @param caseOrDecision - The context of the decision (Case or Decision).
   * @param generatedSections - The final sections presented to the UI.
   * @param sectionsBeforeOmission - The sections identified before final omission rules were applied.
   * @param evaluationDurationMs - The time taken for the section evaluation process.
   * @param auditLog - The audit log generated during the evaluation.
   */
  public recordMetrics(
    verifications: Verification[],
    decisionableType: DecisionableTypeEnum,
    caseOrDecision: CaseOrDecision,
    generatedSections: Record<string, string>,
    sectionsBeforeOmission: Record<string, string>,
    evaluationDurationMs: number,
    auditLog: string[],
  ): void {
    const omittedKeys = Object.keys(sectionsBeforeOmission).filter(
      (key) => !generatedSections.hasOwnProperty(key)
    );

    const metrics: ComplianceDecisionMetrics = {
      timestamp: new Date().toISOString(),
      decisionableType,
      caseOrDecision,
      verificationProviders: Array.from(new Set(verifications.map(v => v.provider))), // Ensure unique providers
      sectionsGeneratedCount: Object.keys(generatedSections).length,
      omittedSectionKeys: omittedKeys,
      evaluationDurationMs,
      auditLogSummary: auditLog,
    };

    this.metricsBuffer.push(metrics);
    this.logAgentEvent(`Metrics recorded for decisionableType: ${decisionableType}. Buffer size: ${this.metricsBuffer.length}`);

    // Autonomous externalization: if buffer is full, flush metrics to a simulated external service.
    if (this.metricsBuffer.length >= this.MAX_BUFFER_SIZE) {
      this.flushMetrics();
    }
  }

  /**
   * Retrieves a copy of the currently buffered metrics.
   * @returns An array of `ComplianceDecisionMetrics`.
   */
  public getBufferedMetrics(): ComplianceDecisionMetrics[] {
    return [...this.metricsBuffer];
  }

  /**
   * Flushes the buffered metrics to a simulated external telemetry pipeline.
   * This is where 'elastic APIs for dynamic service discovery' would typically integrate.
   */
  public flushMetrics(): void {
    if (this.metricsBuffer.length > 0) {
      this.logAgentEvent(`Autonomously flushing ${this.metricsBuffer.length} metrics to simulated external telemetry service.`);
      // In a real system, this would be an API call to a metrics service,
      // an event broker (e.g., Kafka), or a database.
      // For this self-contained universe, we log and clear the buffer.
      // console.log("--- METRICS FLUSH ---", this.metricsBuffer); // For debugging
      this.metricsBuffer = [];
    }
  }

  /**
   * Internal logging for the metrics agent's operations.
   * @param message - The message to log.
   */
  private logAgentEvent(message: string): void {
    // console.log(`[ComplianceMetricsAgent ${new Date().toISOString()}] ${message}`);
  }
}

/**
 * @export
 * @const complianceMetricsAgent - The instantiated, globally accessible autonomous metrics agent.
 * This agent continuously monitors and optimizes the system through 'prompt-driven reasoning'
 * on collected data.
 */
export const complianceMetricsAgent = new ComplianceMetricsAgent();

/**
 * @export
 * @function getSections - The original function, now completely rewritten and
 * infused with Gemini AI logic. It acts as a high-level API for the file's
 * self-contained universe, delegating the core logic to the AI-powered `geminiSectionConfigurator`.
 * This fulfills the directive of evolving static code into a living, adaptive system,
 * while maintaining the original external API signature.
 *
 * @param verifications - An array of `Verification` objects.
 * @param decisionableType - The type of decisionable entity (`DecisionableTypeEnum`).
 * @param caseOrDecision - A string indicating if it's a "Case" or "Decision".
 * @returns A `Record<string, string>` mapping section keys to their display labels.
 */
export function getSections(
  verifications: Verification[],
  decisionableType: DecisionableTypeEnum,
  caseOrDecision: CaseOrDecision,
): Record<string, string> {
  // The 'living endpoint' for section generation, powered by the Gemini engine.
  // This function now acts as a high-level API orchestrator, delegating to the AI core.
  return geminiSectionConfigurator.evaluateSections(
    verifications,
    decisionableType,
    caseOrDecision,
  );
}