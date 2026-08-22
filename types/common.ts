// types/common.ts

export type IllusionType = 'none' | 'aurora';

export enum View {
    EcosystemHub = 'ecosystem-hub',
    Transactions = 'transactions',
    SendMoney = 'send-money',
    Budgets = 'budgets',
    Investments = 'investments',
    SASPlatforms = 'the-vision',
    AIAdvisor = 'ai-advisor',
    QuantumWeaver = 'quantum-weaver',
    GenesisEngine = 'genesis-engine',
    AIAdStudio = 'ai-ad-studio',
    Crypto = 'crypto',
    Goals = 'goals',
    Marketplace = 'marketplace',
    Security = 'security',
    Personalization = 'personalization',
    CardCustomization = 'card-customization',
    OpenBanking = 'open-banking',
    CorporateDashboard = 'corporate-dashboard',
    APIIntegration = 'api-integration',
    APIConsole = 'api-console',
    Rewards = 'rewards',
    CreditHealth = 'credit-health',
    Settings = 'settings',
    // New Corporate Views
    PaymentOrders = 'payment-orders',
    Counterparties = 'counterparties',
    Invoices = 'invoices',
    Compliance = 'compliance',
    Anomalies = 'anomalies',
    // New God-Mode Views
    ControlCenter = 'control-center',
    AIAgentNetwork = 'ai-agent-network',
    SimulationEngine = 'simulation-engine',
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  carbonFootprint?: number;
}

export interface BudgetCategory {
    id: string;
    name: string;
    limit: number;
    spent: number;
    color: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
    view?: View;
}

export interface ToastNotification {
    id: number;
    message: string;
    type: 'success' | 'error';
}