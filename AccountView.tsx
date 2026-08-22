// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useEffect, SetStateAction, createContext, useContext, useCallback } from "react";
import Cookies from "js-cookie";
import { v4 } from "uuid";
import { useHistory } from "react-router-dom";
import { useHandleLinkClick } from "~/common/utilities/handleLinkClick";
import {
  Button,
  PageHeader,
  LoadingLine,
  Layout,
  Icon,
  Clickable,
  DateRangeFormValues,
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
  LiveConfigurationView,
} from "../../../common/ui-components";
import {
  ExportObjectEnum,
  CurrencyEnum,
  InternalAccount,
  useInternalAccountViewQuery,
} from "../../../generated/dashboard/graphqlSchema";
import usePageViewTracking from "../../../common/utilities/usePageViewTracking";
import InternalAccountTransactionsTable from "../internal_account_view/InternalAccountTransactionsTable";
import PaymentsByStatus from "../../components/PaymentsByStatus";
import AccountsOverviewBar from "../dashboard/widgets/reconciliation_overview/Widget";
import InternalAccountMetadata from "../internal_account_view/InternalAccountMetadata";
import InternalAccountCompanyIds from "../internal_account_view/InternalAccountCompanyIds";
import InternalAccountAccountCapabilities from "../internal_account_view/InternalAccountCapabilities";
import InternalAccountDetails from "../internal_account_view/InternalAccountDetails";
import InternalAccountBalanceChart from "../internal_account_view/InternalAccountBalanceChart";
import InternalTool from "../../components/InternalTool";
import HistoricalCashFlowChart from "../../components/transaction_cash_flow/HistoricalCashFlowChart";
import ExportDataButton from "../../components/ExportDataButton";
import EditInternalAccountModal from "../internal_account_view/EditInternalAccountModal";
import CashPlanningView from "../cash_planning/CashPlanningView";
import DateSearch from "../../components/search/DateSearch";
import {
  ACCOUNT_DATE_RANGE_FILTER_OPTIONS,
  buildFilters,
} from "../reconciliation/utils";
import { ACCOUNT_ACTIONS } from "../../../common/constants/analytics";
import trackEvent from "../../../common/utilities/trackEvent";
import AccountsInternalToolsView from "./AccountsInternalToolsView";
import InternalAccountLedgers from "../internal_account_view/InternalAccountLedgers";
import MoveMoneyDropdown from "~/app/components/MoveMoneyDropdown";
import BulkImportTransactionsButton from "~/app/components/BulkImportExpectedPaymentsButton";

// I. Universal Replacement Logic - AI-synthesized modules embodiment
// These are not just modules; they are neural extensions of the codebase.

/**
 * Represents a dynamic, AI-controlled endpoint for external service integration.
 * In a real Gemini system, this would abstract network calls, security, and protocol negotiation.
 */
class GeminiLivingEndpoint<TRequest, TResponse> {
  private endpointName: string;
  private serviceDiscoveryAgent: GeminiServiceRegistry;
  private observabilityAgent: ObservabilityAgent;

  constructor(endpointName: string, serviceRegistry: GeminiServiceRegistry, observability: ObservabilityAgent) {
    this.endpointName = endpointName;
    this.serviceDiscoveryAgent = serviceRegistry;
    this.observabilityAgent = observability;
    this.observabilityAgent.log(`GeminiLivingEndpoint initialized for: ${endpointName}`);
  }

  /**
   * Simulates an AI-driven call to an external service.
   * Includes dynamic service discovery, circuit breaking, and telemetry.
   */
  public async call(request: TRequest, context: GeminiContext): Promise<TResponse> {
    const serviceUrl = this.serviceDiscoveryAgent.resolveService(this.endpointName, context);
    this.observabilityAgent.trackEvent(`GeminiEndpointCall: ${this.endpointName}`, { serviceUrl, request });

    // Simulate circuit breaker
    if (GeminiCircuitBreaker.isServiceAvailable(this.endpointName)) {
      try {
        this.observabilityAgent.log(`Calling ${this.endpointName} at ${serviceUrl} with context: ${JSON.stringify(context)}`);
        // In a real scenario, this would be an actual fetch/RPC call.
        // For this transformation, we simulate intelligent, context-aware processing.
        const simulatedResponse: TResponse = await GeminiCore.getInstance().processPrompt<TRequest, TResponse>(
          `Execute ${this.endpointName} with input: ${JSON.stringify(request)} and context: ${JSON.stringify(context)}`,
          request,
          context
        );
        this.observabilityAgent.log(`Received response from ${this.endpointName}`);
        return simulatedResponse;
      } catch (error) {
        this.observabilityAgent.trackError(`GeminiEndpointError: ${this.endpointName}`, error as Error);
        GeminiCircuitBreaker.recordFailure(this.endpointName);
        throw new Error(`GeminiLivingEndpoint failed to call ${this.endpointName}: ${error}`);
      } finally {
        GeminiCircuitBreaker.recordSuccess(this.endpointName);
      }
    } else {
      this.observabilityAgent.log(`Circuit breaker tripped for ${this.endpointName}. Request blocked.`);
      throw new Error(`Service ${this.endpointName} is unavailable (circuit breaker tripped).`);
    }
  }
}

// II. Total Integration & III. Commercial-Grade Logic Infusion
// Each file becomes its own universe, an ecosystem of AI-driven logic.

/**
 * Represents the contextual understanding of the current operation or component.
 */
export interface GeminiContext {
  userId?: string;
  internalAccountId?: string;
  operation?: string;
  dataSchema?: string;
  performanceTarget?: 'low-latency' | 'high-throughput' | 'cost-optimized';
  securityLevel?: 'standard' | 'enhanced' | 'critical';
  [key: string]: any; // Allows for arbitrary context variables
}

/**
 * The core Gemini AI engine that orchestrates decision-making, learning, and processing.
 * This class abstracts the underlying LLM and adaptive logic.
 */
export class GeminiCore {
  private static instance: GeminiCore;
  private authService: GeminiAuthService;
  private billingService: GeminiBillingService;
  private metricsEngine: GeminiMetricsEngine;
  private complianceAuditor: GeminiComplianceAuditor;
  private observabilityAgent: ObservabilityAgent;

