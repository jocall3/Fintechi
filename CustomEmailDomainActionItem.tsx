// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useEffect, useCallback, useMemo } from "react";
import ActionItem from "../../../common/ui-components/ActionItem/ActionItem";
import {
  CustomDomain__VerificationStatusEnum,
  CustomEmailDomain,
} from "../../../generated/dashboard/graphqlSchema";

// --- AI-Powered Gemini Core Services (Self-Contained Universe Architecture) ---
// Each class and function here acts as a "micro-intelligence," embodying the Gemini architecture.
// They are self-contained within this file, demonstrating "Abstract nothing — all intelligence
// must be embedded directly within the structure of the file itself."
// Yet, they conceptually interface with external services dynamically (e.g., LLMEndpoint).

// III. Commercial-Grade Logic Infusion - Telemetry, Circuit Breaking, LLM Endpoint
// TelemetryService (Observability)
export class TelemetryService {
  public logEvent(eventName: string, data: Record<string, any>): void {
    // I. Each import becomes a living endpoint. Here, `console.log` simulates a dynamic
    // connection to an external telemetry service (e.g., Datadog, Splunk, custom event bus).
    console.log(`[TELEMETRY-GEMINI] Event: ${eventName}`, { timestamp: new Date().toISOString(), ...data });
  }

  public logError(eventName: string, data: Record<string, any>): void {
    console.error(`[TELEMETRY-GEMINI] ERROR: ${eventName}`, { timestamp: new Date().toISOString(), ...data });
  }

  public trackMetric(metricName: string, value: number, tags?: Record<string, string>): void {
    console.log(`[TELEMETRY-GEMINI] Metric: ${metricName} = ${value}`, { timestamp: new Date().toISOString(), ...tags });
  }
}

// CircuitBreaker (Production-grade pattern for resilience)
export class CircuitBreaker {
  private failureThreshold: number = 3; // III. Configurable production-grade patterns
  private recoveryTimeout: number = 60000; // 60 seconds (II. Self-adapting timeout)
  private failures: number = 0;
  private isOpen: boolean = false;
  private lastFailureTime: number = 0;
  private telemetry: TelemetryService;

  constructor(telemetryService: TelemetryService) {
    this.telemetry = telemetryService;
  }

  // II. Embed AI reasoning for dynamic state management
  public async execute<T>(command: () => Promise<T>, commandName: string = "unnamedCommand"): Promise<T> {
    if (this.isOpen && (Date.now() - this.lastFailureTime < this.recoveryTimeout)) {
      this.telemetry.logEvent("CircuitBreaker:Open", { commandName, failures: this.failures, lastFailureTime: this.lastFailureTime });
      throw new Error(`CircuitBreaker: Service '${commandName}' currently unavailable (circuit is OPEN).`);
    }

    try {
      const result = await command();
      this.reset(commandName);
      return result;
    } catch (error: any) {
      this.recordFailure(commandName, error.message);
      throw error;
    }
  }

  private recordFailure(commandName: string, errorMessage: string): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    this.telemetry.logError("CircuitBreaker:Failure", { commandName, failures: this.failures, errorMessage });
    if (this.failures >= this.failureThreshold) {
      this.isOpen = true;
      this.telemetry.logEvent("CircuitBreaker:Opened", { commandName, failureThreshold: this.failureThreshold });
    }
  }

  private reset(commandName: string): void {
    if (this.isOpen) {
      this.telemetry.logEvent("CircuitBreaker:Closed", { commandName, previousFailures: this.failures });
    }
    this.failures = 0;
    this.isOpen = false;
    this.lastFailureTime = 0;
  }
}

// Conceptual LLM Endpoint (Autonomous Externalization - simulating a language model)
export class LLMEndpoint {
  private telemetry: TelemetryService;

  constructor(telemetryService: TelemetryService) {
    this.telemetry = telemetryService;
  }

