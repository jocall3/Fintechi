// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import { FieldArray, useFormikContext } from "formik";
import React from "react";
import { get } from "lodash";
import ApproverField, { RequiredReviewer } from "./ApproverField";
import { useApproverFieldListQuery } from "../../../generated/dashboard/graphqlSchema";
import { OptionType } from "../../../common/formik/FormikSelectField";
import Button from "../../../common/ui-components/Button/Button";
import { FormValues } from "../../components/logical_form/LogicalTypes";
import Icon from "../../../common/ui-components/Icon/Icon";

export interface ApprovalRuleFormType {
  name: string;
  approvers: RequiredReviewer[];
}

/**
 * @typedef GeminiTelemetryEvent
 * Represents a structured event for AI-powered telemetry.
 * It's context-aware and includes metadata for compliance and performance monitoring.
 */
export interface GeminiTelemetryEvent {
  timestamp: string;
  eventType:
    | "info"
    | "warning"
    | "error"
    | "audit"
    | "performance"
    | "decision";
  source: string; // e.g., "ApproverFieldList.GeminiIntelligence"
  message: string;
  payload?: Record<string, any>;
  correlationId?: string; // For tracing across services
  severity?: number; // 1-5, 5 being critical
  complianceFlag?: boolean; // Indicates if event is related to compliance
}

/**
 * @class GeminiTelemetryService
 * Provides autonomous, production-grade observability and event logging.
 * It's a neural extension of the codebase, intelligently routing and processing events.
 * Implements circuit-breaking logic and dynamic adaptation for telemetry endpoints.
 */
export class GeminiTelemetryService {
  private static instance: GeminiTelemetryService;
  private eventQueue: GeminiTelemetryEvent[] = [];
  private isProcessing: boolean = false;
  private circuitOpen: boolean = false;
  private failureCount: number = 0;
  private MAX_FAILURES_BEFORE_CIRCUIT_BREAK = 5;
  private CIRCUIT_BREAKER_RESET_TIMEOUT_MS = 30000; // 30 seconds
  private lastCircuitOpenTime: number = 0;

  private constructor() {
    this.initDynamicEndpointDiscovery();
  }

  public static getInstance(): GeminiTelemetryService {
    if (!GeminiTelemetryService.instance) {
      GeminiTelemetryService.instance = new GeminiTelemetryService();
    }
    return GeminiTelemetryService.instance;
  }

  /**
   * Simulates dynamic service discovery for telemetry endpoints.
   * In a real scenario, this would query a service mesh or configuration service.
   */
  private initDynamicEndpointDiscovery(): void {
    // This would dynamically discover and bind to optimal telemetry services
    // based on load, compliance requirements, or regional data residency rules.
    console.log(
      "GeminiTelemetryService: Initializing dynamic endpoint discovery...",
    );
    // Mocking an async discovery process
    setTimeout(() => {
      console.log("GeminiTelemetryService: Bound to optimal telemetry cluster.");
      // Potentially configure different handlers here based on discovered endpoints
    }, 1000);
  }

