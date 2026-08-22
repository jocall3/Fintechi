import React, { useContext, useState, useEffect } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import PlaidLinkButton from './PlaidLinkButton';
import { User, SynapticVault } from '../types';

const SynapticVaultModal: React.FC<{ 
    isOpen: boolean, 
    onClose: () => void, 
    users: User[],
    onCreate: (collaboratorId: string) => void 
}> = ({ isOpen, onClose, users, onCreate }) => {
    const [step, setStep] = useState(0);
    const [selectedCollaborator, setSelectedCollaborator] = useState<User | null>(null);

    const steps = [
        "Select Collaborator",
        "Scan Your Fingerprint",
        "Awaiting Collaborator...",
        "Scan Collaborator's Fingerprint",
        "Combining Biometric Hashes...",
        "Master Private Key Created!",
        "Ready for Public Key Generation",
        "Re-scan Your Fingerprint (Session)",
        "Re-scan Collaborator's Fingerprint (Session)",
        "Public Key Generated!"
    ];

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setStep(0);
                setSelectedCollaborator(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);
    
    useEffect(() => {
        if (step > 0 && step < steps.length -1) {
            const timer = setTimeout(() => {
                setStep(s => s + 1);
            }, 2000);
            return () => clearTimeout(timer);
        }
        if (step === steps.length -1) {
            onCreate(selectedCollaborator!.id);
        }
    }, [step]);

    const handleSelectCollaborator = (user: User) => {
        setSelectedCollaborator(user);
        setStep(1);
    }
    
    const FingerprintScanner: React.FC<{ active: boolean }> = ({ active }) => (
        <div className="relative w-24 h-24 mx-auto my-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.75 11c0-3.517-1.009-6.799-2.753-9.571m-3.44 2.04l-.054.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.75 11" /></svg>
            {active && <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 animate-scan-fingerprint"></div>}
            <style>{`
                @keyframes scan-fingerprint {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-scan-fingerprint { animation: scan-fingerprint 2s linear infinite; }
            `}</style>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700 p-6 text-center" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-white mb-2">Create Synaptic Vault</h3>
                <p className="text-sm text-gray-400 mb-4">{steps[step]}</p>
                {step === 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {/* FIX: The User model was updated to use `display_name` instead of `name` for better clarity. This resolves a TypeScript error where the `name` property was not found on the User type. All instances of `user.name` have been updated to `user.display_name` to align with the new data model. */}
                        {users.slice(1).map(user => (
                            <button key={user.id} onClick={() => handleSelectCollaborator(user)} className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-left">{user.display_name}</button>
                        ))}
                    </div>
                )}
                {[1, 3, 7, 8].includes(step) && <FingerprintScanner active={true} />}
                {[2, 4, 5, 6].includes(step) && <FingerprintScanner active={false} />}
                {step === steps.length -1 && <p className="text-green-400 font-bold">Vault Created and Public Key is now available!</p>}
                 <button onClick={onClose} className="mt-4 text-xs text-gray-500">Cancel</button>
            </div>
        </div>
    );
};

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [settings, setSettings] = useState({ twoFactor: true, biometric: false });
    const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);

    if (!context) throw new Error("SecurityView must be within a DataProvider.");
    const { linkedAccounts, handlePlaidSuccess, unlinkAccount, synapticVaults, users, createSynapticVault } = context;

    const handleToggle = (setting: 'twoFactor' | 'biometric') => {
        setSettings(prev => ({...prev, [setting]: !prev[setting]}));
    }
    
    return (
        <>
        <div className="space-y-6">
            <Card title="Security Settings">
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                            <p className="text-sm text-gray-400">Add an extra layer of security to your account.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={settings.twoFactor} onChange={() => handleToggle('twoFactor')} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                    </div>
                     <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                         <h4 className="font-semibold text-white">Change Password</h4>
                         <button onClick={() => alert("Modal for password change is disabled in this demo.")} className="px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-sm">Change</button>
                    </div>
                </div>
            </Card>

            <Card title="The Synaptic Vault: Collaborative Biometric Keys">
                <div className="text-sm text-gray-400 mb-4 p-4 bg-gray-900/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">The Lore:</h4>
                    <p>The Synaptic Vault represents a paradigm shift in digital security. Instead of a single point of failure, it cryptographically fuses the biometric data of two individuals into a Master Private Key. This key is never stored whole and can only generate a usable Public Key when both parties provide a fresh biometric "Session Key" simultaneously. It's security through shared, synchronous intent.</p>
                </div>
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-200">Your Active Vaults</h4>
                    <button onClick={() => setIsVaultModalOpen(true)} className="text-xs px-2 py-1 bg-indigo-600/50 hover:bg-indigo-600 rounded">Create New Vault</button>
                </div>
                <div className="space-y-2">
                    {synapticVaults.map(vault => (
                        <div key={vault.id} className="p-3 bg-gray-800/50 rounded-lg">
                            <p className="font-semibold text-white">Vault with: {vault.ownerNames.filter(name => name !== users[0].display_name).join(', ')}</p>
                            <p className="text-xs text-gray-400">Created: {vault.creationDate} | Status: <span className="text-green-400">{vault.status}</span></p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Recent Login Activity">
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-800">
                        <p className="text-gray-300"><span className="font-mono">Chrome on Windows</span> - New York, USA</p>
                        <p className="text-gray-400">Today, 10:30 AM</p>
                    </div>
                </div>
            </Card>
        </div>
        <SynapticVaultModal 
            isOpen={isVaultModalOpen} 
            onClose={() => setIsVaultModalOpen(false)}
            users={users}
            onCreate={createSynapticVault}
        />
        </>
    );
};

export default SecurityView;