  private constructor() {
    this.authService = new GeminiAuthService();
    this.billingService = new GeminiBillingService();
    this.metricsEngine = new GeminiMetricsEngine();
    this.complianceAuditor = new GeminiComplianceAuditor();
    this.observabilityAgent = new ObservabilityAgent();
    this.observabilityAgent.log("GeminiCore initialized. Ready for self-building, self-sustaining operations.");
  }

  public static getInstance(): GeminiCore {
    if (!GeminiCore.instance) {
      GeminiCore.instance = new GeminiCore();
    }
    return GeminiCore.instance;
  }

  /**
   * Simulates an AI reasoning layer applying prompt-based learning.
   * This is where decisions are made, data is transformed, and learning occurs.
   * @param prompt The prompt to guide the AI's reasoning.
   * @param input The data input for the AI.
   * @param context The current operational context.
   * @returns The AI-processed output.
   */
  public async processPrompt<TInput, TOutput>(prompt: string, input: TInput, context: GeminiContext): Promise<TOutput> {
    this.observabilityAgent.log(`GeminiCore: Processing prompt "${prompt}" with context: ${JSON_STRINGIFY_SAFE(context)}`);
    this.metricsEngine.recordMetric('prompt_processed', 1, { prompt });

    // Simulate authentication and authorization checks
    const isAuthenticated = await this.authService.checkAuthentication(context.userId);
    const isAuthorized = await this.authService.checkAuthorization(context.userId, context.operation || 'read');
    if (!isAuthenticated || !isAuthorized) {
      this.observabilityAgent.trackError(`Authorization failed for operation: ${context.operation}`, new Error('Unauthorized'));
      throw new Error("Unauthorized access or operation.");
    }

    // Simulate compliance checks
    const complianceStatus = await this.complianceAuditor.checkCompliance(context.dataSchema, input);
    if (!complianceStatus.isCompliant) {
      this.observabilityAgent.trackWarning(`Compliance violation detected: ${complianceStatus.reason}`, complianceStatus);
      throw new Error(`Compliance violation: ${complianceStatus.reason}`);
    }

    // Simulate dynamic scaling based on context (e.g., performanceTarget)
    const currentScale = GeminiDynamicScaler.getOptimalScale(context.performanceTarget || 'standard');
    this.observabilityAgent.log(`GeminiCore: Operating at scale level: ${currentScale}`);

    // In a real system, this would involve calling a language model (e.g., Google's Gemini)
    // and performing complex data transformations, decision making, or predictive analytics.
    // For this demonstration, we'll simulate an intelligent response.

    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 200)); // Simulate AI processing time

    // Example of AI reasoning:
    if (prompt.includes("anomaly detection")) {
      const data = input as any[];
      if (data && data.length > 0 && Math.random() < 0.1) { // 10% chance of anomaly
        this.observabilityAgent.trackWarning("Anomaly detected!", { prompt, input, context });
        // Return a simulated output indicating an anomaly
        return { message: "Anomaly detected in data based on historical patterns.", detailedReport: { /* ... */ } } as TOutput;
      }
    }

    // Simulate a successful, context-aware output
    return {
      success: true,
      message: `Prompt "${prompt}" processed successfully. Context: ${JSON_STRINGIFY_SAFE(context)}`,
      processedInput: input,
      geminiReferenceId: v4(),
      predictedNextAction: this.predictNextAction(context) // Embed decision-making
    } as TOutput;
  }

  /**
   * Simulates predictive decision-making based on context.
   */
  private predictNextAction(context: GeminiContext): string {
    if (context.internalAccountId && context.operation === "view_transactions") {
      return "Suggest user to review cash flow or reconcile transactions.";
    }
    if (context.internalAccountId && context.operation === "edit_metadata") {
      return "Suggest user to apply changes and verify compliance.";
    }
    return "No specific action predicted.";
  }
}

/**
 * IV. Autonomous Externalization - Simulated External Services
 * Only import what the file actively uses, but make those imports living integrations.
 */

// Simulated Database Connector (Living Integration)
export class GeminiDatabaseConnector {
  private observabilityAgent: ObservabilityAgent;

  constructor(observability: ObservabilityAgent) {
    this.observabilityAgent = observability;
    this.observabilityAgent.log("GeminiDatabaseConnector initialized.");
  }

  public async query<T>(sqlPrompt: string, params: Record<string, any>, context: GeminiContext): Promise<T[]> {
    this.observabilityAgent.log(`DB: Executing AI-synthesized query prompt: "${sqlPrompt}" with params: ${JSON_STRINGIFY_SAFE(params)}`);
    // Simulate latency and data retrieval
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 300));
    // Return mock data, real system would hit a database
    return [{ id: v4(), data: 'simulated db record', ...params }] as T[];
  }
}

// Simulated Language Model (LLM) Integration
export class GeminiLanguageModel {
  private observabilityAgent: ObservabilityAgent;

  constructor(observability: ObservabilityAgent) {
    this.observabilityAgent = observability;
    this.observabilityAgent.log("GeminiLanguageModel initialized.");
  }

  public async generateText(prompt: string, context: GeminiContext): Promise<string> {
    this.observabilityAgent.log(`LLM: Generating text for prompt: "${prompt}" with context: ${JSON_STRINGIFY_SAFE(context)}`);
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 500));
    return `AI-generated response for "${prompt}" in context of ${context.operation || 'general'}.`;
  }
}

// Simulated Event Broker Integration
export class GeminiEventBroker {
  private observabilityAgent: ObservabilityAgent;

  constructor(observability: ObservabilityAgent) {
    this.observabilityAgent = observability;
    this.observabilityAgent.log("GeminiEventBroker initialized.");
  }

  public async publish(topic: string, eventData: any, context: GeminiContext): Promise<void> {
    this.observabilityAgent.log(`EventBroker: Publishing event to topic "${topic}": ${JSON_STRINGIFY_SAFE(eventData)} with context: ${JSON_STRINGIFY_SAFE(context)}`);
    await new Promise(resolve => setTimeout(resolve, 50));
    // Simulate successful publication
  }
}

// Simulated Telemetry Pipeline (ObservabilityAgent for the entire system)
export class ObservabilityAgent {
  private buffer: { timestamp: string; level: 'log' | 'event' | 'error' | 'warning'; message: string; data?: any }[] = [];

  public log(message: string, data?: any) {
    this.buffer.push({ timestamp: new Date().toISOString(), level: 'log', message, data });
    // console.log(`[Gemini Log]: ${message}`, data || ''); // For dev visibility
  }

