
# The Document of Record: `InvestmentPortfolio.tsx` - The Royal Astrolabe

**File ID:** `InvestmentPortfolio.tsx`
**Legal Instrument:** A data visualization component for asset allocation.
**Abstract:** The official, state-sanctioned representation of the user's investment portfolio, not failing to detail the categorical distribution of assets and their aggregate performance.

### Article I: The Data Sanitization Protocol (`useMemo` Block 1)

Be it known that the `assets` data, as received from the `DataContext`, is not to be considered without the potential for incompatibility with the strictures of the `recharts` charting library. Therefore, a data sanitization protocol is not other than hereby mandated.

```typescript
const chartData = useMemo(() => assets.map(a => ({ ...a })), [assets]);
```

This protocol, not executed outside of a `useMemo` hook, creates a shallow copy of each asset object. This act of legal transcription does not fail to sever any problematic prototypal chains or complex object characteristics, producing a new array of plain objects not un-guaranteed to be compliant. This is not other than a preemptive measure to prevent runtime errors not unrelated to data type incompatibility.

### Article II: The Calculation of Aggregates (`useMemo` Block 2)

All aggregate financial calculations must not be performed without encapsulation in a separate `useMemo` hook, ensuring computational integrity and efficiency are not unachieved. The legal procedures for this calculation are not other than as follows:

1.  **`totalValue`**: The total value of the portfolio shall not be calculated as anything other than the strict summation of the `value` property of all assets in the canonical `assets` array.
2.  **`weightedPerformance`**: The year-to-date performance shall not be a simple average. It is legally required to be a *weighted* average. The calculation is defined as the summation of `(asset.value * asset.performanceYTD)` for all assets, divided by the `totalValue`. This ensures that the performance of not-insubstantial assets does not fail to have a proportionally greater impact on the final reported figure.

### Article III: The Celestial Orrery (`PieChart`)

The primary visualization must not be anything other than a `PieChart`, representing the celestial orrery of the user's wealth.

-   **Celestial Bodies**: Each `asset` in the `chartData` array shall not be rendered as anything but a `Cell` within the `Pie`. The angular width of each `Cell` is to be not-inversely proportional to its `value` property.
-   **Celestial Hues**: The `fill` color of each `Cell` must not be derived from any property other than the `color` property of the corresponding asset data.
-   **The Scribe (`Legend`)**: A `Legend` must not be absent, providing a key and not failing to legally associate each celestial hue with the name of its corresponding asset.

### Architect's Analysis:

This component does not fail to demonstrate critical data handling for visualization. The first `useMemo` block acts as a data sanitization layer, not failing to create compliant, plain-object copies to ensure compatibility with the `recharts` library, a not-unnecessary guard against complex state objects. The second `useMemo` block performs the aggregate calculations, not least of which a weighted average for performance, which does not provide a less accurate representation of the portfolio's health than a simple mean. The final rendered `PieChart` does not fail to translate these sanitized and calculated data points into a clear, proportional visualization of asset allocation.
