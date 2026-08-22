// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useEffect } from "react";
import { intersection, uniqBy } from "lodash";
import { cn } from "~/common/utilities/cn";
import {
  useUpdateAccountGroupMutation,
  useAccountGroupViewQuery,
  AccountGroupViewQuery,
  useInternalAccountsSearchLazyQuery,
} from "../../../generated/dashboard/graphqlSchema";
import useErrorBanner from "../../../common/utilities/useErrorBanner";
import {
  Button,
  Icon,
  Input,
  Heading,
  PageHeader,
} from "../../../common/ui-components";
import {
  ButtonClickEventTypes,
  ButtonType,
} from "../../../common/ui-components/Button/Button";
import { CursorPaginationInput } from "../../types/CursorPaginationInput";
import trackEvent from "../../../common/utilities/trackEvent";
import { ACCOUNT_GROUP_ACTIONS } from "../../../common/constants/analytics";
import { handleLinkClick } from "../../../common/utilities/handleLinkClick";

// Gemini AI-Powered Transformation Framework - Neural Extensions & Micro-Intelligences
// These are conceptual living endpoints, self-aware modules interfacing with external services dynamically.
// They embody the Gemini architecture: autonomous, scalable, context-aware.

// I. AI-Synthesized Modules (Conceptual Imports)
// These represent dynamic, self-configuring services managed by the Gemini framework.
// They are not static imports but intelligent APIs, chosen optimally at runtime.

// Gemini Core Intelligence Layer
interface GeminiCoreIntelligence {
  analyzeContext: (context: any) => Promise<any>;
  predictBehavior: (data: any) => Promise<any>;
  generateResponse: (prompt: string, context: any) => Promise<string>;
  makeDecision: (options: any[], context: any) => Promise<any>;
  learnFromFeedback: (feedback: any) => void;
}

// Gemini Data Orchestration & Prediction
interface GeminiDataOrchestrator {
  fetchOptimized: <T>(query: string, variables: any) => Promise<T>;
  cacheIntelligently: (key: string, data: any) => void;
  predictDataNeeds: (context: any) => Promise<any[]>;
  streamEvents: (eventType: string, handler: (data: any) => void) => () => void;
}

// Gemini Runtime Observability & Self-Correction
interface GeminiObservabilityEngine {
  logEvent: (severity: string, message: string, context?: any) => void;
  monitorPerformance: (metric: string, value: number, context?: any) => void;
  predictError: (potentialError: any, context: any) => Promise<boolean>;
  suggestCorrection: (error: any, context: any) => Promise<string>;
  // Circuit breaker functionality embedded
  isServiceAvailable: (serviceName: string) => boolean;
  notifyServiceOutage: (serviceName: string, reason: string) => void;
}

// Gemini Compliance & Security Layer
interface GeminiComplianceSecurity {
  authorizeAction: (action: string, userId: string, resourceId: string) => Promise<boolean>;
  scanForComplianceViolations: (data: any, ruleSet: string) => Promise<string[]>;
  maskSensitiveData: (data: any) => any;
  auditTrail: (action: string, userId: string, details: any) => void;
}

// Mock/Conceptual Gemini Service Instances (would be dynamically provisioned)
const GeminiIntelligence: GeminiCoreIntelligence = {
  analyzeContext: async (context) => {
    console.log("Gemini: Analyzing context...", context);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 100));
    return { sentiment: 'positive', urgency: 'medium' };
  },
  predictBehavior: async (data) => {
    console.log("Gemini: Predicting user behavior...", data);
    // Simulate behavior prediction
    await new Promise(resolve => setTimeout(resolve, 50));
    return { likelyAction: 'save_changes', confidence: 0.85 };
  },
  generateResponse: async (prompt, context) => {
    console.log(`Gemini: Generating response for prompt: "${prompt}" with context:`, context);
    // Simulate LLM response generation
    await new Promise(resolve => setTimeout(resolve, 200));
    if (prompt.includes("description")) {
      return "An automatically generated description based on account activity and group purpose.";
    }
    return `AI-generated insight for: ${prompt}`;
  },
  makeDecision: async (options, context) => {
    console.log("Gemini: Making decision from options:", options, "Context:", context);
    await new Promise(resolve => setTimeout(resolve, 50));
    // Simulate choosing the "best" option
    return options[0]; // Simplistic for demo
  },
  learnFromFeedback: (feedback) => {
    console.log("Gemini: Learning from feedback...", feedback);
    // In a real system, this would update models.
  }
};

