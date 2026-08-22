// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  Button,
  Checkbox,
  ConfirmModal,
  DateTime,
  FieldGroup,
  Heading,
  HelpText,
  KeyValueTableSkeletonLoader,
  Label,
  LoadingLine,
  MTContainer,
  OverflowTip,
  SectionNavigator,
  Textarea,
} from "../../../common/ui-components";
import { getSections } from "./utilities/casesAndDecisionsUtilities";
import DocumentUploadContainer from "../DocumentUploadContainer";
import {
  DecisionFeedbackFeedbackEnum,
  DecisionFeedbackInput,
  Decision__DecisionTypeEnum,
  Decision__StatusEnum,
  useDecisionViewQuery,
  useHandleDecisionFeedbackMutation,
  Decision as DecisionGraphqlType,
  Verification,
  UserOnboarding,
  VerificationProviderEnum,
  DecisionableTypeEnum,
  Verification__TypeEnum,
} from "../../../generated/dashboard/graphqlSchema";
import AuditRecordsHome from "../../components/AuditRecordsHome";
import ComplianceStatusBadge from "../../components/compliance/ComplianceStatusBadge";
import EntityEventTableView from "../../components/EntityEventTableView";
import sectionWithNavigator from "../sectionWithNavigator";
import ComplianceEntityDetails from "../../components/compliance/ComplianceEntityDetails";
import Watchlists from "../../components/compliance/Watchlists";
import BusinessRegistration from "../../components/compliance/BusinessRegistration";
import People from "../../components/compliance/People";
import WatchlistProfileView from "../../components/compliance/WatchlistProfileView";
import { useDispatchContext } from "../../MessageProvider";
import RiskProfileView from "../../components/compliance/RiskProfileView";

// --- START GEMINI INTEGRATION CORE ---
// This section introduces the core AI-powered, commercial-grade transformation framework.
// Each component here acts as a "micro-intelligence," interfacing dynamically.

/**
 * @exports GeminiServiceRegistry
 * A simulated dynamic service discovery and resolution mechanism for AI micro-intelligences.
 * In a real-world scenario, this would dynamically fetch and instantiate services.
 */
export class GeminiServiceRegistry {
  private static services: Map<string, any> = new Map();

  static register(name: string, service: any) {
    if (this.services.has(name)) {
      console.warn(`GeminiServiceRegistry: Service "${name}" already registered. Overwriting.`);
    }
    this.services.set(name, service);
    // console.log(`GeminiServiceRegistry: Service "${name}" registered.`);
  }

  static get<T>(name: string): T | undefined {
    const service = this.services.get(name);
    if (!service) {
      console.error(`GeminiServiceRegistry: Service "${name}" not found.`);
    }
    return service as T;
  }

  static listServices(): string[] {
    return Array.from(this.services.keys());
  }
}

/**
 * @exports GeminiTelemetryAgent
 * Implements production-grade observability for AI interactions and system events.
 * Simulates sending metrics, logs, and traces to an external telemetry pipeline.
 */
export class GeminiTelemetryAgent {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Logs an event with contextual data.
   * @param eventName The name of the event.
   * @param data Contextual data related to the event.
   */
  logEvent(eventName: string, data: Record<string, any>) {
    const timestamp = new Date().toISOString();
    // console.log(`[${timestamp}] [${this.serviceName}] EVENT: ${eventName}`, data);
    // In a real system, this would push to a logging service (e.g., Splunk, DataDog)
  }

  /**
   * Records a metric.
   * @param metricName The name of the metric.
   * @param value The value of the metric.
   * @param tags Optional tags for the metric.
   */
  recordMetric(metricName: string, value: number, tags?: Record<string, string>) {
    const timestamp = new Date().toISOString();
    // console.log(`[${timestamp}] [${this.serviceName}] METRIC: ${metricName}=${value}`, tags);
    // In a real system, this would push to a metrics service (e.g., Prometheus, CloudWatch)
  }

  /**
   * Records a simulated trace span.
   * @param spanName Name of the trace span.
   * @param durationMs Duration in milliseconds.
   * @param status Status of the operation (e.g., "success", "failure").
   */
  recordTraceSpan(spanName: string, durationMs: number, status: 'success' | 'failure', details?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    // console.log(`[${timestamp}] [${this.serviceName}] TRACE: ${spanName} - ${status} (${durationMs}ms)`, details);
    // In a real system, this would push to a tracing service (e.g., Jaeger, OpenTelemetry)
  }
}
export const telemetryAgent = new GeminiTelemetryAgent('DecisionView');
GeminiServiceRegistry.register('TelemetryAgent', telemetryAgent);


/**
 * @exports GeminiCircuitBreaker
 * Implements a production-grade circuit breaker pattern for external AI service calls.
 * Protects against cascading failures and allows services to recover.
 */
export class GeminiCircuitBreaker {
  private serviceName: string;
  private failureThreshold: number;
  private resetTimeout: number; // ms
  private failures: number = 0;
  private isOpen: boolean = false;
  private lastFailureTime: number = 0;
  private telemetry: GeminiTelemetryAgent;

  constructor(serviceName: string, failureThreshold: number = 5, resetTimeout: number = 30000) {
    this.serviceName = serviceName;
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.telemetry = GeminiServiceRegistry.get<GeminiTelemetryAgent>('TelemetryAgent') || new GeminiTelemetryAgent('CircuitBreaker');
  }

  /**
   * Executes a function, protected by the circuit breaker.
   * @param fn The function to execute.
   * @returns The result of the function or throws an error if the circuit is open.
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen && (Date.now() - this.lastFailureTime < this.resetTimeout)) {
      this.telemetry.logEvent('CircuitBreakerOpen', { service: this.serviceName });
      throw new Error(`Circuit for ${this.serviceName} is open. Please try again later.`);
    }

    if (this.isOpen && (Date.now() - this.lastFailureTime >= this.resetTimeout)) {
      // Half-open state: allow a single trial request
      this.telemetry.logEvent('CircuitBreakerHalfOpen', { service: this.serviceName });
      try {
        const result = await fn();
        this.reset(); // If successful, close the circuit
        this.telemetry.logEvent('CircuitBreakerClosedAfterTrial', { service: this.serviceName });
        return result;
      } catch (error) {
        this.recordFailure();
        this.telemetry.logEvent('CircuitBreakerTrialFailed', { service: this.serviceName, error: (error as Error).message });
        throw error; // Re-throw to propagate the failure
      }
    }

    try {
      const result = await fn();
      this.failures = 0; // Reset failures on success
      return result;
    } catch (error) {
      this.recordFailure();
      this.telemetry.logEvent('CircuitBreakerFailureRecorded', { service: this.serviceName, failures: this.failures, error: (error as Error).message });
      throw error;
    }
  }

  private recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.failureThreshold) {
      this.isOpen = true;
      this.telemetry.logEvent('CircuitBreakerOpened', { service: this.serviceName, failureCount: this.failures });
    }
  }

  private reset() {
    this.failures = 0;
    this.isOpen = false;
    this.lastFailureTime = 0;
    this.telemetry.logEvent('CircuitBreakerReset', { service: this.serviceName });
  }

  get isCircuitOpen(): boolean {
    return this.isOpen;
  }
}
export const complianceAICircuitBreaker = new GeminiCircuitBreaker('ComplianceAIDecisionEngine', 3, 60000);
GeminiServiceRegistry.register('ComplianceAICircuitBreaker', complianceAICircuitBreaker);


/**
 * @exports GeminiPromptEngine
 * Generates context-aware prompts for AI reasoning, adapting based on the current decision context.
 * This simulates a dynamic learning pipeline.
 */
export class GeminiPromptEngine {
  private telemetry: GeminiTelemetryAgent;