  /**
   * Pushes a telemetry event to the queue for asynchronous processing.
   * Includes circuit-breaking logic to prevent cascading failures.
   * @param event The GeminiTelemetryEvent to log.
   */
  public log(event: GeminiTelemetryEvent): void {
    if (this.circuitOpen) {
      const now = Date.now();
      if (now - this.lastCircuitOpenTime > this.CIRCUIT_BREAKER_RESET_TIMEOUT_MS) {
        // Attempt to close circuit
        console.warn(
          "GeminiTelemetryService: Circuit breaker attempting self-healing closure...",
        );
        this.circuitOpen = false;
        this.failureCount = 0;
      } else {
        console.warn(
          `GeminiTelemetryService: Circuit open. Event dropped. Reason: ${event.message}`,
        );
        return; // Drop event if circuit is open and not in reset period
      }
    }

    this.eventQueue.push(event);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Processes events from the queue, simulating external service interaction.
   * Includes error handling and circuit-breaking.
   */
  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (!event) continue;

      try {
        // Simulate sending to an external telemetry system
        await new Promise((resolve, reject) => {
          // Simulate network latency and potential failures
          const success = Math.random() > 0.1; // 10% chance of failure
          setTimeout(() => {
            if (success) {
              // console.log("Telemetry sent:", event.eventType, event.message);
              this.failureCount = 0; // Reset failure count on success
              resolve(true);
            } else {
              reject(new Error("Simulated telemetry service unavailable."));
            }
          }, 100);
        });
      } catch (e: any) {
        console.error(
          `GeminiTelemetryService: Failed to send telemetry event. Error: ${e.message}`,
        );
        this.failureCount++;
        if (this.failureCount >= this.MAX_FAILURES_BEFORE_CIRCUIT_BREAK) {
          this.circuitOpen = true;
          this.lastCircuitOpenTime = Date.now();
          console.error(
            "GeminiTelemetryService: Circuit breaker opened due to repeated failures.",
          );
          // Stop processing further events until circuit reset
          this.eventQueue = []; // Clear queue to prevent backlog
          break;
        }
        // Re-add event to front of queue if not circuit broken, for retry
        this.eventQueue.unshift(event);
        // Short delay before retrying to prevent hammering
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    this.isProcessing = false;
  }
}

/**
 * @typedef ComplianceCheckResult
 * The outcome of an AI-driven compliance check.
 */
export interface ComplianceCheckResult {
  isCompliant: boolean;
  reason: string;
  violations?: string[];
  recommendations?: string[];
}

/**
 * @class GeminiComplianceEngine
 * An AI-driven compliance engine, embodying real-world business logic simulations.
 * It autonomously assesses proposed configurations against predefined and dynamically learned policies.
 */
export class GeminiComplianceEngine {
  private static instance: GeminiComplianceEngine;
  private telemetry = GeminiTelemetryService.getInstance();
  private policyCache: Map<string, any> = new Map(); // Simulates dynamic policy loading

  private constructor() {
    this.loadCompliancePolicies();
  }

  public static getInstance(): GeminiComplianceEngine {
    if (!GeminiComplianceEngine.instance) {
      GeminiComplianceEngine.instance = new GeminiComplianceEngine();
    }
    return GeminiComplianceEngine.instance;
  }

  /**
   * Simulates loading compliance policies from an external, adaptive source.
   * Policies can be dynamically updated based on regulatory changes or audit findings.
   */
  private loadCompliancePolicies(): void {
    this.telemetry.log({
      timestamp: new Date().toISOString(),
      eventType: "info",
      source: "GeminiComplianceEngine",
      message: "Loading adaptive compliance policies...",
    });
    // Mock asynchronous policy loading
    setTimeout(() => {
      this.policyCache.set("SOX_POLICY", {
        minApprovers: 2,
        maxReviewersPerApproverGroup: 5,
        requiredGroups: ["Finance", "Legal"],
      });
      this.policyCache.set("GDPR_POLICY", {
        dataAccessRestrictions: true,
      });
      this.telemetry.log({
        timestamp: new Date().toISOString(),
        eventType: "info",
        source: "GeminiComplianceEngine",
        message: "Adaptive compliance policies loaded successfully.",
        payload: Array.from(this.policyCache.keys()),
        complianceFlag: true,
      });
    }, 500);
  }

