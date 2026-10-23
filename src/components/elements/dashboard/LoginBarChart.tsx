"use client";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { DashboardPeriod, DashboardTrendPoint } from "#services/types";
import {
  AXIS_TEXT,
  BlockSwatch,
  CHART_HEIGHT,
  GRID,
  legendItem,
  legendList,
  niceTicks,
  tooltipCard,
} from "./chartParts";
import {
  formatBucket,
  formatBucketLong,
  formatFullCount,
  loginSeries,
} from "./metrics";

type Props = {
  series: DashboardTrendPoint[];
  interval: DashboardPeriod;
};

const LoginTooltip = ({
  active,
  payload,
  label,
  interval,
}: TooltipContentProps<ValueType, NameType> & {
  interval: DashboardPeriod;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className={tooltipCard}>
      <p className="mb-1 text-xs text-grey-100 font-arial">
        {formatBucketLong(String(label), interval)}
      </p>
      {loginSeries.map((s) => {
        const entry = payload.find((item) => item.dataKey === s.key);
        return (
          <p
            key={s.key}
            className="flex items-center gap-2 text-sm font-arial text-black-200"
          >
            <BlockSwatch color={s.color} />
            <span className="text-grey-200">{s.label}</span>
            <span className="ml-auto pl-3 font-bold">
              {formatFullCount(Number(entry?.value ?? 0))}
            </span>
          </p>
        );
      })}
    </div>
  );
};

export const LoginBarChart: React.FC<Props> = ({ series, interval }) => {
  const ticks = niceTicks(
    Math.max(0, ...series.flatMap((p) => loginSeries.map((s) => p[s.key]))),
  );
  const totals = Object.fromEntries(
    loginSeries.map((s) => [s.key, series.reduce((sum, p) => sum + p[s.key], 0)]),
  );

  return (
    <div className="w-full">
      <ul className={legendList} aria-label="Legend">
        {loginSeries.map((s) => (
          <li key={s.key} className={legendItem}>
            <BlockSwatch color={s.color} />
            {s.label}
            <span className="font-bold text-black-200">
              {formatFullCount(totals[s.key])}
            </span>
          </li>
        ))}
      </ul>

      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart
          data={series}
          margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
          barGap={2}
          barCategoryGap="20%"
          title="Successful and failed logins"
          accessibilityLayer
        >
          <CartesianGrid stroke={GRID} strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="periodStart"
            tickFormatter={(value) => formatBucket(value, interval)}
            tick={{ fontSize: 11, fill: AXIS_TEXT }}
            tickLine={false}
            axisLine={{ stroke: GRID }}
            minTickGap={16}
            tickMargin={8}
          />
          <YAxis
            domain={[0, ticks[ticks.length - 1]]}
            ticks={ticks}
            allowDecimals={false}
            tickFormatter={(value) => formatFullCount(value)}
            tick={{ fontSize: 11, fill: AXIS_TEXT }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            cursor={{ fill: "#f3effd" }}
            content={(props) => <LoginTooltip {...props} interval={interval} />}
          />
          {loginSeries.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={s.color}
              maxBarSize={24}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <table className="sr-only">
        <caption>Logins by {interval}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            {loginSeries.map((s) => (
              <th key={s.key} scope="col">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {series.map((point) => (
            <tr key={point.periodStart}>
              <td>{formatBucketLong(point.periodStart, interval)}</td>
              {loginSeries.map((s) => (
                <td key={s.key}>{point[s.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
