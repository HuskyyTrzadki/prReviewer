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
8. Wire the landing page submit button to the real `/api/analyze` flow and validate manual success/error behavior end-to-end from the hero form.
9. [x] Add the LLM scoring pipeline with structured output validation and repository-level aggregation.
   Milestone context: The server analysis flow now includes an LLM scoring stage that consumes normalized repository + merged PR input and returns typed scores for each PR across Impact, AI-Leverage, and Quality dimensions, plus a weighted total. Structured output is validated with shared Zod schemas before it is accepted, and invalid/partial model responses are mapped into controlled API errors instead of leaking raw model output to clients. Repository-level aggregation was added on top of validated PR scores so the backend can return stable summary metrics (dimension averages + overall score) alongside per-PR results for the results view.
10. Persist analysis results under a deterministic key and expose a stable results route for revisits and shareability.
11. Build the dashboard shell with total score, dimension breakdown, repository summary, and loading/error/empty states.
12. Implement the PR results list with sorting, filtering, score display, metadata, and external diff links.
13. ensure performance budgets are enforced on the landing page, with minimal client JavaScript, optimized assets, and strong mobile Lighthouse results.
14. ensure test coverage is done for URL parsing, scoring payload/schema validation, critical UI states, and at least one end-to-end happy path.
15. ensure caching is done for repeated repository analyses so rate-limit pressure, latency, and LLM cost stay under control.
16. ensure code quality and wow-factor are done through cleanup, accessibility passes, motion polish, visual consistency, and one memorable landing detail added at the end.

## C) Milestones include only actually important for context milestones. 