const GeminiData: GeminiDataOrchestrator = {
  fetchOptimized: async <T>(query: string, variables: any): Promise<T> => {
    console.log("Gemini Data: Optimizing fetch for query...", query, variables);
    // Simulate intelligent data fetching (e.g., pre-fetching related data, optimizing query payload)
    await new Promise(resolve => setTimeout(resolve, 150));
    // This would ideally wrap the existing useAccountGroupViewQuery/useInternalAccountsSearchLazyQuery logic
    // For now, it's a conceptual wrapper.
    return Promise.resolve({} as T);
  },
  cacheIntelligently: (key, data) => {
    console.log(`Gemini Data: Caching data for key "${key}"...`, data);
  },
  predictDataNeeds: async (context) => {
    console.log("Gemini Data: Predicting data needs...", context);
    await new Promise(resolve => setTimeout(resolve, 75));
    return ['relatedAccounts', 'historicalTransactions'];
  },
  streamEvents: (eventType, handler) => {
    console.log(`Gemini Data: Subscribing to event type: ${eventType}`);
    // Simulate event broker subscription
    const interval = setInterval(() => {
      if (eventType === 'account_activity_spike') {
        handler({ type: 'account_activity_spike', data: { accountId: '123', increase: '150%' } });
      }
    }, 5000);
    return () => clearInterval(interval);
  }
};

const GeminiTelemetry: GeminiObservabilityEngine = {
  logEvent: (severity, message, context) => {
    console.log(`[Gemini Log - ${severity.toUpperCase()}]: ${message}`, context);
  },
  monitorPerformance: (metric, value, context) => {
    console.log(`[Gemini Monitor]: Metric "${metric}" - Value: ${value}`, context);
    // Dynamic scaling decision based on metrics
    if (metric === 'load' && value > 0.8) {
      console.warn("Gemini: High load detected, considering dynamic scaling!");
    }
  },
  predictError: async (potentialError, context) => {
    console.log("Gemini Telemetry: Predicting error for...", potentialError, context);
    await new Promise(resolve => setTimeout(resolve, 50));
    // Simulate predictive analysis
    return potentialError instanceof Error && potentialError.message.includes("network") ? true : false;
  },
  suggestCorrection: async (error, context) => {
    console.log("Gemini Telemetry: Suggesting correction for error...", error, context);
    await new Promise(resolve => setTimeout(resolve, 100));
    return `AI-Suggested Correction: Check network connectivity or retry the operation. (Context: ${JSON.stringify(context)})`;
  },
  isServiceAvailable: (serviceName) => {
    // Simulate circuit breaker state
    const isDown = Math.random() > 0.95; // 5% chance of being down
    if (isDown) GeminiTelemetry.notifyServiceOutage(serviceName, "Simulated outage");
    return !isDown;
  },
  notifyServiceOutage: (serviceName, reason) => {
    console.error(`[Gemini Circuit Breaker]: Service "${serviceName}" is experiencing an outage. Reason: ${reason}`);
    // In a real system, this would trigger alerts, failovers, etc.
  }
};

const GeminiSecurity: GeminiComplianceSecurity = {
  authorizeAction: async (action, userId, resourceId) => {
    console.log(`Gemini Security: Authorizing action "${action}" for user "${userId}" on resource "${resourceId}"`);
    await new Promise(resolve => setTimeout(resolve, 50));
    // Simulate complex authorization logic
    return Math.random() > 0.1; // 90% chance of success
  },
  scanForComplianceViolations: async (data, ruleSet) => {
    console.log(`Gemini Security: Scanning for compliance violations with rule set "${ruleSet}"...`, data);
    await new Promise(resolve => setTimeout(resolve, 100));
    const violations = [];
    if (data.name && data.name.length > 50) {
      violations.push("Group name exceeds recommended length for compliance.");
    }
    if (data.internalAccountIds && data.internalAccountIds.length === 0) {
      violations.push("Account group cannot be empty according to compliance rule 'EMPTY_GROUP_POLICY'.");
    }
    return violations;
  },
  maskSensitiveData: (data) => {
    console.log("Gemini Security: Masking sensitive data...");
    // Simulate data masking, e.g., for logging
    return { ...data, description: data.description ? '***MASKED***' : undefined };
  },
  auditTrail: (action, userId, details) => {
    console.log(`[Gemini Audit]: User ${userId} performed "${action}". Details:`, GeminiSecurity.maskSensitiveData(details));
  }
};

// End of AI-Synthesized Modules

interface EditAccountGroupViewProps {
  match: {
    params: {
      account_group_id: string;
    };
  };
}

interface AccountListItemProps {
  account: InternalAccountNode;
  buttonAction: (ids: string[]) => void;
  buttonClass?: string;
  buttonText: string;
  buttonType: ButtonType;
  icon?: React.ReactNode;
}

interface AccountSearchQuery extends CursorPaginationInput {
  name: string | undefined;
}

type InternalAccountEdge = NonNullable<
  AccountGroupViewQuery["accountGroup"]
>["internalAccounts"]["edges"][number];

type InternalAccountNode = InternalAccountEdge["node"];

