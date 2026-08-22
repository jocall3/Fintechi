
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { simulateMarqetaApiCall } from '../api/mockMarqetaApi';

// ============================ TYPES ============================
interface SwaggerParameter {
  name: string;
  in: 'path' | 'query' | 'body';
  description?: string;
  type?: string;
  required?: boolean;
  schema?: { $ref: string };
}

interface SwaggerEndpoint {
  summary: string;
  parameters?: SwaggerParameter[];
  tags?: string[];
  responses: any;
  description?: string;
}

interface LogEntry {
    timestamp: string;
    message: string;
    level: 'req' | 'res' | 'info' | 'error';
}

// ============================ SWAGGER SPECIFICATION ============================
const swaggerSpec: any = {
  "swagger": "2.0",
  "info": { "description": "High-fidelity simulation of the Marqeta Core API for managing payment programs.", "version": "3.0.0", "title": "Marqeta Core Api" },
  "basePath": "/v3",
  "tags": [ { "name": "users", "description": "Manage cardholder users" }, { "name": "cards", "description": "Create and manage cards" }, { "name": "simulate", "description": "Simulate card authorizations" } ],
  "paths": {
    "/users": {
        "get": { "tags": ["users"], "summary": "Lists all users", "parameters": [{"name":"count","in":"query","type":"integer", "description": "Number of users to return."}, {"name":"start_index","in":"query","type":"integer", "description": "Start index."}], "responses":{"200":{"description":"Success"}}},
        "post": { "tags": ["users"], "summary": "Creates a user", "parameters": [{"in":"body","name":"body", "required": true, "schema":{"$ref":"#/definitions/CardHolderModel"}}], "responses":{"201":{"description":"Created"}}}
    },
    "/users/{token}": {
        "get": { "tags": ["users"], "summary": "Returns a specific user", "parameters": [{"name":"token","in":"path","required":true,"type":"string", "description": "User token."}], "responses":{"200":{"description":"Success"}, "404": {"description": "User not found"}}},
        "put": { "tags": ["users"], "summary": "Updates a specific user", "parameters": [{"name":"token","in":"path","required":true,"type":"string", "description": "User token."}, {"in":"body","name":"body", "required": true, "schema":{"$ref":"#/definitions/UserCardHolderUpdateModel"}}], "responses":{"200":{"description":"Success"}}}
    },
    "/cards": {
        "post": { "tags": ["cards"], "summary": "Creates a card for a user", "parameters": [{"in":"body","name":"body", "required": true, "schema":{"$ref":"#/definitions/CardRequestModel"}}], "responses":{"201":{"description":"Created"}}}
    },
    "/simulate/authorization": {
        "post": { "tags": ["simulate"], "summary": "Simulates an authorization", "description": "This will create a transaction that is immediately cleared.", "parameters": [{"in":"body", "name":"body", "required": true, "schema":{"$ref":"#/definitions/SimulationRequestModel"}}], "responses":{"201": {"description": "Authorization simulation successful"}}}
    }
  },
  "definitions": {
    "CardHolderModel": {
        "type":"object",
        "properties":{
            "token": {"type": "string", "description": "Existing user token. If empty, a new user is created."},
            "first_name":{"type":"string", "description": "User's first name."},
            "last_name":{"type":"string", "description": "User's last name."},
            "email":{"type":"string", "description": "User's email address."}
        },
        "required": ["first_name", "last_name"]
    },
    "UserCardHolderUpdateModel": {
        "type":"object",
        "properties":{
            "first_name":{"type":"string"},
            "last_name":{"type":"string"},
            "email":{"type":"string"}
        }
    },
    "CardRequestModel": {
        "type":"object",
        "properties":{
            "user_token":{"type":"string", "description": "Token of the user who will own the card."},
            "card_product_token":{"type":"string", "description": "Token of the card product to associate with the card."}
        },
        "required": ["user_token", "card_product_token"]
    },
    "SimulationRequestModel": {
        "type": "object",
        "properties": {
            "card_token": {"type": "string", "description": "Token of the card to use for the authorization."},
            "amount": {"type": "number", "description": "Amount of the authorization."},
            "merchant": {"type": "string", "description": "Name of the merchant."}
        },
        "required": ["card_token", "amount"]
    }
  }
};

// ============================ UI COMPONENTS ============================