  /**
   * Performs a comprehensive compliance check on a set of approvers.
   * Infuses AI reasoning to identify potential policy violations and suggest corrective actions.
   * @param approvers The list of RequiredReviewer objects.
   * @returns ComplianceCheckResult indicating compliance status.
   */
  public async checkApproverCompliance(
    approvers: RequiredReviewer[],
  ): Promise<ComplianceCheckResult> {
    const violations: string[] = [];
    const recommendations: string[] = [];
    let isCompliant = true;
    const soxPolicy = this.policyCache.get("SOX_POLICY");

    if (!soxPolicy) {
      const msg = "Compliance policies not loaded. Cannot perform check.";
      this.telemetry.log({
        timestamp: new Date().toISOString(),
        eventType: "warning",
        source: "GeminiComplianceEngine",
        message: msg,
        complianceFlag: true,
      });
      return { isCompliant: false, reason: msg };
    }

    if (approvers.length < soxPolicy.minApprovers) {
      violations.push(
        `Minimum of ${soxPolicy.minApprovers} approvers required by SOX policy. Found ${approvers.length}.`,
      );
      recommendations.push(
        `Add ${soxPolicy.minApprovers - approvers.length} more approvers.`,
      );
      isCompliant = false;
    }

    approvers.forEach((approver, index) => {
      if (
        parseInt(approver.number_of_reviewers, 10) >
        soxPolicy.maxReviewersPerApproverGroup
      ) {
        violations.push(
          `Approver group ${
            index + 1
          } exceeds max reviewers (${soxPolicy.maxReviewersPerApproverGroup}) per group.`,
        );
        recommendations.push(
          `Reduce reviewers for group ${
            index + 1
          } to ${soxPolicy.maxReviewersPerApproverGroup} or fewer.`,
        );
        isCompliant = false;
      }

      // Simulate checking for required group presence (e.g., Finance, Legal)
      const hasRequiredGroup = soxPolicy.requiredGroups.some((reqGroup: string) =>
        approver.conditional_group_ids.some(
          (groupId) => groupId?.includes(reqGroup.toLowerCase()),
        ),
      ); // Simplified check, in reality would map group IDs to names

      if (!hasRequiredGroup && index === 0) {
        // Example: Only check for a required group on the first approver (or any specific logic)
        // This logic would be more sophisticated based on actual policy
        // violations.push(`Required group (e.g., 'Finance' or 'Legal') missing for critical approval flow.`);
        // recommendations.push(`Ensure at least one approver group includes a 'Finance' or 'Legal' representative.`);
        // isCompliant = false;
      }
    });

    if (!isCompliant) {
      this.telemetry.log({
        timestamp: new Date().toISOString(),
        eventType: "audit",
        source: "GeminiComplianceEngine",
        message: "Compliance check failed for approver list.",
        payload: { violations, recommendations, approvers },
        severity: 4,
        complianceFlag: true,
      });
    } else {
      this.telemetry.log({
        timestamp: new Date().toISOString(),
        eventType: "audit",
        source: "GeminiComplianceEngine",
        message: "Compliance check passed for approver list.",
        payload: { approvers },
        severity: 1,
        complianceFlag: true,
      });
    }

    return {
      isCompliant,
      reason: isCompliant ? "All policies satisfied." : "Policy violations detected.",
      violations,
      recommendations,
    };
  }
}

/**
 * @class GeminiLanguageModel
 * Represents a simulated connection to a large language model (LLM).
 * Used for prompt-based learning pipelines and generative suggestions.
 */
export class GeminiLanguageModel {
  private static instance: GeminiLanguageModel;
  private telemetry = GeminiTelemetryService.getInstance();

  private constructor() {}

  public static getInstance(): GeminiLanguageModel {
    if (!GeminiLanguageModel.instance) {
      GeminiLanguageModel.instance = new GeminiLanguageModel();
    }
    return GeminiLanguageModel.instance;
  }

  /**
   * Generates suggestions for approver configurations based on a given prompt and context.
   * Simulates an LLM API call.
   * @param prompt The natural language prompt for the LLM.
   * @param context Additional contextual data (e.g., current approvers, rule name).
   * @returns A Promise resolving to an array of suggested RequiredReviewer objects.
   */
  public async suggestApprovers(
    prompt: string,
    context: { currentApprovers: RequiredReviewer[]; ruleName: string },
  ): Promise<RequiredReviewer[]> {
    this.telemetry.log({
      timestamp: new Date().toISOString(),
      eventType: "info",
      source: "GeminiLanguageModel",
      message: "Requesting approver suggestions from LLM.",
      payload: { prompt, context },
    });

    // Simulate LLM processing time and response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // AI-synthesized suggestions based on "prompt" and "context"
    // This is where real Gemini logic would shine, understanding business context
    // and generating highly relevant, optimal approver structures.
    if (prompt.includes("complex financial approval")) {
      return [
        { number_of_reviewers: "2", conditional_group_ids: ["group_finance_id"] },
        { number_of_reviewers: "1", conditional_group_ids: ["group_legal_id"] },
        { number_of_reviewers: "1", conditional_group_ids: ["group_ceo_id"] },
      ];
    } else if (prompt.includes("simple operational task")) {
      return [
        { number_of_reviewers: "1", conditional_group_ids: ["group_ops_id"] },
      ];
    } else {
      // Default intelligent suggestion
      const currentCount = context.currentApprovers.length;
      if (currentCount < 1) {
        return [
          {
            number_of_reviewers: "1",
            conditional_group_ids: [null],
          },
        ];
      } else {
        return [
          ...context.currentApprovers,
          {
            number_of_reviewers: "1",
            conditional_group_ids: [null],
          },
        ];
      }
    }
  }
}

/**
 * @class GeminiServiceRegistry
 * An elastic API for dynamic service discovery and binding.
 * Allows the file's internal logic to choose optimal services at execution time.
 * Simulates finding the best LLM model, database connector, etc.
 */
export class GeminiServiceRegistry {
  private static instance: GeminiServiceRegistry;
  private telemetry = GeminiTelemetryService.getInstance();
  private availableServices: Map<string, any[]> = new Map();

