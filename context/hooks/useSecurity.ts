// context/hooks/useSecurity.ts
import { useState } from 'react';
import { BiometricData, LoginAttempt, AIAgent, SynapticVault } from '../../types';
import { MOCK_BIOMETRIC_DATA, MOCK_LOGIN_ATTEMPTS, MOCK_AI_AGENTS, MOCK_SYNAPTIC_VAULTS } from '../../data/mockData';

export const useSecurity = () => {
    const [biometricData, setBiometricData] = useState<BiometricData[]>(MOCK_BIOMETRIC_DATA);
    const [loginAttempts] = useState<LoginAttempt[]>(MOCK_LOGIN_ATTEMPTS);
    const [aiAgents] = useState<AIAgent[]>(MOCK_AI_AGENTS);
    const [synapticVaults, setSynapticVaults] = useState<SynapticVault[]>(MOCK_SYNAPTIC_VAULTS);

    return {
        biometricData, setBiometricData,
        loginAttempts,
        aiAgents,
        synapticVaults, setSynapticVaults,
    };
};