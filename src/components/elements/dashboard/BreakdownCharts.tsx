"use client";
import React, { useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { useDashboardBreakdown } from "#/hooks";
import { DashboardSlice } from "#services/types";
import { ChartCard } from "./ChartCard";
import { BlockSwatch, tooltipCard } from "./chartParts";
import { DashboardFilter, filterOptions, formatFullCount } from "./metrics";

// Same validated categorical order as the blog category pie. Colour follows the
// slice's position in the backend's fixed label order, never its rank, so
// "female" keeps its colour whichever group is bigger this period
const SLICE_COLORS = ["#6250d6", "#eb6834", "#1baf7a", "#eda100"];

// Bars carry one series each, so one brand hue is enough
const BAR_COLOR = "#7b61d9";

const subtitles: Record<DashboardFilter, string> = {
  day: "Joined or created today",
  week: "Joined or created this week",
  month: "Joined or created this month",
  year: "Joined or created this year",
  all: "Everyone and everything since launch",
};

// "super_admin" -> "Super admin"
const toTitle = (label: string) => {
  const words = label.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const formatShare = (value: number, total: number) => {
  if (!total || !value) return "0%";
  const share = (value / total) * 100;
  return share < 1 ? "<1%" : `${Math.round(share)}%`;
};

type ColoredSlice = DashboardSlice & { name: string; color: string };

const SliceTooltip = ({
  active,
  payload,
  noun,
  total,
}: TooltipContentProps<ValueType, NameType> & {
  noun: string;
  total: number;
}) => {
  if (!active || !payload?.length) return null;
  const slice = payload[0].payload as ColoredSlice;

  return (
    <div className={tooltipCard}>
      <p className="flex items-center gap-2 text-sm font-arial text-black-200">
        <BlockSwatch color={slice.color} />
        <span>{slice.name}</span>
      </p>
      <p className="text-sm font-arial text-grey-200">
        <span className="font-bold text-black-200">
          {formatFullCount(slice.value)}
        </span>{" "}
        {noun} · {formatShare(slice.value, total)}
      </p>
    </div>
  );
};

// & a small donut with its legend; for up to four fixed groups
export const SliceDonut: React.FC<{
  title: string;
  noun: string;
  slices: DashboardSlice[];
}> = ({ title, noun, slices }) => {
  const colored: ColoredSlice[] = slices
    .slice(0, SLICE_COLORS.length)
    .map((slice, i) => ({
      ...slice,
      name: toTitle(slice.label),
      color: SLICE_COLORS[i],
    }));
  const total = colored.reduce((sum, slice) => sum + slice.value, 0);
  const drawn = colored.filter((slice) => slice.value > 0);

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="text-sm font-bold font-arial text-black-200">
        {title}
      </figcaption>

      {total === 0 ? (
        <p className="py-10 text-center text-sm font-arial text-grey-200">
          No {noun} in this period.
        </p>
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative h-[120px] w-[120px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart title={title} accessibilityLayer>
                <Pie
                  data={drawn}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="100%"
                  stroke="#ffffff"
                  strokeWidth={2}
                  startAngle={90}
                  endAngle={-270}
                  isAnimationActive={false}
                >
                  {drawn.map((slice) => (
                    <Cell key={slice.label} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={(props) => (
                    <SliceTooltip {...props} noun={noun} total={total} />
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-bold font-arial text-black-200">
                {formatFullCount(total)}
              </span>
            </div>
          </div>

          {/* ! visible values: two slice colours are under 3:1 on white */}
          <ul
            className="flex min-w-0 flex-1 flex-col gap-1.5"
            aria-label={title}
          >
            {colored.map((slice) => (
              <li
                key={slice.label}
                className="flex items-center gap-2 text-sm font-arial"
              >
                <BlockSwatch color={slice.color} />
                <span className="truncate text-black-200">{slice.name}</span>
                <span className="ml-auto font-bold text-black-200">
                  {formatFullCount(slice.value)}
                </span>
                <span className="w-9 text-right text-xs text-grey-200">
                  {formatShare(slice.value, total)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </figure>
  );
};

// * horizontal bars with the value at the end; for many groups (statuses, roles)
export const SliceBars: React.FC<{
  title: string;
  noun: string;
  slices: DashboardSlice[];
}> = ({ title, noun, slices }) => {
  const max = Math.max(0, ...slices.map((slice) => slice.value));
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="text-sm font-bold font-arial text-black-200">
        {title}
      </figcaption>

      {total === 0 ? (
        <p className="py-10 text-center text-sm font-arial text-grey-200">
          No {noun} in this period.
        </p>
      ) : (
        <ul className="flex flex-col gap-2" aria-label={title}>
          {slices.map((slice) => (
            <li
              key={slice.label}
              className="grid grid-cols-[96px_1fr_auto] items-center gap-3 text-sm font-arial"
              title={`${toTitle(slice.label)}: ${formatFullCount(slice.value)} ${noun} (${formatShare(slice.value, total)})`}
            >
              <span className="truncate text-grey-200">
                {toTitle(slice.label)}
              </span>
              <span className="h-2.5 rounded-r-[4px] bg-white-300/60">
                <span
                  className="block h-full rounded-r-[4px] transition-[width]"
                  style={{
                    width: max ? `${(slice.value / max) * 100}%` : 0,
                    minWidth: slice.value ? 4 : 0,
                    backgroundColor: BAR_COLOR,
                  }}
                />
              </span>
              <span className="min-w-6 text-right font-bold text-black-200">
                {formatFullCount(slice.value)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
};

// # users, admins and blogs split into groups, with one period filter
export const BreakdownCharts: React.FC = () => {
  const [filter, setFilter] = useState<DashboardFilter>("all");
  const { breakdown, isLoading, isFetching, isError, refetch } =
    useDashboardBreakdown(filter === "all" ? undefined : filter);

  return (
    <ChartCard
      id="breakdown-heading"
      title="Users, admins and blogs"
      subtitle={subtitles[filter]}
      filterLabel="Breakdown period"
      options={filterOptions}
      value={filter}
      onChange={setFilter}
      isLoading={isLoading || isFetching || !breakdown}
      isError={isError}
      onRetry={refetch}
      skeletonHeight={360}
    >
      {breakdown && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
          <SliceDonut
            title="Users by gender"
            noun="users"
            slices={breakdown.users.byGender}
          />
          <SliceDonut
            title="Email verification"
            noun="users"
            slices={breakdown.users.byVerification}
          />
          <SliceDonut
            title="Published vs flagged blogs"
            noun="blogs"
            slices={breakdown.blogs.byStatus}
          />
          <SliceBars
            title="Admins by status"
            noun="admins"
            slices={breakdown.admins.byStatus}
          />
          <SliceBars
            title="Admins by role"
            noun="admins"
            slices={breakdown.admins.byRole}
          />
        </div>
      )}
    </ChartCard>
  );
};
