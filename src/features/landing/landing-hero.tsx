import { LandingHeroPreview } from "@/features/landing/landing-hero-preview";
import { RepoUrlHeroForm } from "@/features/repo-input/ui/repo-url-hero-form";

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
        className="absolute left-1/2 top-10 h-72 w-72 -translate-x-[130%] rounded-full bg-soft-indigo/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-80 w-80 translate-x-[55%] rounded-full bg-lavender-mist blur-3xl"
      />

      <div className="ds-container relative">
        <div className="group/hero relative overflow-hidden rounded-[2rem] border border-silver/80 bg-white/90 px-5 py-6 shadow-[0_24px_80px_rgba(29,36,58,0.08)] sm:px-8 lg:px-10 lg:py-10">
          <div
            aria-hidden="true"
            className="absolute inset-x-10 top-0 h-px bg-soft-indigo"
          />
          <div
            aria-hidden="true"
            className="absolute -left-12 top-14 h-40 w-40 rounded-full bg-soft-indigo/70 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute right-0 top-10 h-48 w-48 rounded-full bg-lavender-mist blur-3xl"
          />

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-center">
            <div className="max-w-[40rem] space-y-8 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <span className="ds-overline inline-flex rounded-full border border-silver bg-white px-4 py-2 text-navy shadow-soft">
                  Public Repo Review
                </span>
                <span className="rounded-full bg-lavender-mist px-4 py-2 text-sm font-medium text-navy">
                  Lightweight AI signal, not a black-box score
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="ds-display-1 text-balance mx-auto">
                  See What Public Repositories Actually Ship.
                </h1>
                <p className="ds-body-lg mx-auto max-w-[34rem] text-pretty lg:mx-0">
                  Paste a repository URL to turn merged pull requests into one
                  readable view of impact, AI leverage, and engineering quality.
                </p>
              </div>

              <div className="w-full" id="analyze-repo">
                <RepoUrlHeroForm />
              </div>

              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                {heroPills.map((pill) => (
                  <span
                    className="rounded-full border border-silver bg-white px-4 py-2 text-sm font-medium text-dark-slate transition-transform duration-200 group-hover/hero:-translate-y-0.5"
                    key={pill}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <LandingHeroPreview />
          </div>

          <div className="mt-8 flex flex-col gap-5 rounded-[1.5rem] border border-silver/80 bg-ice-blue/70 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
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
              <p className="text-sm font-medium text-dark-slate">
                Built for teams that need a fast first-pass on real repository output.
              </p>
            </div>

            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-dark-slate lg:max-w-[34rem] lg:justify-end">
              {trustItems.map((item) => (
                <li className="flex items-center gap-2" key={item}>
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-indigo-violet" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
