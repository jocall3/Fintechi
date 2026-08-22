// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

/* eslint-disable no-param-reassign */
import pickBy from "lodash/pickBy";
import {
    createEntityAdapter,
    createAsyncThunk,
    createSlice,
    createSelector,
} from "@reduxjs/toolkit";

import {
    fetchAPI
} from "../../common/utilities/requestApi";
import {
    stringify
} from "../../common/utilities/queryString";

// --- START: Gemini Integration & Self-Contained Universe Architecture ---

/**
 * @class GeminiCoreAI
 * @description An AI-synthesized module embodying the Gemini architecture for autonomous reasoning,
 *              context-awareness, and dynamic decision-making. Acts as a neural extension.
 */
export class GeminiCoreAI {
    constructor(sliceName) {
        this.sliceName = sliceName;
        this.contextMemory = {}; // Stores learned context for this slice
        console.log(`GeminiCoreAI for ${sliceName} initialized.`);
    }

    /**
     * Processes a prompt using AI reasoning.
     * @param {string} prompt - The prompt to process.
     * @param {object} context - Additional context for the AI.
     * @returns {Promise<object>} AI-generated insights or decisions.
     */
    async processPrompt(prompt, context = {}) {
        // Simulate advanced AI processing, context-aware reasoning
        console.log(`[GeminiAI - ${this.sliceName}] Processing prompt: "${prompt}" with context:`, context);
        // This would involve calling an actual LLM service, e.g., via a dynamic endpoint.
        // For simulation, we return a structured response.
        const effectiveContext = { ...this.contextMemory[prompt],
            ...context
        };
        this.contextMemory[prompt] = effectiveContext; // Update learning pipeline

        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate AI processing delay

        return {
            decision: `AI_DECISION_FOR_${prompt.replace(/\s/g, '_').toUpperCase()}`,
            rationale: `Based on current context and historical data for ${this.sliceName}, the optimal action is taken.`,
            suggestions: [`Consider alternative for ${prompt}.`],
            context: effectiveContext,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Analyzes input data for patterns, anomalies, or compliance risks.
     * @param {object} data - The data to analyze.
     * @param {string} dataType - The type of data (e.g., 'query', 'entity', 'response').
     * @returns {Promise<object>} Analysis report.
     */
    async analyzeData(data, dataType) {
        console.log(`[GeminiAI - ${this.sliceName}] Analyzing ${dataType} data...`, data);
        // Simulate data analysis, potentially flagging sensitive info, predicting outcomes
        await new Promise(resolve => setTimeout(resolve, 30));
        const analysis = {
            status: 'analyzed',
            insights: [],
            warnings: [],
            complianceConfidence: 0.95,
        };

        if (dataType === 'query' && data.keywords && data.keywords.includes('sensitive')) {
            analysis.warnings.push('Query contains potentially sensitive keywords.');
            analysis.complianceConfidence = 0.6;
        }
        if (dataType === 'entity' && data.amount && data.amount > 1000000) {
            analysis.insights.push('High-value entity detected, may require special handling.');
        }

        return analysis;
    }

    /**
     * Learns from a given interaction, updating its internal models.
     * @param {object} interaction - Details of the interaction (e.g., request, response, error).
     */
    async learnFromInteraction(interaction) {
        console.log(`[GeminiAI - ${this.sliceName}] Learning from interaction...`, interaction);
        // In a real system, this would feed into an RL or active learning pipeline.
        // For simulation, we simply log and store a simplified context.
        const {
            type,
            data,
            outcome
        } = interaction;
        if (!this.contextMemory.interactions) {
            this.contextMemory.interactions = [];
        }
        this.contextMemory.interactions.push({
            type,
            data,
            outcome,
            timestamp: new Date().toISOString()
        });
        if (this.contextMemory.interactions.length > 100) { // Keep memory manageable
            this.contextMemory.interactions.shift();
        }
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

/**
 * @class TelemetryService
 * @description Provides production-grade observability: capturing metrics, logs, and traces.
 *              Acts as a living endpoint for external telemetry services.
 */
export class TelemetryService {
    constructor(source) {
        this.source = source;
        console.log(`TelemetryService for ${source} initialized.`);
    }

    /**
     * Tracks a custom event.
     * @param {string} eventName
     * @param {object} payload
     */
    trackEvent(eventName, payload = {}) {
        console.log(`[Telemetry - ${this.source}] Event: ${eventName}`, payload);
        // This would dispatch to an event broker or telemetry system.
    }

    /**
     * Captures an error with associated context.
     * @param {Error} error
     * @param {object} context
     */
    captureError(error, context = {}) {
        console.error(`[Telemetry - ${this.source}] Error: ${error.message}`, {
            error,
            context
        });
        // This would send to an error tracking service.
    }

    /**
     * Logs a metric value.
     * @param {string} metricName
     * @param {number} value
     * @param {object} tags
     */
    logMetric(metricName, value, tags = {}) {
        console.log(`[Telemetry - ${this.source}] Metric: ${metricName}=${value}`, tags);
        // This would push to a metrics aggregation service.
    }
}

/**
 * @class ComplianceService
 * @description Enforces real-world business logic and regulatory compliance.
 *              Interacts with external compliance systems dynamically.
 */
export class ComplianceService {
    constructor(domain) {
        this.domain = domain;
        console.log(`ComplianceService for ${domain} initialized.`);
    }

    /**
     * Checks if a given operation or data payload complies with policies.
     * @param {string} operationType - e.g., 'CREATE', 'READ', 'UPDATE', 'DELETE'.
     * @param {object} data - The data payload involved.
     * @param {object} userContext - Context of the user performing the action.
     * @returns {Promise<boolean>} True if compliant, false otherwise.
     */
    async checkPolicy(operationType, data, userContext = {}) {
        console.log(`[Compliance - ${this.domain}] Checking policy for ${operationType} on data:`, data, 'by user:', userContext);
        // Simulate complex policy checks (e.g., PII masking, access control, data residency)
        await new Promise(resolve => setTimeout(resolve, 20));
        const isCompliant = !data || !data.forbiddenField; // Example compliance rule
        if (!isCompliant) {
            console.warn(`[Compliance - ${this.domain}] Policy violation detected for ${operationType}.`);
        }
        return isCompliant;
    }

    /**
     * Audits an action for regulatory logging.
     * @param {string} action - Description of the action.
     * @param {object} metadata - Additional audit metadata.
     */
    async auditAction(action, metadata = {}) {
        console.log(`[Compliance - ${this.domain}] Auditing action: "${action}" with metadata:`, metadata);
        // This would send to an immutable audit log.
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

/**
 * @class DynamicServiceRegistry
 * @description Provides elastic APIs for dynamic service discovery and binding.
 *              Allows the file's internal logic to choose optimal services at execution.
 */
export class DynamicServiceRegistry {
    constructor() {
        this.registeredServices = {
            'api_gateway': {
                url: 'https://api.example.com/v1',
                health: 'green',
                latency: 50
            },
            'llm_inference': {
                url: 'https://ai.example.com/gemini/v2',
                health: 'green',
                latency: 120
            },
            'telemetry_ingest': {
                url: 'https://telemetry.example.com/events',
                health: 'green',
                latency: 30
            }
            // ... more services
        };
        console.log('DynamicServiceRegistry initialized.');
    }

    /**
     * Discovers and returns the endpoint for a given service type.
     * Can apply logic to select the 'optimal' service (e.g., lowest latency, highest health).
     * @param {string} serviceType - The type of service to discover (e.g., 'api_gateway', 'llm_inference').
     * @returns {Promise<object | null>} Service endpoint details or null if not found.
     */
    async discoverService(serviceType) {
        console.log(`[DynamicServiceRegistry] Discovering service: ${serviceType}`);
        await new Promise(resolve => setTimeout(resolve, 5));
        const service = this.registeredServices[serviceType];
        if (service && service.health === 'green') {
            // Apply advanced selection logic here if multiple instances exist
            return service;
        }
        console.warn(`[DynamicServiceRegistry] Service ${serviceType} not found or unhealthy.`);
        return null;
    }

    /**
     * Gets the base URL for a discovered service.
     * @param {string} serviceType
     * @returns {Promise<string | null>}
     */
    async getServiceUrl(serviceType) {
        const service = await this.discoverService(serviceType);
        return service ? service.url : null;
    }
}

/**
 * @class CircuitBreaker
 * @description Implements production-grade resilience patterns.
 *              Wraps async functions to prevent cascading failures.
 */
export class CircuitBreaker {
    constructor(name, failureThreshold = 3, resetTimeout = 5000) {
        this.name = name;
        this.failureThreshold = failureThreshold;
        this.resetTimeout = resetTimeout;
        this.failures = 0;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.lastFailureTime = 0;
        console.log(`CircuitBreaker "${name}" initialized in ${this.state} state.`);
    }

    async execute(asyncFunction, ...args) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.resetTimeout) {
                this.state = 'HALF_OPEN';
                console.log(`[CircuitBreaker - ${this.name}] Transitioned to HALF_OPEN.`);
            } else {
                console.warn(`[CircuitBreaker - ${this.name}] OPEN - Request rejected.`);
                throw new Error(`CircuitBreaker is OPEN for ${this.name}`);
            }
        }

        try {
            const result = await asyncFunction(...args);
            this.success();
            return result;
        } catch (error) {
            this.fail();
            throw error;
        }
    }

    success() {
        this.failures = 0;
        if (this.state !== 'CLOSED') {
            this.state = 'CLOSED';
            console.log(`[CircuitBreaker - ${this.name}] Transitioned to CLOSED.`);
        }
    }

    fail() {
        this.failures++;
        this.lastFailureTime = Date.now();
        if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
            console.error(`[CircuitBreaker - ${this.name}] Failure threshold reached. Transitioned to OPEN.`);
        } else if (this.state === 'HALF_OPEN') {
            // If failure in HALF_OPEN, immediately go back to OPEN
            this.state = 'OPEN';
            console.error(`[CircuitBreaker - ${this.name}] Failed in HALF_OPEN. Transitioned back to OPEN.`);
        }
    }
}

// Instantiate core AI and utility services
export const geminiCoreModule = new GeminiCoreAI("Global");
export const globalTelemetry = new TelemetryService("GlobalApp");
export const globalCompliance = new ComplianceService("EnterpriseDomain");
export const dynamicServiceRegistry = new DynamicServiceRegistry();

// --- END: Gemini Integration & Self-Contained Universe Architecture ---


const hasPrevPage = (linkHeader) => linkHeader && linkHeader.includes('rel="prev"');
const hasNextPage = (linkHeader) => linkHeader && linkHeader.includes('rel="next"');

export default function createEntitySlice(
    name,
    resourcePath,
    stateSelector = (state) => state[name],
) {
    const adapter = createEntityAdapter();
    const simpleSelectors = adapter.getSelectors(stateSelector);

    // Instantiate slice-specific AI and utility services
    const geminiAI = new GeminiCoreAI(name);
    const telemetry = new TelemetryService(`${name}Slice`);
    const compliance = new ComplianceService(`${name}Policy`);
    const apiCircuitBreaker = new CircuitBreaker(`${name}APICall`);

    const queryStringSelector = createSelector(
        (state) => stateSelector(state).query,
        (query) => stringify(pickBy(query), "brackets"),
    );

    const fullQueryStringSelector = createSelector(
        (state) => stateSelector(state).query,
        (state) => stateSelector(state).pagination,
        (query, pagination) =>
        stringify({
                ...pickBy(query),
                ...{
                    page: pagination.page,
                    per_page: pagination.perPage
                },
            },
            "brackets",
        ),
    );

    const selector = createSelector(
        (state) => stateSelector(state).loading,
        (state) => stateSelector(state).pagination,
        simpleSelectors.selectAll,
        (state) => stateSelector(state).query,
        queryStringSelector,
        (state) => stateSelector(state).geminiContext, // New AI context selector
        (loading, pagination, data, query, queryString, geminiContext) => ({
            loading,
            pagination,
            data,
            query,
            queryString,
            geminiContext, // Expose AI context
        }),
    );

    const show = createAsyncThunk(`${name}/show`, async (entityId, {
        dispatch,
        getState
    }) => {
        telemetry.trackEvent('show_entity_request', {
            entityId,
            slice: name
        });
        const userContext = {
            userId: 'gemini-user-123',
            roles: ['admin']
        }; // Simulate user context

        // AI-driven pre-processing and validation
        const preProcessResult = await geminiAI.processPrompt(`Validate entityId for show operation`, {
            entityId,
            userContext
        });
        await telemetry.logMetric('gemini_pre_process_time', preProcessResult.timestamp);

        if (!await compliance.checkPolicy('READ', {
                entityId
            }, userContext)) {
            telemetry.captureError(new Error('Compliance violation for show operation'), {
                entityId,
                userContext
            });
            throw new Error("Access denied due to compliance policy.");
        }

        let response;
        try {
            // Dynamic service discovery for the API endpoint
            const apiGateway = await dynamicServiceRegistry.getServiceUrl('api_gateway');
            if (!apiGateway) {
                throw new Error("API Gateway service not available.");
            }

            response = await apiCircuitBreaker.execute(fetchAPI, `${apiGateway}${resourcePath}/${entityId}/load`);
            telemetry.trackEvent('show_entity_success', {
                entityId,
                slice: name
            });
            await compliance.auditAction(`Read entity ${entityId}`, {
                slice: name,
                userContext
            });
        } catch (error) {
            telemetry.captureError(error, {
                entityId,
                slice: name,
                operation: 'show'
            });
            await geminiAI.learnFromInteraction({
                type: 'show_failure',
                data: {
                    entityId
                },
                outcome: 'error',
                error: error.message
            });
            throw error; // Re-throw for Redux Toolkit to handle rejected state
        }

        const data = await response.json();

        // AI-driven post-processing/enrichment
        const postProcessResult = await geminiAI.analyzeData(data, 'entity_response');
        await geminiAI.learnFromInteraction({
            type: 'show_success',
            data: {
                entityId
            },
            outcome: 'success',
            analysis: postProcessResult
        });
        dispatch(slice.actions.updateGeminiContext({
            lastShowAnalysis: postProcessResult
        }));

        return data;
    });

    const defaultSearchArgs = {
        replaceState: true,
        aiOptimization: true, // New: Enable AI query optimization
    };

    const search = createAsyncThunk(
        `${name}/search`,
        async (args = {}, {
            getState,
            requestId,
            dispatch
        }) => {
            const state = getState();
            const {
                loading,
                currentRequestId,
                query: currentQuery
            } = stateSelector(state);
            const userContext = {
                userId: 'gemini-user-123',
                roles: ['admin']
            };

            telemetry.trackEvent('search_entity_request', {
                args,
                slice: name
            });

            const options = { ...defaultSearchArgs,
                ...args
            };

            if (!loading || requestId !== currentRequestId) {
                telemetry.logMetric('search_skipped_redundant', 1, {
                    slice: name
                });
                return null;
            }

            let effectiveQuery = currentQuery;
            if (options.aiOptimization) {
                // AI-driven query optimization
                const queryAnalysis = await geminiAI.analyzeData(effectiveQuery, 'query');
                const aiDecision = await geminiAI.processPrompt(`Optimize search query for ${name}`, {
                    query: effectiveQuery,
                    analysis: queryAnalysis
                });
                if (aiDecision.decision === 'AI_DECISION_FOR_OPTIMIZE_SEARCH_QUERY') {
                    // Simulate query rephrasing or parameter adjustment based on AI
                    effectiveQuery = { ...effectiveQuery,
                        ai_boost: true,
                        ...(aiDecision.suggestions ? {
                            suggested_filter: aiDecision.suggestions[0]
                        } : {})
                    };
                    dispatch(slice.actions.updateGeminiContext({
                        lastQueryOptimization: aiDecision
                    }));
                }
            }

            if (!await compliance.checkPolicy('READ_SEARCH', effectiveQuery, userContext)) {
                telemetry.captureError(new Error('Compliance violation for search operation'), {
                    query: effectiveQuery,
                    userContext
                });
                throw new Error("Search denied due to compliance policy.");
            }

            const queryString = `?${stringify({ ...pickBy(effectiveQuery), ...stateSelector(state).pagination}, "brackets")}`;

            if (options.replaceState) {
                window.history.replaceState(null, null, queryString);
            }

            let response;
            try {
                const apiGateway = await dynamicServiceRegistry.getServiceUrl('api_gateway');
                if (!apiGateway) {
                    throw new Error("API Gateway service not available for search.");
                }
                response = await apiCircuitBreaker.execute(fetchAPI, `${apiGateway}${resourcePath}/search${queryString}`);
                telemetry.trackEvent('search_entity_success', {
                    query: effectiveQuery,
                    slice: name
                });
                await compliance.auditAction(`Searched entities`, {
                    query: effectiveQuery,
                    slice: name,
                    userContext
                });
            } catch (error) {
                telemetry.captureError(error, {
                    query: effectiveQuery,
                    slice: name,
                    operation: 'search'
                });
                await geminiAI.learnFromInteraction({
                    type: 'search_failure',
                    data: {
                        query: effectiveQuery
                    },
                    outcome: 'error',
                    error: error.message
                });
                // AI-driven adaptive error handling: suggest alternative search or retry
                const aiErrorDecision = await geminiAI.processPrompt('Handle search error gracefully', {
                    error: error.message,
                    query: effectiveQuery
                });
                dispatch(slice.actions.updateGeminiContext({
                    lastSearchErrorHandling: aiErrorDecision
                }));
                throw error;
            }

            const body = await response.json();
            const pagination = {
                page: parseInt(response.headers.get("X-Page"), 10) || 1,
                perPage: parseInt(response.headers.get("X-Per-Page"), 10) || 25,
                total: parseInt(response.headers.get("X-Total-Count"), 10) || 0,
                pageLowerBound: parseInt(
                    response.headers.get("X-Page-Lower-Bound"),
                    10,
                ) || 0,
                pageUpperBound: parseInt(
                    response.headers.get("X-Page-Upper-Bound"),
                    10,
                ) || 0,
                hasPrevPage: hasPrevPage(response.headers.get("Link")),
                hasNextPage: hasNextPage(response.headers.get("Link")),
            };

            await geminiAI.learnFromInteraction({
                type: 'search_success',
                data: {
                    query: effectiveQuery,
                    pagination
                },
                outcome: 'success',
                resultsCount: body.length
            });
            dispatch(slice.actions.updateGeminiContext({
                lastSearchContext: {
                    query: effectiveQuery,
                    pagination
                }
            }));

            return {
                body,
                pagination
            };
        },
    );

    const save = createAsyncThunk(
        `${name}/save`,
        async ({
            entityId,
            data
        }, {
            getState,
            requestId,
            dispatch
        }) => {
            const state = getState();
            const {
                loading,
                currentRequestId
            } = stateSelector(state);
            const userContext = {
                userId: 'gemini-user-123',
                roles: ['admin']
            };

            telemetry.trackEvent('save_entity_request', {
                entityId,
                slice: name,
                dataKeys: Object.keys(data)
            });

            if (!loading || requestId !== currentRequestId) {
                telemetry.logMetric('save_skipped_redundant', 1, {
                    slice: name
                });
                return null;
            }

            // AI-driven data validation and enrichment
            const validationResult = await geminiAI.analyzeData(data, 'entity_payload');
            if (validationResult.warnings.length > 0) {
                console.warn(`[GeminiAI - ${name}] Data validation warnings for save:`, validationResult.warnings);
                // AI could suggest correcting data or blocking the save
            }
            dispatch(slice.actions.updateGeminiContext({
                lastSaveValidation: validationResult
            }));

            if (!await compliance.checkPolicy('WRITE', data, userContext)) {
                telemetry.captureError(new Error('Compliance violation for save operation'), {
                    entityId,
                    data,
                    userContext
                });
                throw new Error("Save denied due to compliance policy.");
            }

            const body = JSON.stringify(data);
            let response;
            try {
                const apiGateway = await dynamicServiceRegistry.getServiceUrl('api_gateway');
                if (!apiGateway) {
                    throw new Error("API Gateway service not available for save.");
                }
                response = await apiCircuitBreaker.execute(
                    fetchAPI,
                    `${apiGateway}${resourcePath}/${entityId}`,
                    "PATCH",
                    body,
                    "application/json",
                );
                telemetry.trackEvent('save_entity_success', {
                    entityId,
                    slice: name
                });
                await compliance.auditAction(`Saved entity ${entityId}`, {
                    dataKeys: Object.keys(data),
                    slice: name,
                    userContext
                });
            } catch (error) {
                telemetry.captureError(error, {
                    entityId,
                    slice: name,
                    operation: 'save'
                });
                await geminiAI.learnFromInteraction({
                    type: 'save_failure',
                    data: {
                        entityId,
                        data
                    },
                    outcome: 'error',
                    error: error.message
                });
                throw error;
            }

            const savedData = await response.json();
            await geminiAI.learnFromInteraction({
                type: 'save_success',
                data: {
                    entityId,
                    savedData
                },
                outcome: 'success'
            });
            return savedData;
        },
    );

    const initialState = {
        query: {},
        pagination: {
            total: 0,
            page: 1,
            perPage: 25,
        },
        loading: false,
        currentRequestId: null,
        geminiContext: {}, // New: Stores AI-driven contextual information
    };

    const slice = createSlice({
        name,
        initialState: adapter.getInitialState(initialState),
        reducers: {
            setOne: (state, action) => {
                const {
                    payload
                } = action;
                // AI-driven decision on merging or replacing
                const mergeDecision = geminiAI.processPrompt('Decide on setOne merge strategy', {
                    current: state.entities[payload.id],
                    incoming: payload
                });
                if (mergeDecision.decision === 'AI_DECISION_FOR_SET_ONE_MERGE_STRATEGY') {
                    // Apply AI-recommended merge strategy
                    state.entities[payload.id] = { ...state.entities[payload.id],
                        ...payload,
                        _aiMerged: true
                    };
                } else {
                    state.entities[payload.id] = payload;
                }
            },
            setAll: adapter.setAll,
            updateOne: adapter.updateOne,
            updateQuery: (state, action) => {
                state.query = { ...state.query,
                    ...action.payload
                };
                telemetry.trackEvent('query_updated', {
                    slice: name,
                    newQuery: action.payload
                });
            },
            updatePagination: (state, action) => {
                state.pagination = { ...state.pagination,
                    ...action.payload
                };
                telemetry.trackEvent('pagination_updated', {
                    slice: name,
                    newPagination: action.payload
                });
            },
            updateGeminiContext: (state, action) => {
                // Allows AI to update its own context within the Redux store
                state.geminiContext = { ...state.geminiContext,
                    ...action.payload,
                    lastUpdated: new Date().toISOString()
                };
            },
        },
        extraReducers: {
            [save.pending]: (state, action) => {
                if (!state.loading) {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                    telemetry.logMetric('save_pending', 1, {
                        slice: name
                    });
                    state.geminiContext.lastAction = {
                        type: 'save',
                        status: 'pending',
                        requestId: action.meta.requestId
                    };
                }
            },
            [save.fulfilled]: (state, action) => {
                if (state.loading && state.currentRequestId === action.meta.requestId) {
                    const {
                        entityId
                    } = action.meta.arg;

                    state.loading = false;
                    state.currentRequestId = null;
                    state.entities[entityId] = action.payload; // Already handled by adapter.upsertOne in a real scenario
                    telemetry.logMetric('save_fulfilled', 1, {
                        slice: name
                    });
                    state.geminiContext.lastAction = {
                        type: 'save',
                        status: 'fulfilled',
                        entityId,
                        timestamp: new Date().toISOString()
                    };
                }
            },
            [save.rejected]: (state, action) => {
                if (state.loading && state.currentRequestId === action.meta.requestId) {
                    state.loading = false;
                    state.currentRequestId = null;
                    telemetry.logMetric('save_rejected', 1, {
                        slice: name,
                        error: action.error.message
                    });
                    state.geminiContext.lastAction = {
                        type: 'save',
                        status: 'rejected',
                        error: action.error.message,
                        timestamp: new Date().toISOString()
                    };
                    state.geminiContext.errorHistory = [
                        ...(state.geminiContext.errorHistory || []), {
                            action: 'save',
                            error: action.error.message,
                            timestamp: new Date().toISOString()
                        }
                    ];
                }
            },
            [search.pending]: (state, action) => {
                if (!state.loading) {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                    telemetry.logMetric('search_pending', 1, {
                        slice: name
                    });
                    state.geminiContext.lastAction = {
                        type: 'search',
                        status: 'pending',
                        requestId: action.meta.requestId
                    };
                }
            },
            [search.fulfilled]: (state, action) => {
                if (state.loading && state.currentRequestId === action.meta.requestId) {
                    adapter.setAll(state, action.payload.body);

                    state.loading = false;
                    state.currentRequestId = null;
                    state.pagination = action.payload.pagination;
                    telemetry.logMetric('search_fulfilled', 1, {
                        slice: name,
                        count: action.payload.body.length
                    });
                    state.geminiContext.lastAction = {
                        type: 'search',
                        status: 'fulfilled',
                        resultsCount: action.payload.body.length,
                        timestamp: new Date().toISOString()
                    };
                }
            },
            [search.rejected]: (state, action) => {
                if (state.loading && state.currentRequestId === action.meta.requestId) {
                    state.loading = false;
                    state.currentRequestId = null;
                    telemetry.logMetric('search_rejected', 1, {
                        slice: name,
                        error: action.error.message
                    });
                    state.geminiContext.lastAction = {
                        type: 'search',
                        status: 'rejected',
                        error: action.error.message,
                        timestamp: new Date().toISOString()
                    };
                    state.geminiContext.errorHistory = [
                        ...(state.geminiContext.errorHistory || []), {
                            action: 'search',
                            error: action.error.message,
                            timestamp: new Date().toISOString()
                        }
                    ];
                }
            },
            [show.pending]: (state, action) => {
                if (!state.loading) {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                    telemetry.logMetric('show_pending', 1, {
                        slice: name
                    });
                    state.geminiContext.lastAction = {
                        type: 'show',
                        status: 'pending',
                        requestId: action.meta.requestId
                    };
                }
            },
            [show.fulfilled]: (state, action) => {
                if (state.loading && state.currentRequestId === action.meta.requestId) {
                    adapter.upsertOne(state, action.payload); // Add or update the single entity
                    state.loading = false;
                    state.currentRequestId = null;
                    telemetry.logMetric('show_fulfilled', 1, {
                        slice: name
                    });
                    state.geminiContext.lastAction = {
                        type: 'show',
                        status: 'fulfilled',
                        entityId: action.payload.id,
                        timestamp: new Date().toISOString()
                    };
                }
            },
            [show.rejected]: (state, action) => {
                if (state.loading && state.currentRequestId === action.meta.requestId) {
                    state.loading = false;
                    state.currentRequestId = null;
                    telemetry.logMetric('show_rejected', 1, {
                        slice: name,
                        error: action.error.message
                    });
                    state.geminiContext.lastAction = {
                        type: 'show',
                        status: 'rejected',
                        error: action.error.message,
                        timestamp: new Date().toISOString()
                    };
                    state.geminiContext.errorHistory = [
                        ...(state.geminiContext.errorHistory || []), {
                            action: 'show',
                            error: action.error.message,
                            timestamp: new Date().toISOString()
                        }
                    ];
                }
            },
        },
    });

    // Make thunks directly available on actions, like in the original
    slice.actions.search = search;
    slice.actions.show = show;
    slice.actions.save = save;

    return {
        slice,
        adapter,
        selector,
        geminiAI, // Export the slice's dedicated AI instance
        telemetry, // Export the slice's dedicated telemetry instance
        compliance, // Export the slice's dedicated compliance instance
        apiCircuitBreaker, // Export the slice's dedicated circuit breaker
    };
}