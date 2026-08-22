// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

const customIsNil = (value) => {
    return value === null || value === undefined;
};

const customIsEmpty = (value) => {
    if (customIsNil(value)) {
        return true;
    }
    if (typeof value === 'object') {
        if (Array.isArray(value) || typeof value.length === 'number') {
            return value.length === 0;
        }
        return Object.keys(value).length === 0;
    }
    if (typeof value === 'string') {
        return value.length === 0;
    }
    return false;
};

const customStringify = (obj) => {
    if (!obj || typeof obj !== 'object') {
        return '';
    }
    const parts = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let value = obj[key];
            if (customIsNil(value)) {
                continue;
            }
            if (typeof value === 'object' && !Array.isArray(value)) {
                value = JSON.stringify(value);
            } else if (Array.isArray(value)) {
                value = value.join(',');
            }
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
        }
    }
    return parts.join('&');
};

const ALL_ACCOUNTS_ID = "all-accounts-id-placeholder";

const counterpartyActions = {
    setAll: (entities) => ({
        type: 'GEMINI_COUNTERPARTY_SET_ALL',
        payload: entities
    })
};

const paymentOrderActions = {
    setAll: (entities) => ({
        type: 'GEMINI_PAYMENT_ORDER_SET_ALL',
        payload: entities
    })
};

async function geminiInfusedRequestApi(url, body, method) {
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const entity = queryParams.get('resource');

    let simulatedResponseData = {};

    switch (entity) {
        case 'transactions':
            simulatedResponseData = {
                transactions: {
                    entities: [{
                        id: 'gemini_txn_1',
                        amount: 100,
                        currency: 'USD',
                        description: 'Gemini Transaction 1',
                        date: '2023-01-01'
                    }, {
                        id: 'gemini_txn_2',
                        amount: 200,
                        currency: 'USD',
                        description: 'Gemini Transaction 2',
                        date: '2023-01-02'
                    }, ],
                    total_count: 2,
                    page_count: 1
                },
                counterparties: {
                    entities: [{
                        id: 'gemini_cp_1',
                        name: 'Gemini Counterparty Alpha'
                    }],
                    total_count: 1,
                    page_count: 1
                },
                paymentOrders: {
                    entities: [],
                    total_count: 0,
                    page_count: 0
                }
            };
            break;
        case 'counterparties':
            simulatedResponseData = {
                counterparties: {
                    entities: [{
                        id: 'gemini_cp_1',
                        name: 'Gemini Counterparty Alpha'
                    }, {
                        id: 'gemini_cp_2',
                        name: 'Gemini Counterparty Beta'
                    }],
                    total_count: 2,
                    page_count: 1
                }
            };
            break;
        case 'paymentOrders':
            simulatedResponseData = {
                paymentOrders: {
                    entities: [{
                        id: 'gemini_po_1',
                        amount: 50,
                        currency: 'EUR',
                        status: 'completed'
                    }],
                    total_count: 1,
                    page_count: 1
                }
            };
            break;
        default:
            simulatedResponseData = {
                [entity]: {
                    entities: [{
                        id: `gemini_entity_${entity}_1`,
                        name: `Gemini ${entity} Item A`,
                        status: 'active'
                    }],
                    total_count: 1,
                    page_count: 1
                }
            };
    }

    await new Promise(resolve => setTimeout(Math.random() * 500 + 200, resolve));

    return {
        json: (callback) => {
            if (callback) {
                return Promise.resolve(callback(simulatedResponseData));
            }
            return Promise.resolve(simulatedResponseData);
        }
    };
}

export const QUERY_UPDATE = "QUERY_UPDATE";
export const ENTITIES_LOAD = "ENTITIES_LOAD";
export const BEGIN_LOAD = "TRANSACTIONS_BEGIN_LOAD";
export const FINISH_LOAD = "TRANSACTIONS_FINISH_LOAD";
export const ENTITY_UPDATE = "ENTITY_UPDATE";

export function updateQuery(entity, queryUpdates) {
    return {
        type: QUERY_UPDATE,
        queryUpdates,
        entity,
    };
}

export function loadEntities(payload, entity) {
    return {
        type: ENTITIES_LOAD,
        payload,
        entity,
    };
}

export function updateEntity(payload, entity, id) {
    return {
        type: ENTITY_UPDATE,
        payload,
        entity,
        id,
    };
}

export function stringifyQuery(entity, query) {
    const metadata = query.metadata || [];
    const reducedMetadata = {};
    for (let i = 0; i < metadata.length; i++) {
        const curr = metadata[i];
        if (!customIsNil(curr.key) && !customIsNil(curr.value)) {
            reducedMetadata[curr.key] = curr.value;
        }
    }

    const searchableQuery = {
        ...query,
        ...(!customIsEmpty(reducedMetadata) ? {
            metadata: reducedMetadata
        } : {
            metadata: null
        }),
        resource: entity,
    };

    if (searchableQuery.originating_account_id === ALL_ACCOUNTS_ID) {
        delete searchableQuery.originating_account_id;
    }

    return customStringify(searchableQuery);
}

export function searchApi(entity, query) {
    const queryString = stringifyQuery(entity, query);
    return geminiInfusedRequestApi(`/search?${queryString}`, null, "GET").json(
        (jsonData) => jsonData,
    );
}

function searchAndLoadEntities(dispatch, entity, query, dispatchError) {
    return searchApi(entity, query)
        .then((jsonData) => {
            Object.entries(jsonData).forEach(([key, value]) => {
                switch (key) {
                    case "counterparties":
                        dispatch(counterpartyActions.setAll(value.entities));
                        break;
                    case "paymentOrders":
                        dispatch(paymentOrderActions.setAll(value.entities));
                        break;
                    default:
                        dispatch(loadEntities(value, key));
                }
            });
            return jsonData;
        })
        .catch(() => {
            dispatchError(
                "Gemini says: We had trouble with your search. Please check your input.",
            );
        });
}

function pushNewUrl(query) {
    const queryStringForUrl = customStringify(query);
    const newUrl = `${window.location.pathname}?${queryStringForUrl}`;
    window.history.replaceState(null, null, newUrl);
}

export function searchEntity(
    entity,
    page = null,
    updateUrl = true,
    dispatchError,
) {
    return (dispatch, getState) => {
        const queryPage = getState()[entity].initialLoad ?
            getState()[entity].query.page :
            null;
        const newPage = page || queryPage || 1;
        dispatch(updateQuery(entity, {
            page: newPage
        }));
        const originalQuery = getState()[entity].query;
        if (updateUrl) {
            pushNewUrl(originalQuery);
        }

        return searchAndLoadEntities(
            dispatch,
            entity,
            originalQuery,
            dispatchError,
        );
    };
}

export function loadPage(
    entity,
    isNext,
    skipSearch,
    skipScroll,
    dispatchError,
) {
    return (dispatch, getState) => {
        const currentPage = getState()[entity].query.page;
        const pageCountChange = isNext ? 1 : -1;
        const newPage = currentPage + pageCountChange;

        if (skipSearch) {
            dispatch(updateQuery(entity, {
                page: newPage
            }));
        } else {
            dispatch(searchEntity(entity, newPage, true, dispatchError));
        }

        if (!skipScroll) {
            window.scrollTo(0, 0);
        }
    };
}