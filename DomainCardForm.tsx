// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import { ClipLoader } from "react-spinners";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React from "react";
import * as Yup from "yup";
import { FormikErrorMessage, FormikInputField } from "../../../common/formik";
import {
  Button,
  ExpandableCard,
  FieldGroup,
  Label,
} from "../../../common/ui-components";

// --- Gemini AI-Powered Core System Integration ---
// This section represents the self-contained universe of AI-driven logic
// as per the Total Gemini Integration & Self-Contained Universe Architecture directive.

// I. AI-Powered Runtime Context & Memory
/**
 * @typedef {object} GeminiDomainContextState - The internal memory and contextual state for the DomainCardForm's AI.
 * @property {string | null} lastValidatedDomain - The last domain string that passed initial syntax validation.
 * @property {boolean | null} lastAIValidationPassed - Result of the last AI-driven validation.
 * @property {string | null} aiValidationFeedback - AI-generated feedback or suggestions.
 * @property {number} submissionAttempts - Counter for form submission attempts.
 * @property {number} aiErrorCount - Counter for AI-driven validation/processing errors.
 * @property {object} telemetryData - Accumulated telemetry specific to this form's interactions.
 * @property {string | null} currentPrompt - The active prompt guiding AI behavior or user interaction.
 * @property {boolean} isCircuitBreakerTripped - Indicates if an external service circuit breaker is tripped.
 * @property {'low' | 'medium' | 'high' | null} predictedRiskLevel - AI's assessment of the domain's risk.
 */
interface GeminiDomainContextState {
  lastValidatedDomain: string | null;
  lastAIValidationPassed: boolean | null;
  aiValidationFeedback: string | null;
  submissionAttempts: number;
  aiErrorCount: number;
  telemetryData: Record<string, any>;
  currentPrompt: string | null;
  isCircuitBreakerTripped: boolean;
  predictedRiskLevel: 'low' | 'medium' | 'high' | null;
}

/**
 * @class GeminiDomainIntelligenceCore
 * @description The central AI brain for the DomainCardForm. Manages state, decision-making,
 *              and interfaces with simulated "external" AI services. This class embodies
 *              the self-contained universe concept. It remembers, adapts, and predicts.
 */
export class GeminiDomainIntelligenceCore {
  private static instance: GeminiDomainIntelligenceCore;
  private state: GeminiDomainContextState;
  private serviceRegistry: GeminiServiceRegistry;
  private observers: Set<React.Dispatch<React.SetStateAction<GeminiDomainContextState>>> = new Set();

  private constructor() {
    this.state = {
      lastValidatedDomain: null,
      lastAIValidationPassed: null,
      aiValidationFeedback: null,
      submissionAttempts: 0,
      aiErrorCount: 0,
      telemetryData: {},
      currentPrompt: "Please enter a custom domain for your business.",
      isCircuitBreakerTripped: false,
      predictedRiskLevel: null,
    };
    this.serviceRegistry = new GeminiServiceRegistry();
    console.log("GeminiDomainIntelligenceCore initialized. Ready for adaptive learning.");
  }

  public static getInstance(): GeminiDomainIntelligenceCore {
    if (!GeminiDomainIntelligenceCore.instance) {
      GeminiDomainIntelligenceCore.instance = new GeminiDomainIntelligenceCore();
    }
    return GeminiDomainIntelligenceCore.instance;
  }

  /**
   * Registers a React state setter as an observer for state changes.
   * This allows components to reactively update when the brain's state changes.
   * @param {React.Dispatch<React.SetStateAction<GeminiDomainContextState>>} observer
   */
  public addObserver(observer: React.Dispatch<React.SetStateAction<GeminiDomainContextState>>): void {
    this.observers.add(observer);
  }

  /**
   * Removes a React state setter from the observers.
   * @param {React.Dispatch<React.SetStateAction<GeminiDomainContextState>>} observer
   */
  public removeObserver(observer: React.Dispatch<React.SetStateAction<GeminiDomainContextState>>): void {
    this.observers.delete(observer);
  }