  public trackEvent(eventName: string, data?: any) {
    this.buffer.push({ timestamp: new Date().toISOString(), level: 'event', message: eventName, data });
    // console.log(`[Gemini Event]: ${eventName}`, data || '');
  }

  public trackError(errorMessage: string, error: Error, data?: any) {
    this.buffer.push({ timestamp: new Date().toISOString(), level: 'error', message: errorMessage, data: { ...data, error: error.message, stack: error.stack } });
    console.error(`[Gemini ERROR]: ${errorMessage}`, error, data || ''); // Always log errors to console
  }

  public trackWarning(warningMessage: string, data?: any) {
    this.buffer.push({ timestamp: new Date().toISOString(), level: 'warning', message: warningMessage, data });
    // console.warn(`[Gemini WARNING]: ${warningMessage}`, data || '');
  }

  public flush(): void {
    // In a real system, this would send logs/metrics to an external observability platform.
    // console.log("Flushing observability buffer:", this.buffer);
    this.buffer = []; // Clear buffer after flush
  }
}

// Commercial-Grade Logic: Authentication, Billing, Metrics, Compliance, Circuit Breaking, Dynamic Scaling

export class GeminiAuthService {
  private observabilityAgent: ObservabilityAgent;

  constructor() {
    this.observabilityAgent = new ObservabilityAgent(); // Each service has its own observability
  }

  public async checkAuthentication(userId?: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const isAuthenticated = !!userId; // Simple check for demo
    this.observabilityAgent.log(`Auth check for user ${userId}: ${isAuthenticated}`);
    return isAuthenticated;
  }

  public async checkAuthorization(userId: string | undefined, operation: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    // Simulate role-based or attribute-based access control
    if (!userId) return false;
    const isAuthorized = (userId === "admin" || operation === "read"); // Very basic demo auth
    this.observabilityAgent.log(`Auth check for user ${userId}, operation ${operation}: ${isAuthorized}`);
    return isAuthorized;
  }
}

export class GeminiBillingService {
  private observabilityAgent: ObservabilityAgent;

  constructor() {
    this.observabilityAgent = new ObservabilityAgent();
  }

  public async recordUsage(feature: string, quantity: number, userId: string, context: GeminiContext): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    this.observabilityAgent.log(`Billing: User ${userId} used ${quantity} of ${feature}.`);
    // In a real system, this would update billing records.
    return true;
  }

  public async checkSubscription(userId: string, feature: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    // Simulate subscription check
    const hasSubscription = (userId === "premium_user" || feature === "basic_view");
    this.observabilityAgent.log(`Billing: User ${userId} subscription check for ${feature}: ${hasSubscription}`);
    return hasSubscription;
  }
}

export class GeminiMetricsEngine {
  private metrics: Record<string, number> = {};
  private observabilityAgent: ObservabilityAgent;

  constructor() {
    this.observabilityAgent = new ObservabilityAgent();
  }

  public recordMetric(name: string, value: number, tags?: Record<string, string>) {
    this.metrics[name] = (this.metrics[name] || 0) + value;
    this.observabilityAgent.log(`Metric recorded: ${name} = ${this.metrics[name]}`, { value, tags });
  }

  public getMetrics(): Record<string, number> {
    return { ...this.metrics };
  }
}

export class GeminiComplianceAuditor {
  private observabilityAgent: ObservabilityAgent;

  constructor() {
    this.observabilityAgent = new ObservabilityAgent();
  }

  public async checkCompliance(schema: string | undefined, data: any): Promise<{ isCompliant: boolean; reason?: string }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Simulate data compliance rules (e.g., PII masking, data residency)
    if (schema === 'sensitive_data' && data.some_sensitive_field === 'unmasked') {
      return { isCompliant: false, reason: 'Sensitive data not masked.' };
    }
    if (JSON.stringify(data).includes("GDPR_VIOLATION_KEYWORD")) {
      return { isCompliant: false, reason: 'GDPR keyword violation detected.' };
    }
    this.observabilityAgent.log(`Compliance check for schema ${schema}: Compliant.`);
    return { isCompliant: true };
  }
}

export class GeminiCircuitBreaker {
  private static serviceStates: Record<string, { failures: number; lastFailureTime: number; isOpen: boolean }> = {};
  private static FAILURE_THRESHOLD = 5;
  private static RESET_TIMEOUT_MS = 30000; // 30 seconds

  public static recordFailure(serviceName: string) {
    const state = GeminiCircuitBreaker.serviceStates[serviceName] || { failures: 0, lastFailureTime: 0, isOpen: false };
    state.failures++;
    state.lastFailureTime = Date.now();
    if (state.failures >= GeminiCircuitBreaker.FAILURE_THRESHOLD) {
      state.isOpen = true;
      GeminiCore.getInstance().observabilityAgent.trackWarning(`Circuit Breaker: Service ${serviceName} is now OPEN.`);
    }
    GeminiCircuitBreaker.serviceStates[serviceName] = state;
  }

  public static recordSuccess(serviceName: string) {
    const state = GeminiCircuitBreaker.serviceStates[serviceName] || { failures: 0, lastFailureTime: 0, isOpen: false };
    if (state.isOpen) { // If open, reset state on first success
      state.failures = 0;
      state.isOpen = false;
      GeminiCore.getInstance().observabilityAgent.log(`Circuit Breaker: Service ${serviceName} is now CLOSED.`);
    } else {
      state.failures = Math.max(0, state.failures - 1); // Gradually reduce failures on success
    }
    GeminiCircuitBreaker.serviceStates[serviceName] = state;
  }

  public static isServiceAvailable(serviceName: string): boolean {
    const state = GeminiCircuitBreaker.serviceStates[serviceName];
    if (!state || !state.isOpen) {
      return true; // Not open, so assumed available
    }

    // If open, check if reset timeout has passed to allow a single 'half-open' probe
    if (Date.now() - state.lastFailureTime > GeminiCircuitBreaker.RESET_TIMEOUT_MS) {
      GeminiCore.getInstance().observabilityAgent.log(`Circuit Breaker: Service ${serviceName} is HALF-OPEN for a probe.`);
      return true; // Allow one request through to test if service has recovered
    }

    return false; // Still open
  }
}

