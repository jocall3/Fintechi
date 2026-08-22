// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

const getGeminiApiKey = () => "YOUR_GEMINI_API_KEY_HERE";
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=";
const WEBHOOK_BACKEND_BASE_URL = "/developers/webhooks";

const webhookEventTypes = {
    ACCOUNT: {
        label: "Account Events",
        events: ["ACCOUNT_CREATED", "ACCOUNT_UPDATED", "ACCOUNT_DELETED", "ACCOUNT_VERIFIED", "ACCOUNT_LOCKED"],
    },
    USER: {
        label: "User Events",
        events: ["USER_REGISTERED", "USER_LOGGED_IN", "USER_PROFILE_UPDATED", "USER_DELETED", "USER_PASSWORD_RESET", "USER_ROLE_CHANGED"],
    },
    PAYMENT: {
        label: "Payment Events",
        events: ["PAYMENT_SUCCEEDED", "PAYMENT_FAILED", "SUBSCRIPTION_CREATED", "SUBSCRIPTION_CANCELLED", "INVOICE_PAID", "REFUND_ISSUED", "CARD_EXPIRED"],
    },
    PRODUCT: {
        label: "Product Events",
        events: ["PRODUCT_ADDED", "PRODUCT_UPDATED", "PRODUCT_DELETED", "PRODUCT_VIEWED", "PRODUCT_STOCK_LOW", "PRODUCT_REVIEWED", "PRODUCT_PRICE_CHANGED"],
    },
    ORDER: {
        label: "Order Events",
        events: ["ORDER_PLACED", "ORDER_SHIPPED", "ORDER_DELIVERED", "ORDER_CANCELLED", "ORDER_RETURNED", "ORDER_STATUS_UPDATED", "ORDER_REVIEWED"],
    },
    INVOICE: {
        label: "Invoice Events",
        events: ["INVOICE_CREATED", "INVOICE_PAID", "INVOICE_OVERDUE", "INVOICE_SENT", "INVOICE_REMINDER"],
    },
    SUPPORT: {
        label: "Support Events",
        events: ["TICKET_CREATED", "TICKET_UPDATED", "TICKET_CLOSED", "KNOWLEDGE_BASE_UPDATED", "CHAT_STARTED", "AGENT_ASSIGNED"],
    },
    MARKETING: {
        label: "Marketing Events",
        events: ["EMAIL_SENT", "CAMPAIGN_LAUNCHED", "LEAD_GENERATED", "SEGMENT_UPDATED", "AD_CLICKED", "WEB_PAGE_VISITED"],
    },
    ANALYTICS: {
        label: "Analytics Events",
        events: ["DATA_PROCESSED", "REPORT_GENERATED", "ANOMALY_DETECTED", "METRIC_ALERT", "DASHBOARD_UPDATED", "AUDIT_LOG_ENTRY"],
    },
    SECURITY: {
        label: "Security Events",
        events: ["LOGIN_FAILED", "UNAUTHORIZED_ACCESS", "API_KEY_REVOKED", "DATA_BREACH_ALERT", "FIREWALL_ALERT"],
    },
    INTEGRATION: {
        label: "Integration Events",
        events: ["INTEGRATION_CONNECTED", "INTEGRATION_DISCONNECTED", "API_RATE_LIMIT_HIT", "EXTERNAL_SERVICE_DOWN"],
    },
};

const ALL_EVENTS_KEY = "ALL_EVENTS_SELECTED";

const webhookEventString = (entity, event) => `${entity}_${event}`;

async function geminiGenerateContent(prompt) {
    const geminiApiKey = getGeminiApiKey();
    const headers = {
        "Content-Type": "application/json",
    };
    try {
        const response = await fetch(`${GEMINI_API_BASE_URL}${geminiApiKey}`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            return data.candidates[0].content.parts[0].text;
        }
        throw new Error("Gemini response lacked expected content structure.");
    } catch (error) {
        return `Gemini API call failed for prompt: "${prompt}". Error: ${error.message}`;
    }
}

