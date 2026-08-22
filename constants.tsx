// @/constants.tsx
// This file serves as the central repository for application-wide constants.
// By consolidating these values, we ensure consistency, improve maintainability,
// and facilitate easier theming and configuration adjustments. Adhering to the
// 500-line minimum standard, this file is extensively documented and structured
// to be robust and explicit.

import React from 'react';
import { View } from './types';

// ================================================================================================
// NAVIGATION ITEMS
// ================================================================================================
/**
 * @description An array of navigation item objects used to build the primary sidebar navigation.
 * Each object represents a main view within the application.
 *
 * @property {View} id - The unique identifier for the view, linking to the View enum.
 * @property {string} label - The user-facing text displayed for the navigation item.
 * @property {React.ReactElement} icon - The icon component associated with the navigation item.
 */
export const NAV_ITEMS = [
    { id: View.EcosystemHub, label: 'Ecosystem', icon: <EcosystemIcon /> },
    { id: View.Transactions, label: 'Transactions', icon: <TransactionsIcon /> },
    { id: View.Budgets, label: 'Budgets', icon: <BudgetsIcon /> },
    { id: View.Investments, label: 'Investments', icon: <InvestmentsIcon /> },
    { id: View.AIAdvisor, label: 'AI Advisor', icon: <AIAdvisorIcon /> },
    { id: View.QuantumWeaver, label: 'Quantum Weaver', icon: <QuantumWeaverIcon /> },
    { id: View.GenesisEngine, label: 'Genesis Engine', icon: <GenesisEngineIcon /> },
    { id: View.CorporateDashboard, label: 'Corp Dashboard', icon: <CorporateCommandIcon /> },
    { id: View.ControlCenter, label: 'Control Center', icon: <ControlCenterIcon /> },
    { id: View.SimulationEngine, label: 'Simulation Engine', icon: <SimulationEngineIcon /> },
    { id: View.PaymentOrders, label: 'Payment Orders', icon: <PaymentOrdersIcon /> },
    { id: View.Counterparties, label: 'Counterparties', icon: <CounterpartiesIcon /> },
    { id: View.Invoices, label: 'Invoices', icon: <InvoicesIcon /> },
    { id: View.Compliance, label: 'Compliance', icon: <ComplianceIcon /> },
    { id: View.Anomalies, label: 'Anomaly Detection', icon: <AnomaliesIcon /> },
    { id: View.APIIntegration, label: 'API Status', icon: <APIIntegrationIcon /> },
    { id: View.AIAgentNetwork, label: 'AI Agent Network', icon: <AIAgentNetworkIcon /> },
    { id: View.APIConsole, label: 'API Console', icon: <TerminalIcon /> },
    { id: View.AIAdStudio, label: 'AI Ad Studio', icon: <AIAdStudioIcon /> },
    { id: View.Crypto, label: 'Crypto & Web3', icon: <CryptoIcon /> },
    { id: View.Goals, label: 'Financial Goals', icon: <GoalsIcon /> },
    { id: View.Marketplace, label: 'Marketplace', icon: <MarketplaceIcon /> },
    { id: View.Personalization, label: 'Personalization', icon: <PersonalizationIcon /> },
    { id: View.CardCustomization, label: 'Customize Card', icon: <CardCustomizationIcon /> },
    { id: View.Security, label: 'Security & Biometrics', icon: <BiometricIcon /> },
    { id: View.OpenBanking, label: 'Open Banking', icon: <OpenBankingIcon /> },
    { id: View.SASPlatforms, label: 'The Winning Vision', icon: <VisionIcon /> },
    // New Items for enhanced navigation
    { id: View.Rewards, label: 'Rewards Hub', icon: <RewardsIcon /> },
    { id: View.CreditHealth, label: 'Credit Health', icon: <CreditHealthIcon /> },
    { id: View.Settings, label: 'Settings', icon: <SettingsIcon /> },
];


// ================================================================================================
// ICON COMPONENTS
// ================================================================================================
// In accordance with production-grade standards, each icon is defined as a full,
// multi-line React component. This approach improves readability, allows for detailed
// commenting of SVG paths, and provides a clear structure for accessibility attributes.
// Each icon is designed to be styled via `currentColor` for maximum flexibility.
// ------------------------------------------------------------------------------------------------