  /**
   * Notifies all registered observers about the state change.
   */
  private notifyObservers(): void {
    this.observers.forEach(observer => observer({ ...this.state }));
  }

  /**
   * Updates the internal state based on new information or AI reasoning.
   * @param {Partial<GeminiDomainContextState>} newState - The partial state to merge.
   */
  public updateState(newState: Partial<GeminiDomainContextState>): void {
    this.state = { ...this.state, ...newState };
    // Trigger adaptive learning or re-evaluation based on state change
    this.adaptToContext();
    this.predictFutureIntent();
    this.notifyObservers(); // Notify components of state change
  }

  public getState(): GeminiDomainContextState {
    return { ...this.state };
  }

  /**
   * II. Total Integration: AI Reasoning Layer for Domain Validation
   * Simulates an AI-driven advanced domain validation process.
   * @param {string} domain - The domain string to validate.
   * @returns {Promise<{ isValid: boolean; feedback: string; riskLevel: 'low' | 'medium' | 'high' }>} - AI-driven validation result.
   */
  public async performAIVerification(domain: string): Promise<{ isValid: boolean; feedback: string; riskLevel: 'low' | 'medium' | 'high' }> {
    this.updateState({ lastValidatedDomain: domain });

    const aiService = this.serviceRegistry.getService<AICustomDomainValidationService>("DomainValidationService");
    if (!aiService || this.state.isCircuitBreakerTripped || !aiService.isHealthy) {
      this.state.aiErrorCount++;
      const feedback = "AI validation service currently unavailable or circuit breaker tripped. Please try again later.";
      this.updateState({ aiValidationFeedback: feedback, lastAIValidationPassed: false, predictedRiskLevel: 'high' });
      return { isValid: false, feedback, riskLevel: 'high' };
    }

    try {
      const prompt = `Assess the commercial viability, brand risk, and compliance for the custom domain: "${domain}". Provide concise feedback and a risk level (low, medium, high). Consider potential trademark issues, common phishing patterns, and regulatory compliance.`;
      this.updateState({ currentPrompt: `Gemini is evaluating "${domain}"...` });
      const aiResponse = await aiService.analyzeDomain(domain, prompt);

      this.updateState({
        lastAIValidationPassed: aiResponse.isValid,
        aiValidationFeedback: aiResponse.feedback,
        predictedRiskLevel: aiResponse.riskLevel,
        telemetryData: { ...this.state.telemetryData, [`ai_validation_${Date.now()}`]: { domain, isValid: aiResponse.isValid, risk: aiResponse.riskLevel } }
      });

      // Decision-making at output level: dynamic prompt adjustment
      if (!aiResponse.isValid && aiResponse.riskLevel === 'high') {
        this.updateState({ currentPrompt: `High Risk Detected! The domain "${domain}" has high risks. ${aiResponse.feedback} Please enter a different domain.` });
      } else if (!aiResponse.isValid) {
        this.updateState({ currentPrompt: `Gemini suggests: Consider alternatives for "${domain}". ${aiResponse.feedback}` });
      } else {
        this.updateState({ currentPrompt: `Domain "${domain}" looks promising. ${aiResponse.feedback} Ready for final submission.` });
      }

      return aiResponse;
    } catch (error) {
      this.state.aiErrorCount++;
      console.error("Gemini AI validation error:", error);
      this.updateState({ isCircuitBreakerTripped: true, aiValidationFeedback: "AI validation failed due to an unexpected error. Activating circuit breaker.", lastAIValidationPassed: false, predictedRiskLevel: 'high' });
      // Circuit breaking mechanism: Automatically trip on consecutive errors or specific error types
      setTimeout(() => this.updateState({ isCircuitBreakerTripped: false, aiValidationFeedback: "Circuit breaker reset. Please try again." }), 60000); // Reset after 1 minute
      return { isValid: false, feedback: "AI validation failed. Circuit breaker active.", riskLevel: 'high' };
    }
  }

