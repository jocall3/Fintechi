import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { FinancialGoal, AIGoalPlan } from '../types';

const GoalModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAdd: (goalData: Omit<FinancialGoal, 'id' | 'plan' | 'currentAmount'>) => void;
}> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [iconName, setIconName] = useState('rocket');

    const handleSubmit = () => {
        if (name && targetAmount && targetDate) {
            // FIX: The `plan` property should not be passed here as it is omitted from the type.
            // The `addFinancialGoal` function in the context handles setting the initial plan to null.
            onAdd({ name, targetAmount: parseFloat(targetAmount), targetDate, iconName });
            onClose();
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">Create New Financial Goal</h3></div>
                <div className="p-6 space-y-4">
                    <input type="text" placeholder="Goal Name (e.g., Buy a hovercar)" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700/50 rounded p-2 text-white" />
                    <input type="number" placeholder="Target Amount ($)" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className="w-full bg-gray-700/50 rounded p-2 text-white" />
                    <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full bg-gray-700/50 rounded p-2 text-white" />
                    <button onClick={handleSubmit} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Add Goal</button>
                </div>
            </div>
        </div>
    );
};

const ContributeModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onContribute: (amount: number) => void;
    goal: FinancialGoal;
}> = ({ isOpen, onClose, onContribute, goal }) => {
    const [amount, setAmount] = useState('');
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full border border-gray-700 p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-white">Contribute to {goal.name}</h3>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="w-full bg-gray-700/50 rounded p-2 text-white my-4" />
                <button onClick={() => { onContribute(parseFloat(amount)); onClose(); }} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Contribute</button>
            </div>
        </div>
    );
};

const GoalsView: React.FC = () => {
    const context = useContext(DataContext);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [contributionGoal, setContributionGoal] = useState<FinancialGoal | null>(null);

    if (!context) throw new Error("GoalsView must be within DataProvider");
    const { financialGoals, addFinancialGoal, contributeToGoal, generateGoalPlan } = context;
    
    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Financial Goals</h2>
                    <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg text-sm">Add New Goal</button>
                </div>
                {financialGoals.map(goal => (
                    <Card key={goal.id} title={goal.name}>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300">${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
                                    <span className="text-white font-semibold">{((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-4"><div className="bg-cyan-500 h-4 rounded-full" style={{width: `${(goal.currentAmount / goal.targetAmount) * 100}%`}}></div></div>
                            </div>
                            
                            {goal.plan ? (
                                <div className="p-3 bg-gray-900/50 rounded-lg">
                                    <h4 className="font-semibold text-cyan-300">AI-Powered Plan</h4>
                                    <p className="text-xs text-gray-400 italic">"{goal.plan.feasibilitySummary}"</p>
                                    <ul className="text-sm mt-2 space-y-1 text-gray-300">
                                        {goal.plan.steps.map((step, i) => <li key={i}><strong>{step.title}:</strong> {step.description}</li>)}
                                    </ul>
                                </div>
                            ) : (
                                <button onClick={() => generateGoalPlan(goal.id)} className="w-full py-2 bg-indigo-600/50 hover:bg-indigo-600 text-white rounded-lg text-sm">Generate AI Plan</button>
                            )}

                             <button onClick={() => setContributionGoal(goal)} className="w-full py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg text-sm">Make Contribution</button>
                        </div>
                    </Card>
                ))}
            </div>
            <GoalModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onAdd={addFinancialGoal} />
            {contributionGoal && (
                 <ContributeModal 
                    isOpen={!!contributionGoal} 
                    onClose={() => setContributionGoal(null)}
                    goal={contributionGoal}
                    onContribute={(amount) => contributeToGoal(contributionGoal.id, amount)}
                />
            )}
        </>
    );
};

export default GoalsView;
