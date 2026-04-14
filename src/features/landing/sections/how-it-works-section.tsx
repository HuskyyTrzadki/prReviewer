import { howItWorksSteps } from "./landing-sections.data";

export const HowItWorksSection = () => {
  return (
    <section
      aria-labelledby="how-it-works-title"
      className="ds-section bg-white scroll-mt-24"
      id="how-it-works"
    >
      <div className="ds-container">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="ds-overline text-navy">How It Works</p>
          <h2 className="ds-display-2 text-balance" id="how-it-works-title">
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
  );
};