  /**
   * III. Commercial-Grade Logic Infusion: Pre-submission checks.
   * Simulates authentication, billing, and compliance checks.
   * @param {string} domain - The domain to be submitted.
   * @returns {Promise<{ success: boolean; message: string; }>}.
   */
  public async conductPreSubmissionChecks(domain: string): Promise<{ success: boolean; message: string }> {
    this.state.submissionAttempts++; // Increment attempt counter
    if (this.state.isCircuitBreakerTripped) {
      return { success: false, message: "System is in a degraded state. Please try again later." };
    }

    const authService = this.serviceRegistry.getService<AIAuthService>("AuthService");
    const billingService = this.serviceRegistry.getService<AIBillingService>("BillingService");
    const complianceService = this.serviceRegistry.getService<AIComplianceService>("ComplianceService");

    if (!authService?.isHealthy || !billingService?.isHealthy || !complianceService?.isHealthy) {
      this.state.aiErrorCount++;
      this.updateState({ isCircuitBreakerTripped: true, currentPrompt: "Critical AI commercial services are unhealthy. System degraded." });
      return { success: false, message: "Crucial AI commercial services are unavailable or unhealthy." };
    }

    try {
      this.updateState({ currentPrompt: `Gemini is performing final commercial checks for "${domain}"...` });

      // Prompt-based learning pipeline: Auth check
      const authResult = await authService.authenticateUser("user-token-sim", `Verify user permissions for domain submission: ${domain}`);
      if (!authResult.isAuthenticated) {
        this.updateState({ telemetryData: { ...this.state.telemetryData, auth_fail: Date.now() } });
        return { success: false, message: `Authentication failed: ${authResult.reason}` };
      }

      // Prompt-based learning pipeline: Billing check
      const billingResult = await billingService.checkBillingStatus("user-id-sim", `Assess billing impact for adding domain: ${domain}`);
      if (!billingResult.canProceed) {
        this.updateState({ telemetryData: { ...this.state.telemetryData, billing_fail: Date.now() } });
        return { success: false, message: `Billing check failed: ${billingResult.reason}` };
      }

      // Prompt-based learning pipeline: Compliance check
      const complianceResult = await complianceService.checkCompliance(domain, `Evaluate compliance adherence for domain: ${domain}`);
      if (!complianceResult.isCompliant) {
        this.updateState({ telemetryData: { ...this.state.telemetryData, compliance_fail: Date.now() } });
        return { success: false, message: `Compliance check failed: ${complianceResult.reason}` };
      }

      this.updateState({ telemetryData: { ...this.state.telemetryData, pre_submission_success: Date.now() } });
      return { success: true, message: "All pre-submission checks passed." };
    } catch (error) {
      this.state.aiErrorCount++;
      console.error("Gemini pre-submission checks error:", error);
      this.updateState({ telemetryData: { ...this.state.telemetryData, pre_submission_error: error }, isCircuitBreakerTripped: true });
      return { success: false, message: "An AI service error occurred during pre-submission checks." };
    }
  }

  /**
   * II. Total Integration & V. Self-Aware Infrastructure: Adapt and Predict.
   * Logic to adapt UI/behavior and predict user intent or outcomes.
   */
  private adaptToContext(): void {
    // Example: If many validation failures, suggest a simpler domain or provide more help.
    if (this.state.aiErrorCount > 3 && this.state.submissionAttempts > 5) {
      this.updateState({ currentPrompt: "It seems you're having trouble. Consider using a simpler domain or contact support for assistance." });
    }
    // Dynamic scaling (simulated): If service is unstable, reduce external calls.
    if (this.state.isCircuitBreakerTripped) {
      console.warn("Gemini: Adapting by reducing reliance on external AI services due to circuit breaker.");
    }
  }

  private predictFutureIntent(): void {
    // Example: Based on validation feedback, predict if the user will change the domain.
    if (this.state.aiValidationFeedback && this.state.aiValidationFeedback.includes("high risks")) {
      console.log("Gemini: Predicting user will likely modify or abandon current domain choice.");
    }
    // Further predictive logic can be implemented here, e.g., using a mock LLM.
  }

  public get serviceRegistryInstance(): GeminiServiceRegistry {
    return this.serviceRegistry;
  }
}

