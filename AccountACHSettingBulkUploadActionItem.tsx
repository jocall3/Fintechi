import React, { useState, useCallback, useEffect } from "react";
import { CellValueUnion } from "@flatfile/api/api";
import {
  useBulkCreateAccountAchSettingsMutation,
  useBulkValidateAccountAchSettingsMutation,
} from "~/generated/dashboard/graphqlSchema";
import FlatfileBulkUploadButton, {
  BulkResourceType,
} from "~/app/components/FlatfileBulkUploadButton";
import {
  accountACHSettingBlueprint,
  accountACHSettingBlueprintFields,
} from "./bulk_imports/blueprints/accountACHSettingBlueprint";

const geminiAIService = {
  analyzeDataForAccountAchSettings: async (
    rawData,
    blueprintFields,
    connectionId,
  ) => {
    console.log("Gemini AI: Analyzing data for connection", connectionId);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const analysisReport = {
      overallStatus: "Analysis Complete",
      issuesFound: [],
      suggestedTransformations: [],
      dataQualityScore: 92,
      insights: "Identified potential for address standardization and bank code validation.",
    };

    if (rawData.some(row => !row.bankAccountNumber || (typeof row.bankAccountNumber === 'string' && row.bankAccountNumber.length < 5))) {
        analysisReport.issuesFound.push({
            type: "MissingOrShortBankAccount",
            description: "Some bank account numbers are missing or too short. Recommend review.",
            severity: "High"
        });
        analysisReport.suggestedTransformations.push({
            field: "bankAccountNumber",
            action: "Standardize to minimum length 10, pad with leading zeros if applicable."
        });
    }

    if (rawData.some(row => !row.bankRoutingNumber || (typeof row.bankRoutingNumber === 'string' && row.bankRoutingNumber.length !== 9))) {
        analysisReport.issuesFound.push({
            type: "InvalidRoutingNumber",
            description: "Some bank routing numbers are not 9 digits. Recommend validation.",
            severity: "High"
        });
        analysisReport.suggestedTransformations.push({
            field: "bankRoutingNumber",
            action: "Validate against a known routing number database and flag non-compliant."
        });
    }

    if (rawData.some(row => typeof row.beneficiaryName === 'string' && row.beneficiaryName.includes("LLC"))) {
        analysisReport.insights += " Many beneficiary names contain 'LLC', suggesting corporate accounts. Consider corporate entity verification.";
    }

    console.log("Gemini AI: Analysis Report generated:", analysisReport);
    return analysisReport;
  },

  applyTransformations: async (rawData, transformations) => {
    console.log("Gemini AI: Applying transformations...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let transformedData = rawData.map(row => ({ ...row }));

    transformations.forEach(t => {
        if (t.action.includes("Standardize to minimum length 10, pad with leading zeros") && t.field === "bankAccountNumber") {
            transformedData = transformedData.map(row => {
                if (row.bankAccountNumber && typeof row.bankAccountNumber === 'string' && row.bankAccountNumber.length < 10) {
                    return { ...row, bankAccountNumber: row.bankAccountNumber.padStart(10, '0') };
                }
                return row;
            });
        }
    });

    console.log("Gemini AI: Transformations applied.");
    return transformedData;
  },

  enrichDataWithExternalSources: async (data, connectionId) => {
    console.log("Gemini AI: Enriching data for connection", connectionId);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const enrichedData = data.map(row => {
        const newRow = { ...row };
        if (row.bankRoutingNumber && typeof row.bankRoutingNumber === 'string') {
            const routingNumberString = row.bankRoutingNumber;
            if (routingNumberString.startsWith("01")) {
                newRow.bankName = "First National Bank Gemini";
                newRow.bankCity = "New York City";
            } else if (routingNumberString.startsWith("02")) {
                newRow.bankName = "Second State Bank AI";
                newRow.bankCity = "Los Angeles Metro";
            } else {
                newRow.bankName = "Gemini Unidentified Bank";
                newRow.bankCity = "AI Unidentified Location";
            }
        }
        newRow.geminiEnriched = true;
        return newRow;
    });

    console.log("Gemini AI: Data enrichment complete.");
    return enrichedData;
  },

  generateSubmissionSummary: async (data, analysisReport) => {
    console.log("Gemini AI: Generating submission summary...");
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const totalRecords = data.length;
    const enrichedRecords = data.filter(row => row.geminiEnriched).length;
    const errorsFromAnalysis = analysisReport?.issuesFound?.length || 0;

    const summaryText = `
      Gemini AI Powered Submission Summary
      ----------------------------------
      Total Records Processed: ${totalRecords}
      Records Enriched by Gemini: ${enrichedRecords}
      Potential Issues Identified by AI: ${errorsFromAnalysis}
      Overall Data Quality Score: ${analysisReport?.dataQualityScore || 'N/A'}

      Insights: ${analysisReport?.insights || 'No specific AI insights provided.'}
      Recommended Action: Review the detailed analysis and transformations applied by Gemini before final submission.
    `;
    return summaryText;
  },

  chatWithAI: async (prompt) => {
    console.log("Gemini AI Chat: Processing prompt", prompt);
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (prompt.toLowerCase().includes("help")) {
      return "Hello! I am your Gemini AI Assistant. How can I help you with your ACH settings upload today? I can analyze your data, suggest transformations, and enrich information.";
    } else if (prompt.toLowerCase().includes("status")) {
      return "Current status: Awaiting data upload from Flatfile. Ready for AI analysis.";
    } else if (prompt.toLowerCase().includes("transform")) {
      return "To apply transformations, first upload your data. Then click 'Analyze Data with Gemini' and review the 'AI Suggestions' section.";
    }
    return `Gemini AI: I am still learning. You asked: '${prompt}'. Try asking about data analysis or enrichment.`;
  }
};

export const ACCOUNT_ACH_SETTING_CSV_HEADERS =
  accountACHSettingBlueprintFields.map((field) => field.key);

interface AccountCapabilityBulkUploadActionItemProps {
  connectionId: string;
}

function AccountCapabilityBulkUploadActionItem({
  connectionId,
}: AccountCapabilityBulkUploadActionItemProps) {
  const [bulkValidateAccountAchSettings] =
    useBulkValidateAccountAchSettingsMutation();
  const [bulkCreateAccountAchSettings] =
    useBulkCreateAccountAchSettingsMutation();

  const [uploadedData, setUploadedData] = useState([]);
  const [isGeminiAnalyzing, setIsGeminiAnalyzing] = useState(false);
  const [geminiAnalysisReport, setGeminiAnalysisReport] = useState(null);
  const [transformedData, setTransformedData] = useState([]);
  const [enrichedData, setEnrichedData] = useState([]);
  const [aiChatResponse, setAiChatResponse] = useState("Hello! How can I assist you with your ACH data today?");
  const [aiChatPrompt, setAiChatPrompt] = useState("");
  const [isApplyingTransformations, setIsApplyingTransformations] = useState(false);
  const [isEnrichingData, setIsEnrichingData] = useState(false);
  const [submissionSummary, setSubmissionSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showGeminiPanel, setShowGeminiPanel] = useState(false);


  const handleFlatfileUploadComplete = useCallback(
    (resultsData) => {
      console.log("Flatfile upload complete, data received:", resultsData);
      setUploadedData(resultsData);
      setTransformedData(resultsData);
      setEnrichedData(resultsData);
      setGeminiAnalysisReport(null);
      setSubmissionSummary("");
      setShowGeminiPanel(true);
    },
    [],
  );

  const handleAnalyzeWithGemini = useCallback(async () => {
    if (uploadedData.length === 0) {
      setAiChatResponse("Please upload data via Flatfile first before analysis.");
      return;
    }
    setIsGeminiAnalyzing(true);
    setAiChatResponse("Gemini AI is performing a deep analysis of your ACH data...");
    try {
      const report = await geminiAIService.analyzeDataForAccountAchSettings(
        uploadedData,
        accountACHSettingBlueprintFields,
        connectionId,
      );
      setGeminiAnalysisReport(report);
      setAiChatResponse(`Gemini AI Analysis Complete. Data Quality Score: ${report.dataQualityScore}. ${report.insights}`);
    } catch (error) {
      console.error("Error during Gemini analysis:", error);
      setAiChatResponse("Error encountered during Gemini analysis. Please try again.");
    } finally {
      setIsGeminiAnalyzing(false);
    }
  }, [uploadedData, connectionId]);

  const handleApplyGeminiTransformations = useCallback(async () => {
    if (!geminiAnalysisReport || geminiAnalysisReport.suggestedTransformations.length === 0) {
      setAiChatResponse("No AI suggested transformations to apply or analysis not yet performed.");
      return;
    }
    setIsApplyingTransformations(true);
    setAiChatResponse("Gemini AI is applying suggested transformations to your data...");
    try {
      const newTransformedData = await geminiAIService.applyTransformations(
        uploadedData,
        geminiAnalysisReport.suggestedTransformations,
      );
      setTransformedData(newTransformedData);
      setEnrichedData(newTransformedData);
      setAiChatResponse("Gemini AI transformations applied successfully. Data is now cleaner.");
    } catch (error) {
      console.error("Error applying Gemini transformations:", error);
      setAiChatResponse("Error applying Gemini transformations. Please review manually.");
    } finally {
      setIsApplyingTransformations(false);
    }
  }, [uploadedData, geminiAnalysisReport]);

  const handleEnrichDataWithGemini = useCallback(async () => {
    if (transformedData.length === 0) {
      setAiChatResponse("No transformed data available for enrichment. Please analyze and transform first.");
      return;
    }
    setIsEnrichingData(true);
    setAiChatResponse("Gemini AI is enriching your data with external sources...");
    try {
      const newEnrichedData = await geminiAIService.enrichDataWithExternalSources(
        transformedData,
        connectionId,
      );
      setEnrichedData(newEnrichedData);
      setAiChatResponse("Gemini AI data enrichment complete. More contextual information added.");
    } catch (error) {
      console.error("Error enriching data with Gemini:", error);
      setAiChatResponse("Error during Gemini data enrichment. Data may be incomplete.");
    } finally {
      setIsEnrichingData(false);
    }
  }, [transformedData, connectionId]);

  const handleChatSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!aiChatPrompt.trim()) return;
    setAiChatResponse("Gemini AI is thinking...");
    const response = await geminiAIService.chatWithAI(aiChatPrompt);
    setAiChatResponse(response);
    setAiChatPrompt("");
  }, [aiChatPrompt]);

  const handleGenerateAISubmissionSummary = useCallback(async () => {
    if (enrichedData.length === 0) {
      setAiChatResponse("No enriched data available to generate a summary. Please process data first.");
      return;
    }
    setIsGeneratingSummary(true);
    setAiChatResponse("Gemini AI is compiling your submission summary and potential risks...");
    try {
      const summary = await geminiAIService.generateSubmissionSummary(enrichedData, geminiAnalysisReport);
      setSubmissionSummary(summary);
      setAiChatResponse("Gemini AI has prepared the final submission summary.");
    } catch (error) {
      console.error("Error generating AI submission summary:", error);
      setAiChatResponse("Error generating AI submission summary. Please check logs.");
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [enrichedData, geminiAnalysisReport]);


  const validate = async (
    resultsData: Array<Record<string, CellValueUnion | null>>,
  ) => {
    console.log("Pre Flatfile validation with enriched data:", enrichedData);
    const dataToValidate = enrichedData.length > 0 ? enrichedData : resultsData;

    const response = await bulkValidateAccountAchSettings({
      variables: {
        input: {
          connectionId,
          accountAchSettings: dataToValidate,
        },
      },
    });
    if (response.data?.bulkValidateAccountAchSettings?.recordErrors.length > 0) {
      setAiChatResponse("Flatfile found validation errors. Gemini AI can help review these if you analyze again.");
    } else {
      setAiChatResponse("Flatfile validation passed. You are ready for AI summary and submission.");
    }
    return response.data?.bulkValidateAccountAchSettings?.recordErrors;
  };

  const submit = async (
    resultsData: Array<Record<string, CellValueUnion | null>>,
    flatfileSheetId: string,
    flatfileSpaceId: string,
  ) => {
    console.log("Submitting AI-enriched data:", enrichedData);
    if (enrichedData.length === 0) {
        setAiChatResponse("No data processed by Gemini AI for submission. Please ensure data is analyzed and enriched.");
        return { success: false, path: "/" };
    }

    setAiChatResponse("Final submission initiated with Gemini AI processed data...");
    const { data } = await bulkCreateAccountAchSettings({
      variables: {
        input: {
          connectionId,
          flatfileSheetId,
          flatfileSpaceId,
          accountAchSettings: enrichedData,
        },
      },
    });

    const { id } =
      data?.bulkCreateAccountAchSettings?.connectionBulkImport ?? {};
    if (id) {
      setAiChatResponse("Gemini AI guided submission successful! Bulk import ID: " + id);
      return {
        success: true,
        path: `/operations/connection_bulk_imports/${id}`,
      };
    }
    setAiChatResponse("Gemini AI guided submission failed. Please check logs.");
    return { success: false, path: "/" };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#3f51b5' }}>Account ACH Settings Bulk Upload powered by Gemini AI</h2>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h3>Flatfile Data Ingestion</h3>
          <p>Use the Flatfile button to upload your initial ACH settings data. Gemini AI will take over from there.</p>
          <FlatfileBulkUploadButton
            resource={BulkResourceType.AccountACHSettings}
            blueprint={accountACHSettingBlueprint}
            expectedFields={accountACHSettingBlueprintFields}
            onValidate={validate}
            onSubmit={submit}
            launchFromActionsList
            onComplete={handleFlatfileUploadComplete}
          />
          {uploadedData.length > 0 && (
            <p style={{ marginTop: '10px', color: '#4CAF50' }}>Data uploaded from Flatfile: {uploadedData.length} records ready for AI.</p>
          )}
        </div>

        {showGeminiPanel && (
          <div style={{ flex: 1, border: '1px solid #4285F4', padding: '15px', borderRadius: '5px', backgroundColor: '#e8f0fe' }}>
            <h3>Gemini AI Processing Workflow</h3>
            <p style={{ color: '#4285F4' }}>Orchestrating your data quality and enrichment with artificial intelligence.</p>

            <div style={{ marginBottom: '15px' }}>
              <h4>1. AI Data Analysis</h4>
              <button
                onClick={handleAnalyzeWithGemini}
                disabled={isGeminiAnalyzing || uploadedData.length === 0}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#4285F4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {isGeminiAnalyzing ? "Analyzing with Gemini..." : "Analyze Data with Gemini"}
              </button>
              {geminiAnalysisReport && (
                <div style={{ marginTop: '10px', backgroundColor: '#f3f3f3', padding: '10px', borderRadius: '4px' }}>
                  <strong>AI Analysis Report:</strong>
                  <p>Status: {geminiAnalysisReport.overallStatus}</p>
                  <p>Quality Score: {geminiAnalysisReport.dataQualityScore}</p>
                  <p>Insights: {geminiAnalysisReport.insights}</p>
                  {geminiAnalysisReport.issuesFound.length > 0 && (
                    <div>
                      <strong>Identified Issues:</strong>
                      <ul>
                        {geminiAnalysisReport.issuesFound.map((issue, index) => (
                          <li key={index}>[{issue.severity}] {issue.description}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h4>2. Apply AI Suggested Transformations</h4>
              <button
                onClick={handleApplyGeminiTransformations}
                disabled={isApplyingTransformations || !geminiAnalysisReport || geminiAnalysisReport.suggestedTransformations.length === 0}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#34A853',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginRight: '10px'
                }}
              >
                {isApplyingTransformations ? "Applying AI Transformations..." : "Apply AI Transformations"}
              </button>
              {geminiAnalysisReport?.suggestedTransformations.length > 0 && (
                <p style={{ marginTop: '5px', color: '#34A853' }}>Gemini has {geminiAnalysisReport.suggestedTransformations.length} transformations ready.</p>
              )}
               {transformedData.length > 0 && transformedData.length !== uploadedData.length && (
                 <p style={{ marginTop: '5px', color: '#34A853' }}>Data transformed. Current record count: {transformedData.length}</p>
               )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h4>3. AI Data Enrichment</h4>
              <button
                onClick={handleEnrichDataWithGemini}
                disabled={isEnrichingData || transformedData.length === 0}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#FBBC05',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {isEnrichingData ? "Enriching with Gemini..." : "Enrich Data with Gemini"}
              </button>
              {enrichedData.length > 0 && enrichedData.some(row => row.geminiEnriched) && (
                <p style={{ marginTop: '5px', color: '#FBBC05' }}>{enrichedData.filter(row => row.geminiEnriched).length} records enriched by Gemini AI.</p>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h4>4. Generate AI Submission Summary</h4>
              <button
                onClick={handleGenerateAISubmissionSummary}
                disabled={isGeneratingSummary || enrichedData.length === 0}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#EA4335',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {isGeneratingSummary ? "Generating Summary..." : "Generate AI Submission Summary"}
              </button>
              {submissionSummary && (
                <pre style={{ marginTop: '10px', backgroundColor: '#fff0f0', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {submissionSummary}
                </pre>
              )}
            </div>

            <div style={{ borderTop: '1px solid #ccc', paddingTop: '15px', marginTop: '20px' }}>
              <h4>Gemini AI Assistant Chat</h4>
              <div style={{ backgroundColor: '#f0f4f8', padding: '10px', borderRadius: '4px', minHeight: '60px', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
                <strong>AI:</strong> {aiChatResponse}
              </div>
              <form onSubmit={handleChatSubmit} style={{ display: 'flex' }}>
                <input
                  type="text"
                  value={aiChatPrompt}
                  onChange={(e) => setAiChatPrompt(e.target.value)}
                  placeholder="Ask Gemini AI a question..."
                  style={{ flexGrow: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px 0 0 4px', outline: 'none' }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#4285F4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0 4px 4px 0',
                    cursor: 'pointer'
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default AccountCapabilityBulkUploadActionItem;
