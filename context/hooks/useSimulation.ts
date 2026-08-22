// context/hooks/useSimulation.ts
import { useState } from 'react';
import { EcosystemKPIs, SimulationEvent } from '../../types';
import { MOCK_USERS, MOCK_TRANSACTIONS, MOCK_CORPORATE_TRANSACTIONS, MOCK_LENDING_POOL } from '../../data/mockData';

export const useSimulation = () => {
    const [ecosystemKPIs, setEcosystemKPIs] = useState<EcosystemKPIs>({
        currentDate: '2024-07-23',
        totalEcosystemValue: MOCK_USERS.reduce((sum, u) => sum + u.netWorth, 0),
        totalTransactions: MOCK_TRANSACTIONS.length + MOCK_CORPORATE_TRANSACTIONS.length,
        communityPoolCapital: MOCK_LENDING_POOL.totalCapital,
        activeUsers: MOCK_USERS.length,
        gdp: 987654321,
    });
    const [simulationEvents, setSimulationEvents] = useState<SimulationEvent[]>([]);
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);

    return {
        ecosystemKPIs, setEcosystemKPIs,
        simulationEvents, setSimulationEvents,
        isSimulationRunning, setIsSimulationRunning,
    };
};