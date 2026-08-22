import React, { useState, useEffect, useRef, useContext } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { View } from '../types';
import Card from './Card';
import { DataContext } from '../context/DataContext';

interface AIAdvisorViewProps {
    previousView: View | null;
}

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
}

// Helper to get a contextual system prompt and suggested questions
const getContextualPrompts = (view: View | null, context: any) => {
    let systemInstruction = "You are Quantum, an expert financial advisor AI for Demo Bank. Your goal is to provide clear, concise, and actionable financial advice. Keep your responses helpful and brief.";
    let suggestions: string[] = [
        "What are some ways I can save more money?",
        "Explain my current investment portfolio.",
        "How can I improve my budget?",
    ];

    if (!context) {
        return { systemInstruction, suggestions };
    }

    switch (view) {
        // FIX: Replaced non-existent `View.Dashboard` with `View.EcosystemHub` to provide correct contextual prompts.
        case View.EcosystemHub:
            systemInstruction += " The user is currently on the Ecosystem Hub (the main dashboard). Provide a high-level overview or a key insight about their overall financial health.";
            suggestions = [
                "Give me a summary of my financial health.",
                "What's one thing I should focus on right now?",
                "Are there any unusual transactions?",
            ];
            break;
        case View.Transactions:
            systemInstruction += ` The user is looking at their transactions. Help them analyze their spending patterns. Recent transactions: ${JSON.stringify(context.transactions.slice(0, 5))}`;
            suggestions = [
                "Where did most of my money go last month?",
                "Find any recurring subscriptions I might have.",
                "Is my spending on dining high?",
            ];
            break;
        case View.Investments:
            systemInstruction += ` The user is in their investments section. Provide insights about their portfolio and market trends. Their portfolio: ${JSON.stringify(context.assets)}`;
            suggestions = [
                "Is my portfolio well-diversified?",
                "What's a good next investment for me?",
                "Explain ESG investing.",
            ];
            break;
        case View.Budgets:
            systemInstruction += ` The user is reviewing their budgets. Help them identify areas for improvement and savings. Their budgets: ${JSON.stringify(context.budgets)}`;
            suggestions = [
                "Which budget am I closest to exceeding?",
                "Suggest a new budget category for me.",
                "How can I cut back on my 'Shopping' budget?",
            ];
            break;
        default:
            // Keep the default
            break;
    }
    return { systemInstruction, suggestions };
};

const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({ previousView }) => {
    const dataContext = useContext(DataContext);
    const [conversation, setConversation] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const chatRef = useRef<Chat | null>(null);
    const conversationEndRef = useRef<HTMLDivElement>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const { systemInstruction, suggestions: contextualSuggestions } = getContextualPrompts(previousView, dataContext);

    // Initialize Chat and set suggestions
    useEffect(() => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                }
            });
            setSuggestions(contextualSuggestions);

            // Send initial message from AI
            const initialMessage: Message = {
                id: Date.now().toString(),
                sender: 'ai',
                // FIX: Updated the initial greeting to reflect that `EcosystemHub` is the dashboard.
                text: `Hello! I'm Quantum, your AI financial advisor. How can I assist you today? Based on your last view (${previousView || 'Ecosystem Hub'}), you might want to ask one of the questions below.`,
            };
            setConversation([initialMessage]);
        } catch (err) {
            console.error("AI Advisor initialization error:", err);
            setError("Failed to initialize the AI Advisor. Please check your configuration.");
        }
    }, [previousView, systemInstruction, contextualSuggestions]);

    // Scroll to bottom of conversation
    useEffect(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading || !chatRef.current) return;
        
        setIsLoading(true);
        setError('');

        const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: messageText };
        setConversation(prev => [...prev, userMessage]);
        setUserInput('');
        const aiMessageId = Date.now().toString() + '-ai';

        try {
            const stream = await chatRef.current.sendMessageStream({ message: messageText });

            let aiResponseText = '';
            
            // Add a placeholder for the AI response
            setConversation(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '' }]);

            for await (const chunk of stream) {
                aiResponseText += chunk.text;
                setConversation(prev => prev.map(msg =>
                    msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg
                ));
            }

        } catch (err) {
            console.error("AI response error:", err);
            const errorMessage: Message = {
                id: aiMessageId,
                sender: 'ai',
                text: "Sorry, I encountered an error while processing your request. Please try again.",
            };
             // Replace placeholder with error
            setConversation(prev => prev.map(msg =>
                msg.id === aiMessageId ? errorMessage : msg
            ));
            setError("AI failed to respond.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card title="AI Advisor" subtitle="Your personal financial co-pilot">
            <div className="flex flex-col h-[75vh]">
                {/* Conversation Area */}
                <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                    {conversation.map(msg => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-cyan-600/50 flex items-center justify-center text-cyan-200 font-bold text-sm flex-shrink-0 mt-1">
                                    Q
                                </div>
                            )}
                            <div className={`max-w-lg p-3 rounded-xl shadow-md ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                {msg.text === '' && msg.sender === 'ai' ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                    </div>
                                ) : (
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={conversationEndRef} />
                </div>

                {/* Suggestions & Input Area */}
                <div className="pt-4 mt-4 border-t border-gray-700/50">
                    <div className="flex gap-2 flex-wrap mb-4">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSendMessage(suggestion)}
                                disabled={isLoading}
                                className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-full text-xs transition-colors disabled:opacity-50"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                    {error && <p className="text-red-400 text-sm mb-2 text-center">{error}</p>}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage(userInput);
                        }}
                        className="flex items-center space-x-2"
                    >
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask me anything about your finances..."
                            className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !userInput.trim()}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </Card>
    );
};

export default AIAdvisorView;