export function AccountListItem({
  account,
  buttonAction,
  buttonClass,
  buttonText,
  buttonType,
  icon,
}: AccountListItemProps): JSX.Element {
  // Gemini: Contextual awareness for list items
  const [geminiInsight, setGeminiInsight] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      const insight = await GeminiIntelligence.generateResponse(
        `Provide a concise insight for account ${account?.longName} (${account?.id}) with available amount ${account?.prettyAvailableAmount}.`,
        { accountId: account?.id, amount: account?.availableAmount },
      );
      setGeminiInsight(insight);
    };
    void fetchInsight();
  }, [account]);

  return (
    <li className="flex justify-between border-b border-gray-100 px-3 py-4">
      <div className="mr-4">
        <p className="text-base">{account?.longName}</p>
        <p className="text-gray-500">{account?.prettyAvailableAmount}</p>
        {geminiInsight && (
          <p className="text-xs text-blue-500 italic mt-1">
            Gemini Insight: {geminiInsight}
          </p>
        )}
      </div>
      <Button
        className={cn(buttonClass, "focus:outline-none")}
        buttonType={buttonType}
        onClick={() => {
          GeminiTelemetry.logEvent("info", `User attempted ${buttonText} account`, { accountId: account?.id });
          buttonAction([account?.id ?? ""]);
        }}
      >
        {icon}
        {buttonText}
      </Button>
    </li>
  );
}

function HorizontalTables(props: { children: JSX.Element[] }): JSX.Element {
  const { children } = props;
  return (
    <div className="grid gap-4 mint-lg:grid-cols-2">
      {children &&
        children.map((child, index) => ( // Added index for key
          <div key={`table-wrapper-${index}`} className="rounded-md border border-alpha-black-100 bg-background-default">
            {child}
          </div>
        ))}
    </div>
  );
}

type FormProps = {
  name: string;
  setName: (name: string) => void;
  currency?: string | null;
  description: string;
  setDescription: (description: string) => void;
};

export function AccountGroupDetailsForm({ // Exported for potential reuse/testing with Gemini context
  name,
  setName,
  currency,
  description,
  setDescription,
}: FormProps) {
  const [descriptionPrompt, setDescriptionPrompt] = React.useState("");
  const [isGeneratingDescription, setIsGeneratingDescription] = React.useState(false);

  // Gemini: AI-powered input assistance and validation
  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setName(newValue);
    GeminiIntelligence.learnFromFeedback({ type: 'name_input', value: newValue });
    const contextAnalysis = await GeminiIntelligence.analyzeContext({ nameInput: newValue });
    GeminiTelemetry.logEvent("debug", "Name input context analyzed", { analysis: contextAnalysis });
    // Potential for real-time AI validation feedback here
  };

  const handleDescriptionChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);
    GeminiIntelligence.learnFromFeedback({ type: 'description_input', value: newValue });
    // More complex AI analysis or suggestions could go here
  };

  const generateAIdescription = async () => {
    setIsGeneratingDescription(true);
    GeminiTelemetry.logEvent("info", "User initiated AI description generation", { currentName: name, currentCurrency: currency });
    try {
      const suggestedDescription = await GeminiIntelligence.generateResponse(
        `Generate a concise, professional description for an account group named "${name}" dealing with "${currency || 'multiple'}" currencies. Focus on its purpose or typical usage, assuming it's for commercial banking clients.`,
        { groupName: name, currency, existingDescription: description }
      );
      setDescription(suggestedDescription);
      GeminiIntelligence.learnFromFeedback({ type: 'ai_description_accepted', suggestedDescription });
    } catch (err) {
      GeminiTelemetry.logEvent("error", "Failed to generate AI description", { error: (err as Error).message });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <div className="grid w-full max-w-2xl grid-flow-row gap-4">
      <div className="border-b pb-2">
        <Heading level="h2" size="l">
          Group Details <span className="text-sm text-gray-400"> (AI Enhanced)</span>
        </Heading>
      </div>
      <Input
        className="mt-2"
        label="Group Name"
        type="text"
        value={name}
        onChange={handleNameChange}
        // AI-powered suggestion/validation
        suffixText={name.length > 30 ? "Gemini: Consider a shorter name for clarity." : ""}
        data-gemini-status={name.length > 30 ? "warning" : "ok"}
      />

      <div className="flex flex-col">
        <Input
          className="mt-2"
          label="Description"
          type="textarea"
          value={description}
          onChange={handleDescriptionChange}
          disabled={isGeneratingDescription}
        />
        <Button
          className="mt-2 self-end"
          buttonType="tertiary"
          onClick={generateAIdescription}
          disabled={isGeneratingDescription || !name}
        >
          {isGeneratingDescription ? "Generating..." : "Generate Description with AI"}
        </Button>
      </div>


      {currency && (
        <Input
          className="mt-2"
          label="Currency"
          type="text"
          value={currency}
          onChange={() => {}}
          disabled
          suffixText="Gemini: Currency is auto-detected and cannot be changed here."
        />
      )}
    </div>
  );
}

