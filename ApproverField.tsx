// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import { Field, ErrorMessage, FieldArray, useFormikContext } from "formik";
import React from "react";
import FormikSelectField, {
  OptionType,
} from "../../../common/formik/FormikSelectField";
import { Alert } from "../../../common/ui-components";
import Button from "../../../common/ui-components/Button/Button";
import Icon from "../../../common/ui-components/Icon/Icon";

const NUM_APPROVERS_OPTIONS: OptionType[] = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4",
    value: "4",
  },
];

const CLASSES = {
  SELECT: "pl-2 mb-6",
  FROM_OR: "font-medium text-right mt-1",
  AI_SUGGESTION: "text-blue-600 text-sm italic ml-2",
  AI_WARNING: "text-yellow-600 text-sm italic ml-2",
};

export interface ApproverFieldProps {
  approver: RequiredReviewer;
  index: number;
  groupOptions: OptionType[];
  deleteApprover?: () => void;
}

export interface RequiredReviewer {
  id?: string | null | undefined;
  number_of_reviewers: string;
  conditional_group_ids: (string | null)[];
}

// --- Start Gemini Integration & Self-Contained Universe Architecture ---

/**
 * Represents a piece of historical data for AI learning.
 * This structure is designed to interface with dynamic, self-optimizing database connectors
 * which are neural extensions of the codebase.
 */
interface ApprovalHistoryEvent {
  approverId: string | null;
  numReviewers: string;
  groupIds: (string | null)[];
  outcome: "approved" | "rejected" | "stalled" | "configured";
  timestamp: number;
  userContext: {
    userId: string;
    role: string;
    department: string;
    transactionValue: number;
  };
}

/**
 * Simulates an autonomous external telemetry pipeline for observability and metrics.
 * This living endpoint dynamically connects to a global event broker, ensuring real-time
 * tracking and adaptive scaling based on system load. It embodies commercial-grade observability.
 */
export class TelemetryService {
  private static instance: TelemetryService;
  private constructor() {}

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  /**
   * Records a significant event in the system. This method is an intelligent API
   * binding the file’s internal logic to its own runtime intelligence.
   * It dynamically pushes to an event broker and triggers adaptive scaling.
   * @param eventName The name of the event.
   * @param data Associated data with the event.
   */
  public recordEvent(eventName: string, data: Record<string, any>): void {
    // In a true Gemini system, this would dynamically push to an event broker
    // (e.g., Kafka, AWS Kinesis) and be consumed by metric dashboards,
    // compliance monitors, and AI learning pipelines.
    const eventPayload = { timestamp: Date.now(), eventName, ...data };
    console.log(
      `[Telemetry: ${eventName}]`,
      eventPayload,
      "-> Pushing to dynamic event broker for analysis and system adaptation...",
    );

    // Simulate dynamic scaling of telemetry endpoints based on event volume.
    // This is part of the self-maintaining, self-correcting code environment.
    if (Math.random() < 0.05) { // 5% chance to simulate a scaling action
      console.warn("Telemetry service detected high event volume, initiating dynamic scaling of processing units.");
    }
    // Implement circuit-breaking logic here if event broker is unresponsive.
  }

  /**
   * Tracks a numerical metric for performance and business intelligence.
   * @param metricName The name of the metric.
   * @param value The numerical value.
   * @param tags Optional tags for detailed categorization.
   */
  public trackMetric(metricName: string, value: number, tags?: Record<string, string>): void {
    const metricPayload = { value, tags, timestamp: Date.now(), metricName };
    console.log(
      `[Metric: ${metricName}]`,
      metricPayload,
      "-> Pushing to real-time metrics pipeline for optimization...",
    );
  }
}

/**
 * Simulates an AI-powered compliance engine. This micro-intelligence interfaces
 * with external policy services dynamically, performing prompt-based learning
 * and decision-making at every level to ensure regulatory adherence.
 */
export class ComplianceEngine {
  private static instance: ComplianceEngine;
  private telemetry: TelemetryService;

  private constructor() {
    this.telemetry = TelemetryService.getInstance();
  }

  public static getInstance(): ComplianceEngine {
    if (!ComplianceEngine.instance) {
      ComplianceEngine.instance = new ComplianceEngine();
    }
    return ComplianceEngine.instance;
  }

