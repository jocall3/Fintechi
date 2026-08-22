import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { EcosystemKPIs, SimulationEvent } from '../types';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const SimulationEngineView: React.FC = () => {
    const context = useContext(DataContext);
    const [isSimulating, setIsSimulating] = useState(false);
    const [history, setHistory] = useState<{ date: string, value: number }[]>([]);

    if (!context) throw new Error("SimulationEngineView must be within a DataProvider.");
    const { ecosystemKPIs, simulationEvents, advanceTime } = context;

    const handleAdvanceTime = (days: number) => {
        setIsSimulating(true);
        // Add current state to history before advancing
        setHistory(prev => [...prev, { date: ecosystemKPIs.currentDate, value: ecosystemKPIs.totalEcosystemValue }]);
        
        setTimeout(() => {
            advanceTime(days);
            setIsSimulating(false);
        }, 1500); // Simulate processing time
    };
    
    const chartData = [...history, { date: ecosystemKPIs.currentDate, value: ecosystemKPIs.totalEcosystemValue }];

    const KPICard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
        <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white tracking-wider">{value}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">The Orrery: Simulation Engine</h2>
            
            <Card>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <KPICard title="Current Sim Date" value={ecosystemKPIs.currentDate} />
                    <KPICard title="Ecosystem Value" value={`$${(ecosystemKPIs.totalEcosystemValue / 1_000_000).toFixed(2)}M`} />
                    <KPICard title="Total Transactions" value={ecosystemKPIs.totalTransactions.toLocaleString()} />
                    <KPICard title="Community Capital" value={`$${(ecosystemKPIs.communityPoolCapital / 1000).toFixed(1)}k`} />
                    <KPICard title="Active Users" value={ecosystemKPIs.activeUsers.toString()} />
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Controls">
                        <div className="space-y-3">
                            <p className="text-sm text-gray-400">Advance the simulation to observe the ecosystem's evolution.</p>
                            <button onClick={() => handleAdvanceTime(1)} disabled={isSimulating} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50">
                                {isSimulating ? 'Simulating...' : 'Advance 1 Day'}
                            </button>
                            <button onClick={() => handleAdvanceTime(7)} disabled={isSimulating} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:opacity-50">
                                {isSimulating ? 'Simulating...' : 'Advance 1 Week'}
                            </button>
                            <button onClick={() => handleAdvanceTime(30)} disabled={isSimulating} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg disabled:opacity-50">
                                {isSimulating ? 'Simulating...' : 'Advance 1 Month'}
                            </button>
                        </div>
                    </Card>
                     <Card title="Event Log">
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                            {simulationEvents.length === 0 && <p className="text-sm text-gray-500">No events yet. Advance time to begin.</p>}
                            {simulationEvents.map(event => (
                                <div key={event.id} className="text-xs p-2 bg-gray-800/50 rounded-md">
                                    <p className="text-gray-300">{event.description}</p>
                                    <p className="text-gray-500">{new Date(event.timestamp).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card title="Ecosystem Value Over Time">
                        <div className="h-96">
                             <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={chartData}>
                                     <defs><linearGradient id="simColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient></defs>
                                     <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                                     <YAxis stroke="#9ca3af" fontSize={12} domain={['dataMin - 100000', 'dataMax + 100000']} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
                                     <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                                     <Area type="monotone" dataKey="value" stroke="#8884d8" fill="url(#simColor)" />
                                 </AreaChart>
                             </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SimulationEngineView;
