# BigPicturePland.md

## A) Technical task description

Build one deployed web product that evaluates GitHub pull requests for a public repository and presents the outcome in a polished, conversion-oriented interface. The product has three connected parts: a marketing landing page, a server-side analysis flow, and a results dashboard. The landing page should visually follow the passport-photo.online homepage language where it makes sense, but be adapted into a reusable internal design system instead of hardcoded one-off sections. The backend should stay intentionally lean: reliable enough to fetch repository data, score merged pull requests, and return structured results, but not overbuilt.

### Product scope

- **Landing page** explaining the product, showing credibility, presenting the 3 scoring dimensions, previewing the output, and letting the user submit a GitHub repository URL.
- **Analysis backend** accepting a public GitHub repository URL, loading merged pull requests, collecting metadata needed for scoring, sending normalized input to an LLM, validating the response, and returning repository-level and PR-level scores.
- **Results dashboard** showing an overall repository score, score breakdown by dimension, and a sortable/filterable PR list with lightweight diff access and useful metadata.

### Target stack fit

- **Framework:** Next.js with App Router for one deployable full-stack app.
- **Language:** TypeScript across app, server, schemas, and utilities.
- **Styling:** Tailwind CSS with extracted design tokens and shared UI primitives.
- **Hosting:** Vercel for the simplest deployment path and easy environment variable management.
- **Component workbench:** Storybook to recreate and stabilize the design system before page assembly.

### Architecture direction

Use a **feature-driven structure** instead of page-driven sprawl. Keep route concerns in `app/`, domain logic in `features/`, and reusable low-level pieces in `shared/`.

```txt
src/
  app/
    (marketing)/page.tsx
    analyze/route.ts
    results/[repoId]/page.tsx
  features/
    design-system/
    landing/
    repo-input/
    pr-analysis/
    results-dashboard/
    results-table/
  shared/
    ui/
    lib/
    types/
    config/
```

### Core feature boundaries

- **design-system** — tokens, typography, spacing rules, surfaces, buttons, cards, badges, stat blocks.
- **landing** — hero, social proof, how-it-works, scoring explanation, preview, footer.
- **repo-input** — URL parsing, validation, submit UX, CTA state, redirect/transition into analysis.
- **pr-analysis** — GitHub client, repository parser, merged PR fetching, normalization, scoring orchestration, error mapping.
- **results-dashboard** — aggregate score cards, charts, repository summary, recommendations.
- **results-table** — PR rows/cards, sorting, filtering, size metadata, score display, diff links.

### Backend behavior

The analysis flow should:

1. Validate and normalize a GitHub repository URL.
2. Load repository details and merged pull requests from GitHub.
3. For each analyzed PR, collect title, description, author, changed files count, additions, deletions, and lightweight file/diff context.
4. Limit analysis to a practical, explicit PR sample size to stay within time and token budget.
5. Build one structured scoring payload for the LLM.
6. Parse and validate structured output into 3 dimensions: **Impact**, **AI-Leverage**, and **Quality**, plus weighted total.
7. Aggregate repository-level results.
8. Store cached results under a deterministic repository key.

### Technical constraints that matter

- The backend must handle invalid URL, private repository, missing merged PRs, GitHub rate limit, upstream API failure, and malformed LLM output gracefully.
- The landing page must be responsive, SEO-friendly, trigger a real analysis flow from the URL field, include at least one animation, and stay fast on mobile.
- The dashboard must stay visually consistent with the landing page and support filtering and sorting across visible PR fields.
- The task explicitly rewards prioritization, not overengineering. Frontend quality, architecture, and performance carry more weight than an oversized backend.

### Recommended implementation choices

- Use **Server Components by default** and keep interactivity isolated to repo input, filters, sorting, and chart wrappers.
- Use a **route handler** or equivalent server endpoint for analysis so secrets stay server-side.
- Use **Zod** for request/response validation, especially for LLM output.
- Use ** REST** instead of GraphQL for faster implementation and direct PR/files access.
- Use a **small cache layer** keyed by normalized repo identifier and analysis options.
- Keep charts lightweight and avoid shipping large client bundles to the landing page.
- Build design tokens first, then primitives, then sections, then pages.

### Design system approach

Do not build pages first. First extract the visual language into tokens and shared components, then reproduce it in Storybook. That gives a controlled base for both landing page and dashboard and avoids inconsistent spacing, typography, and ad hoc component styles. The first Storybook pass should focus on the **user-facing role**: hero typography, CTA buttons, inputs, stat cards, section containers, trust logo strip, score badge, table row, empty state, and loading placeholders.

