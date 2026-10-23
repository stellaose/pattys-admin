"use client";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
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
  CHART_HEIGHT,
  GRID,
  LineSwatch,
  legendItem,
  legendList,
  niceTicks,
  tooltipCard,
} from "./chartParts";
import {
  formatBucket,
  formatBucketLong,
  formatFullCount,
  userSeries,
} from "./metrics";

type Props = {
  series: DashboardTrendPoint[];
  interval: DashboardPeriod;
};

const TrendTooltip = ({
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
      {userSeries.map((series) => {
        const entry = payload.find((item) => item.dataKey === series.key);
        return (
          <p
            key={series.key}
            className="flex items-center gap-2 text-sm font-arial text-black-200"
          >
            <LineSwatch color={series.color} dash={series.dash} />
            <span className="text-grey-200">{series.label}</span>
            <span className="ml-auto pl-3 font-bold">
              {formatFullCount(Number(entry?.value ?? 0))}
            </span>
          </p>
        );
      })}
    </div>
  );
};

export const TrendChart: React.FC<Props> = ({ series, interval }) => {
  const max = Math.max(
    0,
    ...series.flatMap((point) => userSeries.map((s) => point[s.key])),
  );
  const ticks = niceTicks(max);

  const totals = Object.fromEntries(
    userSeries.map((s) => [
      s.key,
      series.reduce((sum, point) => sum + point[s.key], 0),
    ]),
  );

  return (
    <div className="w-full">
      <ul className={legendList} aria-label="Legend">
        {userSeries.map((s) => (
          <li
            key={s.key}
            className={legendItem}
          >
            <LineSwatch color={s.color} dash={s.dash} />
            {s.label}
            <span className="font-bold text-black-200">
              {formatFullCount(totals[s.key])}
            </span>
          </li>
        ))}
      </ul>

      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart
          data={series}
          margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
          title="Users created and deleted"
          accessibilityLayer
        >
          <CartesianGrid stroke={GRID} strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="periodStart"
            tickFormatter={(value) => formatBucket(value, interval)}
            tick={{ fontSize: 11, fill: AXIS_TEXT }}
            tickLine={false}
            axisLine={{ stroke: GRID }}
            minTickGap={24}
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
            cursor={{ stroke: AXIS_TEXT, strokeWidth: 1 }}
            content={(props) => <TrendTooltip {...props} interval={interval} />}
          />
          {userSeries.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray={s.dash}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={{
                r: 5,
                fill: s.color,
                stroke: "#fff",
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <table className="sr-only">
        <caption>Users created and deleted by {interval}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            {userSeries.map((s) => (
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
              {userSeries.map((s) => (
                <td key={s.key}>{point[s.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
