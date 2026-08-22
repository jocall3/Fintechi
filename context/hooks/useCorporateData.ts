// context/hooks/useCorporateData.ts
import { useState } from 'react';
import { CorporateCard, CorporateTransaction, PaymentOrder, Invoice, ComplianceCase, FinancialAnomaly, Counterparty, ComplianceRule } from '../../types';
import { MOCK_CORPORATE_CARDS, MOCK_CORPORATE_TRANSACTIONS, MOCK_PAYMENT_ORDERS, MOCK_INVOICES, MOCK_COMPLIANCE_CASES, MOCK_ANOMALIES, MOCK_COUNTERPARTIES, MOCK_COMPLIANCE_RULES } from '../../data/mockData';

export const useCorporateData = () => {
    const [corporateCards, setCorporateCards] = useState<CorporateCard[]>(MOCK_CORPORATE_CARDS);
    const [corporateTransactions, setCorporateTransactions] = useState<CorporateTransaction[]>(MOCK_CORPORATE_TRANSACTIONS);
    const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>(MOCK_PAYMENT_ORDERS);
    const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
    const [complianceCases, setComplianceCases] = useState<ComplianceCase[]>(MOCK_COMPLIANCE_CASES);
    const [complianceRules] = useState<ComplianceRule[]>(MOCK_COMPLIANCE_RULES);
    const [financialAnomalies, setFinancialAnomalies] = useState<FinancialAnomaly[]>(MOCK_ANOMALIES);
    const [counterparties, setCounterparties] = useState<Counterparty[]>(MOCK_COUNTERPARTIES);

    return {
        corporateCards, setCorporateCards,
        corporateTransactions, setCorporateTransactions,
        paymentOrders, setPaymentOrders,
        invoices, setInvoices,
        complianceCases, setComplianceCases,
        complianceRules,
        financialAnomalies, setFinancialAnomalies,
        counterparties, setCounterparties,
    };
};