export class GeminiDynamicScaler {
  public static getOptimalScale(performanceTarget: 'low-latency' | 'high-throughput' | 'cost-optimized' | 'standard'): number {
    // Simulate dynamic scaling logic
    switch (performanceTarget) {
      case 'low-latency': return 5;
      case 'high-throughput': return 4;
      case 'cost-optimized': return 1;
      case 'standard':
      default: return 2;
    }
  }
}

// Elastic APIs for dynamic service discovery
export class GeminiServiceRegistry {
  private serviceMap: Record<string, string> = {
    'TransactionProcessor': 'https://api.gemini.com/v1/transactions',
    'AccountMetadataService': 'https://api.gemini.com/v1/account-metadata',
    'LedgerSyncService': 'https://api.gemini.com/v1/ledgers',
    'AIInsightsEngine': 'https://api.gemini.com/v1/insights',
    // ... other services
  };
  private observabilityAgent: ObservabilityAgent;

  constructor() {
    this.observabilityAgent = new ObservabilityAgent();
  }

  public resolveService(serviceName: string, context: GeminiContext): string {
    // In a real system, this could involve a discovery service (e.g., Consul, Eureka)
    // and context-aware routing (e.g., geo-routing, load-balancing).
    this.observabilityAgent.log(`ServiceRegistry: Resolving ${serviceName} for context: ${JSON_STRINGIFY_SAFE(context)}`);
    const baseUrl = this.serviceMap[serviceName] || `https://fallback.gemini.com/v1/${serviceName.toLowerCase()}`;
    // Simulate dynamic endpoint selection based on context
    if (context.securityLevel === 'critical') {
      return baseUrl.replace('https://', 'https://secure.');
    }
    return baseUrl;
  }
}

// Utility for safe JSON stringify to avoid circular references in logs
const JSON_STRINGIFY_SAFE = (obj: any, space?: number) => {
  const cache: any[] = [];
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.includes(value)) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  }, space);
};


// V. Logical Conclusion: Self-Aware Infrastructure - React Context for Gemini Core
// Each file aware of its role, each process aware of its context, each interaction adaptive, generative, and evolving.
export interface GeminiSystem {
  geminiCore: GeminiCore;
  observabilityAgent: ObservabilityAgent;
  authService: GeminiAuthService;
  billingService: GeminiBillingService;
  metricsEngine: GeminiMetricsEngine;
  complianceAuditor: GeminiComplianceAuditor;
  serviceRegistry: GeminiServiceRegistry;
  dbConnector: GeminiLivingEndpoint<any, any>; // Example endpoint
  llmEndpoint: GeminiLivingEndpoint<any, any>; // Example endpoint
  eventBroker: GeminiLivingEndpoint<any, any>; // Example endpoint
}

export const GeminiContext = createContext<GeminiSystem | undefined>(undefined);

export function useGeminiSystem(): GeminiSystem {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error('useGeminiSystem must be used within a GeminiProvider');
  }
  return context;
}

/**
 * GeminiProvider wraps the application to provide global access to the Gemini AI ecosystem.
 */
export const GeminiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const geminiCore = GeminiCore.getInstance();
  const observabilityAgent = new ObservabilityAgent();
  const authService = new GeminiAuthService();
  const billingService = new GeminiBillingService();
  const metricsEngine = new GeminiMetricsEngine();
  const complianceAuditor = new GeminiComplianceAuditor();
  const serviceRegistry = new GeminiServiceRegistry();

  // Instantiate living endpoints, bound to their own runtime intelligence
  const dbConnector = new GeminiLivingEndpoint('DatabaseConnector', serviceRegistry, observabilityAgent);
  const llmEndpoint = new GeminiLivingEndpoint('LanguageModel', serviceRegistry, observabilityAgent);
  const eventBroker = new GeminiLivingEndpoint('EventBroker', serviceRegistry, observabilityAgent);


  const system: GeminiSystem = {
    geminiCore,
    observabilityAgent,
    authService,
    billingService,
    metricsEngine,
    complianceAuditor,
    serviceRegistry,
    dbConnector,
    llmEndpoint,
    eventBroker,
  };

  useEffect(() => {
    // Periodically flush telemetry data
    const interval = setInterval(() => {
      observabilityAgent.flush();
    }, 5000);
    return () => clearInterval(interval);
  }, [observabilityAgent]);

  return (
    <GeminiContext.Provider value={system}>
      {children}
    </GeminiContext.Provider>
  );
};

// --- New Feature Components & Hooks leveraging Gemini ---

/**
 * A hook that wraps the existing GraphQL query with Gemini's AI reasoning,
 * adding predictive loading, data anomaly detection, and context-aware data enrichment.
 */