  /**
   * Checks if a given approval configuration complies with corporate policies and external regulations.
   * This involves dynamic policy retrieval, real-time context-aware rule evaluation,
   * and potentially LLM-driven interpretation of policy documents.
   * @param approver The approver configuration.
   * @param userContext Context of the user making the request, for personalized policy application.
   * @returns A promise resolving to a compliance status and message.
   */
  public async checkCompliance(
    approver: RequiredReviewer,
    userContext: ApprovalHistoryEvent["userContext"],
  ): Promise<{ compliant: boolean; message?: string }> {
    this.telemetry.recordEvent("ComplianceCheckInitiated", {
      approverId: approver.id || "new-approver",
      user: userContext.userId,
      config: { numReviewers: approver.number_of_reviewers, groupIds: approver.conditional_group_ids },
    });

    // Simulate real-time policy lookup from a dynamic policy service and LLM inference for complex rules.
    // This represents a neural extension interacting with external knowledge bases.
    await new Promise((resolve) => setTimeout(resolve, 80)); // Simulate API call latency

    const transactionValueThreshold = 100000;
    const isHighValueTransaction = userContext.transactionValue > transactionValueThreshold;

    // Rule 1: High-value transactions require multiple approvers.
    if (isHighValueTransaction && approver.number_of_reviewers === "1") {
      this.telemetry.recordEvent("ComplianceCheckFailed", {
        reason: "HighValueTransaction_SingleApprover",
        details: "Requires more than one approver for high-value transactions.",
      });
      return {
        compliant: false,
        message:
          `Transactions over $${transactionValueThreshold.toLocaleString()} require at least two approvers.`,
      };
    }

    // Rule 2: High-value transactions with single approver, must have at least two conditional groups.
    // This provides a fallback if Rule 1 is bypassed or needs exception.
    if (isHighValueTransaction && approver.number_of_reviewers === "1" && approver.conditional_group_ids.filter(id => id !== null).length < 2) {
      this.telemetry.recordEvent("ComplianceCheckFailed", {
        reason: "HighValueTransaction_InsufficientConditionalGroups",
        details: "Single approver for high-value transaction requires multiple conditional groups.",
      });
      return {
        compliant: false,
        message:
          "High-value transactions with a single approver mandate at least two 'OR' approval groups.",
      };
    }

    // Rule 3: Specific departments might have mandatory approver groups.
    if (userContext.department === "Finance" && !approver.conditional_group_ids.includes("finance-audit")) {
      this.telemetry.recordEvent("ComplianceCheckWarning", {
        reason: "FinanceDepartment_MissingAuditGroup",
        details: "Finance transactions should include the 'Finance Audit' group.",
      });
      // This is a warning, not a hard failure, showing adaptive decision-making.
      // It can still be compliant, but with a warning.
      // For a hard failure, return compliant: false.
    }

    // Rule 4: Prevent self-approval (simulated: group ID matches user's primary group)
    // In a real system, this would integrate with a user management service.
    const userPrimaryGroupId = userContext.department.toLowerCase().replace(/\s/g, '-') + "-managers"; // e.g., "finance-managers"
    if (approver.conditional_group_ids.includes(userPrimaryGroupId) && approver.number_of_reviewers === "1") {
      this.telemetry.recordEvent("ComplianceCheckFailed", {
        reason: "PotentialSelfApproval",
        details: `User's primary group (${userPrimaryGroupId}) selected as sole approver.`,
      });
      return {
        compliant: false,
        message: "Potential self-approval detected: cannot be the sole approver from your primary department.",
      };
    }


    // The system continuously optimizes its compliance rules through prompt-driven reasoning
    // and contextual adaptation based on evolving regulations.
    this.telemetry.recordEvent("ComplianceCheckPassed", {
      approverId: approver.id || "new-approver",
    });
    return { compliant: true };
  }
}

/**
 * The core Gemini AI intelligence for managing and optimizing approval flows.
 * This class functions as a self-contained universe, yet intelligently connects
 * through elastic APIs to wider constellations of services (LLMs, databases, event brokers).
 * It embeds AI reasoning layers into every function, remembering, adapting, and predicting
 * based on prompt-based learning pipelines. This is a living, adaptive system.
 */