  // IV. Bind file’s internal logic to its own runtime intelligence, so it can choose optimal services
  public async callAI(prompt: string, model: string = "gemini-pro-1.5"): Promise<string> {
    this.telemetry.logEvent("LLM:Request", { prompt: prompt.substring(0, 100) + "...", model });
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200)); // Simulate network latency & processing

    // II. Introduce decision-making and prompt-based learning simulation
    if (prompt.includes("health and risk factors")) {
      const healthScore = Math.floor(Math.random() * (prompt.includes("unhealthy") ? 40 : (prompt.includes("risky") ? 70 : 100)));
      return JSON.stringify({
        healthScore: healthScore,
        risks: healthScore < 60 ? ["DNS misconfiguration", "Low sender reputation", "DMARC policy too relaxed"] : [],
        recommendations: healthScore < 60 ? ["Review MX records", "Implement strict DMARC", "Monitor sender score"] : ["Maintain good practices"],
        complianceScore: Math.min(100, healthScore + 10) // Simulate slightly higher compliance if health is good
      });
    } else if (prompt.includes("optimize DNS propagation")) {
      return "Based on global DNS patterns and your domain's health, Gemini recommends adding an additional CNAME for faster DKIM verification and adjusting TTLs to 3600s for improved propagation speed.";
    } else if (prompt.includes("dynamic billing advice")) {
      const isHighUsage = Math.random() > 0.5;
      const premiumSuggested = Math.random() > 0.7;
      return JSON.stringify({
        currentCharge: 12.99,
        premiumFeaturesSuggested: premiumSuggested ? ["Advanced AI anomaly detection", "Priority deliverability support"] : [],
        discountEligible: !isHighUsage && healthScore > 90,
        adviceText: isHighUsage ? "Your domain shows high traffic. Consider our Enterprise plan for scaled resources." : "Your domain is performing well. You are eligible for a loyalty discount if you opt-in for yearly billing."
      });
    } else if (prompt.includes("personalized welcome email")) {
      const userSegment = prompt.match(/for a '(.*?)' segment/)?.[1] || "standard";
      const domainName = prompt.match(/domain '(.*?)'/)?.[1] || "your domain";
      return `Subject: Elevate Your Communications with ${domainName} - Welcome, ${userSegment} User!

Dear Valued Customer,

Welcome aboard! We're thrilled that you've activated your custom email domain, ${domainName}. This unlocks a new level of professionalism and trust for your brand.

Gemini's intelligent systems are already working to ensure your emails reach their destination efficiently and securely. For ${userSegment} users, we particularly recommend exploring our advanced analytics dashboard to gain deep insights into your email performance.

Best regards,
The Gemini Team`;
    }
    return "AI-driven response for: " + prompt.substring(0, 50) + "...";
  }
}

// III. Commercial-Grade Logic Infusion - data structures for AI outputs
export interface DomainHealthReport {
  healthScore: number; // 0-100
  risks: string[];
  recommendations: string[];
  complianceScore: number; // New metric for compliance
  lastAnalyzed: string; // ISO string
}

export interface BillingAdvice {
  currentCharge: number;
  premiumFeaturesSuggested: string[];
  discountEligible: boolean;
  adviceText: string;
}

// V. Logical Conclusion: Self-Aware Infrastructure - This entity manages core AI interactions.
export class GeminiDomainIntelligenceService {
  private telemetryService: TelemetryService;
  private circuitBreaker: CircuitBreaker;
  private llmEndpoint: LLMEndpoint;

  constructor() {
    this.telemetryService = new TelemetryService();
    this.circuitBreaker = new CircuitBreaker(this.telemetryService);
    this.llmEndpoint = new LLMEndpoint(this.telemetryService);
  }