// IV. Autonomous Externalization: Simulated Elastic APIs for Dynamic Service Discovery
/**
 * @interface GeminiLLMEmulator
 * @description A basic interface for an LLM-like service.
 *              Acts as a mock for prompt-based reasoning.
 */
interface GeminiLLMEmulator {
  generateResponse(prompt: string): Promise<string>;
  analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'>;
}

class MockLLMEmulator implements GeminiLLMEmulator {
  async generateResponse(prompt: string): Promise<string> {
    console.log(`[LLM Prompt] -> "${prompt}"`);
    // Simple rule-based response for simulation
    if (prompt.includes("commercial viability") && prompt.includes("badword")) {
      return "The domain is not commercially viable due to sensitive terms. High risk for brand image.";
    }
    if (prompt.includes("commercial viability")) {
      return "The domain appears to have standard commercial viability, but could benefit from a unique suffix for brand differentiation.";
    }
    if (prompt.includes("billing impact")) {
      return "Adding a custom domain will incur a standard monthly fee as per your current plan. No unusual charges detected.";
    }
    if (prompt.includes("compliance adherence")) {
      return "The domain string itself is compliant. Ensure associated content and data handling also adhere to regulations.";
    }
    if (prompt.includes("risk level") && prompt.includes("high risks")) {
      return "High risk detected due to potential brand infringement.";
    }
    if (prompt.includes("risk level") && Math.random() < 0.2) { // Simulate occasional medium risk
      return "Medium risk detected, consider common misspellings or related trademark searches.";
    }
    return `AI processed "${prompt}" and generated a thoughtful response.`;
  }
  async analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
    if (text.toLowerCase().includes("fail") || text.toLowerCase().includes("error") || text.toLowerCase().includes("invalid") || text.toLowerCase().includes("high risk")) return 'negative';
    if (text.toLowerCase().includes("success") || text.toLowerCase().includes("valid") || text.toLowerCase().includes("good") || text.toLowerCase().includes("low risk") || text.toLowerCase().includes("compliant")) return 'positive';
    return 'neutral';
  }
}

/**
 * @interface IAIGeminiService
 * @description Base interface for all AI-powered services registered with Gemini.
 *              Includes production-grade patterns like health checks.
 */
interface IAIGeminiService {
  serviceId: string;
  isEnabled: boolean;
  isHealthy: boolean;
  checkHealth(): Promise<void>;
}

/**
 * @class AICustomDomainValidationService
 * @description Simulates an AI-powered service for advanced domain validation,
 *              including brand risk and compliance.
 */
class AICustomDomainValidationService implements IAIGeminiService {
  serviceId: string = "DomainValidationService";
  isEnabled: boolean = true;
  isHealthy: boolean = true;
  private llm: GeminiLLMEmulator = new MockLLMEmulator();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startHealthChecks(); // Self-monitoring
  }

  private startHealthChecks(): void {
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
    this.checkHealth();
    this.healthCheckInterval = setInterval(() => this.checkHealth(), 15000); // Check every 15 seconds
  }

  public async checkHealth(): Promise<void> {
    // Simulate real-time health checks, with occasional failures
    this.isHealthy = Math.random() > 0.1; // 10% chance of being unhealthy
    if (!this.isHealthy) {
      console.warn(`[Gemini Service Health] ${this.serviceId} is currently unhealthy.`);
      // Potentially trigger self-healing or alert.
    }
  }

  public async analyzeDomain(domain: string, prompt: string): Promise<{ isValid: boolean; feedback: string; riskLevel: 'low' | 'medium' | 'high' }> {
    if (!this.isEnabled || !this.isHealthy) {
      return { isValid: false, feedback: "Service is disabled or unhealthy.", riskLevel: 'high' };
    }

    // Simulate AI model processing time and complex logic
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200)); // 200-1000ms delay

    const fullPrompt = `${prompt} Analyze for: commercial viability, brand risk, and compliance.`;
    const llmResponse = await this.llm.generateResponse(fullPrompt);
    const sentiment = await this.llm.analyzeSentiment(llmResponse);

    // AI Decision-making based on LLM output and internal rules
    let isValid = true;
    let feedback = llmResponse;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Strict internal rules, overriding AI if critical
    if (domain.includes("badword") || domain.length > 63) {
      isValid = false;
      feedback = "Domain contains restricted patterns or is too long. " + llmResponse;
      riskLevel = 'high';
    } else if (sentiment === 'negative' || llmResponse.includes("high risk")) {
      isValid = false;
      riskLevel = 'high';
    } else if (sentiment === 'neutral' || llmResponse.includes("medium risk") || llmResponse.includes("could benefit")) {
      riskLevel = 'medium';
    }

    return { isValid, feedback, riskLevel };
  }
}

