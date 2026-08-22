// types/integrations.ts
import React from 'react';

export interface LinkedAccount {
  id: string;
  name: string;
  mask: string;
}

export interface AppIntegration {
    id: string;
    name: string;
    logo: React.FC<{className?: string}>;
    status: 'connected' | 'issue' | 'disconnected';
}

// Marqeta API Simulation Types
export interface MarqetaUser {
    token: string;
    first_name: string;
    last_name: string;
    email: string;
    active: boolean;
    created_time: string;
    last_modified_time: string;
}

export interface MarqetaCardProduct {
    token: string;
    name: string;
    active: boolean;
    start_date: string;
}

export interface MarqetaCard {
    token: string;
    user_token: string;
    card_product_token: string;
    last_four: string;
    pan: string;
    expiration: string; // MMYY
    state: 'ACTIVE' | 'SUSPENDED';
    created_time: string;
}

export interface MarqetaTransaction {
    token: string;
    state: 'PENDING' | 'CLEARED' | 'DECLINED';
    amount: number;
    card_token: string;
    user_token: string;
    merchant: {
        name: string;
        category_code: string;
    };
    created_time: string;
}