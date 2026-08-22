import React, { useState, useContext, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EcosystemHubView from './components/EcosystemHubView';
import TransactionsView from './components/TransactionsView';
import SendMoneyView from './components/SendMoneyView';
import InvestmentsView from './components/InvestmentsView';
import AIAdvisorView from './components/AIAdvisorView';
import SecurityView from './components/SecurityView';
import BudgetsView from './components/BudgetsView';
import VoiceControl from './components/VoiceControl';
import QuantumWeaverView from './components/QuantumWeaverView';
import MarketplaceView from './components/MarketplaceView';
import { View } from './types';
import { DataContext } from './context/DataContext';
import CorporateCommandView from './components/CorporateCommandView';
import APIConsoleView from './components/APIConsoleView';
import ControlCenterView from './components/ControlCenterView';
import AIAgentNetworkView from './components/AIAgentNetworkView';
import PaymentOrdersView from './components/PaymentOrdersView';
import CounterpartiesView from './components/CounterpartiesView';
import InvoicesView from './components/InvoicesView';
import SimulationEngineView from './components/SimulationEngineView';
import GoalsView from './components/GoalsView';
import GenesisEngineView from './components/GenesisEngineView';
import ComplianceView from './components/ComplianceView';
import AnomaliesView from './components/AnomaliesView';
import TheVisionView from './components/TheVisionView';
import APIIntegrationView from './components/APIIntegrationView';
import OpenBankingView from './components/OpenBankingView';
import RewardsView from './components/RewardsView';
import CreditHealthView from './components/CreditHealthView';
import SettingsView from './components/SettingsView';
import PersonalizationView from './components/PersonalizationView';
import CardCustomizationView from './components/CardCustomizationView';
import AIAdStudioView from './components/AIAdStudioView';
import CryptoView from './components/CryptoView';

// The main component that orchestrates the entire UI.
export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.EcosystemHub);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // FIX: Added state to track the previous view for contextual AI conversations.
  const [previousView, setPreviousView] = useState<View | null>(null);
  
  const { toastNotifications, customBackgroundUrl, activeIllusion } = useContext(DataContext)!;

  const handleSetView = (view: View) => {
    setPreviousView(activeView);
    setActiveView(view);
  }
  
  const renderView = () => {
    switch (activeView) {
      case View.EcosystemHub: return <EcosystemHubView />;
      case View.Transactions: return <TransactionsView />;
      case View.SendMoney: return <SendMoneyView setActiveView={handleSetView} />;
      case View.Budgets: return <BudgetsView />;
      case View.Investments: return <InvestmentsView />;
      case View.SASPlatforms: return <TheVisionView />;
      case View.AIAdvisor: return <AIAdvisorView previousView={previousView} />;
      case View.QuantumWeaver: return <QuantumWeaverView />;
      case View.GenesisEngine: return <GenesisEngineView />;
      case View.AIAdStudio: return <AIAdStudioView />;
      case View.Crypto: return <CryptoView />;
      case View.Goals: return <GoalsView />;
      case View.Marketplace: return <MarketplaceView />;
      case View.Personalization: return <PersonalizationView />;
      case View.CardCustomization: return <CardCustomizationView />;
      case View.Security: return <SecurityView />;
      case View.OpenBanking: return <OpenBankingView />;
      case View.CorporateDashboard: return <CorporateCommandView setActiveView={handleSetView} />;
      case View.APIIntegration: return <APIIntegrationView />;
      case View.APIConsole: return <APIConsoleView />;
      case View.Rewards: return <RewardsView />;
      case View.CreditHealth: return <CreditHealthView />;
      case View.Settings: return <SettingsView />;
      case View.PaymentOrders: return <PaymentOrdersView />;
      case View.Counterparties: return <CounterpartiesView />;
      case View.Invoices: return <InvoicesView />;
      case View.Compliance: return <ComplianceView />;
      case View.Anomalies: return <AnomaliesView />;
      case View.ControlCenter: return <ControlCenterView />;
      case View.AIAgentNetwork: return <AIAgentNetworkView />;
      case View.SimulationEngine: return <SimulationEngineView />;
      default: return <EcosystemHubView />;
    }
  };
  
  // A simple dismiss handler for toasts.
  const dismissToast = (id: number) => {
      // In a real app this would update state in DataContext.
      console.log(`Dismissing toast ${id}`);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans transition-colors duration-500 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ 
          backgroundImage: customBackgroundUrl ? `url(${customBackgroundUrl})` : 'none',
          opacity: customBackgroundUrl ? 0.3 : 0
        }}
      ></div>
      {activeIllusion === 'aurora' && (
        <div className="aurora-container fixed inset-0 overflow-hidden opacity-40">
            <div className="aurora aurora-1"></div>
            <div className="aurora aurora-2"></div>
            <div className="aurora aurora-3"></div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-black"></div>

      <div className="flex h-screen relative z-10">
        <Sidebar activeView={activeView} setActiveView={handleSetView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(true)} setActiveView={handleSetView} />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {renderView()}
          </main>
        </div>
      </div>
      <VoiceControl setActiveView={handleSetView} />
    </div>
  );
};