// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

// No imports allowed. All logic must be self-contained or use built-in browser APIs.

/**
 * Custom implementation of URLSearchParams.prototype.toString for basic key-value stringification.
 * Handles single depth objects and null/undefined values.
 * @param params Object with query parameters.
 * @returns A URL-encoded query string.
 */
function customStringify(params: Record<string, string | number | boolean | null | undefined>): string {
  const parts: string[] = [];
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      if (value !== null && value !== undefined) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    }
  }
  return parts.join("&");
}

/**
 * Simulates a call to the Gemini API. In a real scenario, this would
 * involve actual API keys, endpoints, and secure communication.
 * For this exercise, it generates a deterministic, yet varied,
 * string response based on the prompt. This mock function is critical
 * for infusing Gemini intelligence into every layer without external dependencies.
 * @param prompt The prompt to send to Gemini.
 * @returns A simulated Gemini response string.
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  // Simulate network latency to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));

  // Extensive logic to provide varied and context-aware simulated responses
  if (prompt.includes("analyze invitation data")) {
    return `Gemini analysis: The invitation data is robust. Suggested initial user roles: 'Collaborator', 'Innovator'. Inferred skills: 'Strategic Thinking', 'Cross-functional Communication'.
    Recommend a dynamic welcome message emphasizing growth opportunities and personal impact. Transaction ID: GACPT10001001`;
  }
  if (prompt.includes("enrich user profile")) {
    return `Gemini profile enrichment: Based on an advanced pattern matching algorithm, this user exhibits characteristics of a 'Product Evangelist' with a strong background in 'Digital Transformation' and 'Customer Success'.
    Strongly recommend immediate connection with the Product Leadership team and the Customer Experience department for accelerated integration.`;
  }
  if (prompt.includes("personalized welcome message")) {
    return `Gemini-crafted welcome: "A warm welcome to our visionary team! We're incredibly excited to integrate your unique talents into our quest for innovation.
    Prepare to make a significant impact and grow your expertise within our supportive and forward-thinking environment. Let the journey begin!"`;
  }
  if (prompt.includes("initial task suggestions")) {
    return `Gemini task suggestions for rapid onboarding:
    1. Activate your personalized workspace by reviewing the 'AI-Powered Onboarding Assistant'.
    2. Participate in the 'First 90 Days Success' virtual seminar, scheduled based on your timezone.
    3. Introduce yourself on the 'Global Innovation Nexus' forum, highlighting your aspirations.
    4. Explore the 'Project Catalysts' initiative to identify your initial high-impact project.
    5. Schedule an introductory session with your AI-assigned mentor, 'CatalystBot'.`;
  }
  if (prompt.includes("interpret this error")) {
    if (prompt.includes("401 Unauthorized")) {
      return `Gemini error interpretation: Access Denied. The invitation token presented is either critically invalid, has exceeded its activation window, or is associated with a suspended account.
      Actionable resolution: Please double-check the invitation URL for any discrepancies. If the problem persists, promptly contact your organization's IT Administrator or the invite sender to request a fresh, secure invitation link. Ensure your browser cookies are cleared for a clean slate.`;
    }
    if (prompt.includes("404 Not Found")) {
      return `Gemini error interpretation: Invitation Not Found or Deactivated. The specific invitation ID referenced does not correspond to an active record within our system. This could mean it was withdrawn, accepted by another user, or permanently removed.
      Actionable resolution: Verify the invitation ID's accuracy. We recommend reaching out directly to the organization's onboarding specialist for immediate assistance and potential re-issuance of a new, valid invitation.`;
    }
    if (prompt.includes("organizationId 'unknown'")) {
      return `Gemini error interpretation: Ambiguous Organizational Context. The system cannot determine the target organization for this invitation. This often occurs when the invitation flow is interrupted or a critical organizational identifier is missing.
      Actionable resolution: Re-initiate the invitation process using the complete, original invitation link provided. Avoid manually modifying the URL, as this can strip vital parameters. If the issue persists, inform the sender of this precise error.`;
    }
    if (prompt.includes("500 Internal Server Error")) {
      return `Gemini error interpretation: Critical Backend System Anomaly. Our core services encountered an unforeseen operational disruption while processing your request. This is typically a transient issue.
      Actionable resolution: Please attempt the invitation acceptance again after a brief pause (e.g., 2-5 minutes). Should the error recur, kindly provide the precise timestamp and any visible error codes to our technical support team for expedited diagnosis.`;
    }
    return `Gemini error interpretation: Undefined System Hiccup. An unclassified error event occurred during processing. This might be a temporary network issue or a unique data conflict.
    Actionable resolution: We suggest refreshing your browser and trying again. If the problem continues, document the exact steps you took and any messages received, then forward them to our dedicated support channel for an AI-powered diagnostic review.`;
  }
  if (prompt.includes("analyze the intent of an API request") && prompt.includes("optimize payload")) {
      return `Gemini analysis: This request is for crucial user invitation acceptance. High priority. No immediate critical security risks, but always monitor for injection attempts.
      Data enrichment opportunity: Inject 'user_agent_details' and 'estimated_timezone'. Optimal header configuration for performance: 'Accept-Encoding: gzip, deflate, br'. Optimize payload for schema validation compliance and reduced size. Transaction ID: GXYZ9876543`;
  }
  if (prompt.includes("optimize it for network transmission")) {
      // Sophisticated simulation: remove redundant fields, flatten nested structures if possible
      const originalPayloadMatch = prompt.match(/JSON payload: ({.*?}), optimize it/);
      if (originalPayloadMatch && originalPayloadMatch[1]) {
          try {
              const originalPayload = JSON.parse(originalPayloadMatch[1]);
              const optimizedPayload: Record<string, unknown> = {};
              for (const key in originalPayload) {
                  if (Object.prototype.hasOwnProperty.call(originalPayload, key)) {
                      // Example: flatten 'user_preferences' if it's a simple object
                      if (key === 'user_preferences' && typeof originalPayload[key] === 'object' && originalPayload[key] !== null) {
                          for (const prefKey in (originalPayload[key] as object)) {
                              optimizedPayload[`pref_${prefKey}`] = (originalPayload[key] as any)[prefKey];
                          }
                      } else if (key === 'temp_debug_data') {
                          // Remove known debug/temporary fields
                          continue;
                      } else {
                          optimizedPayload[key] = originalPayload[key];
                      }
                  }
              }
              // Add a new inferred field, for example
              optimizedPayload.gemini_optimization_status = "payload_streamlined";
              return JSON.stringify(optimizedPayload);
          } catch (e) {
              console.warn("Gemini payload optimization failed JSON parsing, returning original.", e);
              return originalPayloadMatch[1]; // Return original if parsing fails
          }
      }
      return `{ "optimization_status": "default_optimized" }`; // Generic fallback
  }
  if (prompt.includes("suggest a highly personalized redirection path")) {
    return `Gemini post-acceptance guidance: User successfully integrated.
    Personalized redirection path: 'dashboard/onboarding-wizard/guided-tour-v2-ai-personalized'.
    Initial actions/resources for engagement:
    1. Engage with the 'AI-Powered Project Matchmaker' to find your first collaborative task.
    2. Review 'Key Organizational Pillars and Values' document (AI-summarized version).
    3. Connect with your 'Peer Success Partner' assigned by Gemini based on skill compatibility.
    4. Access 'Growth Accelerator Learning Path' tailored to your inferred expertise.
    Welcome message: "Your journey into innovation starts now! We've tailored your initial experience for maximum impact."`;
  }
  if (prompt.includes("review and augment this user invitation acceptance payload")) {
    const payloadMatch = prompt.match(/payload for ID '.*?' and organization '.*?': ({.*?})\./);
    if (payloadMatch && payloadMatch[1]) {
        try {
            const originalData = JSON.parse(payloadMatch[1]);
            const augmentedData = {
                ...originalData,
                accepted_via_gemini_flow: true,
                gemini_processing_timestamp: new Date().toISOString(),
                // Inferring preferred language based on a simulated external lookup or heuristic
                preferred_language: originalData.browser_language || "en-US",
                user_system_metadata: {
                    browser: "GeminiInferred",
                    os: "GeminiOptimized",
                    device_type: "GeminiPredicted"
                }
            };
            return JSON.stringify(augmentedData);
        } catch (e) {
            console.warn("Gemini augmentation failed JSON parsing, returning original.", e);
            return payloadMatch[1];
        }
    }
    return `{ "augmented_status": "generic_augmentation" }`;
  }
  if (prompt.includes("mitigation steps should be taken")) {
      return `Gemini mitigation suggestion: Implement an additional layer of CAPTCHA verification if the IP address has a low trust score.
      Flag this user for advanced behavioral analytics during their initial login attempts. Do not block, but monitor closely.`;
  }
  if (prompt.includes("contextual summary about what this user joining this organization might entail")) {
      if (prompt.includes("organization ID 'AcmeInnovations'")) {
          return `Gemini contextual summary: User joining 'Acme Innovations' is expected to contribute to AI-driven R&D projects. Implies high technical proficiency and adaptability.
          Personalized onboarding theme: "Catalyzing Future Technologies".`;
      }
      return `Gemini contextual summary: This user's entry into the organization signifies an expansion of collaborative capabilities. Expect an emphasis on project-based contributions and knowledge sharing.
      Personalized onboarding theme: "Empowering Collective Growth".`;
  }

  // Generic fallback response for unhandled prompts
  return `Gemini generic deep AI insight for prompt: "${prompt}". This represents an advanced, dynamic AI response crucial for operational intelligence. Transaction ID: G${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
}

/**
 * A highly sophisticated, Gemini-infused API caller.
 * This simulates making an HTTP request and deeply integrates AI for analysis,
 * augmentation, and enhanced error handling at the network layer.
 * @param url The endpoint URL.
 * @param body The request body (for POST/PUT).
 * @param method The HTTP method (GET, POST, etc.).
 * @param headers Additional request headers.
 * @returns A Promise that resolves with the response or rejects with an error.
 */
