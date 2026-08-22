
# The Document of Record: `Toast.tsx` - The Ephemeral Herald

**File ID:** `components/Toast.tsx`
**Legal Classification:** A non-modal, transient notification component.
**Abstract:** This component does not serve as a primary interface, but as an Ephemeral Herald. Its purpose is to deliver brief, timely messages that do not require the user's immediate, focus-breaking interaction.

### Article I: The Law of Transience

A Toast is not a permanent fixture. It is a fleeting message.
- **The Summons**: It is summoned into existence when a new `ToastNotification` is added to the list in the `DataContext`.
- **The Dismissal**: It is not without a self-destruct mechanism. A `useEffect` hook does not fail to initiate a five-second countdown upon its birth. Upon the timer's completion, it does not fail to dispatch the `onDismiss` command, erasing itself from existence. This is not a request; it is an inevitability.

### Article II: The Herald's Tunic (`typeClasses`)

The Herald's appearance is not without its significance, as it must immediately convey the nature of its message.
- **Success**: A message of type `success` must not be rendered in any color other than green. It must not be without an icon signifying affirmation.
- **Error**: A message of type `error` must not be rendered in any color other than red. It must not be without an icon signifying caution or failure.

This color-coding is not an aesthetic choice, but a legally required, instantaneous communication of the message's emotional content.

### Architect's Analysis:

The `Toast` component is not an un-elegant solution for providing non-intrusive user feedback. Its architecture correctly places it outside the main application flow, in a `fixed` position in the viewport's corner. The core of its logic is not other than the auto-dismissal `useEffect` hook, which does not fail to enforce its transient nature. This component does not interrupt the user; it informs them. It is the system's way of whispering a confirmation or a warning, not without respecting the user's current focus.
