import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Business, User } from '../types';

const GenesisEngineView: React.FC = () => {
    const context = useContext(DataContext);
    const [concept, setConcept] = useState('An AI-powered platform for hyperlocal drone delivery logistics in dense urban environments.');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState('');
    const [generatedBusiness, setGeneratedBusiness] = useState<Business | null>(null);
    const [generatedCeo, setGeneratedCeo] = useState<User | null>(null);

    if (!context) throw new Error("GenesisEngineView must be within a DataProvider.");
    const { generateBusiness } = context;

    const handleForge = async () => {
        if (!concept.trim()) return;
        setIsLoading(true);
        setGeneratedBusiness(null);
        setGeneratedCeo(null);

        const steps = [
            "Initializing conceptual matrix...",
            "Running market viability simulations...",
            "Generating corporate identity...",
            "Appointing simulated CEO...",
            "Securing virtual seed funding...",
            "Writing multi-phase business plan...",
            "Finalizing corporate charter..."
        ];

        for (const step of steps) {
            setLoadingStep(step);
            await new Promise(res => setTimeout(res, 1500));
        }

        const { business, ceo } = await generateBusiness(concept);
        setGeneratedBusiness(business);
        setGeneratedCeo(ceo);
        setIsLoading(false);
        setLoadingStep('');
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Genesis Engine: Corporate Creation</h2>
            
            {!generatedBusiness ? (
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Forge a New Entity</h3>
                            <p className="text-sm text-gray-400">Input a core business concept. The Genesis Engine will use this seed to generate a complete, simulated corporate entity, including its identity, leadership, and a detailed, AI-written business plan.</p>
                            <textarea
                                value={concept}
                                onChange={(e) => setConcept(e.target.value)}
                                placeholder="Describe a business concept..."
                                className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white"
                                disabled={isLoading}
                            />
                            <button onClick={handleForge} disabled={isLoading || !concept.trim()} className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50">
                                {isLoading ? loadingStep : "Forge Business"}
                            </button>
                        </div>
                        <div className="text-center">
                             <div className="relative w-48 h-48 mx-auto">
                                <div className={`absolute inset-0 border-2 border-cyan-500/30 rounded-full ${isLoading ? 'animate-spin' : ''}`}></div>
                                <div className={`absolute inset-4 border-2 border-indigo-500/30 rounded-full ${isLoading ? 'animate-spin-slow' : ''}`}></div>
                                <div className="absolute inset-8 flex items-center justify-center text-cyan-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4m8-8h-4m-8 0H4m12.95 12.95l-2.828-2.828M6.879 6.879L4.05 4.05m12.95-.001l-2.828 2.828M6.879 17.121L4.05 19.95" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ) : (
                <>
                    <Card>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-3xl font-bold text-white">{generatedBusiness.name}</h3>
                                {/* FIX: The `Business` interface uses `type` instead of `industry`. This was updated to correctly display the business type and resolve a TypeScript error. */}
                                <p className="text-cyan-300 capitalize">{generatedBusiness.type}</p>
                            </div>
                            <button onClick={() => setGeneratedBusiness(null)} className="text-sm px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg">Forge Another</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-center">
                            <div className="bg-gray-800/50 p-3 rounded-lg"><p className="text-xs text-gray-400">Valuation</p><p className="font-bold text-lg text-white">${(generatedBusiness.valuation / 1_000_000).toFixed(1)}M</p></div>
                            <div className="bg-gray-800/50 p-3 rounded-lg"><p className="text-xs text-gray-400">Cash Balance</p><p className="font-bold text-lg text-white">${(generatedBusiness.cashBalance / 1_000_000).toFixed(1)}M</p></div>
                            <div className="bg-gray-800/50 p-3 rounded-lg"><p className="text-xs text-gray-400">HQ Location</p><p className="font-bold text-lg text-white">{generatedBusiness.hqLocation}</p></div>
                        </div>
                    </Card>
                     <Card title="Appointed CEO">
                        <div className="flex items-center gap-4">
                            {/* FIX: The `User` model was updated to use `display_name` instead of `name`. This change aligns the component with the `User` interface, resolving a TypeScript error and ensuring the correct user name is used for the image alt text. */}
                            <img src={generatedCeo?.profilePictureUrl} alt={generatedCeo?.display_name} className="w-16 h-16 rounded-full object-cover" />
                            <div>
                                <p className="font-bold text-xl text-white">{generatedCeo?.display_name}</p>
                                <p className="text-sm text-gray-400 italic">"{generatedCeo?.bio}"</p>
                            </div>
                        </div>
                    </Card>
                     <Card title="AI-Generated Business Plan">
                        <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap">
                            {generatedBusiness.businessPlan}
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export default GenesisEngineView;