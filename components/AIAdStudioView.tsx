import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';

// FIX: Moved pollingMessages outside the component to prevent it from being redeclared on every render, which could cause issues with useEffect dependencies.
const pollingMessages = [
    "Initializing Veo 2.0 model...",
    "Analyzing prompt semantics...",
    "Generating initial keyframes...",
    "Rendering motion vectors...",
    "Upscaling to high resolution...",
    "Adding audio layer...",
    "Finalizing video file..."
];

const AIAdStudioView: React.FC = () => {
    type GenerationState = 'idle' | 'generating' | 'polling' | 'done' | 'error';

    const [prompt, setPrompt] = useState('A neon hologram of a cat driving a futuristic car at top speed through a cyberpunk city.');
    const [style, setStyle] = useState('Cinematic');
    const [length, setLength] = useState('15s');
    const [voice, setVoice] = useState('Energetic Male');
    
    const [generationState, setGenerationState] = useState<GenerationState>('idle');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [adQualityScore, setAdQualityScore] = useState(0);
    const [ctaSuggestions, setCtaSuggestions] = useState<string[]>([]);
    const [isCtaLoading, setIsCtaLoading] = useState(false);

    const [pollingMessageIndex, setPollingMessageIndex] = useState(0);

    useEffect(() => {
        // Mock Ad Quality Score calculation
        let score = 0;
        if (prompt.length > 20) score += 25;
        if (prompt.length > 50) score += 25;
        if (style !== 'Default') score += 15;
        if (length === '15s') score += 10;
        if (voice !== 'None') score += 10;
        setAdQualityScore(Math.min(99, score + Math.floor(Math.random() * 15)));
    }, [prompt, style, length, voice]);

    useEffect(() => {
        // FIX: The type `NodeJS.Timeout` is not available in browser environments.
        // This has been refactored to use type inference, which correctly identifies the interval ID as a `number`.
        // This also fixes a potential bug where `clearInterval` could be called on an uninitialized variable.
        if (generationState === 'polling') {
            const interval = setInterval(() => {
                setPollingMessageIndex(prev => (prev + 1) % pollingMessages.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [generationState]);

    // Cleanup effect for blob URL
    useEffect(() => {
        return () => {
            if (videoUrl && videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);


    const handleGenerate = async () => {
        setGenerationState('generating');
        setError('');
        if (videoUrl && videoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(videoUrl);
        }
        setVideoUrl(null);
        setCtaSuggestions([]);
        setPollingMessageIndex(0);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const fullPrompt = `${prompt}, ${style} style, high detail, a video that is ${length} long, with an ${voice} voiceover.`;
            
            let operation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt: fullPrompt,
                config: { numberOfVideos: 1 }
            });

            setGenerationState('polling');

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }
            
            // @ts-ignore
            if (operation.error) {
                // @ts-ignore
                throw new Error(operation.error.message || "An unknown error occurred during video generation.");
            }
            
            // @ts-ignore
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            
            if (downloadLink) {
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch the generated video file from the temporary URL.');
                }
                const videoBlob = await response.blob();
                const objectUrl = URL.createObjectURL(videoBlob);
                setVideoUrl(objectUrl);
                setGenerationState('done');
            } else {
                throw new Error("Video generation completed, but no download link was returned.");
            }

        } catch (err: any) {
            console.error("Video generation error:", err);
            setError(err.message || "An unexpected error occurred. Please try again.");
            setGenerationState('error');
        }
    };
    
    const handleDownload = () => {
        if (!videoUrl) return;
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `DemoBank_AI_Ad_${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

     const generateCTAs = async () => {
        setIsCtaLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const ctaPrompt = `For a video ad about "${prompt}", generate 3 short, catchy call-to-action phrases.`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: ctaPrompt});
            if (response.text) {
                setCtaSuggestions(response.text.split('\n').map(s => s.replace(/^- /, '')).filter(Boolean));
            }
        } catch (err) {
            console.error("CTA generation error:", err);
        } finally {
            setIsCtaLoading(false);
        }
    };
    
    useEffect(() => {
        if(generationState === 'done') {
            generateCTAs();
        }
    }, [generationState]);

    const mockThumbnails = ['/thumb1.webp', '/thumb2.webp', '/thumb3.webp'];

    return (
        <div className="space-y-6">
            <Card title="AI Ad Studio" subtitle="Generate a custom video ad with Veo 2.0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Controls */}
                    <div className="lg:col-span-1 space-y-4">
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your video..." className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                        
                        <select value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                            <option>Cinematic</option><option>Vibrant</option><option>Monochrome</option><option>Surreal</option>
                        </select>
                        
                        <div className="grid grid-cols-2 gap-2">
                             <select value={length} onChange={e => setLength(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white"><option>15s</option><option>30s</option><option>60s</option></select>
                             <select value={voice} onChange={e => setVoice(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white"><option>Energetic Male</option><option>Calm Female</option></select>
                        </div>
                        
                        <Card title="Ad Quality Score" variant="outline">
                            <p className="text-center text-4xl font-bold text-cyan-300">{adQualityScore}%</p>
                            <p className="text-center text-xs text-gray-400 mt-1">Based on prompt detail & settings</p>
                        </Card>
                        
                        <button onClick={handleGenerate} disabled={generationState === 'generating' || generationState === 'polling'} className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50">
                             { (generationState === 'generating' || generationState === 'polling') ? 'Generating...' : 'Generate Ad' }
                        </button>
                    </div>

                    {/* Right Column: Output */}
                    <div className="lg:col-span-2">
                        {generationState === 'idle' && (
                            <Card title="Pre-Render Thumbnails">
                                <p className="text-sm text-gray-400 mb-4">Example stills based on similar prompts.</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {mockThumbnails.map(thumb => <img key={thumb} src={thumb} className="rounded-lg aspect-video object-cover" />)}
                                </div>
                            </Card>
                        )}
                        {(generationState === 'generating' || generationState === 'polling') && (
                            <Card className="flex flex-col items-center justify-center h-full aspect-video">
                                <div className="relative w-24 h-24">
                                    <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                                    <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                                </div>
                                <p className="mt-4 text-white font-semibold">Generating Video</p>
                                <p className="text-sm text-gray-400">{pollingMessages[pollingMessageIndex]}</p>
                            </Card>
                        )}
                         {generationState === 'error' && (
                            <Card className="flex flex-col items-center justify-center h-full aspect-video">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="mt-4 text-white font-semibold">Generation Failed</p>
                                <p className="text-sm text-red-400 text-center max-w-xs">{error}</p>
                            </Card>
                        )}
                        {generationState === 'done' && videoUrl && (
                            <div className="space-y-4">
                                <video src={videoUrl} controls autoPlay loop className="w-full rounded-lg aspect-video"></video>
                                <button onClick={handleDownload} className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">Download Video</button>
                                <Card title="AI-Suggested CTAs">
                                    {isCtaLoading ? <p>Generating...</p> : 
                                        <ul className="list-disc list-inside text-sm text-gray-300">
                                            {ctaSuggestions.map((cta, i) => <li key={i}>{cta}</li>)}
                                        </ul>
                                    }
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AIAdStudioView;
