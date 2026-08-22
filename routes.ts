import { RouteProps } from "react-router";
import PaymentOrderView from "../containers/payment_order_details/PaymentOrderView";
import TransactionsHome from "../containers/TransactionsHome";
import TransactionView from "../containers/TransactionView";
import TransactionLineItemView from "../containers/TransactionLineItemView";
import ReturnView from "../containers/ReturnView";
import CounterpartyView from "../containers/CounterpartyView";
import CounterpartyFormContainer from "../containers/CounterpartyFormContainer";
import CounterpartyBulkImport from "../components/CounterpartyBulkImport";
import RuleFormContainer from "../containers/RuleFormContainer";
import EditRuleView from "../containers/EditRuleView";
import CreateCustomInternalAccount from "../containers/CreateCustomInternalAccount";
import NewRuleForm from "../containers/approvals/NewRuleForm";
import RuleView from "../containers/RuleView";
import DebugInteractionForm from "../containers/debug_interactions/DebugInteractionForm";
import ExternalAccountView from "../containers/ExternalAccountView";
import ExportDetailsView from "../containers/ExportDetailsView";
import RoutingNumbersView from "../containers/RoutingNumbersView";
import AdminFileTransfersHome from "../containers/AdminFileTransfersHome";
import BillingHome from "../containers/BillingHome";
import AdminFileTransferView from "../containers/AdminFileTransferView";
import FileTransferView from "../containers/FileTransferView";
import ApprovalsHome from "../containers/approvals/ApprovalsHome";
import UsersHome from "../containers/UsersHome";
import UserInvitationView from "../containers/UserInvitationView";
import UserForm from "../containers/Settings/Users/UserForm";
import UserView from "../containers/Settings/Users/UserView";
import GroupsHome from "../containers/groups/GroupsHome";
import GroupForm from "../containers/groups/GroupForm";
import GroupView from "../containers/groups/GroupView";
import OrganizationView from "../containers/OrganizationView";
import OrganizationForm from "../components/OrganizationForm";
import OrganizationDetailView from "../containers/OrganizationDetailView";
import SuperAdminHome from "../containers/SuperAdminHome";
import ExpectedPaymentEditView from "../containers/ExpectedPaymentEditView";
import ExpectedPaymentView from "../containers/ExpectedPaymentView";
import ExpectedPaymentBulkImport from "../components/ExpectedPaymentBulkImport";
import PaperItemView from "../containers/PaperItemView";
import PaymentOrderBulkImport from "../components/PaymentOrderBulkImport";
import InvoiceBulkImport from "../components/InvoiceBulkImport";
import AccountingHome from "../containers/Settings/Integrations/AccountingHome";
import AccountingNetSuiteAuthView from "../containers/AccountingNetSuiteAuthView";
import ProposedChangeView from "../containers/ProposedChangeView";
import AccountingSetupView from "../containers/AccountingSetupView";
import AccountingAccountsView from "../containers/AccountingAccountsView";
import AccountingCounterpartyView from "../containers/AccountingCounterpartyView";
import AccountingSyncView from "../containers/AccountingSyncView";
import AccountingManageView from "../containers/AccountingManageView";
import ExternalEventsHome from "../containers/ExternalEventsHome";
import ExternalEventView from "../containers/ExternalEventView";
import LedgersHome from "../containers/LedgersHome";
import LedgerView from "../containers/LedgerView";
import LedgerFormContainer from "../containers/ledger_form/LedgerFormContainer";
import LedgerTransactionFormContainer from "../containers/ledger_transaction_form/LedgerTransactionFormContainer";
import ReverseLedgerTransactionFormContainer from "../containers/ledger_transaction_form/ReverseLedgerTransactionFormContainer";
import CreateLedgerAccountSettlementForm from "../containers/ledger_account_settlement_form/CreateLedgerAccountSettlementForm";
import LedgerableEventView from "../containers/LedgerableEventView";
import LedgerAccountFormContainer from "../containers/ledger_account_form/LedgerAccountFormContainer";
import LedgerAccountCategoryFormContainer from "../containers/ledger_account_category_form/LedgerAccountCategoryFormContainer";
import LedgerTransactionView from "../containers/LedgerTransactionView";
import LedgerAccountSettlementView from "../containers/LedgerAccountSettlementView";
import LedgerTransactionVersionView from "../containers/LedgerTransactionVersionView";
import LedgerAccountView from "../containers/LedgerAccountView";
import LedgerAccountCategoryView from "../containers/LedgerAccountCategoryView";
import LedgerEntryView from "../containers/LedgerEntryView";
import ProfileHome from "../containers/ProfileHome";
import ReportsHome from "../containers/ReportsHome";
import ReportsView from "../containers/ReportsView";
import ReversalView from "../containers/ReversalView";
import VendorsView from "../containers/VendorsView";
import VirtualAccountsHome from "../containers/VirtualAccountsHome";
import VirtualAccountView from "../containers/VirtualAccountView";
import AuditTrailHome from "../containers/AuditTrailHome";
import AuditRecordView from "../containers/AuditRecordView";
import IncomingPaymentDetailsView from "../containers/IncomingPaymentDetailsView";
import BulkImportsHome from "../containers/BulkImportsHome";
import BulkImportView from "../containers/BulkImportView";
import PaymentOrderFormContainer from "../containers/payment_order_form/PaymentOrderFormContainer";
import CaseView from "../containers/compliance/CaseView";
import FlowsHome from "../containers/compliance/FlowsHome";
import FlowView from "../containers/compliance/FlowView";
import NewFlowView from "../containers/compliance/NewFlowView";
import EditFlowView from "../containers/compliance/EditFlowView";
import EndpointView from "../containers/EndpointView";
import DecisionView from "../containers/compliance/DecisionView";
import PartnerForm from "../containers/PartnerForm";
import NewSandboxAccountFormContainer from "../containers/sandbox_account_form/NewSandboxAccountFormContainer";
import { BillingView, PlaidSettingsView } from "../containers/Settings";
import PushToWarehouseHome from "../containers/Settings/Integrations/push_to_warehouse/PushToWarehouseHome";
import DestinationView from "../containers/Settings/Integrations/push_to_warehouse/DestinationView";
import TransferView from "../containers/Settings/Integrations/push_to_warehouse/TransferView";
import PartnerSearchDetailView from "../containers/PartnerSearchDetailView";
import PaymentsGettingStarted from "../containers/getting_started/PaymentsGettingStarted";
import ComplianceGettingStarted from "../containers/getting_started/ComplianceGettingStarted";
import VirtualAccountsGettingStarted from "../containers/getting_started/VirtualAccountsGettingStarted";
import LedgersGettingStarted from "../containers/getting_started/LedgersGettingStarted";
import PaymentsOverview from "../containers/PaymentsOverview";
import UserManagementOverview from "../containers/user_management/UserManagementOverview";
import RoleView from "../containers/user_management/RoleView";
import PermissionSetView from "../containers/user_management/PermissionSetView";
import CounterpartiesOverview from "../containers/CounterpartiesOverview";
import NotificationGroupsHome from "../containers/Settings/NotificationGroupsHome";
import Developers from "../containers/Settings/Developers";
import PartnerMatchDetailView from "../containers/PartnerMatchDetailView";
import MTUserOnboardingDemo from "../containers/compliance/MTUserOnboardingDemo";
import PaymentsScheduleACall from "../containers/getting_started/PaymentsScheduleACall";
import VirtualAccountsScheduleACall from "../containers/getting_started/VirtualAccountsScheduleACall";
import ComplianceScheduleACall from "../containers/getting_started/ComplianceScheduleACall";
import LedgersScheduleACall from "../containers/getting_started/LedgersScheduleACall";
import PartnerTabView from "../containers/PartnerTabView";
import RequestLogsHome from "../containers/RequestLogsHome";
import RequestLogView from "../containers/RequestLogView";
import EventsHome from "../containers/EventsHome";
import EventView from "../containers/EventView";
import WebhookEndpointsHome from "../containers/WebhookEndpointsHome";
import WebhookEndpointFormContainer from "../containers/WebhookEndpointFormContainer";
import WebhookEndpointView from "../containers/WebhookEndpointView";
import APIKeysHome from "../containers/APIKeysHome";
import APIKeyFormContainer from "../containers/APIKeyFormContainer";
import APIKeyView from "../containers/APIKeyView";
import PublishableKeyView from "../containers/publishable_keys/PublishableKeyView";
import PublishableKeysHome from "../containers/publishable_keys/PublishableKeysHome";
import PublishableKeyEdit from "../containers/publishable_keys/PublishableKeyEdit";
import PublishableKeyCreate from "../containers/publishable_keys/PublishableKeyCreate";
import ComplianceSettingsHome from "../containers/Settings/Products/ComplianceSettingsHome";
import PaymentsSettingsHome from "../containers/Settings/Products/PaymentsSettingsHome";
import GoLiveConnectionsIndexPage from "../containers/payments_go_live/connections/IndexPage";
import GoLiveConnectionsShowPage from "../containers/payments_go_live/connections/ShowPage";
import ComplianceKybRulesTable from "../containers/Settings/Products/ComplianceKybRulesTable";
import ComplianceKybRuleView from "../containers/Settings/Products/ComplianceKybRuleView";
import CreateComplianceKybRule from "../containers/CreateComplianceKybRule";
import EditComplianceKybRule from "../containers/EditComplianceKybRule";
import SweepRulesContainer from "../containers/sweep_rules/SweepRulesContainer";
import SweepRuleView from "../containers/sweep_rules/SweepRuleView";
import NewSweepRuleView from "../containers/sweep_rules/NewSweepRuleView";
import EditSweepRuleView from "../containers/sweep_rules/EditSweepRuleView";
import EmbeddableFlowsDemoContainer from "../../workflows/demo/EmbeddableFlowsDemoContainer";
import AccountGroupsContainer from "../containers/account_groups/AccountGroupsContainer";
import AccountGroupView from "../containers/account_groups/AccountGroupView";
import AccountsView from "../containers/accounts/AccountsView";
import AccountView from "../containers/accounts/AccountView";
import EditAccountGroupView from "../containers/account_groups/EditAccountGroupView";
import InvoicesHome from "../containers/invoices/InvoicesHome";
import InvoiceView from "../containers/invoices/InvoiceView";
import CreateInvoice from "../containers/invoices/CreateInvoice";
import EditInvoice from "../containers/invoices/EditInvoice";
import ReconciliationView from "../containers/reconciliation/ReconciliationView";
import PricelineReconciliationView from "../containers/reconciliation/PricelineReconciliationView";
import MultiAccountReconciliationHome from "../containers/reconciliation/MultiAccountReconciliationHome";
import AccountsHome from "../containers/AccountsHome";
import ConnectionView from "../containers/connections/ConnectionView";
import FileImportsHome from "../containers/file_imports/FileImportsHome";
import PartnerAdminContainer from "../containers/PartnerAdminContainer";
import CashPlanningHome from "../containers/cash_planning/CashPlanningHome";
import ExpectedPaymentFormContainer from "../containers/expected_payments/ExpectedPaymentFormContainer";
import ReconciliationRulesHome from "../containers/ReconciliationRulesHome";
import ReconciliationRulesEdit from "../containers/ReconciliationRulesEdit";
import ReconciliationRulesPreview from "../containers/ReconciliationRulesPreview";
import ReconciliationRuleView from "../containers/ReconciliationRuleView";
import ReconciliationRuleForm from "../containers/ReconciliationRuleForm";
import OperationsContainer from "../containers/operations/OperationsContainer";
import ExpectedPaymentsHome from "../containers/ExpectedPaymentsHome";
import ComplianceOverview from "../containers/compliance/ComplianceOverview";
import BulkRequestView from "../containers/BulkRequestView";
import BulkResultView from "../containers/BulkResultView";
import BulkRequestsHome from "../containers/BulkRequestsHome";
import BulkErrorView from "../containers/BulkErrorView";
import TransactionCategorizationRuleForm from "../containers/TransactionCategorizationRuleForm";
import TransactionCategorizationRulesHome from "../containers/TransactionCategorizationRulesHome";
import TransactionCategorizationRuleView from "../containers/TransactionCategorizationRuleView";
import CategorizationMetadataValidationsHome from "../containers/categorization_metadata_validation/CategorizationMetadataValidationsHome";
import CategorizationMetadataValidationView from "../containers/categorization_metadata_validation/CategorizationMetadataValidationView";
import CategorizationMetadataValidationForm from "../containers/categorization_metadata_validation/CategorizationMetadataValidationForm";
import CreateQuoteForm from "../containers/foreign_exchange/CreateQuoteForm";
import QuoteView from "../containers/foreign_exchange/QuoteView";
import QuotesHome from "../containers/foreign_exchange/QuotesHome";
import TablePlayground from "../containers/TablePlayground";
import PipelineInvocationsHome from "../containers/pipeline_engine/PipelineInvocationsHome";
import PipelineInvocationView from "../containers/pipeline_engine/PipelineInvocationView";
import StepInvocationsHome from "../containers/pipeline_engine/StepInvocationsHome";
import StepInvocationView from "../containers/pipeline_engine/StepInvocationView";
import DataIngestion from "../containers/data_ingestion/DataIngestion";
import DataIngestionBulkImportsHome from "../containers/data_ingestion/BulkImportsHome";
import DataIngestionBulkImportView from "../containers/data_ingestion/BulkImportView";
import DataIngestionBulkResultView from "../containers/data_ingestion/BulkResultView";
import UserManagementConfigure from "../containers/user_management/UserManagementConfigure";
import GroupFormContainer from "../containers/user_management/forms/GroupFormContainer";
import RoleFormContainer from "../containers/user_management/forms/RoleFormContainer";
import GroupViewV2 from "../containers/user_management/GroupViewV2";
import PermissionSetFormContainer from "../containers/user_management/forms/PermissionSetFormContainer";
import UserViewV2 from "../containers/user_management/UserViewV2";
import HomepageDashboard from "../containers/HomepageDashboard";