### Delivery mindset

This should look like a coherent product, not three disconnected screens. One design language, one routing flow, one scoring model, one deploy. The README should later justify scoring weights, technical choices, prioritization cuts, and next-step improvements because the brief explicitly expects independent decisions to be explained.

---

## B) High level implementation plan for the agent

1. [x] Set up the Next.js app with App Router, TypeScript, Tailwind, basic linting/formatting, and the initial feature-driven folder structure.
   Milestone context: The app uses Next.js App Router (`src/app`), TypeScript (`tsconfig.json` + typed route files), Tailwind v4 (`src/app/globals.css` with `@import "tailwindcss"`), and ESLint via `eslint.config.mjs` + `npm run lint`. Initial feature-driven structure is now in place under `src/features/*` and `src/shared/*` (kept intentionally empty with `.gitkeep` placeholders) so next milestones can add domain logic without restructuring routes.
2. [x] Define the design tokens, typography scale, spacing system, and shared layout primitives based on the reference visual language.
   Milestone context: `src/app/globals.css` now contains the Tailwind v4 token layer for the product palette, Inter/PT Serif font hooks, radius and shadow tokens, responsive type helpers, and shared component classes (`ds-container`, `ds-section`, `ds-button-*`, `ds-input`, `ds-card`, `ds-nav`, `ds-trust-bar`). `src/app/layout.tsx` wires the font variables into the app shell so later landing and dashboard work can consume one consistent language without re-declaring core styles.
3. [x] Create Storybook and “recreate enough of the visual language to ship the landing and dashboard fast.
   Milestone context: Storybook is configured via `.storybook/main.ts` and `.storybook/preview.ts` to load only `src/features/design-system/stories/**` and reuse the app token layer from `src/app/globals.css`. The initial shipping-oriented story set is in place for foundations (`Colors`, `Typography`), primitives (`Button`, `Input`, `Card`), layout rhythm (`Container Section`), and reusable landing compositions (`Hero`, `Trust Strip`) so LP and dashboard sections can be assembled from validated visual blocks instead of ad hoc styling.
4. [x] Build the simple landing page from those reusable components, starting with the hero and repo URL input flow.
   Milestone context: The marketing route at `src/app/page.tsx` now renders a real landing hero via `src/features/landing/landing-hero.tsx` instead of the earlier text stub. The hero stays intentionally narrow for this milestone: one centered editorial headline, supporting copy, subtle background shapes, and a pill row built directly from the token classes in `src/app/globals.css`. The repo entry UI lives in `src/features/repo-input/repo-url-hero-form.tsx` as a small client component with a large URL input, submit button, browser-native URL validation, and a lightweight submitted-state preview. This gives the page a usable hero/input flow without pulling step 6 URL parsing contracts or step 10 live analysis wiring forward too early.
5. [x] Add the remaining landing sections: social proof, how-it-works, scoring dimensions, dashboard preview, and footer.
   Milestone context: The marketing route is now a complete landing page instead of a hero-only stub. `src/features/landing/landing-sections.tsx` adds the remaining section stack as reusable page compositions: a trust/social-proof band, a 3-step how-it-works explainer, the 3 scoring-dimension cards, a dashboard preview built from static score and PR breakdown blocks, and a lightweight footer with section anchors. `src/app/page.tsx` now renders the full stack under one `main` landmark, while the hero and repo input were tightened to match the production landing language rather than the earlier step-marker prototype. Shared UI polish also moved slightly down into the token layer in `src/app/globals.css` so buttons and inputs now expose visible `focus-visible` states across the landing experience.
6. [x] Implement repository URL parsing and validation, and define the analysis request/response contracts shared by the landing flow and results page.
   Milestone context: Repository input is now normalized through `src/features/pr-analysis/lib/repository-url.ts`, which accepts supported `github.com/owner/repo` URL variants, strips trailing slash or `.git`, and returns typed domain errors for unsupported hosts or non-root GitHub paths. Shared request/response contracts live in `src/features/pr-analysis/contracts/analysis-contracts.ts` using Zod so both the landing flow and future results page can rely on one source of truth for request payloads, normalized repository identity, API success/error responses, and a minimal persisted-analysis shell. The new route handler at `src/app/api/analyze/route.ts` completes the milestone by validating JSON input, reusing the parser, mapping bad input into typed `400` responses, and returning a placeholder success payload with an opaque `repoId` plus `/results/{repoId}` redirect target without pulling GitHub fetching or scoring forward too early.
