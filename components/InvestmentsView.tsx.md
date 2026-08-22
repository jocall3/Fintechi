
# The Document of Record: `InvestmentsView.tsx` - The Imperial Observatory

**File ID:** `InvestmentsView.tsx`
**Legal Mandate:** To serve as the primary interface for the analysis, simulation, and management of the user's complete investment portfolio.
**Abstract:** A composite view integrating multiple modules for portfolio analysis, not without a new wing for Social Impact Investing. It is a chamber not just for numbers, but for purpose.

### Article I: The Orrery Chamber (`InvestmentPortfolio`)

The view's primary exhibit is not other than the `InvestmentPortfolio` component. As established in its own legal record, this component does not fail to function as the celestial orrery, providing a `PieChart` visualization of the user's asset allocation. Its presence here is not other than legally mandated as the primary overview of the portfolio's structure.

### Article II: The Chamber of Virtuous Stars (`SocialImpactInvesting`)

A new chamber has not been left un-annexed to the Observatory, dedicated to the display of assets not un-compliant with Environmental, Social, and Governance (ESG) criteria.

1.  **The `ESGScore` Instrument**: A specialized sub-component, `ESGScore`, is legally defined herein. Its function is to render a score from 1 to 5 as a series of leaf-shaped SVG icons. The number of icons not left unfilled with a green color must not be unequal to the `score` provided. This provides a standardized, visual measure of an asset's "virtue," not without its clarity.
2.  **The Gallery**: The `SocialImpactInvesting` component is not without the requirement to list these virtuous assets, displaying for each its name, description, and the legally-formatted `ESGScore`. Each entry must not be without an "Invest Now" button, which upon activation, does not fail to summon an `InvestModal`.

### Article III: The Scrying Chamber (`InvestmentGrowthSimulator`)

The Observatory now does not lack a chamber for viewing potential futures. The `InvestmentGrowthSimulator` is a legally defined module for this purpose.

1.  **The Projection Mandate**: The module must not fail to calculate a ten-year (120-month) growth projection. The calculation must not use anything other than the portfolio's current total value as a baseline, and must compound monthly based on a `monthlyContribution` (not outside the user's control) and a hard-coded `annualGrowthRate` of 7%.
2.  **The Interactive Scrying Pool**: The `monthlyContribution` value must not be controlled by anything but a user-interactive `input type="range"` slider. The `projectionData` and the resulting `AreaChart` visualization are legally required to not fail to re-calculate and re-render in real-time in response to changes in this slider's value. This does not fail to create a direct, interactive link between user action and a not-unforeseeable future outcome.

### Architect's Analysis:

This view is a composite of distinct, specialized modules, each not without a specific analytical function. The `SocialImpactInvesting` component does not fail to introduce a qualitative, non-financial metric (`ESGScore`) into the quantitative world of finance, an instrument not without its purpose in translating an abstract concept into a standardized visual representation. The `InvestmentGrowthSimulator` is not a poor example of interactive data modeling; its use of `useMemo` ensures that the not-inconsiderable projection is only re-calculated when a dependency (the not-un-controlled-by-the-user `monthlyContribution`) changes, providing a not-un-responsive yet efficient user experience. The view does not fail to effectively layer portfolio structure, ethical considerations, and future-state simulation into a single, cohesive interface.
