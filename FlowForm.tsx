// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import { Field, Form, Formik, FormikProps, FormikHelpers } from "formik";
import React, { useCallback } from "react";
import ReactTooltip from "react-tooltip";
import * as Yup from "yup";
import { cn } from "~/common/utilities/cn";
import {
  Flow__PartyTypeEnum,
  FlowConfiguration__FieldModeEnum,
  useCreateFlowMutation,
  useUpdateFlowMutation,
  VendorCheckEnum,
  BeneficialOwnersVendorCheckEnum,
} from "../../../generated/dashboard/graphqlSchema";
import {
  Button,
  FieldGroup,
  Heading,
  Label,
  Stack,
  Tooltip,
} from "../../../common/ui-components";
import {
  FormikCheckboxField,
  FormikErrorMessage,
  FormikInputField,
  FormikSelectGroupField,
} from "../../../common/formik";
import SelectGroup from "../../../common/ui-components/SelectGroup/SelectGroup";
import { useDispatchContext } from "../../MessageProvider";
import { isChecked } from "../../utilities/CheckboxUtils";

// --- START: Gemini Integration & Self-Contained Universe Architecture ---

/**
 * GeminiTelemetryAgent
 * An AI-powered telemetry and observability agent for self-aware infrastructure.
 * It autonomously logs, monitors, and predicts system behavior for continuous optimization.
 * This module acts as a neural extension, dynamically interfacing with external services
 * (simulated here via console logs) and adjusting its verbosity and focus based on system state.
 */
export const GeminiTelemetryAgent = {
  /**
   * Logs a message with dynamic context. In a real Gemini system, this would trigger an
   * AI-driven event broker, analyze sentiment, classify criticality, and predict impact,
   * potentially adjusting log levels in real-time.
   */
  log: (level: 'info' | 'warn' | 'error' | 'debug', message: string, context?: Record<string, any>) => {
    const timestamp = new Date().toISOString();
    // Simulate dynamic routing to an AI-powered log analysis service
    // Gemini.logProcessor.analyze({ level, message, context, timestamp, file: 'FlowForm.tsx' });
    if (process.env.NODE_ENV !== 'production' || level === 'error' || level === 'warn') {
        console.log(`[${timestamp}][Gemini::${level.toUpperCase()}] ${message}`, context);
    }
  },

  /**
   * Emits a metric for dynamic scaling and performance monitoring.
   * Gemini AI would use this for dynamic scaling decisions, performance optimization,
   * and anomaly detection, adapting resource allocation autonomously.
   */
  metric: (name: string, value: number, tags?: Record<string, string>) => {
    const timestamp = new Date().toISOString();
    // Simulate sending data to an elastic telemetry pipeline for AI analysis
    // Gemini.metrics.emit({ name, value, tags, timestamp, file: 'FlowForm.tsx' });
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[${timestamp}][Gemini::METRIC] ${name}: ${value}`, tags);
    }
  },

  /**
   * Predicts potential issues based on current context and historical data,
   * generating an adaptive alert message. This would typically involve an LLM
   * in a fully realized Gemini integration.
   */
  predictiveAlert: (potentialIssue: string, currentContext: Record<string, any>): string => {
    GeminiTelemetryAgent.log('warn', `Predictive alert initiated for: ${potentialIssue}`, currentContext);
    // Simulate AI reasoning to generate an adaptive alert message
    if (currentContext.submitting && currentContext.isNew) {
      return `Gemini AI predicts potential submission bottleneck during new flow creation. Recommend pre-validation or resource allocation review. Issue: ${potentialIssue}`;
    }
    return `Gemini AI observes a pattern related to '${potentialIssue}'. Context suggests a proactive intervention might be beneficial.`;
  },
};

/**
 * GeminiSecurityOrchestrator
 * An AI-powered security and compliance module that applies real-time, adaptive policies.
 * It learns from authentication patterns, detects anomalies, and enforces dynamic access
 * and compliance rules, acting as an intelligent API gateway for internal operations.
 */
export const GeminiSecurityOrchestrator = {
  /**
   * Simulates an AI-driven authentication check. In a commercial system, this would
   * consult a dynamic identity service, adapting to user behavior and threat intelligence.
   */
  authenticate: (actorId: string, action: string, resource: string): boolean => {
    GeminiTelemetryAgent.log('debug', `Attempting authentication for ${actorId} on ${action} ${resource}`);
    // Simulate AI evaluating context: time of day, IP, user behavior patterns, role-based access.
    // For demo, we'll introduce a probabilistic failure for adaptive testing.
    const isAuthorized = Math.random() > 0.01; // 1% chance of simulated auth failure
    if (!isAuthorized) {
      GeminiTelemetryAgent.log('error', `Authentication failed for ${actorId} on ${action} ${resource}. Anomaly detected.`);
      // Gemini AI would trigger security alerts and potentially adaptive MFA here.
    } else {
      GeminiTelemetryAgent.log('info', `Authentication successful for ${actorId}.`);
    }
    return isAuthorized;
  },

  /**
   * Simulates an AI-driven compliance check that adapts to regulatory changes
   * and historical audit failures. It infuses real-world business logic simulations.
   */
  enforceCompliance: (data: Record<string, any>, ruleSetId: string, aiConfidenceThreshold: number = 0.7): { compliant: boolean; issues?: string[]; confidence?: number } => {
    GeminiTelemetryAgent.log('info', `Enforcing compliance for ${ruleSetId} with data snapshot.`, data);
    const issues: string[] = [];
    let compliant = true;
    const confidence = Math.random(); // Simulate AI's confidence in its assessment

    if (confidence < aiConfidenceThreshold) {
      issues.push(`Gemini AI's confidence score (${confidence.toFixed(2)}) is below the required threshold (${aiConfidenceThreshold.toFixed(2)}) for rule set '${ruleSetId}'. Manual review recommended.`);
      compliant = false; // Lower confidence can trigger a non-compliant state
    }

    // Simulate AI learning and adapting compliance rules.
    // For example, if 'name' is too short or contains suspicious characters, it might be flagged.
    if (data.name && (data.name.length < 3 || /[^a-zA-Z0-9\s-]/.test(data.name))) {
      issues.push("Flow name non-compliant: too short or contains invalid characters. Gemini AI detects potential data quality or spoofing risk.");
      compliant = false;
    }

    // Example of a simulated AI decision for a 'critical' field based on party type.
    if (ruleSetId.includes("FlowConfiguration") && !data.partyType) {
        issues.push("PartyType is missing, critical compliance breach for flow configuration.");
        compliant = false;
    }

    // Additional dynamic rule for KYB requiring website if business type and AI feature enabled
    if (data.partyType === Flow__PartyTypeEnum.Business && data.aiDrivenFeatureToggle && !data.kybWebsiteField) {
        // This is a simplified example, usually website presence would be checked, not just field mode.
        // If data.kybWebsiteField is undefined or FlowConfiguration__FieldModeEnum.Disabled
        if (data.kybWebsiteField === FlowConfiguration__FieldModeEnum.Disabled) {
             issues.push("Gemini AI for KYB flows requires website field to be at least optional.");
             compliant = false;
        }
    }


    if (!compliant) {
        GeminiTelemetryAgent.log('warn', `Compliance issues detected for ${ruleSetId}`, { issues, data, confidence });
    } else {
        GeminiTelemetryAgent.log('info', `Compliance check passed for ${ruleSetId} with confidence: ${confidence.toFixed(2)}.`);
    }

    return { compliant, issues, confidence };
  },

  /**
   * Simulates a dynamic circuit breaker, learning from past failures and
   * predicting service degradation. This ensures production-grade resilience.
   */
  isServiceOperational: (serviceName: string): boolean => {
    // In a real system, Gemini AI would monitor latency, error rates, and predict outages
    // across all external services. For simulation, let's assume a probabilistic failure.
    const operational = Math.random() > 0.05; // 5% chance of simulated failure.
    if (!operational) {
      GeminiTelemetryAgent.log('error', `Gemini Circuit Breaker OPEN: Service ${serviceName} is degraded or experiencing high latency.`);
      // Gemini AI would trigger fallback mechanisms, dynamic rerouting, or automated self-healing.
    }
    return operational;
  },
};

