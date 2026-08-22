import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { AIAgent } from '../types';

const AIAgentNetworkView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("AIAgentNetworkView must be within a DataProvider.");
    }

    const { aiAgents } = context;

    const StatusIndicator: React.FC<{ status: AIAgent['status'] }> = ({ status }) => {
        const colors = {
            'online': 'bg-green-400',
            'offline': 'bg-gray-500',
            'error': 'bg-red-500',
        };
        const animationClass = status === 'online' ? 'animate-pulse' : '';
        return (
            <div className={`w-3 h-3 rounded-full ${colors[status]} ${animationClass}`}></div>
        );
    };

    const SpecializationIcon: React.FC<{ spec: AIAgent['specialization'] }> = ({ spec }) => {
        let iconPath;
        switch(spec) {
            case 'Risk': iconPath = "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606m0-15.394v15.394"; break;
            case 'Compliance': iconPath = "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606m0-15.394v15.394"; break;
            case 'FX': iconPath = "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"; break;
            case 'Ledgering': iconPath = "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"; break;
            case 'Liquidity': iconPath = "M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 10a1 1 0 11-2 0 1 1 0 012 0zm5 0a1 1 0 11-2 0 1 1 0 012 0zm5 0a1 1 0 11-2 0 1 1 0 012 0z"; break;
            default: iconPath = "";
        }
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} /></svg>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">AI Agent Network</h2>
            <div className="relative">
                <div className="absolute inset-0 z-0 opacity-20">
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(55, 65, 81, 0.8)" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative z-10">
                    {aiAgents.map((agent) => (
                        <Card key={agent.id} variant="default" className="transition-all duration-300 hover:border-cyan-500/80 hover:shadow-cyan-500/10">
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start">
                                    <SpecializationIcon spec={agent.specialization} />
                                    <div className="flex items-center gap-2">
                                        <StatusIndicator status={agent.status} />
                                        <span className="text-xs font-medium text-gray-300 capitalize">{agent.status}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex-grow">
                                    <h4 className="font-bold text-white">{agent.name}</h4>
                                    <p className="text-sm text-gray-400">{agent.specialization}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-700/50">
                                    <p className="text-xs text-gray-500">Simulated Traffic</p>
                                    <p className="font-mono text-cyan-300">{agent.traffic.toLocaleString()} req/s</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIAgentNetworkView;
