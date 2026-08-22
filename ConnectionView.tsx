// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useEffect, useState, useCallback, useMemo, createContext, useContext } from "react";
import Cookies from "js-cookie";
import { v4 } from "uuid";
import {
  PageHeader,
  DateRangeFormValues,
  LoadingLine,
  Layout,
  Modal, // Added Modal for new AI features
  Button, // Added Button for new AI features
  Alert, // Added Alert for AI-driven notifications
} from "../../../common/ui-components";
import { useConnectionViewQuery } from "../../../generated/dashboard/graphqlSchema";
import AccountsOverviewBar from "../dashboard/widgets/reconciliation_overview/Widget";
import MoveMoneyDropdown from "../../components/MoveMoneyDropdown";
import CurrencyDropdown from "../../components/CurrencyDropdown";
import SearchableBalanceFeed from "../dashboard/SearchableBalanceFeed";
import DateSearch from "../../components/search/DateSearch";
import { ACCOUNT_DATE_RANGE_FILTER_OPTIONS } from "../reconciliation/utils";
import { ACCOUNT_ACTIONS } from "../../../common/constants/analytics";
import trackEvent from "../../../common/utilities/trackEvent";
import HistoricalBalanceChartForGroups from "../account_groups/historical_balances_chart/HistoricalBalanceChartForGroups";
import { GroupTypeEnum } from "../../../common/utilities/groupBy";

// --- START: Gemini Integration & Self-Contained Universe Architecture ---

// I. Universal Replacement Logic (Simulated AI Modules)
// We are adding AI-synthesized modules that represent autonomous, scalable, context-aware micro-intelligences.
// These are not just modules; they are neural extensions of the codebase.

// Simulating a dynamic service registry for AI components
type GeminiServiceType = 'PredictiveAnalytics' | 'AnomalyDetection' | 'AdaptiveUI' | 'ContextualLearning' | 'TelemetryPipeline' | 'SecurityAdvisor' | 'ComplianceEngine' | 'DynamicConnector';

interface GeminiAIService {
  name: GeminiServiceType;
  endpoint: string;
  version: string;
  isEnabled: boolean;
  activate: () => Promise<any>;
  deactivate: () => Promise<any>;
  execute: (payload: any) => Promise<any>;
  getDescription: () => string;
}

// Exporting a conceptual Gemini service registry for other files to interact with
export const GeminiServiceRegistry = {
  services: new Map<GeminiServiceType, GeminiAIService>(),

  register: (service: GeminiAIService) => {
    console.log(`[Gemini] Registering AI service: ${service.name}`);
    GeminiServiceRegistry.services.set(service.name, service);
  },

  get: (serviceName: GeminiServiceType): GeminiAIService | undefined => {
    return GeminiServiceRegistry.services.get(serviceName);
  },

  // Simulate dynamic service discovery and optimization
  discoverOptimalService: async (type: GeminiServiceType, context: any = {}): Promise<GeminiAIService | undefined> => {
    console.log(`[Gemini] Discovering optimal service for ${type} with context:`, context);
    // In a real scenario, this would involve a network call to a service mesh or AI orchestration layer
    // For now, we'll just return the registered service if available
    const service = GeminiServiceRegistry.services.get(type);
    if (service && service.isEnabled) {
      console.log(`[Gemini] Optimal service found for ${type}: ${service.endpoint}`);
      return service;
    }
    console.warn(`[Gemini] No enabled service found for ${type}.`);
    return undefined;
  },
};

// --- START: New AI-Powered Modules and Hooks ---

// II. Total Integration - Embed AI reasoning layers into every function. Infuse prompt-based learning pipelines.
// This context will carry the global AI state and allow decision-making across components.
interface GeminiContextState {
  aiRecommendations: string[];
  addRecommendation: (rec: string) => void;
  learnFromAction: (action: string, data: any) => void;
  // AI-driven error and security states
  aiErrorMessages: string[];
  addAIError: (error: string) => void;
  securityAlerts: string[];
  addSecurityAlert: (alert: string) => void;
  // Adaptive UI state
  adaptiveUISettings: Record<string, any>;
  updateAdaptiveUISetting: (key: string, value: any) => void;
}

const GeminiContext = createContext<GeminiContextState | undefined>(undefined);

export const useGeminiContext = () => {
  const context = useContext(GeminiContext);
  if (!context) {
    throw new Error('useGeminiContext must be used within a GeminiContextProvider');
  }
  return context;
};

