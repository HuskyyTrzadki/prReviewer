import { LandingHeroPreview } from "@/features/landing/landing-hero-preview";
import { RepoUrlHeroForm } from "@/features/repo-input/repo-url-hero-form";

const heroPills = [
  "Public GitHub repos",
  "Impact + AI leverage + quality",
  "Fast first-pass review",
];
const trustItems = ["Engineering hiring loops", "AI adoption reviews", "Repository due diligence"];

export const LandingHero = () => {
  return (
    <section className="ds-section ds-section-muted relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-12 h-64 w-64 -translate-x-[130%] rounded-full bg-soft-indigo/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-6 h-72 w-72 translate-x-[55%] rounded-full bg-lavender-mist blur-3xl"
      />

      <div className="ds-container relative">
        <div className="grid gap-14 py-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:items-start lg:py-14">
          <div className="max-w-[40rem] space-y-8">
            <span className="ds-overline inline-flex rounded-full border border-silver bg-white px-4 py-2 text-navy shadow-soft">
              Public Repo Review
            </span>

            <div className="space-y-5 text-left">
              <h1 className="ds-display-1  text-balance">
                See What Public Repositories Actually Ship.
              </h1>
              <p className="ds-body-lg max-w-[34rem] text-pretty">
                Paste a repository URL to turn merged pull requests into one
                readable view of impact, AI leverage, and engineering quality.
              </p>
            </div>

            <div className="w-full" id="analyze-repo">
              <RepoUrlHeroForm />
            </div>
          </div>

          <LandingHeroPreview />
        </div>

        <div className="space-y-4 pb-8 text-left lg:pb-14">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 text-success-green" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  className="inline-flex size-5 items-center justify-center rounded-[0.2rem] bg-success-green text-xs text-white"
                  key={index}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm font-medium text-navy sm:text-base">
              <span className="font-semibold">Excellent</span>
              <span className="mx-2 text-cool-gray">|</span>
              <span>1 000 reviews on Trustpilot</span>
            </p>
          </div>

          <ul className="flex flex-wrap gap-3">
            {heroPills.map((pill) => (
              <li
                className="rounded-full border border-silver bg-white px-4 py-2 text-sm font-medium text-dark-slate"
                key={pill}
              >
                {pill}
              </li>
            ))}
          </ul>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-dark-slate">
            {trustItems.map((item) => (
              <li className="flex items-center gap-2" key={item}>
                <span aria-hidden="true" className="size-1.5 rounded-full bg-indigo-violet" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