/**
 * @class AIAuthService
 * @description Simulates an AI-powered authentication service.
 */
class AIAuthService implements IAIGeminiService {
  serviceId: string = "AuthService";
  isEnabled: boolean = true;
  isHealthy: boolean = true;
  private llm: GeminiLLMEmulator = new MockLLMEmulator();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() { this.startHealthChecks(); }
  private startHealthChecks(): void {
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
    this.checkHealth();
    this.healthCheckInterval = setInterval(() => this.checkHealth(), 20000);
  }
  public async checkHealth(): Promise<void> { this.isHealthy = Math.random() > 0.05; }

  public async authenticateUser(token: string, prompt: string): Promise<{ isAuthenticated: boolean; reason: string }> {
    if (!this.isEnabled || !this.isHealthy) return { isAuthenticated: false, reason: "Auth service disabled/unhealthy." };
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100)); // Simulate delay
    const llmResponse = await this.llm.generateResponse(prompt);
    if (token === "user-token-sim") { // Simulate successful auth
      return { isAuthenticated: true, reason: llmResponse };
    }
    return { isAuthenticated: false, reason: `Invalid token. ${llmResponse}` };
  }
}

/**
 * @class AIBillingService
 * @description Simulates an AI-powered billing service.
 */
class AIBillingService implements IAIGeminiService {
  serviceId: string = "BillingService";
  isEnabled: boolean = true;
  isHealthy: boolean = true;
  private llm: GeminiLLMEmulator = new MockLLMEmulator();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() { this.startHealthChecks(); }
  private startHealthChecks(): void {
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
    this.checkHealth();
    this.healthCheckInterval = setInterval(() => this.checkHealth(), 20000);
  }
  public async checkHealth(): Promise<void> { this.isHealthy = Math.random() > 0.05; }

  public async checkBillingStatus(userId: string, prompt: string): Promise<{ canProceed: boolean; reason: string }> {
    if (!this.isEnabled || !this.isHealthy) return { canProceed: false, reason: "Billing service disabled/unhealthy." };
    await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100)); // Simulate delay
    const llmResponse = await this.llm.generateResponse(prompt);
    if (userId === "user-id-sim") { // Simulate positive billing status
      return { canProceed: true, reason: llmResponse };
    }
    return { canProceed: false, reason: `User billing not active. ${llmResponse}` };
  }
}

/**
 * @class AIComplianceService
 * @description Simulates an AI-powered compliance service.
 */
class AIComplianceService implements IAIGeminiService {
  serviceId: string = "ComplianceService";
  isEnabled: boolean = true;
  isHealthy: boolean = true;
  private llm: GeminiLLMEmulator = new MockLLMEmulator();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() { this.startHealthChecks(); }
  private startHealthChecks(): void {
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
    this.checkHealth();
    this.healthCheckInterval = setInterval(() => this.checkHealth(), 25000);
  }
  public async checkHealth(): Promise<void> { this.isHealthy = Math.random() > 0.05; }

  public async checkCompliance(data: string, prompt: string): Promise<{ isCompliant: boolean; reason: string }> {
    if (!this.isEnabled || !this.isHealthy) return { isCompliant: false, reason: "Compliance service disabled/unhealthy." };
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100)); // Simulate delay
    const llmResponse = await this.llm.generateResponse(prompt);
    if (data.includes("gdpr") || data.includes("ccpa")) { // Simulate a simple check
      return { isCompliant: true, reason: `Domain complies with general data regulations. ${llmResponse}` };
    }
    return { isCompliant: true, reason: `No immediate compliance flags. ${llmResponse}` }; // Default to true for simplicity
  }
}

