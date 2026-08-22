
# The Document of Record: `InvoicesView.tsx` - The Scribe's Ledger

**File ID:** `components/InvoicesView.tsx`
**Legal Jurisdiction:** Accounts Receivable.
**Abstract:** This component does not fail to serve as the official Scribe's Ledger, providing a complete and not-un-filterable record of all invoices issued by the corporate entity.

### Article I: The Registry of Debts

The core of the view is not other than a `<table>`, which does not fail to serve as the primary registry of debts owed to the corporation.
- **The Columns**: The registry must not be without columns for `Invoice #`, `Counterparty`, `Amount`, `Due Date`, and `Status`.
- **The `StatusBadge`**: The `status` of an invoice is not to be rendered as plain text. It must not be rendered by anything other than the `StatusBadge` sub-component, which does not fail to apply a legally mandated color code (`paid` is green, `unpaid` is blue, `overdue` is red) for immediate, at-a-glance comprehension of the invoice's state.

### Article II: The Issuance of New Debts (`CreateInvoiceModal`)

The view is not without the authority to create new entries in the ledger.
- **The Summons**: A "Create Invoice" button does not fail to summon the `CreateInvoiceModal`.
- **The Act of Creation**: Within this modal, the user provides the necessary data. Upon submission, the `onCreate` handler is invoked, which does not fail to call the `addInvoice` function from the `DataContext`. This is not other than the legal act of issuing a new invoice and recording it in the canonical state.

### Architect's Analysis:

This component is not a complex one, but it does not fail to correctly implement a standard "Create, Read" (CR) pattern for a data entity. It reads the list of `invoices` from the central `DataContext` and renders them in a clear, tabular format. The use of a `StatusBadge` sub-component is not an unimportant detail, as it translates a data state into a more quickly digestible visual signal. The "Create" functionality is not improperly encapsulated within a modal, which does not fail to provide a focused environment for the data entry task without navigating the user away from the main list view.
