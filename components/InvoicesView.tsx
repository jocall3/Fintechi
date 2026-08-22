import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Invoice, InvoiceStatus } from '../types';

const CreateInvoiceModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onCreate: (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'status'>) => void;
}> = ({ isOpen, onClose, onCreate }) => {
    const [counterpartyName, setCounterpartyName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = () => {
        if (counterpartyName && amount && dueDate) {
            onCreate({
                counterpartyName,
                amount: parseFloat(amount),
                dueDate,
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Create New Invoice</h3>
                </div>
                <div className="p-6 space-y-4">
                    <input type="text" placeholder="Counterparty Name" value={counterpartyName} onChange={e => setCounterpartyName(e.target.value)} className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" />
                    <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" />
                    <input type="date" placeholder="Due Date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-gray-700/50 border-gray-600 rounded-lg p-2 text-white" />
                    <button onClick={handleSubmit} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Create Invoice</button>
                </div>
            </div>
        </div>
    );
};


const InvoicesView: React.FC = () => {
    const context = useContext(DataContext);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    if (!context) throw new Error("InvoicesView must be within DataProvider");
    const { invoices, addInvoice } = context;

    const StatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
        const styles = {
            paid: 'bg-green-500/20 text-green-300',
            unpaid: 'bg-blue-500/20 text-blue-300',
            overdue: 'bg-red-500/20 text-red-300',
            voided: 'bg-gray-500/20 text-gray-300',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };
    
    return (
        <>
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Invoices</h2>
                <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg text-sm">Create Invoice</button>
            </div>
            <Card>
                 <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr><th className="px-4 py-3">Invoice #</th><th className="px-4 py-3">Counterparty</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Due Date</th><th className="px-4 py-3">Status</th></tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv: Invoice) => (
                            <tr key={inv.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="px-4 py-3 font-mono text-white">{inv.invoiceNumber}</td>
                                <td className="px-4 py-3">{inv.counterpartyName}</td>
                                <td className="px-4 py-3 font-mono text-white">${inv.amount.toLocaleString()}</td>
                                <td className="px-4 py-3">{inv.dueDate}</td>
                                <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
        <CreateInvoiceModal 
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={addInvoice}
        />
        </>
    );
};

export default InvoicesView;