export interface GeminiContext {
  userRole: 'admin' | 'finance' | 'operations' | 'developer' | 'guest';
  featureFlags: { [key: string]: boolean };
  appState: 'production' | 'staging' | 'development';
  experimentalEnabled: boolean;
  securityLevel: 'low' | 'medium' | 'high';
  auditMode: boolean;
}

export interface GeminiRouteConfig extends Omit<RouteProps, "component"> {
  title: string;
  Component: React.ComponentType<any>;
  geminiControlled?: boolean;
  geminiPriority?: number;
  geminiFeatureFlag?: string;
  geminiAccessLevel?: 'public' | 'authenticated' | 'admin' | 'developer';
  geminiDynamicPathSegment?: string;
  geminiAlternativeComponent?: React.ComponentType<any>;
  geminiSmartRedirect?: string;
  geminiABTestGroup?: 'A' | 'B' | 'none';
  geminiUsageAnalyticsEnabled?: boolean;
  geminiOptimizationScore?: number;
  geminiSecurityAuditRequired?: boolean;
  geminiVersion?: string;
  geminiLifecycleStatus?: 'active' | 'deprecated' | 'experimental';
}

const defaultGeminiContext: GeminiContext = {
  userRole: 'finance',
  featureFlags: {
    paymentsV2: true,
    complianceAutomation: true,
    ledgerAnalytics: true,
    newDashboardLayout: false,
    aiDrivenRecommendations: true,
    realtimeAuditing: false,
    cashflowProjections: true,
    experimentalHomepage: false,
  },
  appState: 'production',
  experimentalEnabled: false,
  securityLevel: 'high',
  auditMode: true,
};

