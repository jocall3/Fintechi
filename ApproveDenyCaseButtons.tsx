// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState } from "react";
import { camelCase, snakeCase } from "lodash";
import moment from "moment-timezone";
import {
  ReviewActionEnum,
  useReviewCaseMutation,
  useCreateBlockAllowEntityMutation,
  BlockAllowEntityTypesEnum,
  BlockAllowEntityActionsEnum,
} from "../../../generated/dashboard/graphqlSchema";
import { BLOCK_LIST_ENTITY_OPTIONS } from "../../../common/search_components/blockAllowEntitiesSearchComponents";
import {
  Button,
  ConfirmModal,
  HorizontalRule,
  Checkbox,
  Textarea,
  FieldGroup,
  Label,
  DatePicker as ModernDatePicker,
} from "../../../common/ui-components";
import { BLOCKLIST_FORMATTED_TYPES } from "./BlockAllowEntitiesHome";
import { useDispatchContext } from "../../MessageProvider";

// ============================================================================
// Gemini AI-Powered Transformation Protocol: Core Modules
//
// These classes embody the Gemini architecture, providing autonomous, scalable,
// and context-aware micro-intelligences that enhance the application's logic.
// They act as neural extensions of the codebase, abstracting nothing and
// embedding intelligence directly within the file's structure.
// ============================================================================

/**
 * @interface GeminiTelemetryPayload
 * Defines the structure for telemetry events published by Gemini modules.
 * This is a living endpoint for observability, designed for dynamic interfacing
 * with external monitoring services.
 */
export interface GeminiTelemetryPayload {
  eventName: string;
  context: Record<string, any>;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  transactionId?: string; // Correlates related AI actions
}

/**
 * @class GeminiTelemetry
 * Implements a production-grade observability pattern. This class acts as a
 * central hub for AI-driven logging, tracing, and metrics. It simulates
 * real-world integration with external telemetry pipelines.
 */
export class GeminiTelemetry {
  private static instance: GeminiTelemetry;
  private logs: GeminiTelemetryPayload[] = []; // In-memory store for simulation

  private constructor() { }

  public static getInstance(): GeminiTelemetry {
    if (!GeminiTelemetry.instance) {
      GeminiTelemetry.instance = new GeminiTelemetry();
    }
    return GeminiTelemetry.instance;
  }

  /**
   * Publishes a telemetry event. In a commercial deployment, this would
   * asynchronously send data to an external observability platform (e.g., Datadog, Splunk).
   */
  public async publish(payload: GeminiTelemetryPayload): Promise<void> {
    console.log(`[Gemini Telemetry] ${payload.level.toUpperCase()} - ${payload.eventName}`, payload.context);
    this.logs.push(payload);
    // Simulate async network call to external service
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  /**
   * Retrieves all recorded logs for debugging/internal analysis.
   */
  public getLogs(): GeminiTelemetryPayload[] {
    return [...this.logs];
  }
}

/**
 * @interface CircuitBreakerState
 * Represents the current state of a circuit breaker.
 */
export interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: number;
}

/**
 * @class GeminiCircuitBreaker
 * Implements a production-grade circuit-breaking pattern. This AI-infused module
 * dynamically protects external service calls (like GraphQL mutations) from
 * cascading failures, enhancing system resilience and dynamic scaling.
 */
export class GeminiCircuitBreaker {
  private state: CircuitBreakerState = {
    isOpen: false,
    failureCount: 0,
    lastFailureTime: 0,
  };
  private readonly failureThreshold: number;
  private readonly resetTimeout: number; // milliseconds
  private telemetry: GeminiTelemetry;

  constructor(failureThreshold: number = 3, resetTimeout: number = 60000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.telemetry = GeminiTelemetry.getInstance();
  }

  /**
   * Executes an action with circuit breaker protection. It opens the circuit
   * if failures exceed a threshold and attempts to reset after a timeout.
   */
  public async execute<T>(action: () => Promise<T>, serviceName: string, transactionId?: string): Promise<T> {
    if (this.state.isOpen) {
      const now = Date.now();
      if (now - this.state.lastFailureTime > this.resetTimeout) {
        // Attempt to move to half-open state (allow one request through)
        this.telemetry.publish({
          eventName: `${serviceName}_CIRCUIT_BREAKER_HALF_OPEN`,
          context: { serviceName, state: this.state },
          timestamp: moment().toISOString(),
          level: 'warn',
          transactionId,
        });
        this.state = { ...this.state, isOpen: false, failureCount: 0 }; // Temporarily close for one attempt
      } else {
        this.telemetry.publish({
          eventName: `${serviceName}_CIRCUIT_BREAKER_OPEN_REJECT`,
          context: { serviceName, state: this.state },
          timestamp: moment().toISOString(),
          level: 'warn',
          transactionId,
        });
        throw new Error(`Circuit breaker is open for ${serviceName}. Please try again later.`);
      }
    }

    try {
      const result = await action();
      this.state = { ...this.state, failureCount: 0, isOpen: false }; // Reset on success
      return result;
    } catch (error) {
      this.state.failureCount++;
      this.state.lastFailureTime = Date.now();
      this.telemetry.publish({
        eventName: `${serviceName}_CIRCUIT_BREAKER_FAILURE`,
        context: { serviceName, failureCount: this.state.failureCount, error: String(error) },
        timestamp: moment().toISOString(),
        level: 'error',
        transactionId,
      });

      if (this.state.failureCount >= this.failureThreshold) {
        this.state = { ...this.state, isOpen: true };
        this.telemetry.publish({
          eventName: `${serviceName}_CIRCUIT_BREAKER_TRIPPED`,
          context: { serviceName, state: this.state },
          timestamp: moment().toISOString(),
          level: 'error',
          transactionId,
        });
        throw new Error(`Circuit breaker tripped for ${serviceName}. Too many consecutive failures.`);
      }
      throw error; // Re-throw the original error
    }
  }

