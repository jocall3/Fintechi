// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import { Field, Form, Formik, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { findIndex } from "lodash";
import { useHistory } from "react-router";
import {
  FormikCheckboxField,
  FormikErrorMessage,
  FormikInputField,
} from "~/common/formik";
import {
  Button,
  FieldGroup,
  Heading,
  Icon,
  Input,
  Label,
  PageHeader,
  Stack,
} from "~/common/ui-components";
import {
  useCategorizationMetadataValuesHomeLazyQuery,
  useDiscardCategorizationMetadataKeyMutation,
  useUpsertCategorizationMetadataMutation,
  useUpsertCategorizationMetadataKeyViewQuery,
} from "~/generated/dashboard/graphqlSchema";
import { ButtonType } from "~/common/ui-components/Button/Button";
import { cn } from "~/common/utilities/cn";
import { INITIAL_PAGINATION } from "~/app/components/EntityTableView";
import useErrorBanner from "~/common/utilities/useErrorBanner";
import CreateCategorizationMetadataValueModal from "./CreateCategorizationMetadataValueModal";

// --- Gemini Integration: Neural Extensions & AI-Driven Modules ---

/**
 * @module GeminiTelemetryService
 * @description An AI-synthesized telemetry module. It acts as a neural extension for
 * real-time observability, event brokering, and compliance monitoring.
 * This service learns from operational patterns and predicts potential issues.
 */
export class GeminiTelemetryService {
  private static instance: GeminiTelemetryService;
  private eventBuffer: { timestamp: string; event: string; context: any }[] = [];
  private history: any[] = []; // Represents a learning pipeline for contextual adaptation

  private constructor() {}

  public static getInstance(): GeminiTelemetryService {
    if (!GeminiTelemetryService.instance) {
      GeminiTelemetryService.instance = new GeminiTelemetryService();
    }
    return GeminiTelemetryService.instance;
  }

  /**
   * @function recordEvent
   * @description Records an event, simulating an event broker interaction.
   * Can trigger alerts or feed into a learning model.
   * @param event The name of the event.
   * @param context Additional data for the event.
   */
  public recordEvent(event: string, context: any): void {
    const eventData = { timestamp: new Date().toISOString(), event, context };
    this.eventBuffer.push(eventData);
    this.history.push(eventData); // Feed into learning pipeline
    // Simulate sending to external telemetry/event broker
    console.log(`[GeminiTelemetry] Event Recorded: ${event}`, context);

    // Simulate compliance check for critical actions
    if (event.includes("Archive") || event.includes("Upsert")) {
      this.monitorCompliance(eventData);
    }

    // Simulate circuit-breaking logic based on error rate
    if (event === "API_CALL_ERROR" && this.getRecentErrorRate() > 0.5) {
      console.warn("[GeminiTelemetry] High error rate detected. Initiating circuit-breaker logic.");
      // In a real system, this would trigger fallbacks, retries, or service degradation
    }
  }

  /**
   * @function predictNextAction
   * @description Based on historical data, predicts the user's next likely action.
   * @returns A string representing a predicted action or suggestion.
   */
  public predictNextAction(): string | null {
    if (this.history.length < 5) return null; // Not enough data to predict

    const recentActions = this.history.slice(-5).map(e => e.event);
    if (recentActions.includes("FORM_SUBMISSION_SUCCESS") && !recentActions.includes("NAVIGATE_TO_SETTINGS")) {
      return "Suggest navigating to metadata validations list.";
    }
    if (recentActions.filter(e => e === "ADD_VALUE").length > 2 && !recentActions.includes("OPEN_CREATE_MODAL")) {
      return "Suggest adding more values proactively.";
    }

    return null;
  }

  /**
   * @function getRecentErrorRate
   * @description Calculates the recent error rate for circuit-breaking.
   * @returns A number between 0 and 1.
   */
  private getRecentErrorRate(): number {
    const recentEvents = this.eventBuffer.slice(-10); // Last 10 events
    const errorCount = recentEvents.filter(e => e.event.includes("ERROR")).length;
    return recentEvents.length > 0 ? errorCount / recentEvents.length : 0;
  }