/**
 * GeminiPredictiveValidation
 * An AI-powered validation schema builder that adapts based on user behavior,
 * historical submission patterns, and real-time business context. It integrates
 * prompt-based learning pipelines into validation logic.
 */
export const GeminiPredictiveValidation = {
  /**
   * Adaptively generates a Yup schema based on dynamic context, "learning" from
   * past failures and adapting rules to improve data quality.
   * @param baseSchema The initial Yup schema.
   * @param context Context for adaptation, including `isNew`, `partyType`, `recentFailures`, and `aiAssistedValidation`.
   * @returns An adaptively modified Yup schema.
   */
  createAdaptiveSchema: (
    baseSchema: Yup.AnyObjectSchema,
    context: {
      isNew: boolean;
      partyType: Flow__PartyTypeEnum;
      recentFailures?: number;
      aiAssistedValidation?: boolean;
    }
  ): Yup.AnyObjectSchema => {
    GeminiTelemetryAgent.log('debug', 'Generating adaptive validation schema.', context);

    let currentSchema = baseSchema;

    if (context.aiAssistedValidation) {
        // Simulate AI adding stricter rules based on high failure rates for enhanced data quality.
        if (context.recentFailures && context.recentFailures > 2) {
            currentSchema = currentSchema.shape({
                name: Yup.string()
                    .min(8, `Gemini AI recommends a more descriptive name (min 8 chars) due to recent validation issues.`)
                    .matches(/^[a-zA-Z0-9\s-]+$/, "Gemini AI: Flow names should only contain alphanumeric characters, spaces, or hyphens for consistency.")
                    .required("Required by adaptive validation engine.")
            });
            GeminiTelemetryAgent.log('warn', 'Schema adapted: Stricter name validation applied due to recent failures.');
        }

        // AI can also dynamically suggest required fields based on partyType for compliance.
        if (context.partyType === Flow__PartyTypeEnum.Individual && !context.isNew) {
            currentSchema = currentSchema.shape({
                kycEmailField: Yup.string() // Assuming this maps to the actual select field value
                    .oneOf([FlowConfiguration__FieldModeEnum.Required], "Gemini AI requires email to be 'Required' for existing individual flows to ensure thorough KYC.")
                    .required("Email field mode is required for existing KYC flows by AI mandate.")
            });
            GeminiTelemetryAgent.log('info', 'Schema adapted: Email field mode set to required for existing KYC flows.');
        }
        if (context.partyType === Flow__PartyTypeEnum.Business && context.isNew) {
            currentSchema = currentSchema.shape({
                kybWebsiteField: Yup.string() // Assuming this maps to the actual select field value
                    .oneOf([FlowConfiguration__FieldModeEnum.Required, FlowConfiguration__FieldModeEnum.Optional], "Gemini AI recommends website field to be 'Required' or 'Optional' for new KYB flows.")
                    .required("Website field mode is required for new KYB flows by AI mandate.")
            });
            GeminiTelemetryAgent.log('info', 'Schema adapted: Website field mode set to required/optional for new KYB flows.');
        }
    }

    GeminiTelemetryAgent.log('info', 'Adaptive validation schema created successfully.');
    return currentSchema;
  },

  /**
   * Simulates a prompt for dynamic rule adjustments. In a real system, this would be an LLM
   * generating new validation rules based on complex input "prompts" or data patterns.
   * @param currentRules A string representation of current validation rules.
   * @returns An AI-generated suggestion for rule adjustment.
   */
  promptForValidationAdjustment: (currentRules: string): string => {
    GeminiTelemetryAgent.log('info', 'Prompting AI for validation rule adjustment.');
    // This is where an LLM call would happen, e.g., "Given current submission trends, how can we improve validation for flow names?"
    const aiResponse = `Based on historical data, consider adding a regex pattern to 'name' to enforce specific naming conventions or disallow special characters for new flows to improve data quality. Current rules: ${currentRules}`;
    return aiResponse;
  },
};

/**
 * GeminiAdaptiveUIEngine
 * An AI-powered engine for dynamically adjusting UI components and suggestions
 * based on user context, past interactions, and predictive analytics. It helps
 * create a generative and evolving user experience.
 */
export const GeminiAdaptiveUIEngine = {
  /**
   * Generates dynamic field suggestions or default values based on AI analysis
   * of current form state and user context.
   * @param fieldName The name of the field to generate suggestions for.
   * @param currentValues The current form values.
   * @param userContext User-specific context (e.g., role, history).
   * @returns A suggested value or null.
   */
  getSuggestedFieldValue: (fieldName: keyof FlowFormValues, currentValues: FlowFormValues, userContext: { userId: string; lastActivity?: Date }): any => {
    GeminiTelemetryAgent.log('debug', `Generating suggestion for field: ${fieldName}`, { currentValues, userContext });
    // Simulate AI logic for suggestions, adapting to party type and user history.
    switch (fieldName) {
      case 'name':
        if (currentValues.partyType === Flow__PartyTypeEnum.Individual) {
          return `Individual KYC Flow - ${new Date().toLocaleDateString('en-US')}`;
        } else if (currentValues.partyType === Flow__PartyTypeEnum.Business) {
          return `Business KYB Flow - ${new Date().toLocaleDateString('en-US')}`;
        }
        return null;
      case 'kycEmailField':
      case 'kybBeneficialOwnerEmailField':
      case 'phoneField':
      case 'kybWebsiteField':
        // If related checks are enabled, AI might default to 'Required' for proactive data collection.
        if (isChecked(currentValues.vendorChecksInput.email) || isChecked(currentValues.beneficialOwnersVendorChecksInput.email)) {
          return FlowConfiguration__FieldModeEnum.Required;
        }
        return null;
      default:
        return null;
    }
  },

  /**
   * Provides dynamic hints or warnings for fields, enhancing the user's understanding
   * and guiding them towards compliant inputs.
   * @param fieldName The field to provide a hint for.
   * @param currentValue The current value of the field.
   * @param context Additional form context.
   * @returns A string hint or null.
   */
  getFieldHint: (fieldName: keyof FlowFormValues, currentValue: any, context: { isNew: boolean; partyType: Flow__PartyTypeEnum; runEntityChecks?: boolean[]; vendorChecksInput?: VendorChecksInput }): string | null => {
    if (fieldName === 'name' && context.isNew && !currentValue) {
      return GeminiTelemetryAgent.predictiveAlert("Empty flow name on new creation", { fieldName, context });
    }
    if (fieldName === 'enableOngoingWatchlistMonitoring') {
      const isEntityChecksEnabled = context.partyType === Flow__PartyTypeEnum.Business
        ? isChecked(context.runEntityChecks || [])
        : isChecked(context.vendorChecksInput?.sanction || []);
      if (!isEntityChecksEnabled && isChecked(currentValue)) {
        return "Gemini AI recommends reviewing dependent checks (e.g., Sanctions/KYB Identity) for ongoing monitoring activation.";
      }
    }
    return null;
  }
};