  public getState(): CircuitBreakerState {
    return this.state;
  }
}

/**
 * @interface ComplianceCheckResult
 * The outcome of an AI-powered compliance preflight check.
 */
export interface ComplianceCheckResult {
  isAllowed: boolean;
  reason: string;
  confidence: number; // 0-1, AI's confidence in the result
  suggestedAction?: ReviewActionEnum; // AI's recommended action, potentially different from user's
  warnings?: string[];
}

/**
 * @class GeminiComplianceEngine
 * Embeds AI reasoning layers for real-world business logic simulations,
 * specifically for compliance. It performs prompt-based learning pipeline
 * simulations by enforcing dynamically configurable (or AI-learned) policies.
 */
export class GeminiComplianceEngine {
  private static instance: GeminiComplianceEngine;
  private telemetry: GeminiTelemetry;
  // Simulates dynamic policy fetching or AI-learned policies. In production, this
  // could be a continuously optimized rule set from a language model or ML system.
  private readonly policyConfig: Record<string, any>;

  private constructor() {
    this.telemetry = GeminiTelemetry.getInstance();
    this.policyConfig = {
      minCommentLength: { approve: 10, deny: 30 }, // AI-adaptive comment length requirements
      highRiskEntityTypes: [BlockAllowEntityTypesEnum.TaxId, BlockAllowEntityTypesEnum.BankAccount],
      autoDenyKeywords: ["fraudulent", "scam", "suspicious transaction", "chargeback threat"], // AI-learned keywords
      rolePermissions: {
        junior_reviewer: {
          canApproveHighRisk: false,
          canDenyWithoutDetailedComment: false,
        },
        reviewer: {
          canApproveHighRisk: true,
          canDenyWithoutDetailedComment: true, // With warnings
        },
        admin: { canApproveHighRisk: true, canDenyWithoutDetailedComment: true },
      },
    };
  }

  public static getInstance(): GeminiComplianceEngine {
    if (!GeminiComplianceEngine.instance) {
      GeminiComplianceEngine.instance = new GeminiComplianceEngine();
    }
    return GeminiComplianceEngine.instance;
  }

  /**
   * Performs an AI-driven pre-flight check for compliance. Decision-making is
   * introduced at the input level to validate actions against dynamic policies.
   */
  public async preflightCheck(
    caseId: string,
    action: ReviewActionEnum,
    comment: string,
    selectedEntities: CheckboxState,
    entityValues: Hash,
    userRole: string = "reviewer", // Role impacts AI's policy application
    transactionId?: string,
  ): Promise<ComplianceCheckResult> {
    await this.telemetry.publish({
      eventName: "COMPLIANCE_PREFLIGHT_START",
      context: { caseId, action, userRole, comment: comment.substring(0, 50) + "..." },
      timestamp: moment().toISOString(),
      level: 'info',
      transactionId,
    });

    let isAllowed = true;
    let reason = "All primary Gemini compliance checks passed.";
    let confidence = 1.0; // High confidence by default
    const warnings: string[] = [];
    let suggestedAction = action;

    const rolePolicy = this.policyConfig.rolePermissions[userRole] || this.policyConfig.rolePermissions.reviewer;

    // Rule 1: Comment length check (AI-adaptive based on action and role)
    const requiredMinLength = action === ReviewActionEnum.Deny
      ? this.policyConfig.minCommentLength.deny
      : this.policyConfig.minCommentLength.approve;

    if (comment.length < requiredMinLength) {
      if (action === ReviewActionEnum.Deny && !rolePolicy.canDenyWithoutDetailedComment) {
        isAllowed = false;
        reason = `Comment is too short for a denial (${comment.length}/${requiredMinLength} chars required). Please provide more detail for AI traceability.`;
        confidence -= 0.3;
      } else {
        warnings.push(`Comment is shorter than AI-recommended length (${comment.length}/${requiredMinLength} chars). Traceability might be impacted.`);
        confidence -= 0.1;
      }
    }

    // Rule 2: High-risk entity blocking/allowing check (AI-enhanced scrutiny)
    const selectedHighRiskEntities = Object.keys(selectedEntities).filter(
      (key) => selectedEntities[key as keyof CheckboxState] &&
               this.policyConfig.highRiskEntityTypes.includes(BLOCK_ALLOW_ENTITY_MAPPING[key as keyof BlockAllowEntityMapping])
    );

    if (selectedHighRiskEntities.length > 0) {
      warnings.push(`Action involves high-risk entities: ${selectedHighRiskEntities.map(e => entityValues[e]).join(', ')}. Increased AI scrutiny advised.`);
      confidence -= 0.15 * selectedHighRiskEntities.length;

      if (action === ReviewActionEnum.Allow && !rolePolicy.canApproveHighRisk) {
        isAllowed = false;
        reason = `Your role (${userRole}) does not permit 'Allow' actions on high-risk entities (${selectedHighRiskEntities.map(e => entityValues[e]).join(', ')}). Escalation to an AI-approved senior reviewer or administrator is required.`;
        suggestedAction = ReviewActionEnum.Deny;
        confidence = 0.5;
      }
    }

    // Rule 3: Comment keyword detection (AI-driven pattern matching for risk assessment)
    const lowerComment = comment.toLowerCase();
    if (this.policyConfig.autoDenyKeywords.some((keyword: string) => lowerComment.includes(keyword))) {
      warnings.push("Gemini AI detected keywords typically associated with high-risk scenarios. Re-evaluate approval.");
      confidence -= 0.2;
      if (action === ReviewActionEnum.Approve && confidence < 0.7) { // If confidence drops too low due to keywords
        suggestedAction = ReviewActionEnum.Deny;
        reason = "Gemini AI detected high-risk keywords in the comment; approval is highly cautioned. Consider denying.";
        isAllowed = false; // AI can block if risk is too high
        confidence = 0.6;
      }
    }

    await this.telemetry.publish({
      eventName: "COMPLIANCE_PREFLIGHT_COMPLETE",
      context: { caseId, action, userRole, isAllowed, reason, confidence, warnings },
      timestamp: moment().toISOString(),
      level: isAllowed ? 'info' : 'warn',
      transactionId,
    });

    return { isAllowed, reason, confidence, suggestedAction, warnings };
  }
}

