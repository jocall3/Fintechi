import React from 'react';
import Card from './Card';

const OpenBankingView: React.FC = () => (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white tracking-wider">Open Banking Connections</h2>
        <Card title="Your Connected Apps">
            <p className="text-sm text-gray-400 mb-4">You have granted the following third-party applications limited access to your Demo Bank data. You can revoke access at any time.</p>
            <div className="space-y-3">
                <div className="p-4 bg-gray-800/50 rounded-lg flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold text-white">MintFusion Budgeting</h4>
                        <p className="text-xs text-gray-400">Permissions: Read transaction history, View account balances</p>
                    </div>
                    <button className="text-xs text-red-400 hover:text-red-300">Revoke Access</button>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold text-white">TaxBot Pro</h4>
                        <p className="text-xs text-gray-400">Permissions: Read transaction history</p>
                    </div>
                    <button className="text-xs text-red-400 hover:text-red-300">Revoke Access</button>
                </div>
            </div>
        </Card>
    </div>
);

export default OpenBankingView;