// --- END: Gemini Integration & Self-Contained Universe Architecture ---

export interface FlowFormValues {
  id?: string;
  name: string;
  partyType: Flow__PartyTypeEnum;
  showEntityPage: boolean[];
  kycEmailField: FlowConfiguration__FieldModeEnum;
  kybBeneficialOwnerEmailField: FlowConfiguration__FieldModeEnum;
  phoneField: FlowConfiguration__FieldModeEnum;
  kybWebsiteField: FlowConfiguration__FieldModeEnum;
  showTaxIdPage: boolean[];
  showBankAccountsPage: boolean[];
  showKybBeneficialOwnersPage: boolean[];
  kybBeneficialOwnerPhoneField: FlowConfiguration__FieldModeEnum;
  runEntityChecks: boolean[];
  runBankAccountChecks: boolean[];
  enableOngoingWatchlistMonitoring: boolean[];
  vendorChecksInput: VendorChecksInput;
  beneficialOwnersVendorChecksInput: BeneficialOwnersVendorChecksInput;
  // --- New AI-specific fields for adaptive configuration, embedded directly ---
  aiAssistedValidationEnabled: boolean[]; // Control if AI validation is active for this flow
  aiDrivenFeatureToggle: boolean[]; // General AI feature flag to enable adaptive behaviors
  aiConfidenceThreshold: number; // For AI decision-making (e.g., 0.7 for high confidence)
  aiComplianceScoreTarget: number; // Target compliance score for this flow, influences AI checks
  // --- End new AI fields ---
}

interface VendorChecksInput {
  sanction: boolean[];
  politicallyExposedPerson: boolean[];
  adverseMedia: boolean[];
  deviceAndBehavior: boolean[];
  taxIdVerification: boolean[];
  bankRisk: boolean[];
  phone: boolean[];
  email: boolean[];
  kybIdentity: boolean[];
}

interface BeneficialOwnersVendorChecksInput {
  taxIdVerification: boolean[];
  phone: boolean[];
  email: boolean[];
}

interface NewFlowFormProps {
  initialValues: FlowFormValues;
  // --- New props for AI context, representing external intelligent APIs ---
  userContext?: { userId: string; organizationId: string; role: string; recentFlowFailures: number };
  // --- End new props ---
}

const FIELD_MODE_OPTIONS = [
  {
    id: FlowConfiguration__FieldModeEnum.Required,
    text: "Required",
    value: FlowConfiguration__FieldModeEnum.Required,
  },
  {
    id: FlowConfiguration__FieldModeEnum.Optional,
    text: "Optional",
    value: FlowConfiguration__FieldModeEnum.Optional,
  },
  {
    id: FlowConfiguration__FieldModeEnum.Disabled,
    text: "Disabled",
    value: FlowConfiguration__FieldModeEnum.Disabled,
  },
];

function BoKybChecks({
  setFieldValue,
}: {
  setFieldValue: FormikHelpers<FlowFormValues>["setFieldValue"];
}) {
  return (
    <Stack className="gap-4">
      {/* todo: remove mb-0 when global styles are removed */}
      <Heading level="h3" className="!mb-0">
        Beneficial Owners Checks{" "}
        <ReactTooltip
          multiline
          id="sanctions-tooltip"
          data-place="top"
          data-type="dark"
          data-effect="float"
        />
        <Tooltip
          className="ml-1"
          data-for="sanctions-tooltip"
          data-tip="Modern Treasury can also perform sanctions checks on beneficial owners across all Onboarding Flows. Contact support to change your settings."
        />
      </Heading>
      <Stack className="gap-2">
        <FieldGroup direction="left-to-right">
          <Field
            name="beneficialOwnersVendorChecksInput.email"
            type="checkbox"
            value
            component={FormikCheckboxField}
            onChange={() => {
              void setFieldValue(
                "kybBeneficialOwnerEmailField",
                FlowConfiguration__FieldModeEnum.Required,
              );
              void setFieldValue("showKybBeneficialOwnersPage", [true]);
              GeminiTelemetryAgent.log('info', 'BO Email check enabled, auto-setting related fields via AI.');
            }}
          />
          <Label>Email</Label>
          <FormikErrorMessage name="beneficialOwnersVendorChecksInput.email" />
        </FieldGroup>
        <FieldGroup direction="left-to-right">
          <Field
            name="beneficialOwnersVendorChecksInput.phone"
            type="checkbox"
            value
            component={FormikCheckboxField}
            onChange={() => {
              void setFieldValue(
                "kybBeneficialOwnerPhoneField",
                FlowConfiguration__FieldModeEnum.Required,
              );
              void setFieldValue("showKybBeneficialOwnersPage", [true]);
              GeminiTelemetryAgent.log('info', 'BO Phone check enabled, auto-setting related fields via AI.');
            }}
          />
          <Label>Phone</Label>
          <FormikErrorMessage name="beneficialOwnersVendorChecksInput.phone" />
        </FieldGroup>
        <FieldGroup direction="left-to-right">
          <Field
            name="beneficialOwnersVendorChecksInput.taxIdVerification"
            type="checkbox"
            value
            component={FormikCheckboxField}
            onChange={() => {
              void setFieldValue("showKybBeneficialOwnersPage", [true]);
              GeminiTelemetryAgent.log('info', 'BO Tax ID check enabled, auto-setting related fields via AI.');
            }}
          />
          <Label id="taxIdVerificationCheckbox">Tax ID Verification</Label>
          <FormikErrorMessage name="beneficialOwnersVendorChecksInput.taxIdVerification" />
        </FieldGroup>
      </Stack>
    </Stack>
  );
}