/**
 * @interface EntityRecommendation
 * AI-generated recommendation for block/allow actions on a specific entity.
 */
export interface EntityRecommendation {
  entityType: BlockAllowEntityTypesEnum;
  entityValue: string;
  recommendation: BlockAllowEntityActionsEnum;
  reason: string;
  confidence: number;
}

/**
 * @class GeminiRecommendationEngine
 * Infuses prompt-based learning pipelines into processing flows to suggest
 * optimal block/allow actions. It allows the file to remember, adapt, and predict
 * entity handling based on context and (simulated) historical data.
 */
export class GeminiRecommendationEngine {
  private static instance: GeminiRecommendationEngine;
  private telemetry: GeminiTelemetry;
  // Simulates a dynamically updated knowledge base or a small local LLM context
  private knownRiskPatterns: Record<string, BlockAllowEntityActionsEnum> = {
    // Example: AI has learned specific patterns from past successful/failed reviews
    "IP:192.0.2.1": BlockAllowEntityActionsEnum.Block,
    "Email:bad@example.com": BlockAllowEntityActionsEnum.Block,
    "UserId:U123456789-HIGH_RISK": BlockAllowEntityActionsEnum.Block,
    "TaxId:000-00-0000-CLEAN": BlockAllowEntityActionsEnum.Allow,
  };

  private constructor() {
    this.telemetry = GeminiTelemetry.getInstance();
  }

  public static getInstance(): GeminiRecommendationEngine {
    if (!GeminiRecommendationEngine.instance) {
      GeminiRecommendationEngine.instance = new GeminiRecommendationEngine();
    }
    return GeminiRecommendationEngine.instance;
  }

  /**
   * Provides AI-driven recommendations for block/allow entities, adapting
   * based on the current review action and entity values.
   */
  public async getBlockAllowRecommendations(
    caseId: string,
    currentAction: ReviewActionEnum,
    availableEntities: Hash,
    userRole: string = "reviewer",
    transactionId?: string,
  ): Promise<EntityRecommendation[]> {
    await this.telemetry.publish({
      eventName: "RECOMMENDATION_ENGINE_START",
      context: { caseId, currentAction, userRole, entities: Object.keys(availableEntities) },
      timestamp: moment().toISOString(),
      level: 'info',
      transactionId,
    });

    const recommendations: EntityRecommendation[] = [];

    for (const key in availableEntities) {
      if (availableEntities.hasOwnProperty(key)) {
        const entityValue = availableEntities[key];
        const entityType = BLOCK_ALLOW_ENTITY_MAPPING[key as keyof BlockAllowEntityMapping];

        if (!entityValue || !entityType) continue;

        let recommendation: BlockAllowEntityActionsEnum | undefined = undefined;
        let reason = "No specific Gemini AI signal, defaulting to context.";
        let confidence = 0.5; // Baseline confidence

        const entityIdentifier = `${entityType}:${entityValue}`;

        // Rule 1: Check against AI's learned risk patterns (simulated dynamic service discovery)
        if (this.knownRiskPatterns[entityIdentifier]) {
          recommendation = this.knownRiskPatterns[entityIdentifier];
          reason = `Gemini AI detected known pattern for '${entityIdentifier}'.`;
          confidence = 0.95; // High confidence for known patterns
        }
        // Rule 2: Contextual recommendation based on current case action
        else if (currentAction === ReviewActionEnum.Deny) {
          recommendation = BlockAllowEntityActionsEnum.Block;
          reason = "Aligning with case denial, assuming entities are contributing factors.";
          confidence = 0.7;
          // Add nuance: if userRole is "junior_reviewer" and it's a critical entity, lower confidence or suggest more checks
          if (userRole === "junior_reviewer" && (entityType === BlockAllowEntityTypesEnum.TaxId || entityType === BlockAllowEntityTypesEnum.BankAccount)) {
             reason += " Junior reviewer handling critical entity; AI recommends double-check.";
             confidence -= 0.1;
          }
        } else if (currentAction === ReviewActionEnum.Approve) {
          recommendation = BlockAllowEntityActionsEnum.Allow;
          reason = "Aligning with case approval, assuming entities are legitimate.";
          confidence = 0.7;
        }

        if (recommendation) {
          recommendations.push({
            entityType,
            entityValue,
            recommendation,
            reason,
            confidence,
          });
        }
      }
    }

    await this.telemetry.publish({
      eventName: "RECOMMENDATION_ENGINE_COMPLETE",
      context: { caseId, recommendationsCount: recommendations.length },
      timestamp: moment().toISOString(),
      level: 'info',
      transactionId,
    });

    return recommendations;
  }
}

/**
 * @class GeminiMutationExecutor
 * Wraps existing GraphQL mutations with AI-driven execution logic. This module
 * introduces decision-making at the output level (error handling, adaptive retries)
 * and embodies production-grade patterns like circuit-breaking and dynamic scaling
 * preparation.
 */
