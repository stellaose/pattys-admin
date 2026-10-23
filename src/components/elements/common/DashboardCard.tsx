import React, { ReactNode, useId } from "react";
import { chartCard, chartSubtitle, chartTitle } from "#/styles/dashboard";

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  // filters, links or buttons shown on the right of the heading
  actions?: ReactNode;
  // h2 for a page's main card, h3 for a card inside a page (the default)
  headingLevel?: 2 | 3;
  id?: string;
  className?: string;
  children?: ReactNode;
};

// The white card every dashboard page is built from: an optional heading row
// (title, subtitle, actions) above the content
export const DashboardCard: React.FC<Props> = ({
  title,
  subtitle,
  actions,
  headingLevel = 3,
  id,
  className = "",
  children,
}) => {
  const generatedId = useId();
  const headingId = id ?? `card-${generatedId}`;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <section
      className={`${chartCard} ${className}`}
      aria-labelledby={title ? headingId : undefined}
    >
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          {title && (
            <div>
              <Heading id={headingId} className={chartTitle}>
                {title}
              </Heading>
              {subtitle && <p className={chartSubtitle}>{subtitle}</p>}
            </div>
          )}
          {actions && (
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
};
