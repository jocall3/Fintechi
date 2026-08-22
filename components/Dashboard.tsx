import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { View, MarketMover, UpcomingBill } from '../types';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import InvestmentPortfolio from './InvestmentPortfolio';
import AIInsights from './AIInsights';
import ImpactTracker from './ImpactTracker';
import WealthTimeline from './WealthTimeline';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';

// ============================ SUB-COMPONENTS & WIDGETS ============================

const LinkAccountPrompt: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("LinkAccountPrompt must be within a DataProvider");
    const { handlePlaidSuccess } = context;
    return (
        <div className="flex items-center justify-center h-full p-4">
            <Card className="max-w-md text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Demo Bank</h2>
                <p className="text-gray-400 mb-6">To get started, securely link a bank account using our Plaid integration.</p>
                <PlaidLinkButton onSuccess={handlePlaidSuccess} />
            </Card>
        </div>
    );
};

const GamificationProfile: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("GamificationProfile must be within a DataProvider");
    const { gamification, rewardPoints } = context;
    
    return (
        <Card title="Your Profile" className="h-full">
            <div className="flex flex-col justify-between h-full">
                <div>
                    <p className="text-sm text-gray-400">Level {gamification.level}</p>
                    <h3 className="text-xl font-semibold text-cyan-300">{gamification.levelName}</h3>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 my-3">
                        <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2.5 rounded-full" style={{ width: `${gamification.progress}%` }}></div>
                    </div>
                </div>
                <div className="flex justify-between text-sm mt-4">
                    <span className="text-gray-400">Total Score:</span>
                    <span className="font-bold text-white">{gamification.score.toLocaleString()}</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Reward Points:</span>
                    <span className="font-bold text-white">{rewardPoints.balance.toLocaleString()}</span>
                </div>
            </div>
        </Card>
    );
};

const CreditScoreMonitor: React.FC<{ setActiveView: (view: View) => void; }> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("CreditScoreMonitor must be within a DataProvider");
    const { creditScore } = context;

    return (
        <Card title="Credit Score" variant="interactive" onClick={() => setActiveView(View.CreditHealth)}>
            <div className="text-center">
                <p className="text-6xl font-bold text-white">{creditScore.score}</p>
                <p className="font-semibold text-green-400">{creditScore.rating}</p>
                <p className="text-sm text-gray-400 mt-2">
                    <span className={creditScore.change > 0 ? 'text-green-400' : 'text-red-400'}>
                        {creditScore.change > 0 ? '↑' : '↓'} {Math.abs(creditScore.change)} pts
                    </span> last month
                </p>
            </div>
        </Card>
    );
};

const QuickActions: React.FC<{ setActiveView: (view: View) => void; }> = ({ setActiveView }) => {
    return (
        <Card title="Quick Actions" className="h-full">
            <div className="flex flex-col justify-center h-full space-y-3">
                <button onClick={() => setActiveView(View.SendMoney)} className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg">Send Money</button>
                <button onClick={() => setActiveView(View.Budgets)} className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">View Budgets</button>
            </div>
        </Card>
    );
};

