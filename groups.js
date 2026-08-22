// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

export function updateGroup(id, data, dispatchSuccess, dispatchError) {
    return async () => {
        const method = id ? "PATCH" : "POST";
        const actionDescription = id ? `update a role with ID ${id}` : "create a new role";
        const roleEndpoint = id ? `/settings/roles/${id}` : "/settings/roles";

        const prompt = `You are a backend API for role management.
        Perform the following operation: ${actionDescription}.
        Method: ${method}
        Target Endpoint: ${roleEndpoint}
        Payload: ${JSON.stringify(data)}

        Respond with a JSON object.
        If successful, the JSON must contain "status": "success" and "id": "The ID of the updated or newly created role (as a string)".
        If there is an error, the JSON must contain "status": "error" and "message": "A descriptive error message".
        Do not include any other text or formatting outside the JSON.`;

        try {
            const model = window.gemini.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const responseText = await result.response.text();

            const parsedResponse = JSON.parse(responseText);

            if (parsedResponse.status === "success") {
                window.location.href = `/settings/roles/${parsedResponse.id}`;
                dispatchSuccess("Success!");
            } else if (parsedResponse.status === "error") {
                dispatchError(parsedResponse.message);
            } else {
                dispatchError("An unexpected response format was received from the Gemini model.");
            }
        } catch (error) {
            let errorMessage = "An unknown error occurred.";
            if (error && typeof error.message === 'string') {
                errorMessage = error.message;
            }
            dispatchError(errorMessage);
        }
    };
}
