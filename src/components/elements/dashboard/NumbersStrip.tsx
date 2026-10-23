"use client";
import React from "react";
import { Skeleton } from "antd";
import { useDashboardTotals } from "#/hooks";
import { DashboardTotalKey, formatCount, formatFullCount } from "./metrics";

const numbers: { key: DashboardTotalKey; label: string }[] = [
  { key: "users", label: "Users" },
  { key: "admins", label: "Admins" },
  { key: "blogs", label: "Blogs" },
  { key: "reviews", label: "Comments" },
  { key: "visits", label: "Visits" },
  { key: "contactMessages", label: "Messages" },
];

// ~ a compact all-time row: just the numbers, no filter, charts or comparisons.
// `exclude` leaves out totals already shown elsewhere on the page
export const NumbersStrip: React.FC<{ exclude?: DashboardTotalKey[] }> = ({
  exclude = [],
}) => {
  const { totals, isLoading, isError } = useDashboardTotals();
  const shown = numbers.filter(({ key }) => !exclude.includes(key));

  if (isError) return null;

  return (
    <section
      aria-label="All-time numbers"
      className="rounded-20 border border-white-150 bg-white px-5 py-3"
    >
      <dl className="flex flex-wrap gap-y-3 sm:divide-x sm:divide-white-150">
        {shown.map(({ key, label }) => (
          <div
            key={key}
            className="flex min-w-[96px] flex-col gap-0.5 pr-6 sm:px-6 first:sm:pl-0"
          >
            <dt className="text-xs font-arial text-grey-200">{label}</dt>
            <dd className="text-lg font-bold font-arial leading-tight text-black-200">
              {isLoading || !totals ? (
                <Skeleton.Input
                  active
                  size="small"
                  className="!h-5 !w-14 !min-w-0"
                />
              ) : (
                <span title={formatFullCount(totals[key] ?? 0)}>
                  {formatCount(totals[key] ?? 0)}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