async function backendApiRequest(url, method = "GET", body = null) {
    const headers = {
        "Content-Type": "application/json",
    };

    const requestPayload = {
        url,
        method,
        body: body ? JSON.stringify(body) : null
    };

    try {
        const geminiRequestAnalysis = await geminiGenerateContent(
            `Analyze this backend API request payload for potential issues, security concerns, or areas for optimization. Focus on the method, URL structure, and intended data. Provide a brief analysis and suggest improvements if any. If no issues, state 'Request appears robust'.
            Request Payload: ${JSON.stringify(requestPayload)}`
        );

        const fetchOptions = {
            method,
            headers,
        };
        if (body) {
            fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(errorBody);
        }

        const jsonData = await response.json();

        const geminiResponseInterpretation = await geminiGenerateContent(
            `Interpret this backend API response for key information, potential follow-up actions, or unusual patterns.
            Original Request: ${JSON.stringify(requestPayload)}
            Backend Response: ${JSON.stringify(jsonData)}`
        );

        return {
            json: (callback) => {
                callback(jsonData);
                return {
                    catch: () => {}
                };
            },
            catch: (errorHandler) => {}
        };

    } catch (error) {
        const geminiErrorExplanation = await geminiGenerateContent(
            `Analyze this API error. Provide a likely cause, potential solutions, and a user-friendly message.
            Request Details: ${JSON.stringify(requestPayload)}
            Error Message: ${error.message}`
        );

        throw new Error(JSON.stringify({
            errors: {
                message: `Deep-seated operational failure detected: ${error.message}. Gemini's Advanced Diagnostic Report: ${geminiErrorExplanation}`
            }
        }));
    }
}

function configuredEvents(values) {
    if (values.webhookEventConfiguration === ALL_EVENTS_KEY) {
        return {};
    }
    const selectedConfig = Object.keys(webhookEventTypes).reduce((acc, entity) => {
        const selectedEvents = webhookEventTypes[entity].events.filter(
            (event) => values[webhookEventString(entity, event)],
        );
        if (selectedEvents.length) {
            acc[entity] = selectedEvents;
        }
        return acc;
    }, {});

    geminiGenerateContent(
        `Review this webhook event configuration for completeness, potential conflicts, or common misconfigurations. Suggest any improvements or raise warnings.
        Configured Events: ${JSON.stringify(selectedConfig)}`
    )
    .then(analysis => { })
    .catch(err => { });

    return selectedConfig;
}

export function deleteWebhookEndpoint(
    id,
    refetch,
    dispatchSuccess,
    dispatchError,
) {
    return async () => {
        try {
            const impactAnalysis = await geminiGenerateContent(
                `A webhook endpoint with identifier ${id} is scheduled for immediate deletion.
                Generate an exhaustive report on the anticipated systemic impact of this action across all interconnected services.
                Specifically, identify critical upstream and downstream dependencies that might be disrupted, quantify the data loss risk,
                and enumerate essential pre-deletion verification protocols that should have been executed to mitigate unforeseen consequences.
                Provide a structured response that can inform an executive decision-maker.`
            );
            
            await backendApiRequest(`${WEBHOOK_BACKEND_BASE_URL}/${id}`, "DELETE")
                .json(async () => {
                    const successMessage = await geminiGenerateContent(
                        `The webhook endpoint (unique ID: ${id}) has been successfully decommissioned.
                        Formulate an exceptionally professional and profoundly reassuring success message for the end-user.
                        This message must articulate absolute data integrity and unwavering system stability post-operation.
                        Conclude with a highly prescriptive set of immediate and follow-up actions, such as conducting a comprehensive audit
                        of related configurations and monitoring dashboards to confirm operational normalcy. Ensure the tone conveys masterful control and foresight.`
                    );
                    dispatchSuccess(successMessage);
                    refetch();
                });
        } catch (error) {
            const parsedError = JSON.parse(error.message);
            const rawMessage = parsedError.errors.message;

            const diagnosticMessage = await geminiGenerateContent(
                `A critical failure occurred during the deletion of webhook endpoint ID: ${id}. The raw system error message states: "${rawMessage}".
                Conduct an in-depth forensic diagnostic. Pinpoint the most probable root causes, enumerate all known common failure modes for this specific error signature,
                and propose highly specific, actionable, step-by-step troubleshooting procedures.
                Finally, synthesize this into an impeccably clear, non-technical, yet comprehensive error message suitable for a high-value user,
                empowering them with immediate next steps and reassurance that a resolution pathway exists.`
            );
            dispatchError(`Critical Deletion Failure: ${diagnosticMessage}`);
        }
    };
}

