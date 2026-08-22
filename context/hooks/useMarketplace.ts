// context/hooks/useMarketplace.ts
import { useState } from 'react';
import { MarketplaceProduct } from '../../types';

export const useMarketplace = () => {
    const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>([]);
    const [isMarketplaceLoading, setIsMarketplaceLoading] = useState(false);

    return {
        marketplaceProducts,
        setMarketplaceProducts,
        isMarketplaceLoading,
        setIsMarketplaceLoading,
    };
};