  constructor() {
    this.telemetry = GeminiServiceRegistry.get<GeminiTelemetryAgent>('TelemetryAgent') || new GeminiTelemetryAgent('PromptEngine');
  }

  /**
   * Generates a prompt for AI decision feedback.
   * @param decision Current decision data.
   * @param proposedFeedback Proposed human feedback.
   * @param comment Human comment.
   * @param isOverriding Whether the decision is being overridden.
   * @returns A prompt string for an LLM.
   */
  generateFeedbackAnalysisPrompt(
    decision: DecisionGraphqlType,
    proposedFeedback: DecisionFeedbackFeedbackEnum,
    comment: string,
    isOverriding: boolean,
  ): string {
    const decisionStatus = decision.status;
    const decisionType = decision.decisionType;
    const decisionId = decision.id;
    const currentRisk = decision.riskScore || 'N/A';
    const decisionableType = decision.decisionableType;

    let prompt = `Analyze the following compliance decision feedback for Decision ID: ${decisionId}.
    The original decision was "${decisionStatus}" for a "${decisionableType}" related to "${decisionType}".
    The current risk score associated with this decisionable entity is ${currentRisk}.

    Human-provided feedback: "${proposedFeedback}".
    Human-provided comment: "${comment}".
    Is this feedback overriding the original decision? ${isOverriding ? 'Yes' : 'No'}.

    Evaluate the following:
    1. Does the human comment adequately justify the proposed feedback?
    2. Are there any potential compliance risks introduced by this feedback, especially if it's an override?
    3. Suggest ways to improve the comment for clarity, completeness, and adherence to compliance standards.
    4. Provide a confidence score (0-100) for the appropriateness of this feedback given the decision context.
    5. Based on historical data (if available), predict the likely impact of this feedback on future compliance outcomes.
    `;
    this.telemetry.logEvent('PromptGenerated', { type: 'FeedbackAnalysis', decisionId, proposedFeedback });
    return prompt;
  }

  /**
   * Generates a prompt for dynamic section recommendation.
   * @param decision Current decision data.
   * @param availableSections List of available section names.
   * @param userOnboardingData Relevant user onboarding data.
   * @returns A prompt string for an LLM.
   */
  generateSectionRecommendationPrompt(
    decision: DecisionGraphqlType,
    availableSections: string[],
    userOnboardingData: UserOnboarding | undefined,
  ): string {
    const decisionStatus = decision.status;
    const decisionType = decision.decisionType;
    const decisionableType = decision.decisionableType;
    const verifications = decision.verifications?.map(v => v.provider).join(', ') || 'None';

    let prompt = `Given the compliance decision context, recommend the most relevant default section to display to the user.
    Decision Status: ${decisionStatus}
    Decision Type: ${decisionType}
    Decisionable Type: ${decisionableType}
    Verification Providers Involved: ${verifications}
    User Onboarding Data (JSON, if available): ${JSON.stringify(userOnboardingData || {})}

    Available sections: ${availableSections.join(', ')}.
    Consider the compliance workflow, the stage of the decision, and any outstanding issues.
    Output only the name of the recommended section, e.g., "entityDetails".
    `;
    this.telemetry.logEvent('PromptGenerated', { type: 'SectionRecommendation', decisionId: decision.id });
    return prompt;
  }
}
export const geminiPromptEngine = new GeminiPromptEngine();
GeminiServiceRegistry.register('PromptEngine', geminiPromptEngine);


/**
 * @exports GeminiKnowledgeBase
 * A simulated knowledge base that stores and retrieves learned patterns,
 * user preferences, and historical decision outcomes for adaptation.
 */
export class GeminiKnowledgeBase {
  private static knowledge: Map<string, any> = new Map();
  private telemetry: GeminiTelemetryAgent;

  constructor() {
    this.telemetry = GeminiServiceRegistry.get<GeminiTelemetryAgent>('TelemetryAgent') || new GeminiTelemetryAgent('KnowledgeBase');
  }

  /**
   * Stores a piece of knowledge.
   * @param key Identifier for the knowledge.
   * @param value The knowledge data.
   */
  store(key: string, value: any) {
    GeminiKnowledgeBase.knowledge.set(key, value);
    this.telemetry.logEvent('KnowledgeStored', { key });
    // console.log(`GeminiKnowledgeBase: Stored knowledge for key "${key}"`);
  }

  /**
   * Retrieves knowledge.
   * @param key Identifier for the knowledge.
   * @returns The knowledge data or undefined if not found.
   */
  retrieve<T>(key: string): T | undefined {
    const data = GeminiKnowledgeBase.knowledge.get(key);
    this.telemetry.logEvent('KnowledgeRetrieved', { key, found: !!data });
    return data as T;
  }

  /**
   * Adapts the knowledge base based on new insights.
   * This would involve more complex machine learning models in a real system.
   * @param insightKey The key for the insight.
   * @param insightData New data to adapt the knowledge base.
   */
  adapt(insightKey: string, insightData: any) {
    // Simulate adaptation logic (e.g., updating a confidence score, adding a new rule)
    const existing = this.retrieve(insightKey) || {};
    this.store(insightKey, { ...existing, ...insightData, lastAdapted: new Date().toISOString() });
    this.telemetry.logEvent('KnowledgeAdapted', { insightKey, insightData });
    // console.log(`GeminiKnowledgeBase: Adapted knowledge for key "${insightKey}"`);
  }
}
export const geminiKnowledgeBase = new GeminiKnowledgeBase();
GeminiServiceRegistry.register('KnowledgeBase', geminiKnowledgeBase);

// Pre-populate some mock knowledge for compliance decisions
geminiKnowledgeBase.store('decisionFeedbackGuidance:Denied:Approved', {
  minCommentLength: 20,
  recommendedKeywords: ['justification', 'new evidence', 'mitigation'],
  riskFactor: 0.7, // Higher risk for overriding a denial
});
geminiKnowledgeBase.store('decisionFeedbackGuidance:Approved:Denied', {
  minCommentLength: 15,
  recommendedKeywords: ['new risk', 'violation', 'non-compliance'],
  riskFactor: 0.5,
});


/**
 * @exports GeminiBillingTracker
 * Tracks simulated costs for AI operations, embodying commercial-grade logic.
 */
export class GeminiBillingTracker {
  private totalCost: number = 0;
  private telemetry: GeminiTelemetryAgent;

