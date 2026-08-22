// types/corporate.ts

export type PaymentOperationStatus = 'Initiated' | 'Processing' | 'Completed' | 'Failed';

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: PaymentOperationStatus;
  type: 'ACH' | 'Wire' | 'Crypto';
  date: string;
}

export interface CorporateCardControls {
    atm: boolean;
    contactless: boolean;
    online: boolean;
    monthlyLimit: number;
}

export interface CorporateCard {
    id: string;
    holderName: string;
    cardNumberMask: string;
    status: 'Active' | 'Suspended' | 'Lost';
    frozen: boolean;
    controls: CorporateCardControls;
    biometricLockEnabled?: boolean;
}

export interface CorporateTransaction {
    id: string;
    cardId: string;
    holderName: string;
    merchant: string;
    amount: number;
    status: 'Pending' | 'Approved';
    timestamp: string;
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini';

export interface APIStatus {
    provider: APIProvider;
    status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
    responseTime: number; // in ms
}

export interface ExternalAccount {
  id: string;
  bankName: string;
  mask: string;
  balance: number;
  type: 'checking' | 'savings';
}

export interface VirtualAccount {
    id: string;
    accountName: string;
    balance: number;
    routingNumber: string;
    accountNumber: string;
}

export interface Counterparty {
    id: string;
    name: string;
    type: 'individual' | 'business';
    riskLevel: 'Low' | 'Medium' | 'High';
    createdDate: string;
    businessId?: string;
    accounts: ExternalAccount[];
    virtualAccounts?: VirtualAccount[];
}

export type PaymentOrderStatus = 'needs_approval' | 'approved' | 'processing' | 'completed' | 'denied' | 'returned';

export interface PaymentOrder {
    id: string;
    counterpartyId: string;
    counterpartyName: string;
    accountId: string;
    amount: number;
    currency: 'USD';
    direction: 'credit' | 'debit';
    status: PaymentOrderStatus;
    date: string;
    type: 'ACH' | 'Wire' | 'RTP';
}

export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue' | 'voided';

export interface Invoice {
    id: string;
    invoiceNumber: string;
    counterpartyName: string;
    dueDate: string;
    amount: number;
    status: InvoiceStatus;
}

export interface ComplianceRule {
    id: string;
    name: string;
    description: string;
    action: 'flag_for_review' | 'block';
    active: boolean;
}

export interface ComplianceCase {
    id: string;
    reason: string;
    entityType: 'PaymentOrder' | 'Counterparty';
    entityId: string;
    status: 'open' | 'closed';
    openedDate: string;
}

export type AnomalySeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AnomalyStatus = 'New' | 'Under Review' | 'Dismissed' | 'Resolved';
export type AnomalyEntityType = 'PaymentOrder' | 'Transaction' | 'Counterparty' | 'CorporateCard';

export interface FinancialAnomaly {
    id: string;
    description: string;
    details: string; // AI-generated explanation of why it's an anomaly
    severity: AnomalySeverity;
    status: AnomalyStatus;
    entityType: AnomalyEntityType;
    entityId: string;
    entityDescription: string;
    timestamp: string;
    riskScore: number; // 0-100
}