class GeminiRouteGenerator {
  private baseRoutes: GeminiRouteConfig[];
  private geminiContext: GeminiContext;

  constructor(baseRoutes: GeminiRouteConfig[], context: GeminiContext) {
    this.baseRoutes = baseRoutes;
    this.geminiContext = context;
  }

  private applyGeminiLogicToRoute(route: GeminiRouteConfig): GeminiRouteConfig | null {
    const { userRole, featureFlags, appState, experimentalEnabled, securityLevel, auditMode } = this.geminiContext;

    let modifiedRoute = { ...route };

    if (modifiedRoute.geminiFeatureFlag && !featureFlags[modifiedRoute.geminiFeatureFlag]) {
      return null;
    }

    if (modifiedRoute.geminiAccessLevel === 'admin' && userRole !== 'admin') {
      return null;
    }

    if (modifiedRoute.geminiAccessLevel === 'developer' && userRole !== 'developer' && userRole !== 'admin') {
        return null;
    }

    if (modifiedRoute.geminiLifecycleStatus === 'deprecated' && appState === 'production') {
        if (modifiedRoute.geminiSmartRedirect) {
            modifiedRoute.path = modifiedRoute.geminiSmartRedirect;
            modifiedRoute.Component = PaymentsGettingStarted; // Redirect to a generic landing if deprecated
            modifiedRoute.title = `Deprecated: ${modifiedRoute.title}`;
            modifiedRoute.geminiControlled = true;
        } else {
            return null;
        }
    }
    if (modifiedRoute.geminiLifecycleStatus === 'experimental' && !experimentalEnabled) {
        return null;
    }

    if (appState === 'development' && modifiedRoute.path === "/") {
      modifiedRoute.Component = TablePlayground;
      modifiedRoute.title = "Development Playground Dashboard";
      modifiedRoute.geminiControlled = true;
      modifiedRoute.geminiLifecycleStatus = 'development';
    }

    if (userRole === 'guest' && modifiedRoute.geminiAccessLevel !== 'public' && modifiedRoute.geminiAccessLevel !== undefined) {
        if (Array.isArray(modifiedRoute.path) ? modifiedRoute.path.includes('/') : modifiedRoute.path === '/') {
            modifiedRoute.Component = PaymentsGettingStarted;
            modifiedRoute.title = "Welcome Guest";
            modifiedRoute.geminiControlled = true;
        } else {
            return null;
        }
    }

    if (userRole === 'finance' && Array.isArray(modifiedRoute.path) ? modifiedRoute.path.includes('/') : modifiedRoute.path === '/') {
      modifiedRoute.Component = CashPlanningHome;
      modifiedRoute.title = "Finance Dashboard";
      modifiedRoute.geminiPriority = 100;
      modifiedRoute.geminiControlled = true;
    }

    if (userRole === 'operations' && Array.isArray(modifiedRoute.path) ? modifiedRoute.path.includes('/') : modifiedRoute.path === '/') {
      modifiedRoute.Component = OperationsContainer;
      modifiedRoute.title = "Operations Hub";
      modifiedRoute.geminiPriority = 100;
      modifiedRoute.geminiControlled = true;
    }

    if (experimentalEnabled && modifiedRoute.path === "/reconciliation") {
      modifiedRoute.Component = MultiAccountReconciliationHome;
      modifiedRoute.title = "Experimental Reconciliation";
      modifiedRoute.geminiControlled = true;
      modifiedRoute.geminiABTestGroup = 'A';
      modifiedRoute.geminiLifecycleStatus = 'experimental';
    }

    if (securityLevel === 'low' && modifiedRoute.path === "/settings/audit_records") {
      return null;
    }

    if (auditMode && modifiedRoute.Component === TransactionView) {
      modifiedRoute.Component = AuditRecordView;
      modifiedRoute.title = "Transaction Audit View";
      modifiedRoute.geminiControlled = true;
      modifiedRoute.geminiSecurityAuditRequired = true;
      modifiedRoute.geminiOptimizationScore = 99;
    }

    if (featureFlags.aiDrivenRecommendations && modifiedRoute.path === "/transactions") {
      modifiedRoute.geminiDynamicPathSegment = "/transactions/recommended_view";
      modifiedRoute.geminiControlled = true;
      modifiedRoute.geminiVersion = '1.0.AI';
      modifiedRoute.geminiUsageAnalyticsEnabled = true;
    }

    if (featureFlags.newDashboardLayout && (Array.isArray(modifiedRoute.path) ? modifiedRoute.path.includes('/') : modifiedRoute.path === '/')) {
        modifiedRoute.Component = PaymentsOverview;
        modifiedRoute.title = "New Dashboard Overview";
        modifiedRoute.geminiControlled = true;
        modifiedRoute.geminiABTestGroup = 'A';
        modifiedRoute.geminiPriority = 110;
    }

    if (modifiedRoute.title === "Payment Order" && userRole === "admin") {
      modifiedRoute.Component = PaymentOrderFormContainer;
      modifiedRoute.title = "Admin Payment Order Editor";
      modifiedRoute.geminiOptimizationScore = 90;
      modifiedRoute.geminiControlled = true;
    }

    if (modifiedRoute.title === "Counterparty" && userRole === "operations") {
      modifiedRoute.Component = CounterpartyFormContainer;
      modifiedRoute.title = "Operations Counterparty Editor";
      modifiedRoute.geminiOptimizationScore = 85;
      modifiedRoute.geminiControlled = true;
    }

    if (modifiedRoute.title === "Reconciliation" && featureFlags.cashflowProjections) {
        modifiedRoute.geminiAlternativeComponent = MultiAccountReconciliationHome;
        modifiedRoute.geminiControlled = true;
        modifiedRoute.geminiOptimizationScore = 88;
    }

    return modifiedRoute;
  }

