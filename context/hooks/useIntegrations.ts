// context/hooks/useIntegrations.ts
import { useState } from 'react';
import { LinkedAccount, APIStatus } from '../../types';
import { MOCK_API_STATUS } from '../../data/mockData';

export const useIntegrations = () => {
    const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
    const [apiStatus] = useState<APIStatus[]>(MOCK_API_STATUS);

    return {
        linkedAccounts, setLinkedAccounts,
        apiStatus,
    };
};