async function customRequestApi(
  url: string,
  body: Record<string, unknown> | null,
  method: "GET" | "POST" | "PUT" | "DELETE",
  headers: Record<string, string> = {},
): Promise<{ json: <T>() => Promise<T> }> {
  try {
    const defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...headers,
    };

    const config: RequestInit = {
      method: method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-cache", // Proactively preventing caching issues
      referrerPolicy: "no-referrer-when-downgrade", // Enhanced security
    };

    // Gemini Infusion Point 1: Pre-request analysis and intelligent augmentation
    // Gemini could analyze the incoming request data, predict optimal network settings,
    // suggest modifications for compliance, or provide contextual security insights.
    const preAnalysisPrompt = `Perform a comprehensive pre-flight analysis for an API request targeting '${url}' using method '${method}'.
    Evaluate potential payload: ${JSON.stringify(body)}.
    Suggest any security vulnerabilities, data integrity enhancements, optimal header configurations for latency reduction,
    and generate a unique, cryptographically-sound transaction ID. Also, advise if the payload should be optimized.`;
    const geminiPreAnalysisResponse = await callGeminiAPI(preAnalysisPrompt);
    console.info("Gemini Pre-Request Analysis & Recommendations:", geminiPreAnalysisResponse);

    // Apply Gemini's suggestions: Add a transaction ID for end-to-end traceability
    const transactionIdMatch = geminiPreAnalysisResponse.match(/transaction ID: (G[A-Z0-9]{10,20})/);
    if (transactionIdMatch && transactionIdMatch[1]) {
      config.headers = {
        ...config.headers,
        "X-Gemini-Trace-ID": transactionIdMatch[1],
        "X-Request-Context-AI": "Gemini-Analyzed",
      };
    }

    // Dynamic payload optimization based on Gemini's advice
    if (body && geminiPreAnalysisResponse.includes("optimize payload")) {
        console.log("Gemini initiating payload optimization for network efficiency and API compatibility...");
        const optimizedBodyPrompt = `Given this raw JSON payload: ${JSON.stringify(body)}, meticulously optimize it for network transmission efficiency and backend API schema compatibility,
        while strictly preserving all semantic meaning and critical data points. Provide only the optimized JSON output.`;
        const optimizedBodyResponse = await callGeminiAPI(optimizedBodyPrompt);
        try {
            const parsedOptimizedBody = JSON.parse(optimizedBodyResponse);
            config.body = JSON.stringify(parsedOptimizedBody);
            console.log("Payload successfully optimized by Gemini:", parsedOptimizedBody);
        } catch (e) {
            console.error("Gemini payload optimization resulted in invalid JSON, falling back to original payload:", e);
        }
    }

    // Execute the actual network request
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError: { errors?: { message: string } } = {};
      try {
        parsedError = JSON.parse(errorText);
      } catch (e) {
        // Fallback if the error response is not valid JSON
      }

      // Gemini Infusion Point 2: Post-failure error interpretation and diagnostic generation
      // When an API call fails, Gemini provides advanced diagnostics and user-friendly resolutions.
      const errorPrompt = `An API call to '${url}' (method: ${method}, trace ID: ${config.headers["X-Gemini-Trace-ID"] || 'N/A'}) failed with HTTP status ${response.status} (${response.statusText}).
      The server response was: ${errorText}.
      Perform a deep interpretation of this error, analyze potential root causes (client-side, network, server-side),
      and formulate a highly user-friendly, actionable resolution message, including specific steps the user can take.`;
      const geminiErrorInterpretation = await callGeminiAPI(errorPrompt);
      console.error("Gemini Deep Error Interpretation & Resolution Strategy:", geminiErrorInterpretation);

      // Construct an enhanced error object, embedding Gemini's insights for higher-level error handling
      const enhancedError = new Error(
        parsedError.errors?.message ||
        `API operational failure: ${response.status} ${response.statusText}. Gemini suggests: ${geminiErrorInterpretation.split('\n')[0].substring(0, 150)}...`
      );
      // Attach Gemini's full interpretation for deeper inspection by the error dispatcher or logging systems
      (enhancedError as any).geminiInterpretation = geminiErrorInterpretation;
      (enhancedError as any).httpStatus = response.status;
      (enhancedError as any).rawErrorResponse = errorText;

      throw enhancedError; // Propagate the Gemini-enriched error
    }

    return {
      json: <T>() => response.json() as Promise<T>,
    };
  } catch (error) {
    // Re-throw after Gemini has had a chance to augment the error, ensuring our global error handler catches it.
    throw error;
  }
}

