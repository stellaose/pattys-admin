import { IconType } from "react-icons";
import { chartColors } from "#config/theme";
import { LuEye, LuFileText, LuMessageSquare, LuUsers } from "react-icons/lu";
import { DashboardPeriod, DashboardSummary } from "#services/types";

export type DashboardFilter = DashboardPeriod | "all";

export type DashboardTotalKey = keyof DashboardSummary["totals"];

// Each card has its own colour: `iconClass` is the icon tile (white icon on a
// colour with at least 4.5:1 contrast) and `bgClass` the matching background
// illustration in globals.css
export type MetricConfig = {
  total: DashboardTotalKey;
  label: string;
  icon: IconType;
  iconClass: string;
  bgClass: string;
};

export const dashboardMetrics: MetricConfig[] = [
  {
    total: "users",
    label: "Total users",
    icon: LuUsers,
    iconClass: "bg-purple-200",
    bgClass: "stat-card-bg-users",
  },
  {
    total: "blogs",
    label: "Total blogs",
    icon: LuFileText,
    iconClass: "bg-[#c2410c]",
    bgClass: "stat-card-bg-blogs",
  },
  {
    total: "visits",
    label: "Total visits",
    icon: LuEye,
    iconClass: "bg-green",
    bgClass: "stat-card-bg-visits",
  },
  {
    total: "reviews",
    label: "Total comments",
    icon: LuMessageSquare,
    iconClass: "bg-[#1d63b8]",
    bgClass: "stat-card-bg-comments",
  },
];

// Line chart: user accounts created and deleted
export const userSeries = [
  {
    key: "signups",
    label: "Users created",
    color: chartColors.green,
    dash: undefined,
  },
  {
    key: "deletedUsers",
    label: "Users deleted",
    color: chartColors.red,
    dash: "6 4",
  },
] as const;

// Bar chart: login attempts
export const loginSeries = [
  { key: "visits", label: "Successful logins", color: chartColors.green },
  { key: "failedLogins", label: "Failed logins", color: chartColors.red },
] as const;

export const chartFilterOptions: { label: string; value: DashboardPeriod }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

export const trendSpan: Record<DashboardPeriod, string> = {
  day: "Last 7 days",
  week: "Last 12 weeks",
  month: "Last 12 months",
  year: "Last 5 years",
};

export const filterOptions: { label: string; value: DashboardFilter }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
  { label: "All time", value: "all" },
];

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const whole = new Intl.NumberFormat("en");

export const formatCount = (value: number) =>
  Math.abs(value) >= 10_000 ? compact.format(value) : whole.format(value);

export const formatFullCount = (value: number) => whole.format(value);

// The backend buckets in UTC, so labels are read in UTC too
const dayLabel = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  timeZone: "UTC",
});
const dayMonthLabel = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const yearLabel = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  timeZone: "UTC",
});
const monthLabel = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});

export const formatBucket = (iso: string, interval: DashboardPeriod) => {
  const date = new Date(iso);
  if (interval === "day") return dayLabel.format(date);
  if (interval === "week") return dayMonthLabel.format(date);
  if (interval === "year") return yearLabel.format(date);
  return monthLabel.format(date);
};

export const formatBucketLong = (iso: string, interval: DashboardPeriod) => {
  const date = new Date(iso);
  if (interval === "week") return `Week of ${dayMonthLabel.format(date)}`;
  if (interval === "month") return monthLabel.format(date);
  if (interval === "year") return yearLabel.format(date);
  return `${dayLabel.format(date)} ${dayMonthLabel.format(date).split(" ")[1]}`;
};
