const socialProofItems = [
  "Engineering Due Diligence",
  "Hiring Loop Calibration",
  "AI Adoption Reviews",
  "Weekly PR Retrospectives",
];

const howItWorksSteps = [
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

const scoringDimensions = [
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

const previewMetrics = [
  { label: "Impact", value: "91" },
  { label: "AI Leverage", value: "84" },
  { label: "Quality", value: "87" },
];

const previewPullRequests = [
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

export const LandingSections = () => {
  return (
    <>
      <section
        aria-labelledby="social-proof-title"
        className="ds-trust-bar scroll-mt-24"
        id="social-proof"
      >
        <div className="ds-container">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="ds-overline text-navy">Social Proof</p>
              <h2
                className="ds-display-2 max-w-[18ch] text-balance"
                id="social-proof-title"
              >
                Built for Fast Reviews Before the Deeper Technical Read.
              </h2>
              <p className="ds-body max-w-[42rem]">
                The landing flow is designed for the moments when engineering teams
                need quick signal on public repository output before they invest in a
                full pull request-by-pull request audit.
              </p>
            </div>

            <ul className="grid flex-1 gap-3 sm:grid-cols-2">
              {socialProofItems.map((item) => (
                <li
                  className="rounded-md border border-silver bg-white px-5 py-4 text-sm font-medium text-navy sm:text-base"
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="how-it-works-title"
        className="ds-section bg-white scroll-mt-24"
        id="how-it-works"
      >
        <div className="ds-container">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="ds-overline text-navy">How It Works</p>
            <h2
              className="ds-display-2 text-balance"
              id="how-it-works-title"
            >
              One Input, Three Signals, and a Review-Ready Dashboard.
            </h2>
            <p className="ds-body mx-auto max-w-[42rem]">
              The product stays intentionally narrow: point it at a public
              repository, score merged pull requests, and surface the output in a
              dashboard that is easy to scan with a team.
            </p>
          </div>

          <ol className="mt-10 grid gap-6 lg:grid-cols-3">
            {howItWorksSteps.map((step, index) => (
              <li className="ds-card space-y-5" key={step.title}>
                <span className="inline-flex size-11 items-center justify-center rounded-full border border-silver bg-ice-blue font-semibold tabular-nums text-navy">
                  0{index + 1}
                </span>
                <div className="space-y-3">
                  <h3 className="ds-heading-4">{step.title}</h3>
                  <p className="ds-body-secondary">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="scoring-dimensions-title"
        className="ds-section ds-section-brand scroll-mt-24"
        id="scoring-dimensions"
      >
        <div className="ds-container">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="ds-overline text-navy">Scoring Dimensions</p>
            <h2
              className="ds-display-2 text-balance"
              id="scoring-dimensions-title"
            >
              The Score Stays Legible Because It Only Measures Three Things.
            </h2>
            <p className="ds-body mx-auto max-w-[44rem]">
              Each dimension is opinionated enough to be useful in review
              conversations and simple enough that the reasoning remains obvious at a
              glance.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {scoringDimensions.map((dimension) => (
              <article className="ds-card space-y-5" key={dimension.title}>
                <div className="space-y-3">
                  <h3 className="ds-heading-3 text-[1.5rem]">
                    {dimension.title}
                  </h3>
                  <p className="ds-body-secondary">{dimension.description}</p>
                </div>

                <ul className="space-y-3">
                  {dimension.points.map((point) => (
                    <li
                      className="flex items-start gap-3 text-sm leading-6 text-dark-slate sm:text-base"
                      key={point}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-2 rounded-full bg-indigo-violet"
                      />
                      <span className="min-w-0">{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="dashboard-preview-title"
        className="ds-section bg-white scroll-mt-24"
        id="dashboard-preview"
      >
        <div className="ds-container">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="ds-overline text-navy">Dashboard Preview</p>
            <h2
              className="ds-display-2 text-balance"
              id="dashboard-preview-title"
            >
              A Results View That Feels Closer to a Review Tool Than a Marketing Mock.
            </h2>
            <p className="ds-body mx-auto max-w-[44rem]">
              Repository-level signal sits next to pull request detail so the score
              stays explainable when someone asks what actually drove it.
            </p>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-md border border-silver bg-white">
            <div
              aria-hidden="true"
              className="absolute inset-x-8 top-0 h-px bg-soft-indigo"
            />

            <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
              <aside className="border-b border-silver bg-ice-blue px-6 py-8 sm:px-8 lg:border-b-0 lg:border-r">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <p className="ds-overline text-navy">Repository Score</p>
                    <div className="flex items-end gap-4">
                      <span className="font-serif text-[4.5rem] leading-none tracking-[-0.04em] text-navy tabular-nums">
                        87
                      </span>
                      <span className="pb-2 text-base font-medium text-dark-slate">
                        / 100
                      </span>
                    </div>
                    <p className="ds-body-secondary max-w-sm">
                      vercel/next.js would surface as a high-signal repository with
                      strong impact and consistently solid execution.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {previewMetrics.map((metric) => (
                      <div
                        className="rounded-md border border-silver bg-white px-4 py-4"
                        key={metric.label}
                      >
                        <p className="text-sm font-medium text-dark-slate">
                          {metric.label}
                        </p>
                        <p className="mt-2 text-3xl font-semibold tabular-nums text-navy">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="px-6 py-8 sm:px-8">
                <div className="flex flex-col gap-4 border-b border-silver pb-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-2">
                    <p className="ds-overline text-navy">Pull Request Breakdown</p>
                    <h3 className="ds-heading-4">
                      Recent Merged Pull Requests Ranked by Composite Score
                    </h3>
                  </div>
                  <span className="rounded-full border border-silver bg-lavender-mist px-4 py-2 text-sm font-medium text-navy">
                    Sample: 24 merged PRs
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {previewPullRequests.map((pullRequest) => (
                    <article
                      className="rounded-md border border-silver bg-white px-4 py-4"
                      key={pullRequest.id}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1 space-y-2">
                          <p className="text-sm font-medium text-cool-gray">
                            {pullRequest.id} · {pullRequest.delta}
                          </p>
                          <h4 className="text-base font-semibold leading-6 text-navy sm:text-lg">
                            {pullRequest.title}
                          </h4>
                          <p className="text-sm leading-6 text-dark-slate">
                            {pullRequest.dimension}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 sm:pl-6">
                          <span className="rounded-full border border-silver bg-ice-blue px-3 py-2 text-sm font-medium text-dark-slate">
                            Score
                          </span>
                          <span className="text-2xl font-semibold tabular-nums text-navy">
                            {pullRequest.score}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-silver bg-ice-blue">
        <div className="ds-container py-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="ds-overline text-navy">PR Reviewer Photo Aid</p>
              <p className="ds-body text-navy">
                Review public GitHub repositories through the lens of impact, AI
                leverage, and quality.
              </p>
            </div>

            <nav aria-label="Footer" className="flex flex-wrap gap-3 sm:gap-5">
              <a
                className="text-sm font-medium text-navy transition-colors duration-150 hover:text-indigo-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-violet/20 focus-visible:ring-offset-2"
                href="#social-proof"
              >
                Social Proof
              </a>
              <a
                className="text-sm font-medium text-navy transition-colors duration-150 hover:text-indigo-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-violet/20 focus-visible:ring-offset-2"
                href="#how-it-works"
              >
                How It Works
              </a>
              <a
                className="text-sm font-medium text-navy transition-colors duration-150 hover:text-indigo-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-violet/20 focus-visible:ring-offset-2"
                href="#scoring-dimensions"
              >
                Scoring Dimensions
              </a>
              <a
                className="text-sm font-medium text-navy transition-colors duration-150 hover:text-indigo-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-violet/20 focus-visible:ring-offset-2"
                href="#dashboard-preview"
              >
                Dashboard Preview
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
};
