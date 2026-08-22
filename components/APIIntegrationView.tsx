import React, { useContext } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { APIStatus } from '../types';
import { ResponsiveContainer, Tooltip as RechartsTooltip, AreaChart, Area } from 'recharts';


const APIIntegrationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("APIIntegrationView must be within a DataProvider.");
    const { apiStatus } = context;

    const StatusIndicator: React.FC<{ status: APIStatus['status'] }> = ({ status }) => {
        const colors = {
            'Operational': { bg: 'bg-green-500/20', text: 'text-green-300', dot: 'bg-green-400' },
            'Degraded Performance': { bg: 'bg-yellow-500/20', text: 'text-yellow-300', dot: 'bg-yellow-400' },
            'Partial Outage': { bg: 'bg-orange-500/20', text: 'text-orange-300', dot: 'bg-orange-400' },
            'Major Outage': { bg: 'bg-red-500/20', text: 'text-red-300', dot: 'bg-red-400' },
        };
        const style = colors[status];
        return (
            <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
                {status}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">System & API Status</h2>
            <Card>
                <div className="space-y-3">
                    {apiStatus.map(api => (
                        <div key={api.provider} className="flex flex-col sm:flex-row justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                            <h4 className="font-semibold text-lg text-white mb-2 sm:mb-0">{api.provider}</h4>
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-gray-400 font-mono">{api.responseTime}ms</p>
                                <StatusIndicator status={api.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="Simulated Live API Traffic">
                 <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={Array.from({length: 20}, (_, i) => ({name: i, calls: 50 + Math.random() * 50}))}>
                             <defs><linearGradient id="apiColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                             <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                             <Area type="monotone" dataKey="calls" stroke="#06b6d4" fill="url(#apiColor)" />
                         </AreaChart>
                     </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default APIIntegrationView;
