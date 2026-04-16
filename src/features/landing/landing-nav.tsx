const navLinks = [
  { href: "#social-proof", label: "Proof" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#scoring-dimensions", label: "Scoring" },
  { href: "#dashboard-preview", label: "Preview" },
];

export const LandingNav = () => {
  return (
    <header className="ds-nav sticky top-0 z-40">
      <div className="ds-container flex min-h-[4.5rem] items-center justify-between gap-6">
        <a
          className="flex items-center gap-3 text-navy transition-colors duration-150 hover:text-indigo-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-violet/20 focus-visible:ring-offset-2"
          href="#main-content"
        >
          <span
            aria-hidden="true"
            className="relative inline-flex size-10 items-center justify-center rounded-md border border-silver bg-ice-blue"
          >
            <span className="size-3 rounded-full bg-indigo-violet" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-white" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-cool-gray">
              AI-first review
            </span>
            <span className="block text-sm font-semibold sm:text-base">
              PR Reviewer Photo Aid
            </span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              className="text-sm font-medium text-navy transition-colors duration-150 hover:text-indigo-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-violet/20 focus-visible:ring-offset-2"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a className="ds-button-small shrink-0" href="#analyze-repo">
          Analyze
        </a>
      </div>
    </header>
  );
};
