# PR Reviewer AI

Analyze merged pull requests from a GitHub repository and score them across:
- Impact
- AI leverage
- Code quality

Live demo: [link]  
Video: [link]

## What It Is

`PR Reviewer AI` is a Next.js 16 app that analyzes merged pull requests from a public GitHub repository and generates repository-level and PR-level scoring with Gemini.

Current stack:
- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Storybook
- Vitest
- Knip for unused files, exports, and dependencies checks

## Requirements

- Node `>=22.13.0 <23`
- npm `>=10 <11`
- A Gemini API key in `GOOGLE_API_KEY`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the project root:

```bash
GOOGLE_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_optional_github_token
```

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Environment Variables

- `GOOGLE_API_KEY` is required. `/api/analyze` now fails fast with `Missing GOOGLE_API_KEY for Gemini pull request scoring.` before any GitHub analysis work starts.
- `GITHUB_TOKEN` is optional. If present, GitHub requests use authenticated access and get better rate-limit headroom. If missing, the app falls back to anonymous GitHub access for public repositories.
- The current product scope is still public repositories only. A missing GitHub repo or a private repo returns the same typed API error.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm test
npm run storybook
npm run knip
```

## Testing

- Unit tests run with `npm test`.
- The main backend coverage today is around repository URL parsing, API contracts, GitHub preparation, Gemini scoring behavior, and the analyze route.

## Project Context

- [BigPicturePlan.md](./BigPicturePlan.md) tracks the implementation milestones and the technical context behind each completed step.
- [MyThinkingProcess.md](./MyThinkingProcess.md) is the running build diary with product decisions, tradeoffs, and research notes captured during development.

## Retrospective Note

One honest mistake on my side was spending too much time early on backend structure, documentation, Storybook, and detailed code review. That made the project feel very organized at the start, but it also slowed down progress on the core product flow.

Near the end, I had to cut scope and move faster than I wanted, so not everything is as fully closed out as I would ideally want before calling it finished.

At the same time, I still wish I had more time for code review. I do not think review work was wasted, but I should have balanced it better against shipping the most important product pieces earlier.

Another example is Lighthouse CI. I thought it would be a cool addition to see on every PR whether the project still passed the quality bar, but in practice it was not worth the time I put into it during this sprint.

The thing I regret most is not adding proper result caching, most likely with something lightweight like Supabase. I considered it, but I knew setup and configuration would take too much time in this sprint, so I left it out to protect overall momentum.

## What I Would Do Next

- Add persistent result storage and caching by `repoId`, so `/results/[repoId]` survives refreshes and repeated analysis does not rerun from scratch.
- Finish test coverage with one real end-to-end happy path and stronger coverage for the API flow and results page.
- Complete private repository support end-to-end, because the backend is partly prepared for it, but the frontend and UX are not fully finished.
- Improve the review algorithm itself. Right now the scoring flow is still fairly simple: it looks at PR title/body, basic metadata, and truncated diff excerpts for a limited number of files and PRs. It does not yet consider things like commit history, test changes, CI signals, broader repository context, or stronger heuristics around architectural impact :( ) I knew this was important, but it is backend-heavy work, so I chose to deprioritize it.
- Improve handling for larger repositories: better batching, clearer limits, and likely async/background processing instead of keeping the whole analysis lifecycle inside one synchronous user flow :/  Right now the scoring path still processes PR batches in a simple loop, which works, but it is not the shape I would want long term.
- Do one final polish pass on copy and UX states: loading, empty, rate limit, private repo, upstream failure, and missing environment configuration.
- Table polish, it could look so much better.
- Ideally user should be able to choose pr's to analyze instead of always getting recent 6.

## How I Used AI

I used Codex, ChatGPT, and Gemini during the project.  
I usually started with ChatGPT for research and to compare implementation options before writing code.  
After that, I used AI to help prepare a step-by-step plan, split into smaller milestones and suggested commits.  
Most of the implementation work was then done with Codex directly in the repository.  
After each bigger step, I reviewed the output, checked whether the solution was still simple enough, and adjusted the plan if needed.  
I did not treat AI output as final by default, so review was part of the workflow after every major slice.  
Once a step was done, I verified it with tests and runtime checks before moving on.  
Gemini was also part of the product itself, because it powers the PR scoring flow.

## Notes

- Storybook is available through `npm run storybook`.
- The app uses Gemini for scoring, so local and Vercel environments both need `GOOGLE_API_KEY`.