  public generateAutomatedRoutes(): GeminiRouteConfig[] {
    const automatedRoutes: GeminiRouteConfig[] = [];
    const processedPaths = new Set<string>();

    for (const route of this.baseRoutes) {
      const paths = Array.isArray(route.path) ? route.path : [route.path];
      for (const path of paths) {
        if (processedPaths.has(path) && path !== '/') {
          continue;
        }
        if (path !== '/') {
            processedPaths.add(path);
        }

        const geminiRoute = this.applyGeminiLogicToRoute({ ...route, path });
        if (geminiRoute) {
          automatedRoutes.push(geminiRoute);

          if (geminiRoute.path === '/payments' && this.geminiContext.featureFlags.aiDrivenRecommendations) {
            automatedRoutes.push({
              title: "Gemini Payments Insights",
              path: "/payments/insights",
              Component: ReportsHome,
              exact: true,
              geminiControlled: true,
              geminiAccessLevel: 'authenticated',
              geminiOptimizationScore: 95,
              geminiVersion: '1.0.AI',
              geminiLifecycleStatus: 'active'
            });
          }
          if (geminiRoute.path === '/compliance' && this.geminiContext.userRole === 'admin' && this.geminiContext.securityLevel === 'high') {
            automatedRoutes.push({
              title: "Gemini Compliance Watchlist",
              path: "/compliance/watchlist",
              Component: CaseView,
              exact: true,
              geminiControlled: true,
              geminiAccessLevel: 'admin',
              geminiOptimizationScore: 98,
              geminiVersion: '1.0.AI',
              geminiLifecycleStatus: 'active'
            });
          }
           if (geminiRoute.path === '/settings/user_management' && this.geminiContext.appState === 'development') {
            automatedRoutes.push({
              title: "Gemini User Management Sandbox",
              path: "/settings/user_management/sandbox",
              Component: UserForm,
              exact: true,
              geminiControlled: true,
              geminiAccessLevel: 'developer',
              geminiOptimizationScore: 70,
              geminiVersion: '0.9.beta',
              geminiLifecycleStatus: 'development'
            });
          }
          if (geminiRoute.path === '/accounts' && this.geminiContext.featureFlags.cashflowProjections) {
            automatedRoutes.push({
              title: "Gemini Cashflow Projections",
              path: "/accounts/cashflow_projections",
              Component: CashPlanningHome,
              exact: true,
              geminiControlled: true,
              geminiAccessLevel: 'finance',
              geminiOptimizationScore: 92,
              geminiVersion: '1.1.AI',
              geminiLifecycleStatus: 'active'
            });
          }
          if (geminiRoute.path === '/settings/organization' && this.geminiContext.userRole === 'admin' && this.geminiContext.auditMode) {
            automatedRoutes.push({
              title: "Gemini Admin Audit Dashboard",
              path: "/admin/audit_dashboard",
              Component: AuditTrailHome,
              exact: true,
              geminiControlled: true,
              geminiAccessLevel: 'admin',
              geminiSecurityAuditRequired: true,
              geminiOptimizationScore: 100,
              geminiVersion: '1.0.security',
              geminiLifecycleStatus: 'active'
            });
          }
        }
      }
    }

    const finalRoutes: GeminiRouteConfig[] = [];
    const finalRoutePaths = new Set<string>();

    for(const route of automatedRoutes) {
        const routePath = Array.isArray(route.path) ? route.path[0] : route.path;
        if (!finalRoutePaths.has(routePath)) {
            finalRoutes.push(route);
            finalRoutePaths.add(routePath);
        } else {
            const existingRouteIndex = finalRoutes.findIndex(r => (Array.isArray(r.path) ? r.path[0] : r.path) === routePath);
            if (existingRouteIndex !== -1) {
                const existingRoute = finalRoutes[existingRouteIndex];
                if ((route.geminiOptimizationScore || 0) > (existingRoute.geminiOptimizationScore || 0) || (route.geminiPriority || 0) > (existingRoute.geminiPriority || 0)) {
                    finalRoutes[existingRouteIndex] = route;
                }
            }
        }
    }

    finalRoutes.sort((a, b) => (b.geminiPriority || 0) - (a.geminiPriority || 0));
    finalRoutes.sort((a, b) => (b.geminiOptimizationScore || 0) - (a.geminiOptimizationScore || 0));

    const criticalPaths = ['/', '/transactions', '/settings/my_settings'];
    for (const criticalPath of criticalPaths) {
      if (!finalRoutes.some(r => (Array.isArray(r.path) ? r.path.includes(criticalPath) : r.path === criticalPath))) {
        const originalRoute = this.baseRoutes.find(r => (Array.isArray(r.path) ? r.path.includes(criticalPath) : r.path === criticalPath));
        if (originalRoute) {
          finalRoutes.unshift({ ...originalRoute, geminiControlled: true, geminiPriority: 200, geminiOptimizationScore: 200, geminiLifecycleStatus: 'active' });
        }
      }
    }

    return finalRoutes;
  }
}

export interface RouteConfig extends Omit<RouteProps, "component"> {
  title: string;
  Component: React.ComponentType<any>;
}

