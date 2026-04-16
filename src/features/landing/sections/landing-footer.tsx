const footerLinks = [
  { href: "#social-proof", label: "Social Proof" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#scoring-dimensions", label: "Scoring Dimensions" },
  { href: "#dashboard-preview", label: "Dashboard Preview" },
];

export const LandingFooter = () => {
  return (
    <footer className="ds-deferred-section border-t border-silver bg-ice-blue">
      <div className="ds-container py-8 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-center">
          <nav aria-label="Footer" className="flex flex-wrap gap-3 sm:gap-5">
            {footerLinks.map((link) => (
              <a
                className="text-sm font-medium text-navy transition-colors duration-150 hover:text-indigo-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-violet/20 focus-visible:ring-offset-2"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
