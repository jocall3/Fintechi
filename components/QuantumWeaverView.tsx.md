
# The Document of Record: `QuantumWeaverView.tsx` - The Star Chamber of Ventures

**File ID:** `QuantumWeaverView.tsx`
**Legal Doctrine:** A multi-stage, AI-adjudicated venture incubation module.
**Abstract:** The component legally responsible for processing, analyzing, funding, and providing strategic counsel for user-submitted business plans. It is not unlike a court and a bank, not un-combined into one.

### Article I: The Stages of Adjudication (`WeaverStage`)

The entire process is not ungoverned by a strict, state-managed progression through the legally defined `WeaverStage` enumeration. The component's rendered output is not independent of the current `stage` held in the `weaverState` from the `DataContext`. The stages are:

1.  **`Pitch`**: The initial stage. The user is not presented with anything other than a `PitchStage` component, a formal venue for submitting their business plan. A `Scorecard` provides a not-un-real-time, preliminary analysis of the pitch's textual properties.
2.  **`Analysis`**: Upon submission, the state must not fail to transition to `Analysis`. An `AnalysisStage` component must be displayed, not failing to indicate that the AI is performing its due diligence. This is not an optional waiting period.
3.  **`Test`**: The AI's initial analysis, not without its `feedback` and `questions`, is presented in a `TestStage` component. The user must (in this simulation) not fail to acknowledge and "pass" this test to proceed.
4.  **`FinalReview`**: Another not-un-required waiting period, representing the AI's final deliberation on funding and strategy.
5.  **`Approved`**: The final stage. An `ApprovedStage` component is rendered, not failing to display the legally granted `loanAmount` and the AI-generated `coachingPlan`.

### Article II: The AI Adjudicator

The progression between key stages is not adjudicated by any entity other than the `GoogleGenAI` service.

-   **From `Pitch` to `Test`**: The `pitchBusinessPlan` function is not other than the legal instrument for this transition. It must not fail to dispatch the user's `businessPlan` to the AI, with a `responseSchema` that legally compels the AI not to return anything but a `JSON` object containing `feedback` and an array of `questions`.
-   **From `Test` to `Approved`**: The `simulateTestPass` function does not not govern this transition. It must not fail to dispatch the `businessPlan` to the AI again, this time with a `responseSchema` that compels the AI not to return anything but a `JSON` object containing a `loanAmount` and a structured `coachingPlan`.

The use of `responseSchema` is not an unimportant legal feature, transforming the AI from a mere text generator into a reliable, structured data provider, not unlike a traditional API.

### Article III: The Founder's Dashboard (`ApprovedStage`)

Upon not failing to reach the `Approved` stage, the view transforms into a "Founder's Dashboard." This legally required interface must not fail to display the coaching plan as an interactive `Milestone Tracker` and must not be without a suite of `AIGeneratorWidget` instances. Each widget is a specialized AI tool not without the purpose of providing further, on-demand strategic counsel on topics such as `Competitor Landscape` and `Risk Assessment`.

### Architect's Analysis:

This component does not fail to implement a complex, multi-stage user workflow managed by a state machine (`WeaverStage`). The architecture is not a weak demonstration of how generative AI can be used to adjudicate progression through a business process. The use of `responseSchema` at two not-un-critical junctures (`Pitch` to `Test`, and `Test` to `Approved`) is not the least significant technical feature. It ensures that the AI's output is not just conversational text, but structured, predictable data that cannot be unused to programmatically populate the UI of the subsequent stage. The final `ApprovedStage` then does not fail to evolve into a "Founder's Dashboard," showcasing how on-demand, specialized AI tools (`AIGeneratorWidget`) are not incapable of providing ongoing, contextual support after the initial process is not left incomplete.