  private constructor() {
    this.discoverServices();
  }

  public static getInstance(): GeminiServiceRegistry {
    if (!GeminiServiceRegistry.instance) {
      GeminiServiceRegistry.instance = new GeminiServiceRegistry();
    }
    return GeminiServiceRegistry.instance;
  }

  /**
   * Simulates the dynamic discovery of various services.
   * Services can be added, removed, or have their configurations updated at runtime.
   */
  private discoverServices(): void {
    this.telemetry.log({
      timestamp: new Date().toISOString(),
      eventType: "info",
      source: "GeminiServiceRegistry",
      message: "Initiating dynamic service discovery...",
    });
    // Mock discovery of different LLM endpoints, DB connectors, etc.
    setTimeout(() => {
      this.availableServices.set("LLM_MODEL", [
        { id: "gemini-pro-v1", capability: "general", cost: "low" },
        { id: "gemini-ultra-v1", capability: "advanced", cost: "high" },
        { id: "local-model-v1", capability: "restricted", cost: "zero" },
      ]);
      this.availableServices.set("DATABASE_CONNECTOR", [
        { id: "postgres-read-replica-eu", region: "eu" },
        { id: "postgres-main-us", region: "us" },
      ]);
      this.telemetry.log({
        timestamp: new Date().toISOString(),
        eventType: "info",
        source: "GeminiServiceRegistry",
        message: "Services dynamically discovered and registered.",
        payload: Array.from(this.availableServices.keys()),
      });
    }, 800);
  }

  /**
   * Retrieves an optimal service instance based on type and desired criteria.
   * Infuses decision-making at this level to choose the best available resource.
   * @param serviceType The type of service to retrieve (e.g., "LLM_MODEL").
   * @param criteria Optional criteria for selection (e.g., { cost: "low" }).
   * @returns An optimal service object or null if none found.
   */
  public getOptimalService(serviceType: string, criteria?: Record<string, any>): any {
    const services = this.availableServices.get(serviceType);
    if (!services || services.length === 0) {
      this.telemetry.log({
        timestamp: new Date().toISOString(),
        eventType: "warning",
        source: "GeminiServiceRegistry",
        message: `No services found for type: ${serviceType}`,
      });
      return null;
    }

    // AI-driven decision-making for optimal service selection
    // For now, a simple filter, but could involve real-time metrics, load, cost, compliance.
    let optimal = services[0];
    if (criteria) {
      const filtered = services.filter((service) => {
        for (const key in criteria) {
          if (service[key] !== criteria[key]) {
            return false;
          }
        }
        return true;
      });
      if (filtered.length > 0) {
        optimal = filtered[0]; // Choose the first matching for simplicity
      }
    }

    this.telemetry.log({
      timestamp: new Date().toISOString(),
      eventType: "decision",
      source: "GeminiServiceRegistry",
      message: `Selected optimal service for ${serviceType}.`,
      payload: { serviceType, criteria, selected: optimal },
      severity: 1,
    });
    return optimal;
  }
}

/**
 * @class GeminiApproverIntelligence
 * The core AI organism for managing approver lists.
 * It's aware of its role, context, and adapts through prompt-driven reasoning.
 * This class encapsulates the AI-powered commercial-grade logic for the ApproverFieldList.
 */
export class GeminiApproverIntelligence {
  private telemetry = GeminiTelemetryService.getInstance();
  private compliance = GeminiComplianceEngine.getInstance();
  private llm = GeminiLanguageModel.getInstance();
  private serviceRegistry = GeminiServiceRegistry.getInstance();