const EndpointForm: React.FC<{ endpoint: SwaggerEndpoint; method: string; path: string; log: (message: string, level: LogEntry['level']) => void; }> = ({ endpoint, method, path, log }) => {
    const [params, setParams] = useState<{ [key: string]: any }>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const initialParams: { [key: string]: any } = {};
        if (endpoint.parameters) {
            endpoint.parameters.forEach(p => { initialParams[p.name] = ''; });
        }
        setParams(initialParams);
    }, [endpoint]);

    const executeRequest = async () => {
        setIsLoading(true);
        let requestPath = path;
        const queryParams = new URLSearchParams();
        let bodyContent: any = null;
        let jsonError = false;

        endpoint.parameters?.forEach(p => {
            const value = params[p.name];
            if (value) {
                if (p.in === 'path') requestPath = requestPath.replace(`{${p.name}}`, value);
                if (p.in === 'query') queryParams.set(p.name, value);
                if (p.in === 'body') {
                    try {
                        bodyContent = JSON.parse(value);
                    } catch (e) {
                        log(`Invalid JSON in body for ${p.name}`, 'error');
                        setIsLoading(false);
                        jsonError = true;
                    }
                }
            }
        });

        if (jsonError) return;

        const fullPath = queryParams.toString() ? `${requestPath}?${queryParams}` : requestPath;
        log(`Executing: ${method.toUpperCase()} ${fullPath}`, 'req');

        if (bodyContent) {
            log(`BODY: ${JSON.stringify(bodyContent, null, 2)}`, 'req');
        }

        try {
            const response = await simulateMarqetaApiCall(method, requestPath, bodyContent);
            log(`Response [${response.status}]:\n${JSON.stringify(response.data, null, 2)}`, 'res');
        } catch (error: any) {
            log(`Simulation Error: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const renderParam = (param: SwaggerParameter) => {
        const inputClasses = "mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500";
        const textareaClasses = "mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 h-48 font-mono";

        if(param.in === 'body') {
            const schemaRef = param.schema?.$ref;
            let placeholder = '{\n  "key": "value"\n}';
            if (schemaRef) {
                const schemaName = schemaRef.split('/').pop() as keyof typeof swaggerSpec.definitions;
                const definition = swaggerSpec.definitions[schemaName];
                if (definition && definition.properties) {
                    const exampleBody = Object.entries(definition.properties).reduce((acc, [key, prop]) => {
                        acc[key] = (prop as any).description || (prop as any).type || '';
                        return acc;
                    }, {} as {[key: string]: any});
                    placeholder = JSON.stringify(exampleBody, null, 2);
                }
            }
            
            return (
                 <label className="block text-sm font-medium text-gray-300">
                    <span className="capitalize">{param.name} ({param.in})</span>
                    <textarea value={params[param.name] || ''} onChange={(e) => setParams(p => ({ ...p, [param.name]: e.target.value }))} placeholder={placeholder} className={textareaClasses} />
                 </label>
            );
        }
        return (
            <label className="block text-sm font-medium text-gray-300">
                <span className="capitalize">{param.name} ({param.in})</span>
                <input value={params[param.name] || ''} onChange={(e) => setParams(p => ({ ...p, [param.name]: e.target.value }))} placeholder={param.description || param.type} className={inputClasses} type={param.type === 'integer' ? 'number' : 'text'} />
            </label>
        );
    };

    const methodColorClasses: Record<string, string> = {
        get: 'bg-blue-900/50 text-blue-400',
        post: 'bg-green-900/50 text-green-400',
        put: 'bg-yellow-900/50 text-yellow-400',
        delete: 'bg-red-900/50 text-red-400',
    };
    const colorClass = methodColorClasses[method.toLowerCase()] || 'bg-gray-900/50 text-gray-400';

    return (
        <div className="border border-gray-700 rounded-lg overflow-hidden mt-4">
            <div className={`p-4 ${colorClass.split(' ')[0]}`}>
                <h4 className="font-bold text-lg">
                    <span className={`uppercase font-mono text-sm mr-4 px-2 py-1 rounded ${colorClass}`}>{method}</span> 
                    <span className="font-mono text-white">{path}</span>
                </h4>
                <p className="text-sm text-gray-400 mt-1">{endpoint.summary}</p>
            </div>
            {endpoint.parameters && endpoint.parameters.length > 0 &&
                <div className="p-4 space-y-4">
                    {endpoint.parameters.map(p => <div key={p.name}>{renderParam(p)}</div>)}
                </div>
            }
            <div className="p-4 bg-gray-900/50 border-t border-gray-700">
                <button disabled={isLoading} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500" onClick={executeRequest}>
                    {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    {isLoading ? 'Executing...' : 'Execute'}
                </button>
            </div>
        </div>
    );
};

// ============================ MAIN VIEW ============================

const APIConsoleView: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const log = useCallback((message: string, level: LogEntry['level']) => {
        setLogs(prev => [{ timestamp: new Date().toISOString(), message, level }, ...prev].slice(0, 200));
    }, []);

    const tags = useMemo(() => swaggerSpec.tags.map((t: {name: string}) => t.name), []);
    const [activeTag, setActiveTag] = useState(tags[0] || '');

    const groupedPaths = useMemo(() => {
        const groups: { [tagName: string]: { path: string; method: string; endpoint: SwaggerEndpoint }[] } = {};
        Object.entries(swaggerSpec.paths).forEach(([path, methods]) => {
            Object.entries(methods as any).forEach(([method, endpoint]) => {
                const tagName = (endpoint as SwaggerEndpoint).tags?.[0] || 'untagged';
                if (!groups[tagName]) {
                    groups[tagName] = [];
                }
                groups[tagName].push({ path, method, endpoint: endpoint as SwaggerEndpoint });
            });
        });
        return groups;
    }, []);

    return (
         <div className="text-gray-300">
             <header className="p-6 bg-gray-950/80 backdrop-blur-lg z-10 border-b border-gray-700 rounded-lg">
                 <h1 className="text-3xl font-bold text-white">The Monolith - Live API Console</h1>
                 <p className="text-red-500 font-bold mt-2">ARCHITECT'S NOTE: THIS CONSOLE DYNAMICALLY GENERATES ITS UI FROM THE EMBEDDED SWAGGER 2.0 SPECIFICATION.</p>
                 
                 <div className="mt-6">
                     <label htmlFor="tag-selector" className="sr-only">Select API Tag</label>
                     <select 
                        id="tag-selector"
                        onChange={e => setActiveTag(e.target.value)} 
                        value={activeTag} 
                        className="mt-1 block w-full max-w-sm px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                     >
                        {tags.map((tag: string) => <option key={tag} value={tag}>{tag}</option>)}
                     </select>
                 </div>
             </header>
             
             <div className="flex flex-col lg:flex-row mt-6">
                <main className="flex-1 lg:pr-6">
                     <h2 className="text-2xl font-bold text-cyan-400 capitalize">{activeTag}</h2>
                     <div className="mt-4 space-y-8">
                         {(groupedPaths[activeTag] || []).map(({ path, method, endpoint }) => (
                             <EndpointForm key={`${path}-${method}`} {...{path, method, endpoint, log}} />
                         ))}
                         {(!groupedPaths[activeTag] || groupedPaths[activeTag].length === 0) && (
                            <p className="text-gray-500">No endpoints defined for this tag in the provided specification.</p>
                         )}
                     </div>
                 </main>

                 <aside className="w-full lg:w-1/3 lg:pl-6 mt-8 lg:mt-0 border-t lg:border-t-0 lg:border-l border-gray-700">
                    <div className="sticky top-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Log Output</h3>
                            <button onClick={() => setLogs([])} className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 focus:ring-red-500">Clear Log</button>
                        </div>
                        <pre className="h-[70vh] overflow-y-auto log-output p-4 rounded-lg">
                            {logs.length === 0 && <span className="text-gray-500">No requests yet. Execute an endpoint to see logs.</span>}
                            {logs.map((l, i) => (
                                <div key={i} className={`pb-2 mb-2 border-b border-gray-800 log-${l.level}`}>
                                    <span className="text-gray-500 text-xs">[{new Date(l.timestamp).toLocaleTimeString()}]</span>
                                    <p className="ml-2 leading-tight whitespace-pre-wrap">{l.message}</p>
                                </div>
                            ))}
                        </pre>
                    </div>
                 </aside>
             </div>
             <style>{`
                .log-output { background-color: #111827; color: #9ca3af; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; white-space: pre-wrap; font-size: 0.8rem; }
                .log-req { color: #facc15; }
                .log-res { color: #818cf8; }
                .log-info { color: #d1d5db; }
                .log-error { color: #f87171; }
             `}</style>
         </div>
    );
};

export default APIConsoleView;