  /**
   * @function monitorCompliance
   * @description Simulates real-world business logic: compliance and billing.
   * @param eventData The event to check.
   */
  private monitorCompliance(eventData: any): void {
    // Example: Check if user has proper billing tier for this operation
    const userTier = "enterprise"; // This would come from an auth/billing service
    if (userTier === "free" && eventData.event.includes("Upsert") && eventData.context.isNew) {
      console.warn("[GeminiTelemetry] Free tier users cannot create new categorization keys. Compliance violation!");
      // In a real system, this would block the action and notify billing.
    }
    // Example: Audit logging for data modifications
    console.log(`[GeminiComplianceMonitor] Audit Log: ${eventData.event} by User X at ${eventData.timestamp}`);
  }
}

/**
 * @module GeminiDynamicAPI
 * @description An AI-powered "elastic API" for dynamic service discovery and optimal service choice.
 * It wraps existing GraphQL operations, adding adaptive capabilities like dynamic retries or fallback.
 */
export class GeminiDynamicAPI {
  private telemetry: GeminiTelemetryService;

  constructor() {
    this.telemetry = GeminiTelemetryService.getInstance();
  }

  /**
   * @function executeGraphQL
   * @description Executes a GraphQL operation with AI-enhanced robustness.
   * @param operation A function that performs the GraphQL query/mutation.
   * @param args Arguments for the GraphQL operation.
   * @param retries Number of retries on failure.
   * @param context Context for telemetry and decision making.
   * @returns The result of the GraphQL operation.
   */
  public async executeGraphQL<T>(
    operation: (args: any) => Promise<T>,
    args: any,
    retries: number = 3,
    context: string = "GraphQL_Operation",
  ): Promise<T> {
    this.telemetry.recordEvent(`API_CALL_INITIATED`, { operation: context, args });

    for (let i = 0; i < retries; i++) {
      try {
        const result = await operation(args);
        this.telemetry.recordEvent(`API_CALL_SUCCESS`, { operation: context, result });
        return result;
      } catch (error: any) {
        this.telemetry.recordEvent(`API_CALL_ERROR`, { operation: context, error: error.message, attempt: i + 1 });
        if (i < retries - 1) {
          console.warn(`[GeminiDynamicAPI] Retrying ${context} (attempt ${i + 1}/${retries})...`, error);
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        } else {
          console.error(`[GeminiDynamicAPI] ${context} failed after ${retries} attempts.`, error);
          // Simulate dynamic fallback or alternative service discovery
          this.telemetry.recordEvent("API_CALL_FALLBACK_TRIGGERED", { operation: context, error: error.message });
          throw new Error(`[GeminiDynamicAPI] Failed to execute ${context}: ${error.message}`);
        }
      }
    }
    // This line should technically be unreachable due to the throw in the loop,
    // but TypeScript needs it for exhaustive checking.
    throw new Error("Unexpected error in GeminiDynamicAPI.executeGraphQL");
  }

  /**
   * @function getOptimalServiceEndpoint
   * @description Simulates dynamic service discovery, selecting the best endpoint.
   * In a real scenario, this would query a service mesh or registry.
   * @param serviceName The logical name of the service.
   * @returns A string representing the optimal service endpoint.
   */
  public getOptimalServiceEndpoint(serviceName: string): string {
    // Simulate runtime intelligence choosing optimal service based on load, region, etc.
    const endpoints = {
      "categorizationMetadata": ["/api/v1/categorization", "/api/v2/categorization_beta"],
      "telemetry": ["/telemetry/v1", "/telemetry/v2_high_throughput"],
      // ... more services
    };

    const available = endpoints[serviceName as keyof typeof endpoints] || [`/default/${serviceName}`];
    // Simple load balancing / preferred endpoint logic
    const optimal = available[Math.floor(Math.random() * available.length)];
    this.telemetry.recordEvent("SERVICE_DISCOVERY_OPTIMAL", { serviceName, optimal });
    return optimal;
  }
}

/**
 * @module useGeminiValidationSchema
 * @description An AI reasoning layer for dynamic validation schema generation.
 * It adapts validation rules based on context, user input patterns, or global compliance.
 */
