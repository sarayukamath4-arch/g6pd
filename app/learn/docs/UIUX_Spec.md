Document 2: UI/UX Specification Document (Optimized for Devin AI CLI)
System Overview & Design Guidelines
Target Viewport: Mobile-first design (375px width baseline), responsive up to desktop screens (1440px).

Design System: Tailwind CSS with shadcn/ui primitives.

Color Palette:

Brand Primary: Deep Emerald (#059669 / bg-emerald-600)

Evidence Badges:

High Risk: Amber Alert (bg-amber-100 text-amber-900 border-amber-300)

Low Risk: Info Blue (bg-blue-100 text-blue-900 border-blue-300)

Inconclusive: Muted Gray (bg-slate-100 text-slate-800 border-slate-300)

No Documented Relation: Neutral Green (bg-emerald-50 text-emerald-800 border-emerald-200)

Backgrounds: Slate Neutral (bg-slate-50 light mode background, bg-white cards).

Screen Architecture & Route Map
/ (Root)
├── /onboarding (Medical Terms & Disclaimer Modal)
├── /auth (Login / Sign-Up with Email + Google OAuth)
└── /app (Protected Layout with Shell Navigation)
    ├── /app/learn (Dashboard & Condition Evidence Search)
    │   └── /app/learn/quiz/[moduleId]
    ├── /app/scan (Product Label OCR Scanner & Verification)
    ├── /app/journal (Reaction Log & Multi-Entry Pattern Engine)
    └── /app/profile (Data Export PDF, Disclaimers, & Account Settings)
Detailed UI/UX Specifications per Screen
1. App Shell Layout (/app/layout.tsx)
Mobile View: Bottom fixed navigation bar (sm:hidden) with 4 icons:

Learn (BookOpen icon)

Scan (Camera floating action button in center)

Journal (ClipboardList icon)

Profile (User icon)

Desktop View: Left persistent sidebar (hidden sm:flex w-64) with brand logo, vertical nav link list, and user profile badge at the bottom.

2. Learn & Substance Search Screen (/app/learn/page.tsx)
Layout & Components:
Header Banner: Displays condition title ("G6PD Deficiency Reference Guide") and optional "Knowledge Score" progress bar.

Search Bar Component:

Input field with Search icon and placeholder: "Search medication, food, or chemical name..."

Integrates Supabase PostgreSQL Full-Text Search with pg_trgm fuzzy matching across canonical names and synonyms.

Empty state displays quick suggestion pill buttons: [Aspirin] [Fava Beans] [Menthol] [Ascorbic Acid].

Search Results View:

Displays a list of cards for matching substances.

Card Elements:

Substance Name + Category Tag (e.g., Medication).

Evidence Badge (e.g., High Risk or Low Risk).

Accordion expandable section: "Clinical Evidence & Sources" displaying the citation link and clinical summary.

Educational Modules Carousel: Horizontal scroll view of card components for short lessons (e.g., "Understanding Hemolysis", "Navigating Food Labels") leading to /app/learn/quiz/[moduleId].

3. Product Scanner Screen (/app/scan/page.tsx)
Workflow & States:
[ Camera / Upload View ] ──> [ Processing Loading State ] ──> [ Verification Modal ] ──> [ Save to Journal ]
Step 1: Capture View

Live camera view or file upload dropzone for product label images.

Action button: "Scan Product Label".

Step 2: Processing Overlay

Fullscreen modal with spinner and text: "Extracting ingredients via Groq Vision..."

Client-side image compression step before API dispatch (max 1024x1024 resolution).

10-second timeout handling with error fallback to manual entry if API fails.

Step 3: Verification & Unmatched Resolver Modal

Displays extracted product metadata fields: Product Name (editable input) and Date of Exposure.

Extracted Ingredients Grid: Rendered as interactive editable chips/tags.

User can tap x on a chip to remove an incorrectly read ingredient.

User can click + Add Ingredient to manually append text items.

Ingredients matching known G6PD triggers show a small warning indicator badge next to the tag.

Primary Action Button: "Confirm Ingredients & Continue to Reaction Journal".

4. Journal & Pattern Analysis Screen (/app/journal/page.tsx)
Components & Interactions:
Tab Switcher: Toggle between [ Reaction Timeline ] and [ Pattern Insights ].

Reaction Timeline View:
Chronological list of logged reactions.

Entry Card Structure:

Product Name & Exposure Date.

Severity Badge (Mild = Yellow, Moderate = Orange, Severe = Red).

Collapsible list of scanned/entered ingredients.

Option to attach label photo preview thumbnail.

Multi-select checkbox on top-right of each card for pattern comparison.

Pattern Insights View (Shared Ingredient Engine):
Displays auto-analyzed background suggestions or manual checkbox comparisons.

Header Banner: Spans a non-dismissible notification box:

"Observational Pattern Notice: Common shared ingredients listed below represent observational correlation, not clinical diagnosis or confirmed medical causation."

Shared Ingredient Summary Card:

Displays ingredients ranked by occurrence count (e.g., "Ingredient X appears in 3 of your logged reactions").

Filter options: Filter by date range (Last 30 Days, 6 Months, All Time).

5. Data Export & Profile Screen (/app/profile/page.tsx)
Features & Layout:
User Profile Card: Displays account email and date of disclaimer acceptance.

Clinical PDF Generator Section:

Select Date Range dropdown: [ Last 30 Days | Last 6 Months | All Time ].

Button: [ Download Doctor Report (PDF) ].

Generated PDF includes:

Patient metadata & export date.

Concise log of all entries, severities, and observed symptoms.

Matrix of top recurring ingredients across entries.

Formatted clinical footnote disclaimer for reviewing physicians.

Account Controls:

Toggle for optional local 4-digit PIN lock.

Button: [ Delete Account & Purge Data ] (triggers confirmation dialog executing a hard delete on Supabase profile data).

State & Error Handling Guidelines for Devin AI CLI
Empty States:

Journal: Render graphic illustration + text "No reactions logged yet. Scan a product label or log a reaction to start tracking patterns."

Search: Display popular trigger tags when no search term is entered.

Offline Handling:

Store pending journal submissions in client IndexedDB when offline.

Display top banner alert: "Offline Mode — Reactions queued locally. Syncing when reconnected."

Scan Limits:

Enforce a client/API limit of 25 scans per user/day. Show toast alert if limit is exceeded: "Daily scan limit reached. You can still enter ingredients manually."