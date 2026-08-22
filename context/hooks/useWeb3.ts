// context/hooks/useWeb3.ts
import { useState } from 'react';
import { CryptoAsset, NFTAsset, PaymentOperation, VirtualCard, WalletInfo } from '../../types';
import { MOCK_CRYPTO_ASSETS, MOCK_PAYMENT_OPERATIONS } from '../../data/mockData';

export const useWeb3 = () => {
    const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(MOCK_CRYPTO_ASSETS);
    const [paymentOperations, setPaymentOperations] = useState<PaymentOperation[]>(MOCK_PAYMENT_OPERATIONS);
    const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
    const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);
    const [nftAssets, setNftAssets] = useState<NFTAsset[]>([]);

    return {
        cryptoAssets, setCryptoAssets,
        paymentOperations, setPaymentOperations,
        walletInfo, setWalletInfo,
        virtualCard, setVirtualCard,
        nftAssets, setNftAssets,
    };
};