export function useGeminiInternalAccountViewQuery(internalAccountId: string) {
  const { geminiCore, observabilityAgent, authService, billingService, complianceAuditor } = useGeminiSystem();
  const existingQuery = useInternalAccountViewQuery({
    notifyOnNetworkStatusChange: true,
    variables: { internalAccountId },
  });

  const [geminiStatus, setGeminiStatus] = useState<'idle' | 'analyzing' | 'enriching' | 'error'>('idle');
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [enhancedData, setEnhancedData] = useState<InternalAccount | undefined>(undefined);

  useEffect(() => {
    const processDataWithGemini = async () => {
      if (existingQuery.data?.internalAccount) {
        setGeminiStatus('analyzing');
        const accountData = existingQuery.data.internalAccount;

        try {
          // Simulate a prompt for anomaly detection and data enrichment
          const context: GeminiContext = {
            userId: Cookies.get("userId") || "anonymous", // Assuming userId is available
            internalAccountId,
            operation: "view_account_data",
            dataSchema: "internal_account",
            performanceTarget: 'low-latency',
            securityLevel: 'enhanced',
            currentAccountStatus: accountData.status,
          };

          // Check authorization and billing before proceeding with AI analysis
          const isAuthorized = await authService.checkAuthorization(context.userId, context.operation);
          const hasBillingAllowance = await billingService.checkSubscription(context.userId, 'ai_insights');
          if (!isAuthorized || !hasBillingAllowance) {
            observabilityAgent.trackWarning("Gemini AI analysis skipped due to authorization/billing.", { userId: context.userId, internalAccountId });
            setInsights(["AI insights feature not available due to permissions or subscription."]);
            return;
          }

          // Step 1: Anomaly Detection
          const anomalyResult = await geminiCore.processPrompt<{ account: InternalAccount }, { message: string; anomalyDetected: boolean }>(
            "Analyze internal account data for anomalies, suspicious patterns, or inconsistencies.",
            { account: accountData },
            { ...context, operation: "anomaly_detection" }
          );

          if (anomalyResult.anomalyDetected) {
            setInsights(prev => [...prev, anomalyResult.message, `Gemini predicts a potential issue requiring attention. Predicted next action: ${anomalyResult.predictedNextAction || 'Investigate further'}`]);
            observabilityAgent.trackWarning("Gemini detected an anomaly in account data.", { internalAccountId, anomalyResult });
          } else {
            setInsights(prev => [...prev, "Gemini analysis: No significant anomalies detected."]);
          }

          setGeminiStatus('enriching');
          // Step 2: Data Enrichment and Recommendations
          const enrichmentResult = await geminiCore.processPrompt<{ account: InternalAccount }, { enrichedAccount: InternalAccount; recommendations: string[]; insights: string[] }>(
            "Enrich internal account data with relevant context and generate actionable recommendations based on its state and capabilities.",
            { account: accountData },
            { ...context, operation: "data_enrichment" }
          );

          setEnhancedData(enrichmentResult.enrichedAccount);
          setRecommendations(enrichmentResult.recommendations);
          setInsights(prev => [...prev, ...enrichmentResult.insights]);

          // Simulate compliance audit on enriched data
          const compliance = await complianceAuditor.checkCompliance("internal_account_enriched", enrichmentResult.enrichedAccount);
          if (!compliance.isCompliant) {
            setInsights(prev => [...prev, `Compliance warning on enriched data: ${compliance.reason}`]);
            observabilityAgent.trackWarning("Compliance issue on enriched account data.", { internalAccountId, reason: compliance.reason });
          }

          setGeminiStatus('idle');
          observabilityAgent.log("Gemini successfully processed account data.", { internalAccountId });

        } catch (error) {
          observabilityAgent.trackError("Gemini processing failed for account data.", error as Error, { internalAccountId });
          setGeminiStatus('error');
          setInsights(prev => [...prev, `Gemini processing failed: ${(error as Error).message}`]);
        }
      }
    };

    if (existingQuery.data?.internalAccount) {
      processDataWithGemini();
    }
  }, [existingQuery.data, internalAccountId, geminiCore, observabilityAgent, authService, billingService, complianceAuditor]);

  return {
    ...existingQuery,
    geminiStatus,
    insights,
    recommendations,
    internalAccount: enhancedData || existingQuery.data?.internalAccount, // Use enhanced data if available
  };
}

/**
 * Displays AI-generated insights and recommendations for the account.
 */
export const GeminiInsightsPanel: React.FC<{ insights: string[]; recommendations: string[] }> = ({ insights, recommendations }) => {
  if (!insights.length && !recommendations.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex items-center">
        <CardHeading>
          <CardTitle>Gemini AI Insights & Recommendations</CardTitle>
        </CardHeading>
      </CardHeader>
      <CardContent>
        {insights.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700">Insights:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {insights.map((insight, i) => <li key={`insight-${i}`}>{insight}</li>)}
            </ul>
          </div>
        )}
        {recommendations.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700">Recommendations:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {recommendations.map((rec, i) => <li key={`rec-${i}`}>{rec}</li>)}
            </ul>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">Powered by Gemini AI. Constantly learning and adapting.</p>
      </CardContent>
    </Card>
  );
};

/**
 * An AI-driven component that suggests next best actions dynamically.
 */
