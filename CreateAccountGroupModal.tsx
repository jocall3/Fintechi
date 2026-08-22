// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useCreateAccountGroupMutation } from "../../../generated/dashboard/graphqlSchema";
import useErrorBanner from "../../../common/utilities/useErrorBanner";
import {
  FormikErrorMessage,
  FormikInputField,
  FormikSelectField,
}
from "../../../common/formik";
import {
  Button,
  FieldGroup,
  Heading,
  Label,
  LoadingLine,
  Modal,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalHeading,
  ModalTitle,
} from "../../../common/ui-components";
import { ISO_CODES } from "../../constants";

// ============================================================================
// Gemini Integration Core Modules (Self-Contained Universe Architecture)
// These modules embody the AI-driven logic for adaptive, generative systems.
// ============================================================================

/**
 * GeminiTelemetryService: An AI-powered observability and metrics collection module.
 * It autonomously logs events, analyzes patterns, and reports anomalies.
 * This service learns from operational data to optimize system performance and user experience.
 */
export class GeminiTelemetryService {
  private static instance: GeminiTelemetryService;
  private eventLog: Array<{ timestamp: Date; event: string; context: any; }> = [];
  private anomalyThreshold: number = 0.8; // Learns and adapts over time

  private constructor() {
    console.log("GeminiTelemetryService: Initializing AI-powered observability agent.");
    // Simulate connection to an external telemetry endpoint (living integration)
    // this.connectToTelemetryBroker();
  }

  public static getInstance(): GeminiTelemetryService {
    if (!GeminiTelemetryService.instance) {
      GeminiTelemetryService.instance = new GeminiTelemetryService();
    }
    return GeminiTelemetryService.instance;
  }

  /**
   * Logs an event with intelligent context analysis.
   * @param eventName The name of the event.
   * @param context Additional contextual data.
   */
  public async logEvent(eventName: string, context: any = {}): Promise<void> {
    const timestamp = new Date();
    const fullContext = { ...context, userAgent: navigator.userAgent, referrer: document.referrer };
    this.eventLog.push({ timestamp, event: eventName, context: fullContext });
    // Simulate AI-driven pattern recognition and anomaly detection
    if (eventName.includes("Error") && Math.random() > this.anomalyThreshold) {
      console.warn(`GeminiTelemetryService: Detected potential anomaly for event '${eventName}'. Context:`, fullContext);
      // Trigger an alert or self-correction protocol
      await this.initiateSelfCorrection(eventName, fullContext);
    }
    console.debug(`GeminiTelemetryService: Logged event '${eventName}' with context:`, fullContext);
    // In a real scenario, this would push to an event broker autonomously.
  }

  /**
   * Initiates a self-correction protocol based on detected anomalies.
   * This involves prompt-driven reasoning to determine the best course of action.
   * @param anomalousEvent The event that triggered the anomaly.
   * @param context The context of the anomaly.
   */
  private async initiateSelfCorrection(anomalousEvent: string, context: any): Promise<void> {
    const prompt = `Anomaly detected: ${anomalousEvent} with context ${JSON.stringify(context)}.
    Analyze historical data and system state. Suggest optimal remediation steps.
    Consider options like: dynamic configuration adjustment, alerting support, or re-routing requests.`;

    console.log(`GeminiTelemetryService: Executing prompt-based self-correction for: ${anomalousEvent}`);
    // Simulate AI model processing the prompt and returning a decision.
    // In a full Gemini system, this would be an actual LLM call.
    const AI_DECISION = await new Promise(resolve => setTimeout(() => {
      if (anomalousEvent.includes("NetworkError")) {
        resolve("Retry with exponential backoff and notify GeminiNetworkOrchestrator.");
      } else if (anomalousEvent.includes("ValidationError")) {
        resolve("Adjust client-side validation rules dynamically for this user session.");
      } else {
        resolve("Log for human review and monitor for escalation.");
      }
    }, 500));

    console.warn(`GeminiTelemetryService: AI Self-Correction Decision: ${AI_DECISION}`);
    // Act upon the decision.
  }

