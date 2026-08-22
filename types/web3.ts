// types/web3.ts

export interface WalletInfo {
    address: string;
    balance: number; // ETH for simplicity
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}