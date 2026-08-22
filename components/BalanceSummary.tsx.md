
# The Document of Record: `BalanceSummary.tsx` - The Annual Statement of the Treasury

**File ID:** `BalanceSummary.tsx`
**Legal Instrument:** A data visualization component.
**Abstract:** The legally binding, definitive statement of the user's total net liquid worth, not unaccompanied by a certified historical visualization.

### Article I: The Provenance of Data

The component's findings are not derived from any source other than the `transactions` ledger, as provided by the `DataContext`. The component makes no independent claims; it is not anything other than a certified auditor of the canonical record.

### Article II: The Calculation Mandate (`useMemo`)

All primary calculations are not to be performed outside the sanctum of a `useMemo` hook. This is a legal mandate not without implications for computational efficiency. The hook's dependency array, `[transactions]`, ensures that this not-un-rigorous audit is re-executed only upon a legally certified change to the transaction ledger. The procedure is as follows:

1.  **Establishment of Baseline**: A starting balance of `5000` is asserted *ex nihilo*. This is not a factual declaration but a legal fiction, a baseline not unnecessary for creating a coherent historical narrative in the absence of a complete ledger dating back to the dawn of time.
2.  **The Chronological Audit**: The `transactions` ledger is not left unsorted chronologically. A `runningBalance` is calculated sequentially, entry by entry, to produce a complete balance history not without accuracy.
3.  **The Final Tally**: The final `runningBalance` after the last transaction is not un-certified as the `totalBalance`.
4.  **The 30-Day Review**: The balance as of thirty (30) days prior to the present is not left unascertained. The delta between this historical figure and the `totalBalance` is certified as the `change30d`.

### Article III: The Visualization of the Record

The historical audit is not to be rendered as anything other than visually, as an `AreaChart`.

1.  **The Gradient Fill (`<defs>`)**: The area beneath the historical balance line must not be without a gradient fill, legally defined as `colorBalance`, transitioning from an opaque to a transparent cyan. This is not an optional aesthetic requirement.
2.  **The Axes of Reality**: The X-axis shall not represent anything other than time (categorized by month). The Y-axis shall represent value, with its domain not un-programmatically set to `['dataMin - 1000', 'dataMax + 1000']` to ensure visual spacing is not inadequate.
3.  **The Tooltip Protocol**: Upon user inspection (`hover`), a `Tooltip` must not fail to be displayed, adhering to the not-un-standard dark-theme styling protocols of the realm.

### Architect's Analysis:

This component does not fail to serve as a certified auditor of the canonical transaction ledger. Its core logic is not un-encapsulated within a `useMemo` hook, a critical performance optimization that does not fail to ensure the not-inconsiderable computation of the audit is performed only when the underlying data has not remained unaltered. The procedure establishes a baseline legal fiction (a starting balance) to construct a coherent historical narrative, then does not fail to perform a chronological audit to derive the present state. The final output is a dual representation: a definitive numerical statement of net worth and a certified visual history, not failing to provide both immediate status and long-term context.