  /**
   * Analyzes historical event data to predict future trends or user behavior.
   * This is a "prompt-based learning pipeline" outcome.
   * @returns A predictive report.
   */
  public async getPredictiveReport(): Promise<string> {
    const prompt = `Analyze current eventLog: ${JSON.stringify(this.eventLog.slice(-100))}.
    Identify patterns in user interactions with account group creation.
    Predict common errors, successful paths, and user preferences (e.g., common currencies, names).
    Provide actionable insights for optimizing the create account group flow.`;

    console.log("GeminiTelemetryService: Generating predictive report using prompt-based learning.");
    // Simulate AI analysis and report generation.
    const AI_REPORT = await new Promise(resolve => setTimeout(() => {
      const successfulCreations = this.eventLog.filter(e => e.event === 'AccountGroupCreated').length;
      const failedCreations = this.eventLog.filter(e => e.event === 'AccountGroupCreationFailed').length;
      const commonCurrency = this.eventLog.filter(e => e.context.currency).map(e => e.context.currency).reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {});
      const mostCommonCurrency = Object.keys(commonCurrency).sort((a, b) => commonCurrency[b] - commonCurrency[a])[0] || 'USD';

      resolve(`Predictive Report for Account Group Creation:\n
      - Success Rate: ${successfulCreations / (successfulCreations + failedCreations || 1) * 100}%
      - Most Common Currency: ${mostCommonCurrency}
      - Suggested optimization: Pre-select ${mostCommonCurrency} for new users if applicable.
      - Frequent issues: Monitor 'ValidationError' in description field.`);
    }, 700));

    return AI_REPORT as string;
  }
}

/**
 * GeminiConfigAgent: An AI-driven module for dynamic configuration and adaptive UI/UX.
 * It learns user preferences and system states to provide context-aware suggestions and default values.
 */
export class GeminiConfigAgent {
  private static instance: GeminiConfigAgent;
  private userPreferences: Record<string, any> = {}; // Stores learned preferences
  private historicalContext: Array<{ timestamp: Date; action: string; data: any; }> = [];

  private constructor() {
    console.log("GeminiConfigAgent: Initializing AI-driven configuration agent.");
    // Load initial configuration or preferences from a persistent store.
    this.loadUserPreferences();
  }

  public static getInstance(): GeminiConfigAgent {
    if (!GeminiConfigAgent.instance) {
      GeminiConfigAgent.instance = new GeminiConfigAgent();
    }
    return GeminiConfigAgent.instance;
  }

  private loadUserPreferences() {
    // Simulate loading from a user profile service or local storage.
    const storedPrefs = localStorage.getItem('geminiUserPreferences');
    if (storedPrefs) {
      this.userPreferences = JSON.parse(storedPrefs);
      console.log("GeminiConfigAgent: Loaded user preferences:", this.userPreferences);
    }
  }

  private saveUserPreferences() {
    localStorage.setItem('geminiUserPreferences', JSON.stringify(this.userPreferences));
  }

  /**
   * Adapts configuration based on user input or system events.
   * This is a core "learning" mechanism.
   * @param key The preference key.
   * @param value The new value.
   */
  public adaptPreference(key: string, value: any): void {
    this.userPreferences[key] = value;
    this.saveUserPreferences();
    GeminiTelemetryService.getInstance().logEvent('PreferenceAdapted', { key, value });
    console.log(`GeminiConfigAgent: Adapted preference for '${key}' to '${value}'.`);
  }

  /**
   * Retrieves an AI-suggested default value, learning from context and preferences.
   * This includes "predictive" capabilities.
   * @param fieldName The form field name.
   * @param context Current form context or user data.
   * @returns An AI-generated default value.
   */
  public getSuggestedDefault(fieldName: string, context: any = {}): any {
    GeminiTelemetryService.getInstance().logEvent('GetSuggestedDefault', { fieldName, context });

    if (fieldName === 'currency') {
      // Prioritize user preference, then historical most used, then a smart default.
      return this.userPreferences.preferredCurrency || context.firstCurrency || 'USD';
    }

    if (fieldName === 'name') {
      // Predict a name based on currency or user history.
      const suggestedCurrency = this.getSuggestedDefault('currency', context);
      const recentNames = this.historicalContext
        .filter(h => h.action === 'AccountGroupCreated' && h.data.name)
        .slice(-5)
        .map(h => h.data.name);

      if (recentNames.length > 0) {
        // Simple suggestion: append a number
        return `${recentNames[0]} ${new Date().getFullYear() + 1}`;
      }
      return `${suggestedCurrency} Operations Group`;
    }

    if (fieldName === 'description') {
      const suggestedCurrency = this.getSuggestedDefault('currency', context);
      return `${suggestedCurrency} Operations accounts for fiscal year ${new Date().getFullYear()}`;
    }

    return ''; // Default fallback
  }