7. [x] Build the server analysis flow for GitHub repositories, including merged PR fetching, normalization, and clear error mapping.
   Milestone context: The analyze backend now performs a real GitHub preflight instead of returning a pure stub. `src/features/pr-analysis/lib/github-api-client.ts` wraps Octokit with optional `GITHUB_TOKEN` usage and anonymous fallback, while `load-github-repository.ts`, `load-merged-pull-requests.ts`, and `prepare-repository-analysis-source.ts` validate public repository access, collect up to 20 merged pull requests, and normalize repository/PR metadata into a shared source shape for later scoring. Error handling was tightened around typed GitHub failure cases (`REPOSITORY_NOT_FOUND_OR_PRIVATE`, `NO_MERGED_PULL_REQUESTS`, `GITHUB_RATE_LIMITED`, `GITHUB_UPSTREAM_ERROR`) through `analysis-api-errors.ts` and `github-analysis-errors.ts`, so `src/app/api/analyze/route.ts` can stay transport-thin and still return stable success payloads (`repository`, `repoId`, `redirectUrl`) plus clear status-coded failures without pulling LLM scoring, persistence, or landing-page wiring forward too early.
8. [x] Wire the landing page submit button to the real `/api/analyze` flow and validate manual success/error behavior end-to-end from the hero form.
9. [x] Add the LLM scoring pipeline with structured output validation and repository-level aggregation.
   Milestone context: The analyze backend now has a complete scoring pipeline shape around real PR evidence. `prepare-repository-scoring-source.ts` trims the broader GitHub sample down to the first 8 PRs, attaches lightweight changed-file context for each one, and hands that evidence into `run-repository-scoring.ts`, which validates raw score payloads with Zod, keeps successful PR scores, and records skipped PRs with typed reasons instead of failing the whole analysis on one bad result. Score normalization and repository aggregation live on the server in `score-repository-analysis.ts`, so `/api/analyze` returns stable repository summary metrics, per-PR scores, and skipped counts from one backend-owned scoring flow instead of UI-side math.
10. [x] Connect the server analysis flow to a real LLM provider with a single server-side scoring client, environment-based configuration, and structured response handling.
    Milestone context: `/api/analyze` now uses a real Gemini scorer instead of the earlier local stub. `src/features/pr-analysis/lib/gemini-client.ts` creates a server-only `@google/genai` client from `GOOGLE_API_KEY`, `build-pr-scoring-prompt.ts` turns one prepared PR into a compact evidence prompt, and `score-pull-request-with-gemini.ts` calls `gemini-3-flash-preview` with `responseMimeType: "application/json"` plus a forced response JSON schema so the model is asked for a strict object shape instead of free-form text. The existing Zod validation in `run-repository-scoring.ts` stays in place as a second boundary check, which means malformed provider output still becomes a typed skipped-PR result rather than corrupting the analysis payload.
11. [x] Build the dashboard shell with total score, dimension breakdown, repository summary, and loading/error/empty states.
    Milestone context: The app now has a real results route at `src/app/results/[repoId]/page.tsx` instead of redirecting into a missing page. Step 11 intentionally stays UI-first and same-tab only: the landing submit flow stores the typed `/api/analyze` success payload in browser session state through `src/features/results-dashboard/results-session.ts`, then the new dashboard shell restores and re-validates it on navigation so users can immediately see real repository analysis without waiting for persistence work. The dashboard surface itself lives in `src/features/results-dashboard/*` and now covers the required shell states: a summary-first success view with total repository score, three dimension bars, repository metadata cards, and top-PR preview cards; a dashboard-shaped loading skeleton while the client restores session data; an empty state for direct visits/new tabs without stored results; and an error state for corrupted or mismatched session payloads. The landing wait state was also upgraded from a single status line into a richer hero loading panel with phase-based analysis messaging, so the end-to-end flow now feels like one coherent product path even though refresh-safe persistence and the full sortable PR list are still deferred to later milestones.
12. [omitted] Persist analysis results under a deterministic key and expose a stable results route for revisits and shareability.
    Milestone context: This milestone was intentionally deferred to keep backend scope lean for the assignment. The current results route works immediately after analysis through a same-tab session bridge, which is enough for the core landing → analyze → dashboard flow, but it does not survive refresh, new tabs, or shared links. A future implementation should add a small persistent store keyed by `repoId` so repeated submissions can reuse existing analyses instead of rerunning GitHub fetches and LLM scoring, and so `/results/[repoId]` becomes a real shareable URL for other users.