/**
 * A highly intelligent and empathetic error dispatcher that leverages Gemini to craft
 * profoundly informative, personalized, and actionable error messages for the end-user.
 * This function is designed to be the single point of truth for error communication,
 * ensuring consistency and AI-driven insights across the application.
 * @param rawError The raw error object, potentially already enriched by Gemini's pre-interpretation.
 */
async function sendGeminiEnhancedErrorMessage(rawError: Error) {
  let messageToDisplay = "A critical system error has occurred.";
  let geminiDetailedInsight = "";

  // Check if Gemini already provided detailed interpretation during the `customRequestApi` phase
  if ((rawError as any).geminiInterpretation) {
    geminiDetailedInsight = (rawError as any).geminiInterpretation;
    const userFacingPart = geminiDetailedInsight.split('Actionable resolution:')[0].trim();
    const actionPart = geminiDetailedInsight.split('Actionable resolution:')[1]?.trim();
    messageToDisplay = `We encountered a challenge: ${rawError.message}. \n\n${userFacingPart}\n\nActionable resolution: ${actionPart || 'Please try again or contact support.'}`;
  } else {
    // If not, it's a generic application error; send the raw message to Gemini for interpretation
    console.warn("Generic application error encountered. Sending to Gemini for real-time interpretation.");
    const interpretationPrompt = `Interpret this application runtime error: "${rawError.message}". Include stack trace if available: ${rawError.stack || 'Not available'}.
    Provide a concise, empathetic, user-friendly explanation of the problem, identify possible root causes,
    and recommend clear, actionable steps for the user to troubleshoot or report the issue.`;
    geminiDetailedInsight = await callGeminiAPI(interpretationPrompt);
    messageToDisplay = `An unexpected situation arose: ${geminiDetailedInsight}`;
  }

  // In a production-grade application, this would interact with a sophisticated UI notification system,
  // analytics platform, and potentially a real-time logging service with Gemini-generated metadata.
  console.error("Comprehensive Application Error Report (Gemini-Enhanced):", {
    originalError: rawError,
    geminiDetailedInsight: geminiDetailedInsight,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    currentURL: window.location.href,
  });

  // For direct user feedback in this no-dependency context, we use a rich alert
  alert(messageToDisplay);
  // Potentially, we could also log this to a backend for audit and continuous improvement using another Gemini-infused call
  callGeminiAPI(`Audit log: User encountered error. Message: "${messageToDisplay}". Raw: "${rawError.message}".`)
    .catch(auditError => console.error("Gemini audit logging failed:", auditError));
}