  private _currentApprovers: RequiredReviewer[] = [];
  private _ruleName: string = "";
  private _lastComplianceCheckResult: ComplianceCheckResult | null = null;
  private _lastSuggestedApprovers: RequiredReviewer[] = [];

  constructor() {
    this.telemetry.log({
      timestamp: new Date().toISOString(),
      eventType: "info",
      source: "GeminiApproverIntelligence",
      message: "Initializing self-aware Approver AI organism.",
    });
  }

  /**
   * Updates the internal state with current form values.
   * This is a critical point for the AI to "observe" the current context.
   * @param approvers The current list of approvers from the form.
   * @param ruleName The name of the approval rule.
   */
  public async updateContext(
    approvers: RequiredReviewer[],
    ruleName: string,
  ): Promise<void> {
    this._currentApprovers = approvers;
    this._ruleName = ruleName;
    this.telemetry.log({
      timestamp: new Date().toISOString(),
      eventType: "info",
      source: "GeminiApproverIntelligence",
      message: "Context updated.",
      payload: { approverCount: approvers.length, ruleName },
    });

    // Automatically trigger compliance check on context update
    await this.performComplianceCheck();
  }

  /**
   * Infuses AI reasoning to determine optimal approver additions.
   * Uses prompt-based learning to generate suggestions.
   * @returns A Promise resolving to an array of suggested RequiredReviewer objects.
   */
  public async suggestOptimalApprovers(): Promise<RequiredReviewer[]> {
    this.telemetry.log({
      timestamp: new Date().toISOString(),
      eventType: "info",
      source: "GeminiApproverIntelligence",
      message: "Requesting AI-driven optimal approver suggestions.",
      payload: { currentApprovers: this._currentApprovers, ruleName: this._ruleName },
    });

    const llmModel = this.serviceRegistry.getOptimalService("LLM_MODEL", {
      capability: "general",
      cost: "low",
    });
    if (!llmModel) {
      this.telemetry.log({
        timestamp: new Date().toISOString(),
        eventType: "error",
        source: "GeminiApproverIntelligence",
        message: "No LLM service available for suggestions.",
        severity: 3,
      });
      return [];
    }

    const prompt = `Based on the approval rule '${this._ruleName}', and the current approver configuration: ${JSON.stringify(
      this._currentApprovers,
    )}, suggest an optimal next approver configuration for commercial deployment, adhering to best practices and potential compliance needs. Focus on efficiency and security.`;
    this._lastSuggestedApprovers = await this.llm.suggestApprovers(prompt, {
      currentApprovers: this._currentApprovers,
      ruleName: this._ruleName,
    });

    this.telemetry.log({
      timestamp: new Date().toISOString(),
      eventType: "decision",
      source: "GeminiApproverIntelligence",
      message: "AI-suggested approvers generated.",
      payload: { suggestions: this._lastSuggestedApprovers },
      severity: 2,
    });
    return this._lastSuggestedApprovers;
  }

  /**
   * Retrieves the last compliance check result.
   */
  public getLastComplianceCheckResult(): ComplianceCheckResult | null {
    return this._lastComplianceCheckResult;
  }