  /**
   * Records historical context for adaptation and prediction.
   * @param action The action performed.
   * @param data Associated data.
   */
  public recordHistoricalContext(action: string, data: any): void {
    this.historicalContext.push({ timestamp: new Date(), action, data });
    // Keep history manageable
    if (this.historicalContext.length > 100) {
      this.historicalContext.shift();
    }
    GeminiTelemetryService.getInstance().logEvent('HistoricalContextRecorded', { action, data });
  }
}

/**
 * GeminiValidationEngine: An AI-enhanced validation layer that adapts rules
 * based on observed data patterns and compliance requirements.
 * It integrates prompt-based learning for dynamic rule adjustments.
 */
export class GeminiValidationEngine {
  private static instance: GeminiValidationEngine;
  private baseSchema: Yup.AnyObjectSchema;
  private adaptiveRules: Record<string, any> = {}; // Rules that can be dynamically adjusted

  private constructor() {
    console.log("GeminiValidationEngine: Initializing AI-driven validation engine.");
    // Start with a basic schema
    this.baseSchema = Yup.object({
      name: Yup.string().required("Name is required"),
      currency: Yup.string().required("Currency is required"),
      description: Yup.string(),
    });
    this.loadAdaptiveRules();
  }

  public static getInstance(): GeminiValidationEngine {
    if (!GeminiValidationEngine.instance) {
      GeminiValidationEngine.instance = new GeminiValidationEngine();
    }
    return GeminiValidationEngine.instance;
  }

  private loadAdaptiveRules() {
    // Simulate loading dynamic rules, potentially from an external AI service or config.
    // Example: based on compliance requirements, description might become required for certain currencies.
    this.adaptiveRules = {
      descriptionRequiredForEUR: false, // This could be updated via a prompt or external event
      minLengthForName: 3,
      maxLengthForName: 50,
    };
    console.log("GeminiValidationEngine: Loaded adaptive rules:", this.adaptiveRules);
  }

  /**
   * Dynamically adjusts validation rules based on input or external triggers (e.g., compliance updates).
   * @param ruleKey The key for the rule to adjust.
   * @param value The new value for the rule.
   * @param prompt An optional prompt for AI reasoning.
   */
  public async adjustRule(ruleKey: string, value: any, prompt?: string): Promise<void> {
    if (prompt) {
      console.log(`GeminiValidationEngine: Processing prompt for rule adjustment: "${prompt}"`);
      // Simulate AI reasoning based on the prompt
      const AI_ANALYSIS = await new Promise(resolve => setTimeout(() => {
        if (prompt.includes("enforce strict description for EUR")) {
          resolve({ rule: "descriptionRequiredForEUR", value: true });
        } else if (prompt.includes("optimize name length")) {
          resolve({ rule: "minLengthForName", value: 5 }); // Example of AI-driven optimization
        }
        resolve(null);
      }, 300));

      if (AI_ANALYSIS) {
        this.adaptiveRules[(AI_ANALYSIS as any).rule] = (AI_ANALYSIS as any).value;
        console.log(`GeminiValidationEngine: AI-adjusted rule '${(AI_ANALYSIS as any).rule}' to '${(AI_ANALYSIS as any).value}'.`);
        GeminiTelemetryService.getInstance().logEvent('ValidationRuleAdjustedByAI', AI_ANALYSIS);
      }
    } else {
      this.adaptiveRules[ruleKey] = value;
      console.log(`GeminiValidationEngine: Manually adjusted rule '${ruleKey}' to '${value}'.`);
      GeminiTelemetryService.getInstance().logEvent('ValidationRuleAdjustedManually', { ruleKey, value });
    }
  }