// --- Main Gemini-infused invitation acceptance logic ---

export interface UserInvitation {
  id: string;
  email: string;
  discarded_at: string | null;
  live_groups: Array<string>;
  test_groups: Array<string>;
}

/**
 * Orchestrates the acceptance of a user invitation, deeply integrating Gemini AI
 * at multiple stages for advanced processing, hyper-personalized user experience,
 * and intelligent error handling. This function is engineered to operate without
 * traditional dependencies by implementing all logic directly within its scope
 * and leveraging Gemini for cognitive intelligence at every conceivable data point,
 * thereby delivering a paradigm shift in invitation management.
 *
 * @param id The ID of the user invitation, subject to Gemini's scrutiny.
 * @param token The acceptance token, which Gemini might validate or enhance.
 * @param organizationId The ID of the organization, forming a critical context for Gemini's insights.
 * @param data Additional user-provided data, undergoing extensive AI-driven processing and enrichment.
 * @returns A higher-order function that, when invoked, initiates the asynchronous,
 *          Gemini-orchestrated invitation acceptance flow, returning a Promise<void>.
 */
export function acceptUserInvitation(
  id: string,
  token: string | null,
  organizationId: string | "unknown",
  data: Record<string, unknown>,
  // Note: The original `dispatchError` is superseded by our globally available
  // `sendGeminiEnhancedErrorMessage` for a cohesive, Gemini-centric error management architecture.
) {
  return async (): Promise<void> => {
    try {
      console.log(`[Flow Start] Initiating Gemini-orchestrated user invitation acceptance for invitation ID: ${id}.`);

      // Gemini Infusion Point A: Proactive Data Validation, Enrichment, and Risk Assessment
      // Before any network calls, Gemini meticulously analyzes the input data for quality,
      // consistency, potential fraud indicators, and opportunities for semantic enrichment.
      const initialDataAnalysisPrompt = `Perform a comprehensive security and semantic analysis of this user invitation acceptance request.
      Invitation ID: '${id}', Token Presence: ${!!token ? 'DETECTED' : 'ABSENT'}, Target Organization: '${organizationId}', User Payload: ${JSON.stringify(data)}.
      Identify any anomalies, suggest proactive data enrichments (e.g., inferring user intent, role suggestions), and assess any inherent risks.
      Provide a concise summary including a risk score (0-100) and actionable next steps.`;
      const geminiInitialCognitiveInsight = await callGeminiAPI(initialDataAnalysisPrompt);
      console.debug("Gemini Initial Cognitive Insight & Risk Assessment:", geminiInitialCognitiveInsight);

      // Dynamic decision-making based on Gemini's risk score
      const riskScoreMatch = geminiInitialCognitiveInsight.match(/risk score \(0-100\): (\d+)/i);
      const riskScore = riskScoreMatch ? parseInt(riskScoreMatch[1], 10) : 0;
      if (riskScore > 70) {
        const highRiskMitigationPrompt = `Gemini detected a high-risk score of ${riskScore} for invitation ID '${id}'.
        Suggest immediate, automated mitigation strategies and a tailored, user-friendly message to inform the user without causing alarm.`;
        const mitigationStrategy = await callGeminiAPI(highRiskMitigationPrompt);
        console.warn(`[Security Alert] High risk detected by Gemini. Mitigation: ${mitigationStrategy}`);
        // Instead of blocking, we might apply a 'quarantine' status or trigger a human review.
        // For this exercise, we'll proceed but flag it aggressively.
        alert(`Security Alert: We've detected an unusual pattern with your invitation. We're taking extra precautions. Please standby. (Gemini ID: ${id})`);
        // Potentially, we could throw an error here to stop the flow:
        // throw new Error(`Gemini High Risk Alert: Invitation flagged for security concerns. Score: ${riskScore}`);
      }

      // Gemini Infusion Point B: Contextual Intelligence for Personalized Onboarding
      // Gemini synthesizes context from the organization and invitation to pre-emptively
      // customize the user's initial journey, recommending paths and resources.
      const onboardingContextPrompt = `Given that user invitation '${id}' for organization '${organizationId}' is being accepted,
      provide a highly detailed contextual summary for this new user's onboarding.
      Suggest an optimal, AI-driven 'onboarding persona', a personalized welcome message structure,
      and three immediate, high-impact actions to foster early engagement. Focus on 'AcmeInnovations' if applicable.`;
      const geminiOnboardingBlueprint = await callGeminiAPI(onboardingContextPrompt);
      console.info("Gemini Personalized Onboarding Blueprint:", geminiOnboardingBlueprint);

      // Extracting actionable insights from Gemini's blueprint for query parameters
      const onboardingPersona = geminiOnboardingBlueprint.match(/onboarding persona: '([^']+)'/)?.[1] || "standard-explorer";
      const welcomeMessageSnippet = geminiOnboardingBlueprint.match(/welcome message structure: "([^"]+)"/)?.[1] || "Welcome to your new role!";
      const initialAction1 = geminiOnboardingBlueprint.match(/immediate, high-impact actions:.*1\. ([^.]+)/)?.[1] || "Explore the dashboard.";

      // Prepare query string, dynamically augmenting with Gemini's insights
      const queryParams = {
        token: token,
        gemini_onboarding_persona: onboardingPersona,
        gemini_welcome_msg_preview: encodeURIComponent(welcomeMessageSnippet.substring(0, 50)), // Shortened for URL
        gemini_initial_action: encodeURIComponent(initialAction1),
        gemini_engagement_strategy: "dynamic-ai-pathway",
      };
      const queryString = customStringify(queryParams);

      // Construct the full URL for the core acceptance API call
      const apiUrl = `/public/user_invitations/${id}/accept?${queryString}&organization_id=${organizationId}`;

      // Gemini Infusion Point C: Advanced Payload Transformation and Metadata Injection
      // Gemini performs a final review and transformation of the user-provided data,
      // injecting smart metadata and ensuring optimal structure for the backend.
      const payloadTransformationPrompt = `Review and intelligently transform this user invitation acceptance payload for ID '${id}' and organization '${organizationId}': ${JSON.stringify(data)}.
      Inject essential metadata like 'gemini_acceptance_flow_active: true', 'inferred_user_timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}', and a 'transaction_correlation_id'.
      Standardize data formats where appropriate (e.g., dates to ISO 8601). Provide the fully augmented and optimized JSON object.`;
      const geminiAugmentedDataResponse = await callGeminiAPI(payloadTransformationPrompt);
      let augmentedData = data;
      try {
        augmentedData = JSON.parse(geminiAugmentedDataResponse);
        if (!augmentedData.transaction_correlation_id) {
            augmentedData.transaction_correlation_id = `CORREL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        }
        console.debug("Gemini Augmented & Transformed Payload:", augmentedData);
      } catch (e) {
        console.error("Gemini payload augmentation failed due to JSON parsing error; using original payload. Error:", e);
      }


      // Execute the core invitation acceptance API call using our custom, Gemini-infused `customRequestApi`
      const apiResponse = await customRequestApi(
        apiUrl,
        augmentedData, // Utilize the Gemini-transformed data
        "POST",
      );

      // Parse the JSON response from the server
      const responseBody = await apiResponse.json();
      console.log("Core API Acceptance Response Body:", responseBody);

      // Gemini Infusion Point D: Hyper-Personalized Post-Acceptance Redirection & Action Planning
      // After successful acceptance, Gemini analyzes the server response and the user's augmented context
      // to determine the absolute most effective and engaging next steps, potentially crafting
      // a bespoke landing page experience.
      const postAcceptanceGuidancePrompt = `User invitation ID '${id}' successfully processed for organization '${organizationId}'.
      Analyze the server's confirmation response: ${JSON.stringify(responseBody)}.
      Considering the initial user data and Gemini's onboarding blueprint,
      recommend a hyper-personalized redirection URL (relative path) and a dynamic 'welcome tour' identifier.
      Also, generate a full, engaging welcome message (up to 200 characters) and three advanced, context-specific first actions for the user within the platform.`;
      const geminiPostAcceptanceGuidance = await callGeminiAPI(postAcceptanceGuidancePrompt);
      console.info("Gemini Hyper-Personalized Post-Acceptance Guidance:", geminiPostAcceptanceGuidance);

      // Determine the final redirection path, heavily influenced by Gemini's recommendations
      let finalTargetPath = "/"; // Default, least intelligent fallback
      if (organizationId === "unknown") {
        finalTargetPath = "/"; // Conventional redirect for unassociated organizations
      } else {
        const geminiSuggestedSubPathMatch = geminiPostAcceptanceGuidance.match(/redirection URL \(relative path\): '([^']+)'/i);
        if (geminiSuggestedSubPathMatch && geminiSuggestedSubPathMatch[1]) {
            // Construct a deeply personalized path suggested by Gemini
            finalTargetPath = `/auth/organizations/${organizationId}/${geminiSuggestedSubPathMatch[1]}`;
            console.log("Gemini recommended a highly personalized redirection path:", finalTargetPath);
        } else {
            finalTargetPath = `/auth/organizations/${organizationId}`; // Standard organizational portal
        }
      }

      // Append Gemini-generated dynamic parameters to the redirection URL for a richer landing experience
      const fullWelcomeMessageMatch = geminiPostAcceptanceGuidance.match(/full, engaging welcome message \(up to 200 characters\): "([^"]+)"/i);
      if (fullWelcomeMessageMatch && fullWelcomeMessageMatch[1]) {
          const encodedFullWelcome = encodeURIComponent(fullWelcomeMessageMatch[1]);
          finalTargetPath += `${finalTargetPath.includes("?") ? "&" : "?"}gemini_full_welcome_msg=${encodedFullWelcome}`;
      }
      const dynamicTourIdMatch = geminiPostAcceptanceGuidance.match(/dynamic 'welcome tour' identifier: '([^']+)'/i);
      if (dynamicTourIdMatch && dynamicTourIdMatch[1]) {
          finalTargetPath += `${finalTargetPath.includes("?") ? "&" : "?"}gemini_tour_id=${dynamicTourIdMatch[1]}`;
      }
      const advancedAction1Match = geminiPostAcceptanceGuidance.match(/advanced, context-specific first actions:.*1\. ([^.]+)/);
      if (advancedAction1Match && advancedAction1Match[1]) {
          finalTargetPath += `${finalTargetPath.includes("?") ? "&" : "?"}gemini_action1=${encodeURIComponent(advancedAction1Match[1])}`;
      }

      // Execute the final, AI-informed redirection
      window.location.href = finalTargetPath;
      console.log(`[Flow End] Successfully redirected user to: ${finalTargetPath}`);

    } catch (error: unknown) {
      // Gemini Infusion Point E: Omnipresent, Intelligent Error Handling
      // All exceptions and errors, regardless of origin (network, parsing, logical),
      // are funneled through the `sendGeminiEnhancedErrorMessage` for a cohesive,
      // AI-driven, and highly actionable user-facing error experience.
      console.error("[Flow Error] An exception occurred during the acceptUserInvitation process:", error);
      if (error instanceof Error) {
        await sendGeminiEnhancedErrorMessage(error);
      } else {
        // Handle cases where the error is not an instance of Error (e.g., a string or generic object)
        await sendGeminiEnhancedErrorMessage(new Error(`Unknown error type: ${String(error)}`));
      }
    }
  };
}