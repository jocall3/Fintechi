import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { ComplianceCase, ComplianceRule } from '../types';

const IdemiaModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const steps = [
        "Select Document Type",
        "Uploading Document...",
        "Analyzing Document...",
        "Prepare for Facial Scan",
        "Scanning Biometrics...",
        "Cross-Referencing Watchlists...",
        "Verification Complete"
    ];

    useEffect(() => {
        if (isOpen) {
            setStep(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && step > 0 && step < steps.length - 1) {
            const timer = setTimeout(() => {
                setStep(s => s + 1);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, step, steps.length]);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Idemia Identity Verification</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                        <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                    </div>
                    <h4 className="text-white font-semibold">{steps[step]}</h4>
                    {step === 0 && (
                        <div className="mt-4 space-y-2">
                             <button onClick={() => setStep(1)} className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Driver's License</button>
                             <button onClick={() => setStep(1)} className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Passport</button>
                        </div>
                    )}
                     {step === steps.length - 1 && <p className="text-green-400 mt-2">Subject: Jia Li - Status: Verified</p>}
                </div>
            </div>
        </div>
    );
};


const ComplianceView: React.FC = () => {
    const context = useContext(DataContext);
    const [isIdemiaOpen, setIsIdemiaOpen] = useState(false);

    if (!context) throw new Error("ComplianceView must be within DataProvider");

    const { complianceCases, complianceRules } = context;

    return (
        <>
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Compliance & Identity</h2>
            
            <Card title="KYC/KYB Verification (Idemia Simulation)">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400 flex-1">Run an identity verification check on a new individual or business entity using our simulated Idemia integration. This process includes document analysis, biometric scanning, and watchlist cross-referencing.</p>
                    <button onClick={() => setIsIdemiaOpen(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">
                        Initiate Identity Check
                    </button>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Compliance Rule Engine">
                    <div className="space-y-3">
                        {complianceRules.map(rule => (
                            <div key={rule.id} className="p-3 bg-gray-800/50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-white">{rule.name}</h4>
                                    <input type="checkbox" className="toggle toggle-sm toggle-cyan" defaultChecked={rule.active} />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{rule.description}</p>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Open Cases for Review">
                    <div className="space-y-3">
                        {complianceCases.map(c => (
                            <div key={c.id} className="p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                                <p className="font-semibold text-yellow-200">{c.reason}</p>
                                <p className="text-xs text-yellow-400">Entity: {c.entityType} ({c.entityId})</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
        <IdemiaModal isOpen={isIdemiaOpen} onClose={() => setIsIdemiaOpen(false)} />
        </>
    );
};

export default ComplianceView;