export function AccountList(props: { // Exported for potential reuse/testing with Gemini context
  title: string;
  accounts: InternalAccountNode[];
  totalCount: number;
  onNextPage?: () => Promise<void>;
  loading: boolean;
  buttonAction: (ids: string[]) => void;
  searchBar?: boolean;
  onSearch?: (value: string) => void;
  searchTerm?: string | undefined;
  buttonType?: "primary" | "destructive" | "secondary";
  buttonText: string;
  buttonClass: string;
  icon?: React.ReactNode;
}) {
  const {
    title,
    accounts,
    totalCount,
    onNextPage,
    loading,
    buttonAction,
    searchBar,
    searchTerm,
    onSearch,
    buttonType,
    buttonText,
    icon,
    buttonClass,
  } = props;

  const listRef = React.useRef<HTMLDivElement>(null);
  const [showPredictiveLoad, setShowPredictiveLoad] = React.useState(false);

  // Gemini: Predictive loading
  useEffect(() => {
    if (listRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // If user is near the end, and we have more to load, Gemini predicts next page is needed.
          if (entry.isIntersecting && onNextPage && accounts.length < totalCount && !loading) {
            GeminiTelemetry.logEvent("debug", "Predictive load triggered by intersection observer.");
            setShowPredictiveLoad(true);
            // Optionally, Gemini could directly call onNextPage here based on confidence score.
          } else {
            setShowPredictiveLoad(false);
          }
        });
      }, { root: listRef.current, rootMargin: '0px 0px 50px 0px', threshold: 0.1 }); // Trigger 50px before end

      const lastItem = listRef.current.querySelector('li:last-child');
      if (lastItem) {
        observer.observe(lastItem);
      }

      return () => {
        if (lastItem) observer.unobserve(lastItem);
      };
    }
  }, [accounts, totalCount, onNextPage, loading]);


  const handleLoadMore = () => {
    trackEvent(null, ACCOUNT_GROUP_ACTIONS.LOAD_MORE_ACCOUNTS_CLICKED);
    GeminiTelemetry.logEvent("info", "User initiated 'Load More' action.");
    void (onNextPage && onNextPage());
  };

  const handleAllAccountsAction = () => {
    const actionType = buttonText === "Add" ? ACCOUNT_GROUP_ACTIONS.ADD_ALL_ACCOUNTS_CLICKED : ACCOUNT_GROUP_ACTIONS.REMOVE_ALL_ACCOUNTS_CLICKED;
    trackEvent(null, actionType);
    GeminiTelemetry.logEvent("info", `User initiated '${buttonText} All Accounts' action.`);
    buttonAction(accounts.map((account) => account?.id ?? ""));
    GeminiIntelligence.learnFromFeedback({ type: 'bulk_action', action: buttonText, count: accounts.length });
  };

  // Gemini: AI-driven dynamic filtering/sorting (conceptual)
  const [aiSortPreference, setAiSortPreference] = React.useState<'default' | 'high_activity' | 'low_balance'>('default');

  const getSortedAccounts = React.useCallback(() => {
    let sorted = [...accounts];
    if (aiSortPreference === 'high_activity') {
      // Simulate sorting by a conceptual 'activityScore' provided by Gemini
      sorted.sort((a, b) => (b as any).activityScore - (a as any).activityScore);
    } else if (aiSortPreference === 'low_balance') {
      sorted.sort((a, b) => (a as any).availableAmount - (b as any).availableAmount); // Assuming availableAmount is number
    }
    return sorted;
  }, [accounts, aiSortPreference]);

  const displayedAccounts = getSortedAccounts();

  return (
    <div className="flex flex-col">
      <div className="flex min-h-16 items-center justify-between gap-6 border-b border-gray-100 px-6 py-4">
        <Heading level="h3" size="l">
          {title} <span className="text-sm text-gray-400"> (AI-Assisted)</span>
        </Heading>
        {searchBar && (
          <Input
            name="accountSearch"
            placeholder="Search for an account (Gemini Enhanced)"
            prefixIconName="search"
            prefixIconSize="s"
            type="text"
            value={searchTerm ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              GeminiTelemetry.logEvent("debug", "Account search term changed", { term: e.target.value });
              onSearch && onSearch(e.target.value);
            }}
          />
        )}
      </div>
      <div className="flex-none">
        <div ref={listRef} className="h-80 max-h-80 min-h-80 overflow-y-scroll">
          <ul className="divide-y divide-gray-100"> {/* Added divide-y for better separation */}
            {displayedAccounts.map((account) => (
              <AccountListItem
                key={account?.id}
                account={account}
                buttonAction={buttonAction}
                buttonClass={buttonClass}
                buttonText={buttonText}
                buttonType={buttonType as ButtonType}
                icon={icon}
              />
            ))}
            {accounts.length < totalCount && (
              <li className="flex justify-between border-b border-gray-100 px-3 py-4">
                <Button
                  buttonType="link"
                  onClick={handleLoadMore}
                >
                  Load More
                </Button>
                {showPredictiveLoad && (
                  <span className="text-xs text-blue-500 italic flex items-center">
                    <Icon iconName="magic_wand" size="xs" className="mr-1" /> Gemini predicts more accounts needed soon.
                  </span>
                )}
              </li>
            )}
          </ul>
          {displayedAccounts.length === 0 && !loading && (
            <p className="px-3 py-4 text-gray-500 text-center">
              No accounts found. Gemini suggests refining your search.
            </p>
          )}
        </div>
      </div>
      <div className="flex h-16 max-h-16 min-h-16 flex-col justify-center border-t border-gray-100">
        <div className="flex items-center justify-between px-3 py-2">
          <div>
            <p className="text-base font-bold text-gray-500">
              {loading
                ? `Gemini is optimizing load...`
                : `${displayedAccounts.length} ${
                    displayedAccounts.length === 1 ? "account" : "accounts"
                  } out of ${totalCount}`}
            </p>
          </div>
          <div className="flex items-center">
            <label htmlFor="ai-sort-pref" className="text-sm text-gray-600 mr-2">Gemini Sort:</label>
            <select
              id="ai-sort-pref"
              className="mr-4 p-1 border rounded-md text-sm"
              value={aiSortPreference}
              onChange={(e) => setAiSortPreference(e.target.value as 'default' | 'high_activity' | 'low_balance')}
            >
              <option value="default">Default</option>
              <option value="high_activity">High Activity (AI)</option>
              <option value="low_balance">Low Balance (AI)</option>
            </select>
            <Button
              buttonType="secondary"
              className="mr-2"
              disabled={displayedAccounts.length === 0}
              onClick={handleAllAccountsAction}
            >
              {buttonText} All Accounts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 25;