  constructor() {
    this.telemetry = GeminiServiceRegistry.get<GeminiTelemetryAgent>('TelemetryAgent') || new GeminiTelemetryAgent('BillingTracker');
  }

  /**
   * Records a simulated cost for an AI operation.
   * @param operationType Type of AI operation (e.g., 'LLM_inference', 'data_harmonization').
   * @param cost Amount to add to the total cost.
   * @param details Optional details about the operation.
   */
  recordCost(operationType: string, cost: number, details?: Record<string, any>) {
    this.totalCost += cost;
    this.telemetry.logEvent('BillingRecorded', { operationType, cost, totalCost: this.totalCost, details });
    // console.log(`GeminiBillingTracker: Cost of ${cost} for ${operationType}. Total: ${this.totalCost}`);
    // In a real system, this would interface with a billing service.
  }

  /**
   * Retrieves the current total simulated cost.
   */
  getTotalCost(): number {
    return this.totalCost;
  }
}
export const geminiBillingTracker = new GeminiBillingTracker();
GeminiServiceRegistry.register('BillingTracker', geminiBillingTracker);


/**
 * @exports GeminiDataHarmonizer
 * Ensures data consistency and optimal formatting for AI consumption.
 * Abstracts nothing; directly embeds data transformation logic.
 */
export class GeminiDataHarmonizer {
  private telemetry: GeminiTelemetryAgent;

  constructor() {
    this.telemetry = GeminiServiceRegistry.get<GeminiTelemetryAgent>('TelemetryAgent') || new GeminiTelemetryAgent('DataHarmonizer');
  }

  /**
   * Harmonizes DecisionGraphqlType into a standardized format for AI processing.
   * @param decision The raw GraphQL decision object.
   * @returns A harmonized, AI-ready decision object.
   */
  harmonizeDecisionData(decision: DecisionGraphqlType): Record<string, any> {
    const harmonized = {
      id: decision.id,
      status: decision.status,
      decisionType: decision.decisionType,
      decisionableType: decision.decisionableType,
      decisionableId: decision.decisionableId,
      riskScore: decision.riskScore,
      createdAt: decision.createdAt,
      updatedAt: decision.updatedAt,
      overriddenAt: decision.overriddenAt,
      // Simplify verifications for AI consumption
      verificationProviders: decision.verifications?.map(v => ({
        provider: v.provider,
        type: v.verificationType,
        status: v.status,
      })) || [],
      // Extract relevant data from decisionable if it's user onboarding
      userOnboardingDetails: decision.decisionableType === DecisionableTypeEnum.UserOnboarding && (decision.decisionable as UserOnboarding)?.data
        ? JSON.parse((decision.decisionable as UserOnboarding).data || '{}')
        : null,
      // Aggregate feedback summaries
      feedbackSummaries: decision.decisionFeedbacks?.map(fb => ({
        feedback: fb.feedback,
        commentLength: fb.comment?.length || 0,
        isManual: !!fb.user,
        createdAt: fb.createdAt,
      })) || [],
    };
    this.telemetry.logEvent('DataHarmonized', { entityId: decision.id, type: 'decision' });
    return harmonized;
  }

  /**
   * Harmonizes user onboarding data.
   * @param userOnboarding The raw UserOnboarding object.
   * @returns A harmonized, AI-ready user onboarding object.
   */
  harmonizeUserOnboardingData(userOnboarding: UserOnboarding | undefined): Record<string, any> {
    if (!userOnboarding) return {};
    let parsedData = {};
    try {
      parsedData = userOnboarding.data ? JSON.parse(userOnboarding.data) : {};
    } catch (e) {
      console.error('Failed to parse user onboarding data:', e);
      this.telemetry.logEvent('DataHarmonizationError', { entityId: userOnboarding.id, error: (e as Error).message });
    }

    const harmonized = {
      id: userOnboarding.id,
      status: userOnboarding.status,
      createdAt: userOnboarding.createdAt,
      applicantDetails: parsedData, // Assume parsedData contains relevant applicant details
      // Add other relevant fields for AI if necessary
    };
    this.telemetry.logEvent('DataHarmonized', { entityId: userOnboarding.id, type: 'userOnboarding' });
    return harmonized;
  }
}
export const geminiDataHarmonizer = new GeminiDataHarmonizer();
GeminiServiceRegistry.register('DataHarmonizer', geminiDataHarmonizer);


/**
 * @exports GeminiComplianceAIDecisionEngine
 * The central AI intelligence for compliance decisions, embodying prompt-based learning
 * and dynamic decision-making. It interacts with other Gemini services.
 */
export class GeminiComplianceAIDecisionEngine {
  private promptEngine: GeminiPromptEngine;
  private knowledgeBase: GeminiKnowledgeBase;
  private telemetry: GeminiTelemetryAgent;
  private billingTracker: GeminiBillingTracker;
  private circuitBreaker: GeminiCircuitBreaker;

  constructor() {
    this.promptEngine = GeminiServiceRegistry.get<GeminiPromptEngine>('PromptEngine')!;
    this.knowledgeBase = GeminiServiceRegistry.get<GeminiKnowledgeBase>('KnowledgeBase')!;
    this.telemetry = GeminiServiceRegistry.get<GeminiTelemetryAgent>('TelemetryAgent')!;
    this.billingTracker = GeminiServiceRegistry.get<GeminiBillingTracker>('BillingTracker')!;
    this.circuitBreaker = GeminiServiceRegistry.get<GeminiCircuitBreaker>('ComplianceAICircuitBreaker')!;
    if (!this.promptEngine || !this.knowledgeBase || !this.telemetry || !this.billingTracker || !this.circuitBreaker) {
      throw new Error("GeminiComplianceAIDecisionEngine failed to initialize: missing core services.");
    }
    this.telemetry.logEvent('AIDecisionEngineInitialized', {});
  }

