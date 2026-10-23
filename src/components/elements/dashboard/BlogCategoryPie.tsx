"use client";
import React from "react";
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
import { DashboardSlice } from "#services/types";
import { BlockSwatch, tooltipCard } from "./chartParts";
import { formatFullCount } from "./metrics";

type Props = {
  slices: DashboardSlice[];
};

// Validated categorical order (dataviz palette check); "Other" is neutral gray
const SLICE_COLORS = ["#6250d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"];
const OTHER_COLOR = "#a3a1a8";
const MAX_SLICES = SLICE_COLORS.length;

type Slice = DashboardSlice & { name: string; color: string; share: number };

const toSlices = (raw: DashboardSlice[]): Slice[] => {
  const total = raw.reduce((sum, slice) => sum + slice.value, 0);
  const share = (value: number) => (total ? (value / total) * 100 : 0);
  const named = (label: string) =>
    label.charAt(0).toUpperCase() + label.slice(1);

  const sorted = raw
    .filter((slice) => slice.value > 0 && slice.label !== "other")
    .sort((a, b) => b.value - a.value);
  const shown = sorted.slice(0, MAX_SLICES);
  const otherValue =
    sorted.slice(MAX_SLICES).reduce((sum, slice) => sum + slice.value, 0) +
    (raw.find((slice) => slice.label === "other")?.value ?? 0);

  const slices: Slice[] = shown.map((slice, i) => ({
    ...slice,
    name: named(slice.label),
    color: SLICE_COLORS[i],
    share: share(slice.value),
  }));

  if (otherValue > 0) {
    slices.push({
      label: "other",
      value: otherValue,
      name: "Other",
      color: OTHER_COLOR,
      share: share(otherValue),
    });
  }

  return slices;
};

const formatShare = (share: number) =>
  share > 0 && share < 1 ? "<1%" : `${Math.round(share)}%`;

const SliceTooltip = ({
  active,
  payload,
}: TooltipContentProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;
  const slice = payload[0].payload as Slice;

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
        blogs · {formatShare(slice.share)}
      </p>
    </div>
  );
};

export const BlogCategoryPie: React.FC<Props> = ({ slices: raw }) => {
  const slices = toSlices(raw);
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  if (!total) {
    return (
      <p className="py-16 text-center text-sm font-arial text-grey-200">
        No blogs were published in this period.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative h-[220px] w-[220px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart title="Blogs by category" accessibilityLayer>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={0}
              stroke="#ffffff"
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {slices.map((slice) => (
                <Cell key={slice.label} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip content={(props) => <SliceTooltip {...props} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-24 font-bold font-arial text-black-200">
            {formatFullCount(total)}
          </span>
          <span className="text-xs font-arial text-grey-200">blogs</span>
        </div>
      </div>

      <ul className="flex w-full flex-col gap-2" aria-label="Blogs by category">
        {slices.map((slice) => (
          <li
            key={slice.label}
            className="flex items-center gap-2 text-sm font-arial"
          >
            <BlockSwatch color={slice.color} />
            <span className="text-black-200">{slice.name}</span>
            <span className="ml-auto font-bold text-black-200">
              {formatFullCount(slice.value)}
            </span>
            <span className="w-10 text-right text-grey-200">
              {formatShare(slice.share)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