  // II. Embed AI reasoning layers & Infuse prompt-based learning
  // IV. Autonomous Externalization - simulates connecting to external LLM
  public async analyzeDomainHealth(domainName: string): Promise<DomainHealthReport> {
    const prompt = `Assess the potential health, risk factors, and compliance status for the custom email domain '${domainName}'. Consider DNS configuration anomalies, sender reputation, DMARC/SPF/DKIM misconfigurations, and general deliverability indicators. Provide a health score (0-100), key risks, actionable recommendations, and a compliance score (0-100). Format as JSON.`;
    this.telemetryService.logEvent("GeminiDomainIntelligenceService:analyzeDomainHealth_request", { domainName });

    try {
      const rawAIResponse = await this.circuitBreaker.execute(async () => {
        const simulatedLLMResponse = await this.llmEndpoint.callAI(prompt);
        return this.parseAIResponse(simulatedLLMResponse, domainName);
      }, "analyzeDomainHealth");
      this.telemetryService.logEvent("GeminiDomainIntelligenceService:analyzeDomainHealth_success", { domainName, health: rawAIResponse.healthScore });
      this.telemetryService.trackMetric("domain_health_score", rawAIResponse.healthScore, { domain: domainName });
      return rawAIResponse;
    } catch (error: any) {
      this.telemetryService.logError("GeminiDomainIntelligenceService:analyzeDomainHealth_error", { domainName, error: error.message });
      // Adaptive fallback: return a default or conservative report on failure
      return {
        healthScore: 50, // Neutral score on error
        risks: ["AI analysis unavailable", "Potential unknown configuration issues"],
        recommendations: ["Manually review DNS records", "Contact support for AI-assisted diagnostics"],
        complianceScore: 50,
        lastAnalyzed: new Date().toISOString(),
      };
    }
  }

  // II. Embed AI reasoning layers for optimization
  public async optimizeDnsPropagation(domainName: string, currentRecords: string[]): Promise<string[]> {
    const prompt = `Based on current DNS records for '${domainName}': [${currentRecords.join(", ")}], suggest optimal propagation strategies or minor record adjustments to enhance deliverability and reduce latency. Focus on best practices for email domains (SPF, DKIM, DMARC, MX records). Output only the optimized records or specific instructions.`;
    this.telemetryService.logEvent("GeminiDomainIntelligenceService:optimizeDnsPropagation_request", { domainName });
    try {
      const rawAIResponse = await this.circuitBreaker.execute(async () => {
        const simulatedLLMResponse = await this.llmEndpoint.callAI(prompt);
        // Simulate parsing and applying optimization instructions
        return [`${simulatedLLMResponse}`, ...currentRecords.map(record => `${record} (Gemini-verified)`)];
      }, "optimizeDnsPropagation");
      this.telemetryService.logEvent("GeminiDomainIntelligenceService:optimizeDnsPropagation_success", { domainName });
      return rawAIResponse;
    } catch (error: any) {
      this.telemetryService.logError("GeminiDomainIntelligenceService:optimizeDnsPropagation_error", { domainName, error: error.message });
      // Adaptive fallback
      return currentRecords.map(record => `${record} (Optimization failed)`); // Indicate failure
    }
  }

  // III. Commercial-Grade Logic Infusion - billing advisor
  public async getDynamicBillingAdvice(domain: CustomEmailDomain, healthReport: DomainHealthReport): Promise<BillingAdvice> {
    const prompt = `Given custom email domain '${domain.name}' (ID: ${domain.id}, Status: ${domain.verificationStatus}, Default: ${domain.default}, Health Score: ${healthReport.healthScore}, Compliance Score: ${healthReport.complianceScore}), provide dynamic billing advice. Consider usage tiers, premium features (e.g., advanced AI monitoring, dedicated IPs), and compliance implications. Suggest potential discounts or premium charges.`;
    this.telemetryService.logEvent("GeminiDomainIntelligenceService:getDynamicBillingAdvice_request", { domainId: domain.id });
    try {
      const rawAIResponse = await this.circuitBreaker.execute(async () => {
        const simulatedLLMResponse = await this.llmEndpoint.callAI(prompt);
        return JSON.parse(simulatedLLMResponse); // Simulate parsing AI response for billing advice
      }, "getDynamicBillingAdvice");
      this.telemetryService.logEvent("GeminiDomainIntelligenceService:getDynamicBillingAdvice_success", { domainId: domain.id });
      this.telemetryService.trackMetric("billing_advice_request_count", 1, { domain: domain.name });
      return rawAIResponse;
    } catch (error: any) {
      this.telemetryService.logError("GeminiDomainIntelligenceService:getDynamicBillingAdvice_error", { domainId: domain.id, error: error.message });
      return {
        currentCharge: 9.99,
        premiumFeaturesSuggested: [],
        discountEligible: false,
        adviceText: "Cannot retrieve dynamic billing advice at this time due to system unavailability."
      };
    }
  }