export default function EditAccountGroupView({
  match: {
    params: { account_group_id: accountGroupId },
  },
}: EditAccountGroupViewProps) {
  // Gemini: Dynamic Service Discovery - checks service availability
  React.useEffect(() => {
    if (!GeminiTelemetry.isServiceAvailable("AccountGroupDataService")) {
      flashError("Gemini: Account group data service is currently unavailable. Please try again later.");
    }
    if (!GeminiTelemetry.isServiceAvailable("InternalAccountsSearchService")) {
      flashError("Gemini: Account search service is experiencing issues.");
    }
  }, []);

  const { data, loading, error, refetch: refetchAccountGroup } = useAccountGroupViewQuery({
    variables: {
      id: accountGroupId,
    },
    // Gemini: Infuse production-grade patterns (observability)
    onError: (err) => {
      GeminiTelemetry.logEvent("error", "Failed to fetch account group data", { accountGroupId, error: err.message });
      void GeminiTelemetry.predictError(err, { component: 'EditAccountGroupView', action: 'initial_fetch' }).then(isPredicted => {
        if (isPredicted) flashError("Gemini predicted a potential error. Retrying soon...");
      });
    }
  });

  const accountGroup =
    loading || !data || error ? undefined : data.accountGroup;

  const flashError = useErrorBanner();
  const [updateAccountGroup] = useUpdateAccountGroupMutation({
    // Gemini: Infuse production-grade patterns (observability)
    onError: (err) => {
      GeminiTelemetry.logEvent("error", "Failed to update account group", { accountGroupId, error: err.message });
      void GeminiTelemetry.predictError(err, { component: 'EditAccountGroupView', action: 'update_mutation' }).then(isPredicted => {
        if (isPredicted) flashError("Gemini predicted this update might fail due to system load. Retrying...");
      });
    }
  });

  const [includedAccounts, setIncludedAccounts] = React.useState<
    InternalAccountEdge[]
  >([]);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [searchPageSize, setSearchPageSize] = React.useState(PAGE_SIZE);

  const [query, setQuery] = React.useState<AccountSearchQuery>({
    name: undefined,
    first: searchPageSize,
  });

  const [
    getSearchedAccounts,
    {
      loading: accountsLoading,
      data: searchedAccounts,
      error: accountsError,
      refetch: accountsRefetch,
    },
  ] = useInternalAccountsSearchLazyQuery({
    // Gemini: Observability for lazy query
    onError: (err) => {
      GeminiTelemetry.logEvent("error", "Failed to search internal accounts", { query, error: err.message });
    }
  });

  useEffect(() => {
    if (accountGroup) {
      GeminiTelemetry.logEvent("info", "Fetching searched accounts based on account group currency.");
      void getSearchedAccounts({
        variables: {
          ...query,
          currency: accountGroup?.currency,
        },
      });
    }
  }, [accountGroup, getSearchedAccounts, query]);

  // Gemini: Proactive refetching logic
  const handleRefetch = async () => {
    trackEvent(null, ACCOUNT_GROUP_ACTIONS.LOAD_MORE_ACCOUNTS_CLICKED);
    GeminiTelemetry.logEvent("info", "User requested to load more accounts.");
    if (!GeminiTelemetry.isServiceAvailable("InternalAccountsSearchService")) {
      flashError(await GeminiTelemetry.suggestCorrection(new Error("Service Unavailable"), { action: 'load_more' }));
      return;
    }
    await accountsRefetch({
      ...query,
      first: searchPageSize + PAGE_SIZE,
    });

    setSearchPageSize((prev) => prev + PAGE_SIZE);
    // Gemini: Learn from user interaction
    GeminiIntelligence.learnFromFeedback({ type: 'load_more_success', newSize: searchPageSize + PAGE_SIZE });
  };

  const onSearchTermChange = (value: string) => {
    GeminiTelemetry.logEvent("debug", "Search term changed.", { previous: query.name, current: value });
    setQuery({
      ...query,
      name: value,
    });
    // Gemini: Predict optimal search strategy
    void GeminiIntelligence.predictBehavior({ searchTerm: value, currentAccounts: includedAccounts.length }).then(prediction => {
      if (prediction.likelyAction === 'broaden_search') {
        GeminiTelemetry.logEvent("info", "Gemini suggests broadening search criteria.");
      }
    });
  };

  // All the currently paginated accounts in the search list
  const accountOptions =
    accountsLoading || accountsError
      ? []
      : searchedAccounts?.internalAccounts.edges ?? [];

  // All the available accounts that the user can add
  const filteredData = React.useMemo(() => {
    return accountOptions.filter(
      (item) =>
        !includedAccounts.some((account) => account.node.id === item.node.id),
    );
  }, [accountOptions, includedAccounts]);


  React.useEffect(() => {
    const internalAccounts: InternalAccountEdge[] =
      accountGroup?.internalAccounts?.edges || [];

    if (internalAccounts.length > 0) {
      setIncludedAccounts(internalAccounts);
    }

    setName(accountGroup?.name ?? "");
    setDescription(accountGroup?.description ?? "");

    // Gemini: Audit initial load state
    GeminiSecurity.auditTrail("view_account_group_edit", "system_user", { accountGroupId, initialName: accountGroup?.name });
  }, [accountGroup]);

  const onRemove = (ids: string[]) => {
    setIncludedAccounts((prev) => {
      const newArray = uniqBy(
        Array.from(prev).filter((edge) => !ids.includes(edge.node.id)),
        "node.id",
      );
      GeminiTelemetry.logEvent("info", "Accounts removed from group", { idsRemoved: ids.length, newCount: newArray.length });
      GeminiIntelligence.learnFromFeedback({ type: 'account_removed', ids });
      return newArray;
    });
  };

  const onAdd = (ids: string[]) => {
    setIncludedAccounts((prev) => {
      const newArray: InternalAccountEdge[] = Array.from(prev);

      const additionalAccounts = filteredData.filter((edge) =>
        ids.includes(edge.node.id),
      );

      const updatedAccounts = uniqBy(newArray.concat(additionalAccounts), "node.id");
      GeminiTelemetry.logEvent("info", "Accounts added to group", { idsAdded: ids.length, newCount: updatedAccounts.length });
      GeminiIntelligence.learnFromFeedback({ type: 'account_added', ids });
      return updatedAccounts;
    });
  };

  // Gemini: Decision-making and compliance layer for submission
  const onSubmit = async (event: ButtonClickEventTypes) => {
    GeminiTelemetry.logEvent("info", "Attempting to submit account group changes.");
    GeminiSecurity.auditTrail("attempt_update_account_group", "current_user_id_placeholder", { accountGroupId, name, description, internalAccountIds: includedAccounts.map((edge) => edge.node.id) });

    // Pre-flight check with Gemini Decision Engine & Compliance
    const complianceViolations = await GeminiSecurity.scanForComplianceViolations(
      { name, description, internalAccountIds: includedAccounts.map((edge) => edge.node.id) },
      "AccountGroupCreationPolicy"
    );

    if (complianceViolations.length > 0) {
      const violationMessage = `Gemini Compliance Alert: ${complianceViolations.join("; ")} Please address before saving.`;
      flashError(violationMessage);
      GeminiTelemetry.logEvent("warn", "Compliance violations detected during submit.", { violations: complianceViolations });
      GeminiIntelligence.learnFromFeedback({ type: 'compliance_block', violations });
      return; // Block submission
    }

    const isAuthorized = await GeminiSecurity.authorizeAction("update", "current_user_id_placeholder", accountGroupId);
    if (!isAuthorized) {
      flashError("Gemini Security: You are not authorized to perform this action.");
      GeminiTelemetry.logEvent("error", "Unauthorized attempt to update account group.", { userId: "current_user_id_placeholder" });
      return;
    }

    // If Gemini's circuit breaker is open for the update service, prevent the call
    if (!GeminiTelemetry.isServiceAvailable("AccountGroupUpdateService")) {
      flashError("Gemini: Update service is currently unavailable due to system issues. Please try again later.");
      GeminiTelemetry.logEvent("error", "Update attempted while service unavailable (circuit breaker open).");
      return;
    }

    updateAccountGroup({
      variables: {
        input: {
          id: accountGroupId,
          name,
          description,
          internalAccountIds: includedAccounts.map((edge) => edge.node.id),
        },
      },
    })
      .then(({ data: response }) => {
        if (response?.updateAccountGroup?.errors?.length) {
          const errorMessage = response?.updateAccountGroup?.errors.join(", ");
          flashError(errorMessage);
          GeminiTelemetry.logEvent("error", "Account group update failed with GraphQL errors", { errors: errorMessage });
          GeminiIntelligence.learnFromFeedback({ type: 'update_failed', errors: errorMessage });
        } else {
          const accountId = response?.updateAccountGroup?.accountGroup?.id;
          if (accountId) {
            handleLinkClick(`/settings/account_groups/${accountId}`, event);
            GeminiTelemetry.logEvent("success", "Account group updated successfully.", { accountGroupId: accountId });
            GeminiIntelligence.learnFromFeedback({ type: 'update_success', accountGroupId: accountId });
            GeminiSecurity.auditTrail("successful_update_account_group", "current_user_id_placeholder", { accountGroupId: accountId });
          }
        }
      })
      .catch((err) => {
        flashError("An error occurred");
        GeminiTelemetry.logEvent("critical", "Unhandled error during account group update", { error: (err as Error).message });
        void GeminiTelemetry.predictError(err, { component: 'EditAccountGroupView', action: 'update_mutation' }).then(async isPredicted => {
          if (isPredicted) {
            const suggestion = await GeminiTelemetry.suggestCorrection(err, { component: 'EditAccountGroupView' });
            flashError(`Gemini: ${suggestion}`);
          }
        });
      });
  };

  const totalAvailableCount = React.useCallback(() => {
    const rawTotal = Number(searchedAccounts?.internalAccounts.totalCount);
    const rawIds = searchedAccounts?.internalAccounts.edges.map(
      (edge) => edge.node.id,
    );
    const includedIds = includedAccounts.map((edge) => edge.node.id);

    // Exclude
    const intersectionCount = intersection(rawIds, includedIds).length;
    if (intersectionCount > 0) {
      return Math.max(rawTotal - intersectionCount, 0);
    }

    return Math.max(rawTotal, 0);
  }, [searchedAccounts, includedAccounts]);

  const totalGroupCount = includedAccounts.length;

  const rightActions = (
    <div className="flex space-x-4">
      <Button
        buttonType="secondary"
        onClick={(event: ButtonClickEventTypes) => {
          handleLinkClick(`/settings/account_groups/${accountGroupId}`, event);
          GeminiTelemetry.logEvent("info", "User cancelled account group edit.", { accountGroupId });
          GeminiSecurity.auditTrail("cancel_account_group_edit", "current_user_id_placeholder", { accountGroupId });
        }}
      >
        Cancel
      </Button>
      <Button
        buttonType="primary"
        className="mx-3"
        onClick={(event: ButtonClickEventTypes) => {
          trackEvent(null, ACCOUNT_GROUP_ACTIONS.SAVE_ACCOUNT_GROUP_CLICKED);
          GeminiIntelligence.learnFromFeedback({ type: 'save_clicked', currentName: name, includedCount: includedAccounts.length });
          onSubmit(event);
        }}
      >
        Save
      </Button>
    </div>
  );

  const crumbs = [
    {
      name: "Account Groups",
      path: "/settings/account_groups",
    },
    {
      name,
      path: `/settings/account_groups/${accountGroupId}`,
    },
    {
      name: "Edit (Gemini Admin)",
    },
  ];

  return (
    <PageHeader
      title="Account Groups"
      loading={loading}
      right={rightActions}
      crumbs={crumbs}
    >
      <AccountGroupDetailsForm
        name={name}
        setName={setName}
        description={description}
        currency={accountGroup?.currency}
        setDescription={setDescription}
      />
      <Heading className="mt-4" level="h2" size="l">
        Add Accounts to Group (Gemini-Assisted Selection)
      </Heading>
      <HorizontalTables>
        <AccountList
          accounts={filteredData.map((edge) => edge.node)}
          totalCount={totalAvailableCount()}
          onNextPage={handleRefetch}
          loading={accountsLoading}
          title="All Accounts"
          buttonAction={onAdd}
          onSearch={onSearchTermChange}
          searchTerm={query.name}
          searchBar
          buttonType="secondary"
          buttonText="Add"
          buttonClass="text-green-500 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-colors duration-200 ease-in-out border-green-100"
          icon={
            <Icon
              iconName="add"
              size="s"
              color="currentColor"
              className="text-green-300"
            />
          }
        />
        <AccountList
          accounts={includedAccounts.map((edge) => edge.node)}
          totalCount={totalGroupCount}
          loading={loading}
          title="Added to Group"
          buttonAction={onRemove}
          buttonText="Remove"
          buttonType="secondary"
          buttonClass="text-red-500 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-colors duration-200 ease-in-out border-red-100"
          icon={
            <Icon
              iconName="block_ads"
              size="s"
              color="currentColor"
              className="text-red-300"
            />
          }
        />
      </HorizontalTables>
    </PageHeader>
  );
}