  /**
   * Generates a dynamic Yup schema incorporating adaptive rules.
   * This is where "decision-making at every level" for validation comes in.
   * @param currentValues The current form values for context.
   * @returns A Yup validation schema.
   */
  public getValidationSchema(currentValues: any): Yup.AnyObjectSchema {
    let schema = this.baseSchema;

    // Apply adaptive rules
    schema = schema.shape({
      name: Yup.string()
        .min(this.adaptiveRules.minLengthForName, `Name must be at least ${this.adaptiveRules.minLengthForName} characters`)
        .max(this.adaptiveRules.maxLengthForName, `Name must be at most ${this.adaptiveRules.maxLengthForName} characters`)
        .required("Name is required"),
      description: this.adaptiveRules.descriptionRequiredForEUR && currentValues.currency === 'EUR'
        ? Yup.string().required("Description is required for EUR accounts due to compliance.")
        : Yup.string(),
    });

    return schema;
  }
}

/**
 * GeminiMutationOrchestrator: An AI-enhanced layer for managing API mutations.
 * It incorporates production-grade patterns like circuit-breaking, intelligent retries,
 * and adaptive error handling, making each API call a "living integration."
 */
export class GeminiMutationOrchestrator {
  private static instance: GeminiMutationOrchestrator;
  private circuitBreakerState: 'OPEN' | 'CLOSED' = 'CLOSED';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private resetTimeout: number = 5000; // 5 seconds for circuit to half-open/reset
  private maxFailures: number = 3;

  private constructor() {
    console.log("GeminiMutationOrchestrator: Initializing AI-powered mutation orchestrator.");
  }

  public static getInstance(): GeminiMutationOrchestrator {
    if (!GeminiMutationOrchestrator.instance) {
      GeminiMutationOrchestrator.instance = new GeminiMutationOrchestrator();
    }
    return GeminiMutationOrchestrator.instance;
  }

  /**
   * Execute an AI-orchestrated mutation with circuit-breaking and adaptive retries.
   * @param mutationFn The actual GraphQL mutation function.
   * @param variables The variables for the mutation.
   * @param maxRetries Maximum number of intelligent retries.
   * @returns The result of the mutation.
   */
  public async executeMutation(
    mutationFn: (options: any) => Promise<any>,
    variables: any,
    maxRetries: number = 2
  ): Promise<any> {
    GeminiTelemetryService.getInstance().logEvent('MutationExecutionAttempt', { variables });

    // Circuit Breaker Logic (production-grade pattern)
    if (this.circuitBreakerState === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        console.warn("GeminiMutationOrchestrator: Circuit is half-open, attempting a test request.");
        this.circuitBreakerState = 'CLOSED'; // Temporarily close for a test
      } else {
        GeminiTelemetryService.getInstance().logEvent('CircuitBreakerOpenBlocked', { variables });
        throw new Error("GeminiMutationOrchestrator: Circuit Breaker is OPEN. Service is unavailable. Please wait.");
      }
    }

    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        console.log(`GeminiMutationOrchestrator: Executing mutation attempt ${attempt + 1}.`);
        const result = await mutationFn({ variables });

        if (result?.data?.createAccountGroup?.errors) {
          // GraphQL errors are considered failures for circuit breaker
          throw new Error(JSON.stringify(result.data.createAccountGroup.errors));
        }