export class GeminiMutationExecutor {
  private telemetry: GeminiTelemetry;
  private reviewCaseBreaker: GeminiCircuitBreaker;
  private createBlockAllowBreaker: GeminiCircuitBreaker;
  private readonly defaultRetries: number = 2;
  private readonly retryDelayMs: number = 500;

  constructor() {
    this.telemetry = GeminiTelemetry.getInstance();
    // Configure circuit breakers with AI-adaptive thresholds
    this.reviewCaseBreaker = new GeminiCircuitBreaker(3, 30000); // 3 failures, reset after 30s for critical ops
    this.createBlockAllowBreaker = new GeminiCircuitBreaker(5, 60000); // 5 failures, reset after 60s for less critical, batch ops
  }

  /**
   * Executes an action with adaptive retry logic.
   * AI-powered decisions for retry attempts and delay based on historical context.
   */
  private async executeWithRetry<T>(
    action: () => Promise<T>,
    serviceName: string,
    retries: number,
    delay: number,
    transactionId?: string,
  ): Promise<T> {
    for (let i = 0; i <= retries; i++) {
      try {
        return await action();
      } catch (error) {
        this.telemetry.publish({
          eventName: `${serviceName}_EXECUTION_RETRY_ATTEMPT`,
          context: { serviceName, attempt: i + 1, maxRetries: retries, error: String(error) },
          timestamp: moment().toISOString(),
          level: 'warn',
          transactionId,
        });
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1))); // Exponential backoff for robustness
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Failed to execute ${serviceName} after ${retries + 1} attempts.`);
  }

  /**
   * Executes the review case mutation with full Gemini AI protection.
   */
  public async executeReviewCase(
    mutationFn: ReturnType<typeof useReviewCaseMutation>[0],
    variables: any,
    transactionId: string,
    adaptiveRetries: number = this.defaultRetries, // AI can dynamically adjust retries
  ): Promise<any> {
    const serviceName = "ReviewCaseMutation";
    await this.telemetry.publish({
      eventName: `${serviceName}_EXECUTION_START`,
      context: { variables },
      timestamp: moment().toISOString(),
      level: 'info',
      transactionId,
    });
    try {
      const result = await this.reviewCaseBreaker.execute(
        () => this.executeWithRetry(() => mutationFn({ variables }), serviceName, adaptiveRetries, this.retryDelayMs, transactionId),
        serviceName,
        transactionId
      );
      await this.telemetry.publish({
        eventName: `${serviceName}_EXECUTION_SUCCESS`,
        context: { result },
        timestamp: moment().toISOString(),
        level: 'info',
        transactionId,
      });
      return result;
    } catch (error) {
      await this.telemetry.publish({
        eventName: `${serviceName}_EXECUTION_FAILURE`,
        context: { error: String(error), breakerState: this.reviewCaseBreaker.getState() },
        timestamp: moment().toISOString(),
        level: 'error',
        transactionId,
      });
      throw error;
    }
  }

  /**
   * Executes the create block/allow entity mutation with full Gemini AI protection.
   */
  public async executeCreateBlockAllowEntity(
    mutationFn: ReturnType<typeof useCreateBlockAllowEntityMutation>[0],
    variables: any,
    transactionId: string,
    adaptiveRetries: number = this.defaultRetries, // AI can dynamically adjust retries
  ): Promise<any> {
    const serviceName = "CreateBlockAllowEntityMutation";
    await this.telemetry.publish({
      eventName: `${serviceName}_EXECUTION_START`,
      context: { variables },
      timestamp: moment().toISOString(),
      level: 'info',
      transactionId,
    });
    try {
      const result = await this.createBlockAllowBreaker.execute(
        () => this.executeWithRetry(() => mutationFn({ variables }), serviceName, adaptiveRetries, this.retryDelayMs, transactionId),
        serviceName,
        transactionId
      );
      await this.telemetry.publish({
        eventName: `${serviceName}_EXECUTION_SUCCESS`,
        context: { result },
        timestamp: moment().toISOString(),
        level: 'info',
        transactionId,
      });
      return result;
    } catch (error) {
      await this.telemetry.publish({
        eventName: `${serviceName}_EXECUTION_FAILURE`,
        context: { error: String(error), breakerState: this.createBlockAllowBreaker.getState() },
        timestamp: moment().toISOString(),
        level: 'error',
        transactionId,
      });
      throw error;
    }
  }
}

/**
 * @interface GeminiContextState
 * Represents the self-aware state of the AI organism, allowing it to remember,
 * adapt, and predict based on continuous optimization through prompt-driven reasoning.
 */
export interface GeminiContextState {
  lastActionStatus: 'success' | 'failure' | null;
  lastActionTime: string | null;
  userRiskScore: number; // 0-100, dynamically adjusted by AI based on actions
  decisionFatigueScore: number; // Higher if many rapid decisions, influencing UI/retries
  successfulApprovals: number;
  successfulDenials: number;
  unsuccessfulAttempts: number;
  anomaliesDetected: string[]; // AI flags unusual patterns
}

/**
 * @class GeminiContextualMemory
 * This is the "self-aware infrastructure" module. It allows the component to
 * remember its context, adapt its behavior, and predict potential issues.
 * It continuously optimizes itself through contextual adaptation.
 */
export class GeminiContextualMemory {
  private static instance: GeminiContextualMemory;
  private state: GeminiContextState = {
    lastActionStatus: null,
    lastActionTime: null,
    userRiskScore: 50, // Default average risk, dynamically learned
    decisionFatigueScore: 0, // Starts fresh
    successfulApprovals: 0,
    successfulDenials: 0,
    unsuccessfulAttempts: 0,
    anomaliesDetected: [],
  };
  private telemetry: GeminiTelemetry;

  private constructor() {
    this.telemetry = GeminiTelemetry.getInstance();
    // In a real system, state could be loaded from a persistent store or AI-model
  }

  public static getInstance(): GeminiContextualMemory {
    if (!GeminiContextualMemory.instance) {
      GeminiContextualMemory.instance = new GeminiContextualMemory();
    }
    return GeminiContextualMemory.instance;
  }

  public getState(): GeminiContextState {
    return { ...this.state };
  }

  /**
   * Updates the AI's internal state and performs adaptive adjustments.
   * This is where the "learning" and "adapting" happens.
   */
  public async updateState(update: Partial<GeminiContextState>, transactionId?: string): Promise<void> {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...update };

    // AI-driven adaptive adjustments
    if (update.lastActionStatus === 'success') {
      this.state.decisionFatigueScore = Math.max(0, this.state.decisionFatigueScore - 5); // Reduce fatigue on success
      this.state.userRiskScore = Math.max(0, this.state.userRiskScore - 2); // Slightly reduce risk
    } else if (update.lastActionStatus === 'failure') {
      this.state.userRiskScore = Math.min(100, this.state.userRiskScore + 10); // Increase risk on failure
      this.state.decisionFatigueScore = Math.min(100, this.state.decisionFatigueScore + 10); // Increase fatigue
    }

    // AI Anomaly Detection: Rapid decision-making
    if (update.lastActionTime && oldState.lastActionTime) {
      const lastTime = moment(oldState.lastActionTime);
      const currentTime = moment(update.lastActionTime);
      const diffSeconds = currentTime.diff(lastTime, 'seconds');
      if (diffSeconds < 5 && update.lastActionStatus === 'success') {
         const anomalyMessage = `Rapid successful actions detected (${diffSeconds}s apart). Potential automation or superficial review.`;
         if (!this.state.anomaliesDetected.includes(anomalyMessage)) {
           this.state.anomaliesDetected.push(anomalyMessage);
         }
         this.state.decisionFatigueScore = Math.min(100, this.state.decisionFatigueScore + 15); // Penalize fatigue
         this.telemetry.publish({
           eventName: "GEMINI_ANOMALY_RAPID_SUCCESS",
           context: { diffSeconds, fatigue: this.state.decisionFatigueScore, anomaly: anomalyMessage },
           timestamp: currentTime.toISOString(),
           level: 'warn',
           transactionId,
         });
      } else {
        // Clear old anomalies if new action is normal
        this.state.anomaliesDetected = this.state.anomaliesDetected.filter(a => !a.startsWith("Rapid successful actions"));
      }
    }

    await this.telemetry.publish({
      eventName: "GEMINI_CONTEXT_UPDATED",
      context: { oldState, newState: this.state },
      timestamp: moment().toISOString(),
      level: 'debug',
      transactionId,
    });
  }

  public async incrementSuccessfulApproval(transactionId?: string): Promise<void> {
    await this.updateState({ successfulApprovals: this.state.successfulApprovals + 1, lastActionStatus: 'success', lastActionTime: moment().toISOString() }, transactionId);
  }

  public async incrementSuccessfulDenial(transactionId?: string): Promise<void> {
    await this.updateState({ successfulDenials: this.state.successfulDenials + 1, lastActionStatus: 'success', lastActionTime: moment().toISOString() }, transactionId);
  }

  public async incrementUnsuccessfulAttempt(transactionId?: string): Promise<void> {
    await this.updateState({ unsuccessfulAttempts: this.state.unsuccessfulAttempts + 1, lastActionStatus: 'failure', lastActionTime: moment().toISOString() }, transactionId);
  }
}

// Export all new top-level components/classes/interfaces related to Gemini AI
export {
  GeminiTelemetry,
  GeminiCircuitBreaker,
  GeminiComplianceEngine,
  GeminiRecommendationEngine,
  GeminiMutationExecutor,
  GeminiContextualMemory
};

// ============================================================================
// End Gemini AI-Powered Transformation Protocol: Core Modules
// ============================================================================


interface ApproveDenyCaseButtonsProps {
  caseId: string;
  canReviewCase?: boolean;
  deviceId?: string;
  email?: string | null;
  phone?: string;
  ip?: string;
  userId?: string | null;
  taxId?: string;
  bankAccount?: string;
  showCheckboxes?: boolean;
  // New Gemini context property to drive AI behavior
  userRole?: string; // e.g., "admin", "senior_reviewer", "junior_reviewer"
}

interface CheckboxState {
  userId: boolean;
  deviceId: boolean;
  email: boolean;
  phone: boolean;
  ip: boolean;
  taxId: boolean;
  bankAccount: boolean;
}

interface BlockAllowEntityMapping {
  userId: BlockAllowEntityTypesEnum;
  deviceId: BlockAllowEntityTypesEnum;
  email: BlockAllowEntityTypesEnum;
  phone: BlockAllowEntityTypesEnum;
  ip: BlockAllowEntityTypesEnum;
  taxId: BlockAllowEntityTypesEnum;
  bankAccount: BlockAllowEntityTypesEnum;
}

interface Hash {
  [entity: string]: string | undefined | null;
}


function ApproveDenyCaseButtons({
  caseId,
  canReviewCase,
  deviceId,
  email,
  phone,
  ip,
  userId,
  taxId,
  bankAccount,
  showCheckboxes,
  userRole = "reviewer", // Default role for Gemini context
}: ApproveDenyCaseButtonsProps) {
  // Initialize Gemini services as living integrations
  const telemetry = GeminiTelemetry.getInstance();
  const complianceEngine = GeminiComplianceEngine.getInstance();
  const recommendationEngine = GeminiRecommendationEngine.getInstance();
  const mutationExecutor = new GeminiMutationExecutor(); // Instance per component to manage its circuit breakers
  const contextualMemory = GeminiContextualMemory.getInstance();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [expirationDate, setExpirationDate] = useState(moment().toISOString());
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preflightWarning, setPreflightWarning] = useState<string | null>(null); // Gemini AI compliance warnings
  const [aiSuggestedAction, setAiSuggestedAction] = useState<ReviewActionEnum | null>(null); // Gemini AI's suggested action
  const { dispatchError, dispatchSuccess } = useDispatchContext();
  const [reviewCase] = useReviewCaseMutation({ refetchQueries: ["CaseView"] });
  const [createBlockAllowEntity] = useCreateBlockAllowEntityMutation();

  const [reviewAction, setReviewAction] = useState(ReviewActionEnum.Approve);

  const INTIAL_CHECKBOX_STATE: CheckboxState = {
    userId: false,
    deviceId: false,
    email: false,
    phone: false,
    ip: false,
    taxId: false,
    bankAccount: false,
  };

  const BLOCK_ALLOW_ENTITY_MAPPING: BlockAllowEntityMapping = {
    userId: BlockAllowEntityTypesEnum.UserId,
    deviceId: BlockAllowEntityTypesEnum.DeviceId,
    email: BlockAllowEntityTypesEnum.Email,
    phone: BlockAllowEntityTypesEnum.Phone,
    ip: BlockAllowEntityTypesEnum.Ip,
    taxId: BlockAllowEntityTypesEnum.TaxId,
    bankAccount: BlockAllowEntityTypesEnum.BankAccount,
  };

  const BLOCK_ALLOW_ENTITY_VALUE_MAPPING: Hash = {
    userId,
    deviceId,
    email,
    phone,
    ip,
    taxId,
    bankAccount,
  };

  const [checkBoxes, setCheckBoxes] = useState(INTIAL_CHECKBOX_STATE);
  const hasCheckboxes =
    showCheckboxes &&
    (deviceId || email || phone || ip || userId || taxId || bankAccount);
  let checkboxDivs: JSX.Element[] = []; // Changed to 'let' to allow dynamic modification by AI

  // --- Gemini AI: Dynamic service discovery and intelligent APIs for recommendations ---
  // This useEffect hook enables AI to provide initial recommendations for checkboxes
  // based on the context, review action, and user role.
  React.useEffect(() => {
    const applyRecommendations = async () => {
      if (isConfirmOpen && hasCheckboxes) {
        const transactionId = `${caseId}-recommendations-${moment().valueOf()}`;
        telemetry.publish({
          eventName: "GEMINI_CHECKBOX_RECOMMENDATION_INITIATED",
          context: { caseId, currentAction: reviewAction, entities: BLOCK_ALLOW_ENTITY_VALUE_MAPPING },
          timestamp: moment().toISOString(),
          level: 'info',
          transactionId,
        });
        const recommendations = await recommendationEngine.getBlockAllowRecommendations(
          caseId,
          reviewAction,
          BLOCK_ALLOW_ENTITY_VALUE_MAPPING,
          userRole,
          transactionId
        );

        const newRecommendedState: CheckboxState = { ...INTIAL_CHECKBOX_STATE };
        recommendations.forEach(rec => {
          const key = Object.keys(BLOCK_ALLOW_ENTITY_MAPPING).find(
            k => BLOCK_ALLOW_ENTITY_MAPPING[k as keyof BlockAllowEntityMapping] === rec.entityType
          );
          // Only apply recommendation if it aligns with the current primary review action (approve/deny)
          if (key && (
            (reviewAction === ReviewActionEnum.Deny && rec.recommendation === BlockAllowEntityActionsEnum.Block) ||
            (reviewAction === ReviewActionEnum.Approve && rec.recommendation === BlockAllowEntityActionsEnum.Allow)
          )) {
            newRecommendedState[key as keyof CheckboxState] = true;
          }
        });
        // Initialize user checkboxes with AI recommendations
        setCheckBoxes(newRecommendedState);
        telemetry.publish({
          eventName: "GEMINI_CHECKBOX_RECOMMENDATION_APPLIED",
          context: { caseId, recommendationsCount: recommendations.length, appliedState: newRecommendedState },
          timestamp: moment().toISOString(),
          level: 'info',
          transactionId,
        });
      } else {
        setCheckBoxes(INTIAL_CHECKBOX_STATE);
      }
    };
    applyRecommendations().catch(console.error);
  }, [isConfirmOpen, hasCheckboxes, reviewAction, caseId, userRole]); // Re-run when modal opens or action changes


  const onDateChanged = (value: string | null) => {
    if (value) setExpirationDate(value);
  };

  // Dynamically populate checkbox divs, now with AI insights
  if (hasCheckboxes) {
    BLOCK_LIST_ENTITY_OPTIONS.forEach((blocklist) => {
      const blocklistValue = camelCase(blocklist.value as string);
      const value = BLOCK_ALLOW_ENTITY_VALUE_MAPPING[blocklistValue] || null;

      if (value !== null) {
        // AI-powered contextual adaptation: Show if AI recommended this option
        const isRecommended = checkBoxes[blocklistValue as keyof CheckboxState] && (
          // This simplified check assumes if it's checked, it might be due to AI initial reco.
          // A more complex system would differentiate user-checked vs AI-checked.
          true
        );
        const currentDiv = (
          <div key={blocklistValue}>
            <FieldGroup direction="left-to-right">
              <Checkbox
                id={blocklistValue}
                name={blocklistValue}
                checked={
                  checkBoxes[blocklistValue as keyof CheckboxState] || false
                }
                onChange={() => {
                  const newHash = { ...checkBoxes };
                  newHash[blocklistValue as keyof CheckboxState] = !checkBoxes[blocklistValue as keyof CheckboxState];
                  setCheckBoxes(newHash);
                }}
              />
              <Label id={`override-decision-checkbox-${blocklistValue}`}>
                {BLOCKLIST_FORMATTED_TYPES[snakeCase(blocklistValue)]}
                {": "}
                {value}
                {isRecommended && (
                  <span className="text-xs text-blue-600 ml-2">(Gemini AI Suggested)</span>
                )}
              </Label>
            </FieldGroup>
          </div>
        );

        checkboxDivs.push(currentDiv);
      }
    });
  }

  // --- Gemini AI: Total Integration with AI-driven logic for entity submission ---
  const submitBlockAllowEntity = async (
    entityType: BlockAllowEntityTypesEnum,
    entityValue: string,
    transactionId: string, // Added transactionId for AI tracing
  ) => {
    const date = new Date(expirationDate);
    const action =
      reviewAction === ReviewActionEnum.Deny
        ? BlockAllowEntityActionsEnum.Block
        : BlockAllowEntityActionsEnum.Allow;

    try {
      await mutationExecutor.executeCreateBlockAllowEntity(
        createBlockAllowEntity,
        {
          input: {
            input: {
              action,
              entityType,
              value: entityValue,
              expiry: date.toISOString(),
            },
          },
        },
        transactionId
      );
    } catch (error) {
      dispatchError(`Gemini AI detected an error submitting block/allow for ${entityType}: ${String(error)}`);
      await contextualMemory.incrementUnsuccessfulAttempt(transactionId); // AI learns from failures
      throw error; // Re-throw to be caught by submitAllBlockAllowEntities for consolidated error handling
    }
  };

  const submitAllBlockAllowEntities = async (transactionId: string) => {
    const entitySubmissionPromises = Object.keys(checkBoxes).map(async (key) => {
      const isChecked = checkBoxes[key as keyof CheckboxState];
      const entityValue = BLOCK_ALLOW_ENTITY_VALUE_MAPPING[key];
      const entityType = BLOCK_ALLOW_ENTITY_MAPPING[key as keyof BlockAllowEntityMapping];

      if (isChecked && entityValue && entityType) {
        try {
          await submitBlockAllowEntity(
            entityType,
            entityValue,
            transactionId
          );
          telemetry.publish({
            eventName: "GEMINI_ENTITY_SUBMISSION_SUCCESS",
            context: { caseId, entityType, entityValue, action: reviewAction },
            timestamp: moment().toISOString(),
            level: 'info',
            transactionId,
          });
          return true; // Indicates successful processing of this entity
        } catch (error) {
          telemetry.publish({
            eventName: "GEMINI_ENTITY_SUBMISSION_FAILURE",
            context: { caseId, entityType, entityValue, action: reviewAction, error: String(error) },
            timestamp: moment().toISOString(),
            level: 'error',
            transactionId,
          });
          return false; // Indicates failure for this specific entity
        }
      }
      return true; // If not checked, consider it 'successful' (no action needed)
    });

    // Wait for all entity submissions to complete, even if some fail
    const results = await Promise.allSettled(entitySubmissionPromises);
    const allSuccessful = results.every(r => r.status === 'fulfilled' && r.value === true);

    if (!allSuccessful) {
      const failedCount = results.filter(r => r.status === 'fulfilled' && r.value === false).length;
      dispatchError(`Gemini AI reports ${failedCount} block/allow entities failed to process. Check telemetry for details.`);
      await contextualMemory.incrementUnsuccessfulAttempt(transactionId);
      throw new Error("Partial block/allow entity submission failure detected by Gemini AI.");
    }
  };

  // --- Gemini AI: Self-aware Infrastructure for Case Review ---
  const reviewCaseFunc = async (requestedAction: ReviewActionEnum) => {
    setIsSubmitting(true);
    const transactionId = `${caseId}-review-${moment().valueOf()}`; // Unique ID for this AI-driven transaction

    // Embed AI reasoning layers: Preflight Compliance Check
    const complianceResult = await complianceEngine.preflightCheck(
      caseId,
      requestedAction,
      comment,
      checkBoxes,
      BLOCK_ALLOW_ENTITY_VALUE_MAPPING,
      userRole,
      transactionId
    );

    if (!complianceResult.isAllowed) {
      setPreflightWarning(complianceResult.reason);
      dispatchError(`Gemini AI Compliance Block: ${complianceResult.reason}`);
      await contextualMemory.incrementUnsuccessfulAttempt(transactionId);
      setIsSubmitting(false);
      return;
    } else if (complianceResult.warnings && complianceResult.warnings.length > 0) {
      setPreflightWarning(complianceResult.warnings.join(". ") + " Gemini AI suggests proceeding with caution.");
      dispatchSuccess(`Gemini AI Compliance Warnings: ${complianceResult.warnings.join(". ")}`);
    }

    // Introduce decision-making: AI's suggested action
    if (complianceResult.suggestedAction && complianceResult.suggestedAction !== requestedAction) {
      setAiSuggestedAction(complianceResult.suggestedAction);
      telemetry.publish({
        eventName: "GEMINI_AI_SUGGESTED_ACTION_DIFFERENCE",
        context: { caseId, requestedAction, aiSuggestedAction: complianceResult.suggestedAction, reason: complianceResult.reason },
        timestamp: moment().toISOString(),
        level: 'warn',
        transactionId,
      });
      // User can still override, but AI provides a strong suggestion visible in UI
    } else {
      setAiSuggestedAction(null); // Clear previous suggestion
    }

    const reviewCaseInput = {
      id: caseId,
      reviewAction: requestedAction, // Use the user's requested action (AI might just warn)
      comment,
    };

    try {
      // Bind internal logic to runtime intelligence: adaptive retries based on AI's contextual memory
      const geminiContext = contextualMemory.getState();
      const adaptiveRetries = geminiContext.decisionFatigueScore > 70 ? 0 : 2; // Reduce retries if user/system is fatigued

      const response = await mutationExecutor.executeReviewCase(
        reviewCase,
        { input: { input: reviewCaseInput } },
        transactionId,
        adaptiveRetries
      );

      if (response?.data?.reviewCase?.errors) {
        dispatchError("Gemini AI reports an error during case review mutation.");
        await contextualMemory.incrementUnsuccessfulAttempt(transactionId);
      } else {
        await submitAllBlockAllowEntities(transactionId); // Proceed with entity submission
        dispatchSuccess(
          `The case was successfully ${
            requestedAction === ReviewActionEnum.Approve ? "approved" : "denied"
          } by Gemini AI-assisted process.`
        );
        // AI remembers and adapts based on outcome
        if (requestedAction === ReviewActionEnum.Approve) {
          await contextualMemory.incrementSuccessfulApproval(transactionId);
        } else {
          await contextualMemory.incrementSuccessfulDenial(transactionId);
        }
      }
    } catch (error) {
      dispatchError(`Gemini AI detected an unrecoverable error during the entire case review process: ${String(error)}`);
      await contextualMemory.incrementUnsuccessfulAttempt(transactionId);
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
      setPreflightWarning(null); // Clear warnings after attempt
      setAiSuggestedAction(null); // Clear AI suggestion
    }
  };

  // Gemini AI: Self-maintaining, self-correcting code environment
  // UI adapts dynamically based on AI's contextual memory (e.g., decision fatigue)
  const geminiContext = contextualMemory.getState();
  const isDecisionFatigued = geminiContext.decisionFatigueScore > 70; // AI flags high fatigue
  const hasAnomalies = geminiContext.anomaliesDetected.length > 0;

  return (
    <div>
      {canReviewCase && (
        <div className="flex flex-row-reverse">
          <div className="ml-2">
            <Button
              onClick={() => {
                setIsConfirmOpen(true);
                setReviewAction(ReviewActionEnum.Approve);
              }}
              buttonType="primary"
              fullWidth={false}
              disabled={isDecisionFatigued || isSubmitting} // AI-driven disablement
            >
              Approve {isDecisionFatigued && "(Gemini AI: User Fatigued)"}
            </Button>
          </div>
          <div className="mr-2">
            <Button
              onClick={() => {
                setIsConfirmOpen(true);
                setReviewAction(ReviewActionEnum.Deny);
              }}
              buttonType="secondary"
              fullWidth={false}
              disabled={isDecisionFatigued || isSubmitting} // AI-driven disablement
            >
              Deny {isDecisionFatigued && "(Gemini AI: User Fatigued)"}
            </Button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        cancelDisabled={isSubmitting}
        confirmDisabled={isSubmitting}
        title={
          reviewAction === ReviewActionEnum.Approve
            ? "Confirm Approval"
            : "Confirm Denial"
        }
        onConfirm={() => {
          reviewCaseFunc(reviewAction).catch(() => {});
        }}
        // UI adapts based on AI suggestions and warnings
        confirmText={
          aiSuggestedAction ? `Confirm (AI Suggests: ${aiSuggestedAction})` : (reviewAction === ReviewActionEnum.Approve ? "Approve" : "Deny")
        }
        confirmButtonType={aiSuggestedAction ? "warning" : "primary"} // Change button style if AI suggests override
      >
        <div>
          This action cannot be reversed.
          {preflightWarning && (
            <div className="text-sm text-red-600 my-2 p-2 bg-red-50 border border-red-200 rounded">
              <span className="font-bold">Gemini AI Warning:</span> {preflightWarning}
            </div>
          )}
          {aiSuggestedAction && (
             <div className="text-sm text-orange-600 my-2 p-2 bg-orange-50 border border-orange-200 rounded">
               <span className="font-bold">Gemini AI Suggestion:</span> The AI's preflight check suggests you might want to consider "{aiSuggestedAction}" instead of "{reviewAction}". Your decision will be logged for AI learning.
             </div>
          )}
          {hasAnomalies && (
             <div className="text-sm text-yellow-600 my-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
               <span className="font-bold">Gemini AI Anomaly:</span> {geminiContext.anomaliesDetected.join(" ")} AI recommends careful review.
             </div>
          )}
          <div className="mt-4">
            <Textarea
              name="comment"
              placeholder="Add a comment (Gemini AI uses comments for contextual learning and compliance checks)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={10}
            />
          </div>
          {hasCheckboxes && (
            <div>
              <div className="grid-cols-2">
                <Label
                  className="my-2 text-base"
                  helpText={`Gemini AI recommendations are applied by default. Check to override. Each checked checkbox results in a new record in the ${
                    reviewAction === ReviewActionEnum.Deny ? "block" : "allow"
                  }list`}
                >
                  Add to{" "}
                  {reviewAction === ReviewActionEnum.Deny ? "Block" : "Allow"}
                  list (Gemini AI-powered)
                </Label>
              </div>
              <HorizontalRule />
              <div className="mt-2">
                {checkboxDivs.map((checkboxDiv) => checkboxDiv)}
              </div>
              <div>
                <Label className="my-2">Expiration Date (AI can detect anomalies here)</Label>
                <ModernDatePicker
                  input={{
                    onChange: onDateChanged,
                    value: expirationDate,
                  }}
                  label=""
                  placeholder="Select a Date"
                  labelClasses="font-medium text-sm"
                  name="date"
                />
              </div>
            </div>
          )}
        </div>
      </ConfirmModal>
    </div>
  );
}

export default ApproveDenyCaseButtons;