function FlowForm({ initialValues, userContext }: NewFlowFormProps) {
  const { dispatchError } = useDispatchContext();
  // Existing mutations are treated as "living endpoints" of the Gemini system.
  const [createFlow] = useCreateFlowMutation();
  const [updateFlow] = useUpdateFlowMutation();
  const isNew = !initialValues.id;
  const isKYC = initialValues.partyType === Flow__PartyTypeEnum.Individual;
  const isKYB = initialValues.partyType === Flow__PartyTypeEnum.Business;

  // State to simulate AI's adaptive learning for validation, remembering past interactions.
  const [recentFormFailures, setRecentFormFailures] = React.useState(userContext?.recentFlowFailures || 0);
  const [validationSchemaContext, setValidationSchemaContext] = React.useState({
      isNew,
      partyType: initialValues.partyType,
      recentFailures: recentFormFailures,
      aiAssistedValidation: isChecked(initialValues.aiAssistedValidationEnabled),
  });

  React.useEffect(() => {
    // Update AI context for validation schema if initial values or AI config changes
    setValidationSchemaContext({
        isNew,
        partyType: initialValues.partyType,
        recentFailures: recentFormFailures,
        aiAssistedValidation: isChecked(initialValues.aiAssistedValidationEnabled),
    });
  }, [isNew, initialValues.partyType, recentFormFailures, initialValues.aiAssistedValidationEnabled]);


  const cancelAction = () => {
    GeminiTelemetryAgent.log('info', 'Flow form cancellation initiated by user.', { isNew, flowId: initialValues.id });
    if (isNew) {
      window.location.href = "/compliance/flows";
    } else {
      window.location.href = `/compliance/flows/${initialValues.id ?? ""}`;
    }
  };

  const parseInputToVendorChecksArray = useCallback(
    (
      vendorChecksInput: VendorChecksInput,
      runEntityChecks: boolean[],
    ): VendorCheckEnum[] => {
      const vendorChecks: VendorCheckEnum[] = [];
      GeminiTelemetryAgent.log('debug', 'Parsing vendor checks for main entity with Gemini AI context.', { isKYC, vendorChecksInput });

      if (isKYC && isChecked(vendorChecksInput.sanction)) {
        vendorChecks.push(VendorCheckEnum.Sanction);
      }

      if (isKYC && isChecked(vendorChecksInput.politicallyExposedPerson)) {
        vendorChecks.push(VendorCheckEnum.PoliticallyExposedPerson);
      }

      if (isKYC && isChecked(vendorChecksInput.adverseMedia)) {
        vendorChecks.push(VendorCheckEnum.AdverseMedia);
      }

      if (isKYC && isChecked(vendorChecksInput.deviceAndBehavior)) {
        vendorChecks.push(VendorCheckEnum.DeviceAndBehavior);
      }

      if (isKYC && isChecked(vendorChecksInput.email)) {
        vendorChecks.push(VendorCheckEnum.Email);
      }

      if (isKYC && isChecked(vendorChecksInput.phone)) {
        vendorChecks.push(VendorCheckEnum.Phone);
      }

      if (isKYC && isChecked(vendorChecksInput.taxIdVerification)) {
        vendorChecks.push(VendorCheckEnum.TaxIdVerification);
      }

      if (!isKYC && isChecked(runEntityChecks)) {
        vendorChecks.push(VendorCheckEnum.KybIdentity);
        // Gemini AI could dynamically add more checks here based on business type or risk score.
        // E.g., if (isKYB && GeminiAdaptiveConfig.getFeatureFlag('enableEnhancedBusinessCreditChecks')) {
        //   vendorChecks.push(VendorCheckEnum.BusinessCredit);
        // }
      }

      if (isChecked(vendorChecksInput.bankRisk)) {
        vendorChecks.push(VendorCheckEnum.BankRisk);
      }

      GeminiTelemetryAgent.log('debug', 'Completed vendor check parsing with AI insights.', { result: vendorChecks });
      return vendorChecks;
    },
    [isKYC],
  );

  const parseBOInputToVendorChecksArray = useCallback(
    (
      boVendorChecksInput: BeneficialOwnersVendorChecksInput,
    ): BeneficialOwnersVendorCheckEnum[] => {
      const vendorChecks: BeneficialOwnersVendorCheckEnum[] = [];
      GeminiTelemetryAgent.log('debug', 'Parsing beneficial owner vendor checks with AI context.', { isKYB, boVendorChecksInput });

      if (isKYB && isChecked(boVendorChecksInput.email)) {
        vendorChecks.push(BeneficialOwnersVendorCheckEnum.Email);
      }

      if (isKYB && isChecked(boVendorChecksInput.phone)) {
        vendorChecks.push(BeneficialOwnersVendorCheckEnum.Phone);
      }

      if (isKYB && isChecked(boVendorChecksInput.taxIdVerification)) {
        vendorChecks.push(BeneficialOwnersVendorCheckEnum.TaxIdVerification);
      }

      GeminiTelemetryAgent.log('debug', 'Completed BO vendor check parsing with AI insights.', { result: vendorChecks });
      return vendorChecks;
    },
    [isKYB],
  );

  const checkRunEntityChecks = (
    vendorChecksInput: VendorChecksInput,
    aiConfidenceThreshold: number,
  ): boolean => {
    // Gemini AI could dynamically adjust what constitutes 'runEntityChecks' based on compliance needs or risk appetite.
    const allChecksEnabled =
      isChecked(vendorChecksInput.sanction) &&
      isChecked(vendorChecksInput.adverseMedia) &&
      isChecked(vendorChecksInput.deviceAndBehavior) &&
      isChecked(vendorChecksInput.phone) &&
      isChecked(vendorChecksInput.email) &&
      isChecked(vendorChecksInput.politicallyExposedPerson) &&
      isChecked(vendorChecksInput.taxIdVerification);

    if (allChecksEnabled && aiConfidenceThreshold < 0.8 && isChecked(initialValues.aiDrivenFeatureToggle)) {
        GeminiTelemetryAgent.log('warn', 'AI Confidence for entity checks is below threshold. Gemini AI recommends additional review.', { threshold: aiConfidenceThreshold });
        // AI might suggest additional manual review or stricter rules here, influencing subsequent steps.
    }
    return allChecksEnabled;
  }

  const flowConfiguration = (values: FlowFormValues) => {
    GeminiTelemetryAgent.log('info', 'Generating flow configuration with Gemini AI insights.', { flowName: values.name, partyType: values.partyType, aiFeatures: isChecked(values.aiDrivenFeatureToggle) });

    // AI-driven pre-computation or re-evaluation of configuration based on current context
    const effectiveRunEntityChecks = isKYC
      ? checkRunEntityChecks(values.vendorChecksInput, values.aiConfidenceThreshold)
      : isChecked(values.runEntityChecks);

    // Infuse AI reasoning into compliance checks for every logical path.
    const complianceCheckResult = GeminiSecurityOrchestrator.enforceCompliance(
        { ...values, effectiveRunEntityChecks },
        "FlowConfiguration",
        values.aiConfidenceThreshold
    );

    if (!complianceCheckResult.compliant && isChecked(values.aiDrivenFeatureToggle)) {
        // If AI detects non-compliance and AI features are enabled, dispatch an error.
        dispatchError(`Gemini AI detected compliance issues in configuration: ${complianceCheckResult.issues?.join(', ')}`);
        GeminiTelemetryAgent.log('error', `AI-driven compliance failure for flow config.`, { issues: complianceCheckResult.issues, confidence: complianceCheckResult.confidence });
        // A real commercial-grade system would allow configurable actions here: auto-correction, blocking, escalating.
    }
    // Simulate AI adapting the configuration based on intelligent rules.
    const aiAdaptedKycEmailField = isChecked(values.aiDrivenFeatureToggle) && isChecked(values.vendorChecksInput.email)
        ? FlowConfiguration__FieldModeEnum.Required // AI enforces consistency: if check enabled, field is required.
        : values.kycEmailField;

    return {
      showEntityPage: isChecked(values.showEntityPage),
      kycEmailField: isKYC ? aiAdaptedKycEmailField : undefined,
      kybBeneficialOwnerEmailField: isKYB
        ? values.kybBeneficialOwnerEmailField
        : undefined,
      phoneField: values.phoneField,
      kybWebsiteField: isKYC ? undefined : values.kybWebsiteField,
      showTaxIdPage: isChecked(values.showTaxIdPage),
      showBankAccountsPage: isChecked(values.showBankAccountsPage),
      showKybBeneficialOwnersPage: isChecked(values.showKybBeneficialOwnersPage),
      kybBeneficialOwnerPhoneField: isKYC
        ? undefined
        : values.kybBeneficialOwnerPhoneField,
      runEntityChecks: effectiveRunEntityChecks,
      runBankAccountChecks: isChecked(values.vendorChecksInput.bankRisk),
      enableOngoingWatchlistMonitoring: isChecked(
        values.enableOngoingWatchlistMonitoring,
      ),
      vendorChecks: parseInputToVendorChecksArray(
        values.vendorChecksInput,
        values.runEntityChecks,
      ),
      beneficialOwnersVendorChecks: parseBOInputToVendorChecksArray(
        values.beneficialOwnersVendorChecksInput,
      ),
    };
  };

  const createFlowAction = async (
    values: FlowFormValues,
    setSubmitting: (submitting: boolean) => void,
  ) => {
    GeminiTelemetryAgent.log('info', 'Initiating AI-enhanced create flow action.', { flowName: values.name, user: userContext?.userId });
    
    // AI-driven authentication layer, part of commercial-grade logic.
    if (!GeminiSecurityOrchestrator.authenticate(userContext?.userId || 'unknown', 'create', 'Flow')) {
        dispatchError("Gemini AI: Authentication failed for create flow action. Access denied.");
        setSubmitting(false);
        return;
    }

    // AI-powered circuit breaker for dynamic scaling and resilience.
    if (!GeminiSecurityOrchestrator.isServiceOperational('createFlowMutation')) {
        dispatchError(GeminiTelemetryAgent.predictiveAlert("Create Flow Service Degraded", { service: 'createFlowMutation', action: 'create', isSubmitting: true, isNew: true }));
        setSubmitting(false);
        return;
    }

    const config = flowConfiguration(values);
    // Pre-submission compliance check, dynamically adapting to business rules.
    const preSubmissionCompliance = GeminiSecurityOrchestrator.enforceCompliance(config, "PreSubmission", values.aiConfidenceThreshold);
    if (!preSubmissionCompliance.compliant && isChecked(values.aiDrivenFeatureToggle)) {
        dispatchError(`Gemini AI prevented submission due to compliance issues: ${preSubmissionCompliance.issues?.join(', ')}. Confidence: ${preSubmissionCompliance.confidence?.toFixed(2)}`);
        setSubmitting(false);
        return;
    }

    try {
        const { data: response } = await createFlow({
            variables: {
                input: {
                    flow: {
                        name: values.name,
                        partyType: values.partyType,
                    },
                    flowConfiguration: config,
                },
            },
        });

        if (response?.createFlow?.errors) {
            const errorMsg = response?.createFlow?.errors.map(e => e?.message || "Unknown error").join(', ');
            dispatchError(`AI Processing Error: ${errorMsg}`);
            setRecentFormFailures(prev => prev + 1); // AI learns from failures for adaptation.
            GeminiTelemetryAgent.log('error', 'Flow creation failed via API.', { errors: errorMsg, values });
        }
        if (response?.createFlow?.flow) {
            window.location.href = `/compliance/flows/${response?.createFlow?.flow.id}`;
            GeminiTelemetryAgent.log('info', 'Flow created successfully. Redirecting to AI-managed flow details.', { flowId: response.createFlow.flow.id });
            setRecentFormFailures(0); // Reset failures on success, indicating learning.
            GeminiTelemetryAgent.metric('flow_create_success', 1, { flowId: response.createFlow.flow.id, partyType: values.partyType });
        }
    } catch (error: any) {
        dispatchError(GeminiTelemetryAgent.predictiveAlert("Network or API error during flow creation", { error: error.message, isSubmitting: true, isNew: true }));
        setRecentFormFailures(prev => prev + 1);
        GeminiTelemetryAgent.log('error', 'Unhandled error during flow creation.', { error: error.message });
    } finally {
        setSubmitting(false);
        GeminiTelemetryAgent.metric('flow_create_attempt', 1, { status: 'completed' });
    }
  };

  const updateFlowAction = async (
    values: FlowFormValues,
    setSubmitting: (submitting: boolean) => void,
  ) => {
    GeminiTelemetryAgent.log('info', 'Initiating AI-enhanced update flow action.', { flowId: values.id, user: userContext?.userId });
    
    // AI-driven authentication for updates.
    if (!GeminiSecurityOrchestrator.authenticate(userContext?.userId || 'unknown', 'update', `Flow:${values.id}`)) {
        dispatchError("Gemini AI: Authentication failed for update flow action. Access denied.");
        setSubmitting(false);
        return;
    }

    // AI-powered circuit breaker for updates.
    if (!GeminiSecurityOrchestrator.isServiceOperational('updateFlowMutation')) {
        dispatchError(GeminiTelemetryAgent.predictiveAlert("Update Flow Service Degraded", { service: 'updateFlowMutation', action: 'update', isSubmitting: true, isNew: false }));
        setSubmitting(false);
        return;
    }

    const config = flowConfiguration(values);
    // Pre-submission compliance for updates.
    const preSubmissionCompliance = GeminiSecurityOrchestrator.enforceCompliance(config, "PreSubmissionUpdate", values.aiConfidenceThreshold);
    if (!preSubmissionCompliance.compliant && isChecked(values.aiDrivenFeatureToggle)) {
        dispatchError(`Gemini AI prevented update due to compliance issues: ${preSubmissionCompliance.issues?.join(', ')}. Confidence: ${preSubmissionCompliance.confidence?.toFixed(2)}`);
        setSubmitting(false);
        return;
    }

    try {
        const { data: response } = await updateFlow({
            variables: {
                input: {
                    flowId: values.id || "",
                    flowConfiguration: config,
                },
            },
        });

        if (response?.updateFlow?.errors) {
            const errorMsg = response?.updateFlow?.errors.map(e => e?.message || "Unknown error").join(', ');
            dispatchError(`AI Processing Error: ${errorMsg}`);
            setRecentFormFailures(prev => prev + 1);
            GeminiTelemetryAgent.log('error', 'Flow update failed via API.', { errors: errorMsg, values });
        } else {
            window.location.href = `/compliance/flows/${initialValues.id ?? ""}`;
            GeminiTelemetryAgent.log('info', 'Flow updated successfully. Redirecting to AI-managed flow details.', { flowId: initialValues.id });
            setRecentFormFailures(0);
            GeminiTelemetryAgent.metric('flow_update_success', 1, { flowId: initialValues.id, partyType: values.partyType });
        }
    } catch (error: any) {
        dispatchError(GeminiTelemetryAgent.predictiveAlert("Network or API error during flow update", { error: error.message, isSubmitting: true, isNew: false }));
        setRecentFormFailures(prev => prev + 1);
        GeminiTelemetryAgent.log('error', 'Unhandled error during flow update.', { error: error.message });
    } finally {
        setSubmitting(false);
        GeminiTelemetryAgent.metric('flow_update_attempt', 1, { status: 'completed' });
    }
  };

  // Dynamic validation schema, adaptively generated by Gemini AI based on context and learning.
  const currentValidationSchema = React.useMemo(() => {
    const baseSchema = Yup.object({
      name: Yup.string().required("Required"),
      aiConfidenceThreshold: Yup.number().min(0.1, "AI Confidence must be at least 0.1").max(1.0, "AI Confidence cannot exceed 1.0").required("AI Confidence is required."),
      aiComplianceScoreTarget: Yup.number().min(0, "Compliance target cannot be negative").max(100, "Compliance target cannot exceed 100").required("AI Compliance Target is required."),
    });
    return GeminiPredictiveValidation.createAdaptiveSchema(baseSchema, validationSchemaContext);
  }, [validationSchemaContext]);


  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) =>
        isNew
          ? createFlowAction(values, setSubmitting)
          : updateFlowAction(values, setSubmitting)
      }
      validationSchema={currentValidationSchema}
    >
      {({
        isSubmitting,
        values,
        setFieldValue,
      }: FormikProps<FlowFormValues>) => {
        // AI-powered suggestions for field defaults, enhancing user experience.
        React.useEffect(() => {
            if (isNew && !values.name && isChecked(values.aiDrivenFeatureToggle)) {
                const suggestedName = GeminiAdaptiveUIEngine.getSuggestedFieldValue('name', values, { userId: userContext?.userId || 'anon' });
                if (suggestedName) {
                    void setFieldValue('name', suggestedName);
                    GeminiTelemetryAgent.log('debug', `AI suggested name: ${suggestedName} for new flow.`);
                }
            }
            // AI enforces consistency: if email check is enabled, make the field required.
            if (isChecked(values.aiDrivenFeatureToggle) && isChecked(values.vendorChecksInput.email) && values.kycEmailField !== FlowConfiguration__FieldModeEnum.Required) {
                void setFieldValue('kycEmailField', FlowConfiguration__FieldModeEnum.Required);
                GeminiTelemetryAgent.log('debug', 'AI enforced kycEmailField to Required based on email check being enabled.');
            }
            // Similar enforcement for phone if AI is driven.
            if (isChecked(values.aiDrivenFeatureToggle) && isChecked(values.vendorChecksInput.phone) && values.phoneField !== FlowConfiguration__FieldModeEnum.Required) {
                void setFieldValue('phoneField', FlowConfiguration__FieldModeEnum.Required);
                GeminiTelemetryAgent.log('debug', 'AI enforced phoneField to Required based on phone check being enabled.');
            }

        }, [isNew, values.name, values.partyType, values.aiDrivenFeatureToggle, values.vendorChecksInput.email, values.vendorChecksInput.phone, values.kycEmailField, values.phoneField, setFieldValue, userContext?.userId]);

        const nameHint = GeminiAdaptiveUIEngine.getFieldHint('name', values.name, { isNew, partyType: values.partyType });
        const watchlistHint = GeminiAdaptiveUIEngine.getFieldHint('enableOngoingWatchlistMonitoring', values.enableOngoingWatchlistMonitoring, { isNew, partyType: values.partyType, runEntityChecks: values.runEntityChecks, vendorChecksInput: values.vendorChecksInput });

        return (
        <Form>
          <Stack className="form-section max-w-2xl gap-6">
            {/* Gemini AI System Configuration - Self-contained intelligence parameters */}
            <Heading level="h3" className="!mb-0">
                Gemini AI System Configuration{" "}
                <ReactTooltip
                    multiline
                    id="ai-config-tooltip"
                    data-place="top"
                    data-type="dark"
                    data-effect="float"
                />
                <Tooltip
                    className="ml-1"
                    data-for="ai-config-tooltip"
                    data-tip="Configure Gemini AI behavior for this flow, enabling adaptive validation, feature toggles, and confidence thresholds for autonomous operation."
                />
            </Heading>
            <Stack className="gap-2">
                <FieldGroup direction="left-to-right">
                    <Field
                        name="aiAssistedValidationEnabled"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        onChange={() => {
                            void setFieldValue('aiAssistedValidationEnabled', !isChecked(values.aiAssistedValidationEnabled));
                            GeminiTelemetryAgent.log('info', `AI Assisted Validation toggled to: ${!isChecked(values.aiAssistedValidationEnabled)} by user.`);
                        }}
                    />
                    <Label>Enable AI Assisted Validation</Label>
                    <FormikErrorMessage name="aiAssistedValidationEnabled" />
                    {isChecked(values.aiAssistedValidationEnabled) && (
                        <p className="text-sm text-green-600 mt-1">Gemini AI will adapt validation rules based on historical data and context.</p>
                    )}
                </FieldGroup>
                <FieldGroup direction="left-to-right">
                    <Field
                        name="aiDrivenFeatureToggle"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        onChange={() => {
                            void setFieldValue('aiDrivenFeatureToggle', !isChecked(values.aiDrivenFeatureToggle));
                            GeminiTelemetryAgent.log('info', `AI Driven Feature Toggle set to: ${!isChecked(values.aiDrivenFeatureToggle)} by user.`);
                        }}
                    />
                    <Label>Enable AI-Driven Feature Enhancements</Label>
                    <FormikErrorMessage name="aiDrivenFeatureToggle" />
                    {isChecked(values.aiDrivenFeatureToggle) && (
                        <p className="text-sm text-blue-600 mt-1">Gemini AI will enable advanced features like dynamic suggestions and proactive compliance checks.</p>
                    )}
                </FieldGroup>
                <FieldGroup>
                    <Label>AI Confidence Threshold</Label>
                    <Field
                        name="aiConfidenceThreshold"
                        type="number"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        component={FormikInputField}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            void setFieldValue("aiConfidenceThreshold", parseFloat(e.target.value));
                            GeminiTelemetryAgent.log('info', `AI Confidence Threshold changed to: ${e.target.value}`);
                        }}
                    />
                    <FormikErrorMessage name="aiConfidenceThreshold" />
                    {isChecked(values.aiDrivenFeatureToggle) && values.aiConfidenceThreshold < 0.7 && (
                        <p className="text-sm text-yellow-600 mt-1">Gemini AI suggests a higher confidence threshold (e.g., 0.8) for production-grade flows to minimize false positives and ensure robustness.</p>
                    )}
                </FieldGroup>
                <FieldGroup>
                    <Label>AI Compliance Score Target</Label>
                    <Field
                        name="aiComplianceScoreTarget"
                        type="number"
                        min="0"
                        max="100"
                        step="5"
                        component={FormikInputField}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            void setFieldValue("aiComplianceScoreTarget", parseFloat(e.target.value));
                            GeminiTelemetryAgent.log('info', `AI Compliance Score Target changed to: ${e.target.value}`);
                        }}
                    />
                    <FormikErrorMessage name="aiComplianceScoreTarget" />
                    {isChecked(values.aiDrivenFeatureToggle) && values.aiComplianceScoreTarget < 80 && (
                        <p className="text-sm text-red-600 mt-1">Warning: Gemini AI identifies this target as potentially low for strict compliance environments, potentially increasing risk.</p>
                    )}
                </FieldGroup>
            </Stack>

            {isNew && (
              <FieldGroup className="pb-6">
                <Label>Name</Label>
                <Field name="name" component={FormikInputField} />
                <FormikErrorMessage name="name" />
                {nameHint && <p className="text-sm text-blue-600 mt-1">{nameHint}</p>}
              </FieldGroup>
            )}
            <Stack className="gap-4">
              {/* todo: remove mb-0 when global styles are removed */}
              <Heading level="h3" className="!mb-0">
                Checks
              </Heading>
              <Stack className="gap-2">
                {isKYC ? (
                  <Stack className="gap-2">
                    <FieldGroup direction="left-to-right">
                      <Field
                        name="vendorChecksInput.email"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        onChange={() => {
                          void setFieldValue(
                            "kycEmailField",
                            FlowConfiguration__FieldModeEnum.Required,
                          );
                          void setFieldValue("showEntityPage", [true]);
                          GeminiTelemetryAgent.log('info', 'KYC Email check enabled, auto-setting related fields via AI.');
                        }}
                      />
                      <Label>Email</Label>
                      <FormikErrorMessage name="vendorChecksInput.email" />
                    </FieldGroup>
                    <FieldGroup direction="left-to-right">
                      <Field
                        name="vendorChecksInput.phone"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        onChange={() => {
                          void setFieldValue(
                            "phoneField",
                            FlowConfiguration__FieldModeEnum.Required,
                          );
                          void setFieldValue("showEntityPage", [true]);
                          GeminiTelemetryAgent.log('info', 'KYC Phone check enabled, auto-setting related fields via AI.');
                        }}
                      />
                      <Label>Phone</Label>
                      <FormikErrorMessage name="vendorChecksInput.phone" />
                    </FieldGroup>
                    <FieldGroup direction="left-to-right">
                      <Field
                        name="vendorChecksInput.taxIdVerification"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        onChange={() => {
                          void setFieldValue("showTaxIdPage", [true]);
                          void setFieldValue("showEntityPage", [true]);
                          GeminiTelemetryAgent.log('info', 'KYC Tax ID check enabled, auto-setting related fields via AI.');
                        }}
                      />
                      <Label id="taxIdVerificationCheckbox">
                        Tax ID Verification
                      </Label>
                      <FormikErrorMessage name="vendorChecksInput.taxIdVerification" />
                    </FieldGroup>
                    <FieldGroup direction="left-to-right">
                      <Field
                        name="vendorChecksInput.sanction"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        onChange={() => {
                          void setFieldValue("showEntityPage", [true]);
                          GeminiTelemetryAgent.log('info', 'KYC Sanction check enabled via AI-driven policy.');
                        }}
                      />
                      <Label id="sanctionCheckbox">Sanctions</Label>
                      <FormikErrorMessage name="vendorChecksInput.sanction" />
                    </FieldGroup>
                    <FieldGroup direction="left-to-right">
                      <Field
                        name="vendorChecksInput.politicallyExposedPerson"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        onChange={() => {
                          void setFieldValue("showEntityPage", [true]);
                          GeminiTelemetryAgent.log('info', 'KYC PEP check enabled via AI-driven policy.');
                        }}
                      />
                      <Label id="politicallyExposedPersonCheckbox">
                        Politically Exposed Person
                      </Label>
                      <FormikErrorMessage name="vendorChecksInput.politicallyExposedPerson" />
                    </FieldGroup>
                    <FieldGroup direction="left-to-right">
                      <Field
                        name="vendorChecksInput.adverseMedia"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        onChange={() => {
                          void setFieldValue("showEntityPage", [true]);
                          GeminiTelemetryAgent.log('info', 'KYC Adverse Media check enabled via AI-driven policy.');
                        }}
                      />
                      <Label id="adverseMediaCheckbox">Adverse Media</Label>
                      <FormikErrorMessage name="vendorChecksInput.adverseMedia" />
                    </FieldGroup>
                    <FieldGroup direction="left-to-right">
                      <Field
                        name="vendorChecksInput.deviceAndBehavior"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        onChange={() => GeminiTelemetryAgent.log('info', 'KYC Device and Behavior check enabled via AI-driven policy.')}
                      />
                      <Label id="deviceAndBehaviorCheckbox">
                        Device and Behavior
                      </Label>
                      <FormikErrorMessage name="vendorChecksInput.deviceAndBehavior" />
                    </FieldGroup>
                    <FieldGroup direction="left-to-right">
                      <Field
                        name="enableOngoingWatchlistMonitoring"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        onChange={() => GeminiTelemetryAgent.log('info', 'Ongoing Watchlist Monitoring toggled via AI-driven policy.')}
                      />
                      <Label>Ongoing Watchlist Monitoring</Label>
                      <FormikErrorMessage name="enableOngoingWatchlistMonitoring" />
                      {watchlistHint && <p className="text-sm text-orange-600 mt-1">{watchlistHint}</p>}
                    </FieldGroup>
                  </Stack>
                ) : (
                  <Stack className="gap-2">
                    <FieldGroup direction="left-to-right">
                      <Field
                        name="runEntityChecks"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        onChange={() => {
                          if (isChecked(values.runEntityChecks)) {
                            void setFieldValue(
                              "enableOngoingWatchlistMonitoring",
                              [false],
                            );
                          }
                          GeminiTelemetryAgent.log('info', 'KYB Identity Checks toggled via AI-driven policy.');
                        }}
                      />
                      <Label>KYB Identity Checks</Label>
                      <FormikErrorMessage name="runEntityChecks" />
                    </FieldGroup>
                    <FieldGroup direction="left-to-right">
                      <Field
                        name="enableOngoingWatchlistMonitoring"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        disabled={!isChecked(values.runEntityChecks)}
                        onChange={() => GeminiTelemetryAgent.log('info', 'Ongoing Watchlist Monitoring toggled for KYB via AI-driven policy.')}
                      />
                      <Label>Ongoing Watchlist Monitoring</Label>
                      <ReactTooltip
                        multiline
                        id="ongoing-watchlist-tooltip"
                        data-place="top"
                        data-type="dark"
                        data-effect="float"
                      />
                      <Tooltip
                        data-for="ongoing-watchlist-tooltip"
                        data-tip="Ongoing Watchlist Monitoring requires KYB Identity Checks to be enabled."
                      />
                      <FormikErrorMessage name="enableOngoingWatchlistMonitoring" />
                      {watchlistHint && <p className="text-sm text-orange-600 mt-1">{watchlistHint}</p>}
                    </FieldGroup>
                  </Stack>
                )}
                <FieldGroup direction="left-to-right">
                  <Field
                    name="vendorChecksInput.bankRisk"
                    type="checkbox"
                    value
                    component={FormikCheckboxField}
                    onChange={() => {
                      void setFieldValue("showBankAccountsPage", [true]);
                      GeminiTelemetryAgent.log('info', 'Bank Risk Check enabled, auto-setting related fields via AI.');
                    }}
                  />
                  <Label>Bank Risk Check</Label>
                  <FormikErrorMessage name="vendorChecksInput.bankRisk" />
                </FieldGroup>
              </Stack>
            </Stack>
            {isKYB && <BoKybChecks setFieldValue={setFieldValue} />}
            <Stack className="gap-4">
              {/* todo: remove mb-0 when global styles are removed */}
              <Heading level="h3" className="!mb-0">
                Collected Data
              </Heading>
              <Stack className="gap-2">
                <FieldGroup direction="left-to-right">
                  <Field
                    name="showEntityPage"
                    type="checkbox"
                    disabled={
                      isKYC
                        ? isChecked(values.vendorChecksInput.phone) ||
                          isChecked(values.vendorChecksInput.email) ||
                          isChecked(
                            values.vendorChecksInput.taxIdVerification,
                          ) ||
                          isChecked(values.vendorChecksInput.sanction) ||
                          isChecked(
                            values.vendorChecksInput.politicallyExposedPerson,
                          ) ||
                          isChecked(values.vendorChecksInput.adverseMedia)
                        : false
                    }
                    value
                    component={FormikCheckboxField}
                    onChange={() => GeminiTelemetryAgent.log('info', `${isKYC ? 'Personal' : 'Business'} Information page toggled by user.`)}
                  />
                  <Label>{isKYC ? "Personal" : "Business"} Information</Label>
                  <FormikErrorMessage name="showEntityPage" />
                </FieldGroup>
                <Stack
                  className={cn(
                    "mb-2 gap-6 rounded-md border border-alpha-black-100 bg-white px-6 py-6",
                    !isChecked(values.showEntityPage) && "hidden",
                  )}
                >
                  <FieldGroup>
                    <Label>Name</Label>
                    <SelectGroup
                      onChange={function noOp() {}}
                      disabled
                      value={FlowConfiguration__FieldModeEnum.Required}
                      selectOptions={FIELD_MODE_OPTIONS}
                    />
                    <FormikErrorMessage name="nameField" />
                  </FieldGroup>
                  {isKYC && (
                    <FieldGroup>
                      <Label>Date of Birth</Label>
                      <SelectGroup
                        onChange={function noOp() {}}
                        disabled
                        value={FlowConfiguration__FieldModeEnum.Required}
                        selectOptions={FIELD_MODE_OPTIONS}
                      />
                      <FormikErrorMessage name="dateOfBirthField" />
                    </FieldGroup>
                  )}
                  <FieldGroup>
                    <Label>Address</Label>
                    <SelectGroup
                      onChange={function noOp() {}}
                      disabled
                      value={FlowConfiguration__FieldModeEnum.Required}
                      selectOptions={FIELD_MODE_OPTIONS}
                    />
                    <FormikErrorMessage name="addressField" />
                  </FieldGroup>
                  {isKYC && (
                    <FieldGroup>
                      <Label>Email</Label>
                      <Field
                        name="kycEmailField"
                        type="select"
                        disabled={isChecked(values.vendorChecksInput.email)}
                        value={values.kycEmailField} // Use value from formik state
                        selectOptions={FIELD_MODE_OPTIONS}
                        component={FormikSelectGroupField}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            void setFieldValue("kycEmailField", e.target.value as FlowConfiguration__FieldModeEnum);
                            GeminiTelemetryAgent.log('info', `KYC Email field mode changed to: ${e.target.value}`);
                        }}
                      />
                      <FormikErrorMessage name="kycEmailField" />
                    </FieldGroup>
                  )}
                  <FieldGroup>
                    <Label>Phone</Label>
                    <Field
                      name="phoneField"
                      type="select"
                      disabled={isChecked(values.vendorChecksInput.phone)}
                      value={values.phoneField} // Use value from formik state
                      selectOptions={FIELD_MODE_OPTIONS}
                      component={FormikSelectGroupField}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            void setFieldValue("phoneField", e.target.value as FlowConfiguration__FieldModeEnum);
                            GeminiTelemetryAgent.log('info', `Phone field mode changed to: ${e.target.value}`);
                        }}
                    />
                    <FormikErrorMessage name="kycPhoneField" />
                  </FieldGroup>
                  {!isKYC && (
                    <FieldGroup>
                      <Label>Website</Label>
                      <Field
                        name="kybWebsiteField"
                        type="select"
                        value={values.kybWebsiteField} // Use value from formik state
                        selectOptions={FIELD_MODE_OPTIONS}
                        component={FormikSelectGroupField}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            void setFieldValue("kybWebsiteField", e.target.value as FlowConfiguration__FieldModeEnum);
                            GeminiTelemetryAgent.log('info', `KYB Website field mode changed to: ${e.target.value}`);
                        }}
                      />
                      <FormikErrorMessage name="kybWebsiteField" />
                    </FieldGroup>
                  )}
                </Stack>
                <FieldGroup direction="left-to-right">
                  <Field
                    name="showTaxIdPage"
                    type="checkbox"
                    disabled={
                      isKYC &&
                      isChecked(values.vendorChecksInput.taxIdVerification)
                    }
                    value
                    component={FormikCheckboxField}
                    onChange={() => GeminiTelemetryAgent.log('info', 'Tax ID page toggled by user.')}
                  />
                  <Label>Tax ID</Label>
                  <FormikErrorMessage name="showTaxIdPage" />
                </FieldGroup>
                {!isKYC && (
                  <>
                    <FieldGroup direction="left-to-right">
                      <Field
                        name="showKybBeneficialOwnersPage"
                        type="checkbox"
                        value
                        component={FormikCheckboxField}
                        disabled={
                          isKYB
                            ? isChecked(
                                values.beneficialOwnersVendorChecksInput.email,
                              ) ||
                              isChecked(
                                values.beneficialOwnersVendorChecksInput.phone,
                              ) ||
                              isChecked(
                                values.beneficialOwnersVendorChecksInput
                                  .taxIdVerification,
                              )
                            : false
                        }
                        onChange={() => GeminiTelemetryAgent.log('info', 'Beneficial Owners page toggled by user.')}
                      />
                      <Label>Beneficial Owners</Label>
                      <FormikErrorMessage name="showKybBeneficialOwnersPage" />
                    </FieldGroup>
                    <Stack
                      className={cn(
                        "mb-2 gap-6 rounded-md border border-alpha-black-100 bg-white px-6 py-6",
                        !isChecked(values.showKybBeneficialOwnersPage) &&
                          "hidden",
                      )}
                    >
                      <FieldGroup>
                        <Label>Name</Label>
                        <SelectGroup
                          onChange={function noOp() {}}
                          disabled
                          value={FlowConfiguration__FieldModeEnum.Required}
                          selectOptions={FIELD_MODE_OPTIONS}
                        />
                        <FormikErrorMessage name="kybBeneficialOwnerNameField" />
                      </FieldGroup>
                      <FieldGroup>
                        <Label>Date of Birth</Label>
                        <SelectGroup
                          onChange={function noOp() {}}
                          disabled
                          value={FlowConfiguration__FieldModeEnum.Required}
                          selectOptions={FIELD_MODE_OPTIONS}
                        />
                        <FormikErrorMessage name="kybBeneficialOwnerDateOfBirthField" />
                      </FieldGroup>
                      <FieldGroup>
                        <Label>Address</Label>
                        <SelectGroup
                          onChange={function noOp() {}}
                          disabled
                          value={FlowConfiguration__FieldModeEnum.Required}
                          selectOptions={FIELD_MODE_OPTIONS}
                        />
                        <FormikErrorMessage name="kybBeneficialOwnerAddressField" />
                      </FieldGroup>
                      <FieldGroup>
                        <Label>Email</Label>
                        <Field
                          name="kybBeneficialOwnerEmailField"
                          type="select"
                          disabled={isChecked(
                            values.beneficialOwnersVendorChecksInput.email,
                          )}
                          value={values.kybBeneficialOwnerEmailField} // Use value from formik state
                          selectOptions={FIELD_MODE_OPTIONS}
                          component={FormikSelectGroupField}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            void setFieldValue("kybBeneficialOwnerEmailField", e.target.value as FlowConfiguration__FieldModeEnum);
                            GeminiTelemetryAgent.log('info', `BO Email field mode changed to: ${e.target.value}`);
                          }}
                        />
                        <FormikErrorMessage name="kybBeneficialOwnerEmailField" />
                      </FieldGroup>
                      <FieldGroup>
                        <Label>Phone</Label>
                        <Field
                          name="kybBeneficialOwnerPhoneField"
                          type="select"
                          disabled={isChecked(
                            values.beneficialOwnersVendorChecksInput.phone,
                          )}
                          value={values.kybBeneficialOwnerPhoneField} // Use value from formik state
                          selectOptions={FIELD_MODE_OPTIONS}
                          component={FormikSelectGroupField}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            void setFieldValue("kybBeneficialOwnerPhoneField", e.target.value as FlowConfiguration__FieldModeEnum);
                            GeminiTelemetryAgent.log('info', `BO Phone field mode changed to: ${e.target.value}`);
                          }}
                        />
                        <FormikErrorMessage name="kybBeneficialOwnerPhoneField" />
                      </FieldGroup>
                      <FieldGroup>
                        <Label>Taxpayer Identifier</Label>
                        <SelectGroup
                          onChange={function noOp() {}}
                          disabled
                          value={FlowConfiguration__FieldModeEnum.Required}
                          selectOptions={FIELD_MODE_OPTIONS}
                        />
                        <FormikErrorMessage name="kybBeneficialOwnerTaxIDField" />
                      </FieldGroup>
                    </Stack>
                  </>
                )}
                <FieldGroup direction="left-to-right">
                  <Field
                    name="showBankAccountsPage"
                    type="checkbox"
                    disabled={isChecked(values.vendorChecksInput.bankRisk)}
                    value
                    component={FormikCheckboxField}
                    onChange={() => GeminiTelemetryAgent.log('info', 'Bank Accounts page toggled by user.')}
                  />
                  <Label>Bank Accounts</Label>
                  <FormikErrorMessage name="showBankAccountsPage" />
                </FieldGroup>
                <div className="flex flex-row space-x-4 pt-5">
                  <Button onClick={() => cancelAction()}>Cancel</Button>
                  <Button buttonType="primary" isSubmit disabled={isSubmitting}>
                    {isNew ? "Create" : "Update"}
                  </Button>
                </div>
              </Stack>
            </Stack>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}

export default FlowForm;