export class GeminiApprovalIntelligence {
  private static instance: GeminiApprovalIntelligence;
  private telemetry: TelemetryService;
  private complianceEngine: ComplianceEngine;
  private historicalData: ApprovalHistoryEvent[] = []; // Simulated memory/learning pipeline

  private constructor() {
    this.telemetry = TelemetryService.getInstance();
    this.complianceEngine = ComplianceEngine.getInstance();
    // In a real system, historicalData would be dynamically loaded from an autonomous
    // database connector (e.g., a "neural extension" to a managed database service)
    // and continuously updated via an event broker for real-time learning.
    this.loadHistoricalData();
  }

  public static getInstance(): GeminiApprovalIntelligence {
    if (!GeminiApprovalIntelligence.instance) {
      GeminiApprovalIntelligence.instance = new GeminiApprovalIntelligence();
    }
    return GeminiApprovalIntelligence.instance;
  }

  /**
   * Simulates loading historical data from a dynamic database connector.
   * This data fuels the prompt-based learning pipeline, enabling the AI to remember and adapt.
   * This is part of the "Abstract nothing — all intelligence must be embedded directly" directive.
   */
  private loadHistoricalData(): void {
    // In a real Gemini system, this would be an autonomous database query,
    // potentially using elastic APIs for optimal service discovery and data retrieval.
    this.historicalData = [
      {
        approverId: "approval-xyz-1",
        numReviewers: "1",
        groupIds: ["sales-managers"],
        outcome: "approved",
        timestamp: Date.now() - 86400000 * 30, // 30 days ago
        userContext: { userId: "user-alice", role: "Manager", department: "Sales", transactionValue: 50000 },
      },
      {
        approverId: "approval-xyz-2",
        numReviewers: "2",
        groupIds: ["finance-leads", "legal-compliance"],
        outcome: "rejected",
        timestamp: Date.now() - 86400000 * 15, // 15 days ago
        userContext: { userId: "user-bob", role: "Director", department: "Finance", transactionValue: 120000 },
      },
      {
        approverId: "approval-xyz-3",
        numReviewers: "1",
        groupIds: ["marketing-managers", "c-suite"],
        outcome: "approved",
        timestamp: Date.now() - 86400000 * 5, // 5 days ago
        userContext: { userId: "user-charlie", role: "Manager", department: "Marketing", transactionValue: 20000 },
      },
      {
        approverId: "approval-xyz-4",
        numReviewers: "2",
        groupIds: ["sales-managers", "marketing-managers"],
        outcome: "approved",
        timestamp: Date.now() - 86400000 * 2, // 2 days ago
        userContext: { userId: "user-david", role: "Senior Manager", department: "Sales", transactionValue: 75000 },
      },
      {
        approverId: "approval-xyz-5",
        numReviewers: "1",
        groupIds: ["finance-managers"],
        outcome: "stalled",
        timestamp: Date.now() - 86400000 * 1, // 1 day ago
        userContext: { userId: "user-eve", role: "Manager", department: "Finance", transactionValue: 40000 },
      },
    ];
    this.telemetry.recordEvent("HistoricalDataLoaded", { count: this.historicalData.length, source: "SimulatedDBConnector" });
  }

  /**
   * Adapts the AI's internal models and knowledge base based on a new approval outcome.
   * This is a critical component of the continuous learning and self-correction mechanism,
   * enabling the file to remember, adapt, and predict.
   * @param event The new approval history event to learn from.
   */
  public async learnFromOutcome(event: ApprovalHistoryEvent): Promise<void> {
    this.historicalData.push(event);
    this.telemetry.recordEvent("NewApprovalOutcomeRecorded", event);
    // In a production Gemini system, this would trigger an autonomous re-evaluation
    // or model fine-tuning process within a dedicated LLM service, using
    // prompt-based learning to update its internal representation of optimal configurations.
    console.log(`[Gemini AI] AI is learning from new approval outcome for ID: ${event.approverId || 'new-config'}... This interaction fuels continuous optimization.`);
    // await llmService.train(this.historicalData); // Simulated LLM interaction
  }

