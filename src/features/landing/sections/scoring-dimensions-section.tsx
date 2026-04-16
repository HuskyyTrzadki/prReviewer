import { scoringDimensions } from "./landing-sections.data";

export const ScoringDimensionsSection = () => {
  return (
    <section
      aria-labelledby="scoring-dimensions-title"
      className="ds-deferred-section ds-section ds-section-brand scroll-mt-24"
      id="scoring-dimensions"
    >
      <div className="ds-container">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="ds-overline text-navy">Scoring Dimensions</p>
          <h2 className="ds-display-2 text-balance" id="scoring-dimensions-title">
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
                <h3 className="ds-heading-3 text-[1.5rem]">{dimension.title}</h3>
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
  );
};