/**
 * @class AITelemetryService
 * @description Simulates an AI-powered telemetry and observability service.
 */
class AITelemetryService implements IAIGeminiService {
  serviceId: string = "TelemetryService";
  isEnabled: boolean = true;
  isHealthy: boolean = true;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() { this.startHealthChecks(); }
  private startHealthChecks(): void {
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
    this.checkHealth();
    this.healthCheckInterval = setInterval(() => this.checkHealth(), 30000);
  }
  public async checkHealth(): Promise<void> { this.isHealthy = Math.random() > 0.02; }

  public async logEvent(eventType: string, payload: Record<string, any>): Promise<void> {
    if (!this.isEnabled || !this.isHealthy) {
      console.warn(`Telemetry Service is disabled or unhealthy. Event ${eventType} not logged.`);
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async logging
    console.log(`[AI Telemetry - ${eventType}]`, JSON.stringify(payload));
  }
}

/**
 * @class AIEventBroker
 * @description Simulates an AI-powered event broker for inter-service communication.
 */
class AIEventBroker implements IAIGeminiService {
  serviceId: string = "EventBroker";
  isEnabled: boolean = true;
  isHealthy: boolean = true;
  private subscribers: Map<string, Function[]> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() { this.startHealthChecks(); }
  private startHealthChecks(): void {
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
    this.checkHealth();
    this.healthCheckInterval = setInterval(() => this.checkHealth(), 25000);
  }
  public async checkHealth(): Promise<void> { this.isHealthy = Math.random() > 0.03; }

  public subscribe(eventType: string, callback: Function): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)?.push(callback);
    console.log(`Event Broker: Subscribed to ${eventType}`);
  }

  public async publish(eventType: string, payload: Record<string, any>): Promise<void> {
    if (!this.isEnabled || !this.isHealthy) {
      console.warn(`Event Broker is disabled or unhealthy. Event ${eventType} not published.`);
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async publishing
    console.log(`[AI Event Broker - Published ${eventType}]`, JSON.stringify(payload));
    const handlers = this.subscribers.get(eventType) || [];
    handlers.forEach(handler => handler(payload));
  }
}


/**
 * @class GeminiServiceRegistry
 * @description Central registry for all AI-powered "external" services.
 *              Acts as a dynamic service discovery mechanism, ensuring only
 *              healthy and enabled services are returned.
 */
export class GeminiServiceRegistry {
  private services: Map<string, IAIGeminiService> = new Map();

  constructor() {
    this.registerService(new AICustomDomainValidationService());
    this.registerService(new AIAuthService());
    this.registerService(new AIBillingService());
    this.registerService(new AIComplianceService());
    this.registerService(new AITelemetryService());
    this.registerService(new AIEventBroker());
    console.log("GeminiServiceRegistry initialized with core AI services.");
  }

  public registerService(service: IAIGeminiService): void {
    if (this.services.has(service.serviceId)) {
      console.warn(`GeminiServiceRegistry: Service with ID ${service.serviceId} already registered. Overwriting.`);
    }
    this.services.set(service.serviceId, service);
  }

  public getService<T extends IAIGeminiService>(serviceId: string): T | undefined {
    const service = this.services.get(serviceId);
    if (!service) {
      console.warn(`GeminiServiceRegistry: Requested service "${serviceId}" not found.`);
      return undefined;
    }
    // Return service even if unhealthy or disabled, caller needs to handle this.
    // The GeminiBrain logic explicitly checks for service health.
    return service as T;
  }

  public listHealthyServices(): string[] {
    return Array.from(this.services.values())
      .filter(s => s.isEnabled && s.isHealthy)
      .map(s => s.serviceId);
  }

  public listAllServicesStatus(): { id: string; isEnabled: boolean; isHealthy: boolean }[] {
    return Array.from(this.services.values())
      .map(s => ({ id: s.serviceId, isEnabled: s.isEnabled, isHealthy: s.isHealthy }));
  }
}

// Instantiate the core AI intelligence for the file
export const geminiDomainBrain = GeminiDomainIntelligenceCore.getInstance();

