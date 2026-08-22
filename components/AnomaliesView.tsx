import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { FinancialAnomaly, AnomalySeverity, AnomalyStatus } from '../types';

const AnomaliesView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("AnomaliesView must be within a DataProvider.");

    const { financialAnomalies, updateAnomalyStatus } = context;

    const SeverityBadge: React.FC<{ severity: AnomalySeverity }> = ({ severity }) => {
        const styles = {
            'Low': 'bg-blue-500/30 text-blue-300',
            'Medium': 'bg-yellow-500/30 text-yellow-300',
            'High': 'bg-orange-500/30 text-orange-300',
            'Critical': 'bg-red-500/30 text-red-300',
        };
        return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[severity]}`}>{severity}</span>;
    };

    const StatusSelect: React.FC<{ anomaly: FinancialAnomaly }> = ({ anomaly }) => (
        <select
            value={anomaly.status}
            onChange={(e) => updateAnomalyStatus(anomaly.id, e.target.value as AnomalyStatus)}
            className="bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            onClick={(e) => e.stopPropagation()} // Prevent card click-through
        >
            <option>New</option>
            <option>Under Review</option>
            <option>Dismissed</option>
            <option>Resolved</option>
        </select>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Anomaly Detection Center</h2>
            <div className="grid grid-cols-1 gap-6">
                {financialAnomalies.map(anomaly => (
                    <Card key={anomaly.id} padding="none">
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{anomaly.description}</h3>
                                    <p className="text-sm text-gray-400">{anomaly.entityDescription}</p>
                                </div>
                                <SeverityBadge severity={anomaly.severity} />
                            </div>
                            <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                                <p className="text-xs font-semibold text-cyan-300 uppercase">AI Analysis</p>
                                <p className="text-sm text-gray-300 italic mt-1">"{anomaly.details}"</p>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 p-3 flex justify-between items-center text-sm">
                            <div className="flex items-center gap-4">
                                <span>Status:</span>
                                <StatusSelect anomaly={anomaly} />
                            </div>
                            <div className="text-gray-400">
                                <span>Risk Score: </span>
                                <span className="font-mono text-white">{anomaly.riskScore}/100</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AnomaliesView;