  /**
   * Simulates an AI call to analyze decision feedback.
   * @param decision Harmonized decision data.
   * @param proposedFeedback Human proposed feedback.
   * @param comment Human comment.
   * @param isOverriding Whether the decision is overriding.
   * @returns AI's analysis and recommendation.
   */
  async analyzeDecisionFeedback(
    decision: Record<string, any>,
    proposedFeedback: DecisionFeedbackFeedbackEnum,
    comment: string,
    isOverriding: boolean,
  ): Promise<{
    aiConfidence: number;
    aiRecommendation: string;
    suggestedCommentImprovements: string[];
    potentialRisks: string[];
    isOverrideRecommended: boolean;
    simulatedCost: number;
  }> {
    const startTime = Date.now();
    this.telemetry.logEvent('FeedbackAnalysisInitiated', { decisionId: decision.id });

    return this.circuitBreaker.execute(async () => {
      // Simulate external LLM call with a delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

      const prompt = this.promptEngine.generateFeedbackAnalysisPrompt(
        decision as DecisionGraphqlType, // Cast back for prompt generation
        proposedFeedback,
        comment,
        isOverriding,
      );

      // --- Simulate AI Reasoning and Decision-Making ---
      // This is where the LLM would process the prompt and return a structured response.
      // For demonstration, we'll use a rule-based simulation augmented by knowledge base.
      const feedbackGuidance = this.knowledgeBase.retrieve<any>(
        `decisionFeedbackGuidance:${decision.status}:${proposedFeedback}`
      ) || { minCommentLength: 10, recommendedKeywords: [], riskFactor: 0.2 };

      let aiConfidence = 85;
      let aiRecommendation = "Feedback seems reasonable.";
      const suggestedCommentImprovements: string[] = [];
      const potentialRisks: string[] = [];
      let isOverrideRecommended = true; // Default recommendation

      if (comment.length < feedbackGuidance.minCommentLength) {
        suggestedCommentImprovements.push(`Comment is too short. Please provide more detail (minimum ${feedbackGuidance.minCommentLength} characters).`);
        aiConfidence -= 10;
      }
      if (!feedbackGuidance.recommendedKeywords.some((kw: string) => comment.toLowerCase().includes(kw))) {
        suggestedCommentImprovements.push(`Consider including keywords like: ${feedbackGuidance.recommendedKeywords.join(', ')}.`);
        aiConfidence -= 5;
      }

      if (isOverriding) {
        potentialRisks.push(`Overriding a "${decision.status}" decision to "${proposedFeedback}" carries a higher inherent risk.`);
        aiConfidence -= Math.floor(feedbackGuidance.riskFactor * 10);
        if (decision.riskScore && decision.riskScore > 70 && proposedFeedback === DecisionFeedbackFeedbackEnum.Approved) {
            potentialRisks.push("High-risk entity detected. Overriding to 'Approved' without strong justification is highly discouraged.");
            aiConfidence -= 20;
            isOverrideRecommended = false;
        }
      }

      if (aiConfidence < 50) {
        aiRecommendation = "Requires further review. AI suggests caution.";
        isOverrideRecommended = false;
      } else if (aiConfidence < 70) {
        aiRecommendation = "Moderately confident, review suggested improvements.";
      } else {
        aiRecommendation = "Confident in feedback, proceeds with caution.";
      }

      // Cap confidence
      aiConfidence = Math.max(0, Math.min(100, aiConfidence));

      const duration = Date.now() - startTime;
      const simulatedCost = 0.05 + (prompt.length / 1000) * 0.002; // Simulate cost based on prompt length
      this.billingTracker.recordCost('LLM_inference:feedback_analysis', simulatedCost, { decisionId: decision.id });
      this.telemetry.recordTraceSpan('analyzeDecisionFeedback', duration, 'success', { decisionId: decision.id, aiConfidence, simulatedCost });

      // Simulate AI learning/adaptation based on outcomes
      this.knowledgeBase.adapt(`feedback_pattern:${decision.id}`, {
        decisionStatus: decision.status,
        proposedFeedback,
        commentLength: comment.length,
        aiConfidence,
        potentialRisks: potentialRisks.length > 0,
        override: isOverriding,
        learnedAt: new Date().toISOString(),
      });

      return {
        aiConfidence,
        aiRecommendation,
        suggestedCommentImprovements,
        potentialRisks,
        isOverrideRecommended,
        simulatedCost,
      };
    });
  }

  /**
   * Recommends an optimal default section for the DecisionView based on AI reasoning.
   * @param decision The current decision object.
   * @param availableSections List of available section keys.
   * @param userOnboardingData Associated user onboarding data.
   * @returns The recommended section key.
   */
  async recommendDefaultSection(
    decision: DecisionGraphqlType,
    availableSections: string[],
    userOnboardingData: UserOnboarding | undefined,
  ): Promise<string> {
    const startTime = Date.now();
    this.telemetry.logEvent('SectionRecommendationInitiated', { decisionId: decision.id });

    return this.circuitBreaker.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100)); // Simulate AI processing

      const prompt = this.promptEngine.generateSectionRecommendationPrompt(
        decision,
        availableSections,
        userOnboardingData,
      );

      // --- Simulate AI Reasoning for Section Recommendation ---
      // In a real system, an LLM would interpret the prompt and return the best section.
      // For demonstration, we'll use a rule-based approach informed by potential AI logic.
      let recommendedSection: string = 'entityDetails'; // Default fallback

      if (decision.status === Decision__StatusEnum.Denied && availableSections.includes('auditTrail')) {
        recommendedSection = 'auditTrail'; // If denied, audit is often critical
      } else if (decision.decisionableType === DecisionableTypeEnum.Counterparty && availableSections.includes('watchlist')) {
        recommendedSection = 'watchlist'; // For counterparties, watchlists are key
      } else if (decision.verifications?.some(v => v.verificationType === Verification__TypeEnum.BeneficialOwner) && availableSections.includes('people')) {
        recommendedSection = 'people'; // If BO checks, focus on people
      } else if (decision.decisionableType === DecisionableTypeEnum.UserOnboarding && availableSections.includes('submittedInput')) {
        // If it's a new onboarding, maybe submitted input is most relevant initially
        recommendedSection = 'submittedInput';
      }

      // Validate against available sections
      if (!availableSections.includes(recommendedSection)) {
        recommendedSection = availableSections[0] || 'entityDetails'; // Fallback to first available or entityDetails
      }

      const duration = Date.now() - startTime;
      const simulatedCost = 0.02 + (prompt.length / 1000) * 0.001;
      this.billingTracker.recordCost('LLM_inference:section_recommendation', simulatedCost, { decisionId: decision.id, recommendedSection });
      this.telemetry.recordTraceSpan('recommendDefaultSection', duration, 'success', { decisionId: decision.id, recommendedSection, simulatedCost });

      return recommendedSection;
    });
  }
}
export const geminiComplianceAIDecisionEngine = new GeminiComplianceAIDecisionEngine();
GeminiServiceRegistry.register('ComplianceAIDecisionEngine', geminiComplianceAIDecisionEngine);


/**
 * @exports GeminiInsightsPanel
 * A new UI component to display AI-generated insights, risks, and recommendations.
 */
export interface GeminiInsightsPanelProps {
  decisionId: string;
  aiConfidence: number | null;
  aiRecommendation: string | null;
  suggestedCommentImprovements: string[];
  potentialRisks: string[];
  isOverrideRecommended: boolean | null;
  isLoading: boolean;
  error: string | null;
  simulatedCost: number | null;
}