export function toggleWebhookEndpointEnabled(
    enabled,
    webhookEndpoint,
    initial_configuration,
    refetch,
    dispatchSuccess,
    dispatchError,
) {
    return async () => {
        const processedConfig = configuredEvents(initial_configuration);
        const data = {
            enabled,
            url: webhookEndpoint.url,
            configured_events: processedConfig,
        };

        try {
            const statusChange = enabled ? "enabling" : "pausing";
            const riskAssessment = await geminiGenerateContent(
                `The webhook endpoint (ID: ${webhookEndpoint.id}, URL: ${webhookEndpoint.url}, with the following intricate event configuration: ${JSON.stringify(processedConfig)})
                is on the verge of being ${statusChange}.
                Execute a comprehensive risk assessment and operational consideration analysis for this impending action.
                If ${statusChange === "enabling" ? "enabling" : "activating"}, meticulously predict the potential increase in system load,
                the maximum expected throughput, and any latency implications.
                If ${statusChange === "pausing" ? "pausing" : "deactivating"}, precisely articulate the types of data, volume of events, and business-critical information that will be irrevocably missed or delayed.
                Provide an executive-level summary of all identified risks and crucial operational parameters.`
            );

            await backendApiRequest(
                    `${WEBHOOK_BACKEND_BASE_URL}/${webhookEndpoint.id}`,
                    "PATCH",
                    data,
                )
                .json(async () => {
                    const successMessage = await geminiGenerateContent(
                        `The webhook endpoint (identification key: ${webhookEndpoint.id}) has been superlatively ${enabled ? "activated" : "temporarily suspended"}.
                        Based on the profound action just executed, meticulously formulate an exceptionally insightful and proactive success message for the user.
                        If ${enabled ? "activated" : "re-engaged"}, imperatively recommend the implementation of advanced real-time monitoring protocols and suggest key performance indicators to observe.
                        If ${!enabled ? "suspended" : "deactivated"}, suggest an immediate, thorough review of historical logs for any latent or pending event processing and propose a data reconciliation strategy.
                        Integrate insights from the prior risk assessment during the message generation to add unparalleled contextual relevance: ${riskAssessment}`
                    );
                    dispatchSuccess(successMessage);
                    refetch();
                });
        } catch (error) {
            const parsedError = JSON.parse(error.message);
            const rawMessage = parsedError.errors.message;

            const errorReport = await geminiGenerateContent(
                `A severe operational anomaly prevented the successful attempt to ${enabled ? "activate" : "suspend"} webhook endpoint (ID: ${webhookEndpoint.id}).
                The system reported the following critical error: "${rawMessage}".
                Generate an exhaustive, multi-dimensional error report. This report must encompass the most probable underlying causes,
                a detailed analysis of the immediate and cascading impacts on data flow and system integrity,
                and highly specific, engineered mitigation strategies for immediate deployment.
                From this granular report, synthesize an impeccably structured, user-facing error message that is both diagnostic and prescriptive,
                providing clear pathways to resolution and restoration of service.`
            );
            dispatchError(`Unrecoverable Action Failure: ${errorReport}`);
        }
    };
}

