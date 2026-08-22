import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Counterparty, ExternalAccount, VirtualAccount } from '../types';


const CreateCounterpartyModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, type: 'business' | 'individual') => void;
}> = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'business' | 'individual'>('business');

    const handleSubmit = () => {
        if (name) {
            onCreate(name, type);
            onClose();
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">Create Counterparty</h3></div>
                <div className="p-6 space-y-4">
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" />
                    <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white">
                        <option value="business">Business</option>
                        <option value="individual">Individual</option>
                    </select>
                    <button onClick={handleSubmit} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Create</button>
                </div>
            </div>
        </div>
    );
};

const AddAccountModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAddExternal: (account: Omit<ExternalAccount, 'id'>) => void;
    onAddVirtual: (accountName: string) => void;
}> = ({ isOpen, onClose, onAddExternal, onAddVirtual }) => {
    // Logic for adding both external and virtual accounts
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">Add Account</h3></div>
                <div className="p-6 space-y-4">
                    <h4 className="font-semibold text-cyan-300">Create Virtual Account</h4>
                    <button onClick={() => { onAddVirtual('New Virtual Account'); onClose(); }} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Create Virtual Account</button>
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-600"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-gray-800 px-2 text-gray-500">Or</span></div>
                    </div>
                    <h4 className="font-semibold text-cyan-300">Link External Account</h4>
                    <p className="text-xs text-gray-400">This is a simplified mock. In a real app, this would use a Plaid-like flow.</p>
                    <button onClick={() => { onAddExternal({ bankName: 'Chase', mask: '1111', balance: 50000, type: 'checking' }); onClose(); }} className="w-full py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg">Link External Account</button>
                </div>
                <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm">Cancel</button>
                </div>
            </div>
        </div>
    );
};


const CounterpartiesView: React.FC = () => {
    const context = useContext(DataContext);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
    const [selectedCounterparty, setSelectedCounterparty] = useState<Counterparty | null>(null);

    if (!context) throw new Error("CounterpartiesView must be within DataProvider");
    const { counterparties, createCounterparty, addExternalAccountToCounterparty, createVirtualAccountForCounterparty } = context;

    const handleOpenAddAccount = (cp: Counterparty) => {
        setSelectedCounterparty(cp);
        setIsAddAccountModalOpen(true);
    };

    const handleAddExternal = (account: Omit<ExternalAccount, 'id'>) => {
        if (selectedCounterparty) {
            addExternalAccountToCounterparty(selectedCounterparty.id, account);
        }
    };

    const handleAddVirtual = (accountName: string) => {
        if (selectedCounterparty) {
            createVirtualAccountForCounterparty(selectedCounterparty.id, accountName);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">Counterparties</h2>
                    <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg text-sm">Create Counterparty</button>
                </div>
                <Card>
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Accounts</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {counterparties.map((cp: Counterparty) => (
                                <tr key={cp.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-4 py-3 font-medium text-white">{cp.name}</td>
                                    <td className="px-4 py-3 capitalize">{cp.type}</td>
                                    <td className="px-4 py-3">{cp.accounts.length + (cp.virtualAccounts?.length || 0)}</td>
                                    <td className="px-4 py-3">{cp.createdDate}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleOpenAddAccount(cp)} className="text-xs px-2 py-1 bg-gray-600/50 hover:bg-gray-600 rounded">Add Account</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
            <CreateCounterpartyModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={createCounterparty}
            />
            <AddAccountModal 
                isOpen={isAddAccountModalOpen}
                onClose={() => setIsAddAccountModalOpen(false)}
                onAddExternal={handleAddExternal}
                onAddVirtual={handleAddVirtual}
            />
        </>
    );
};

export default CounterpartiesView;