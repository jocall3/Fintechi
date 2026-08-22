import React, { useContext, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Transaction, Post, User, LoginAttempt, CorporateTransaction } from '../types';

const ControlCenterView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("ControlCenterView must be within a DataProvider.");

    const { users, posts, transactions, corporateTransactions, loginAttempts } = context;
    
    const allTransactions = useMemo(() => {
        const parseRelativeDate = (timestamp: string): Date => {
            const now = new Date();
            if (timestamp.endsWith('m ago')) {
                const minutes = parseInt(timestamp.replace('m ago', ''));
                if (!isNaN(minutes)) {
                    now.setMinutes(now.getMinutes() - minutes);
                    return now;
                }
            }
            if (timestamp.endsWith('h ago')) {
                const hours = parseInt(timestamp.replace('h ago', ''));
                if (!isNaN(hours)) {
                    now.setHours(now.getHours() - hours);
                    return now;
                }
            }
            // Fallback for absolute dates like 'YYYY-MM-DD'
            const d = new Date(timestamp);
            return isNaN(d.getTime()) ? now : d;
        }

        const personal = transactions.map(t => ({...t, txType: 'Personal'}));
        const corporate = corporateTransactions.map(t => ({
            id: t.id,
            description: `${t.merchant} (${t.holderName})`,
            amount: t.amount,
            date: t.timestamp,
            type: 'expense' as 'expense',
            category: 'Corporate',
            txType: 'Corporate'
        }));
        
        // @ts-ignore - txType is not on Transaction, but we add it.
        const combined = [...personal, ...corporate];

        return combined.sort((a,b) => parseRelativeDate(b.date).getTime() - parseRelativeDate(a.date).getTime()).slice(0, 10);
    }, [transactions, corporateTransactions]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Control Center</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                
                <Card title="Live User Monitoring" className="xl:col-span-1">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {users.map(user => (
                            <div key={user.id} className="p-3 bg-gray-800/50 rounded-lg flex items-center gap-3">
                                {/* FIX: The User model was updated to use `display_name` instead of `name`. This change aligns the component with the `User` interface, resolving a TypeScript error and ensuring the correct user name is displayed. */}
                                <img src={user.profilePictureUrl} alt={user.display_name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    {/* FIX: The User model was updated to use `display_name` instead of `name`. This change aligns the component with the `User` interface, resolving a TypeScript error and ensuring the correct user name is displayed. */}
                                    <p className="font-semibold text-white">{user.display_name}</p>
                                    <p className="text-xs text-gray-400">{user.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Live Transaction Feed" className="xl:col-span-2">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {allTransactions.map(tx => (
                            <div key={tx.id} className="flex justify-between p-2 bg-gray-800/50 rounded-lg text-sm">
                                <div>
                                    <p className="text-white truncate max-w-xs">{tx.description}</p>
                                    <p className="text-xs text-gray-400">{tx.date}</p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                    <p className={`font-mono ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                    </p>
                                    <p className={`text-xs ${tx.txType === 'Personal' ? 'text-cyan-400' : 'text-indigo-400'}`}>{tx.txType}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Recent Login Attempts" className="xl:col-span-1">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {loginAttempts.map(attempt => (
                            <div key={attempt.id} className="p-2 bg-gray-800/50 rounded-lg flex justify-between items-center text-sm">
                                <div>
                                    <p className="text-white">{attempt.userName}</p>
                                    <p className="text-xs text-gray-500">{attempt.ipAddress} - {attempt.timestamp}</p>
                                </div>
                                {attempt.success ? 
                                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full">Success</span> :
                                    <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-full">Failed</span>
                                }
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Latest Community Posts" className="xl:col-span-2">
                     <div className="space-y-3 max-h-96 overflow-y-auto">
                        {posts.slice(0, 3).map(post => (
                            <div key={post.id} className="p-3 bg-gray-800/50 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <img src={post.userProfilePic} alt={post.userName} className="w-8 h-8 rounded-full object-cover" />
                                    <div>
                                        <p className="font-semibold text-white text-sm">{post.userName}</p>
                                        <p className="text-xs text-gray-400 mt-1">{post.content.text?.substring(0, 100)}...</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </div>
    );
};

export default ControlCenterView;