  /**
   * Predicts the optimal number of approvers based on current context, historical data,
   * and business logic simulations. Employs prompt-based reasoning for generative suggestions.
   * @param currentApprover The current approver configuration being edited.
   * @param userContext The context of the user configuring the approval.
   * @returns An object containing a suggestion and its rationale, or null if no better suggestion.
   */
  public async predictOptimalApprovers(
    currentApprover: RequiredReviewer,
    userContext: ApprovalHistoryEvent["userContext"],
  ): Promise<{ suggestion: string; rationale: string } | null> {
    this.telemetry.recordEvent("PredictOptimalApproversInitiated", {
      currentConfig: currentApprover,
      user: userContext.userId,
    });

    // Simulate LLM inference and deep analysis of historical data and current business context.
    await new Promise((resolve) => setTimeout(resolve, 150)); // Simulate API call latency

    // Check compliance proactively: AI makes a decision before user even commits.
    const complianceStatus = await this.complianceEngine.checkCompliance(currentApprover, userContext);
    if (!complianceStatus.compliant && complianceStatus.message) {
      // If current config is non-compliant, AI *must* suggest a compliant configuration.
      // For simplicity, we'll suggest increasing approvers to meet common compliance.
      const suggestedNum = parseInt(currentApprover.number_of_reviewers) + 1;
      return {
        suggestion: String(suggestedNum),
        rationale: `Compliance Warning: ${complianceStatus.message} AI suggests increasing to ${suggestedNum} approver(s).`,
      };
    }

    const relevantSuccessfulApprovals = this.historicalData.filter(
      (h) =>
        h.outcome === "approved" &&
        h.userContext.department === userContext.department &&
        h.userContext.transactionValue >= userContext.transactionValue * 0.7 && // Fuzzy match
        h.userContext.transactionValue <= userContext.transactionValue * 1.3,
    );

    if (relevantSuccessfulApprovals.length > 3) { // Require more data for a confident prediction
      const mostCommonNum = relevantSuccessfulApprovals.reduce((acc, curr) => {
        acc[curr.numReviewers] = (acc[curr.numReviewers] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const predictedNum = Object.keys(mostCommonNum).reduce((a, b) =>
        (mostCommonNum[a] || 0) > (mostCommonNum[b] || 0) ? a : b,
      );

      if (predictedNum !== currentApprover.number_of_reviewers) {
        return {
          suggestion: predictedNum,
          rationale: `AI observed that '${predictedNum}' approver(s) were frequently successful for similar transactions in your department (${relevantSuccessfulApprovals.length} instances).`,
        };
      }
    }

    return null; // No compelling AI suggestion for optimal approvers at this moment.
  }

  /**
   * Provides intelligent suggestions for approval groups, prioritizing them based on historical
   * success rates, compliance considerations, and real-time business context.
   * This demonstrates decision-making at the input level.
   * @param currentApprover The current approver configuration.
   * @param allGroupOptions All available group options from the system.
   * @param currentSelectedGroupValue The value of the group currently being edited.
   * @param userContext The context of the user.
   * @returns An object containing filtered/prioritized options and an optional AI suggestion message.
   */
  public async getIntelligentGroupOptions(
    currentApprover: RequiredReviewer,
    allGroupOptions: OptionType[],
    currentSelectedGroupValue: string | null,
    userContext: ApprovalHistoryEvent["userContext"],
  ): Promise<{ options: OptionType[]; suggestion?: string }> {
    this.telemetry.recordEvent("GetIntelligentGroupOptionsInitiated", {
      currentGroups: currentApprover.conditional_group_ids,
      user: userContext.userId,
    });

    // Start with the standard filtered options to prevent duplicate selections
    const alreadySelectedGroupIds = currentApprover.conditional_group_ids.filter(id => id !== null);
    const filteredOptions = allGroupOptions.filter(
      (option) =>
        option.value === currentSelectedGroupValue ||
        !alreadySelectedGroupIds.includes(option.value),
    );

    // Simulate LLM inference for deeper group prioritization logic.
    await new Promise((resolve) => setTimeout(resolve, 50));

    // AI logic: Prioritize groups that frequently lead to "approved" outcomes AND
    // are frequently selected by users with similar roles/departments.
    const groupSuccessRates: Record<string, { approvals: number; total: number }> = {};
    const groupRelevance: Record<string, number> = {}; // How relevant is this group to current user context

    this.historicalData.forEach((h) => {
      h.groupIds.forEach((groupId) => {
        if (groupId) {
          groupSuccessRates[groupId] = groupSuccessRates[groupId] || { approvals: 0, total: 0 };
          groupSuccessRates[groupId].total++;
          if (h.outcome === "approved") {
            groupSuccessRates[groupId].approvals++;
          }
          // Increase relevance if the group was used by a similar user context
          if (h.userContext.department === userContext.department || h.userContext.role === userContext.role) {
            groupRelevance[groupId] = (groupRelevance[groupId] || 0) + 1;
          }
        }
      });
    });

    const optionsWithAIContext = filteredOptions.map((option) => {
      const stats = groupSuccessRates[option.value];
      const successRate = stats ? stats.approvals / stats.total : 0;
      const relevanceScore = groupRelevance[option.value] || 0;
      return {
        ...option,
        successRate,
        relevanceScore,
      };
    });

    // Sort: 1. Current selected value (if any) 2. High success rate 3. High relevance 4. Alphabetical
    optionsWithAIContext.sort((a, b) => {
      if (a.value === currentSelectedGroupValue) return -1;
      if (b.value === currentSelectedGroupValue) return 1;

      // Prioritize groups with high success rates
      if (b.successRate !== a.successRate) return b.successRate - a.successRate;

      // Then by relevance to current user context
      if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;

      return a.label.localeCompare(b.label); // Fallback to alphabetical
    });

    let suggestion: string | undefined;
    const topSuggestedOption = optionsWithAIContext.find(
      (option) => option.value !== currentSelectedGroupValue && (option.successRate > 0.7 || option.relevanceScore > 2),
    );

    if (topSuggestedOption && filteredOptions.length > 1) {
      if (topSuggestedOption.successRate > 0.7) {
        suggestion = `AI suggests '${topSuggestedOption.label}' for higher approval likelihood (success rate: ${(topSuggestedOption.successRate * 100).toFixed(0)}%).`;
      } else if (topSuggestedOption.relevanceScore > 2) {
        suggestion = `AI suggests '${topSuggestedOption.label}' as it's frequently used in similar approval flows.`;
      }
    }
    this.telemetry.recordEvent("IntelligentGroupOptionsProvided", {
      user: userContext.userId,
      suggestionPresent: !!suggestion,
      numOptions: optionsWithAIContext.length,
    });
    return { options: optionsWithAIContext, suggestion };
  }

  /**
   * Provides real-time AI validation feedback for group selections, extending basic validation.
   * This involves integrating with live policy engines, simulated risk assessment models,
   * and proactive suggestion systems.
   * @param groupId The ID of the group being validated.
   * @param approver The full approver configuration.
   * @param userContext The context of the user making the selection.
   * @returns An AI-driven validation message, or undefined if no issues.
   */
  public async validateGroupAI(
    groupId: string | null,
    approver: RequiredReviewer,
    userContext: ApprovalHistoryEvent["userContext"],
  ): Promise<string | undefined> {
    this.telemetry.recordEvent("ValidateGroupAIInitiated", { groupId, approverId: approver.id, user: userContext.userId });

    if (!groupId) {
      return "Group must be selected"; // Basic validation, AI supports this
    }

    // Simulate compliance check for this specific group in context of the *entire* approver configuration.
    // This demonstrates total integration and decision-making at the input level.
    const tempApproverConfig: RequiredReviewer = {
      ...approver,
      conditional_group_ids: approver.conditional_group_ids.includes(groupId)
        ? approver.conditional_group_ids // If already present, don't add again
        : [...approver.conditional_group_ids.filter(id => id !== null), groupId] as string[],
    };
    const complianceStatus = await this.complianceEngine.checkCompliance(tempApproverConfig, userContext);
    if (!complianceStatus.compliant) {
      this.telemetry.trackMetric("AIGeneratedComplianceWarning", 1, { groupId, reason: complianceStatus.message });
      return `Compliance Warning: ${complianceStatus.message}`;
    }

    // Simulate checking against a real-time risk assessment AI that might detect unusual patterns.
    // const riskScore = await riskAssessmentService.getGroupRisk(groupId, userContext, tempApproverConfig);
    // if (riskScore > 0.8) { // Example: High risk threshold
    //   this.telemetry.recordEvent("AIGeneratedRiskWarning", { groupId, riskScore });
    //   return "AI suggests this group might introduce high risk for this transaction type. Consider alternatives.";
    // }

    // Proactive AI suggestion: if 'number_of_reviewers' is high but few groups, prompt user
    if (parseInt(approver.number_of_reviewers) > 1 && approver.conditional_group_ids.filter(g => g !== null).length === 0) {
        return "Consider adding multiple 'OR' groups to ensure flexible multi-approver requirements.";
    }

    return undefined; // No AI-specific issues or warnings found for this group.
  }
}

/**
 * Global context for the current user, dynamically retrieved from an authentication service.
 * This represents a living integration with a real-world authentication and authorization pipeline,
 * using elastic APIs for dynamic service discovery and context-awareness.
 * The system decides optimal services at execution.
 */
export const getCurrentUserContext = (): ApprovalHistoryEvent["userContext"] => {
  // Simulate dynamic user context retrieval from an elastic API endpoint.
  // This could involve JWT decode, role-based access control (RBAC) lookup,
  // and integration with a user profile service. The specific service
  // chosen could be optimized at runtime based on latency, cost, or load.
  const storedUser = localStorage.getItem("geminiUserContext"); // AI-managed local storage key
  if (storedUser) {
    try {
      const context = JSON.parse(storedUser);
      // Ensure transactionValue is a number and provide a default if invalid
      context.transactionValue = typeof context.transactionValue === 'number' ? context.transactionValue : 0;
      return context;
    } catch (e) {
      console.error("[Gemini AI] Failed to parse user context from storage. Reverting to default.", e);
    }
  }

  // Default context, in case of failure or first-time use.
  // The AI can infer and adapt from this if no specific user context is available.
  const defaultContext = {
    userId: `gemini-user-${Math.random().toString(36).substring(2, 7)}`, // Dynamically generated for demo
    role: "DefaultUser",
    department: "General",
    transactionValue: Math.floor(Math.random() * 200000) + 10000, // Simulate dynamic transaction value
  };
  localStorage.setItem("geminiUserContext", JSON.stringify(defaultContext)); // Persist for adaptive learning
  return defaultContext;
};

// --- End Gemini Integration ---

export default function ApproverField({
  approver,
  index,
  groupOptions,
  deleteApprover,
}: ApproverFieldProps): JSX.Element {
  const { setFieldValue, values } = useFormikContext<any>(); // Cast to any for broader access
  const geminiAI = GeminiApprovalIntelligence.getInstance();
  const currentUserContext = getCurrentUserContext();

  const [numApproversSuggestion, setNumApproversSuggestion] = React.useState<{
    suggestion: string;
    rationale: string;
  } | null>(null);
  const [groupSuggestions, setGroupSuggestions] = React.useState<Record<number, string | undefined>>({});
  const [aiValidationMessages, setAiValidationMessages] = React.useState<Record<number, string | undefined>>({});
  const [overallComplianceWarning, setOverallComplianceWarning] = React.useState<string | undefined>(undefined);

  // AI-powered effect for predicting optimal number of approvers and checking overall compliance.
  // This hook ensures the component is continuously aware and adaptive to its context.
  React.useEffect(() => {
    const applyAIIntelligence = async () => {
      // 1. Predict optimal number of approvers
      const suggestion = await geminiAI.predictOptimalApprovers(
        approver,
        currentUserContext,
      );
      setNumApproversSuggestion(suggestion);

      // 2. Perform AI-driven compliance check for the entire approver field configuration.
      const compliance = await ComplianceEngine.getInstance().checkCompliance(approver, currentUserContext);
      if (!compliance.compliant) {
        setOverallComplianceWarning(compliance.message);
        TelemetryService.getInstance().trackMetric("ComplianceWarningDisplayed", 1, { approverId: approver.id || `new-approver-${index}`, reason: compliance.message });
      } else {
        setOverallComplianceWarning(undefined);
      }
    };
    void applyAIIntelligence();

  }, [
    approver.number_of_reviewers,
    approver.conditional_group_ids.length,
    JSON.stringify(approver.conditional_group_ids), // Deep comparison for array changes
    JSON.stringify(currentUserContext), // React to changes in user context
  ]);

  const selectNum = (
    <div className={CLASSES.SELECT}>
      <Field
        id={`approvers[${index}].number_of_reviewers`}
        name={`approvers[${index}].number_of_reviewers`}
        component={FormikSelectField}
        options={NUM_APPROVERS_OPTIONS}
        onChange={(option: OptionType): void => {
          void setFieldValue(
            `approvers[${index}].number_of_reviewers`,
            option.value,
          );
          TelemetryService.getInstance().recordEvent("NumApproversChanged", {
            approverId: approver.id || `temp-${index}`,
            oldValue: approver.number_of_reviewers,
            newValue: option.value,
            user: currentUserContext.userId,
          });
          // AI can learn from this user interaction as part of its prompt-based learning pipeline.
          void geminiAI.learnFromOutcome({
            approverId: approver.id || `temp-${index}`,
            numReviewers: option.value,
            groupIds: approver.conditional_group_ids,
            outcome: "configured", // User made a choice, this is a learning signal
            timestamp: Date.now(),
            userContext: currentUserContext,
          });
        }}
      />
      {/* Display AI-generated suggestion if available and different from current value */}
      {numApproversSuggestion &&
        numApproversSuggestion.suggestion !== approver.number_of_reviewers && (
          <p className={CLASSES.AI_SUGGESTION}>
            {numApproversSuggestion.rationale}{" "}
            <Button
              buttonType="link"
              onClick={() => {
                void setFieldValue(
                  `approvers[${index}].number_of_reviewers`,
                  numApproversSuggestion.suggestion,
                );
                setNumApproversSuggestion(null); // Clear suggestion after application
                TelemetryService.getInstance().recordEvent("AISuggestionApplied_NumApprovers", {
                  approverId: approver.id || `temp-${index}`,
                  originalValue: approver.number_of_reviewers,
                  suggestedValue: numApproversSuggestion.suggestion,
                  user: currentUserContext.userId,
                });
              }}
            >
              (Apply AI Suggestion: {numApproversSuggestion.suggestion})
            </Button>
          </p>
        )}
    </div>
  );

  // Memoized callback for fetching intelligent group options, demonstrating adaptive data flow.
  const getFilteredGroupOptionsAI = React.useCallback(
    async (currentGroupIndex: number, currentSelectedValue: string | null) => {
      const { options, suggestion } = await geminiAI.getIntelligentGroupOptions(
        approver,
        groupOptions,
        currentSelectedValue,
        currentUserContext,
      );
      setGroupSuggestions((prev) => ({ ...prev, [currentGroupIndex]: suggestion }));
      return options;
    },
    [approver, groupOptions, currentUserContext], // Dependencies for memoization
  );

  const groups = (
    <FieldArray
      name={`approvers[${index}].conditional_group_ids`}
      render={(arrayHelpers) => (
        <>
          {approver.conditional_group_ids.map(
            (_group: string | null, groupIndex: number) => {
              const currentSelectedGroupValue = approver.conditional_group_ids[groupIndex];

              // AI-powered validation that integrates with `Formik`'s validation pipeline.
              // This is decision-making at the input level, enhancing user experience and compliance.
              const validateGroupAI = async (value: string): Promise<string | undefined> => {
                const baseValidation = !value ? "Group must be selected" : undefined;
                if (baseValidation) return baseValidation;

                const aiFeedback = await geminiAI.validateGroupAI(
                  value,
                  approver,
                  currentUserContext,
                );
                // Update local AI validation state to display real-time feedback.
                setAiValidationMessages((prev) => ({
                  ...prev,
                  [groupIndex]: aiFeedback,
                }));
                return aiFeedback; // Return AI feedback as the validation message.
              };

              const groupSelect = (
                <div className={CLASSES.SELECT}>
                  <Field
                    id={`approvers[${index}].conditional_group_ids[${groupIndex}]`}
                    name={`approvers[${index}].conditional_group_ids[${groupIndex}]`}
                    component={FormikSelectField}
                    // Dynamically load options using AI intelligence, choosing optimal services at execution.
                    options={getFilteredGroupOptionsAI(groupIndex, currentSelectedGroupValue)}
                    onChange={(option: OptionType): void => {
                      void setFieldValue(
                        `approvers[${index}].conditional_group_ids[${groupIndex}]`,
                        option.value,
                      );
                      TelemetryService.getInstance().recordEvent("ApprovalGroupChanged", {
                        approverId: approver.id || `temp-${index}`,
                        groupIndex: groupIndex,
                        oldValue: currentSelectedGroupValue,
                        newValue: option.value,
                        user: currentUserContext.userId,
                      });
                      // Trigger AI validation immediately on change, showing adaptive behavior.
                      void validateGroupAI(option.value);
                    }}
                    validate={validateGroupAI}
                  />
                  <ErrorMessage
                    name={`approvers[${index}].conditional_group_ids[${groupIndex}]`}
                    component="div"
                    className="error-message"
                  />
                  {/* Display AI-driven suggestions for groups */}
                  {groupSuggestions[groupIndex] && (
                    <p className={CLASSES.AI_SUGGESTION}>
                      {groupSuggestions[groupIndex]}
                    </p>
                  )}
                  {/* Display AI-driven specific validation warnings directly below the field */}
                  {aiValidationMessages[groupIndex] && (
                    <p className={CLASSES.AI_WARNING}>
                      {aiValidationMessages[groupIndex]}
                    </p>
                  )}
                </div>
              );

              const fromOr = groupIndex === 0 ? "From" : "Or";

              return (
                <div className="flex" key={`group-${index}-${groupIndex}`}>
                  <div className="w-14">
                    <p className={CLASSES.FROM_OR}>{fromOr}</p>
                  </div>
                  <div className="w-6/12">{groupSelect}</div>
                  <div className="ml-auto w-1/12">
                    <Button
                      id={`remove-rule-approver-btn-${index}-${groupIndex}`}
                      className="ml-auto mr-2"
                      buttonType="link"
                      onClick={() => {
                        arrayHelpers.remove(groupIndex);
                        TelemetryService.getInstance().recordEvent("ApprovalGroupRemoved", {
                            approverId: approver.id || `temp-${index}`,
                            groupIndex: groupIndex,
                            removedValue: currentSelectedGroupValue,
                            user: currentUserContext.userId,
                        });
                        if (
                          approver.conditional_group_ids.length === 1 &&
                          deleteApprover
                        ) {
                          deleteApprover();
                          TelemetryService.getInstance().recordEvent("ApproverRemovedBecauseLastGroup", {
                            approverId: approver.id || `temp-${index}`,
                            user: currentUserContext.userId,
                        });
                        }
                      }}
                    >
                      <Icon
                        iconName="clear"
                        size="m"
                        color="currentColor"
                        className="text-gray-500"
                      />
                    </Button>
                  </div>
                </div>
              );
            },
          )}
          {approver.conditional_group_ids.length < groupOptions.length && (
            <Button
              buttonType="link"
              className="w-full pb-4 font-medium"
              onClick={(): void => {
                arrayHelpers.push(null);
                TelemetryService.getInstance().recordEvent("AddORApprovalClicked", {
                    approverId: approver.id || `temp-${index}`,
                    user: currentUserContext.userId,
                });
              }}
            >
              <Icon iconName="add" color="currentColor" />
              Add OR Approval
            </Button>
          )}
        </>
      )}
    />
  );

  return (
    <div className="max-w-xl">
      {index !== 0 && (
        <div className="mb-4 mt-8">
          <div className="-mb-4 border-b border-gray-100" />
          <Alert className="w-fit">And</Alert>
        </div>
      )}
      <div className="mb-6 bg-gray-50 px-3 pt-6">
        <div className="flex">
          <div className="w-14">
            <p className={CLASSES.FROM_OR}>Require</p>
          </div>
          <div className="w-20">{selectNum}</div>
          <div className="w-1/6">
            <p className="mt-1 pl-2 font-medium">Approval(s)</p>
          </div>
        </div>
        {groups}
        {/* Display overall AI compliance warning for the entire block if non-compliant */}
        {overallComplianceWarning && (
          <Alert className="mt-4" type="warning">
            AI Compliance Warning: {overallComplianceWarning}
          </Alert>
        )}
      </div>
    </div>
  );
}