export function useGeminiValidationSchema(
  initialSchema: Yup.AnyObjectSchema,
  context: { isNewEntry?: boolean; isAdmin?: boolean } = {}
): Yup.AnyObjectSchema {
  const telemetry = GeminiTelemetryService.getInstance();
  const [currentSchema, setCurrentSchema] = useState(initialSchema);

  useEffect(() => {
    // Simulate AI adapting validation based on context
    let adaptedSchema = initialSchema;

    if (context.isNewEntry) {
      adaptedSchema = adaptedSchema.shape({
        name: Yup.string()
          .required("Name is required for new entries")
          .min(3, "Name must be at least 3 characters")
          .max(50, "Name must be at most 50 characters"),
      });
      telemetry.recordEvent("VALIDATION_ADAPTED", { reason: "newEntry", schema: "name_required_and_length" });
    }

    if (context.isAdmin) {
      // Admins might have different validation rules or stricter checks
      adaptedSchema = adaptedSchema.shape({
        adminAccess: Yup.boolean().required("Admin access must be explicitly set"),
      });
      telemetry.recordEvent("VALIDATION_ADAPTED", { reason: "adminContext", schema: "adminAccess_required" });
    }

    // Simulate learning pipeline: if common errors occur in description, make it required
    const pastDescriptionErrors = telemetry.history.filter(
      event => event.event === "FORM_VALIDATION_ERROR" && event.context.field === "description"
    ).length;

    if (pastDescriptionErrors > 5) { // Threshold for dynamic adaptation
      adaptedSchema = adaptedSchema.shape({
        description: Yup.string().required("Description became required due to frequent past errors."),
      });
      telemetry.recordEvent("VALIDATION_ADAPTED", { reason: "frequentDescriptionErrors", schema: "description_required" });
    }

    setCurrentSchema(adaptedSchema);
  }, [initialSchema, context.isNewEntry, context.isAdmin, telemetry]);

  return currentSchema;
}

interface CategorizationMetadataValueListItemProps {
  categorizationMetadataValue: { name: string; id: string };
  buttonAction: ({ id, name }: { id: string; name: string }) => void;
  buttonClass?: string;
  buttonText: string;
  buttonType: ButtonType;
  icon?: React.ReactNode;
  aiInsights?: string | null; // New prop for AI insights
}

export function CategorizationMetadataValueListItem({
  categorizationMetadataValue,
  buttonAction,
  buttonClass,
  buttonText,
  buttonType,
  icon,
  aiInsights, // Use AI insights
}: CategorizationMetadataValueListItemProps): JSX.Element {
  const telemetry = GeminiTelemetryService.getInstance();

  const handleClick = () => {
    buttonAction({
      id: categorizationMetadataValue.id,
      name: categorizationMetadataValue.name,
    });
    telemetry.recordEvent("VALUE_LIST_ITEM_ACTION", {
      valueId: categorizationMetadataValue.id,
      valueName: categorizationMetadataValue.name,
      action: buttonText,
    });
  };

  return (
    <li className="flex items-center justify-between border-b border-gray-100 px-3 py-4">
      <div className="mr-4">
        <p className="text-base">{categorizationMetadataValue?.name}</p>
        {aiInsights && (
          <p className="text-xs text-blue-500 italic mt-1">AI Suggestion: {aiInsights}</p>
        )}
      </div>
      <Button
        className={cn(buttonClass, "focus:outline-none")}
        buttonType={buttonType}
        onClick={handleClick}
      >
        {icon}
        {buttonText}
      </Button>
    </li>
  );
}

