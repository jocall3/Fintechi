import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';


interface CorporateDashboardProps {
    setActiveView: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    const [aiInsight, setAiInsight] = useState('');
    const [isInsightLoading, setIsInsightLoading] = useState(false);

    if (!context) throw new Error("CorporateCommandView must be within a DataProvider.");
    
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    const summaryStats = {
        pendingApprovals: paymentOrders.filter(p => p.status === 'needs_approval').length,
        overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
        openCases: complianceCases.filter(c => c.status === 'open').length,
        totalOutflow: corporateTransactions.reduce((acc, tx) => acc + tx.amount, 0)
    };
    
    const spendingByCategory = corporateTransactions.reduce((acc, tx) => {
        const category = tx.merchant.includes('Steakhouse') || tx.merchant.includes('Lunch') ? 'T&E' :
                         tx.merchant.includes('Cloud') || tx.merchant.includes('Software') ? 'Software' :
                         'Other';
        if (!acc[category]) acc[category] = 0;
        acc[category] += tx.amount;
        return acc;
    }, {} as { [key: string]: number });
    
    const chartData = Object.entries(spendingByCategory).map(([name, value]) => ({ name, value }));

    useEffect(() => {
        const generateInsight = async () => {
            setIsInsightLoading(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const dataSummary = `Pending Approvals: ${summaryStats.pendingApprovals}, Overdue Invoices: ${summaryStats.overdueInvoices}, Open Compliance Cases: ${summaryStats.openCases}. Recent spending is focused on: ${chartData.map(d=>d.name).join(', ')}.`;
                const prompt = `You are a corporate finance AI controller. Based on the following summary, provide a single, concise (1-2 sentences) strategic recommendation or observation for the finance manager. Summary:\n${dataSummary}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setAiInsight(response.text ?? "An error occurred while analyzing corporate data.");
            } catch (error) {
                console.error("Failed to generate corporate insight:", error);
                setAiInsight("An error occurred while analyzing corporate data.");
            } finally {
                setIsInsightLoading(false);
            }
        };
        generateInsight();
    }, []);

    const StatCard: React.FC<{ title: string; value: string | number; view: View; }> = ({ title, value, view }) => (
        <Card variant="interactive" onClick={() => setActiveView(view)} className="text-center">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{title}</p>
        </Card>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Corporate Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Pending Approvals" value={summaryStats.pendingApprovals} view={View.PaymentOrders} />
                <StatCard title="Overdue Invoices" value={summaryStats.overdueInvoices} view={View.Invoices} />
                <StatCard title="Open Compliance Cases" value={summaryStats.openCases} view={View.Compliance} />
                <Card className="text-center">
                    <p className="text-3xl font-bold text-white">${(summaryStats.totalOutflow / 1000).toFixed(1)}k</p>
                    <p className="text-sm text-gray-400 mt-1">Total Spend (Last 7d)</p>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-6">
                <Card title="ERP Sync Status (Oracle NetSuite)">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="w-4 h-4 rounded-full bg-gray-500 animate-pulse"></div>
                        <div>
                            <p className="text-white font-semibold">Real-time sync protocol not yet activated.</p>
                            <p className="text-gray-400">Future integration will provide live ledger synchronization.</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="AI Controller Summary" className="lg:col-span-1">
                     {isInsightLoading ? <p className="text-gray-400 text-sm">Analyzing...</p> : 
                         <p className="text-gray-300 text-sm italic">"{aiInsight}"</p>
                     }
                </Card>
                <Card title="Spending by Category" className="lg:col-span-2">
                     <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={80} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                                <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CorporateCommandView;