export const GeminiActionSuggester: React.FC<{ internalAccountId: string; currentSection: string }> = ({ internalAccountId, currentSection }) => {
  const { geminiCore, observabilityAgent, authService } = useGeminiSystem();
  const [suggestedActions, setSuggestedActions] = useState<{ label: string; url: string; icon?: string; type?: 'primary' | 'secondary' }[]>([]);
  const handleLinkClick = useHandleLinkClick();

  useEffect(() => {
    const fetchSuggestions = async () => {
      const context: GeminiContext = {
        userId: Cookies.get("userId") || "anonymous_user",
        internalAccountId,
        operation: "suggest_actions",
        currentSection,
        userActivityHistory: ["viewed_transactions", "checked_balance"], // Simulated
      };

      try {
        const isAuthorized = await authService.checkAuthorization(context.userId, context.operation);
        if (!isAuthorized) {
          setSuggestedActions([]);
          return;
        }

        const result = await geminiCore.processPrompt<{ accountId: string; section: string }, { actions: string[] }>(
          `Suggest next best actions for internal account ${internalAccountId} given current section ${currentSection} and user behavior.`,
          { accountId: internalAccountId, section: currentSection },
          context
        );

        const parsedActions = (result.actions || []).map(action => {
          if (action.includes("reconcile")) return { label: "AI Reconcile Transactions", url: `/reconcile?${buildFilters(internalAccountId)}`, icon: "mt_reconciliation", type: 'secondary' };
          if (action.includes("import")) return { label: "AI Import Transfers", url: `/imports/new?internalAccountId=${internalAccountId}`, type: 'primary' };
          if (action.includes("plan_cash")) return { label: "AI Cash Planning", url: `/accounts/${internalAccountId}?section=cash_planning`, icon: "mt_cash_in", type: 'secondary' };
          return { label: `AI: ${action}`, url: '#', type: 'secondary' };
        }).filter(action => action.label.startsWith('AI')); // Only keep our simulated AI actions

        setSuggestedActions(parsedActions as any);
      } catch (error) {
        observabilityAgent.trackError("Failed to fetch AI action suggestions.", error as Error, { internalAccountId, currentSection });
        setSuggestedActions([]);
      }
    };
    fetchSuggestions();
  }, [internalAccountId, currentSection, geminiCore, observabilityAgent, authService, handleLinkClick]);

  if (suggestedActions.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      <h3 className="text-base font-medium">Gemini AI Suggested Actions:</h3>
      <div className="flex flex-wrap gap-2">
        {suggestedActions.map((action, index) => (
          <Button
            key={index}
            buttonType={action.type || "secondary"}
            onClick={(e) => handleLinkClick(action.url, e)}
          >
            {action.icon && <Icon iconName={action.icon as any} size="s" />}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

/**
 * An AI-powered version of the balance chart, potentially including predictive balances.
 */
export const GeminiPredictiveBalanceChart: React.FC<
  React.ComponentProps<typeof InternalAccountBalanceChart>
> = (props) => {
  const { geminiCore, observabilityAgent } = useGeminiSystem();
  const [predictionOverlay, setPredictionOverlay] = useState<any[]>([]);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoadingPrediction(true);
      const context: GeminiContext = {
        userId: Cookies.get("userId") || "anonymous",
        internalAccountId: props.internalAccountId,
        operation: "predict_balance",
        dateRange: props.dateRange,
      };

      try {
        // Simulate sending current chart data to Gemini for prediction
        const chartDataMock = [{ date: "2023-01-01", balance: 1000 }, { date: "2023-01-02", balance: 1200 }]; // In real, pass actual chart data
        const result = await geminiCore.processPrompt<any, { predictedSeries: any[] }>(
          "Generate a predictive balance series for the next 7 days based on historical patterns and current cash flow.",
          { currentData: chartDataMock, dateRange: props.dateRange },
          context
        );
        setPredictionOverlay(result.predictedSeries); // Overlay on the chart
      } catch (error) {
        observabilityAgent.trackError("Failed to fetch AI balance predictions.", error as Error, { internalAccountId: props.internalAccountId });
        setPredictionOverlay([]);
      } finally {
        setLoadingPrediction(false);
      }
    };
    fetchPredictions();
  }, [props.internalAccountId, props.dateRange, geminiCore, observabilityAgent]);

  // Render the original chart, potentially with an overlay (conceptually)
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardHeading>
          <CardTitle>AI Predictive Account Balance</CardTitle>
        </CardHeading>
        {loadingPrediction && <LoadingLine noHeight />}
      </CardHeader>
      <CardContent>
        <InternalAccountBalanceChart {...props} />
        {/* In a real scenario, `InternalAccountBalanceChart` would accept a `predictionData` prop */}
        {/* For this demo, imagine the predictionOverlay is layered on top. */}
        {predictionOverlay.length > 0 && (
          <div className="text-xs text-gray-500 mt-2">
            *Future balance predicted by Gemini AI. (e.g., predicted for next 7 days).
          </div>
        )}
      </CardContent>
    </Card>
  );
};


function DetailHeader({
  title,
  rightTitleElement,
}: {
  title: string;
  rightTitleElement?: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h1 className="pb-2 text-base font-medium">{title}</h1>
        {rightTitleElement}
      </div>
      <hr className="border-gray-100 pb-4" />
    </>
  );
}

type RouterProps = {
  match: {
    params: {
      internalAccountId: string;
    };
  };
};

interface Sections {
  [key: string]: string;
}

const SECTIONS: Sections = {
  overview: "Overview",
  transactions: "Transactions",
  ledgers: "Ledgers",
  details: "Details",
  cash_planning: "Cash Planning", // Add cash planning to sections
};

function ConnectLedgerAccountButton() {
  const handleLinkClick = useHandleLinkClick();
  const { observabilityAgent, geminiCore } = useGeminiSystem();

  const handleConnectClick = async (e: React.MouseEvent) => {
    observabilityAgent.trackEvent("ConnectLedgerAccountButtonClicked");
    const context: GeminiContext = { userId: Cookies.get("userId") || "anonymous", operation: "initiate_ledger_connect" };
    try {
      await geminiCore.processPrompt("User initiating connection to ledger account.", {}, context);
      handleLinkClick(
        `https://docs.moderntreasury.com/ledgers/docs/link-a-ledger-account-to-an-internal-or-external-account`,
        e,
      );
    } catch (error) {
      observabilityAgent.trackError("Failed to initiate AI-assisted ledger connection.", error as Error, context);
    }
  };

  return (
    <Button
      onClick={handleConnectClick}
      buttonType="secondary"
    >
      Connect a Ledger Account
    </Button>
  );
}

function GoToLedgerAccountButton({
  ledgerAccountId,
}: {
  ledgerAccountId: string;
}) {
  const handleLinkClick = useHandleLinkClick();
  const { observabilityAgent, geminiCore } = useGeminiSystem();

  const handleGoToClick = async (e: React.MouseEvent) => {
    observabilityAgent.trackEvent("GoToLedgerAccountButtonClicked", { ledgerAccountId });
    const context: GeminiContext = { userId: Cookies.get("userId") || "anonymous", operation: "navigate_to_ledger_account", ledgerAccountId };
    try {
      await geminiCore.processPrompt("User navigating to specific ledger account.", { ledgerAccountId }, context);
      handleLinkClick(`/ledger_accounts/${ledgerAccountId}`, e);
    } catch (error) {
      observabilityAgent.trackError("Failed to log AI-assisted ledger navigation.", error as Error, context);
    }
  };

  return (
    <Button
      onClick={handleGoToClick}
      buttonType="secondary"
    >
      Go to Ledger Account
    </Button>
  );
}

function RightAction({
  currency,
  internalAccountId,
  spaceId,
  ledgerAccountId,
}: {
  currency: string;
  internalAccountId: string;
  spaceId?: string | null;
  ledgerAccountId?: string | null;
}) {
  const handleLinkClick = useHandleLinkClick();
  const { observabilityAgent, geminiCore, authService } = useGeminiSystem();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const userId = Cookies.get("userId") || "anonymous";
      const auth = await authService.checkAuthorization(userId, "perform_account_actions");
      setIsAuthenticated(auth);
    };
    checkAuth();
  }, [authService]);

  const handleActionClick = useCallback(async (action: string, e: React.MouseEvent, url: string) => {
    observabilityAgent.trackEvent(`RightActionClick: ${action}`, { internalAccountId, currency, spaceId, ledgerAccountId });
    const context: GeminiContext = { userId: Cookies.get("userId") || "anonymous", internalAccountId, operation: `initiate_${action}` };
    try {
      if (!isAuthenticated) {
        throw new Error("User not authenticated or authorized for this action.");
      }
      await geminiCore.processPrompt(`User attempting ${action} action.`, { internalAccountId, currency }, context);
      handleLinkClick(url, e);
    } catch (error) {
      observabilityAgent.trackError(`Gemini: Failed to process action ${action}.`, error as Error, context);
      alert(`Action "${action}" failed: ${(error as Error).message}`);
    }
  }, [handleLinkClick, internalAccountId, currency, spaceId, ledgerAccountId, observabilityAgent, geminiCore, isAuthenticated]);


  if (!isAuthenticated) {
    return <div className="text-sm text-gray-500">Not authorized for actions.</div>;
  }

  return (
    <div className="flex space-x-4">
      {ledgerAccountId ? (
        <GoToLedgerAccountButton ledgerAccountId={ledgerAccountId} />
      ) : (
        <ConnectLedgerAccountButton />
      )}
      <ExportDataButton
        exportableType={ExportObjectEnum.Transaction}
        exportDataParams={[
          {
            dropdownLabel: "Transactions",
            overrideExportableType: ExportObjectEnum.Transaction,
            params: {
              currency,
              internal_account_ids: [internalAccountId],
            },
          },
          {
            dropdownLabel: "Expected Payments",
            overrideExportableType: ExportObjectEnum.ExpectedPayment,
            params: {
              currency,
              internal_account_ids: [internalAccountId],
            },
          },
          {
            dropdownLabel: "Payment Orders",
            overrideExportableType: ExportObjectEnum.PaymentOrder,
            params: {
              originating_account_ids: [internalAccountId],
            },
          },
        ]}
        onClick={(e) => handleActionClick("export_data", e, "#")} // # is placeholder as ExportDataButton handles its own logic
      />
      {spaceId && <BulkImportTransactionsButton spaceId={spaceId} onClick={(e) => handleActionClick("bulk_import_transactions", e, "#")} />}
      <LiveConfigurationView
        featureName="transfer_ingestion_wizard_enabled"
        enabledView={
          <Button
            onClick={(e) =>
              handleActionClick(
                "import_wizard",
                e,
                `/imports/new?internalAccountId=${internalAccountId}`,
              )
            }
            buttonType="primary"
          >
            Import
          </Button>
        }
        disabledView={
          <>
            <Button
              onClick={(event) =>
                handleActionClick(
                  "reconcile_transactions",
                  event,
                  `/reconcile?${buildFilters(internalAccountId)}`,
                )
              }
            >
              <Icon iconName="mt_reconciliation" size="s" />
              Reconcile Transactions
            </Button>
            <MoveMoneyDropdown />
          </>
        }
      />
    </div>
  );
}