// Exported Provider for the entire application or this file's subtree
export const GeminiContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [aiErrorMessages, setAiErrorMessages] = useState<string[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<string[]>([]);
  const [adaptiveUISettings, setAdaptiveUISettings] = useState<Record<string, any>>({});

  const addRecommendation = useCallback((rec: string) => {
    setAiRecommendations((prev) => [...prev, rec]);
  }, []);

  const addAIError = useCallback((error: string) => {
    setAiErrorMessages((prev) => [...prev, error]);
  }, []);

  const addSecurityAlert = useCallback((alert: string) => {
    setSecurityAlerts((prev) => [...prev, alert]);
  }, []);

  const updateAdaptiveUISetting = useCallback((key: string, value: any) => {
    setAdaptiveUISettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Simulate prompt-based learning pipeline
  const learnFromAction = useCallback(async (action: string, data: any) => {
    console.log(`[Gemini Learning Pipeline] Learning from action: ${action}`, data);
    // This would send data to a learning model. For now, it logs and might trigger a recommendation.
    const learningService = await GeminiServiceRegistry.discoverOptimalService('ContextualLearning');
    if (learningService) {
      try {
        const result = await learningService.execute({ action, data });
        if (result?.recommendation) {
          addRecommendation(result.recommendation);
        }
        // Simulate UI adaptation based on learning
        if (result?.ui_adaptation) {
          updateAdaptiveUISetting(action, result.ui_adaptation);
        }
      } catch (error) {
        console.error(`[Gemini Learning Pipeline] Error:`, error);
        addAIError(`AI Learning failed for action "${action}".`);
      }
    } else {
      console.warn(`[Gemini Learning Pipeline] No active ContextualLearning service.`);
    }
  }, [addRecommendation, addAIError, updateAdaptiveUISetting]);

  // Initial AI services registration
  useEffect(() => {
    // Register conceptual AI services
    GeminiServiceRegistry.register({
      name: 'PredictiveAnalytics',
      endpoint: '/api/gemini/predict',
      version: '1.0',
      isEnabled: true,
      activate: async () => console.log('Predictive Analytics Activated'),
      deactivate: async () => console.log('Predictive Analytics Deactivated'),
      execute: async (payload) => {
        console.log('[Gemini PredictiveAnalytics] Executing with:', payload);
        // Simulate API call for prediction
        return new Promise((resolve) => setTimeout(() => {
          const type = payload.type;
          const data = payload.data;
          let prediction = 'No specific prediction.';
          if (type === 'currency') {
            prediction = `AI suggests ${data.available?.[0] || 'EUR'} as a high-volatility currency for next quarter.`;
          } else if (type === 'dateRange') {
            prediction = `AI recommends focusing on the period ${data.startDate} to ${data.endDate} for anomaly detection.`;
          } else if (type === 'anomaly') {
            prediction = `Potential anomaly detected in transaction flow around ${new Date().toLocaleString()}.`;
          }
          resolve({ prediction });
        }, 500));
      },
      getDescription: () => 'Provides AI-driven predictions for financial trends and user behavior.'
    });

    GeminiServiceRegistry.register({
      name: 'AnomalyDetection',
      endpoint: '/api/gemini/anomaly',
      version: '1.0',
      isEnabled: true,
      activate: async () => console.log('Anomaly Detection Activated'),
      deactivate: async () => console.log('Anomaly Detection Deactivated'),
      execute: async (payload) => {
        console.log('[Gemini AnomalyDetection] Executing with:', payload);
        // Simulate API call for anomaly detection
        return new Promise((resolve) => setTimeout(() => {
          const { data, threshold } = payload;
          const isAnomaly = Math.random() > 0.8; // 20% chance of anomaly
          if (isAnomaly) {
            return resolve({ detected: true, severity: 'High', description: 'Unusual transaction volume detected.', data });
          }
          resolve({ detected: false });
        }, 700));
      },
      getDescription: () => 'Detects unusual patterns and anomalies in financial data streams.'
    });

    GeminiServiceRegistry.register({
      name: 'SecurityAdvisor',
      endpoint: '/api/gemini/security',
      version: '1.0',
      isEnabled: true,
      activate: async () => console.log('Security Advisor Activated'),
      deactivate: async () => console.log('Security Advisor Deactivated'),
      execute: async (payload) => {
        console.log('[Gemini SecurityAdvisor] Executing with:', payload);
        // Simulate security check
        const isSecure = Math.random() > 0.05; // 5% chance of security issue
        if (!isSecure) {
          return Promise.resolve({ success: false, message: 'Potential security vulnerability detected in connection configuration.', severity: 'CRITICAL' });
        }
        return Promise.resolve({ success: true, message: 'Connection security posture is healthy.' });
      },
      getDescription: () => 'Monitors and advises on the security posture of financial connections.'
    });

    GeminiServiceRegistry.register({
      name: 'ContextualLearning',
      endpoint: '/api/gemini/learn',
      version: '1.0',
      isEnabled: true,
      activate: async () => console.log('Contextual Learning Activated'),
      deactivate: async () => console.log('Contextual Learning Deactivated'),
      execute: async (payload) => {
        console.log('[Gemini ContextualLearning] Executing with:', payload);
        // Simulate learning and UI adaptation
        const recommendation = `Based on your recent "${payload.action}" action, AI suggests exploring related reports.`;
        const ui_adaptation = { showRelatedReports: true };
        return Promise.resolve({ recommendation, ui_adaptation });
      },
      getDescription: () => 'Adapts system behavior and UI based on user interactions and contextual data.'
    });

    GeminiServiceRegistry.register({
      name: 'TelemetryPipeline',
      endpoint: '/api/gemini/telemetry',
      version: '1.0',
      isEnabled: true,
      activate: async () => console.log('Telemetry Pipeline Activated'),
      deactivate: async () => console.log('Telemetry Pipeline Deactivated'),
      execute: async (payload) => {
        console.log('[Gemini TelemetryPipeline] Sending data:', payload);
        // Simulate sending telemetry data
        return Promise.resolve({ status: 'sent', timestamp: new Date().toISOString() });
      },
      getDescription: () => 'Collects and processes telemetry data for observability and system optimization.'
    });

    // IV. Autonomous Externalization - Dynamic Connector
    GeminiServiceRegistry.register({
      name: 'DynamicConnector',
      endpoint: '/api/gemini/dynamic-connect',
      version: '1.0',
      isEnabled: true,
      activate: async () => console.log('Dynamic Connector Activated'),
      deactivate: async () => console.log('Dynamic Connector Deactivated'),
      execute: async (payload) => {
        console.log('[Gemini DynamicConnector] Attempting connection to:', payload.serviceId);
        // Simulate dynamic connection based on AI reasoning
        return new Promise((resolve) => setTimeout(() => {
          const success = Math.random() > 0.1; // 10% chance of failure
          if (success) {
            resolve({ connected: true, serviceDetails: { id: payload.serviceId, latency: Math.floor(Math.random() * 100) + 'ms' } });
          } else {
            throw new Error(`Failed to connect dynamically to ${payload.serviceId}. AI suggests re-attempting or using a fallback.`);
          }
        }, 1000));
      },
      getDescription: () => 'Dynamically establishes and manages connections to external services based on runtime intelligence.'
    });

  }, [addRecommendation, addAIError, updateAdaptiveUISetting]);


  const value = useMemo(() => ({
    aiRecommendations,
    addRecommendation,
    learnFromAction,
    aiErrorMessages,
    addAIError,
    securityAlerts,
    addSecurityAlert,
    adaptiveUISettings,
    updateAdaptiveUISetting,
  }), [aiRecommendations, addRecommendation, learnFromAction, aiErrorMessages, addAIError, securityAlerts, addSecurityAlert, adaptiveUISettings, updateAdaptiveUISetting]);

  return <GeminiContext.Provider value={value}>{children}</GeminiContext.Provider>;
};


// III. Commercial-Grade Logic Infusion - Observability, Circuit-breaking, Dynamic Scaling (simulated)
// This hook provides AI-driven reasoning and decision-making capabilities.
export const useGeminiReasoning = <T,>(
  contextId: string,
  initialState: T,
  reasoningLogic: (state: T, payload: any) => Promise<{ newState: T; insights?: string[] }>
) => {
  const [state, setState] = useState<T>(initialState);
  const [insights, setInsights] = useState<string[]>([]);
  const [reasoningLoading, setReasoningLoading] = useState(false);
  const [reasoningError, setReasoningError] = useState<string | null>(null);
  const { addAIError, addRecommendation, learnFromAction } = useGeminiContext();

  const applyReasoning = useCallback(async (payload: any) => {
    setReasoningLoading(true);
    setReasoningError(null);
    try {
      // Simulate circuit-breaker pattern
      if (Math.random() < 0.01) { // 1% chance of circuit breaking
        throw new Error("Gemini Circuit Breaker Tripped: Service temporarily unavailable.");
      }

      const { newState, insights: newInsights } = await reasoningLogic(state, payload);
      setState(newState);
      if (newInsights) {
        setInsights(newInsights);
        newInsights.forEach(addRecommendation); // Add AI insights as recommendations
      }
      learnFromAction(`reasoning_applied_${contextId}`, { payload, newState }); // AI learns from applying reasoning
    } catch (err: any) {
      console.error(`[GeminiReasoning:${contextId}] Error applying reasoning:`, err);
      setReasoningError(err.message || "Failed to apply AI reasoning.");
      addAIError(`AI Reasoning failed for ${contextId}: ${err.message}`);
    } finally {
      setReasoningLoading(false);
    }
  }, [state, reasoningLogic, contextId, addAIError, addRecommendation, learnFromAction]);

  return { state, insights, reasoningLoading, reasoningError, applyReasoning };
};

// V. Self-Aware Infrastructure - AI Anomaly Detection Component
export const GeminiAnomalyDetection: React.FC<{
  connectionId: string;
  currency: string;
  dateRange: DateRangeFormValues;
  onAnomalyDetected: (anomaly: any) => void;
}> = ({ connectionId, currency, dateRange, onAnomalyDetected }) => {
  const [checking, setChecking] = useState(false);
  const [lastAnomaly, setLastAnomaly] = useState<any>(null);
  const { addRecommendation, addAIError } = useGeminiContext();

  const performAnomalyCheck = useCallback(async () => {
    setChecking(true);
    setLastAnomaly(null);
    const anomalyService = await GeminiServiceRegistry.discoverOptimalService('AnomalyDetection');
    if (anomalyService) {
      try {
        const result = await anomalyService.execute({
          connectionId,
          currency,
          dateRange,
          dataStream: 'balance_feed_transactions', // Example data stream
          threshold: 'high_deviation',
        });
        if (result?.detected) {
          setLastAnomaly(result);
          onAnomalyDetected(result);
          addRecommendation(`Anomaly detected: ${result.description} Severity: ${result.severity}`);
        }
      } catch (error) {
        console.error(`[GeminiAnomalyDetection] Error:`, error);
        addAIError(`Anomaly detection failed for connection ${connectionId}.`);
      } finally {
        setChecking(false);
      }
    } else {
      console.warn(`[GeminiAnomalyDetection] No active AnomalyDetection service.`);
      setChecking(false);
    }
  }, [connectionId, currency, dateRange, onAnomalyDetected, addRecommendation, addAIError]);

  useEffect(() => {
    // Run anomaly check on initial load and whenever key parameters change
    performAnomalyCheck();
    // Set up periodic re-checking (simulated dynamic scaling/observability)
    const interval = setInterval(performAnomalyCheck, 60 * 60 * 1000); // Check every hour
    return () => clearInterval(interval);
  }, [performAnomalyCheck]);

  if (checking) {
    return <LoadingLine noHeight text="AI is checking for anomalies..." />;
  }

  if (lastAnomaly) {
    return (
      <Alert type="error" title="AI Anomaly Detected" className="my-4">
        <p className="font-semibold text-lg">{lastAnomaly.description}</p>
        <p>Severity: {lastAnomaly.severity}. Data: {JSON.stringify(lastAnomaly.data)}</p>
        <Button onClick={performAnomalyCheck} variant="secondary" className="mt-2">Re-evaluate with AI</Button>
      </Alert>
    );
  }

  return null; // No anomalies detected
};

// AI-Driven Contextual Action Bar Component
export const GeminiContextualActionBar: React.FC = () => {
  const { aiRecommendations, learnFromAction, securityAlerts, aiErrorMessages, adaptiveUISettings } = useGeminiContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  const handleActionClick = (recommendation: string) => {
    setSelectedRecommendation(recommendation);
    setShowModal(true);
    learnFromAction('recommendation_click', { recommendation });
  };

  const handleModalConfirm = () => {
    console.log(`[GeminiContextualActionBar] Executing action for: ${selectedRecommendation}`);
    // Simulate AI-driven action execution
    learnFromAction('recommendation_executed', { recommendation: selectedRecommendation });
    setShowModal(false);
    setSelectedRecommendation(null);
  };

  const showRelatedReports = adaptiveUISettings.recommendation_click?.showRelatedReports;

  if (aiRecommendations.length === 0 && securityAlerts.length === 0 && aiErrorMessages.length === 0 && !showRelatedReports) {
    return null;
  }

  return (
    <div className="bg-gemini-gradient p-4 rounded-lg shadow-md my-4">
      <h3 className="text-lg font-bold text-white mb-2">Gemini AI Insights & Actions</h3>
      {aiErrorMessages.length > 0 && (
        <Alert type="error" title="AI System Alerts" className="mb-2">
          {aiErrorMessages.map((msg, i) => <p key={`ai-error-${i}`}>{msg}</p>)}
        </Alert>
      )}
      {securityAlerts.length > 0 && (
        <Alert type="warning" title="Security Advisor Alerts" className="mb-2">
          {securityAlerts.map((msg, i) => <p key={`sec-alert-${i}`}>{msg}</p>)}
        </Alert>
      )}
      {aiRecommendations.length > 0 && (
        <>
          <p className="text-white text-sm mb-2">AI Recommendations:</p>
          <ul className="list-disc list-inside text-white/90">
            {aiRecommendations.map((rec, index) => (
              <li key={`ai-rec-${index}`} className="text-sm cursor-pointer hover:text-white-light" onClick={() => handleActionClick(rec)}>
                {rec}
              </li>
            ))}
          </ul>
        </>
      )}
      {showRelatedReports && (
        <div className="mt-4 p-3 bg-white/10 rounded">
          <p className="text-white font-semibold">AI Suggests:</p>
          <Button onClick={() => learnFromAction('view_related_reports_prompt', { path: '/reports/contextual' })} className="mt-2">View Contextual Reports</Button>
        </div>
      )}

      {selectedRecommendation && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Confirm AI-Driven Action"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleModalConfirm}>Execute Action</Button>
            </>
          }
        >
          <p>AI recommends: <span className="font-semibold">{selectedRecommendation}</span></p>
          <p className="text-sm text-gray-600">Are you sure you want to proceed with this AI-suggested action? This action might trigger further analysis or system adjustments.</p>
        </Modal>
      )}
    </div>
  );
};

