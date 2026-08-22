// context/hooks/useUserData.ts
import { useState } from 'react';
import { GamificationState, Subscription, CreditScore, UpcomingBill, SavingsGoal, MarketMover, FinancialGoal, RewardPoints, Notification, RewardItem, CreditFactor } from '../../types';
import { MOCK_SUBSCRIPTIONS, MOCK_CREDIT_SCORE, MOCK_UPCOMING_BILLS, MOCK_SAVINGS_GOALS, MOCK_MARKET_MOVERS, MOCK_FINANCIAL_GOALS, MOCK_REWARD_POINTS, MOCK_NOTIFICATIONS, MOCK_REWARD_ITEMS, MOCK_CREDIT_FACTORS } from '../../data/mockData';

export const useUserData = () => {
    const [gamification, setGamification] = useState<GamificationState>({ score: 450, level: 3, levelName: "Savings Specialist", progress: 25, credits: 225 });
    const [subscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
    const [creditScore] = useState<CreditScore>(MOCK_CREDIT_SCORE);
    const [upcomingBills] = useState<UpcomingBill[]>(MOCK_UPCOMING_BILLS);
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(MOCK_SAVINGS_GOALS);
    const [marketMovers] = useState<MarketMover[]>(MOCK_MARKET_MOVERS);
    const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(MOCK_FINANCIAL_GOALS);
    const [rewardPoints, setRewardPoints] = useState<RewardPoints>(MOCK_REWARD_POINTS);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [rewardItems] = useState<RewardItem[]>(MOCK_REWARD_ITEMS);
    const [creditFactors] = useState<CreditFactor[]>(MOCK_CREDIT_FACTORS);

    return {
        gamification, setGamification,
        subscriptions,
        creditScore,
        upcomingBills,
        savingsGoals, setSavingsGoals,
        marketMovers,
        financialGoals, setFinancialGoals,
        rewardPoints, setRewardPoints,
        notifications, setNotifications,
        rewardItems,
        creditFactors,
    };
};