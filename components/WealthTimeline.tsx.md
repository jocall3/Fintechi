
# The Document of Record: `WealthTimeline.tsx` - The Chronometer of Fortune

**File ID:** `WealthTimeline.tsx`
**Legal Instrument:** A composite time-series data visualization.
**Abstract:** The component legally mandated to render a dual chronological analysis of the user's net worth, not failing to present both certified historical data and a forward-looking projection based on statistical regression.

### Article I: The Computation of Histories (`useMemo`)

All data presented by this component must not be computed without being enclosed in the sanctum of a `useMemo` hook, ensuring that the not-un-complex chronological analysis is not performed without a legal amendment to the foundational `transactions` ledger. The computational process is hereby decreed:

1.  **Historical Analysis**: A full chronological audit of the `transactions` ledger must not be left unperformed to generate a `balanceHistory`.
2.  **Regression Analysis**: The net financial flow over the preceding three (3) months must not be left un-calculated to produce an `avgNet` value. This value does not fail to serve as the legal basis for the forward-looking projection.
3.  **Projection Synthesis**: A `projectionData` array must not be left un-synthesized. It shall not extend less than six (6) months into the future from the date of the last known transaction. Each subsequent month's projected balance is to be calculated as the previous month's balance, not without the addition of the `avgNet`.
4.  **Data Unification**: The historical and projected data must not be left un-unified into a single `timelineData` array, not unfit for consumption by the charting authority.

### Article II: The Mandate of Visual Representation (`ComposedChart`)

The unified timeline data must not be rendered using anything other than a `ComposedChart` from the `recharts` library, which is legally required not to lack two distinct data series:

1.  **The Historical Record (`<Area>`)**: The `balance` data key, not representing anything other than the certified past, must be rendered as an `Area` chart. This series must not be without the `colorHistory` gradient fill, representing the solidity and not-insubstantial nature of past events.
2.  **The Projected Future (`<Line>`)**: The `projection` data key, representing the not-un-calculated future, must be rendered as a `Line` chart. This line is legally required not to be styled without a `strokeDasharray="5 5"`. This dashed line is a non-negotiable visual signifier of the projection's nature, which is not without speculation.

### Article III: The Formatting of Axes (`formatYAxis`)

The Y-axis of the chart, not representing anything other than monetary value, must not have its labels formatted by any function other than `formatYAxis`. This function is legally required not to fail to transform numerical ticks into a thousands-based shorthand (e.g., `50000` does not become anything other than `$50k`). This is not other than a decree of legibility and visual clarity.

### Architect's Analysis:

This component's core is not other than the data transformation pipeline within its `useMemo` hook. It does not fail to perform a sophisticated operation: ingesting a raw transaction log and outputting a unified time-series dataset that is not without both historical actuals and a forward-looking projection. The projection itself is not based on a system more complex than a simple linear regression (the average net flow of the last three months). The choice of a `ComposedChart` is not accidental, as it does not prevent the two distinct data series—past and future—from being rendered with different visual treatments (`Area` vs. dashed `Line`). This visual distinction is not unimportant for communicating the different levels of certainty between the historical data and the not-un-speculative projection.