export const GeminiInsightsPanel: React.FC<GeminiInsightsPanelProps> = ({
  decisionId,
  aiConfidence,
  aiRecommendation,
  suggestedCommentImprovements,
  potentialRisks,
  isOverrideRecommended,
  isLoading,
  error,
  simulatedCost,
}) => {
  if (isLoading) {
    return (
      <div className="bg-gemini-200 p-4 rounded-lg shadow-md mb-6 animate-pulse">
        <Heading level="h3" size="s" className="text-gemini-800">
          Gemini AI Insights Loading...
        </Heading>
        <LoadingLine />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6">
        <strong className="font-bold">Gemini AI Error:</strong>
        <span className="block sm:inline ml-2">{error}</span>
        <p className="text-sm mt-1">Please check the circuit breaker status or try again later.</p>
      </div>
    );
  }

  if (aiConfidence === null) {
    return null; // Don't show if no insights yet
  }

  const confidenceColor = aiConfidence >= 80 ? 'text-green-600' : aiConfidence >= 60 ? 'text-yellow-600' : 'text-red-600';
  const overrideRecommendationColor = isOverrideRecommended ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-gemini-100 border border-gemini-300 p-4 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-2">
        <Heading level="h3" size="s" className="text-gemini-800">
          Gemini AI Decision Insights
        </Heading>
        {simulatedCost !== null && (
          <span className="text-sm text-gemini-600 italic">
            AI Cost: ${simulatedCost.toFixed(3)}
          </span>
        )}
      </div>

      <p className="text-gemini-700 mb-2">
        <strong className="font-medium">AI Confidence:</strong>{' '}
        <span className={confidenceColor}>{aiConfidence}%</span> - {aiRecommendation}
      </p>

      {potentialRisks.length > 0 && (
        <div className="mb-2">
          <strong className="font-medium text-red-700">Potential Risks:</strong>
          <ul className="list-disc list-inside text-red-600 text-sm">
            {potentialRisks.map((risk, i) => (
              <li key={`risk-${i}`}>{risk}</li>
            ))}
          </ul>
        </div>
      )}

      {suggestedCommentImprovements.length > 0 && (
        <div className="mb-2">
          <strong className="font-medium text-gemini-700">Suggested Comment Improvements:</strong>
          <ul className="list-disc list-inside text-gemini-600 text-sm">
            {suggestedCommentImprovements.map((imp, i) => (
              <li key={`imp-${i}`}>{imp}</li>
            ))}
          </ul>
        </div>
      )}

      {isOverrideRecommended !== null && (
        <p className="text-gemini-700 mt-2">
          <strong className="font-medium">AI Override Recommendation:</strong>{' '}
          <span className={overrideRecommendationColor}>
            {isOverrideRecommended ? 'Recommended' : 'Not Recommended'}
          </span>
        </p>
      )}
      <HelpText text={`Insights for Decision ID: ${decisionId}. Powered by Gemini.`} />
    </div>
  );
};
GeminiServiceRegistry.register('GeminiInsightsPanel', GeminiInsightsPanel);


/**
 * @exports useGeminiDecisionEngine
 * A custom React hook to manage the lifecycle and interactions with the Gemini AI Decision Engine.
 * This ensures "Total Integration" and allows the file to "remember, adapt, and predict."
 */
export const useGeminiDecisionEngine = (decision: DecisionGraphqlType | undefined, userOnboarding: UserOnboarding | undefined) => {
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [suggestedCommentImprovements, setSuggestedCommentImprovements] = useState<string[]>([]);
  const [potentialRisks, setPotentialRisks] = useState<string[]>([]);
  const [isOverrideRecommended, setIsOverrideRecommended] = useState<boolean | null>(null);
  const [geminiInsightsLoading, setGeminiInsightsLoading] = useState(false);
  const [geminiInsightsError, setGeminiInsightsError] = useState<string | null>(null);
  const [simulatedCost, setSimulatedCost] = useState<number | null>(null);

  const dataHarmonizer = useMemo(() => GeminiServiceRegistry.get<GeminiDataHarmonizer>('DataHarmonizer'), []);
  const aiDecisionEngine = useMemo(() => GeminiServiceRegistry.get<GeminiComplianceAIDecisionEngine>('ComplianceAIDecisionEngine'), []);
  const telemetry = useMemo(() => GeminiServiceRegistry.get<GeminiTelemetryAgent>('TelemetryAgent'), []);
  const circuitBreaker = useMemo(() => GeminiServiceRegistry.get<GeminiCircuitBreaker>('ComplianceAICircuitBreaker'), []);

  const analyzeFeedback = async (
    proposedFeedback: DecisionFeedbackFeedbackEnum,
    comment: string,
    isOverriding: boolean,
  ) => {
    if (!decision || !dataHarmonizer || !aiDecisionEngine || !telemetry) return;

    setGeminiInsightsLoading(true);
    setGeminiInsightsError(null);
    telemetry.logEvent('AnalyzeFeedbackCall', { decisionId: decision.id, proposedFeedback, isOverriding });

    try {
      const harmonizedDecision = dataHarmonizer.harmonizeDecisionData(decision);
      const result = await aiDecisionEngine.analyzeDecisionFeedback(
        harmonizedDecision,
        proposedFeedback,
        comment,
        isOverriding,
      );
      setAiConfidence(result.aiConfidence);
      setAiRecommendation(result.aiRecommendation);
      setSuggestedCommentImprovements(result.suggestedCommentImprovements);
      setPotentialRisks(result.potentialRisks);
      setIsOverrideRecommended(result.isOverrideRecommended);
      setSimulatedCost(result.simulatedCost);
      telemetry.logEvent('FeedbackAnalysisSuccess', { decisionId: decision.id, aiConfidence: result.aiConfidence });
    } catch (e) {
      const errorMsg = (e instanceof Error) ? e.message : String(e);
      setGeminiInsightsError(`Failed to get AI insights: ${errorMsg}`);
      console.error("Gemini AI Feedback Analysis Error:", e);
      telemetry.logEvent('FeedbackAnalysisError', { decisionId: decision.id, error: errorMsg });
    } finally {
      setGeminiInsightsLoading(false);
    }
  };

  const recommendInitialSection = async (
    availableSections: string[],
    setCurrentSection: (section: string) => void
  ) => {
    if (!decision || !aiDecisionEngine || !telemetry) return;

    telemetry.logEvent('RecommendInitialSectionCall', { decisionId: decision.id });
    try {
      const harmonizedUserOnboarding = dataHarmonizer?.harmonizeUserOnboardingData(userOnboarding);
      const recommended = await aiDecisionEngine.recommendDefaultSection(
        decision,
        availableSections,
        harmonizedUserOnboarding as UserOnboarding // Cast back for compatibility, AI logic uses harmonized
      );
      if (recommended && availableSections.includes(recommended)) {
        setCurrentSection(recommended);
        telemetry.logEvent('SectionRecommendationSuccess', { decisionId: decision.id, recommendedSection: recommended });
      }
    } catch (e) {
      const errorMsg = (e instanceof Error) ? e.message : String(e);
      console.error("Gemini AI Section Recommendation Error:", e);
      telemetry.logEvent('SectionRecommendationError', { decisionId: decision.id, error: errorMsg });
    }
  };

  return {
    analyzeFeedback,
    aiConfidence,
    aiRecommendation,
    suggestedCommentImprovements,
    potentialRisks,
    isOverrideRecommended,
    geminiInsightsLoading,
    geminiInsightsError,
    simulatedCost,
    recommendInitialSection,
    isCircuitOpen: circuitBreaker?.isCircuitOpen, // Expose circuit breaker status
  };
};

// --- END GEMINI INTEGRATION CORE ---

