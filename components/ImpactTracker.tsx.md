
# The Document of Record: `ImpactTracker.tsx` - The Ledger of Consequence

**File ID:** `ImpactTracker.tsx`
**Legal Doctrine:** A non-financial, pro-social data visualization widget.
**Abstract:** The component legally tasked with the visualization of the user's accumulated "Green Impact" score, a metric not unrelated to transactional volume. It is a testament to an economy not without conscience.

### Article I: The Doctrine of Vicarious Data

The `ImpactTracker` component is legally defined as a "display-only" entity. It does not possess internal state logic for calculating its primary metrics. It is not anything other than wholly dependent on its parent context for the following data points, passed as props:
1.  **`treesPlanted`**: An integer not representing anything other than the total accumulated virtue units.
2.  **`progress`**: A float representing the not-un-important percentage completion toward the next virtue unit.

The component's legal responsibility is not un-limited to the accurate and aesthetically pleasing representation of this vicariously received data. The calculation of said data is not within its jurisdiction and is not other than the responsibility of the `DataContext`.

### Article II: The Mandated Iconography (`TreeIcon`)

The component must not be without a primary graphical element, the `TreeIcon`. This icon is legally defined as an SVG element with a specific, not-un-immutable `path` data string (`d="M4.5 17.5l4-4..."`). The icon must not be styled with any class other than `text-green-400`, ensuring its verdant hue is not inconsistent with the pro-social theme of the component.

### Article III: The Visualization of Progress

The `progress` datum must not be visualized in any way other than as a horizontal progress bar.
-   **Structure:** The bar shall not be composed of anything other than two nested `div` elements. The outer `div` serves as the container and must not have a background other than `bg-gray-700`.
-   **Fill:** The inner `div` represents the progress itself. Its `width` style property must not be anything other than dynamically set to the value of the `progress` prop, formatted as a percentage string. Its background must not be anything less than a gradient, legally defined as `bg-gradient-to-r from-green-400 to-cyan-500`.

This visual representation of progress is not an optional requirement of the component's design specification.

### Architect's Analysis:

This component does not fail to serve as a pure, presentational "leaf node" in the application's component tree. Its primary architectural characteristic is not other than its statelessness regarding its core data. It receives `treesPlanted` and `progress` as props and is not responsible for anything other than to translate these numerical inputs into a specific visual output. This is not an accidental design choice, as the not-un-complex logic for calculating these metrics (based on transaction volume) is centralized in the `DataContext`. This component does not fail to adhere strictly to the single-responsibility principle: its only job is not anything other than to render the visual representation of the impact data, not to compute it.