// --- End Gemini AI-Powered Core System Integration ---


// --- Enhanced DomainCardForm Logic ---

interface DomainCardFormProps {
  onSubmitFunc: (
    fieldName: string,
    actions: FormikHelpers<{
      customEmailDomainInput: string;
    }>,
  ) => void;
  onClickFunc: () => void;
}

// Original VALIDATION schema, now serving for basic format checks only.
// The advanced AI-powered validation is handled asynchronously during submission.
const VALIDATION = Yup.object().shape({
  customEmailDomainInput: Yup.string()
    .matches(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
      "Invalid Domain Format (e.g., example.com)",
    )
    .required("A domain is required"),
});


function DomainCardForm({ onSubmitFunc, onClickFunc }: DomainCardFormProps) {
  const [geminiState, setGeminiState] = React.useState(geminiDomainBrain.getState());

  // Subscribe to brain state changes for adaptive UI
  React.useEffect(() => {
    geminiDomainBrain.addObserver(setGeminiState);
    // Initial fetch to ensure the latest state is captured on mount
    setGeminiState(geminiDomainBrain.getState());

    // Clean up observer on unmount
    return () => {
      geminiDomainBrain.removeObserver(setGeminiState);
    };
  }, []);


  const handleGeminiSubmit = async (
    customEmailDomainInput: string,
    actions: FormikHelpers<{ customEmailDomainInput: string }>,
  ) => {
    actions.setSubmitting(true);
    geminiDomainBrain.updateState({ telemetryData: { ...geminiState.telemetryData, form_submit_init: Date.now(), domain: customEmailDomainInput } });

    try {
      // Step 1: Perform AI-driven deep validation
      // This includes commercial viability, brand risk, and compliance assessment
      const aiValidation = await geminiDomainBrain.performAIVerification(customEmailDomainInput);
      if (!aiValidation.isValid) {
        actions.setFieldError("customEmailDomainInput", aiValidation.feedback);
        geminiDomainBrain.updateState({ telemetryData: { ...geminiState.telemetryData, ai_validation_fail: Date.now() } });
        actions.setSubmitting(false);
        return;
      }

      // Step 2: Conduct Commercial-Grade Pre-Submission Checks (Auth, Billing, Compliance)
      const preSubmissionResult = await geminiDomainBrain.conductPreSubmissionChecks(customEmailDomainInput);
      if (!preSubmissionResult.success) {
        actions.setFieldError("customEmailDomainInput", preSubmissionResult.message);
        geminiDomainBrain.updateState({ telemetryData: { ...geminiState.telemetryData, pre_submission_fail: Date.now(), reason: preSubmissionResult.message } });
        actions.setSubmitting(false);
        return;
      }

      // If all AI and commercial checks pass, proceed with the original submission logic
      geminiDomainBrain.updateState({ telemetryData: { ...geminiState.telemetryData, final_submission_trigger: Date.now() }, currentPrompt: "Domain successfully processed by Gemini. Sending to core system." });
      onSubmitFunc(customEmailDomainInput, actions);

      // Post-submission AI telemetry and event broadcasting
      const aiTelemetryService = geminiDomainBrain.serviceRegistryInstance.getService<AITelemetryService>("TelemetryService");
      const aiEventBroker = geminiDomainBrain.serviceRegistryInstance.getService<AIEventBroker>("EventBroker");
      aiTelemetryService?.logEvent("DomainSubmissionSuccess", { domain: customEmailDomainInput, userId: "simulated-user-id", risk: geminiState.predictedRiskLevel, timestamp: Date.now() });
      aiEventBroker?.publish("DOMAIN_ADDED_EVENT", { domain: customEmailDomainInput, status: "pending_activation", byAI: true, risk: geminiState.predictedRiskLevel });

    } catch (error: any) {
      console.error("Gemini-powered submission failed:", error);
      actions.setFieldError("customEmailDomainInput", `An AI-powered system error occurred: ${error.message || "Unknown error."}`);
      geminiDomainBrain.updateState({ telemetryData: { ...geminiState.telemetryData, submission_error: Date.now(), error: error.message }, currentPrompt: "A critical error occurred during submission. Please check system logs." });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleGeminiCancel = () => {
    geminiDomainBrain.updateState({ telemetryData: { ...geminiState.telemetryData, form_cancel: Date.now() }, currentPrompt: "Operation cancelled by user. Ready for new input." });
    onClickFunc();
  };


  return (
    <ExpandableCard
      heading="Add a Custom Domain (AI-Enhanced)"
      className="mb-4 w-1/2"
      // Adaptive UI: Dynamic heading color based on AI risk prediction
      headerClassName={geminiState.predictedRiskLevel === 'high' ? 'bg-red-100 text-red-700' : geminiState.predictedRiskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
    >
      <div className="flex flex-col">
        <Formik
          initialValues={{ customEmailDomainInput: "" }}
          onSubmit={handleGeminiSubmit}
          validationSchema={VALIDATION}
        >
          {({ isSubmitting, errors, values }) => (
            <div>
              <Form>
                <FieldGroup>
                  <Label className="mb-4 text-sm text-gray-600">
                    <span className="font-semibold text-blue-800">Gemini Insight:</span> {geminiState.currentPrompt}
                  </Label>
                  <Label className="mb-8">
                    Duplicate or other invalid domains will be rejected by our AI defense layers, ensuring commercial compliance.
                  </Label>
                  <Label htmlFor="customEmailDomainInput">Enter your Domain</Label>
                  <Field
                    id="customEmailDomainInput"
                    name="customEmailDomainInput"
                    component={FormikInputField}
                    // Adaptive UI: Hint text changes based on last validation feedback
                    placeholder={geminiState.aiValidationFeedback && !errors.customEmailDomainInput && geminiState.lastAIValidationPassed !== false ? `AI suggests: ${geminiState.aiValidationFeedback.split('.')[0]}` : "e.g., yourcompany.com"}
                  />
                  <FormikErrorMessage name="customEmailDomainInput" />

                  {/* AI-powered feedback panel */}
                  {geminiState.aiValidationFeedback && (
                    <div className={`mt-2 p-2 text-sm rounded ${geminiState.lastAIValidationPassed ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      <span className="font-semibold">Gemini AI Feedback:</span> {geminiState.aiValidationFeedback}
                      {geminiState.predictedRiskLevel && ` (Risk: ${geminiState.predictedRiskLevel.toUpperCase()})`}
                      {geminiState.isCircuitBreakerTripped && <span className="text-red-500 font-bold ml-2"> (Circuit Breaker Active!)</span>}
                    </div>
                  )}

                  {geminiState.isCircuitBreakerTripped && (
                     <div className="mt-2 p-2 text-sm bg-orange-100 text-orange-700 rounded border border-orange-200">
                       <span className="font-semibold">System Alert:</span> External AI services are in a degraded state. Submissions may be affected.
                     </div>
                  )}

                </FieldGroup>
                <div className="mb-4 mt-4 flex flex-row justify-end gap-x-2">
                  <Button
                    buttonHeight="small"
                    onClick={handleGeminiCancel}
                  >
                    <span>Cancel</span>
                  </Button>
                  <Button
                    buttonHeight="small"
                    isSubmit
                    disabled={isSubmitting || geminiState.isCircuitBreakerTripped}
                    buttonType="primary"
                  >
                    <span>
                      {isSubmitting ? "Processing with AI..." : "Submit"}
                    </span>
                  </Button>
                  <ClipLoader loading={isSubmitting} />
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <p>AI State: Last Validated: {geminiState.lastValidatedDomain || 'N/A'}, AI Errors: {geminiState.aiErrorCount}, Attempts: {geminiState.submissionAttempts}</p>
                  <p className="flex items-center gap-x-1">
                    Healthy Services: {geminiDomainBrain.serviceRegistryInstance.listHealthyServices().length > 0 ? (
                      geminiDomainBrain.serviceRegistryInstance.listHealthyServices().map((s, idx) => (
                        <span key={s} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          None
                        </span>
                    )}
                  </p>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </ExpandableCard>
  );
}

export default DomainCardForm;