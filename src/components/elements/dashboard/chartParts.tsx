import React from "react";

export const CHART_HEIGHT = 260;
export const GRID = "#e2e1e4";
export const AXIS_TEXT = "#77767d";
export const TICK_COUNT = 4;

// Counts are whole numbers, so the tick step is too: 0, 1, 2, 3, 4 / 0, 5, 10…
export const niceTicks = (max: number) => {
  const raw = max / TICK_COUNT;
  const magnitude = raw <= 1 ? 1 : Math.pow(10, Math.floor(Math.log10(raw)));
  const multipliers =
    magnitude >= 10 ? [1, 2, 2.5, 5, 10] : [1, 2, 3, 4, 5, 10];
  const step =
    raw <= 1
      ? 1
      : multipliers.map((m) => m * magnitude).find((s) => s >= raw)!;
  return Array.from({ length: TICK_COUNT + 1 }, (_, i) => i * step);
};

export const LineSwatch: React.FC<{ color: string; dash?: string }> = ({
  color,
  dash,
}) => (
  <svg width="18" height="8" aria-hidden className="shrink-0">
    <line
      x1="1"
      x2="17"
      y1="4"
      y2="4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray={dash}
    />
  </svg>
);

export const BlockSwatch: React.FC<{ color: string }> = ({ color }) => (
  <span
    aria-hidden
    className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
    style={{ backgroundColor: color }}
  />
);

export const tooltipCard =
  "rounded-10 border border-white-150 bg-white px-3 py-2 shadow-mmd";

export const legendList = "mb-3 flex flex-wrap gap-x-6 gap-y-1";

export const legendItem =
  "flex items-center gap-2 text-sm font-arial text-grey-200";
