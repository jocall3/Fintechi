// types/financial.ts
import { AIGoalPlan } from './ai';

export interface Asset {
  name: string;
  value: number;
  color: string;
  esgRating?: number;
  description?: string;
  performanceYTD?: number;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress: string;
  description?: string;
  sourcePostId?: string;
}

export interface MarketMover {
    ticker: string;
    name: string;
    change: number;
    price: number;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface CreditFactor {
    name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix';
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    description: string;
}

export interface SavingsGoal {
  id:string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface FinancialGoal {
    id: string;
    name: string;
    targetAmount: number;
    targetDate: string;
    currentAmount: number;
    iconName: string;
    plan: AIGoalPlan | null;
}

export interface GamificationState {
    score: number;
    level: number;
    levelName: string;
    progress: number;
    credits: number;
}

export interface RewardPoints {
    balance: number;
    lastEarned: number;
    lastRedeemed: number;
    currency: string;
}

export interface RewardItem {
    id: string;
    name: string;
    cost: number;
    type: 'cashback' | 'giftcard' | 'impact';
    description: string;
    iconName: string;
}

export interface LendingPoolStats {
  totalCapital: number;
  interestRate: number;
  activeLoans: number;
  defaultRate: number;
  totalInterestEarned: number;
}

export interface CommunityLoan {
  id: string;
  lenderId: string;
  borrowerId: string;
  amount: number;
  interestRate: number;
  status: 'active' | 'repaid' | 'defaulted';
  requestDate: string;
  repaymentDate?: string;
}