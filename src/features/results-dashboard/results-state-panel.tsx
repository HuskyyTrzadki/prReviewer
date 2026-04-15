import Link from "next/link";
import type { ReactNode } from "react";

type ResultsStatePanelProps = {
  actionLabel: string;
  actionHref: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export const ResultsStatePanel = ({
  actionHref,
  actionLabel,
  children,
  description,
  eyebrow,
  title,
}: ResultsStatePanelProps) => {
  return (
    <section className="ds-section bg-ice-blue">
      <div className="ds-container">
        <div className="mx-auto max-w-2xl rounded-md border border-silver bg-white p-8 text-center sm:p-10">
          <div className="space-y-4">
            <p className="ds-overline text-navy">{eyebrow}</p>
            <h1 className="ds-display-2 text-balance">{title}</h1>
            <p className="ds-body-secondary">{description}</p>
          </div>

          {children ? <div className="mt-6">{children}</div> : null}

          <div className="mt-8">
            <Link className="ds-button-primary" href={actionHref}>
              {actionLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