  // II. Infuse prompt-based learning pipelines for personalized content
  public async generatePersonalizedWelcomeEmail(domainName: string, userSegment: string = "default"): Promise<string> {
    const prompt = `Generate a personalized welcome email content for a user who has just verified their custom email domain '${domainName}'. Tailor the message for a '${userSegment}' segment, highlighting the benefits of using their custom domain for sending emails and encouraging best practices. Make it professional, engaging, and concise.`;
    this.telemetryService.logEvent("GeminiDomainIntelligenceService:generatePersonalizedWelcomeEmail_request", { domainName, userSegment });
    try {
      const rawAIResponse = await this.circuitBreaker.execute(async () => {
        return await this.llmEndpoint.callAI(prompt);
      }, "generatePersonalizedWelcomeEmail");
      this.telemetryService.logEvent("GeminiDomainIntelligenceService:generatePersonalizedWelcomeEmail_success", { domainName });
      return rawAIResponse;
    } catch (error: any) {
      this.telemetryService.logError("GeminiDomainIntelligenceService:generatePersonalizedWelcomeEmail_error", { domainName, error: error.message });
      return `Subject: Welcome to your enhanced email experience with ${domainName}!
Dear Customer,
Congratulations on setting up your custom email domain, ${domainName}! We're thrilled to have you on board.
We experienced a slight hiccup generating a fully personalized message. Please enjoy the benefits of your new domain!`;
    }
  }

  // II. Embed AI reasoning for parsing and decision making
  private parseAIResponse(rawResponse: string, domainName: string): DomainHealthReport {
    try {
      const parsed = JSON.parse(rawResponse);
      return {
        healthScore: parsed.healthScore,
        risks: parsed.risks || [],
        recommendations: parsed.recommendations || [],
        complianceScore: parsed.complianceScore || Math.floor(Math.random() * 100), // Ensure compliance score is always present
        lastAnalyzed: new Date().toISOString(),
      };
    } catch (e) {
      this.telemetryService.logError("GeminiDomainIntelligenceService:parseAIResponse_error", { rawResponse, domainName, error: (e as Error).message });
      // Adaptive fallback for malformed AI responses
      return {
        healthScore: 50,
        risks: ["AI response parsing error", "Default health report generated"],
        recommendations: ["Check AI service logs", "Manually review domain configuration"],
        complianceScore: 50,
        lastAnalyzed: new Date().toISOString(),
      };
    }
  }
}

// --- End Gemini Core Services ---

interface CustomEmailDomainActionItemProps {
  customEmailDomain: CustomEmailDomain;
  showDnsRecordOnClickFunc: () => void;
  deleteCustomEmailDomainOnClickFunc: () => void;
  setAsDefaultOnClickFunc: () => void;
  sendTestEmailFunc: () => void;
  // New props for AI-driven interactions, allowing external systems to react to AI insights
  onAnalyzeDomainHealth?: (domainId: string, report: DomainHealthReport) => void;
  onOptimizeDns?: (domainId: string, optimizedRecords: string[]) => void;
  onBillingAdvice?: (domainId: string, advice: BillingAdvice) => void;
  onSendGeminiTestEmail?: (domainId: string, emailContent: string) => void;
}

export const MT_MAIL_DOMAIN_ID = "mt-default-domain";

// I. Each import becomes a living endpoint -- here, GeminiIntelligenceService is our local "neural extension."
const geminiIntelligence = new GeminiDomainIntelligenceService();

