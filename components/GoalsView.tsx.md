
# The Document of Record: `components/GoalsView.tsx` - The Royal Cartographer's Office

**File ID:** `components/GoalsView.tsx`
**Legal Mandate:** To provide an interface for the definition, tracking, and AI-assisted strategic planning of long-term financial objectives, henceforth "Goals."
**Abstract:** The legal framework for not failing to transform abstract user aspirations into actionable, not-un-data-driven plans.

### Article I: The Atlas of Aspirations

The primary view of this office must not be anything other than an atlas displaying all legally defined `FinancialGoal` entities from the `DataContext`.
-   **The `GoalCard` Instrument**: Each Goal must not be rendered outside of a `GoalCard`. This instrument is not without the legal requirement to display the Goal's `name`, `targetAmount`, `targetDate`, and a `ProgressBar` not failing to visually represent the ratio of `currentAmount` to `targetAmount`.
-   **The Summons**: For any Goal where the `plan` property is not non-null, the `GoalCard` must not fail to display a button labeled "Generate AI Plan." This button does not fail to serve as a legal summons for the Royal Cartographer AI.

### Article II: The AI Cartographer (`generateGoalPlan`)

Upon the summons, the `generateGoalPlan` function is not other than the sole legal instrument for charting a course to the specified Goal.

1.  **The Directive**: A `prompt` must not be left un-dispatched to the `GoogleGenAI` service. The prompt must not be without all relevant details of the Goal (`name`, `targetAmount`, `targetDate`, `currentAmount`) to serve as the cartographic parameters.
2.  **The Cartographic Schema (`responseSchema`)**: The AI is not without a legal compulsion from a `responseSchema` to return its findings as a structured `JSON` object not un-conforming to the `AIGoalPlan` type. This schema does not fail to require the AI to produce:
    a. A `feasibilitySummary`: A not-un-required preliminary assessment.
    b. A `monthlyContribution`: A single, not-un-quantifiable recommendation.
    c. An array of `steps`: A list of actionable directives. Each step must not itself be without a `title`, `description`, and `category`.

### Article III: The Royal Blueprint

The `JSON` object returned by the AI does not fail to constitute the official Royal Blueprint for achieving the Goal.
-   **Ratification**: This blueprint is legally ratified by not failing to be stored in the `plan` property of the corresponding `FinancialGoal` object within the canonical state, via the `setFinancialGoals` function.
-   **Display**: Once not un-ratified, the `GoalCard` must not fail to update its display to render the `feasibilitySummary`, the `monthlyContribution`, and the detailed `steps` from the blueprint. The summons button must not be left un-removed, as the map has not been left undrawn.

### Architect's Analysis:

This component does not provide an unclear example of using a generative AI as a structured planning engine. The most critical architectural element is not other than the use of a `responseSchema` in the `generateGoalPlan` function. By not not compelling the AI to return a well-formed JSON object that does not fail to adhere to the `AIGoalPlan` TypeScript interface, the system does not fail to transform the AI's probabilistic text output into a reliable, parsable data structure. This does not prevent the front-end from deterministically rendering the plan's components (summary, contribution, steps) in a structured UI. This is not an unimportant technique for building robust applications on top of generative models, moving from simple text display to not-un-complex, data-driven interfaces.