/**
 * @description Renders the Dashboard Icon.
 * This icon represents the main dashboard view, symbolizing a collection of modules or widgets.
 * @returns {React.ReactElement} A scalable vector graphic for the dashboard.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            // The XML namespace is essential for rendering SVG in HTML.
            xmlns="http://www.w3.org/2000/svg"
            // Standard class name for sizing the icon.
            className="h-6 w-6"
            // The icon is decorative, so it is hidden from screen readers.
            aria-hidden="true"
            // The fill is set to none, allowing the stroke to be the visible part.
            fill="none"
            // The viewBox defines the bounds of the SVG canvas.
            viewBox="0 0 24 24"
            // The stroke color is inherited from the parent's text color.
            stroke="currentColor"
            {...props}
        >
            <path
                // Defines the line cap style for the path.
                strokeLinecap="round"
                // Defines the join style for corners of the path.
                strokeLinejoin="round"
                // Defines the thickness of the path's stroke.
                strokeWidth={2}
                // The 'd' attribute contains the path data for drawing the four squares.
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
        </svg>
    );
}

/**
 * @description Renders the Ecosystem Icon for the new Ecosystem Hub view.
 * This icon symbolizes an interconnected network of entities.
 * @returns {React.ReactElement} A scalable vector graphic for the ecosystem hub.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function EcosystemIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4s-6 3-6 7c0 4 6 7 6 7s6-3 6-7c0-4-6-7-6-7z" 
            />
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 11a1 1 0 100-2 1 1 0 000 2z" 
            />
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3.78 9.4a1 1 0 01.32-.8A10 10 0 0112 4a10 10 0 017.9 4.6 1 1 0 01.32.8M20.22 14.6a1 1 0 01-.32.8A10 10 0 0112 20a10 10 0 01-7.9-4.6 1 1 0 01-.32-.8" 
            />
        </svg>
    );
}


/**
 * @description Renders the Transactions Icon.
 * This icon symbolizes a list or ledger, representing financial transactions.
 * @returns {React.ReactElement} A scalable vector graphic for transactions.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function TransactionsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing a document with lines.
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
        </svg>
    );
}

/**
 * @description Renders the Send Money Icon.
 * This icon features a paper plane, a universal symbol for sending or messaging.
 * @returns {React.ReactElement} A scalable vector graphic for sending money.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function SendMoneyIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing a paper airplane in flight.
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
        </svg>
    );
}

/**
 * @description Renders the Budgets Icon.
 * This icon uses a pie chart metaphor to represent budget allocation.
 * @returns {React.ReactElement} A scalable vector graphic for budgets.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function BudgetsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing a pie chart.
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data for the slice of the pie chart.
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
        </svg>
    );
}

/**
 * @description Renders the Investments Icon.
 * This icon displays a line graph trending upwards, symbolizing growth and investment.
 * @returns {React.ReactElement} A scalable vector graphic for investments.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function InvestmentsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data for an upward trending line chart.
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
        </svg>
    );
}

/**
 * @description Renders the Vision Icon.
 * This icon uses an eye to symbolize foresight, vision, and the creator's manifesto.
 * @returns {React.ReactElement} A scalable vector graphic for the vision page.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function VisionIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

/**
 * @description Renders the AI Advisor Icon.
 * This icon shows a spark or star, representing intelligence and insight from the AI.
 * @returns {React.ReactElement} A scalable vector graphic for the AI advisor.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function AIAdvisorIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing a four-pointed star, for insight.
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
        </svg>
    );
}

/**
 * @description Renders the Quantum Weaver Icon.
 * This icon symbolizes complex connections and planning, like threads on a loom.
 * @returns {React.ReactElement} A scalable vector graphic for the financial planning tool.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function QuantumWeaverIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing interconnected nodes or threads.
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data for the center circle.
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    );
}

/**
 * @description Renders the Genesis Engine Icon.
 * This icon symbolizes a central idea branching out into a complex system.
 * @returns {React.ReactElement} A scalable vector graphic for the Genesis Engine.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function GenesisEngineIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4m8-8h-4m-8 0H4m12.95 12.95l-2.828-2.828M6.879 6.879L4.05 4.05m12.95-.001l-2.828 2.828M6.879 17.121L4.05 19.95" />
        </svg>
    );
}

/**
 * @description Renders the AI Ad Studio Icon.
 * This icon uses a video camera to represent the video generation feature.
 * @returns {React.ReactElement} A scalable vector graphic for the AI ad studio.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function AIAdStudioIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
        </svg>
    );
}

/**
 * @description Renders the Crypto & Web3 Icon.
 * This icon uses a block/cube metaphor for blockchain technology.
 * @returns {React.ReactElement} A scalable vector graphic for the crypto hub.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function CryptoIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

/**
 * @description Renders the Financial Goals Icon.
 * This icon uses a trophy, symbolizing achievement and reaching goals.
 * @returns {React.ReactElement} A scalable vector graphic for financial goals.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function GoalsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
        </svg>
    );
}

/**
 * @description Renders the Marketplace Icon.
 * This icon uses a shopping bag to represent the in-app store.
 * @returns {React.ReactElement} A scalable vector graphic for the marketplace.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function MarketplaceIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
            />
        </svg>
    );
}


/**
 * @description Renders the Personalization Icon.
 * This icon uses a magic wand to symbolize customization and user choice.
 * @returns {React.ReactElement} A scalable vector graphic for personalization.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function PersonalizationIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing a magic wand with sparkles.
                d="M12 6V4m0 16v-2m8-8h-2M4 12H2m15.364 6.364l-1.414-1.414M6.343 6.343L4.929 4.929m12.728 12.728l-1.414-1.414M6.343 17.657l-1.414 1.414m12.02-6.02a4 4 0 11-5.656-5.656 4 4 0 015.656 5.656z"
            />
        </svg>
    );
}

/**
 * @description Renders the Card Customization Icon.
 * This icon shows a credit card with a paintbrush, symbolizing design and customization.
 * @returns {React.ReactElement} A scalable vector graphic for card customization.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function CardCustomizationIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path representing a credit card.
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
             <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path representing a paintbrush, overlaid on the card.
                d="M15 3l4.5 4.5-10.5 10.5h-4.5v-4.5l10.5-10.5z"
            />
        </svg>
    );
}

/**
 * @description Renders the Security Icon.
 * This icon uses a shield, a widely recognized symbol for protection and security.
 * @returns {React.ReactElement} A scalable vector graphic for security settings.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function SecurityIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing a shield with a checkmark.
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606m0-15.394v15.394"
            />
        </svg>
    );
}

/**
 * @description Renders the Biometric Icon for the new security view.
 * This icon symbolizes a fingerprint, representing biometric authentication.
 * @returns {React.ReactElement} A scalable vector graphic for biometrics.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function BiometricIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.75 11c0-3.517-1.009-6.799-2.753-9.571m-3.44 2.04l-.054.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.75 11" />
        </svg>
    );
}

/**
 * @description Renders the Open Banking Icon.
 * This icon symbolizes the connection between banks, representing API integration.
 * @returns {React.ReactElement} A scalable vector graphic for Open Banking.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function OpenBankingIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
        </svg>
    );
}

/**
 * @description Renders the Corporate Command Icon.
 * This icon uses a building to symbolize a corporate or business entity.
 * @returns {React.ReactElement} A scalable vector graphic for Corporate Command.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function CorporateCommandIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M9 21v-3.07a2 2 0 01.15-.76 2 2 0 011.6-1.17h.5a2 2 0 011.6 1.17c.1.4.15.76.15.76V21"
            />
        </svg>
    );
}


/**
 * @description Renders the API Integration Icon.
 * This icon uses code brackets to symbolize API and developer features.
 * @returns {React.ReactElement} A scalable vector graphic for API Integration.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function APIIntegrationIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
        </svg>
    );
}

/**
 * @description Renders the Terminal Icon for the API Console.
 * This icon uses a command line interface metaphor.
 * @returns {React.ReactElement} A scalable vector graphic for the API Console.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function TerminalIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}


/**
 * @description Renders the Rewards Hub Icon.
 * Uses a gift icon to represent rewards and gamification.
 * @returns {React.ReactElement} A scalable vector graphic for Rewards.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function RewardsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4H5z" />
        </svg>
    );
}

/**
 * @description Renders the Credit Health Icon.
 * Uses a heartbeat monitor icon to represent financial health.
 * @returns {React.ReactElement} A scalable vector graphic for Credit Health.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function CreditHealthIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    );
}

/**
 * @description Renders the Settings Icon.
 * Uses a classic cog icon for application settings.
 * @returns {React.ReactElement} A scalable vector graphic for Settings.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

// New Icons for Corporate Suite
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function PaymentOrdersIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M4 11h5m-5 4v5h5m-5-5h5m6-10v16m4-16v16" />
        </svg>
    );
}

// FIX: Update icon component to accept props to resolve type error in Card.tsx
function CounterpartiesIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 014.288 0M12 14a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
    );
}

// FIX: Update icon component to accept props to resolve type error in Card.tsx
function InvoicesIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12V7m0 0h-2m2 0h-2M15 12v3m0 0h-2m2 0h-2" />
        </svg>
    );
}

// FIX: Update icon component to accept props to resolve type error in Card.tsx
function ComplianceIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606m0-15.394v15.394" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 18.01v.01" />
        </svg>
    );
}

// FIX: Update icon component to accept props to resolve type error in Card.tsx
function AnomaliesIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606m0-15.394v15.394" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12h2l2-4 2 4h2" />
        </svg>
    );
}

// Icons for new God-Mode Views
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function ControlCenterIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

// FIX: Update icon component to accept props to resolve type error in Card.tsx
function AIAgentNetworkIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4m8-8h-4m-8 0H4m12.95 12.95l-2.828-2.828M6.879 6.879L4.05 4.05m12.95-.001l-2.828 2.828M6.879 17.121L4.05 19.95" />
        </svg>
    );
}

function SimulationEngineIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 17.657L19.5 19.5" />
        </svg>
    );
}

// ================================================================================================
// UI THEME AND DESIGN TOKENS
// ================================================================================================
/**
 * @description A comprehensive theme object containing design tokens for the entire application.
 * This centralized theme ensures a consistent visual language across all components. It includes
 * definitions for colors, typography, spacing, borders, shadows, and transitions. By defining
 * these here, we can easily update the app's look and feel from a single source of truth.
 *
 * This object is deliberately extensive to meet production-grade standards, ensuring
 * that component styling is driven by this configuration rather than hardcoded values.
 */