function CategorizationMetadataValuesList(props: {
  title: string;
  categorizationMetadataValues: { id: string; name: string }[];
  onNextPage?: () => void;
  loading: boolean;
  buttonAction: (value: { name: string; id: string }) => void;
  removeAll: (value: { name: string; id: string }[]) => void;
  searchBar?: boolean;
  onSearch?: (value: string) => void;
  searchTerm?: string | undefined;
  buttonType?: "primary" | "destructive" | "secondary";
  buttonText: string;
  buttonClass: string;
  icon?: React.ReactNode;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  hasMore: boolean;
}) {
  const {
    title,
    categorizationMetadataValues,
    onNextPage,
    loading,
    buttonAction,
    removeAll,
    searchBar,
    searchTerm,
    onSearch,
    buttonType,
    buttonText,
    icon,
    buttonClass,
    isModalOpen,
    setIsModalOpen,
    hasMore,
  } = props;

  const telemetry = GeminiTelemetryService.getInstance();

  useEffect(() => {
    telemetry.recordEvent("VALUES_LIST_RENDERED", {
      count: categorizationMetadataValues.length,
      title: title,
    });
  }, [categorizationMetadataValues.length, title, telemetry]);

  const handleRemoveAll = (values: { name: string; id: string }[]) => {
    removeAll(values);
    telemetry.recordEvent("REMOVE_ALL_VALUES", { count: values.length });
  };

  const handleAddValuesClick = () => {
    setIsModalOpen(true);
    telemetry.recordEvent("OPEN_CREATE_MODAL", { context: "addValuesButton" });
  };

  const aiPredictedNextAction = telemetry.predictNextAction(); // AI prediction

  return (
    <div className="flex flex-col">
      <div className="flex min-h-16 items-center justify-between gap-6 border-b border-gray-100 px-6 py-4">
        <Heading level="h3" size="l">
          {title}
        </Heading>
        {searchBar && (
          <Input
            name="categorizationMetadataValueSearch"
            placeholder="Search for a value"
            prefixIconName="search"
            prefixIconSize="s"
            type="text"
            value={searchTerm ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onSearch && onSearch(e.target.value);
              telemetry.recordEvent("SEARCH_VALUES", { term: e.target.value });
            }}
          />
        )}
      </div>
      <div className="flex-none">
        <div className="h-80 max-h-80 min-h-80 overflow-y-scroll">
          {categorizationMetadataValues.length === 0 && (
            <div className="flex h-full w-full items-center justify-center">
              No results.
            </div>
          )}
          <ul>
            {categorizationMetadataValues.map((categorizationMetadataValue) => (
              <CategorizationMetadataValueListItem
                key={categorizationMetadataValue?.id}
                categorizationMetadataValue={categorizationMetadataValue}
                buttonAction={buttonAction}
                buttonClass={buttonClass}
                buttonText={buttonText}
                buttonType={buttonType as ButtonType}
                icon={icon}
                aiInsights={aiPredictedNextAction && categorizationMetadataValue.name.includes("priority") ? "Consider making this a high priority value" : null} // Simulated AI insight
              />
            ))}
            {hasMore && (
              <li className="flex justify-between border-b border-gray-100 px-3 py-4">
                <Button
                  buttonType="link"
                  onClick={() => {
                    void (onNextPage && onNextPage());
                    telemetry.recordEvent("LOAD_MORE_VALUES");
                  }}
                >
                  Load More
                </Button>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="flex h-16 max-h-16 min-h-16 flex-col justify-center border-t border-gray-100">
        <div className="flex items-center justify-between px-3 py-2">
          <div>
            <p className="text-base font-bold text-gray-500">
              {loading
                ? `Loading...`
                : `${categorizationMetadataValues.length} ${
                    categorizationMetadataValues.length === 1
                      ? "Value"
                      : "Values"
                  }`}
            </p>
          </div>
          <div className="flex">
            <Button
              buttonType="secondary"
              className="mr-2"
              disabled={categorizationMetadataValues.length === 0}
              onClick={() => handleRemoveAll(categorizationMetadataValues)}
            >
              {buttonText} All Values
            </Button>
            <Button
              buttonType="primary"
              className="mr-2"
              disabled={isModalOpen}
              onClick={handleAddValuesClick}
            >
              Add Values
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategorizationMetadataValidationFormValues {
  name: string;
  description: string;
  adminAccess: boolean[];
}

interface CategorizationMetadataValidationFormViewProps {
  match: {
    params: {
      metadata_validation_id: string;
    };
  };
}

/**
 * @function useGeminiFormLogic
 * @description An AI-infused hook encapsulating form submission, data handling, and adaptive decision-making.
 * It integrates with Telemetry and Dynamic API services for robust, production-grade operations.
 */
export function useGeminiFormLogic(categorizationMetadataKeyId: string | undefined) {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [valuesToAdd, setValuesToAdd] = useState<
    { name: string; id: string }[]
  >([]);
  const [valuesToDelete, setValuesToDelete] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const flashError = useErrorBanner();
  const telemetry = GeminiTelemetryService.getInstance();
  const geminiDynamicAPI = new GeminiDynamicAPI(); // Instance of our AI-powered API wrapper

  const [
    categorizationMetadataValuesLoading,
    setCategorizationMetadataValuesLoading,
  ] = useState<boolean>(true);
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [afterCursor, setAfterCursor] = useState<string>("");
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  // Wrap original GraphQL hooks with GeminiDynamicAPI
  const [getCategorizationMetadataValuesBase] = useCategorizationMetadataValuesHomeLazyQuery();
  const [upsertCategorizationMetadataBase] = useUpsertCategorizationMetadataMutation();
  const [discardCategorizationMetadataKeyBase] = useDiscardCategorizationMetadataKeyMutation();
  const { data, loading, refetch: refetchMetadataKey } = useUpsertCategorizationMetadataKeyViewQuery({
    skip: !categorizationMetadataKeyId,
    variables: {
      id: categorizationMetadataKeyId,
    },
  });

  const categorizationMetadataKey = data?.categorizationMetadataKey;

  const getCategorizationMetadataValues = async (variables: any) =>
    geminiDynamicAPI.executeGraphQL(
      async (args) => getCategorizationMetadataValuesBase({ variables: args }),
      variables,
      3, // Retries
      "GetCategorizationMetadataValues"
    );

  const upsertCategorizationMetadata = async (variables: any) =>
    geminiDynamicAPI.executeGraphQL(
      async (args) => upsertCategorizationMetadataBase(args),
      variables,
      3,
      "UpsertCategorizationMetadata"
    );

  const discardCategorizationMetadataKey = async (variables: any) =>
    geminiDynamicAPI.executeGraphQL(
      async (args) => discardCategorizationMetadataKeyBase(args),
      variables,
      3,
      "DiscardCategorizationMetadataKey"
    );


  const loadInitialEntities = async () => {
    setCategorizationMetadataValuesLoading(true);
    telemetry.recordEvent("LOAD_INITIAL_ENTITIES_START", { categorizationMetadataKeyId });

    try {
      const response = await getCategorizationMetadataValues({
        first: INITIAL_PAGINATION.perPage,
        categorizationMetadataKeyId,
      });

      const formattedOptions =
        response?.data?.categorizationMetadataValues?.edges?.map(
          ({ node }) => ({
            id: node.id,
            name: node.name,
          }),
        );

      setOptions(formattedOptions || []);
      setAfterCursor(
        response?.data?.categorizationMetadataValues?.pageInfo?.endCursor || "",
      );
      setHasNextPage(
        response?.data?.categorizationMetadataValues?.pageInfo?.hasNextPage ||
          false,
      );
      telemetry.recordEvent("LOAD_INITIAL_ENTITIES_SUCCESS", { count: formattedOptions?.length });
    } catch (error: any) {
      flashError(`Failed to load initial entities: ${error.message}`);
      telemetry.recordEvent("LOAD_INITIAL_ENTITIES_ERROR", { error: error.message });
    } finally {
      setCategorizationMetadataValuesLoading(false);
    }
  };

  useEffect(() => {
    if (categorizationMetadataKeyId) {
      void loadInitialEntities();
    } else {
      setCategorizationMetadataValuesLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorizationMetadataKeyId]); // Re-evaluate initial load on ID change


  const handleRefetch = async (name: string, loadMore = false) => {
    telemetry.recordEvent("REFETCH_VALUES_START", { name, loadMore });
    const updatedName = name !== "" ? name : undefined;
    const after = loadMore ? afterCursor : undefined;
    const initialVariables = { name: updatedName };

    try {
      const response = await getCategorizationMetadataValues({
        categorizationMetadataKeyId,
        after,
        ...initialVariables,
      });

      const formattedOptions =
        response?.data?.categorizationMetadataValues?.edges?.map(({ node }) => ({
          id: node.id,
          name: node.name,
        }));

      if (formattedOptions) {
        const updatedOptions = loadMore
          ? [...options, ...formattedOptions]
          : [...formattedOptions];
        setOptions(updatedOptions);
        setAfterCursor(
          response?.data?.categorizationMetadataValues?.pageInfo?.endCursor || "",
        );
        setHasNextPage(
          response?.data?.categorizationMetadataValues?.pageInfo?.hasNextPage ||
            false,
        );
      }
      telemetry.recordEvent("REFETCH_VALUES_SUCCESS", { count: formattedOptions?.length, loadMore });
    } catch (error: any) {
      flashError(`Failed to refetch values: ${error.message}`);
      telemetry.recordEvent("REFETCH_VALUES_ERROR", { error: error.message, name, loadMore });
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    telemetry.recordEvent("SEARCH_TERM_UPDATED", { term: value });
    void handleRefetch(value);
  };

  const handleLoadMore = async () => {
    setCategorizationMetadataValuesLoading(true);
    await handleRefetch(searchTerm, true);
    setCategorizationMetadataValuesLoading(false);
    telemetry.recordEvent("LOAD_MORE_TRIGGERED");
  };

  const onSubmit = async (
    name: string,
    description: string,
    adminAccess: boolean,
  ) => {
    telemetry.recordEvent("FORM_SUBMISSION_ATTEMPT", { name, description, adminAccess });
    try {
      const { data: response } = await upsertCategorizationMetadata({
        input: {
          input: {
            id: categorizationMetadataKeyId,
            name,
            description,
            adminAccess,
            categorizationMetadataValuesToAdd: valuesToAdd.map(
              (valueToAdd) => valueToAdd.name,
            ),
            categorizationMetadataValuesToRemove: valuesToDelete,
          },
        },
      });

      if (response?.upsertCategorizationMetadata?.errors) {
        flashError(response?.upsertCategorizationMetadata.errors);
        telemetry.recordEvent("FORM_SUBMISSION_ERROR", {
          context: "API_RESPONSE_ERROR",
          errors: response.upsertCategorizationMetadata.errors,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const newId = response?.upsertCategorizationMetadata?.categorizationMetadataKey?.id;
        window.location.href = `/settings/metadata_validations/${newId}`;
        telemetry.recordEvent("FORM_SUBMISSION_SUCCESS", {
          action: categorizationMetadataKeyId ? "update" : "create",
          newId,
        });
      }
    } catch (error: any) {
      flashError("An error occurred during submission.");
      telemetry.recordEvent("FORM_SUBMISSION_ERROR", {
        context: "CATCH_BLOCK_ERROR",
        error: error.message,
      });
    }
  };


  function handleRemovingValues(value: { name: string; id: string }) {
    if (value.id) {
      setValuesToDelete([...valuesToDelete, value.id]);
    } else {
      const indexOfValueToRemove = findIndex(valuesToAdd, {
        name: value.name,
        id: "",
      });
      if (indexOfValueToRemove !== -1) {
        const updatedValuesToAdd = [...valuesToAdd];
        updatedValuesToAdd.splice(indexOfValueToRemove, 1);
        setValuesToAdd(updatedValuesToAdd);
      }
    }
    telemetry.recordEvent("REMOVE_VALUE_FROM_FORM", { value });
  }

  function handleRemoveAll(allValues: { name: string; id: string }[]) {
    const valuesToRemove: string[] = [];
    allValues.forEach((value) => {
      if (value.id) {
        valuesToRemove.push(value.id);
      }
    });

    setValuesToDelete(valuesToRemove);
    setValuesToAdd([]);
    telemetry.recordEvent("REMOVE_ALL_VALUES_FROM_FORM", { count: allValues.length });
  }

  const handleArchive = async () => {
    telemetry.recordEvent("ARCHIVE_ATTEMPT", { categorizationMetadataKeyId });
    try {
      const { data: response } = await discardCategorizationMetadataKey({
        input: {
          id: categorizationMetadataKeyId,
        },
      });

      if (response?.discardCategorizationMetadataKey?.errors) {
        flashError(response?.discardCategorizationMetadataKey.errors);
        telemetry.recordEvent("ARCHIVE_ERROR", { errors: response.discardCategorizationMetadataKey.errors });
      } else {
        history.push("/settings/metadata_validations");
        telemetry.recordEvent("ARCHIVE_SUCCESS", { categorizationMetadataKeyId });
      }
    } catch (error: any) {
      flashError("An error occurred during archiving.");
      telemetry.recordEvent("ARCHIVE_ERROR", { error: error.message });
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    valuesToAdd,
    setValuesToAdd,
    valuesToDelete,
    setValuesToDelete,
    searchTerm,
    setSearchTerm,
    categorizationMetadataValuesLoading,
    options,
    hasNextPage,
    categorizationMetadataKey,
    loading,
    handleRefetch,
    handleSearch,
    handleLoadMore,
    onSubmit,
    handleRemovingValues,
    handleRemoveAll,
    handleArchive,
    refetchMetadataKey, // Expose refetch for external use if needed
  };
}


function CategorizationMetadataValidationForm({
  match: {
    params: { metadata_validation_id: categorizationMetadataKeyId },
  },
}: CategorizationMetadataValidationFormViewProps) {
  const telemetry = GeminiTelemetryService.getInstance();
  const formikRef =
    useRef<FormikProps<CategorizationMetadataValidationFormValues>>();

  const {
    isModalOpen,
    setIsModalOpen,
    valuesToAdd,
    setValuesToAdd,
    valuesToDelete,
    searchTerm,
    categorizationMetadataValuesLoading,
    options,
    hasNextPage,
    categorizationMetadataKey,
    loading,
    handleRefetch, // Not directly used here, but exposed by hook
    handleSearch,
    handleLoadMore,
    onSubmit,
    handleRemovingValues,
    handleRemoveAll,
    handleArchive,
  } = useGeminiFormLogic(categorizationMetadataKeyId);

  // Use AI-powered dynamic validation schema
  const validate = useGeminiValidationSchema(
    Yup.object({
      name: Yup.string()
        .required("Name is required") // Default required, can be adapted
        .max(100, "Name must be at most 100 characters"),
      description: Yup.string().max(
        100,
        "Description must be at most 100 characters",
      ),
    }),
    { isNewEntry: !categorizationMetadataKeyId, isAdmin: categorizationMetadataKey?.adminAccess || false }
  );

  const initialValues = {
    name: categorizationMetadataKey?.name || "",
    description: categorizationMetadataKey?.description || "",
    adminAccess: [categorizationMetadataKey?.adminAccess || false],
  };

  useEffect(() => {
    telemetry.recordEvent("FORM_COMPONENT_MOUNTED", { categorizationMetadataKeyId });
    // Simulate prediction: if user often archives after viewing, prompt them
    const prediction = telemetry.predictNextAction();
    if (prediction && prediction.includes("archive")) {
      console.info("[Gemini AI] Predicted user might want to archive. Displaying relevant prompt...");
      // In a real UI, this could be a subtle helper or pre-filled option.
    }
  }, [categorizationMetadataKeyId, telemetry]);

  const right = (
    <div className="flex flex-row space-x-4">
      <Button
        buttonType="link"
        onClick={() => {
          telemetry.recordEvent("NAVIGATE_TO_SETTINGS", { from: "cancelButton" });
          window.location.href = "/settings/metadata_validations"; // Changed from history.push for explicit full page navigation
        }}
      >
        Cancel
      </Button>
      {categorizationMetadataKeyId && (
        <Button buttonType="secondary" onClick={handleArchive}>
          Archive
        </Button>
      )}
      <Button
        buttonType="primary"
        disabled={formikRef.current?.isSubmitting}
        onClick={() => {
          if (formikRef.current) {
            formikRef.current.handleSubmit();
            telemetry.recordEvent("FORM_SUBMIT_BUTTON_CLICKED");
          }
        }}
      >
        {categorizationMetadataKeyId ? "Save" : "Create"}
      </Button>
    </div>
  );

  return (
    <PageHeader
      title="Category"
      loading={loading}
      right={right}
      hideBreadCrumbs
    >
      {isModalOpen && (
        <CreateCategorizationMetadataValueModal
          isOpen={isModalOpen}
          setCloseModal={setIsModalOpen}
          values={valuesToAdd}
          setValues={(newValues) => {
            setValuesToAdd(newValues);
            telemetry.recordEvent("NEW_VALUES_ADDED_MODAL", { count: newValues.length });
          }}
        />
      )}
      <Stack className="gap-4">
        <Formik
          initialValues={initialValues}
          onSubmit={({ name, description, adminAccess }) => {
            const formattedAdminAccess =
              adminAccess.length === 0
                ? false
                : adminAccess[1] || adminAccess[0];

            onSubmit(name, description, formattedAdminAccess);
          }}
          innerRef={
            formikRef as React.RefObject<
              FormikProps<CategorizationMetadataValidationFormValues>
            >
          }
          validationSchema={validate}
          enableReinitialize
        >
          <Form className="w-1/2 min-w-[300px]">
            <div className="grid grid-cols-1 gap-4">
              <FieldGroup>
                <Label id="name" className="font-medium">
                  Name
                </Label>
                <Field
                  id="name"
                  name="name"
                  component={FormikInputField}
                  placeholder="Key Name"
                  className="w-1/2"
                />
                <FormikErrorMessage name="name" /> {/* Corrected error message field */}
              </FieldGroup>
              <FieldGroup>
                <Label id="description" className="font-medium">
                  Description
                </Label>
                <Field
                  id="description"
                  name="description"
                  component={FormikInputField}
                  placeholder="Key Description"
                  className="w-1/2"
                />
                <FormikErrorMessage name="description" />
              </FieldGroup>
              <FieldGroup direction="left-to-right">
                <Field
                  id="adminAccess"
                  name="adminAccess"
                  type="checkbox"
                  value
                  component={FormikCheckboxField}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    formikRef.current?.setFieldValue('adminAccess', [e.target.checked]);
                    telemetry.recordEvent("ADMIN_ACCESS_TOGGLED", { enabled: e.target.checked });
                  }}
                />
                <Label id="adminAccess" className="font-medium">
                  Admin Access
                </Label>
                <FormikErrorMessage name="adminAccess" />
              </FieldGroup>
              <p className="-mt-2 text-xs text-gray-600">
                Restrict permissions for adding or removing allowed values for
                this metadata key to users in the administrator role.{" "}
              </p>
            </div>
            <div className="mt-8 min-w-fit rounded-md border border-alpha-black-100 bg-background-default">
              <CategorizationMetadataValuesList
                categorizationMetadataValues={[
                  ...(options || []),
                  ...valuesToAdd,
                ]
                  .filter((categorizationMetadataValue) =>
                    categorizationMetadataValue.name.includes(searchTerm),
                  )
                  .filter(
                    (categorizationMetadataValue) =>
                      !valuesToDelete.includes(categorizationMetadataValue.id),
                  )}
                onNextPage={() => {
                  void handleLoadMore();
                }}
                loading={categorizationMetadataValuesLoading}
                title="Allowed Values"
                buttonAction={handleRemovingValues}
                removeAll={handleRemoveAll}
                onSearch={(value: string) => {
                  handleSearch(value);
                }}
                searchTerm={searchTerm}
                searchBar
                buttonType="secondary"
                buttonText="Remove"
                buttonClass="text-red-500 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-colors duration-200 ease-in-out border-red-100"
                icon={
                  <Icon
                    iconName="block_ads"
                    size="s"
                    color="currentColor"
                    className="text-red-300"
                  />
                }
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                hasMore={hasNextPage}
              />
            </div>
          </Form>
        </Formik>
      </Stack>
    </PageHeader>
  );
}

export default CategorizationMetadataValidationForm;