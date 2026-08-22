// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

/**
 * Custom isEmpty implementation to replace lodash/isEmpty.
 * Checks for null, undefined, empty array, or empty object.
 */
const isEmpty = (value) =>
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0);

/**
 * Placeholder for Gemini-infused core functionalities.
 * In a real application, these would be provided by a Gemini SDK or framework.
 */
const gemini = {
    /**
     * Form management utilities.
     * Mimics Redux-form dispatch actions for starting and stopping form submissions.
     */
    form: {
        /**
         * Simulates the start of a form submission.
         * @param {string} formName The name of the form.
         */
        startSubmit: (formName) => {
            // In a real Gemini system, this would update internal form state (e.g., set `submitting: true`).
            // console.log(`Gemini Form: '${formName}' submission started.`);
        },
        /**
         * Simulates the stop of a form submission.
         * @param {string} formName The name of the form.
         */
        stopSubmit: (formName) => {
            // In a real Gemini system, this would update internal form state (e.g., set `submitting: false`).
            // console.log(`Gemini Form: '${formName}' submission stopped.`);
        },
    },
    /**
     * State management for counterparties.
     * Mimics Redux Toolkit slice actions for updating counterparty data.
     */
    state: {
        counterparties: {
            /**
             * Simulates setting a single counterparty in global state.
             * @param {object} counterparty The counterparty object to set.
             */
            setOne: (counterparty) => {
                // In a real Gemini system, this would update the global state or data store with the counterparty.
                // console.log("Gemini State: Counterparty updated (setOne) for ID:", counterparty.id);
            },
            /**
             * Simulates updating specific fields of a counterparty in global state.
             * @param {object} payload Contains `id` and `changes` to apply.
             */
            updateOne: ({ id, changes }) => {
                // In a real Gemini system, this would apply partial updates to the counterparty in global state.
                // console.log("Gemini State: Counterparty updated (updateOne) for ID:", id, "changes:", changes);
            },
        },
    },
    /**
     * API request utilities using native `fetch`.
     * Replaces external API request libraries.
     */
    api: {
        /**
         * Generic API request handler.
         * @param {string} url The endpoint URL.
         * @param {string} method The HTTP method (e.g., "GET", "POST", "DELETE").
         * @param {*} [data=null] The request body data.
         * @param {string} [contentType="application/json"] The Content-Type header.
         * @returns {Promise<Response>} The raw `fetch` response object.
         * @throws {Error} If the network request fails or the response is not `ok`.
         */
        request: async (url, method, data = null, contentType = "application/json") => {
            const options = {
                method: method,
            };

            if (contentType === "application/json" && data !== null) {
                options.headers = {
                    "Content-Type": "application/json",
                    // Add any other necessary headers for Gemini API, e.g., Authorization
                };
                options.body = JSON.stringify(data);
            } else if (contentType === "multipart/form-data" && data instanceof FormData) {
                // For FormData, the browser automatically sets the Content-Type header with the boundary.
                // Do NOT manually set Content-Type header for FormData as it can break the request.
                options.body = data;
            } else if (data !== null) {
                // For other content types or raw data
                options.body = data;
            }

            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    let errorBody = {};
                    const responseText = await response.text();
                    try {
                        errorBody = JSON.parse(responseText);
                    } catch (e) {
                        errorBody = { message: responseText || 'Unknown API error', rawResponse: responseText };
                    }
                    const error = new Error(errorBody.message || 'API request failed');
                    error.response = response; // Attach original response for specific error handling (e.g., headers)
                    error.data = errorBody; // Attach parsed error data
                    throw error;
                }
                return response; // Return the full response for flexible handling (e.g., .json() or .text())
            } catch (error) {
                throw error;
            }
        },
    },
    /**
     * GraphQL utilities.
     * Replaces Apollo Client or similar GraphQL libraries for mutations.
     */
    graphql: {
        /**
         * Performs a GraphQL mutation.
         * @param {string} query The GraphQL mutation string.
         * @param {object} variables The variables for the mutation.
         * @returns {Promise<object>} The `data` field from the GraphQL response, or an error structure if GraphQL errors are present.
         * @throws {Error} For network errors or parsing errors.
         */
        mutate: async (query, variables) => {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Add any specific GraphQL authorization headers here
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables,
                }),
            };

            try {
                const response = await fetch("/graphql", options); // Assuming standard /graphql endpoint
                if (!response.ok) {
                    const errorBody = await response.json().catch(() => ({ message: 'GraphQL network error' }));
                    const error = new Error(errorBody.message || 'GraphQL request failed');
                    error.response = response;
                    error.data = errorBody;
                    throw error;
                }
                const result = await response.json();

                // Handle GraphQL errors returned in the response body.
                // The original code expects errors to be destructured from `upsertCounterparty`.
                if (result.errors) {
                    return {
                        upsertCounterparty: {
                            counterparty: null, // No counterparty on error
                            errors: result.errors.map(err => ({ message: err.message || "GraphQL Error" })),
                        }
                    };
                }
                return result.data; // This `data` object should contain the `upsertCounterparty` field.
            } catch (error) {
                throw error;
            }
        }
    }
};