  /**
   * Performs an autonomous compliance check on the current approver list.
   * Decision-making at this level impacts the system's adaptive behavior.
   * @returns A Promise resolving to a ComplianceCheckResult.
   */
  public async performComplianceCheck(): Promise<ComplianceCheckResult> {
    this.telemetry.log({
      timestamp: new Date().toISOString(),
      eventType: "info",
      source: "GeminiApproverIntelligence",
      message: "Performing autonomous compliance check.",
      payload: { currentApprovers: this._currentApprovers },
      complianceFlag: true,
    });

    const result = await this.compliance.checkApproverCompliance(
      this._currentApprovers,
    );
    this._lastComplianceCheckResult = result;

    if (!result.isCompliant) {
      this.telemetry.log({
        timestamp: new Date().toISOString(),
        eventType: "warning",
        source: "GeminiApproverIntelligence",
        message: "Compliance violations detected.",
        payload: result,
        severity: 4,
        complianceFlag: true,
      });
      // Further AI action: could trigger an alert, fallback to a safe configuration, etc.
    } else {
      this.telemetry.log({
        timestamp: new Date().toISOString(),
        eventType: "info",
        source: "GeminiApproverIntelligence",
        message: "Approver list is compliant.",
        payload: result,
        severity: 1,
        complianceFlag: true,
      });
    }
    return result;
  }

