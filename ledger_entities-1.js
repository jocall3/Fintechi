// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

async function loadLedgerEntities(query, ledgerId, dispatchError) {
    const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

    const fullQuery = { ...query, ledger_id: ledgerId };

    const prompt = `Generate a JSON object containing an array of accounting ledger entities. The query parameters for this request are: ${JSON.stringify(fullQuery)}. Each ledger entity in the array should have 'id' (a unique number), 'name' (a string describing the transaction), 'type' (a string like 'income', 'expense', 'asset', 'liability'), 'amount' (a number representing the value), and 'date' (a string in 'YYYY-MM-DD' format). Ensure the output is a valid JSON object with a single key 'ledger_entities' containing the array, and nothing else, no conversational text or markdown wrappers.`;

    try {
        const requestBody = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
            },
        };

        const response = await fetch(GEMINI_API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Gemini API request failed: ${response.status} ${response.statusText} - ${errorDetails}`);
        }

        const apiResponse = await response.json();
        
        let jsonData;
        const responseText = apiResponse.candidates[0].content.parts[0].text;
        
        try {
            jsonData = JSON.parse(responseText);
        } catch (parseError) {
            const cleanedText = responseText.replace(/```json\n|\n```/g, '').trim();
            jsonData = JSON.parse(cleanedText);
        }

        dispatch({
            type: "LOAD_LEDGER_ENTITIES",
            data: jsonData.ledger_entities,
        });
    } catch (error) {
        dispatchError(`Failed to generate ledger entities with Gemini: ${error.message}`);
    }
}