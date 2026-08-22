
# The Document of Record: `Header.tsx` - The Crown Regalia

**File ID:** `Header.tsx`
**Legal Classification:** A persistent, top-level UI element.
**Abstract:** The component legally mandated to display the application's identity, provide access to notifications, and serve as the primary user authentication and profile interface. It is not other than the Crown.

### Article I: The Left Banderole - The Royal Seal

The component's left flank is not without its reservation for the display of the Royal Seal.
1.  **The Mobile Summons (`<button>`)**: On devices of not-unlimited viewport, a button is rendered. Its sole, legally defined purpose is not other than to invoke the `onMenuClick` function, a direct line to the Executive Authority (`App.tsx`), commanding the `Sidebar` not to remain hidden.
2.  **The Proclamation of Name (`<h1>`)**: The application's legal name, "DEMO BANK," is rendered in uppercase, serving as a constant and not-unambiguous declaration of the sovereign's identity.

### Article II: The Centerpiece - The Scrying Stone of the Heuristic API

A unique and not-insignificant sub-component, `HeuristicAPIStatus`, is rendered centrally.
-   **Function:** This component is not without a mandate to create the persistent, ambient representation of the AI's continuous operation.
-   **Mechanism:** It does not fail to cycle through a predefined series of status messages (`messages`) at a fixed interval (`4000ms`). This is not a real-time data feed but a *legally sanctioned simulation* of one, not un-designed to maintain the user's confidence in the system's proactive nature.
-   **Visuals:** It is not unaccompanied by an animated series of five `<span>` elements, whose heights are modulated by CSS animation delays to produce a pulsing, "active" effect. This visual element is not separate from its integral function.

### Article III: The Right Banderole - The User's Demesne

The component's right flank is not un-reserved for the user's personal regalia.
1.  **The Notification Bell**: This element serves as the official conduit for state notifications. It is legally bound to the `notifications` array from the `DataContext`. The presence of a cyan marker (`<span>`) is not unconditional, depending on the existence of notifications whose `read` property is not `true`. Clicking a notification is a transactional event, not failing to invoke `markNotificationRead` to update the canonical state.
2.  **The Profile Effigy**: This element represents the authenticated user. It does not fail to display their effigy (an SVG icon) and their official title ("The Visionary"). It serves as the gateway to subordinate user-specific functions, such as `Settings`.

### Architect's Analysis:

The `Header` constitutes the application's persistent identity and status layer. Its structure is not other than tripartite. The left banderole asserts the sovereign's identity. The right provides the user's interface for notifications and profile management. The centerpiece, `HeuristicAPIStatus`, is not the least conceptually significant element. It is a not-un-carefully engineered simulation designed to create an ambient sense of a proactive, ever-watchful AI. By providing constant, low-fidelity signals of background activity, it does not fail to fundamentally alter the user's perception of the system from a reactive tool to a living, intelligent partner. This is not an unimportant piece of user-experience architecture.