13. [x] Implement the PR results list with sorting, filtering, score display, metadata, and external diff links.
    Milestone context: The results dashboard now includes a full interactive PR list under `src/features/results-table/*`, wired into the existing summary view from `src/features/results-dashboard/results-dashboard-success.tsx`. `results-table-state.ts` owns the client-side list model: it parses and serializes URL query params, filters by author/search/size bucket/minimum scores, and sorts by merged date, author, size, and all four scores so the list state stays shareable within the current session route. The UI stays inside the existing Passport-inspired design system instead of introducing a data-grid library: desktop gets a semantic sortable table, mobile gets stacked PR cards, each row/card shows title, summary, author, merged date, diff size metadata, score pills, and direct `Open PR` / `View Diff` GitHub actions.
14. [x] run overall design QA and copy review across the landing page and dashboard so spacing, hierarchy, tone, labels, and empty/error/loading text feel deliberate and consistent.
    Milestone context: The first results-page QA pass is now complete. `src/features/results-dashboard/results-dashboard-success.tsx` was reworked so the repository score reads as a stronger hero element, the summary panel gained a lightweight radar visualization through `src/features/results-dashboard/results-score-radar-chart.tsx`, and the supporting breakdown copy/cards were tightened so the top section feels less like raw backend output. The PR preview and results list were also polished in-place: preview cards now use clearer metadata grouping, semantic diff stat colors, and stronger actions, while `src/features/results-table/*` gained a more deliberate filter tray, denser desktop score cells, upgraded mobile cards, and more product-quality helper/empty/sorting copy without changing the underlying filter or sort behavior.
15. [x] ensure performance budgets are enforced on the landing page, with minimal client JavaScript, optimized assets, and strong mobile Lighthouse results.
    Milestone context: The landing page performance budget is now enforced both in code and in CI. The main hero content in `src/features/landing/landing-hero.tsx` no longer starts hidden behind an intro animation, which keeps the LCP candidate visible on first paint instead of delaying Lighthouse’s above-the-fold render detection. The landing form in `src/features/repo-input/repo-url-hero-form.tsx` was also trimmed so submit-only logic is loaded on demand through dynamic imports, rather than pulling the analyze/session helpers and contract-validation path into the initial landing bundle. Below-the-fold landing bands now use the shared `ds-deferred-section` utility in `src/app/globals.css`, which applies `content-visibility: auto` to `src/features/landing/sections/*` so the hero can render first with less work. Finally, `.lighthouserc.json` was tightened from warning-level `0.8` assertions to error-level `0.9` assertions for performance, accessibility, best practices, and SEO, so the repo now enforces the brief’s landing-page quality bar instead of treating it as advisory only.
16. [x] add a dedicated landing-page style and wow-factor pass so the homepage feels closer to the brief’s “top frontend” bar through stronger visual moments, tighter section composition, richer art direction, and one memorable interaction or detail.
    Milestone context: The landing hero in `src/features/landing/landing-hero.tsx` now behaves more like a deliberate review stage than a plain split hero. The composition was tightened into one surfaced hero frame with stronger depth, a clearer supporting trust rail, and a more editorial preview arrangement. The memorable interaction lives in `src/features/landing/landing-hero-preview.tsx`: when the repository input receives focus, the stacked review preview subtly shifts into an “analysis mode” with a score-circle emphasis, a scan-light sweep across the card, and a status badge swap to `Reading merged PRs`. The pass stays lightweight on purpose: no new animation libraries, no heavy client choreography, only transform/opacity-based motion tied to existing focus and hover states so the landing page keeps the performance posture established in milestone 15.
17.   [omitted] run a copy refinement pass across the landing page and dashboard so headlines, helper text, errors, loading states, and CTA language feel sharp, consistent, and intentional.
18.  [omitted] ensure test coverage is done for URL parsing, scoring payload/schema validation, critical UI states, and at least one end-to-end happy path.
19. [omitted] ensure caching is done for repeated repository analyses so rate-limit pressure, latency, and LLM cost stay under control.
    Milestone context: This was intentionally deferred for the same reason as persistent results. A meaningful cache for repeated repository analysis needs storage that survives refreshes, cold starts, and separate users; otherwise it only works as a weak per-tab or per-instance optimization and does not materially reduce GitHub rate-limit pressure or Gemini cost in production. Given the assignment brief does not require durable caching, the backend remains stateless for now and reruns analysis on demand.
20. ensure code quality.
21. add readme
## C) Milestones include only actually important for context milestones. 
