import { socialProofItems } from "./landing-sections.data";

export const SocialProofSection = () => {
  return (
    <section
      aria-labelledby="social-proof-title"
      className="ds-deferred-section ds-trust-bar scroll-mt-24"
      id="social-proof"
    >
      <div className="ds-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="ds-overline text-navy">Social Proof</p>
            <h2 className="ds-display-2 max-w-[18ch] text-balance" id="social-proof-title">
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
  );
};
