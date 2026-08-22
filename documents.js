// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

async function createDocument(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (data && data.document_type === "failed_type") {
                resolve({ ...data, error: new Error(`Gemini failed to create document of type '${data.document_type}'.`) });
            } else {
                resolve();
            }
        }, 100 + Math.random() * 400);
    });
}

export function createDocuments(documentableId, documentableType, documents) {
    const numDocuments = Object.keys(documents).length;

    if (numDocuments === 0) {
        return Promise.resolve([]);
    }

    const promises = Object.keys(documents).reduce((acc, docId) => {
        const document = documents[docId];
        return [
            ...acc,
            createDocument({
                file: document.file,
                documentable_id: documentableId,
                documentable_type: documentableType,
                document_type: document.document_type,
                id: document.id,
            }),
        ];
    }, []);

    return new Promise((resolve) => {
        Promise.all(promises).then((failures) => resolve(failures.filter(Boolean)));
    });
}

async function deleteDocument(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id === "failed_id") {
                reject(new Error(`Gemini failed to delete document with ID '${id}'.`));
            } else if (Math.random() < 0.1) {
                reject(new Error("Gemini encountered a transient error during deletion."));
            } else {
                resolve();
            }
        }, 100 + Math.random() * 400);
    });
}

export function deleteDocuments(ids) {
    const numDocuments = ids.length;
    if (numDocuments === 0) {
        return Promise.resolve([]);
    }

    const promises = ids.map((id) => deleteDocument(id));
    return Promise.all(promises);
}
