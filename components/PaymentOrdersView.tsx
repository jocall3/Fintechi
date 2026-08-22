import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { PaymentOrder, PaymentOrderStatus, Counterparty, ExternalAccount, VirtualAccount } from '../types';

const CreatePaymentOrderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onCreate: (orderData: Omit<PaymentOrder, 'id' | 'status' | 'date'>) => void;
    counterparties: Counterparty[];
}> = ({ isOpen, onClose, onCreate, counterparties }) => {
    const [selectedCpId, setSelectedCpId] = useState('');
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [direction, setDirection] = useState<'credit' | 'debit'>('debit');

    const selectedCounterparty = counterparties.find(cp => cp.id === selectedCpId);
    const availableAccounts = selectedCounterparty ? [...selectedCounterparty.accounts, ...(selectedCounterparty.virtualAccounts || [])] : [];

    const handleSubmit = () => {
        if (selectedCounterparty && selectedAccountId && amount) {
            onCreate({
                counterpartyId: selectedCpId,
                counterpartyName: selectedCounterparty.name,
                accountId: selectedAccountId,
                amount: parseFloat(amount),
                currency: 'USD',
                direction,
                type: 'ACH', // Default for simplicity
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">Create Payment Order</h3></div>
                <div className="p-6 space-y-4">
                    <select value={selectedCpId} onChange={e => setSelectedCpId(e.target.value)} className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white">
                        <option value="">Select Counterparty</option>
                        {counterparties.map(cp => <option key={cp.id} value={cp.id}>{cp.name}</option>)}
                    </select>
                    {selectedCpId && (
                        <select value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)} className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white">
                            <option value="">Select Account</option>
                            {/* FIX: Use `in` operator to safely access properties on the union type. */}
                            {availableAccounts.map(acc => <option key={acc.id} value={acc.id}>{'bankName' in acc ? acc.bankName : acc.accountName} (•••• {'mask' in acc ? acc.mask : acc.accountNumber?.slice(-4)})</option>)}
                        </select>
                    )}
                    <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" />
                    <select value={direction} onChange={e => setDirection(e.target.value as any)} className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white">
                        <option value="debit">Debit (Send)</option>
                        <option value="credit">Credit (Receive)</option>
                    </select>
                    <button onClick={handleSubmit} disabled={!selectedAccountId} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50">Create Order</button>
                </div>
            </div>
        </div>
    );
};


const PaymentOrdersView: React.FC = () => {
    const context = useContext(DataContext);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    if (!context) throw new Error("PaymentOrdersView must be within DataProvider");
    const { paymentOrders, counterparties, createPaymentOrder, approvePaymentOrder, denyPaymentOrder } = context;

    const StatusBadge: React.FC<{ status: PaymentOrderStatus }> = ({ status }) => {
        const styles = {
            needs_approval: 'bg-yellow-500/20 text-yellow-300',
            approved: 'bg-blue-500/20 text-blue-300',
            processing: 'bg-cyan-500/20 text-cyan-300 animate-pulse',
            completed: 'bg-green-500/20 text-green-300',
            denied: 'bg-red-500/20 text-red-300',
            returned: 'bg-orange-500/20 text-orange-300',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status.replace('_', ' ')}</span>;
    };

    return (
        <>
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Payment Orders</h2>
                <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg text-sm">Create Payment Order</button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th className="px-4 py-3">Counterparty</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentOrders.map((order: PaymentOrder) => (
                                <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-4 py-3 font-medium text-white">{order.counterpartyName}</td>
                                    <td className={`px-4 py-3 font-mono ${order.direction === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                        {order.direction === 'credit' ? '+' : '-'}${order.amount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">{order.date}</td>
                                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                                    <td className="px-4 py-3">
                                        {order.status === 'needs_approval' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => approvePaymentOrder(order.id)} className="text-xs px-2 py-1 bg-green-600/50 hover:bg-green-600 rounded">Approve</button>
                                                <button onClick={() => denyPaymentOrder(order.id)} className="text-xs px-2 py-1 bg-red-600/50 hover:bg-red-600 rounded">Deny</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
        <CreatePaymentOrderModal 
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={createPaymentOrder}
            counterparties={counterparties}
        />
        </>
    );
};

export default PaymentOrdersView;