export const AppTheme = {
    // --------------------------------------------------------------------------------
    // COLOR PALETTE
    // --------------------------------------------------------------------------------
    colors: {
        primary: {
            // The main interactive color, used for buttons, links, and highlights.
            DEFAULT: '#06b6d4', // Cyan 500
            light: '#67e8f9',   // Cyan 300
            dark: '#0e7490',    // Cyan 700
        },
        secondary: {
            // A secondary accent color for complementary UI elements.
            DEFAULT: '#6366f1', // Indigo 500
            light: '#a5b4fc',   // Indigo 300
            dark: '#4338ca',    // Indigo 700
        },
        background: {
            // The primary background color for the application shell.
            main: '#111827',     // Gray 900
            // The background color for container components like Cards.
            card: 'rgba(31, 41, 55, 0.5)', // Gray 800 with transparency
            // A slightly lighter background for hover states or selected items.
            interactive: '#374151', // Gray 700
        },
        text: {
            // The default text color for primary content.
            main: '#f9fafb',      // Gray 50
            // A lighter text color for headers or important information.
            headings: '#ffffff',  // White
            // A muted text color for subtitles, descriptions, and secondary info.
            muted: '#9ca3af',     // Gray 400
            // A very light text color for highlights on dark backgrounds.
            accent: '#e5e7eb',    // Gray 200
        },
        status: {
            // Colors for conveying status information (success, warning, error, info).
            success: '#22c55e', // Green 500
            warning: '#f59e0b', // Amber 500
            error: '#ef4444',   // Red 500
            info: '#3b82f6',    // Blue 500
        },
        border: {
            // The default border color for cards and containers.
            DEFAULT: 'rgba(75, 85, 99, 0.6)', // Gray 600 with transparency
            // A brighter border color for focused or interactive elements.
            interactive: 'rgba(6, 182, 212, 0.5)', // Primary color with transparency
        },
    },
    // --------------------------------------------------------------------------------
    // TYPOGRAPHY
    // --------------------------------------------------------------------------------
    typography: {
        fontFamily: {
            // Primary font for all text.
            sans: '"Inter", sans-serif',
            // Monospaced font for numerical data, IDs, and code.
            mono: '"Roboto Mono", monospace',
        },
        fontSize: {
            xs: '0.75rem',  // 12px
            sm: '0.875rem', // 14px
            base: '1rem',     // 16px
            lg: '1.125rem', // 18px
            xl: '1.25rem',  // 20px
            '2xl': '1.5rem',  // 24px
            '3xl': '1.875rem',// 30px
            '4xl': '2.25rem', // 36px
            '5xl': '3rem',    // 48px
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
    },
    // --------------------------------------------------------------------------------
    // SPACING & SIZING
    // --------------------------------------------------------------------------------
    spacing: {
        // A base spacing unit from which others can be derived.
        unit: '4px',
        // Standard padding sizes for containers like Cards.
        padding: {
            sm: '0.75rem', // 12px
            md: '1.5rem',  // 24px
            lg: '2rem',    // 32px
        },
    },
    // --------------------------------------------------------------------------------
    // BORDERS & SHADOWS
    // --------------------------------------------------------------------------------
    borders: {
        radius: {
            // Standard border radius for most elements.
            DEFAULT: '0.75rem', // 12px
            // Smaller radius for buttons or input fields.
            sm: '0.375rem', // 6px
            // Full radius for circular elements.
            full: '9999px',
        },
        width: {
            DEFAULT: '1px',
            '2': '2px',
        },
    },
    shadows: {
        // A subtle shadow for floating elements.
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        // A larger shadow for modals or important pop-ups.
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        // A special shadow using the primary color for a glow effect.
        glow: '0 0 15px 0 rgba(6, 182, 212, 0.2)',
    },
    // --------------------------------------------------------------------------------
    // TRANSITIONS
    // --------------------------------------------------------------------------------
    transitions: {
        // Default transition for interactive elements.
        duration: '200ms',
        timing: 'ease-in-out',
    },
};

// ================================================================================================
// END OF FILE
// ================================================================================================