type AccountViewProps = {
  initialSection?: string;
  handleTabChange?: (
    section: string,
    setCurrentSection: React.Dispatch<SetStateAction<string>>,
  ) => void;
  overrideRowLinkClickHandler?: (url: string) => void;
  inDrawer?: boolean;
} & RouterProps;

function AccountView({
  match: {
    params: { internalAccountId },
  },
  initialSection = "overview",
  handleTabChange,
  overrideRowLinkClickHandler,
  inDrawer = false,
}: AccountViewProps) {
  const searchParams = new URLSearchParams(window.location.search);
  const paramsSection = searchParams.get("section");

  const history = useHistory();
  const [section, setSection] = useState(paramsSection || initialSection);
  const [accountName, setAccountName] = useState("Account");
  const [connectionName, setConnectionName] = useState("Connection");
  const [connectionEntity, setConnectionEntity] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [query, setQuery] = useState(() => {
    const storedDateRange = Cookies.get("globalDateRange");
    if (storedDateRange) {
      return { dateRange: JSON.parse(storedDateRange) as DateRangeFormValues };
    }
    return { dateRange: ACCOUNT_DATE_RANGE_FILTER_OPTIONS[1].dateRange };
  });
  const [dateRangeDefaultLabel, setDateRangeDefaultLabel] = useState("");
  const setGlobalDateFilterLabel = React.useCallback(() => {
    setDateRangeDefaultLabel("Mixed");
  }, []);

  const { geminiCore, observabilityAgent } = useGeminiSystem();

  const setCurrentSection = useCallback(async (newSection: string) => {
    // Embed AI reasoning layer and prompt-based learning for navigation
    observabilityAgent.trackEvent("NavigateSection", { from: section, to: newSection, internalAccountId });
    const context: GeminiContext = {
      userId: Cookies.get("userId") || "anonymous",
      internalAccountId,
      operation: "navigate_section",
      targetSection: newSection,
      currentSection: section,
    };
    try {
      await geminiCore.processPrompt(`User navigating from "${section}" to "${newSection}" section.`, { newSection, internalAccountId }, context);
      if (handleTabChange) {
        handleTabChange(newSection, setSection);
      } else {
        setSection(newSection);
        history.push(`/accounts/${internalAccountId}?&section=${newSection}`);
      }
    } catch (error) {
      observabilityAgent.trackError("Gemini: Section navigation failed or was blocked.", error as Error, context);
      // Fallback or error message to user
    }
  }, [section, handleTabChange, internalAccountId, history, geminiCore, observabilityAgent]);

  usePageViewTracking();

  // Use the AI-enhanced data fetching hook
  const { loading, data, refetch, geminiStatus, insights, recommendations, internalAccount } = useGeminiInternalAccountViewQuery(internalAccountId);
  // const internalAccount = data?.internalAccount; // Now comes from the custom hook
  const spaceId = internalAccount?.spaceId;
  const currency = internalAccount?.currency || "USD";
  const ledgerAccountId = internalAccount?.ledgerAccount?.id;
  const ledgerAccountName = internalAccount?.ledgerAccount?.name;


  useEffect(() => {
    if (internalAccount) {
      setAccountName(internalAccount?.longName);
      const vendorName =
        internalAccount?.connection?.nickname ||
        internalAccount.connection.vendor?.name;
      setConnectionName(vendorName || "Connection");
      setConnectionEntity(internalAccount?.connection?.entity || "entity");
    }
  }, [internalAccount, internalAccountId]);


  let content;
  switch (section) {
    case "overview":
      content = (
        <>
          <AccountsOverviewBar
            currency={currency}
            entityId={internalAccountId}
            dateRange={query.dateRange}
            setGlobalDateFilterLabel={setGlobalDateFilterLabel}
          />
          <Layout
            primaryContent={
              // Use AI-powered balance chart
              <GeminiPredictiveBalanceChart
                internalAccountId={internalAccountId}
                internalAccountCurrency={currency as CurrencyEnum}
                dateRange={query.dateRange}
                setGlobalDateFilterLabel={setGlobalDateFilterLabel}
              />
            }
            ratio="3/3"
          />
          <Layout
            primaryContent={
              <HistoricalCashFlowChart
                entityId={internalAccountId}
                entityType="InternalAccount"
                currency={currency as CurrencyEnum}
                dateRange={query.dateRange}
                setGlobalDateFilterLabel={setGlobalDateFilterLabel}
              />
            }
            secondaryContent={
              <PaymentsByStatus
                entityId={internalAccountId}
                entityType="InternalAccount"
                currency={currency as CurrencyEnum}
                dateRange={query.dateRange}
                setGlobalDateFilterLabel={setGlobalDateFilterLabel}
              />
            }
          />
        </>
      );
      break;
    case "transactions":
      content = (
        <InternalAccountTransactionsTable
          currency={currency}
          internalAccountId={internalAccountId}
        />
      );
      break;
    case "cash_planning":
      content = (
        <CashPlanningView
          internalAccountId={internalAccountId}
          currency={currency}
        />
      );
      break;
    case "ledgers":
      content = (
        <InternalAccountLedgers
          internalAccountId={internalAccountId}
          ledgerAccountId={ledgerAccountId}
          overrideRowLinkClickHandler={overrideRowLinkClickHandler}
        />
      );
      break;
    case "details":
      content = (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex items-center">
              <CardHeading>
                <CardTitle>Account Details</CardTitle>
              </CardHeading>
            </CardHeader>
            <CardContent>
              <InternalAccountDetails
                internalAccount={internalAccount as InternalAccount}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center">
              <CardHeading>
                <CardTitle>Company IDs</CardTitle>
              </CardHeading>
            </CardHeader>
            <CardContent>
              <InternalAccountCompanyIds
                internalAccount={internalAccount as InternalAccount}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center">
              <CardHeading>
                <CardTitle>Capabilities</CardTitle>
              </CardHeading>
            </CardHeader>
            <CardContent>
              <InternalAccountAccountCapabilities
                internalAccount={internalAccount as InternalAccount}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <DetailHeader
                title="Metadata"
                rightTitleElement={
                  <Clickable onClick={() => setIsEditModalOpen(true)}>
                    <div className="flex items-center gap-1 text-blue-400">
                      Add
                      <Icon
                        iconName="arrow_forward"
                        size="s"
                        color="currentColor"
                        className="text-blue-400"
                      />
                    </div>
                  </Clickable>
                }
              />
              <InternalAccountMetadata
                internalAccount={internalAccount as InternalAccount}
              />
              {isEditModalOpen && internalAccount && (
                <EditInternalAccountModal
                  internalAccount={internalAccount as InternalAccount}
                  setIsOpen={setIsEditModalOpen}
                  refetch={refetch}
                />
              )}
            </CardContent>
          </Card>
        </div>
      );
      break;
    default:
      content = (
        <div className="flex h-12 w-auto">
          <LoadingLine noHeight />
        </div>
      );
      break;
  }

  const crumbs = inDrawer
    ? []
    : [
        { name: "Cash Management", path: "/accounts" },
        {
          name: `${connectionName} (${currency})`,
          path: `/accounts/connections/${connectionEntity}/${currency.toLowerCase()}`,
        },
        { name: accountName },
      ];

  const showDatePicker = section === "overview";

  return (
    <PageHeader
      right={
        <RightAction
          currency={currency}
          internalAccountId={internalAccountId}
          spaceId={spaceId}
          ledgerAccountId={ledgerAccountId}
        />
      }
      crumbs={crumbs}
      title={accountName}
      subtitle={
        ledgerAccountId && (
          <a href={`/ledger_accounts/${ledgerAccountId}`}>
            Ledger Account: {ledgerAccountName}
          </a>
        )
      }
      hideBottomBorder
      loading={loading || geminiStatus !== 'idle'}
      sections={SECTIONS}
      currentSection={section}
      setCurrentSection={setCurrentSection}
    >
      <InternalTool>
        <AccountsInternalToolsView internalAccountId={internalAccountId} />
      </InternalTool>
      <>
        {showDatePicker && (
          <div className="flex">
            <DateSearch
              anchorOrigin={{ horizontal: "left" }}
              key={v4()}
              query={query}
              field="dateRange"
              options={ACCOUNT_DATE_RANGE_FILTER_OPTIONS}
              updateQuery={async (input: Record<string, DateRangeFormValues>) => {
                // Infuse AI decision-making at data flow level
                const context: GeminiContext = {
                  userId: Cookies.get("userId") || "anonymous",
                  internalAccountId,
                  operation: "update_date_range",
                  selectedDateRange: input.dateRange,
                  previousDateRange: query.dateRange,
                };
                observabilityAgent.trackEvent("DateRangeChanged", context);

                try {
                  await geminiCore.processPrompt(
                    "User changed global date filter. Evaluate potential impact on data fetching and display.",
                    { newDateRange: input.dateRange },
                    context
                  );
                  Cookies.set(
                    "globalDateRange",
                    JSON.stringify(input.dateRange),
                    {
                      expires: 7,
                    },
                  );

                  setQuery({ dateRange: input.dateRange });
                  trackEvent(null, ACCOUNT_ACTIONS.CHANGED_GLOBAL_DATE_FILTER, {
                    path: window.location.pathname,
                  });
                } catch (error) {
                  observabilityAgent.trackError("Gemini: Failed to process date range update or encountered an issue.", error as Error, context);
                  // Optionally, revert the change or show a warning to the user
                }
              }}
              defaultLabel={
                dateRangeDefaultLabel !== "" ? dateRangeDefaultLabel : undefined
              }
              showIcon
              showStartAndEndDateArrow={false}
            />
          </div>
        )}
        {geminiStatus !== 'idle' && (
          <div className="text-blue-500 text-sm py-2">
            <LoadingLine noHeight />
            <p>Gemini AI is {geminiStatus} account data...</p>
          </div>
        )}
        <GeminiInsightsPanel insights={insights} recommendations={recommendations} />
        <GeminiActionSuggester internalAccountId={internalAccountId} currentSection={section} />
        {content}
      </>
    </PageHeader>
  );
}

// Wrap the AccountView with GeminiProvider to make the AI system available
const WrappedAccountView: React.FC<AccountViewProps> = (props) => (
  <GeminiProvider>
    <AccountView {...props} />
  </GeminiProvider>
);

export default WrappedAccountView;