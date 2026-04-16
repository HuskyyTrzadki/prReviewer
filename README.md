# PR Reviewer AI

Simple tool to analyze GitHub pull requests and score them across:
- Impact
- AI leverage
- Code quality

Live demo: [link]  
Video: [link]

## Project

`PR Reviewer AI` is a Next.js 16 app that analyzes merged pull requests from a public GitHub repository and generates repository-level and PR-level scoring with Gemini.

The current stack includes:
- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Storybook
- Vitest
- Knip for unused files, exports, and dependencies checks

## How To Run It

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the project root with these keys:

```bash
GOOGLE_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_optional_github_token
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

Useful commands:

```bash
npm run lint
npm test
npm run storybook
npm run knip
```

## Environment Variables

- `GOOGLE_API_KEY` is required. The server throws `Missing GOOGLE_API_KEY for Gemini pull request scoring.` when Gemini scoring is used without it.
- `GITHUB_TOKEN` is optional. If present, GitHub requests use authenticated access and get better rate-limit headroom. If missing, the app falls back to anonymous GitHub access for public repositories.

## Key Decisions

## What I Would Improve

## Notes