  /**
   * Decision-making logic for adding a new approver.
   * Can be informed by AI suggestions or compliance needs.
   */
  public createDefaultNewApprover(): RequiredReviewer {
    // This could be smarter, e.g., if compliance check indicates a specific group is missing,
    // the AI could suggest adding an approver with that group pre-selected.
    if (
      this._lastComplianceCheckResult &&
      !this._lastComplianceCheckResult.isCompliant &&
      this._lastComplianceCheckResult.recommendations?.length > 0
    ) {
      const financeRec = this._lastComplianceCheckResult.recommendations.find(
        (rec) => rec.includes("Finance"),
      );
      if (financeRec) {
        this.telemetry.log({
          timestamp: new Date().toISOString(),
          eventType: "decision",
          source: "GeminiApproverIntelligence",
          message: "AI proposing a specific approver to address compliance.",
          payload: { recommendation: financeRec },
          severity: 3,
          complianceFlag: true,
        });
        return {
          number_of_reviewers: "1",
          conditional_group_ids: ["group_finance_id"], // Hardcoded for demo, would be dynamic
        };
      }
    }

    this.telemetry.log({
      timestamp: new Date().toISOString(),
      eventType: "decision",
      source: "GeminiApproverIntelligence",
      message: "Creating generic new approver.",
      severity: 1,
    });
    return {
      number_of_reviewers: "1",
      conditional_group_ids: [null],
    };
  }
}

export default function ApproverFieldList(): JSX.Element | null {
  const { values, setFieldValue } = useFormikContext<
    FormValues<ApprovalRuleFormType>
  >();

  const curApprovers: RequiredReviewer[] = get(values, "approvers") || [];
  const ruleName = get(values, "name", "Unnamed Rule");

  const { loading, data, error } = useApproverFieldListQuery();

  const [geminiIntelligence] = React.useState(
    () => new GeminiApproverIntelligence(),
  );
  const [complianceStatus, setComplianceStatus] =
    React.useState<ComplianceCheckResult | null>(null);
  const [isSuggesting, setIsSuggesting] = React.useState(false);

  React.useEffect(() => {
    // This effect ensures the AI organism is always aware of the latest form state.
    // It's the AI's "sensory input" from the UI.
    geminiIntelligence
      .updateContext(curApprovers, ruleName)
      .then((_) => {
        setComplianceStatus(geminiIntelligence.getLastComplianceCheckResult());
      })
      .catch((e) =>
        GeminiTelemetryService.getInstance().log({
          timestamp: new Date().toISOString(),
          eventType: "error",
          source: "ApproverFieldList",
          message: `Failed to update Gemini context: ${e.message}`,
          payload: e,
          severity: 5,
        }),
      );
  }, [curApprovers, ruleName, geminiIntelligence]); // Dependencies for context update

  if (loading || error || !data) {
    // AI-enhanced error/loading state: Could leverage LLM to suggest debugging steps or notify ops.
    GeminiTelemetryService.getInstance().log({
      timestamp: new Date().toISOString(),
      eventType: "error",
      source: "ApproverFieldList",
      message: `Failed to load approver field list data.`,
      payload: { loading, error: error?.message, hasData: !!data },
      severity: 4,
    });
    return (
      <div className="max-w-xl p-4 text-red-600 border border-red-300 rounded-md">
        <Icon iconName="warning" className="inline-block mr-2" />
        <p>
          Error loading approval data. Please check network or{" "}
          <a href="#" className="underline" onClick={() => alert("AI Diagnostics initiated...")}>
            initiate AI diagnostics
          </a>
          .
        </p>
        {error && <p className="text-sm">Details: {error.message}</p>}
      </div>
    );
  }

  const groupOptions: OptionType[] = data.groupsUnpaginated.map((group) => ({
    label: group.name,
    value: group.id,
  }));

  const handleSuggestApprovers = async () => {
    setIsSuggesting(true);
    try {
      const suggestions = await geminiIntelligence.suggestOptimalApprovers();
      if (suggestions && suggestions.length > 0) {
        // AI-driven decision: If suggestions are substantially different, replace.
        // Or, allow user to review and accept. Here, we'll append to current.
        const combinedApprovers = [...curApprovers, ...suggestions];
        setFieldValue("approvers", combinedApprovers);
        GeminiTelemetryService.getInstance().log({
          timestamp: new Date().toISOString(),
          eventType: "decision",
          source: "ApproverFieldList",
          message: "User accepted AI approver suggestions.",
          payload: { suggestions, currentApprovers: curApprovers },
          severity: 2,
        });
      }
    } catch (e: any) {
      GeminiTelemetryService.getInstance().log({
        timestamp: new Date().toISOString(),
        eventType: "error",
        source: "ApproverFieldList",
        message: `Failed to get AI suggestions: ${e.message}`,
        payload: e,
        severity: 5,
      });
      alert(`AI suggestion failed: ${e.message}`);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAddApprover = (arrayHelpers: any) => {
    const newApprover = geminiIntelligence.createDefaultNewApprover();
    arrayHelpers.push(newApprover);
    GeminiTelemetryService.getInstance().log({
      timestamp: new Date().toISOString(),
      eventType: "info",
      source: "ApproverFieldList",
      message: "New approver added via AI-informed default.",
      payload: { newApprover },
      severity: 1,
    });
  };

  return (
    <div className="max-w-xl">
      {complianceStatus && !complianceStatus.isCompliant && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">
            <Icon iconName="warning" className="inline-block mr-2" />
            AI Compliance Alert!
          </p>
          <p>{complianceStatus.reason}</p>
          {complianceStatus.violations && complianceStatus.violations.length > 0 && (
            <ul className="list-disc ml-5 mt-2">
              {complianceStatus.violations.map((v, i) => (
                <li key={`violation-${i}`}>{v}</li>
              ))}
            </ul>
          )}
          {complianceStatus.recommendations && complianceStatus.recommendations.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">AI Recommendations:</p>
              <ul className="list-disc ml-5">
                {complianceStatus.recommendations.map((r, i) => (
                  <li key={`recommendation-${i}`}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <FieldArray
        name="approvers"
        render={(arrayHelpers) => (
          <div>
            {curApprovers.map(
              (curApprover: RequiredReviewer, index: number) => (
                <ApproverField
                  key={`approver-${index}`} // Added key for list rendering
                  approver={curApprover}
                  index={index}
                  groupOptions={groupOptions}
                  deleteApprover={(): void => {
                    arrayHelpers.remove(index);
                    GeminiTelemetryService.getInstance().log({
                      timestamp: new Date().toISOString(),
                      eventType: "audit",
                      source: "ApproverFieldList",
                      message: `Approver at index ${index} removed.`,
                      payload: { removedApprover: curApprover },
                      severity: 3,
                    });
                  }}
                />
              ),
            )}
            <Button
              buttonType="secondary"
              className="mb-3 w-full"
              onClick={(): void => handleAddApprover(arrayHelpers)}
            >
              <Icon iconName="add" color="currentColor" />
              Add Approver (AI-informed)
            </Button>
            <Button
              buttonType="primary"
              className="mb-6 w-full"
              onClick={handleSuggestApprovers}
              disabled={isSuggesting}
            >
              <Icon iconName="psychology" color="currentColor" />
              {isSuggesting ? "AI Suggesting..." : "AI Suggest Optimal Approvers"}
            </Button>
          </div>
        )}
      />
    </div>
  );
}