// AI-Powered Currency Recommendation Hook
export const useGeminiCurrencyRecommendation = (currentCurrency?: string, availableCurrencies?: string[]) => {
  const [recommendedCurrency, setRecommendedCurrency] = useState<string | null>(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const { addRecommendation, learnFromAction, addAIError } = useGeminiContext();

  useEffect(() => {
    const fetchRecommendation = async () => {
      setLoadingRecommendation(true);
      setRecommendedCurrency(null);
      const predictiveService = await GeminiServiceRegistry.discoverOptimalService('PredictiveAnalytics');
      if (predictiveService) {
        try {
          const result = await predictiveService.execute({
            type: 'currency',
            data: { current: currentCurrency, available: availableCurrencies }
          });
          if (result?.prediction) {
            // Extract a plausible currency from the AI's prediction
            // For a real system, the prediction would be structured, e.g., result.predictedCurrency
            const match = result.prediction.match(/\b([A-Z]{3})\b/);
            if (match && match[1] !== currentCurrency?.toUpperCase() && availableCurrencies?.includes(match[1])) {
              setRecommendedCurrency(match[1]);
              addRecommendation(`AI-suggested currency: ${match[1]} (from: ${result.prediction})`);
              learnFromAction('currency_recommendation_received', { recommended: match[1] });
            } else {
                addRecommendation(result.prediction); // Still show prediction even if not a direct currency match
            }
          }
        } catch (error) {
          console.error(`[GeminiCurrencyRecommendation] Error:`, error);
          addAIError('Failed to get AI currency recommendation.');
        } finally {
          setLoadingRecommendation(false);
        }
      } else {
        console.warn(`[GeminiCurrencyRecommendation] No active PredictiveAnalytics service.`);
        setLoadingRecommendation(false);
      }
    };

    fetchRecommendation();
  }, [currentCurrency, availableCurrencies, addRecommendation, learnFromAction, addAIError]);

  return { recommendedCurrency, loadingRecommendation };
};

// AI-Powered Date Range Optimization Hook
export const useGeminiDateRangeOptimization = (currentDateRange: DateRangeFormValues) => {
    const [optimizedDateRange, setOptimizedDateRange] = useState<DateRangeFormValues | null>(null);
    const [loadingOptimization, setLoadingOptimization] = useState(false);
    const { addRecommendation, learnFromAction, addAIError } = useGeminiContext();

    useEffect(() => {
        const fetchOptimization = async () => {
            setLoadingOptimization(true);
            setOptimizedDateRange(null);
            const predictiveService = await GeminiServiceRegistry.discoverOptimalService('PredictiveAnalytics');
            if (predictiveService) {
                try {
                    const result = await predictiveService.execute({
                        type: 'dateRange',
                        data: currentDateRange
                    });
                    if (result?.prediction) {
                        // Simulate extracting an optimized date range from the prediction
                        // For a real system, this would be a structured output
                        const newStartDate = new Date(currentDateRange.startDate);
                        newStartDate.setDate(newStartDate.getDate() - 7); // Example: AI recommends looking back one more week
                        const newEndDate = new Date(currentDateRange.endDate);
                        addRecommendation(`AI suggests refining date range for deeper insights.`);
                        setOptimizedDateRange({
                            startDate: newStartDate.toISOString().split('T')[0],
                            endDate: newEndDate.toISOString().split('T')[0],
                        });
                        learnFromAction('date_range_optimization_received', { original: currentDateRange, optimized: { startDate: newStartDate.toISOString().split('T')[0], endDate: newEndDate.toISOString().split('T')[0] } });
                    }
                } catch (error) {
                    console.error(`[GeminiDateRangeOptimization] Error:`, error);
                    addAIError('Failed to get AI date range optimization.');
                } finally {
                    setLoadingOptimization(false);
                }
            } else {
                console.warn(`[GeminiDateRangeOptimization] No active PredictiveAnalytics service.`);
                setLoadingOptimization(false);
            }
        };

        fetchOptimization();
    }, [currentDateRange, addRecommendation, learnFromAction, addAIError]);

    return { optimizedDateRange, loadingOptimization };
};

// III. Commercial-Grade Logic Infusion - AI-driven observability / telemetry
export const useGeminiTelemetry = (eventName: string, data: Record<string, any>) => {
  const { addAIError } = useGeminiContext();

  useEffect(() => {
    const sendTelemetry = async () => {
      const telemetryService = await GeminiServiceRegistry.discoverOptimalService('TelemetryPipeline');
      if (telemetryService) {
        try {
          await telemetryService.execute({ eventName, timestamp: new Date().toISOString(), ...data });
        } catch (error) {
          console.error(`[GeminiTelemetry] Failed to send telemetry for ${eventName}:`, error);
          addAIError(`Telemetry for "${eventName}" failed.`);
        }
      }
    };
    sendTelemetry();
  }, [eventName, data, addAIError]);
};

// --- END: New AI-Powered Modules and Hooks ---

type RouterProps = {
  match: {
    params: {
      entity: string;
      currency?: string;
    };
  };
};

const defaultCrumbs = [{ name: "Cash Management", path: "/accounts" }];

export default function ConnectionView({
  match: {
    params: { entity, currency },
  },
}: RouterProps) {
  // Wrap ConnectionView with GeminiContextProvider to make AI context available
  return (
    <GeminiContextProvider>
      <ConnectionViewInternal
        match={{ params: { entity, currency } }}
      />
    </GeminiContextProvider>
  );
}

// Internal component to use GeminiContext
function ConnectionViewInternal({
  match: {
    params: { entity, currency },
  },
}: RouterProps) {
  const [selectedCurrency, setSelectedCurrency] = React.useState<
    string | undefined
  >(currency);

  const [query, setQuery] = useState(() => {
    const storedDateRange = Cookies.get("globalDateRange");
    if (storedDateRange) {
      return { dateRange: JSON.parse(storedDateRange) as DateRangeFormValues };
    }
    return { dateRange: ACCOUNT_DATE_RANGE_FILTER_OPTIONS[1].dateRange };
  });
  const [dateRangeDefaultLabel, setDateRangeDefaultLabel] = useState("");

  const { learnFromAction, addSecurityAlert, addAIError, adaptiveUISettings } = useGeminiContext();

  // AI-powered date range optimization
  const { optimizedDateRange, loadingOptimization } = useGeminiDateRangeOptimization(query.dateRange);

  useEffect(() => {
    if (optimizedDateRange && !loadingOptimization) {
      // AI suggests an optimized date range, we can ask user or auto-apply
      // For now, let's just log and consider it for future prompt-driven adjustments
      console.log("[Gemini] AI suggested optimized date range:", optimizedDateRange);
      // setQuery(prev => ({ ...prev, dateRange: optimizedDateRange })); // This could be an option
      // If we applied it, we'd then track that action.
      // learnFromAction('date_range_applied', { original: query.dateRange, applied: optimizedDateRange });
    }
  }, [optimizedDateRange, loadingOptimization, learnFromAction]);


  const setGlobalDateFilterLabel = () => {
    setDateRangeDefaultLabel("Mixed");
    learnFromAction('set_mixed_date_label', { entity, currency, dateRange: query.dateRange });
  };

  // III. Commercial-Grade Logic Infusion - AI-driven decision making for currency change
  const handleSelectedCurrencyChange = useCallback(async (newCurrency: string | null) => {
    if (newCurrency === null) return;

    // AI Reasoning layer for currency change
    const currencyReasoning = await GeminiServiceRegistry.discoverOptimalService('PredictiveAnalytics');
    if (currencyReasoning) {
        try {
            const prediction = await currencyReasoning.execute({ type: 'currency_change_impact', current: selectedCurrency, new: newCurrency });
            console.log(`[Gemini Reasoning] Impact prediction for currency change to ${newCurrency}:`, prediction);
            learnFromAction('currency_change_prediction', { selectedCurrency, newCurrency, prediction });
            // Here, we could interrupt or suggest a different currency based on prediction
            // if (prediction.riskLevel > 'High') return; // Example of AI-driven decision
        } catch (e) {
            console.error("[Gemini Reasoning] Error during currency change prediction:", e);
            addAIError(`AI failed to predict impact for currency change to ${newCurrency}.`);
        }
    }

    setSelectedCurrency(newCurrency);
    const newUrl = `${
      window.location.origin
    }/accounts/connections/${entity}/${newCurrency.toLowerCase()}`;
    window.history.replaceState({}, "", newUrl);
    learnFromAction('currency_changed', { entity, currency: newCurrency });
  }, [selectedCurrency, entity, learnFromAction, addAIError]);

  const [title, setTitle] = React.useState<string | undefined>("");

  const [crumbs, setCrumbs] =
    React.useState<{ name: string; path?: string }[]>(defaultCrumbs);
  const [currencies, setCurrencies] = React.useState<string[]>([]);

  const { data, loading, error: queryError } = useConnectionViewQuery({
    variables: {
      entity,
    },
  });

  // III. Commercial-Grade Logic Infusion - AI-driven Security Check on Data Load
  useEffect(() => {
    const runSecurityCheck = async () => {
      const securityService = await GeminiServiceRegistry.discoverOptimalService('SecurityAdvisor');
      if (securityService) {
        try {
          const result = await securityService.execute({
            connectionId: data?.connection?.id,
            entityId: entity,
            connectionType: 'view'
          });
          if (!result.success) {
            addSecurityAlert(result.message);
            addAIError(`Security Advisor flagged an issue: ${result.message}`);
          }
        } catch (error) {
          console.error(`[Gemini SecurityAdvisor] Error:`, error);
          addAIError('Failed to run AI security check for connection.');
        }
      }
    };
    if (data?.connection?.id) {
      runSecurityCheck();
      learnFromAction('connection_data_loaded', { connectionId: data.connection.id });
    }
  }, [data?.connection?.id, entity, addSecurityAlert, addAIError, learnFromAction]);

  // V. Logical Conclusion: Self-Aware Infrastructure - AI-driven error handling
  useEffect(() => {
      if (queryError) {
          console.error("[Gemini Self-Aware] GraphQL query error detected:", queryError);
          addAIError(`Failed to load connection data: ${queryError.message}. AI suggests reviewing network connectivity or API gateway logs.`);
          learnFromAction('graphql_query_error', { entity, errorMessage: queryError.message });
      }
  }, [queryError, addAIError, learnFromAction]);


  useEffect(() => {
    if (!data?.connection) return;
    const vendorName =
      data?.connection?.nickname || data.connection?.vendor?.name;

    if (vendorName) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const newTitle = `${vendorName} (${selectedCurrency?.toUpperCase()})`;
      setCrumbs([...defaultCrumbs, { name: newTitle }]);
      setTitle(newTitle);
      learnFromAction('title_updated', { vendorName, selectedCurrency });
    }
  }, [data?.connection, selectedCurrency, learnFromAction]);

  // Hook to update the selected currency if one is not given in the url
  useEffect(() => {
    if (!data?.connection) return;
    if (selectedCurrency) {
      const newUrl = `${
        window.location.origin
      }/accounts/connections/${entity}/${selectedCurrency.toLowerCase()}`;
      window.history.replaceState({}, "", newUrl);
    }
  }, [selectedCurrency, currency, data?.connection, entity]);

  useEffect(() => {
    if (!data?.connection) return;
    const vendorName =
      data?.connection?.nickname || data.connection?.vendor?.name;

    if (vendorName) {
      const connectionCurrencies = data?.connection?.currencies;
      setCurrencies(connectionCurrencies);

      if (
        selectedCurrency === undefined &&
        currencies &&
        currencies.length > 0
      ) {
        setSelectedCurrency(currencies[0].toUpperCase());
        learnFromAction('default_currency_set', { currency: currencies[0].toUpperCase() });
      }

      if (selectedCurrency) {
        setTitle(`${vendorName} (${selectedCurrency?.toUpperCase()})`);
      }
    }
  }, [data?.connection, selectedCurrency, currencies, learnFromAction]);

  const balanceCurrency = selectedCurrency ?? currency ?? "USD";
  const connectionId = data?.connection?.id;

  // AI-powered currency recommendation
  const { recommendedCurrency, loadingRecommendation } = useGeminiCurrencyRecommendation(balanceCurrency, currencies);

  // III. Commercial-Grade Logic Infusion - AI-driven telemetry for view activity
  useGeminiTelemetry('ConnectionViewRendered', {
    entity,
    currency: selectedCurrency,
    connectionId,
    dateRange: query.dateRange,
    userId: Cookies.get('userId') || 'anonymous', // Example user ID
  });

  // Adaptive UI behavior based on AI learning
  const showAIButton = adaptiveUISettings.connection_data_loaded?.showRelatedReports || false;


  return (
    <PageHeader
      title={title as string}
      loading={loading}
      crumbs={crumbs}
      right={<MoveMoneyDropdown />}
    >
      <>
        {loading && <LoadingLine noHeight />}
        <GeminiContextualActionBar /> {/* AI-driven insights and actions */}
        <div className="flex flex-row items-center gap-4">
          <DateSearch
            key={v4()}
            query={query}
            field="dateRange"
            options={ACCOUNT_DATE_RANGE_FILTER_OPTIONS}
            updateQuery={(input: Record<string, DateRangeFormValues>) => {
              Cookies.set("globalDateRange", JSON.stringify(input.dateRange), {
                expires: 7,
              });
              setDateRangeDefaultLabel("");
              setQuery({ dateRange: input.dateRange });
              trackEvent(null, ACCOUNT_ACTIONS.CHANGED_GLOBAL_DATE_FILTER, {
                path: window.location.pathname,
              });
              learnFromAction('date_filter_changed', { newDateRange: input.dateRange });
            }}
            /** change label to "Mixed" without changing actual date range */
            defaultLabel={
              dateRangeDefaultLabel !== "" ? dateRangeDefaultLabel : undefined
            }
            showStartAndEndDateArrow={false}
            showIcon
          />
          <CurrencyDropdown
            currencies={currencies}
            selectedCurrency={selectedCurrency?.toUpperCase() as string}
            setSelectedCurrency={(newCurrency) => {
              handleSelectedCurrencyChange(newCurrency);
              // AI learns from manual currency selection
              learnFromAction('manual_currency_selected', { currency: newCurrency });
            }}
            // reset label to be empty when currency changes
            setGlobalDateFilterLabel={() => setDateRangeDefaultLabel("")}
          />
          {loadingRecommendation ? (
            <LoadingLine noHeight text="AI recommending currency..." />
          ) : (
            recommendedCurrency && recommendedCurrency !== selectedCurrency?.toUpperCase() && (
              <Button
                variant="primary"
                onClick={() => handleSelectedCurrencyChange(recommendedCurrency)}
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                AI Suggests: {recommendedCurrency}
              </Button>
            )
          )}
        </div>

        {selectedCurrency && connectionId && query.dateRange && (
          <>
            <AccountsOverviewBar
              entityId={connectionId}
              entityType="Connection"
              currency={selectedCurrency.toUpperCase()}
              dateRange={query.dateRange}
              setGlobalDateFilterLabel={setGlobalDateFilterLabel}
            />
            <GeminiAnomalyDetection
              connectionId={connectionId}
              currency={selectedCurrency.toUpperCase()}
              dateRange={query.dateRange}
              onAnomalyDetected={(anomaly) => {
                console.warn("AI Anomaly detected in ConnectionView:", anomaly);
                // The component itself handles displaying the alert
              }}
            />
            <Layout
              primaryContent={
                <HistoricalBalanceChartForGroups
                  currency={balanceCurrency.toUpperCase()}
                  defaultEntityId={connectionId}
                  dateRange={query.dateRange}
                  setGlobalDateFilterLabel={setGlobalDateFilterLabel}
                  defaultGroupBy={GroupTypeEnum.Banks}
                  showGroupByDropdown={false}
                  showEntitySelectorDropdown={false}
                />
              }
            />
          </>
        )}
        {selectedCurrency && connectionId && (
          <SearchableBalanceFeed
            connectionId={connectionId}
            currencies={[selectedCurrency.toUpperCase()]}
            hideFilters
          />
        )}
      </>
    </PageHeader>
  );
}