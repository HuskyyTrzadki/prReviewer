export const socialProofItems = [
  "Engineering Due Diligence",
  "Hiring Loop Calibration",
  "AI Adoption Reviews",
  "Weekly PR Retrospectives",
];

export const howItWorksSteps = [
  {
    title: "Paste a Public Repository",
    description:
      "Start with a GitHub URL and point the analysis at merged pull requests instead of repo vanity metrics.",
  },
  {
    title: "Score What Matters",
    description:
      "Each pull request is evaluated across impact, AI leverage, and quality so the output stays legible to technical reviewers.",
  },
  {
    title: "Review the Dashboard",
    description:
      "Get a repo-level score, dimension breakdown, and a sortable pull request view for deeper follow-up.",
  },
];

export const scoringDimensions = [
  {
    title: "Impact",
    description:
      "How much meaningful product, platform, or team value the pull request appears to create.",
    points: [
      "Separates real delivery from cosmetic churn",
      "Rewards scope that moves the product forward",
      "Highlights outsized pull requests worth reviewing",
    ],
  },
  {
    title: "AI Leverage",
    description:
      "How effectively the work appears to use AI to accelerate execution without hiding weak engineering judgment.",
    points: [
      "Looks for speed with strong intent",
      "Flags low-signal automation patterns",
      "Balances acceleration against originality",
    ],
  },
  {
    title: "Quality",
    description:
      "How cleanly the change is shaped, described, and likely to hold up in a real engineering workflow.",
    points: [
      "Accounts for PR clarity and hygiene",
      "Surfaces risky implementation shortcuts",
      "Keeps maintainability in the scoring model",
    ],
  },
];

export const previewMetrics = [
  { label: "Impact", value: "91" },
  { label: "AI Leverage", value: "84" },
  { label: "Quality", value: "87" },
];

export const previewPullRequests = [
  {
    id: "#18462",
    title: "Refactor caching boundaries for partial prerendering",
    score: "92",
    delta: "+12 files",
    dimension: "High Impact",
  },
  {
    id: "#18417",
    title: "Ship repo onboarding flow with better prompt scaffolding",
    score: "88",
    delta: "+8 files",
    dimension: "Strong AI Leverage",
  },
  {
    id: "#18381",
    title: "Tighten diff summaries and eliminate flaky smoke assertions",
    score: "81",
    delta: "+5 files",
    dimension: "High Quality",
  },
];