const UpcomingBillsWidget: React.FC<{ onPay: (bill: UpcomingBill) => void; }> = ({ onPay }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("UpcomingBillsWidget must be within a DataProvider");
    const { upcomingBills } = context;

    return (
        <Card title="Upcoming Bills">
            <div className="space-y-3">
                {upcomingBills.map(bill => (
                    <div key={bill.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-700/50">
                        <div>
                            <p className="font-medium text-white">{bill.name}</p>
                            <p className="text-xs text-gray-400">Due: {bill.dueDate}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="font-mono text-white">${bill.amount.toFixed(2)}</p>
                            <button onClick={() => onPay(bill)} className="px-3 py-1 text-xs font-semibold bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg">Pay</button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const MarketMoversWidget: React.FC<{ onInspect: (mover: MarketMover) => void; }> = ({ onInspect }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarketMoversWidget must be within a DataProvider");
    const { marketMovers } = context;
    
    return (
        <Card title="Market Movers">
            <div className="space-y-2">
                {marketMovers.map(mover => (
                    <div key={mover.ticker} onClick={() => onInspect(mover)} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                        <div>
                            <p className="font-bold text-white">{mover.ticker}</p>
                            <p className="text-xs text-gray-400 truncate w-24">{mover.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-white">${mover.price.toFixed(2)}</p>
                            <p className={`text-xs font-semibold ${mover.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {mover.change >= 0 ? '+' : ''}{mover.change.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const PayBillModal: React.FC<{ bill: UpcomingBill | null; onClose: () => void; onConfirm: (bill: UpcomingBill) => void }> = ({ bill, onClose, onConfirm }) => {
    if (!bill) return null;
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full border border-gray-700 p-6 text-center" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-white">Confirm Payment</h3>
                <p className="text-gray-400 my-4">Are you sure you want to pay <span className="font-bold text-white">${bill.amount.toFixed(2)}</span> for your <span className="font-bold text-white">{bill.name}</span> bill?</p>
                <div className="flex justify-center gap-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">Cancel</button>
                    <button onClick={() => onConfirm(bill)} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Confirm</button>
                </div>
            </div>
        </div>
    );
};

const InspectMoverModal: React.FC<{ mover: MarketMover | null; onClose: () => void; }> = ({ mover, onClose }) => {
    if (!mover) return null;

    const chartData = Array.from({length: 12}, (_, i) => ({
        month: i,
        price: mover.price + (mover.change * (Math.random() - 0.5)) - (mover.change / 2) + ((mover.change / 12) * i)
    }));

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-white">{mover.name} ({mover.ticker})</h3>
                        <p className="text-sm text-gray-400">Price: ${mover.price.toFixed(2)}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6">
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                                <Bar dataKey="price" fill={mover.change >= 0 ? '#10b981' : '#ef4444'} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================ MAIN DASHBOARD VIEW ============================
interface DashboardViewProps {
    setActiveView: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    const [billToPay, setBillToPay] = useState<UpcomingBill | null>(null);
    const [moverToInspect, setMoverToInspect] = useState<MarketMover | null>(null);

    if (!context) {
        throw new Error("DashboardView must be within a DataProvider");
    }

    const { linkedAccounts, transactions, impactData, addTransaction } = context;
    
    const handlePayBill = (bill: UpcomingBill) => {
        addTransaction({
            id: `billpay_${bill.id}_${Date.now()}`,
            type: 'expense',
            category: 'Bills',
            description: `Payment for ${bill.name}`,
            amount: bill.amount,
            date: new Date().toLocaleDateString('en-CA'),
        });
        setBillToPay(null);
        // Maybe add a toast notification here later.
    };

    if (linkedAccounts.length === 0) {
        return <LinkAccountPrompt />;
    }

    return (
        <>
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <BalanceSummary />
                    </div>
                    <div className="flex flex-col gap-6">
                        <GamificationProfile />
                        <QuickActions setActiveView={setActiveView} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RecentTransactions transactions={transactions.slice(0, 5)} setActiveView={setActiveView} />
                    </div>
                    <div>
                         <CreditScoreMonitor setActiveView={setActiveView} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 xl:col-span-4">
                        <WealthTimeline />
                    </div>
                    <div className="lg:col-span-3 xl:col-span-2">
                        <InvestmentPortfolio />
                    </div>
                    <div className="lg:col-span-2 xl:col-span-2">
                        <AIInsights />
                    </div>
                     <div className="lg:col-span-1 xl:col-span-2">
                        <UpcomingBillsWidget onPay={setBillToPay} />
                    </div>
                    <div className="lg:col-span-1">
                        <MarketMoversWidget onInspect={setMoverToInspect} />
                    </div>
                    <div className="lg:col-span-1">
                        <ImpactTracker treesPlanted={impactData.treesPlanted} progress={impactData.progressToNextTree} />
                    </div>
                </div>
            </div>
            
            <PayBillModal bill={billToPay} onClose={() => setBillToPay(null)} onConfirm={handlePayBill} />
            <InspectMoverModal mover={moverToInspect} onClose={() => setMoverToInspect(null)} />
        </>
    );
};

export default DashboardView;