/**
 * Full implementation of `createDocuments`, replacing the imported version.
 * This function handles uploading multiple documents associated with an entity.
 * @param {string} entityId The ID of the entity (e.g., Counterparty ID).
 * @param {string} entityType The type of the entity (e.g., "Counterparty").
 * @param {Array<object>} pendingDocuments An array of document objects to upload.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of failed document uploads.
 */
const createDocuments = async (entityId, entityType, pendingDocuments) => {
    if (!pendingDocuments || pendingDocuments.length === 0) {
        return []; // No documents to process, no failures.
    }

    const failures = [];
    for (const doc of pendingDocuments) {
        // Assuming 'doc' has at least a 'file' property (a File object) and 'name'
        const formData = new FormData();
        formData.append("file", doc.file);
        formData.append("entity_id", entityId);
        formData.append("entity_type", entityType);
        // Add any other relevant document metadata from `doc` to formData as needed
        if (doc.metadata) {
            formData.append("metadata", JSON.stringify(doc.metadata));
        }
        if (doc.type) {
            formData.append("type", doc.type);
        }

        try {
            // Use Gemini's API utility for file uploads (multipart/form-data)
            await gemini.api.request("/documents/upload", "POST", formData, "multipart/form-data");
        } catch (error) {
            // If the upload fails, record it as a failure
            let errorMessage = "Unknown upload error";
            if (error.data && error.data.message) {
                errorMessage = error.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            failures.push({ document: doc.name || "unknown", error: errorMessage });
        }
    }
    return failures;
};

/**
 * Placeholder GraphQL mutation string for upserting a counterparty.
 * In a real Gemini system, this might be dynamically generated or provided by an SDK.
 */
const UPSERT_COUNTERPARTY_MUTATION = `
    mutation UpsertCounterparty($input: UpsertCounterpartyInput!) {
        upsertCounterparty(input: $input) {
            counterparty {
                id
                name
                email
                taxpayerIdentifier
                ledgerType
                metadata
                sendRemittanceAdvice
                accountingCategory
                accountingLedgerClass
                accounts {
                    id
                    partyAddress {
                        id
                        line1
                        line2
                        line3
                        locality
                        region
                        country
                        postalCode
                    }
                    name
                    partyName
                    accountType
                    partyType
                    partyIdentifier
                    accountNumber
                    accountNumberTouched
                    abaRoutingNumber
                    abaRoutingNumberTouched
                    caCpaRoutingNumber
                    caCpaRoutingNumberTouched
                    dkInterbankClearingCodeRoutingNumber
                    dkInterbankClearingCodeRoutingNumberTouched
                    auBsbRoutingNumber
                    auBsbRoutingNumberTouched
                    gbSortCodeRoutingNumber
                    gbSortCodeRoutingNumberTouched
                    ibanAccountNumber
                    ibanAccountNumberTouched
                    hkInterbankClearingCodeRoutingNumber
                    hkInterbankClearingCodeRoutingNumberTouched
                    huInterbankClearingCodeRoutingNumber
                    huInterbankClearingCodeRoutingNumberTouched
                    idSknbiCodeRoutingNumber
                    idSknbiCodeRoutingNumberTouched
                    nzNationalClearingCodeRoutingNumber
                    nzNationalClearingCodeRoutingNumberTouched
                    seBankgiroClearingCodeRoutingNumber
                    seBankgiroClearingCodeRoutingNumberTouched
                    swiftCode
                    swiftCodeTouched
                    inIfscRoutingNumber
                    inIfscRoutingNumberTouched
                    jpZenginCodeRoutingNumber
                    jpZenginCodeRoutingNumberTouched
                }
            }
            errors {
                message
                // Add other error fields if they exist in your GraphQL schema and are needed by the client.
            }
        }
    }
`;

const transformAddress = (data) =>
    data && {
        id: data.id,
        line1: data.line1,
        line2: data.line2,
        line3: data.line3,
        locality: data.locality,
        region: data.region,
        country: data.country,
        postalCode: data.postal_code,
    };

export const transformExternalAccount = (data) =>
    data && {
        id: data.id,
        partyAddress: transformAddress(data.party_address),
        name: data.name,
        partyName: data.party_name,
        accountType: data.account_type,
        partyType: data.party_type,
        partyIdentifier: data.party_identifier,
        accountNumber: data.account_number,
        accountNumberTouched: data.account_number_touched,
        abaRoutingNumber: data.aba_routing_number,
        abaRoutingNumberTouched: data.aba_routing_number_touched,
        caCpaRoutingNumber: data.ca_cpa_routing_number,
        caCpaRoutingNumberTouched: data.ca_cpa_routing_number_touched,
        dkInterbankClearingCodeRoutingNumber: data.dk_interbank_clearing_code_routing_number,
        dkInterbankClearingCodeRoutingNumberTouched: data.dk_interbank_clearing_code_routing_number_touched,
        auBsbRoutingNumber: data.au_bsb_routing_number,
        auBsbRoutingNumberTouched: data.au_bsb_routing_number_touched,
        gbSortCodeRoutingNumber: data.gb_sort_code_routing_number,
        gbSortCodeRoutingNumberTouched: data.gb_sort_code_routing_number_touched,
        ibanAccountNumber: data.iban_account_number,
        ibanAccountNumberTouched: data.iban_account_number_touched,
        hkInterbankClearingCodeRoutingNumber: data.hk_interbank_clearing_code_routing_number,
        hkInterbankClearingCodeRoutingNumberTouched: data.hk_interbank_clearing_code_routing_number_touched,
        huInterbankClearingCodeRoutingNumber: data.hu_interbank_clearing_code_routing_number,
        huInterbankClearingCodeRoutingNumberTouched: data.hu_interbank_clearing_code_routing_number_touched,
        idSknbiCodeRoutingNumber: data.id_sknbi_code_routing_number,
        idSknbiCodeRoutingNumberTouched: data.id_sknbi_code_routing_number_touched,
        nzNationalClearingCodeRoutingNumber: data.nz_national_clearing_code_routing_number,
        nzNationalClearingCodeRoutingNumberTouched: data.nz_national_clearing_code_routing_number_touched,
        seBankgiroClearingCodeRoutingNumber: data.se_bankgiro_clearing_code_routing_number,
        seBankgiroClearingCodeRoutingNumberTouched: data.se_bankgiro_clearing_code_routing_number_touched,
        swiftCode: data.swift_code,
        swiftCodeTouched: data.swift_code_touched,
        inIfscRoutingNumber: data.in_ifsc_routing_number,
        inIfscRoutingNumberTouched: data.in_ifsc_routing_number_touched,
        jpZenginCodeRoutingNumber: data.jp_zengin_code_routing_number,
        jpZenginCodeRoutingNumberTouched: data.jp_zengin_code_routing_number_touched,
    };

export const transformCounterparty = (data) => ({
    id: data.id,
    name: data.name,
    email: data.email,
    taxpayerIdentifier: data.taxpayer_identifier,
    ledgerType: data.ledger_type,
    // Assuming metadata from data is an object that needs to be stringified for the API.
    // If it's already a string, this will stringify it again. Adjust as per actual data source.
    metadata: JSON.stringify(data.metadata),
    sendRemittanceAdvice: data.send_remittance_advice,
    accountingCategory: data.accounting_category,
    accountingLedgerClass: data.accounting_ledger_class,
    accounts: data.accounts ? data.accounts.map(transformExternalAccount) : null,
});

export function submitCounterparty(
    values,
    // The `upsertCounterpartyMutation` parameter is removed as Gemini's GraphQL utility is used directly.
    successCallback,
    pendingDocuments,
    dispatchError,
) {
    return async (dispatch) => { // Made the inner function async to use await
        const accounts = values.accounts || null;

        const metadata = values.receiving_entity_metadata ?
            values.receiving_entity_metadata :
            null;

        const data = {
            ...values,
            accounts,
            ...(metadata && {
                metadata
            }),
        };

        gemini.form.startSubmit("counterparty"); // Replaced Redux-form startSubmit

        try {
            // Use Gemini's GraphQL mutation utility
            const resultData = await gemini.graphql.mutate(UPSERT_COUNTERPARTY_MUTATION, {
                input: {
                    input: transformCounterparty(data)
                }
            });

            // Destructure the result as expected by the original code's .then block
            const {
                upsertCounterparty: {
                    counterparty: returnedCounterparty,
                    errors
                },
            } = resultData;

            if (errors && errors.length) {
                dispatchError(errors);
                gemini.form.stopSubmit("counterparty"); // Replaced Redux-form stopSubmit
            } else if (!values.id) { // This condition implies a new counterparty creation
                const failures = await createDocuments(
                    returnedCounterparty.id,
                    "Counterparty",
                    pendingDocuments,
                );
                if (!isEmpty(failures)) { // Used the custom isEmpty implementation
                    window.location.href = `/counterparties/${returnedCounterparty.id}?hadDocumentFailures=true`;
                } else {
                    window.location.href = `/counterparties/${returnedCounterparty.id}`;
                }
                gemini.form.stopSubmit("counterparty"); // Ensure form submit stops after document creation
            } else if (successCallback) {
                gemini.state.counterparties.setOne(returnedCounterparty); // Replaced Redux slice action `actions.setOne`
                successCallback();
                gemini.form.stopSubmit("counterparty"); // Ensure form submit stops on success
            }
        } catch (error) {
            // Handle network errors or GraphQL errors thrown by gemini.graphql.mutate
            try {
                // Attempt to get a user-friendly message from the error object
                const message = error.data && error.data.errors && error.data.errors.message ?
                    error.data.errors.message :
                    (error.message || "An error occurred");
                dispatchError(message);
            } catch (e) {
                dispatchError("An error occurred"); // Fallback for unexpected error structures
            }

            gemini.form.stopSubmit("counterparty"); // Replaced Redux-form stopSubmit
        }
    };
}

export function collectCounterpartyAccount(
    counterpartyId,
    invitationData,
    dispatchSuccess,
    dispatchError,
) {
    return async (dispatch) => { // Made the inner function async
        const data = {
            invitationData: {
                ...invitationData,
                custom_redirect: invitationData.customRedirect,
                fields: Object.keys(invitationData.fields).filter(
                    (f) => invitationData.fields[f],
                ),
            },
        };

        try {
            // Replaced `requestApi` with `gemini.api.request`
            await gemini.api.request(
                `/counterparties/${counterpartyId}/collect_account`,
                "POST",
                data,
            );
            dispatchSuccess("Invite Successfully Sent");
        } catch (error) {
            // Re-implementing original error handling for specific cases (like rate limits)
            if (error.response && error.response.headers) {
                const limitResetHeader = error.response.headers.get("X-Notification-Limit-Reset");
                if (limitResetHeader) {
                    const minutesRemaining = parseInt(parseInt(limitResetHeader, 10) / 60, 10);
                    dispatchError(`Too many email invites sent, try again in ${minutesRemaining} minutes.`);
                } else {
                    // Fallback if specific header not found, but a response error occurred
                    dispatchError(error.data?.message || error.message || "An error occurred");
                }
            } else if (error.data && error.data.errors && error.data.errors.message) {
                // If the error body contains structured errors
                dispatchError(error.data.errors.message);
            } else {
                // General error message
                dispatchError(error.message || "An error occurred");
            }

            gemini.form.stopSubmit("counterparty"); // Replaced Redux-form stopSubmit
        }
    };
}

export function archiveCounterparty(id, dispatchSuccess, dispatchError) {
    return async (dispatch) => { // Made the inner function async
        try {
            // Replaced `requestApi` with `gemini.api.request`
            const response = await gemini.api.request(`/counterparties/${id}`, "DELETE");
            const jsonData = await response.json(); // Explicitly parse JSON from the fetch response

            dispatchSuccess("Counterparty successfully deleted");
            gemini.state.counterparties.updateOne({ // Replaced Redux slice action `actions.updateOne`
                id,
                changes: {
                    discarded_at: jsonData.discarded_at
                },
            });
        } catch (error) {
            // Re-implementing original error handling
            if (error.data && error.data.errors && error.data.errors.message) {
                dispatchError(error.data.errors.message);
            } else {
                dispatchError(error.message || "An error occurred");
            }
        }
    };
}
