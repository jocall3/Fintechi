import React, { useState, useContext } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { IllusionType } from '../types';
import { GoogleGenAI } from "@google/genai";

const PersonalizationView: React.FC = () => {
    const context = useContext(DataContext);
    const [prompt, setPrompt] = useState('An isolated lighthouse on a stormy sea, with a powerful beam of light cutting through the darkness.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestedTheme, setSuggestedTheme] = useState<{ name: string, justification: string, type: IllusionType | 'image', url?: string } | null>(null);


    if (!context) {
        throw new Error("PersonalizationView must be within a DataProvider.");
    }
    const { setCustomBackgroundUrl, setActiveIllusion, activeIllusion } = context;

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
            });
            const base64ImageBytes: string | undefined = response?.generatedImages?.[0]?.image?.imageBytes;
            if (base64ImageBytes) {
                const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                setCustomBackgroundUrl(imageUrl);
            } else {
                 setError("Sorry, the AI did not return an image. Please try a different prompt.");
            }
        } catch (err) {
            console.error("Image generation error:", err);
            setError("Sorry, I couldn't generate the image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const illusionOptions: { id: IllusionType, name: string }[] = [
        { id: 'none', name: 'None' },
        { id: 'aurora', name: 'Aurora' },
    ];
    
    const handleSuggestion = () => {
        setSuggestedTheme({
            name: "Tropical Sunset",
            justification: "Your 'Cyberpunk Vacation' savings goal inspired me to find a theme that matches your dream destination.",
            type: 'image',
            url: '/IMG_5610.webp' // Using a preloaded image for the suggestion
        });
    }
    
    const applySuggestion = () => {
        if (suggestedTheme) {
            if (suggestedTheme.type === 'image' && suggestedTheme.url) {
                setCustomBackgroundUrl(suggestedTheme.url);
            } else if (suggestedTheme.type === 'aurora' || suggestedTheme.type === 'none') {
                 setActiveIllusion(suggestedTheme.type);
            }
        }
    }


    return (
        <div className="space-y-6">
            <Card title="Heuristic API Theme Suggestions">
                <div className="flex flex-col items-center text-center">
                    {!suggestedTheme ? (
                        <>
                         <p className="text-gray-400 mb-4">Let the Heuristic API suggest a personalized theme based on your financial goals and activity.</p>
                         <button onClick={handleSuggestion} className="px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-sm">Suggest a Theme</button>
                        </>
                    ) : (
                        <div>
                             <h4 className="font-semibold text-cyan-300">Theme Suggestion: {suggestedTheme.name}</h4>
                             <p className="text-sm text-gray-400 italic my-2">"{suggestedTheme.justification}"</p>
                             <button onClick={applySuggestion} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm">Apply Theme</button>
                        </div>
                    )}
                </div>
            </Card>
            <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-lg p-6`}>
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Generate App Background</h3>
                <p className="text-gray-400 mb-4">Describe the background you want to see, and let AI create it for you. This will disable any active dynamic visual.</p>
                <div className="space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A calm zen garden with a flowing river"
                        className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate Background'}
                    </button>
                    {error && <p className="text-red-400 text-center">{error}</p>}
                </div>
            </div>
             <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-lg p-6`}>
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Dynamic Visuals</h3>
                <p className="text-gray-400 mb-4">Choose a dynamic, reality-bending background for the app. This will override any generated background image.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {illusionOptions.map(option => (
                        <button 
                            key={option.id}
                            onClick={() => setActiveIllusion(option.id)}
                            className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500
                                ${activeIllusion === option.id 
                                    ? 'bg-cyan-600 text-white shadow-lg' 
                                    : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                                }`}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PersonalizationView;