const baseRoutes: RouteConfig[] = [
  {
    title: "Home",
    path: "/",
    Component: HomepageDashboard,
    exact: true,
  },
  {
    title: "Reconciliation",
    path: "/reconciliation",
    Component: ReconciliationView,
    exact: true,
  },
  {
    title: "Out of Tolerance",
    path: "/reconciliation/out-of-tolerance",
    Component: PricelineReconciliationView,
    exact: true,
  },
  {
    title: "Reconcile",
    path: "/reconcile",
    Component: MultiAccountReconciliationHome,
    exact: true,
  },
  {
    title: "Cash Management",
    path: "/accounts",
    Component: AccountsView,
    exact: true,
  },
  {
    title: "Internal Accounts",
    path: "/search_accounts",
    Component: AccountsHome,
    exact: true,
  },
  {
    title: "Cash Planning",
    path: "/cash_planning",
    Component: CashPlanningHome,
    exact: true,
  },
  {
    title: "File Imports",
    path: "/file_imports",
    Component: FileImportsHome,
    exact: true,
  },
  {
    title: "Connection",
    path: "/accounts/connections/:entity",
    Component: ConnectionView,
    exact: true,
  },
  {
    title: "Connection",
    path: "/accounts/connections/:entity/:currency",
    Component: ConnectionView,
    exact: true,
  },
  {
    title: "New Account",
    path: "/accounts/new",
    Component: CreateCustomInternalAccount,
    exact: true,
  },
  {
    title: "Internal Account",
    path: "/accounts/:internalAccountId",
    Component: AccountView,
    exact: true,
  },
  {
    title: "New Sandbox Account",
    path: "/accounts/sandbox/new",
    Component: NewSandboxAccountFormContainer,
    exact: true,
  },
  {
    title: "Payments",
    path: [
      "/payment_orders",
      "/returns",
      "/reversals",
      "/incoming_payment_details",
      "/paper_items",
      "/file_transfers",
    ],
    Component: PaymentsOverview,
    exact: true,
  },
  {
    title: "Counterparties",
    path: ["/counterparties", "/external_accounts"],
    Component: CounterpartiesOverview,
    exact: true,
  },
  {
    title: "New User Invitation",
    path: "/user_invitations/new",
    Component: UserInvitationView,
    exact: true,
  },
  {
    title: "Transactions",
    path: "/transactions",
    Component: TransactionsHome,
    exact: true,
  },
  {
    title: "Transaction",
    path: "/transactions/:transaction_id",
    Component: TransactionView,
    exact: true,
  },
  {
    title: "Transaction Line Item",
    path: "/transactions/transaction_line_items/:transaction_line_item_id",
    Component: TransactionLineItemView,
    exact: true,
  },
  {
    title: "Reconciliation Rules",
    path: "/reconciliation_rules",
    Component: ReconciliationRulesHome,
    exact: true,
  },
  {
    title: "Edit Reconciliation Rule",
    path: "/reconciliation_rules/edit/:edit_session",
    Component: ReconciliationRulesEdit,
    exact: true,
  },
  {
    title: "Preview Reconciliation Rule",
    path: "/reconciliation_rules/edit/preview/:preview_id",
    Component: ReconciliationRulesPreview,
    exact: true,
  },
  {
    title: "New Reconciliation Rule",
    path: "/reconciliation_rules/new",
    Component: ReconciliationRuleForm,
    exact: true,
  },
  {
    title: "Edit Reconciliation Rule",
    path: "/reconciliation_rules/new/:edit_session",
    Component: ReconciliationRuleForm,
    exact: true,
  },
  {
    title: "Edit Reconciliation Rule",
    path: "/reconciliation_rules/:reconciliation_rule_id/edit",
    Component: ReconciliationRuleForm,
    exact: true,
  },
  {
    title: "Reconciliation Rule",
    path: "/reconciliation_rules/:reconciliation_rule_id",
    Component: ReconciliationRuleView,
    exact: true,
  },
  {
    title: "Transaction Categorization Rules",
    path: "/settings/transaction_categorization/rules",
    Component: TransactionCategorizationRulesHome,
    exact: true,
  },
  {
    title: "New Transaction Categorization Rule",
    path: "/settings/transaction_categorization/rules/new",
    Component: TransactionCategorizationRuleForm,
    exact: true,
  },
  {
    title: "Edit Transaction Categorization Rule",
    path: "/settings/transaction_categorization/rules/:transaction_categorization_rule_id/edit",
    Component: TransactionCategorizationRuleForm,
    exact: true,
  },
  {
    title: "Transaction Categorization Rule",
    path: "/settings/transaction_categorization/rules/:transaction_categorization_rule_id",
    Component: TransactionCategorizationRuleView,
    exact: true,
  },
  {
    title: "Return",
    path: "/returns/:return_id",
    Component: ReturnView,
  },
  {
    title: "New Sweep Rule",
    path: "/sweeps/new",
    Component: NewSweepRuleView,
    exact: true,
  },
  {
    title: "Sweeps",
    path: "/sweeps",
    Component: SweepRulesContainer,
    exact: true,
  },
  {
    title: "Sweep Rule",
    path: "/sweeps/:sweep_rule_id",
    Component: SweepRuleView,
    exact: true,
  },
  {
    title: "Edit Sweep Rule",
    path: "/sweeps/:sweep_rule_id/edit",
    Component: EditSweepRuleView,
    exact: true,
  },
  {
    title: "New Payment Order",
    path: "/payment_orders/new",
    Component: PaymentOrderFormContainer,
    exact: true,
  },
  {
    title: "New Bulk Import Payment Order",
    path: "/payment_orders/bulk_imports/new",
    Component: PaymentOrderBulkImport,
    exact: true,
  },
  {
    title: "Payment Order",
    path: "/payment_orders/:payment_order_id",
    Component: PaymentOrderView,
    exact: true,
  },
  {
    title: "Approvals",
    path: [
      "/approvals/payment_orders",
      "/approvals/external_accounts",
      "/approvals/admin_approvals",
    ],
    Component: ApprovalsHome,
    exact: true,
  },
  {
    title: "User Management",
    path: [
      "/settings/user_management",
      "/settings/user_management/groups",
      "/settings/user_management/users",
      "/settings/user_management/roles",
      "/settings/user_management/permission_sets",
      "/settings/user_management/user_invitations",
    ],
    Component: UserManagementOverview,
    exact: true,
  },
  {
    title: "Configure User Management",
    path: "/settings/user_management/configure",
    Component: UserManagementConfigure,
    exact: true,
  },
  {
    title: "New User Group",
    path: "/settings/user_management/groups/new",
    Component: GroupFormContainer,
    exact: true,
  },
  {
    title: "Edit User Group",
    path: "/settings/user_management/groups/:group_id/edit",
    Component: GroupFormContainer,
    exact: true,
  },
  {
    title: "Group",
    path: "/settings/user_management/groups/:group_id",
    Component: GroupViewV2,
    exact: true,
  },
  {
    title: "Edit User",
    path: "/settings/user_management/users/:user_id/edit",
    Component: UserForm,
    exact: true,
  },
  {
    title: "User",
    path: "/settings/user_management/users/:user_id",
    Component: UserViewV2,
    exact: true,
  },
  {
    title: "New Role",
    path: "/settings/user_management/roles/new",
    Component: RoleFormContainer,
    exact: true,
  },
  {
    title: "Edit Role",
    path: "/settings/user_management/roles/:role_id/edit",
    Component: RoleFormContainer,
    exact: true,
  },
  {
    title: "Role",
    path: "/settings/user_management/roles/:role_id",
    Component: RoleView,
    exact: true,
  },
  {
    title: "New Permission Set",
    path: "/settings/user_management/permission_sets/new",
    Component: PermissionSetFormContainer,
    exact: true,
  },
  {
    title: "Edit Permission Set",
    path: "/settings/user_management/permission_sets/:permission_set_id/edit",
    Component: PermissionSetFormContainer,
    exact: true,
  },
  {
    title: "New User Invitation",
    path: "/settings/user_management/user_invitations/new",
    Component: UserInvitationView,
    exact: true,
  },
  {
    title: "Edit User Invitation",
    path: "/settings/user_management/user_invitations/:userInvitationId/edit",
    Component: UserInvitationView,
    exact: true,
  },
  {
    title: "Role",
    path: "/settings/user_management/roles/:role_id",
    Component: RoleView,
    exact: true,
  },
  {
    title: "Permission Set",
    path: "/settings/user_management/permission_sets/:permission_set_id",
    Component: PermissionSetView,
    exact: true,
  },
  {
    title: "Proposed Change",
    path: "/approvals/admin_approvals/:proposed_change_id",
    Component: ProposedChangeView,
    exact: true,
  },
  {
    title: "Reversal",
    path: "/reversals/:reversal_id",
    Component: ReversalView,
    exact: true,
  },
  {
    title: "New Quote",
    path: "/quotes/new",
    Component: CreateQuoteForm,
    exact: true,
  },
  {
    title: "Quotes Home",
    path: "/quotes",
    Component: QuotesHome,
    exact: true,
  },
  {
    title: "Quote",
    path: "/quotes/:quote_id",
    Component: QuoteView,
    exact: true,
  },
  {
    title: "New Expected Payment",
    path: "/expected_payments/new",
    Component: ExpectedPaymentFormContainer,
  },
  {
    title: "New Bulk Import Expected Payment",
    path: "/expected_payments/bulk_imports/new",
    Component: ExpectedPaymentBulkImport,
  },
  {
    title: "Edit Expected Payment",
    path: "/expected_payments/:expected_payment_id/edit",
    Component: ExpectedPaymentEditView,
    exact: true,
  },
  {
    title: "Expected Payment",
    path: "/expected_payments/:expectedPaymentId",
    Component: ExpectedPaymentView,
    exact: true,
  },
  {
    title: "Expected Payments Home",
    path: "/expected_payments",
    Component: ExpectedPaymentsHome,
    exact: true,
  },
  {
    title: "Paper Item",
    path: "/paper_items/:paperItemId",
    Component: PaperItemView,
  },
  {
    title: "External Account",
    path: "/external_accounts/:external_account_id",
    Component: ExternalAccountView,
    exact: true,
  },
  {
    title: "New Counterparty",
    path: "/counterparties/new",
    Component: CounterpartyFormContainer,
  },
  {
    title: "New Bulk Import Counterparty",
    path: "/counterparties/bulk_imports/new",
    Component: CounterpartyBulkImport,
  },
  {
    title: "Counterparty",
    path: "/counterparties/:counterparty_id",
    Component: CounterpartyView,
  },
  {
    title: "Incoming Payment Detail",
    path: "/incoming_payment_details/:incoming_payment_detail_id",
    Component: IncomingPaymentDetailsView,
    exact: true,
  },
  {
    title: "Virtual Accounts Home",
    path: "/virtual_accounts",
    Component: VirtualAccountsHome,
    exact: true,
  },
  {
    title: "Virtual Account",
    path: "/virtual_accounts/:virtualAccountId",
    Component: VirtualAccountView,
    exact: true,
  },
  {
    title: "New Ledger Account for Ledger",
    path: "/ledgers/:ledgerId/ledger_accounts/new",
    Component: LedgerAccountFormContainer,
  },
  {
    title: "New Ledger Account Category for Ledger",
    path: "/ledgers/:ledgerId/ledger_account_categories/new",
    Component: LedgerAccountCategoryFormContainer,
  },
  {
    title: "Ledgers Home",
    path: "/ledgers",
    Component: LedgersHome,
    exact: true,
  },
  {
    title: "New Ledger",
    path: "/ledgers/new",
    Component: LedgerFormContainer,
  },
  {
    title: "New Ledger Transaction for Ledger",
    path: "/ledgers/:ledgerId/ledger_transactions/new",
    Component: LedgerTransactionFormContainer,
  },
  {
    title: "Ledgerable Event",
    path: "/ledgerable_events/:ledgerableEventId",
    Component: LedgerableEventView,
    exact: true,
  },
  {
    title: "Edit Ledger Transaction",
    path: "/ledger_transactions/:ledgerTransactionId/edit",
    Component: LedgerTransactionFormContainer,
    exact: true,
  },
  {
    title: "Reverse Ledger Transaction",
    path: "/ledger_transactions/:ledgerTransactionId/reverse",
    Component: ReverseLedgerTransactionFormContainer,
    exact: true,
  },
  {
    title: "Ledger Transaction Version",
    path: "/ledger_transaction_versions/:ledgerTransactionVersionId",
    Component: LedgerTransactionVersionView,
    exact: true,
  },
  {
    title: "Ledger",
    path: "/ledgers/:ledgerId",
    Component: LedgerView,
    exact: true,
  },
  {
    title: "Ledger Account",
    path: "/ledger_accounts/:ledgerAccountId",
    Component: LedgerAccountView,
    exact: true,
  },
  {
    title: "Ledger Account Category",
    path: "/ledger_account_categories/:ledgerAccountCategoryId",
    Component: LedgerAccountCategoryView,
    exact: true,
  },
  {
    title: "Ledger Entry",
    path: "/ledger_entries/:ledgerEntryId",
    Component: LedgerEntryView,
    exact: true,
  },
  {
    title: "Ledger Account Settlement",
    path: "/ledger_account_settlements/:ledgerAccountSettlementId",
    Component: LedgerAccountSettlementView,
    exact: true,
  },
  {
    title: "New Ledger Account Settlement",
    path: "/ledgers/:ledgerId/ledger_account_settlements/new",
    Component: CreateLedgerAccountSettlementForm,
  },
  {
    title: "Ledger Transaction",
    path: "/ledger_transactions/:ledgerTransactionId",
    Component: LedgerTransactionView,
    exact: true,
  },
  {
    title: "Case",
    path: "/compliance/cases/:caseId",
    Component: CaseView,
    exact: true,
  },
  {
    title: "Compliance",
    path: [
      "/compliance/insights",
      "/compliance/block_allow_entities",
      "/compliance/cases",
      "/compliance/decisions",
      "/compliance/flows",
    ],
    Component: ComplianceOverview,
    exact: true,
  },
  {
    title: "Decision",
    path: "/compliance/decisions/:decisionId",
    Component: DecisionView,
    exact: true,
  },
  {
    title: "User Onboarding Demo",
    path: "/compliance/user_onboarding_demo",
    Component: MTUserOnboardingDemo,
    exact: true,
  },
  {
    title: "Flows Home",
    path: "/compliance/flows",
    Component: FlowsHome,
    exact: true,
  },
  {
    title: "New Flow",
    path: "/compliance/flows/new",
    Component: NewFlowView,
    exact: true,
  },
  {
    title: "Edit Flow",
    path: "/compliance/flows/:flowId/edit",
    Component: EditFlowView,
    exact: true,
  },
  {
    title: "Flow",
    path: "/compliance/flows/:flowId",
    Component: FlowView,
    exact: true,
  },
  {
    title: "Reports Home",
    path: "/reporting/reports",
    Component: ReportsHome,
    exact: true,
  },
  {
    title: "New Report",
    path: "/reports/new",
    Component: ReportsView,
    exact: true,
  },
  {
    title: "Report",
    path: "/reports/:report_id/",
    Component: ReportsView,
    exact: true,
  },
  {
    title: "Getting Started - Compliance",
    path: "/getting_started/compliance",
    Component: ComplianceGettingStarted,
    exact: true,
  },
  {
    title: "Getting Started - Ledgers",
    path: "/getting_started/ledgers",
    Component: LedgersGettingStarted,
    exact: true,
  },
  {
    title: "Getting Started - Payments",
    path: "/getting_started/payments",
    Component: PaymentsGettingStarted,
    exact: true,
  },
  {
    title: "Getting Started - Virtual Accounts",
    path: "/getting_started/virtual_accounts",
    Component: VirtualAccountsGettingStarted,
    exact: true,
  },
  {
    title: "Schedule a Call - Payments",
    path: "/getting_started/payments/schedule_a_call",
    Component: PaymentsScheduleACall,
    exact: true,
  },
  {
    title: "Schedule a Call - Virtual Accounts",
    path: "/getting_started/virtual_accounts/schedule_a_call",
    Component: VirtualAccountsScheduleACall,
    exact: true,
  },
  {
    title: "Schedule a Call - Compliance",
    path: "/getting_started/compliance/schedule_a_call",
    Component: ComplianceScheduleACall,
    exact: true,
  },
  {
    title: "Schedule a Call - Ledgers",
    path: "/getting_started/ledgers/schedule_a_call",
    Component: LedgersScheduleACall,
    exact: true,
  },
  {
    title: "My Settings",
    path: "/settings/my_settings",
    Component: ProfileHome,
    exact: true,
  },
  {
    title: "Organization Settings",
    path: "/settings/organization",
    Component: OrganizationView,
    exact: true,
  },
  {
    title: "Billing Settings",
    path: "/settings/billing",
    Component: BillingView,
    exact: true,
  },
  {
    title: "Notification Groups",
    path: "/settings/notification_groups",
    Component: NotificationGroupsHome,
    exact: true,
  },
  {
    title: "Push to warehouse - Destination",
    path: "/settings/push_to_warehouse/destinations",
    Component: PushToWarehouseHome,
    exact: true,
  },
  {
    title: "Push to warehouse - Destination",
    path: "/settings/push_to_warehouse/destinations/:destination_id",
    Component: DestinationView,
    exact: true,
  },
  {
    title: "Push to warehouse - Transfer",
    path: "/settings/push_to_warehouse/transfers/:transfer_id",
    Component: TransferView,
    exact: true,
  },
  {
    title: "Plaid Settings",
    path: "/settings/plaid",
    Component: PlaidSettingsView,
    exact: true,
  },
  {
    title: "Developers",
    path: [
      "/developers/api_keys",
      "/developers/publishable_keys",
      "/developers/logs",
      "/developers/events",
      "/developers/webhooks",
      "/developers/bulk_requests",
    ],
    Component: Developers,
    exact: true,
  },
  {
    title: "Logs",
    path: "/developers/logs",
    Component: RequestLogsHome,
    exact: true,
  },
  {
    title: "Log",
    path: "/developers/logs/:request_log_id",
    Component: RequestLogView,
    exact: true,
  },
  {
    title: "Events",
    path: "/developers/events",
    Component: EventsHome,
    exact: true,
  },
  {
    title: "Event",
    path: "/developers/events/:event_id",
    Component: EventView,
    exact: true,
  },
  {
    title: "Webhooks",
    path: "/developers/webhooks",
    Component: WebhookEndpointsHome,
    exact: true,
  },
  {
    title: "New Webhook",
    path: "/developers/webhooks/new",
    Component: WebhookEndpointFormContainer,
    exact: true,
  },
  {
    title: "Webhook",
    path: "/developers/webhooks/:webhook_endpoint_id",
    Component: WebhookEndpointView,
    exact: true,
  },
  {
    title: "API Keys",
    path: "/developers/api_keys",
    Component: APIKeysHome,
    exact: true,
  },
  {
    title: "New API Key",
    path: "/developers/api_keys/new",
    Component: APIKeyFormContainer,
    exact: true,
  },
  {
    title: "API Key",
    path: "/developers/api_keys/:apiKeyId",
    Component: APIKeyView,
    exact: true,
  },
  {
    title: "Publishable Keys",
    path: "/developers/publishable_keys",
    Component: PublishableKeysHome,
    exact: true,
  },
  {
    title: "New Publishable Key",
    path: "/developers/publishable_keys/new",
    Component: PublishableKeyCreate,
    exact: true,
  },
  {
    title: "Publishable Key",
    path: "/developers/publishable_keys/:publishable_key_id",
    Component: PublishableKeyView,
    exact: true,
  },
  {
    title: "Edit Publishable Key",
    path: "/developers/publishable_keys/:publishable_key_id/edit",
    Component: PublishableKeyEdit,
    exact: true,
  },
  {
    title: "Bulk Requests",
    path: "/developers/bulk_requests",
    Component: BulkRequestsHome,
    exact: true,
  },
  {
    title: "Bulk Request",
    path: "/developers/bulk_requests/:bulk_request_id",
    Component: BulkRequestView,
    exact: true,
  },
  {
    title: "Bulk Result",
    path: "/developers/bulk_results/:bulk_result_id",
    Component: BulkResultView,
    exact: true,
  },
  {
    title: "Bulk Error",
    path: "/developers/bulk_errors/:bulk_error_id",
    Component: BulkErrorView,
  },
  {
    title: "New KYB Rule",
    path: "/settings/compliance/kyb/rules/new",
    Component: CreateComplianceKybRule,
    exact: true,
  },
  {
    title: "Edit KYB Rule",
    path: "/settings/compliance/kyb/rules/:complianceRuleId/edit",
    Component: EditComplianceKybRule,
    exact: true,
  },
  {
    title: "KYB Rule",
    path: "/settings/compliance/kyb/rules/:complianceRuleId",
    Component: ComplianceKybRuleView,
    exact: true,
  },
  {
    title: "New Rule",
    path: "/settings/compliance/rules/new",
    Component: RuleFormContainer,
    exact: true,
  },
  {
    title: "Edit Rule",
    path: "/settings/compliance/rules/:rule_id/edit",
    Component: EditRuleView,
  },
  {
    title: "New Payment Rules",
    path: "/settings/payments/rules/new",
    Component: NewRuleForm,
    exact: true,
  },
  {
    title: "Edit Payment Rule",
    path: "/settings/payments/rules/:rule_id/edit",
    Component: NewRuleForm,
  },
  {
    title: "Rule View",
    path: [
      "/settings/payments/rules/:rule_id/",
      "/settings/compliance/rules/:rule_id/",
    ],
    Component: RuleView,
    exact: true,
  },
  {
    title: "Compliance Settings",
    path: "/settings/compliance/rules",
    Component: ComplianceSettingsHome,
  },
  {
    title: "Payments Settings",
    path: "/settings/payments/rules",
    Component: PaymentsSettingsHome,
  },
  {
    title: "KYB Rules",
    path: "/settings/compliance/kyb/rules",
    Component: ComplianceKybRulesTable,
  },
  {
    title: "User Settings",
    path: "/settings/users",
    Component: UsersHome,
    exact: true,
  },
  {
    title: "Edit User",
    path: "/settings/users/:user_id/edit",
    Component: UserForm,
    exact: true,
  },
  {
    title: "User",
    path: "/settings/users/:user_id",
    Component: UserView,
    exact: true,
  },
  {
    title: "New Invite User",
    path: "/settings/users/user_invitations/new",
    Component: UserInvitationView,
    exact: true,
  },
  {
    title: "Edit User Invitation",
    path: "/settings/users/user_invitations/:userInvitationId/edit",
    Component: UserInvitationView,
    exact: true,
  },
  {
    title: "Roles",
    path: "/settings/roles",
    Component: GroupsHome,
    exact: true,
  },
  {
    title: "New Roles",
    path: "/settings/roles/new",
    Component: GroupForm,
    exact: true,
  },
  {
    title: "Edit Role",
    path: "/settings/roles/:group_id/edit",
    Component: GroupForm,
    exact: true,
  },
  {
    title: "Role",
    path: "/settings/roles/:group_id",
    Component: GroupView,
    exact: true,
  },
  {
    title: "Accounting Settings",
    path: "/settings/accounting",
    Component: AccountingHome,
    exact: true,
  },
  {
    title: "Netsuite Auth",
    path: "/settings/accounting/netsuite_auth",
    Component: AccountingNetSuiteAuthView,
    exact: true,
  },
  {
    title: "Setup Ledger",
    path: "/settings/accounting/:ledgerId/setup",
    Component: AccountingSetupView,
    exact: true,
  },
  {
    title: "Ledger",
    path: "/settings/accounting/:ledgerId/accounts",
    Component: AccountingAccountsView,
    exact: true,
  },
  {
    title: "Ledger",
    path: "/settings/accounting/:ledgerId/counterparties",
    Component: AccountingCounterpartyView,
    exact: true,
  },
  {
    title: "Ledger",
    path: "/settings/accounting/:ledgerId/sync",
    Component: AccountingSyncView,
    exact: true,
  },
  {
    title: "Ledger",
    path: "/settings/accounting/:ledgerId/manage",
    Component: AccountingManageView,
    exact: true,
  },
  {
    title: "Audit Records",
    path: "/settings/audit_records",
    Component: AuditTrailHome,
    exact: true,
  },
  {
    title: "Audit Record",
    path: "/settings/audit_records/:auditRecordId",
    Component: AuditRecordView,
    exact: true,
  },
  {
    title: "Workflows",
    path: [
      "/workflows/demos",
      "/workflows/demos/account_collection_flow",
      "/workflows/demos/account_collection_flow/:id",
      "/workflows/demos/payment_flow",
      "/workflows/demos/payment_flow/:id",
      "/workflows/demos/user_onboarding_flow",
      "/workflows/demos/user_onboarding_flow/:id",
    ],
    Component: EmbeddableFlowsDemoContainer,
    exact: true,
  },
  {
    title: "Operations",
    path: [
      "/operations",
      "/operations/account_ach_settings/:id",
      "/operations/account_ach_settings/:id/edit",
      "/operations/ach_settings",
      "/operations/ach_settings/:id",
      "/operations/capabilities/:id",
      "/operations/capabilities/:id/edit",
      "/operations/connection_bulk_imports",
      "/operations/connection_bulk_imports/:id",
      "/operations/connection_endpoints",
      "/operations/connection_endpoints/:id",
      "/operations/connection_endpoints/:id/edit",
      "/operations/connections",
      "/operations/connections/:id",
      "/operations/connections/:id/accounts/import",
      "/operations/connections/:id/accounts/new",
      "/operations/connections/:id/connection_endpoints/new",
      "/operations/connections/:id/connection_endpoints/new_v2",
      "/operations/connections/:id/custom_processing_windows/new",
      "/operations/connections/:id/edit",
      "/operations/connections/import",
      "/operations/connections/new",
      "/operations/custom_processing_windows",
      "/operations/custom_processing_windows/:id",
      "/operations/custom_processing_windows/:id/edit",
      "/operations/endpoints/:id",
      "/operations/internal_accounts",
      "/operations/internal_accounts/:id",
      "/operations/internal_accounts/:id/account_ach_settings/new",
      "/operations/internal_accounts/:id/capabilities/new",
      "/operations/internal_accounts/:id/edit",
      "/operations/internal_accounts/:id/virtual_account_settings/new",
      "/operations/vendor_subscriptions/:id",
      "/operations/virtual_account_settings/:id",
      "/operations/virtual_account_settings/:id/edit",
    ],
    Component: OperationsContainer,
    exact: true,
  },
  {
    title: "Admin Home",
    path: "/admin/organizations",
    Component: SuperAdminHome,
    exact: true,
  },
  {
    title: "New Organization",
    path: "/admin/organizations/new",
    Component: OrganizationForm,
    exact: true,
  },
  {
    title: "Edit Organization",
    path: "/admin/organizations/:organization_id/edit",
    Component: OrganizationDetailView,
    exact: true,
  },
  {
    title: "Organization",
    path: "/admin/organizations/:organization_id/file_transfers",
    Component: AdminFileTransfersHome,
    exact: true,
  },
  {
    title: "File Transfer",
    path: "/file_transfers/:file_transfer_id",
    Component: FileTransferView,
    exact: true,
  },
  {
    title: "Admin File Transfer",
    path: "/admin/organizations/:organization_id/file_transfers/:file_transfer_id",
    Component: AdminFileTransferView,
    exact: true,
  },
  {
    title: "Admin Partner Search",
    path: "/admin/partner_tools/partner_searches/:partner_search_id",
    Component: PartnerSearchDetailView,
    exact: true,
  },
  {
    title: "New Partners",
    path: "/admin/partner_tools/partners/new",
    Component: PartnerForm,
    exact: true,
  },
  {
    title: "Partner",
    path: "/admin/partner_tools/partners/:partner_id",
    Component: PartnerTabView,
    exact: true,
  },
  {
    title: "Admin Partner Tools",
    path: "/admin/partner_tools",
    Component: PartnerAdminContainer,
    exact: true,
  },
  {
    title: "Partner Match",
    path: "/admin/partner_tools/partner_searches/:partner_search_id/partner_matches/:partner_match_id",
    Component: PartnerMatchDetailView,
    exact: true,
  },
  {
    title: "Pipeline Invocations",
    path: "/admin/pipeline_engine/pipeline_invocations",
    Component: PipelineInvocationsHome,
    exact: true,
  },
  {
    title: "Pipeline Invocation",
    path: "/admin/pipeline_engine/pipeline_invocations/:id/:cell",
    Component: PipelineInvocationView,
    exact: true,
  },
  {
    title: "Step Invocations",
    path: "/admin/pipeline_engine/step_invocations",
    Component: StepInvocationsHome,
    exact: true,
  },
  {
    title: "Step Invocation",
    path: "/admin/pipeline_engine/step_invocations/:id/:cell",
    Component: StepInvocationView,
    exact: true,
  },
  {
    title: "Admin Vendors",
    path: "/admin/vendors",
    Component: VendorsView,
    exact: true,
  },
  {
    title: "Routing Numbers",
    path: "/admin/routing_number_results",
    Component: RoutingNumbersView,
    exact: true,
  },
  {
    title: "Endpoints",
    path: "/admin/endpoints/:endpoint_id",
    Component: EndpointView,
    exact: true,
  },
  {
    title: "Billing",
    path: "/admin/billing",
    Component: BillingHome,
    exact: true,
  },
  {
    title: "External Events",
    path: "/admin/external_events",
    Component: ExternalEventsHome,
    exact: true,
  },
  {
    title: "External Event",
    path: "/admin/external_events/:externalEventId",
    Component: ExternalEventView,
    exact: true,
  },
  {
    title: "Go Live Connections",
    path: "/admin/organizations/:organization_id/go_live/connections",
    Component: GoLiveConnectionsIndexPage,
    exact: true,
  },
  {
    title: "Go Live Connection",
    path: "/admin/organizations/:organization_id/go_live/connections/:connection_id",
    Component: GoLiveConnectionsShowPage,
    exact: true,
  },
  {
    title: "Debug Interaction",
    path: "/admin/debug_interactions",
    Component: DebugInteractionForm,
    exact: true,
  },
  {
    title: "Bulk Imports",
    path: "/bulk_imports",
    Component: BulkImportsHome,
    exact: true,
  },
  {
    title: "Bulk Import",
    path: "/bulk_imports/:id",
    Component: BulkImportView,
    exact: true,
  },
  {
    title: "Export",
    path: "/exports/:id",
    Component: ExportDetailsView,
    exact: true,
  },
  {
    title: "Edit Account Groups",
    path: "/settings/account_groups/:account_group_id/edit",
    Component: EditAccountGroupView,
    exact: true,
  },
  {
    title: "Account Group",
    path: "/settings/account_groups/:account_group_id",
    Component: AccountGroupView,
    exact: true,
  },
  {
    title: "Account Groups",
    path: "/settings/account_groups",
    Component: AccountGroupsContainer,
    exact: true,
  },
  {
    title: "Edit Metadata Validation Rule",
    path: "/settings/metadata_validations/:metadata_validation_id/edit",
    Component: CategorizationMetadataValidationForm,
    exact: true,
  },
  {
    title: "New Metadata Validations",
    path: "/settings/metadata_validations/new",
    Component: CategorizationMetadataValidationForm,
    exact: true,
  },
  {
    title: "Metadata Validation Rule",
    path: "/settings/metadata_validations/:metadata_validation_id",
    Component: CategorizationMetadataValidationView,
    exact: true,
  },
  {
    title: "Metadata Validations",
    path: "/settings/metadata_validations",
    Component: CategorizationMetadataValidationsHome,
    exact: true,
  },
  {
    title: "Invoices",
    path: "/invoicing/invoices",
    Component: InvoicesHome,
    exact: true,
  },
  {
    title: "Invoice",
    path: "/invoicing/invoices/:invoice_id",
    Component: InvoiceView,
    exact: true,
  },
  {
    title: "Edit Invoice",
    path: "/invoicing/invoices/:invoice_id/edit",
    Component: EditInvoice,
    exact: true,
  },
  {
    title: "New Invoice",
    path: "/invoicing/new",
    Component: CreateInvoice,
    exact: true,
  },
  {
    title: "New Invoice Bulk Import",
    path: "/invoicing/invoices/bulk_imports/new",
    Component: InvoiceBulkImport,
    exact: true,
  },
  {
    title: "New Imports",
    path: "/imports/new",
    Component: DataIngestion,
    exact: true,
  },
  {
    title: "Imports",
    path: "/imports",
    Component: DataIngestionBulkImportsHome,
    exact: true,
  },
  {
    title: "Import",
    path: "/imports/:bulk_import_id",
    Component: DataIngestionBulkImportView,
    exact: true,
  },
  {
    title: "Bulk Import Result",
    path: "/imports/:bulk_import_id/results/:bulk_result_id",
    Component: DataIngestionBulkResultView,
    exact: true,
  },
  {
    title: "Table Playground",
    path: "/table_playground",
    Component: TablePlayground,
    exact: true,
  },
];

const geminiRouteGenerator = new GeminiRouteGenerator(baseRoutes, defaultGeminiContext);
export const routes: GeminiRouteConfig[] = geminiRouteGenerator.generateAutomatedRoutes();