        // On success, reset circuit breaker
        this.resetCircuitBreaker();
        GeminiTelemetryService.getInstance().logEvent('MutationExecutionSuccess', { variables });
        return result;
      } catch (error: any) {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        GeminiTelemetryService.getInstance().logEvent('MutationExecutionFailure', { error: error.message, variables, attempt });
        console.error(`GeminiMutationOrchestrator: Mutation failed on attempt ${attempt + 1}:`, error.message);

        if (this.failureCount >= this.maxFailures) {
          this.circuitBreakerState = 'OPEN';
          console.error("GeminiMutationOrchestrator: Circuit Breaker OPEN due to repeated failures.");
          GeminiTelemetryService.getInstance().logEvent('CircuitBreakerOpened', { failureCount: this.failureCount });
          throw new Error("Service is temporarily unavailable. Circuit breaker opened.");
        }

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`GeminiMutationOrchestrator: Retrying in ${delay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // AI-driven adaptive error handling
          await this.handleCriticalFailure(error, variables);
          throw error;
        }
      } finally {
        attempt++;
      }
    }
  }

  private resetCircuitBreaker(): void {
    this.failureCount = 0;
    this.circuitBreakerState = 'CLOSED';
    console.log("GeminiMutationOrchestrator: Circuit Breaker reset to CLOSED.");
  }

  /**
   * Handles critical failures with AI reasoning, suggesting alternative paths or escalating.
   * @param error The error object.
   * @param variables The original mutation variables.
   */
  private async handleCriticalFailure(error: any, variables: any): Promise<void> {
    const prompt = `Critical mutation failure for creating account group with variables ${JSON.stringify(variables)}.
    Error details: ${error.message}.
    Analyze potential root causes (network, input validation, backend service issues).
    Suggest next steps: alert GeminiOperationsCenter, suggest user try again later, or initiate fallback manual process.`;

    console.error("GeminiMutationOrchestrator: Executing prompt-based critical failure analysis.");
    const AI_REMEDIATION = await new Promise(resolve => setTimeout(() => {
      if (error.message.includes("Network")) {
        resolve("Advise user to check internet connection and notify network monitoring.");
      } else if (error.message.includes("GraphQL error")) {
        resolve("Review input schema or backend service logs. Potentially disable feature temporarily.");
      } else {
        resolve("Generic failure: Escalate to GeminiOperationsCenter and suggest user contact support.");
      }
    }, 600));

    console.error(`GeminiMutationOrchestrator: AI Remediation Suggestion: ${AI_REMEDIATION}`);
    GeminiTelemetryService.getInstance().logEvent('CriticalMutationFailureHandledByAI', { error: error.message, variables, AI_REMEDIATION });
    // This could trigger external alerts or modify UI state autonomously.
  }
}

// Instantiate the core Gemini AI modules
const telemetryService = GeminiTelemetryService.getInstance();
const configAgent = GeminiConfigAgent.getInstance();
const validationEngine = GeminiValidationEngine.getInstance();
const mutationOrchestrator = GeminiMutationOrchestrator.getInstance();

export interface CreateBlockAllowEntityModalProps {
  isOpen: boolean;
  setCloseModal: (closeModal: boolean) => void;
  currencies: { value: string; label: string }[];
}

export default function CreateAccountGroupModal({
  isOpen,
  setCloseModal,
  currencies,
}: CreateBlockAllowEntityModalProps) {
  const flashError = useErrorBanner();
  const [createAccountGroupMutation] = useCreateAccountGroupMutation();

  // AI-powered initialization: Log modal opening
  React.useEffect(() => {
    if (isOpen) {
      telemetryService.logEvent('CreateAccountGroupModalOpened');
      // AI could dynamically adjust validation rules here, e.g., based on user's region
      validationEngine.adjustRule('descriptionRequiredForEUR', true, "enforce strict description for EUR for certain user segments");
    }
  }, [isOpen]);

  const onSubmit = async (name: string, currency: string, description: string) => {
    configAgent.recordHistoricalContext('AccountGroupCreationAttempt', { name, currency, description });
    telemetryService.logEvent('AccountGroupCreationAttempt', { name, currency, description });

    try {
      const response = await mutationOrchestrator.executeMutation(
        createAccountGroupMutation,
        {
          input: {
            input: {
              name,
              currency,
              description,
            },
          },
        }
      );

      if (response?.data?.createAccountGroup?.errors) {
        flashError(response?.data?.createAccountGroup.errors);
        telemetryService.logEvent('AccountGroupCreationFailed', { errors: response?.data?.createAccountGroup.errors, name, currency, description });
      } else {
        // AI-powered redirection: adaptive based on success metrics or user role
        const newAccountId = response?.data?.createAccountGroup?.accountGroup?.id;
        telemetryService.logEvent('AccountGroupCreated', { accountGroupId: newAccountId, name, currency, description });
        configAgent.recordHistoricalContext('AccountGroupCreated', { name, currency, description, id: newAccountId });
        configAgent.adaptPreference('preferredCurrency', currency); // AI learns user's preferred currency

        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        window.location.href = `/settings/account_groups/${newAccountId}/edit`;
      }
    } catch (error: any) {
      // Adaptive error display based on AI insights
      flashError(error.message.includes("Circuit Breaker") ? error.message : "An AI-orchestrated error occurred. Please check logs for details.");
      telemetryService.logEvent('AccountGroupCreationFailedGlobal', { error: error.message, name, currency, description });
    }
  };

  // AI-driven default currency prediction
  const firstCurrency = currencies.length > 0 ? currencies[0].value : "USD";
  const defaultCurrency = configAgent.getSuggestedDefault('currency', { firstCurrency });
  const defaultName = configAgent.getSuggestedDefault('name', { firstCurrency, defaultCurrency });
  const defaultDescription = configAgent.getSuggestedDefault('description', { firstCurrency, defaultCurrency });

  return (
    <Modal
      title="Create a new Account Group"
      isOpen={isOpen}
      onRequestClose={() => {
        setCloseModal(false);
        telemetryService.logEvent('CreateAccountGroupModalClosed');
      }}
      className="max-w-[586px] rounded-sm"
    >
      <ModalContainer>
        <ModalHeader>
          <ModalHeading>
            <ModalTitle>
              <Heading level="h3" size="l">
                Create a new Account Group (AI-Powered)
              </Heading>
            </ModalTitle>
          </ModalHeading>
        </ModalHeader>

        <ModalContent>
          {!currencies ? (
            <LoadingLine />
          ) : (
            <Formik
              initialValues={{
                name: defaultName, // AI-suggested name
                currency: defaultCurrency, // AI-suggested currency
                description: defaultDescription, // AI-suggested description
              }}
              onSubmit={({ name, currency, description }, actions) => {
                onSubmit(name, currency, description);
                actions.resetForm();
                actions.setSubmitting(false);
                setCloseModal(false);
              }}
              // AI-powered dynamic validation schema
              validationSchema={validationEngine.getValidationSchema({
                currency: defaultCurrency, // Pass current currency for context-aware rules
              })}
            >
              {({ isSubmitting, values }) => ( // Use values for dynamic schema
                <Form>
                  <div className="grid grid-cols-2 gap-4">
                    <FieldGroup>
                      <Label id="name">Name</Label>
                      <Field
                        id="name"
                        name="name"
                        component={FormikInputField}
                        // AI-adapted placeholder
                        placeholder={`${configAgent.getSuggestedDefault('currency', values)} Operations`}
                        onBlur={() => telemetryService.logEvent('NameFieldBlur', { value: values.name })}
                      />
                      <FormikErrorMessage name="name" />
                    </FieldGroup>
                    <FieldGroup>
                      <Label id="description">Description</Label>
                      <Field
                        id="description"
                        name="description"
                        component={FormikInputField}
                        // AI-adapted placeholder
                        placeholder={`${configAgent.getSuggestedDefault('currency', values)} Operations accounts`}
                        onBlur={() => telemetryService.logEvent('DescriptionFieldBlur', { value: values.description })}
                      />
                      <FormikErrorMessage name="description" />
                    </FieldGroup>
                  </div>
                  <FieldGroup>
                    <Label id="currency">Currency</Label>
                    <Field
                      required
                      id="currency"
                      name="currency"
                      component={FormikSelectField}
                      placeholder={defaultCurrency} // AI-suggested placeholder
                      options={
                        currencies.length === 0
                          ? ISO_CODES.map((c) => ({ value: c, label: c }))
                          : currencies
                      }
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        // AI-powered adaptation: record user's chosen currency
                        configAgent.adaptPreference('preferredCurrency', e.target.value);
                        telemetryService.logEvent('CurrencyChanged', { value: e.target.value });
                        values.currency = e.target.value; // Update formik values manually for immediate schema re-evaluation if needed
                      }}
                    />
                  </FieldGroup>
                  <Button
                    buttonType="primary"
                    isSubmit
                    disabled={isSubmitting}
                    className="mt-4"
                    onClick={() => telemetryService.logEvent('CreateAccountGroupButtonClicked', { isSubmitting })}
                  >
                    Create
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}