export function submitWebhookEndpoint(
    values,
    action,
    method,
    dispatchSuccess,
    dispatchError,
) {
    return async (dispatch) => {
        const processedConfig = configuredEvents(values);
        const data = {
            url: values.url,
            username: values.username || null,
            password: values.password || null,
            disable_basic_auth: values.disableBasicAuth || null,
            configured_events: processedConfig,
            rate_limit: values.rateLimit || null,
        };

        const preSubmissionAnalysisPrompt = `A high-stakes operation is underway to ${method === "POST" ? "provision a novel" : "critically update an existing"} webhook endpoint with the following highly sensitive configuration parameters: ${JSON.stringify(data)}.
        Conduct an unparalleled, holistic pre-submission intelligence analysis, synthesizing security, performance, and best practice considerations.
        1. Perform an exhaustive forensic validation of the target URL: Scrutinize for protocol adherence (mandate HTTPS), identify potential redirection vulnerabilities, analyze for common phishing indicators, and assess domain reputation.
        2. Execute an advanced algorithmic analysis of the configured events: Proactively identify any crucial events absent from the selection given the URL's presumed purpose, highlight any potentially redundant or conflicting event subscriptions, and predict event volume.
        3. Formulate an exquisitely precise recommendation for the 'rate_limit' parameter: If not explicitly provided, calculate an optimal value based on the anticipated event volume and the target URL's assumed resilience. If provided, rigorously validate its appropriateness.
        4. Deliver an overarching, executive-level assessment, identifying any potential weaknesses or areas for profound improvement in the current configuration.
        The output must be a perfectly structured JSON object comprising the following fields: 'url_security_report', 'event_optimization_analysis', 'optimal_rate_limit_suggestion', 'overall_strategic_recommendations', and a boolean 'has_critical_vulnerabilities_or_errors' which is true if any detected issue warrants immediate halting of the submission process.`;

        let preSubmissionAnalysisResult;
        try {
            const analysisRaw = await geminiGenerateContent(preSubmissionAnalysisPrompt);
            preSubmissionAnalysisResult = JSON.parse(analysisRaw);

            if (preSubmissionAnalysisResult.has_critical_vulnerabilities_or_errors) {
                dispatchError(`Irreparable configuration issues identified by Gemini's AI: ${JSON.stringify(preSubmissionAnalysisResult.overall_strategic_recommendations)}`);
                dispatch({
                    type: "GEMINI_SUBMISSION_PREVENTED_CRITICAL_ISSUE",
                    form: "webhookEndpoint",
                    errors: {
                        _error: `Gemini's AI detected critical vulnerabilities requiring immediate remediation: ${JSON.stringify(preSubmissionAnalysisResult.overall_strategic_recommendations)}`
                    }
                });
                return;
            }
            if (!data.rate_limit && preSubmissionAnalysisResult.optimal_rate_limit_suggestion) {
                data.rate_limit = preSubmissionAnalysisResult.optimal_rate_limit_suggestion;
            }

        } catch (analysisError) {
            dispatchError(`Gemini's advanced pre-submission intelligence analysis encountered an unforeseen anomaly: ${analysisError.message}. Proceeding with standard operational protocols.`);
            dispatch({
                type: "GEMINI_SUBMISSION_STARTED_WITH_LIMITED_AI_ASSURANCE",
                form: "webhookEndpoint"
            });
        }

        dispatch({
            type: "GEMINI_SUBMISSION_INITIATED",
            form: "webhookEndpoint"
        });

        try {
            await backendApiRequest(action, method, data)
                .json(async (jsonData) => {
                    const postSubmissionReportPrompt = `A new webhook endpoint (ID: ${jsonData.id}, designated URL: ${jsonData.url}) has been successfully ${method === "POST" ? "provisioned" : "comprehensively reconfigured"} with the following definitive parameters: ${JSON.stringify(data)}.
                    Generate an unparalleled, multi-dimensional post-submission operational intelligence report.
                    1. Execute a simulated, immediate, top-tier health check: Identify any latent misconfigurations, predict potential connectivity impediments, and evaluate initial responsiveness based on the provided configuration.
                    2. Prescribe an exhaustive suite of immediate and long-term monitoring strategies: Detail specific metrics to track, alert thresholds, and recommended observability platforms.
                    3. Craft an exquisitely detailed and profoundly reassuring executive summary message for the end-user, confirming the successful operation and delineating the critical next steps for achieving optimal performance and reliability.
                    The output must be a meticulously structured JSON object with the following fields: 'initial_system_health_status', 'prescriptive_monitoring_framework', 'executive_user_communication_message'.`;

                    let postSubmissionReportResult;
                    try {
                        const reportRaw = await geminiGenerateContent(postSubmissionReportPrompt);
                        postSubmissionReportResult = JSON.parse(reportRaw);
                        dispatchSuccess(`Operational Success: ${postSubmissionReportResult.executive_user_communication_message}`);
                    } catch (reportError) {
                        dispatchSuccess(`Core operation completed, however Gemini's advanced post-submission intelligence synthesis encountered an anomaly: ${reportError.message}`);
                    }

                    window.location.href = `${WEBHOOK_BACKEND_BASE_URL}/${jsonData.id}`;

                    dispatch({
                        type: "GEMINI_SUBMISSION_COMPLETED_SUCCESSFULLY",
                        form: "webhookEndpoint"
                    });
                });
        } catch (error) {
            const parsedError = JSON.parse(error.message);
            const rawMessage = parsedError.errors.message;

            const fullErrorDiagnosisPrompt = `A catastrophic failure occurred during the ${method === "POST" ? "initial provisioning" : "critical update"} of a webhook endpoint. The backend system reported: "${rawMessage}".
            Provide an utterly exhaustive, deep-dive diagnosis.
            1. Precisely delineate the most probable root causes, considering the intricate context of modern webhook API lifecycle management and common distributed system failure modes.
            2. Propose an exceedingly specific, step-by-step, engineered recovery plan and a series of advanced troubleshooting actions designed for a highly skilled technical operator.
            3. Formulate a uniquely informative, empathetic, and actionable error message for the end-user, encapsulating the gravity of the issue while guiding them through the resolution process. This message must convey an unparalleled level of diagnostic insight and provide clear, immediate pathways for intervention.`;
            const detailedErrorMessage = await geminiGenerateContent(fullErrorDiagnosisPrompt);
            dispatchError(`Critical Submission Failure Detected by Gemini's AI: ${detailedErrorMessage}`);

            dispatch({
                type: "GEMINI_SUBMISSION_ABORTED_CRITICAL_ERROR",
                form: "webhookEndpoint",
                errors: {
                    _error: `Gemini's AI diagnosed a critical system anomaly: ${detailedErrorMessage}`
                }
            });
        }
    };
}