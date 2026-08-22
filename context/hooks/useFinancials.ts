// context/hooks/useFinancials.ts
import { useState } from 'react';
import { Transaction, Asset, BudgetCategory } from '../../types';
import { MOCK_TRANSACTIONS, MOCK_ASSETS, MOCK_IMPACT_INVESTMENTS, MOCK_BUDGETS } from '../../data/mockData';

export const useFinancials = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [assets] = useState<Asset[]>(MOCK_ASSETS);
    const [impactInvestments] = useState<Asset[]>(MOCK_IMPACT_INVESTMENTS);
    const [budgets, setBudgets] = useState<BudgetCategory[]>(MOCK_BUDGETS);
    const [treesPlanted, setTreesPlanted] = useState<number>(12);
    const [spendingForNextTree, setSpendingForNextTree] = useState<number>(170);

    return {
        transactions, setTransactions,
        assets,
        impactInvestments,
        budgets, setBudgets,
        treesPlanted, setTreesPlanted,
        spendingForNextTree, setSpendingForNextTree,
    };
};