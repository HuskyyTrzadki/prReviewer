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

## Notes

- Storybook is available through `npm run storybook`.
- The app uses Gemini for scoring, so local and Vercel environments both need `GOOGLE_API_KEY`.
