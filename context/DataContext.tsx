// context/DataContext.tsx
import React, { createContext, ReactNode, useCallback, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

import { useAIFeatures } from './hooks/useAIFeatures';
import { useCorporateData } from './hooks/useCorporateData';
import { useFinancials } from './hooks/useFinancials';
import { useIntegrations } from './hooks/useIntegrations';
import { useMarketplace } from './hooks/useMarketplace';
import { useSecurity } from './hooks/useSecurity';
import { useSimulation } from './hooks/useSimulation';
import { useSocialEcosystem } from './hooks/useSocialEcosystem';
import { useUI } from './hooks/useUI';
import { useUserData } from './hooks/useUserData';
import { useWeb3 } from './hooks/useWeb3';

import * as types from '../types';

// Combine all return types from hooks into a single context type
// This creates the public API of our DataContext
export type IDataContext = 
    ReturnType<typeof useAIFeatures> &
    ReturnType<typeof useCorporateData> &
    ReturnType<typeof useFinancials> &
    ReturnType<typeof useIntegrations> &
    ReturnType<typeof useMarketplace> &
    ReturnType<typeof useSecurity> &
    ReturnType<typeof useSimulation> &
    ReturnType<typeof useSocialEcosystem> &
    ReturnType<typeof useUI> &
    ReturnType<typeof useUserData> &
    ReturnType<typeof useWeb3> &
    {
        // Explicitly define all actions to ensure type safety
        addTransaction: (tx: types.Transaction) => void;
        updateGamification: (scoreChange: number) => void;
        pitchBusinessPlan: (plan: string) => Promise<void>;
        simulateTestPass: () => Promise<void>;
        generateDashboardInsights: () => void;
        generateGoalPlan: (goalId: string) => Promise<void>;
        generateBusiness: (concept: string) => Promise<{ business: types.Business, ceo: types.User }>;
        simulateAiPost: () => Promise<void>;
        toggleCorporateCardFreeze: (cardId: string) => void;
        updateCorporateCard: (cardId: string, newControls: types.CorporateCardControls, newFrozenState: boolean) => void;
        updateAnomalyStatus: (id: string, status: types.AnomalyStatus) => void;
        createCounterparty: (name: string, type: 'business' | 'individual') => void;
        addExternalAccountToCounterparty: (counterpartyId: string, accountData: Omit<types.ExternalAccount, 'id'>) => void;
        createVirtualAccountForCounterparty: (counterpartyId: string, accountName: string) => void;
        approvePaymentOrder: (orderId: string) => void;
        denyPaymentOrder: (orderId: string) => void;
        createPaymentOrder: (orderData: Omit<types.PaymentOrder, 'id' | 'status' | 'date'>) => void;
        addInvoice: (invoiceData: Omit<types.Invoice, 'id' | 'invoiceNumber' | 'status'>) => void;
        addBudget: (budgetData: Omit<types.BudgetCategory, 'id' | 'spent' | 'color'>) => void;
        handlePlaidSuccess: (publicToken: string, metadata: any) => void;
        unlinkAccount: (id: string) => void;
        sendCashAppPayment: (cashtag: string, amount: number) => void;
        fetchMarketplaceProducts: () => Promise<void>;
        addProductToTransactions: (product: types.MarketplaceProduct) => void;
        enableBiometricLock: (cardId: string) => void;
        createSynapticVault: (collaboratorId: string) => void;
        advanceTime: (days: number) => void;
        createPost: (text: string) => void;
        likePost: (postId: string) => void;
        addComment: (postId: string, text: string) => void;
        mintPostAsNFT: (postId: string) => void;
        addFinancialGoal: (goalData: Omit<types.FinancialGoal, 'id' | 'plan' | 'currentAmount'>) => void;
        contributeToGoal: (goalId: string, amount: number) => void;
        markNotificationRead: (id: string) => void;
        redeemReward: (item: types.RewardItem) => boolean;
        connectWallet: () => void;
        issueCard: () => void;
        buyCrypto: (usdAmount: number, cryptoTicker: string) => void;
        mintNFT: (name: string, imageUrl: string, sourcePostId?: string) => void;
        mintToken: (name: string, ticker: string, amount: number) => void;
        initiatePayment: (details: Omit<types.PaymentOperation, 'id' | 'status' | 'date'>) => void;
        isImportingData: boolean;
    };

export const DataContext = createContext<IDataContext | undefined>(undefined);

const COST_PER_TREE = 250;
const LEVEL_NAMES = ["Financial Novice", "Budgeting Apprentice", "Savings Specialist", "Investment Adept", "Wealth Master"];
const SCORE_PER_LEVEL = 200;

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 1. Instantiate all state hooks
    const ui = useUI();
    const ai = useAIFeatures();
    const corporate = useCorporateData();
    const financials = useFinancials();
    const integrations = useIntegrations();
    const marketplace = useMarketplace();
    const security = useSecurity();
    const simulation = useSimulation();
    const social = useSocialEcosystem();
    const user = useUserData();
    const web3 = useWeb3();
    
    // 2. Define actions using useCallback for performance and to manage dependencies
    const updateGamification = useCallback((scoreChange: number) => {
        user.setGamification(prev => {
            const newScore = prev.score + scoreChange;
            const newLevel = Math.floor(newScore / SCORE_PER_LEVEL) + 1;
            const newProgress = ((newScore % SCORE_PER_LEVEL) / SCORE_PER_LEVEL) * 100;
            const levelName = LEVEL_NAMES[Math.min(newLevel - 1, LEVEL_NAMES.length - 1)];
            if (newLevel > prev.level) {
                ui.showToast(`Congratulations! You've reached Level ${newLevel}: ${levelName}!`, 'success');
            }
            return { ...prev, score: newScore, level: newLevel, levelName, progress: newProgress, credits: prev.credits + scoreChange };
        });
    }, [user.setGamification, ui.showToast]);

    const addTransaction = useCallback((tx: types.Transaction) => {
        financials.setTransactions(prev => [tx, ...prev]);
        if (tx.type === 'expense') {
            financials.setSpendingForNextTree(prev => {
                const newTotal = prev + tx.amount;
                if (newTotal >= COST_PER_TREE) {
                    financials.setTreesPlanted(p => p + 1);
                    ui.showToast("You've planted a new tree with your spending!", 'success');
                    return newTotal - COST_PER_TREE;
                }
                return newTotal;
            });
            financials.setBudgets(prevBudgets => prevBudgets.map(b => 
                b.name.toLowerCase() === tx.category.toLowerCase() ? { ...b, spent: b.spent + tx.amount } : b
            ));
            updateGamification(5);
        } else {
            updateGamification(10);
        }
    }, [financials.setTransactions, financials.setSpendingForNextTree, financials.setTreesPlanted, financials.setBudgets, updateGamification, ui.showToast]);
    
    // --- All other actions defined here, wiring hooks together ---

    // USER ACTIONS
    const addFinancialGoal = useCallback((goalData: Omit<types.FinancialGoal, 'id' | 'plan' | 'currentAmount'>) => {
        const newGoal: types.FinancialGoal = { id: `goal_${Date.now()}`, ...goalData, currentAmount: 0, plan: null };
        user.setFinancialGoals(prev => [...prev, newGoal]);
    }, [user.setFinancialGoals]);

    const contributeToGoal = useCallback((goalId: string, amount: number) => {
        const goal = user.financialGoals.find(g => g.id === goalId);
        if (goal && amount > 0) {
            user.setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g));
            addTransaction({ id: `tx_goal_${Date.now()}`, type: 'expense', category: 'Savings', description: `Contribution to ${goal.name}`, amount, date: new Date().toLocaleDateString('en-CA') });
            ui.showToast(`Contributed $${amount} to your goal!`);
        }
    }, [user.financialGoals, user.setFinancialGoals, addTransaction, ui.showToast]);
    
    const markNotificationRead = useCallback((id: string) => {
        user.setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, [user.setNotifications]);

    const redeemReward = useCallback((item: types.RewardItem): boolean => {
        if (user.rewardPoints.balance >= item.cost) {
            user.setRewardPoints(prev => ({ ...prev, balance: prev.balance - item.cost, lastRedeemed: item.cost }));
            ui.showToast(`Redeemed "${item.name}" successfully!`);
            return true;
        }
        ui.showToast("Not enough points to redeem this item.", 'error');
        return false;
    }, [user.rewardPoints.balance, user.setRewardPoints, ui.showToast]);

    // AI ACTIONS
    const generateGoalPlan = useCallback(async (goalId: string) => {
        const goal = user.financialGoals.find(g => g.id === goalId);
        if (!goal) return;
        try {
            const aiApi = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `Create a financial plan for this goal: Name: "${goal.name}", Target: $${goal.targetAmount}, Target Date: ${goal.targetDate}, Current Savings: $${goal.currentAmount}. Provide a feasibility summary, a suggested monthly contribution, and 3 actionable steps (with title, description, and category: Savings, Budgeting, Investing, or Income).`;
            const responseSchema = { type: Type.OBJECT, properties: { feasibilitySummary: { type: Type.STRING }, monthlyContribution: { type: Type.NUMBER }, steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, category: { type: Type.STRING } } } } } };
            const response = await aiApi.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema } });
            const plan = JSON.parse(response.text ?? '{}');
            if (plan) {
                user.setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, plan } : g));
            }
        } catch (err) {
            console.error("Error generating goal plan:", err);
            ui.showToast("Failed to generate AI plan.", 'error');
        }
    }, [user.financialGoals, user.setFinancialGoals, ui.showToast]);

    const pitchBusinessPlan = useCallback(async (plan: string) => {
      ai.setWeaverState(prev => ({...prev, businessPlan: plan, stage: types.WeaverStage.Analysis}));
      try {
          await new Promise(res => setTimeout(res, 2000));
          const aiApi = new GoogleGenAI({apiKey: process.env.API_KEY as string});
          const responseSchema = { type: Type.OBJECT, properties: { feedback: { type: Type.STRING }, questions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, question: { type: Type.STRING }, category: { type: Type.STRING } } } } } };
          const prompt = `Analyze this business plan and provide concise feedback (2-3 sentences) and 3 insightful questions a venture capitalist would ask. Categorize each question (e.g., 'Market Fit', 'Financials', 'Operations'). Business plan: "${plan}"`;
          const response = await aiApi.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json', responseSchema } });
          const result = JSON.parse(response.text ?? '{}');
          ai.setWeaverState(prev => ({ ...prev, stage: types.WeaverStage.Test, feedback: result.feedback || "The plan is intriguing but lacks detail in key areas.", questions: result.questions || [] }));
      } catch (err) {
          ai.setWeaverState(prev => ({...prev, stage: types.WeaverStage.Error, error: "Failed to analyze business plan."}));
      }
    }, [ai.setWeaverState]);

    const simulateTestPass = useCallback(async () => {
        ai.setWeaverState(prev => ({...prev, stage: types.WeaverStage.FinalReview}));
        try {
            await new Promise(res => setTimeout(res, 2000));
            const aiApi = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const responseSchema = { type: Type.OBJECT, properties: { loanAmount: { type: Type.NUMBER }, coachingPlan: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, summary: { type: Type.STRING }, steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, timeline: { type: Type.STRING } } } } } } } };
            const prompt = `Based on this business plan, determine a seed funding loan amount (between $50,000 and $250,000) and create a 3-step coaching plan for the founder. Plan: "${ai.weaverState.businessPlan}"`;
            const response = await aiApi.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json', responseSchema } });
            const result = JSON.parse(response.text ?? '{}');
            ai.setWeaverState(prev => ({ ...prev, stage: types.WeaverStage.Approved, loanAmount: result.loanAmount || 100000, coachingPlan: result.coachingPlan || null }));
        } catch (err) {
            ai.setWeaverState(prev => ({...prev, stage: types.WeaverStage.Error, error: "Failed to finalize funding plan."}));
        }
    }, [ai.setWeaverState, ai.weaverState.businessPlan]);

    const generateDashboardInsights = useCallback(async () => {
        if (financials.transactions.length === 0 || financials.budgets.length === 0) return;
        ai.setIsInsightsLoading(true);
        try {
            const aiApi = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const txSummary = financials.transactions.slice(0, 5).map(t => `${t.description}: $${t.amount}`).join(', ');
            const budgetSummary = financials.budgets.map(b => `${b.name}: ${Math.round((b.spent/b.limit)*100)}% used`).join(', ');
            const prompt = `Here's a user's financial snapshot. Recent transactions: [${txSummary}]. Budgets: [${budgetSummary}]. Provide 2-3 short, actionable insights for their dashboard. For any insight related to spending, provide sample chart data with name and value.`;
            const responseSchema = { type: Type.OBJECT, properties: { insights: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING }, urgency: { type: Type.STRING, enum: ['low', 'medium', 'high'] }, chartData: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, value: {type: Type.NUMBER} } } } } } } } };
            const response = await aiApi.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json', responseSchema } });
            const result = JSON.parse(response.text ?? '{"insights":[]}');
            ai.setAiInsights(result.insights || []);
        } finally {
            ai.setIsInsightsLoading(false);
        }
    }, [financials.transactions, financials.budgets, ai.setAiInsights, ai.setIsInsightsLoading]);
    
    // Auto-generate insights when data changes
    useEffect(() => {
        generateDashboardInsights();
    }, [generateDashboardInsights]);
    
    // --- Other actions ---
    const addBudget = useCallback((budgetData: Omit<types.BudgetCategory, 'id' | 'spent' | 'color'>) => {
        const newBudget: types.BudgetCategory = { id: budgetData.name.toLowerCase().replace(' ', '-'), ...budgetData, spent: 0, color: `#${Math.floor(Math.random()*16777215).toString(16)}` };
        financials.setBudgets(prev => [...prev, newBudget]);
    }, [financials.setBudgets]);

    const handlePlaidSuccess = useCallback((publicToken: string, metadata: any) => {
        const newAccount: types.LinkedAccount = { id: metadata.accounts[0].id, name: metadata.institution.name, mask: metadata.accounts[0].mask };
        integrations.setLinkedAccounts(prev => [...prev, newAccount]);
    }, [integrations.setLinkedAccounts]);

    const unlinkAccount = useCallback((id: string) => {
        integrations.setLinkedAccounts(prev => prev.filter(acc => acc.id !== id));
    }, [integrations.setLinkedAccounts]);

    const sendCashAppPayment = useCallback((cashtag: string, amount: number) => {
        const newTx: types.Transaction = { id: new Date().toISOString(), type: 'expense', category: 'Transfer', description: `Cash App payment to ${cashtag}`, amount: amount, date: new Date().toLocaleDateString('en-CA'), carbonFootprint: 0.1 };
        addTransaction(newTx);
        ui.showToast(`Sent $${amount} to ${cashtag}`, 'success');
    }, [addTransaction, ui.showToast]);
    
    const mintNFT = useCallback((name: string, imageUrl: string, sourcePostId?: string) => {
        const newNFT: types.NFTAsset = { id: `nft_${Date.now()}`, name, imageUrl, contractAddress: `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`, description: "A unique digital asset from the Demo Bank ecosystem.", sourcePostId };
        web3.setNftAssets(prev => [newNFT, ...prev]);
        ui.showToast(`Successfully minted "${name}" as an NFT!`);
    }, [web3.setNftAssets, ui.showToast]);

    const mintPostAsNFT = useCallback((postId: string) => {
        const post = social.posts.find(p => p.id === postId);
        if (post && !post.nftId) {
            const nftName = post.content.text?.substring(0, 30) || `Post ${postId}`;
            mintNFT(nftName, post.content.imageUrl || '/vite.svg', postId);
            social.setPosts(prev => prev.map(p => p.id === postId ? { ...p, nftId: `nft_${Date.now()}` } : p));
        }
    }, [social.posts, social.setPosts, mintNFT]);

    const likePost = useCallback((postId: string) => {
        social.setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const likedByUser = !p.likedByUser;
                const likes = p.metrics.likes + (likedByUser ? 1 : -1);
                return { ...p, metrics: { ...p.metrics, likes }, likedByUser };
            }
            return p;
        }));
    }, [social.setPosts]);

    const createPost = useCallback((text: string) => {
        const newPost: types.Post = { id: `post_${Date.now()}`, author_id: social.users[0].id, userName: social.users[0].display_name, userProfilePic: social.users[0].profilePictureUrl, created_tick: 101, content: { text }, type: 'text', tags: [], metrics: { likes: 0, comments: 0, shares: 0, reach: 0 }, visibility: 'public', comments: [] };
        social.setPosts(prev => [newPost, ...prev]);
    }, [social.users, social.setPosts]);

    const addComment = useCallback((postId: string, text: string) => {
        const newComment: types.Comment = { id: `c_${Date.now()}`, userId: social.users[0].id, userName: social.users[0].display_name, userProfilePic: social.users[0].profilePictureUrl, text, timestamp: 'Just now' };
        social.setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment], metrics: {...p.metrics, comments: p.metrics.comments + 1} } : p));
    }, [social.users, social.setPosts]);
    
    // 3. Assemble the final context value
    const value: IDataContext = {
        // State
        ...ai, ...corporate, ...financials, ...integrations, ...marketplace, ...security, ...simulation, ...social, ...user, ...web3, ...ui,
        // Actions
        addTransaction, updateGamification, pitchBusinessPlan, simulateTestPass, generateDashboardInsights, generateGoalPlan,
        addBudget, handlePlaidSuccess, unlinkAccount, sendCashAppPayment, mintPostAsNFT, mintNFT, likePost, createPost, addComment,
        addFinancialGoal, contributeToGoal, markNotificationRead, redeemReward,
        // Mocked/Placeholder Actions from old implementation
        isImportingData: false,
        // Will be implemented properly when views are built
        generateBusiness: async (c) => ({ business: social.businesses[0], ceo: social.users[0] }),
        simulateAiPost: async () => {},
        toggleCorporateCardFreeze: (id) => {},
        updateCorporateCard: () => {},
        updateAnomalyStatus: (id, status) => {},
        createCounterparty: () => {},
        addExternalAccountToCounterparty: () => {},
        createVirtualAccountForCounterparty: () => {},
        approvePaymentOrder: (id) => {},
        denyPaymentOrder: (id) => {},
        createPaymentOrder: () => {},
        addInvoice: () => {},
        fetchMarketplaceProducts: async () => {},
        addProductToTransactions: () => {},
        enableBiometricLock: () => {},
        createSynapticVault: () => {},
        advanceTime: () => {},
        connectWallet: () => {},
        issueCard: () => {},
        buyCrypto: () => {},
        mintToken: () => {},
        initiatePayment: () => {},
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};