const PAYMENT_ORDER_DETAILS_DATA_MAPPING = {
  id: "Payment Order ID",
};

interface FeedbackFormDetails {
  feedback: DecisionFeedbackFeedbackEnum;
  title: string;
  description: React.ReactElement;
  confirmText: string;
  cancelText: string;
  commentPlaceholderText: string;
  feedbackButtonText: string;
  submitted: boolean;
  decisionOverridden: boolean;
  showOverridingDecisionCheckbox: boolean;
  isOverridingDecisionAllowed?: boolean;
  overridingDecisionCheckboxHint?: string;
}

interface DecisionViewProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

interface DecisionFeedback {
  id: string;
  feedback: DecisionFeedbackFeedbackEnum;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

interface Decision {
  id: string; // Added ID for Gemini integration
  decisionType: Decision__DecisionTypeEnum;
  status: Decision__StatusEnum;
  verifications: Verification[];
  decisionFeedbacks: DecisionFeedback[];
  userTimezone: string;
  overriddenAt: string;
  riskScore?: number; // Added for Gemini
  decisionableType?: DecisionableTypeEnum; // Added for Gemini
}

function getAllowedFeedbackOption(
  decisionStatus: Decision__StatusEnum,
): DecisionFeedbackFeedbackEnum | null {
  switch (decisionStatus) {
    case Decision__StatusEnum.Approved:
      return DecisionFeedbackFeedbackEnum.Denied;
    case Decision__StatusEnum.Denied:
      return DecisionFeedbackFeedbackEnum.Approved;
    default:
      return null;
  }
}

function getLatestOppositeDecisionFeedback(
  decisionFeedbacks: DecisionFeedback[],
  decisionStatus: Decision__StatusEnum,
): DecisionFeedback | null {
  const descSortedDecisionFeedbacks = [...decisionFeedbacks].sort(
    (a, b) =>
      new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime(),
  );

  const oppositeDecisionFeedback = descSortedDecisionFeedbacks.find(
    (decisionFeedback) => {
      const oppositeFeedbackOnDeniedDecision =
        decisionFeedback.feedback === DecisionFeedbackFeedbackEnum.Approved &&
        decisionStatus === Decision__StatusEnum.Denied;

      const oppositeFeedbackOnApprovedDecision =
        decisionFeedback.feedback === DecisionFeedbackFeedbackEnum.Denied &&
        decisionStatus === Decision__StatusEnum.Approved;

      const manualFeedback = decisionFeedback.user !== null;

      return (
        oppositeFeedbackOnDeniedDecision ||
        oppositeFeedbackOnApprovedDecision ||
        manualFeedback
      );
    },
  );

  return oppositeDecisionFeedback || null;
}

function isOverridingDecisionAllowed(decision: Decision): boolean {
  return (
    decision.status === Decision__StatusEnum.Denied &&
    decision.overriddenAt == null
  );
}

function hasDecisionBeenOverridden(decision: Decision): boolean {
  return decision.overriddenAt != null;
}

function shouldShowOverridingDecisionCheckbox(decision: Decision): boolean {
  return (
    isOverridingDecisionAllowed(decision) || hasDecisionBeenOverridden(decision)
  );
}

function getVerification(
  verifications: Decision["verifications"],
  provider: VerificationProviderEnum,
) {
  return (
    verifications.find((verification) => verification.provider === provider) ||
    null
  );
}

function getAllVerifications(
  verifications: Decision["verifications"],
  provider: VerificationProviderEnum,
  type: Verification__TypeEnum,
) {
  return (
    verifications.filter(
      (verification) =>
        verification.provider === provider &&
        verification.verificationType === type,
    ) || null
  );
}
function createFeedbackModalDetails(
  decision: Decision,
  canUserAddDecisionFeedback: boolean,
): FeedbackFormDetails | null {
  if (!decision) {
    return null;
  }

  const { status, decisionFeedbacks } = decision;

  const submittedFeedback = getLatestOppositeDecisionFeedback(
    decisionFeedbacks,
    status,
  );
  const feedback = submittedFeedback
    ? submittedFeedback.feedback
    : getAllowedFeedbackOption(status);

  if (!feedback) {
    return null;
  }

  const capitalizedFeedback =
    feedback.charAt(0).toUpperCase() + feedback.slice(1);

  let overridingDecisionCheckboxHint = "";
  if (feedback === DecisionFeedbackFeedbackEnum.Approved) {
    if (
      decision.decisionType === Decision__DecisionTypeEnum.TransactionMonitoring
    ) {
      overridingDecisionCheckboxHint =
        "When checked, the payment order will continue its normal workflow.";
    } else if (
      decision.decisionType === Decision__DecisionTypeEnum.UserOnboarding
    ) {
      overridingDecisionCheckboxHint = `When checked, the user onboarding will be ${capitalizedFeedback}.`;
    }
  }

  if (submittedFeedback) {
    const headerText = submittedFeedback?.user
      ? `"${capitalizedFeedback}" feedback submitted by ${submittedFeedback.user.name}.`
      : `"${capitalizedFeedback}" feedback was submitted automatically.`;

    const submittedFeedbackDescription = (
      <div>
        <div className="mb-1">{headerText}</div>
        <DateTime timestamp={submittedFeedback.createdAt} />
      </div>
    );

    return {
      commentPlaceholderText: submittedFeedback.comment,
      confirmText: "Ok",
      cancelText: "Close",
      title: "View Decision Feedback",
      feedback,
      description: submittedFeedbackDescription,
      submitted: true,
      feedbackButtonText: "View Decision Feedback",
      showOverridingDecisionCheckbox:
        shouldShowOverridingDecisionCheckbox(decision),
      decisionOverridden: hasDecisionBeenOverridden(decision),
      overridingDecisionCheckboxHint,
    };
  }

  if (!canUserAddDecisionFeedback) {
    return null;
  }

  const description = (
    <div>
      {`Briefly describe why this decision should have been "${capitalizedFeedback}". This action cannot be reversed.`}
    </div>
  );

  return {
    commentPlaceholderText: "Add a comment",
    confirmText: "Submit",
    cancelText: "Cancel",
    title: "Decision Feedback",
    feedback,
    description,
    submitted: false,
    feedbackButtonText: "Add Decision Feedback",
    showOverridingDecisionCheckbox:
      shouldShowOverridingDecisionCheckbox(decision),
    decisionOverridden: hasDecisionBeenOverridden(decision),
    isOverridingDecisionAllowed: isOverridingDecisionAllowed(decision),
    overridingDecisionCheckboxHint,
  };
}

function shouldShowDecisionFeedbackButton(decision: Decision): boolean {
  if (!decision || !decision.verifications) {
    return false;
  }

  return decision.verifications.some(
    (verification) =>
      verification?.provider === VerificationProviderEnum.Sardine,
  );
}

function DecisionView({
  currentSection,
  setCurrentSection,
}: DecisionViewProps) {
  const { decisionId } = useParams<{ decisionId: string }>();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const { dispatchError, dispatchSuccess } = useDispatchContext();
  const [comment, setComment] = useState<string>("");
  const [handleDecisionFeedback] = useHandleDecisionFeedbackMutation({
    refetchQueries: ["handleDecisionFeedbackMutation"],
  });
  const queryArgs = useMemo(
    () => ({
      entityId: decisionId,
      entityType: "Compliance::Decision",
    }),
    [decisionId],
  );
  const { loading, data, refetch } = useDecisionViewQuery({
    variables: { id: decisionId },
  });
  const decision = data?.decision;
  const isCounterparty =
    decision?.decisionableType === DecisionableTypeEnum.Counterparty;
  const hasBeneficialOwnerCheck = Boolean(
    decision?.verifications.filter(
      (verification) =>
        verification.verificationType ===
        Verification__TypeEnum.BeneficialOwner,
    ).length,
  );

  const verifications = (decision?.verifications as Verification[]) || [];
  const middeskVerification = getVerification(
    verifications,
    VerificationProviderEnum.Middesk,
  );
  const sardineVerification = getVerification(
    verifications,
    VerificationProviderEnum.Sardine,
  );
  const boVerifications = getAllVerifications(
    verifications,
    VerificationProviderEnum.Sardine,
    Verification__TypeEnum.BeneficialOwner,
  );

  const decisionable = decision?.decisionable as UserOnboarding;
  const userOnboarding = decisionable?.data ? JSON.parse(decisionable.data) : undefined;

  const sections = useMemo(() => getSections(
    verifications,
    decision?.decisionableType || DecisionableTypeEnum.UserOnboarding,
    "Decision",
  ), [verifications, decision?.decisionableType]);

  // Gemini AI Integration for Feedback and Section Recommendation
  const {
    analyzeFeedback,
    aiConfidence,
    aiRecommendation,
    suggestedCommentImprovements,
    potentialRisks,
    isOverrideRecommended,
    geminiInsightsLoading,
    geminiInsightsError,
    simulatedCost,
    recommendInitialSection,
    isCircuitOpen,
  } = useGeminiDecisionEngine(decision as DecisionGraphqlType, decisionable);


  // AI-powered initial section selection
  useEffect(() => {
    if (!loading && decision && sections.length > 0) {
      recommendInitialSection(sections.map(s => s.id), setCurrentSection);
    }
  }, [loading, decision, sections, recommendInitialSection, setCurrentSection]);


  const canUserAddDecisionFeedback =
    data?.canUserAddDecisionFeedback?.canAdd || false;
  const feedbackModalDetails = createFeedbackModalDetails(
    decision as unknown as Decision,
    canUserAddDecisionFeedback,
  );
  const feedback = feedbackModalDetails?.feedback;
  const feedbackSubmitted = feedbackModalDetails?.submitted || false;
  const showFeedbackForm =
    feedbackModalDetails &&
    !feedbackSubmitted &&
    canUserAddDecisionFeedback &&
    decision?.status !== Decision__StatusEnum.Cancelled;
  const showDecisionFeedbackButton =
    feedbackModalDetails &&
    shouldShowDecisionFeedbackButton(decision as unknown as Decision);
  const showSubmittedFeedback = feedbackModalDetails && feedbackSubmitted;
  const [overridingDecisionCheckboxValue, setOverridingDecisionCheckboxValue] =
    useState(feedbackModalDetails?.isOverridingDecisionAllowed || false);

  const title = decision?.decisionableTitle;

  useEffect(() => {
    if (feedbackModalDetails?.isOverridingDecisionAllowed) {
      setOverridingDecisionCheckboxValue(
        feedbackModalDetails?.isOverridingDecisionAllowed,
      );
    }
  }, [feedbackModalDetails?.isOverridingDecisionAllowed]);

  // Trigger AI analysis when comment or override changes in the modal
  useEffect(() => {
    if (showFeedbackForm && feedback && decision && comment !== "") { // Only analyze if comment is not empty
      analyzeFeedback(feedback, comment, overridingDecisionCheckboxValue);
    }
  }, [comment, overridingDecisionCheckboxValue, feedback, decision, showFeedbackForm, analyzeFeedback]);


  const handleFeedback = async () => {
    if (!feedback || !decision || isCircuitOpen) { // Prevent submission if circuit is open
      dispatchError("Cannot submit feedback. AI services are temporarily unavailable.");
      telemetryAgent.logEvent('FeedbackSubmissionBlocked', { decisionId, reason: 'CircuitOpen' });
      return;
    }
    const input: DecisionFeedbackInput = {
      comment,
      decisionId,
      feedback,
    };

    if (overridingDecisionCheckboxValue) {
      input.overridingDecision = true;
    }

    // AI pre-check for override recommendation
    if (overridingDecisionCheckboxValue && isOverrideRecommended === false && aiConfidence !== null && aiConfidence < 70) {
        // If AI strongly advises against override, ask for user confirmation / warning
        if (!window.confirm("Gemini AI strongly advises against overriding this decision due to potential risks. Are you sure you want to proceed?")) {
            telemetryAgent.logEvent('OverrideBlockedByAIConsult', { decisionId });
            return; // User cancelled
        }
    }


    setIsSubmittingFeedback(true);
    telemetryAgent.logEvent('FeedbackSubmissionAttempt', { decisionId, feedback, overridingDecision: input.overridingDecision });

    try {
      const response = await handleDecisionFeedback({
        variables: {
          input: {
            input,
          },
        },
      });

      if (response?.data?.handleDecisionFeedback?.errors) {
        dispatchError("Sorry, but something went wrong.");
        telemetryAgent.logEvent('FeedbackSubmissionFailed', { decisionId, error: response.data.handleDecisionFeedback.errors });
      } else {
        dispatchSuccess("Your decision feedback was successfully received.");
        await refetch();
        telemetryAgent.logEvent('FeedbackSubmissionSuccess', { decisionId, aiConfidenceAtSubmission: aiConfidence });
      }
    } catch (error) {
      dispatchError("Sorry, but something went wrong.");
      telemetryAgent.logEvent('FeedbackSubmissionError', { decisionId, error: (error as Error).message });
    } finally {
      setIsFeedbackModalOpen(false);
      setIsSubmittingFeedback(false);
      // Reset AI insights after submission
      setAiConfidence(null);
      setAiRecommendation(null);
      setSuggestedCommentImprovements([]);
      setPotentialRisks([]);
      setIsOverrideRecommended(null);
      setSimulatedCost(null);
    }
  };

  let content;
  switch (currentSection) {
    case "submittedInput": {
      content = (
        <ComplianceEntityDetails
          decision={decision as DecisionGraphqlType}
          showUserOnboardingOnly
        />
      );
      break;
    }
    case "events":
      content = (
        <EntityEventTableView entityId={decisionId} resource="decision" />
      );
      break;
    case "entityDetails":
      content = (
        <ComplianceEntityDetails decision={decision as DecisionGraphqlType} />
      );
      break;
    case "auditTrail":
      content = (
        <>
          {(loading || !data) && (
            <KeyValueTableSkeletonLoader
              dataMapping={PAYMENT_ORDER_DETAILS_DATA_MAPPING}
            />
          )}
          {!loading && data && (
            <AuditRecordsHome queryArgs={queryArgs} hideHeadline />
          )}
        </>
      );
      break;
    case "watchlist": {
      const verification = middeskVerification || sardineVerification;
      content = <Watchlists verification={verification} />;
      break;
    }
    case "registrations":
      content = <BusinessRegistration verification={middeskVerification} />;
      break;
    case "people":
      content = (
        <People
          data={decision as DecisionGraphqlType}
          verification={middeskVerification}
          boVerifications={boVerifications}
          userOnboarding={JSON.stringify(userOnboarding || {})}
          hasBeneficialOwnerCheck={hasBeneficialOwnerCheck}
        />
      );
      break;
    case "documents":
      content = (
        <DocumentUploadContainer
          documentable_id={decisionId}
          documentable_type="Decision"
          enableActions={!!decision?.canCreate}
        />
      );
      break;
    default:
      content = null;
      break;
  }

  return (
    <MTContainer>
      <div>
        {loading ? (
          <div className="mb-2 mt-1 flex h-6 w-48">
            <LoadingLine noHeight />
          </div>
        ) : (
          <div className="mb-2 mt-1 flex w-full flex-row items-center">
            <div className="flex w-1/2 items-center">
              <Heading level="h2" size="l" className="max-w-sm">
                <OverflowTip className="truncate" message={title || ""}>
                  {title}
                </OverflowTip>
              </Heading>
              <div className="ml-4" id="decision-status-badge">
                <ComplianceStatusBadge status={decision?.status} />
              </div>
            </div>
            {showDecisionFeedbackButton && (
              <div className="flex w-1/2 flex-row-reverse">
                <div className="ml-2">
                  <Button
                    buttonType="secondary"
                    onClick={() => {
                      setIsFeedbackModalOpen(true);
                      // Reset AI insights when modal opens for a fresh analysis
                      setAiConfidence(null);
                      setAiRecommendation(null);
                      setSuggestedCommentImprovements([]);
                      setPotentialRisks([]);
                      setIsOverrideRecommended(null);
                      setSimulatedCost(null);
                      if (feedback && decision && comment !== "") {
                        analyzeFeedback(feedback, comment, overridingDecisionCheckboxValue);
                      }
                    }}
                  >
                    {feedbackModalDetails.feedbackButtonText}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="pt-4">
          {isCounterparty ? (
            <WatchlistProfileView
              decisionable={decision as DecisionGraphqlType}
              verification={middeskVerification || sardineVerification}
            />
          ) : (
            <div>
              <RiskProfileView
                loading={loading}
                verifications={decision?.verifications as Verification[]}
                vendorChecks={
                  (decision as DecisionGraphqlType)?.decisionable
                    ?.vendorChecks || []
                }
                expandable
              />
            </div>
          )}
          <div className="my-8">
            <SectionNavigator
              sections={sections}
              currentSection={currentSection}
              onClick={setCurrentSection}
            />
          </div>
          {content}
        </div>
        {showFeedbackForm && (
          <ConfirmModal
            isOpen={isFeedbackModalOpen}
            setIsOpen={setIsFeedbackModalOpen}
            confirmText={feedbackModalDetails.confirmText}
            cancelText={feedbackModalDetails.cancelText}
            title={feedbackModalDetails.title}
            cancelDisabled={isSubmittingFeedback || geminiInsightsLoading}
            confirmDisabled={isSubmittingFeedback || comment === "" || geminiInsightsLoading || isCircuitOpen}
            onConfirm={() => {
              handleFeedback().catch(() => {});
            }}
          >
            <div>
              {feedbackModalDetails.description}
              <div className="mt-4">
                 {/* Gemini AI Insights Panel integrated directly into the feedback modal */}
                {decision && (
                  <GeminiInsightsPanel
                    decisionId={decision.id}
                    aiConfidence={aiConfidence}
                    aiRecommendation={aiRecommendation}
                    suggestedCommentImprovements={suggestedCommentImprovements}
                    potentialRisks={potentialRisks}
                    isOverrideRecommended={isOverrideRecommended}
                    isLoading={geminiInsightsLoading}
                    error={geminiInsightsError}
                    simulatedCost={simulatedCost}
                  />
                )}
                <Textarea
                  name="comment"
                  disabled={feedbackSubmitted}
                  placeholder={feedbackModalDetails.commentPlaceholderText}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={10}
                />

                {feedbackModalDetails.showOverridingDecisionCheckbox && (
                  <div className="mt-2">
                    <FieldGroup direction="left-to-right">
                      <Checkbox
                        checked={overridingDecisionCheckboxValue}
                        name="override-decision-checkbox"
                        id="override-decision-checkbox"
                        onChange={() =>
                          setOverridingDecisionCheckboxValue(
                            !overridingDecisionCheckboxValue,
                          )
                        }
                        disabled={feedbackSubmitted}
                      />
                      <Label id="override-decision-checkbox">
                        Override Decision to Approved
                      </Label>
                    </FieldGroup>
                    <div className="ml-6">
                      <HelpText
                        text={
                          feedbackModalDetails.overridingDecisionCheckboxHint
                        }
                      />
                    </div>
                  </div>
                )}
                {isCircuitOpen && (
                  <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                    <p className="font-bold">AI Services Unavailable:</p>
                    <p>The Gemini AI circuit breaker is open. Feedback submission might be impacted or less intelligent. Please try again later.</p>
                  </div>
                )}
              </div>
            </div>
          </ConfirmModal>
        )}
        {showSubmittedFeedback && (
          <ConfirmModal
            title="Decision Feedback"
            isOpen={isFeedbackModalOpen}
            onRequestClose={() => setIsFeedbackModalOpen(false)}
            setIsOpen={() => setIsFeedbackModalOpen(false)}
            onConfirm={() => setIsFeedbackModalOpen(false)}
          >
            <div>
              {feedbackModalDetails.description}
              <div className="mt-4">
                <Textarea
                  name="submitted-comment"
                  disabled={feedbackSubmitted}
                  value={feedbackModalDetails.commentPlaceholderText}
                  onChange={(e) => setComment(e.target.value)}
                  rows={10}
                />

                {feedbackModalDetails.showOverridingDecisionCheckbox && (
                  <div className="mt-2">
                    <FieldGroup direction="left-to-right">
                      <Checkbox
                        checked={feedbackModalDetails.decisionOverridden}
                        name="override-decision-checkbox-submitted"
                        id="override-decision-checkbox-submitted"
                        onChange={() => {}}
                        disabled
                      />
                      <Label id="override-decision-checkbox">
                        Override Decision to Approved
                      </Label>
                    </FieldGroup>
                    <div className="ml-6">
                      <HelpText
                        text={
                          feedbackModalDetails.overridingDecisionCheckboxHint
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ConfirmModal>
        )}
      </div>
    </MTContainer>
  );
}

export default sectionWithNavigator(DecisionView, "entityDetails");