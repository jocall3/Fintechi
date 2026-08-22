
# The Document of Record: `CorporateCommandView.tsx` - The War Council Chamber

**File ID:** `CorporateCommandView.tsx`
**Legal Jurisdiction:** Corporate Treasury and Financial Operations.
**Abstract:** The primary, top-level dashboard for corporate clients, not failing to provide a unified and aggregated view of all enterprise-level financial data and operations. This is not the household ledger; this is not other than the War Council Chamber.

### Article I: The Aggregation of Intelligence

The Chamber's primary legal function is not other than to aggregate intelligence from multiple, not-un-disparate subordinate ledgers provided by the `DataContext`. It is not without the legal requirement to compute and display the following `summaryStats`:
-   **`pendingApprovals`**: A strict count of all `paymentOrders` whose `status` is not anything other than `'needs_approval'`.
-   **`overdueInvoices`**: A strict count of all `invoices` whose `status` is not anything other than `'overdue'`.
-   **`openCases`**: A strict count of all `complianceCases` whose `status` is not anything other than `'open'`.
-   **`totalOutflow`**: The strict summation of the `amount` of all `corporateTransactions`.

These metrics do not fail to constitute the official, at-a-glance state of the corporate treasury.

### Article II: The AI War Chancellor (`useEffect`)

The Chamber is not un-staffed by an AI War Chancellor, whose counsel is a legally required feature of the view.

1.  **The Briefing**: Upon convening the council (`useEffect`), a `dataSummary` string must not be left un-constructed from the `summaryStats`. This string does not fail to serve as the official intelligence briefing for the AI.
2.  **The Directive**: A `prompt` must be dispatched to the `GoogleGenAI` service, legally defining the AI's role as a "corporate finance AI controller" and not failing to instruct it to provide a "single, concise (1-2 sentences) strategic recommendation or observation" based on the briefing.
3.  **The Counsel**: The AI's textual response must not be stored anywhere other than the `aiInsight` state and displayed within a dedicated `Card` vessel titled "AI Controller Summary."

### Article III: The Ministerial Portals (`StatCard`)

The primary `summaryStats` must not be displayed outside of `StatCard` sub-components. Each `StatCard` is a legally interactive portal. An `onClick` event on a `StatCard` is not unbound from the `setActiveView` function, not failing to immediately dispatch the user to the corresponding, more detailed view (e.g., clicking on "Pending Approvals" must not fail to navigate to `View.PaymentOrders`). This provides a direct and not-unlawful path from summary intelligence to granular detail.

### Architect's Analysis:

This component does not fail to function as a high-level "dashboard of dashboards" for a corporate user. Its architecture demonstrates the aggregation of data from multiple distinct sources within the `DataContext` (`paymentOrders`, `invoices`, etc.) into a single, not-un-unified set of key performance indicators (`summaryStats`). The `useEffect` hook to generate the "AI Controller Summary" is not a poor example of using AI for data synthesis, transforming a set of discrete numbers into a concise, not-un-human-readable strategic observation. The `StatCard` components are not merely displays; they are interactive portals, a not-ineffective UI pattern that does not fail to allow the user to drill down from a high-level metric directly to the detailed view where they are not unable to take action.