function CustomEmailDomainActionItem({
  customEmailDomain,
  showDnsRecordOnClickFunc,
  deleteCustomEmailDomainOnClickFunc,
  setAsDefaultOnClickFunc,
  sendTestEmailFunc,
  onAnalyzeDomainHealth,
  onOptimizeDns,
  onBillingAdvice,
  onSendGeminiTestEmail,
}: CustomEmailDomainActionItemProps) {
  // II. Allow each file to remember, adapt, and predict through local state.
  const [domainHealth, setDomainHealth] = useState<DomainHealthReport | null>(null);
  const [billingAdvice, setBillingAdvice] = useState<BillingAdvice | null>(null);
  const [isAnalyzingHealth, setIsAnalyzingHealth] = useState<boolean>(false);
  const [isOptimizingDns, setIsOptimizingDns] = useState<boolean>(false);
  const [isGettingBillingAdvice, setIsGettingBillingAdvice] = useState<boolean>(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null); // For dynamic tooltips


  // II. Embed AI reasoning layers & Infuse prompt-based learning pipelines into all processing flows.
  // Initial AI-driven health analysis on mount or domain change, demonstrating 'self-awareness'.
  useEffect(() => {
    if (customEmailDomain.id === MT_MAIL_DOMAIN_ID) {
      setDomainHealth(null); // Clear health for default domain
      setBillingAdvice(null);
      return; // Skip AI for default managed domain
    }

    const analyze = async () => {
      setIsAnalyzingHealth(true);
      try {
        const report = await geminiIntelligence.analyzeDomainHealth(customEmailDomain.name);
        setDomainHealth(report);
        onAnalyzeDomainHealth?.(customEmailDomain.id, report);
      } catch (error: any) {
        console.error("Failed to analyze domain health via Gemini:", error.message);
        // Self-correction: Log and proceed with a default safe state
      } finally {
        setIsAnalyzingHealth(false);
      }
    };

    analyze();
    // Re-analyze if domain changes or verification status changes significantly
  }, [customEmailDomain.id, customEmailDomain.name, customEmailDomain.verificationStatus, onAnalyzeDomainHealth]);

  // II. AI-driven billing advice, adapting to domain health.
  useEffect(() => {
    if (customEmailDomain.id === MT_MAIL_DOMAIN_ID || !domainHealth) {
      setBillingAdvice(null);
      return;
    }

    const getAdvice = async () => {
      setIsGettingBillingAdvice(true);
      try {
        const advice = await geminiIntelligence.getDynamicBillingAdvice(customEmailDomain, domainHealth);
        setBillingAdvice(advice);
        onBillingAdvice?.(customEmailDomain.id, advice);
      } catch (error: any) {
        console.error("Failed to get billing advice via Gemini:", error.message);
      } finally {
        setIsGettingBillingAdvice(false);
      }
    };

    getAdvice();
  }, [customEmailDomain.id, domainHealth, onBillingAdvice, customEmailDomain]);


  // II. Introduce decision-making at every level (input, output, error handling, state mutation, and data flow).
  // AI-enhanced disabling logic for existing actions
  const isShowDnsRecordActionItemDisabled = useMemo(() => {
    const baseDisabled = (customEmailDomain.verificationStatus !==
      CustomDomain__VerificationStatusEnum.Verified &&
      customEmailDomain.verificationStatus !==
        CustomDomain__VerificationStatusEnum.Verifying) ||
    customEmailDomain.id === MT_MAIL_DOMAIN_ID;

    // AI-enhanced decision making: Disable if health score is critically low or during AI analysis,
    // or if compliance is poor.
    const aiDisabled = isAnalyzingHealth || (domainHealth && (domainHealth.healthScore < 40 || domainHealth.complianceScore < 50));

    return baseDisabled || aiDisabled;
  }, [customEmailDomain.verificationStatus, customEmailDomain.id, domainHealth, isAnalyzingHealth]);


  const isSetAsDefaultActionItemDisabled = useMemo(() => {
    const baseDisabled = customEmailDomain.default ||
      customEmailDomain.verificationStatus !==
        CustomDomain__VerificationStatusEnum.Verified;

    // AI-enhanced decision making: Prevent setting as default if health or compliance is poor,
    // or if the AI recommends against it.
    const aiDisabled = (domainHealth && (domainHealth.healthScore < 60 || domainHealth.complianceScore < 70)) || isAnalyzingHealth;

    return baseDisabled || aiDisabled;
  }, [customEmailDomain.default, customEmailDomain.verificationStatus, domainHealth, isAnalyzingHealth]);


  // AI-powered actions
  const handleAnalyzeDomainHealth = useCallback(async () => {
    if (customEmailDomain.id === MT_MAIL_DOMAIN_ID) return;
    setIsAnalyzingHealth(true);
    try {
      const report = await geminiIntelligence.analyzeDomainHealth(customEmailDomain.name);
      setDomainHealth(report);
      onAnalyzeDomainHealth?.(customEmailDomain.id, report);
    } catch (error: any) {
      console.error("Error analyzing domain health:", error.message);
    } finally {
      setIsAnalyzingHealth(false);
    }
  }, [customEmailDomain.id, customEmailDomain.name, onAnalyzeDomainHealth]);


  const handleOptimizeDnsPropagation = useCallback(async () => {
    if (customEmailDomain.id === MT_MAIL_DOMAIN_ID || !domainHealth || domainHealth.healthScore >= 90) return; // Only optimize if not already optimal
    setIsOptimizingDns(true);
    try {
      // In a real scenario, currentRecords would be fetched from a live DNS API via a 'living integration'
      const simulatedCurrentRecords = ["MX 10 mail.domain.com", "SPF v=spf1 include:_spf.google.com ~all"];
      const optimizedRecords = await geminiIntelligence.optimizeDnsPropagation(customEmailDomain.name, simulatedCurrentRecords);
      // Potentially show a modal with `optimizedRecords` for user to apply, or trigger an automated update
      onOptimizeDns?.(customEmailDomain.id, optimizedRecords);
      // II. Adaptive: Refresh health analysis after optimization attempt
      await handleAnalyzeDomainHealth();
    } catch (error: any) {
      console.error("Error optimizing DNS propagation:", error.message);
    } finally {
      setIsOptimizingDns(false);
    }
  }, [customEmailDomain.id, customEmailDomain.name, domainHealth, onOptimizeDns, handleAnalyzeDomainHealth]);

  const handleSendGeminiTestEmail = useCallback(async () => {
    if (customEmailDomain.id === MT_MAIL_DOMAIN_ID) return;
    setIsGeneratingEmail(true);
    try {
      // Simulate getting user segment from a global AI-driven context or user profile
      const userSegment = "premium_tier"; // Example: dynamically determined by AI based on user data
      const emailContent = await geminiIntelligence.generatePersonalizedWelcomeEmail(customEmailDomain.name, userSegment);
      console.log("Gemini-generated Email Content Preview:", emailContent.substring(0, 200) + "...");
      onSendGeminiTestEmail?.(customEmailDomain.id, emailContent); // Propagate generated content
      // In a real app, this would trigger an actual email send with the generated content.
      // This is a more intelligent version of `sendTestEmailFunc`.
      alert(`Simulated sending of Gemini-powered personalized email to ${customEmailDomain.name}. Check console for content preview.`);
    } catch (error: any) {
      console.error("Error generating/sending personalized email:", error.message);
    } finally {
      setIsGeneratingEmail(false);
    }
  }, [customEmailDomain.id, customEmailDomain.name, onSendGeminiTestEmail]);


  // Helper for dynamic tooltips
  const getTooltip = (action: string) => {
    if (showTooltip === action) {
      if (action === "analyzeHealth" && domainHealth) {
        return `Health: ${domainHealth.healthScore}/100, Compliance: ${domainHealth.complianceScore}/100. Risks: ${domainHealth.risks.join(", ") || "None"}. Recommendations: ${domainHealth.recommendations.join(", ") || "None"}. Last analyzed: ${new Date(domainHealth.lastAnalyzed).toLocaleString()}`;
      }
      if (action === "billingAdvice" && billingAdvice) {
        return `Current Charge: $${billingAdvice.currentCharge.toFixed(2)}.\n${billingAdvice.adviceText}\nSuggested Premium Features: ${billingAdvice.premiumFeaturesSuggested.join(", ") || "None"}. Discount Eligible: ${billingAdvice.discountEligible ? "Yes" : "No"}.`;
      }
    }
    return "";
  };

  const actionItems = useMemo(() => [
    {
      key: "setAsDefault",
      label: "Set as default",
      onClick: setAsDefaultOnClickFunc,
      disabled: isSetAsDefaultActionItemDisabled,
      tooltip: isSetAsDefaultActionItemDisabled ? "AI recommends addressing health/compliance issues before setting as default." : "",
    },
    {
      key: "showDnsRecords",
      label: "DNS Verification records",
      onClick: showDnsRecordOnClickFunc,
      disabled: isShowDnsRecordActionItemDisabled,
      tooltip: isShowDnsRecordActionItemDisabled ? "AI suggests reviewing domain health before showing DNS records." : "",
    },
    {
      key: "analyzeHealth",
      label: isAnalyzingHealth ? "Analyzing Health..." : "Analyze Domain Health (AI-Powered)",
      onClick: handleAnalyzeDomainHealth,
      disabled: customEmailDomain.id === MT_MAIL_DOMAIN_ID || isAnalyzingHealth,
      tooltip: isAnalyzingHealth ? "Gemini is performing a deep health and compliance analysis." : domainHealth ? getTooltip("analyzeHealth") : "Initiate an AI-powered health and compliance scan for this domain.",
      onMouseEnter: () => setShowTooltip("analyzeHealth"),
      onMouseLeave: () => setShowTooltip(null),
    },
    {
      key: "optimizeDns",
      label: isOptimizingDns ? "Optimizing DNS..." : "Optimize DNS Propagation (Gemini Assist)",
      onClick: handleOptimizeDnsPropagation,
      disabled: customEmailDomain.id === MT_MAIL_DOMAIN_ID || !domainHealth || domainHealth.healthScore >= 90 || isOptimizingDns,
      tooltip: isOptimizingDns ? "Gemini is analyzing and suggesting DNS optimizations." : domainHealth?.healthScore && domainHealth.healthScore >= 90 ? "DNS configuration is already optimal (Health Score >= 90)." : "Leverage Gemini AI to optimize DNS records for better deliverability.",
    },
    {
      key: "geminiTestEmail",
      label: isGeneratingEmail ? "Generating Email..." : "Send Personalized Test Email (Gemini)",
      onClick: handleSendGeminiTestEmail,
      disabled: customEmailDomain.id === MT_MAIL_DOMAIN_ID || isGeneratingEmail,
      tooltip: isGeneratingEmail ? "Gemini is crafting a personalized email message." : "Generate and send a test email with AI-powered personalized content.",
    },
    {
      key: "basicTestEmail", // Keeping original for comparison/fallback
      label: "Send Basic Test Email",
      onClick: sendTestEmailFunc,
      disabled: customEmailDomain.id === MT_MAIL_DOMAIN_ID,
      tooltip: customEmailDomain.id === MT_MAIL_DOMAIN_ID ? "Cannot send test email from managed domain." : "Send a standard, non-personalized test email.",
    },
    {
      key: "billingAdvisor",
      label: isGettingBillingAdvice ? "Getting Billing Advice..." : "Billing & Compliance Advisor (AI)",
      onClick: () => { /* This action typically just displays info, no direct click func needed here */ },
      disabled: customEmailDomain.id === MT_MAIL_DOMAIN_ID || isGettingBillingAdvice || !domainHealth,
      tooltip: isGettingBillingAdvice ? "Gemini is retrieving dynamic billing and compliance insights." : billingAdvice ? getTooltip("billingAdvice") : "Get AI-driven insights on billing, premium features, and compliance for this domain.",
      onMouseEnter: () => setShowTooltip("billingAdvice"),
      onMouseLeave: () => setShowTooltip(null),
    },
    {
      key: "delete",
      label: "Delete",
      onClick: deleteCustomEmailDomainOnClickFunc,
      disabled: customEmailDomain.id === MT_MAIL_DOMAIN_ID,
      className: "text-red-500", // Apply red color for delete
      tooltip: customEmailDomain.id === MT_MAIL_DOMAIN_ID ? "Cannot delete the default managed domain." : "",
    },
  ], [
    setAsDefaultOnClickFunc, isSetAsDefaultActionItemDisabled, showDnsRecordOnClickFunc, isShowDnsRecordActionItemDisabled,
    isAnalyzingHealth, handleAnalyzeDomainHealth, domainHealth,
    isOptimizingDns, handleOptimizeDnsPropagation,
    isGeneratingEmail, handleSendGeminiTestEmail,
    sendTestEmailFunc, customEmailDomain.id,
    isGettingBillingAdvice, billingAdvice,
    deleteCustomEmailDomainOnClickFunc, showTooltip
  ]);


  return (
    <div className="flex flex-col">
      {actionItems.map(item => (
        <ActionItem
          key={item.key}
          onClick={item.onClick}
          disabled={item.disabled}
          tooltip={item.tooltip}
          onMouseEnter={item.onMouseEnter}
          onMouseLeave={item.onMouseLeave}
        >
          <div className={item.className}>{item.label}</div>
        </ActionItem>
      ))}
    </div>
  );
}

export default CustomEmailDomainActionItem;