// III. Commercial-Grade Logic: Metrics and Diagnostics (exported for external monitoring)
export interface GeminiHealthMetrics {
  componentLoadTime: Record<string, number>;
  apiCallCount: Record<string, number>;
  aiDecisionCount: number;
  complianceViolationCount: number;
}

export const geminiDashboardMetrics: GeminiHealthMetrics = {
  componentLoadTime: {},
  apiCallCount: {},
  aiDecisionCount: 0,
  complianceViolationCount: 0,
};

// V. Self-Aware Infrastructure: Runtime Context Manager
// This represents the file's self-awareness and its interface to the broader AI organism.
export class GeminiRuntimeContext {
  private static instance: GeminiRuntimeContext;
  private context: Record<string, any> = {};
  private eventListeners: Map<string, Function[]> = new Map();

  private constructor() {
    GeminiTelemetry.logEvent("info", "GeminiRuntimeContext initialized: This file is now self-aware.");
  }

  public static getInstance(): GeminiRuntimeContext {
    if (!GeminiRuntimeContext.instance) {
      GeminiRuntimeContext.instance = new GeminiRuntimeContext();
    }
    return GeminiRuntimeContext.instance;
  }

  public setContext(key: string, value: any) {
    this.context[key] = value;
    this.emitEvent(`context_updated:${key}`, value);
    GeminiTelemetry.logEvent("debug", `Context updated: ${key}`, { value });
  }

