import { RepoUrlHeroForm } from "@/features/repo-input/repo-url-hero-form";

const heroPills = ["Public GitHub repos", "Impact + AI leverage + quality", "Fast first-pass review"];

export function LandingHero() {
  return (
    <section className="ds-section ds-section-muted relative overflow-hidden">
      <div className="absolute left-1/2 top-12 h-64 w-64 -translate-x-[130%] rounded-full bg-soft-indigo/70 blur-3xl" />
      <div className="absolute left-1/2 top-6 h-72 w-72 translate-x-[55%] rounded-full bg-lavender-mist blur-3xl" />

      <div className="ds-container relative">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 py-6 text-center sm:py-10 lg:py-16">
          <span className="animate-hero-entry ds-overline rounded-full border border-silver bg-white px-4 py-2 text-navy shadow-soft">
            Step 4 · Hero entry
          </span>

          <div className="animate-hero-entry space-y-5">
            <h1 className="ds-display-1 mx-auto max-w-[14ch]">
              Review pull requests with a clearer signal.
            </h1>
            <p className="ds-body-lg mx-auto max-w-[42rem]">
              Paste a public repository URL to start a polished PR scoring flow built
              for engineering leads evaluating impact, AI leverage, and quality.
            </p>
          </div>

          <div className="animate-hero-entry w-full max-w-4xl">
            <RepoUrlHeroForm />
          </div>

          <ul className="animate-hero-entry flex flex-wrap justify-center gap-3">
            {heroPills.map((pill) => (
              <li
                className="rounded-full border border-silver bg-white px-4 py-2 text-sm font-medium text-dark-slate"
                key={pill}
              >
                {pill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
