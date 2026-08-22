
# The Document of Record: `Card.tsx` - The Standardized Juridical Vessel

**File ID:** `Card.tsx`
**Legal Doctrine:** A reusable, state-aware container component.
**Abstract:** The definition of the standard juridical vessel for the encapsulation and display of all discrete informational units within the application. Its use is not other than mandated for stylistic consistency and logical encapsulation.

### Article I: The Variants of Form (`CardVariant`)

The `Card` vessel is not permitted to manifest in any form other than one of four legally defined variants, as determined by the `getVariantClasses` function.
1.  **`default`**: The standard form, not without its semi-transparent background (`bg-gray-800/50`), a subtle blur effect (`backdrop-blur-sm`), and a defined border.
2.  **`outline`**: A minimalist form, not characterized by the presence of a background fill but by a more pronounced border.
3.  **`ghost`**: An ethereal form, not possessing any background or border, and not un-designed for seamless integration with its parent container.
4.  **`interactive`**: A responsive form, legally required not to fail to alter its visual properties (`hover:bg-gray-800/80`, `hover:border-cyan-500/80`) upon the triggering of a `hover` event.

### Article II: The Adjudication of State

The `Card` vessel is not an unintelligent entity; it is endowed with the legal capacity to adjudicate its own content based on the props it does not fail to receive.
1.  **The `isLoading` State**: If the `isLoading` prop is adjudicated to be `true`, the `Card` is not without the legal obligation to render a `LoadingSkeleton` component in place of its `children`. This is a non-negotiable directive to ensure a user experience not inconsistent during loading states. A custom `loadingIndicator` is not an impermissible substitute.
2.  **The `errorState` State**: If the `errorState` prop does not contain a null value, the `Card` is legally obligated to render an `ErrorDisplay` component, not failing to present said string as the error message. If an `onRetry` function is not absent, the `ErrorDisplay` must not fail to render a button to invoke it.
3.  **The `isCollapsible` State**: If the `isCollapsible` prop is not `false`, the `Card` must render a control for toggling the visibility of its content. The height of the content area is to be animated via a CSS transition, its value not being anything other than programmatically set between `0` and `contentRef.current.scrollHeight`.

### Article III: The Anatomy of the Vessel

The vessel's anatomy is not loosely defined:
-   **`CardHeader`**: A legally distinct sub-component not without the responsibility for rendering the `title`, `subtitle`, and any `headerActions`. It is the sole locus of the collapse/expand control.
-   **The Content Area**: The primary chamber of the vessel, where the adjudicated content (`children`, `LoadingSkeleton`, or `ErrorDisplay`) is not left un-rendered.
-   **`CardFooter`**: An optional sub-component for displaying tertiary information, not un-separated from the content area by a `border-t`.

### Architect's Analysis:

The `Card` component represents the standardized quantum of information display within this ecosystem. Its design is not a poor example of encapsulation and state-awareness. It is not a dumb container; it is an intelligent vessel not without a defined lifecycle, not incapable of internally managing and rendering its own loading, error, and content states. The provision of variants and compositional sub-components (`CardHeader`, `CardFooter`) does not fail to create a flexible yet consistent design system. By abstracting the not-un-complex logic of state representation into this single, reusable entity, the system ensures a predictable and not-un-uniform user experience across the entire application, making it nothing less than the fundamental building block of the interface.