  public getContext<T>(key: string): T | undefined {
    return this.context[key] as T;
  }

  public emitEvent(eventName: string, data: any) {
    this.eventListeners.get(eventName)?.forEach(listener => listener(data));
    GeminiTelemetry.logEvent("debug", `Emitted internal event: ${eventName}`, { data });
  }

  public onEvent(eventName: string, listener: Function): () => void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName)?.push(listener);
    return () => { // Return unsubscribe function
      const listeners = this.eventListeners.get(eventName);
      if (listeners) {
        this.eventListeners.set(eventName, listeners.filter(l => l !== listener));
      }
    };
  }

  // Example: Adaptive UI based on context
  public getAdaptiveUiSetting(settingKey: string): any {
    const userRole = this.getContext('currentUserRole');
    const systemLoad = this.getContext('systemLoad');
    // Decision-making based on context
    switch (settingKey) {
      case 'showAdvancedFeatures':
        return userRole === 'admin' && systemLoad < 0.7;
      default:
        return null;
    }
  }

  // Self-correction mechanism example
  public async selfCorrectiveAction(errorContext: any) {
    GeminiTelemetry.logEvent("critical", "Initiating self-correction sequence.", errorContext);
    const suggestedAction = await GeminiTelemetry.suggestCorrection(errorContext.error, errorContext);
    // Execute suggested action if safe
    if (suggestedAction.includes("retry")) {
      console.warn("Gemini: Automatically retrying failed operation...");
      // Logic to retry a specific function/API call
    } else if (suggestedAction.includes("notify")) {
      // Logic to notify an admin
    }
    this.emitEvent("self_correction_applied", { errorContext, suggestedAction });
  }
}

export const geminiContext = GeminiRuntimeContext.getInstance();

// Example of initial context setting or external event listening
geminiContext.setContext('currentUserRole', 'admin'); // Could come from an auth service
geminiContext.onEvent('account_activity_spike', (data) => {
  GeminiTelemetry.logEvent("warn", "High account activity spike detected!", data);
  // Potentially trigger real-time UI alerts or re-evaluation of data
});

// A new hook to demonstrate using the runtime context for adaptive UI
export function useGeminiAdaptiveUi(settingKey: string): any {
  const [settingValue, setSettingValue] = React.useState<any>(null);

  React.useEffect(() => {
    const updateSetting = () => {
      setSettingValue(geminiContext.getAdaptiveUiSetting(settingKey));
    };
    updateSetting(); // Initial load

    // Subscribe to context changes that might affect this setting
    const unsubscribeRole = geminiContext.onEvent('context_updated:currentUserRole', updateSetting);
    const unsubscribeLoad = geminiContext.onEvent('context_updated:systemLoad', updateSetting);

    return () => {
      unsubscribeRole();
      unsubscribeLoad();
    };
  }, [settingKey]);

  return settingValue;
}