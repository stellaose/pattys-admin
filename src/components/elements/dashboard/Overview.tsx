"use client";
import React, { useState } from "react";
import {
  useDashboardBreakdown,
  useDashboardTotals,
  useDashboardTrends,
} from "#/hooks";
import { DashboardPeriod } from "#services/types";
import { StatTile } from "./StatTile";
import { TrendChart } from "./TrendChart";
import { LoginBarChart } from "./LoginBarChart";
import { BlogCategoryPie } from "./BlogCategoryPie";
import { ChartCard, LoadError } from "./ChartCard";
import { TopLiked } from "./TopLiked";
import { BreakdownCharts } from "./BreakdownCharts";
import { NumbersStrip } from "./NumbersStrip";
import {
  chartFilterOptions,
  dashboardMetrics,
  DashboardFilter,
  filterOptions,
  trendSpan,
} from "./metrics";
import {
  chartCard,
  overviewHeading,
  overviewToolbar,
  statGrid,
} from "#/styles/dashboard";

const breakdownSpan: Record<DashboardFilter, string> = {
  day: "Published today",
  week: "Published this week",
  month: "Published this month",
  year: "Published this year",
  all: "All blogs",
};

export const Overview = () => {
  const [loginPeriod, setLoginPeriod] = useState<DashboardPeriod>("week");
  const [userPeriod, setUserPeriod] = useState<DashboardPeriod>("week");
  const [categoryFilter, setCategoryFilter] = useState<DashboardFilter>("all");

  const totals = useDashboardTotals();
  const loginTrends = useDashboardTrends(loginPeriod);
  const userTrends = useDashboardTrends(userPeriod);
  const breakdown = useDashboardBreakdown(
    categoryFilter === "all" ? undefined : categoryFilter,
  );

  const isBusy = (query: { isLoading: boolean; isFetching: boolean }) =>
    query.isLoading || query.isFetching;

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="overview-heading">
        <div className={overviewToolbar}>
          <div>
            <h2 id="overview-heading" className={overviewHeading}>
              Everything since launch
            </h2>
          </div>
        </div>

        {totals.isError ? (
          <div className={chartCard}>
            <LoadError what="the totals" onRetry={totals.refetch} />
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className={`${statGrid} !mb-0`}>
              {dashboardMetrics.map((config) => (
                <StatTile
                  key={config.total}
                  config={config}
                  total={totals.totals?.[config.total]}
                  isLoading={totals.isLoading}
                />
              ))}
            </div>
            <NumbersStrip
              exclude={dashboardMetrics.map((config) => config.total)}
            />
          </div>
        )}
      </section>

      <ChartCard
        id="users-heading"
        title="Users"
        subtitle={trendSpan[userPeriod]}
        filterLabel="User chart period"
        options={chartFilterOptions}
        value={userPeriod}
        onChange={setUserPeriod}
        isLoading={isBusy(userTrends) || !userTrends.trends}
        isError={userTrends.isError}
        onRetry={userTrends.refetch}
      >
        {userTrends.trends && (
          <TrendChart series={userTrends.trends.series} interval={userPeriod} />
        )}
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <ChartCard
          id="logins-heading"
          title="Logins"
          subtitle={trendSpan[loginPeriod]}
          filterLabel="Login chart period"
          options={chartFilterOptions}
          value={loginPeriod}
          onChange={setLoginPeriod}
          isLoading={isBusy(loginTrends) || !loginTrends.trends}
          isError={loginTrends.isError}
          onRetry={loginTrends.refetch}
          className="xl:col-span-3"
        >
          {loginTrends.trends && (
            <LoginBarChart
              series={loginTrends.trends.series}
              interval={loginPeriod}
            />
          )}
        </ChartCard>

        <ChartCard
          id="categories-heading"
          title="Blogs by category"
          subtitle={breakdownSpan[categoryFilter]}
          filterLabel="Category chart period"
          options={filterOptions}
          value={categoryFilter}
          onChange={setCategoryFilter}
          isLoading={isBusy(breakdown) || !breakdown.breakdown}
          isError={breakdown.isError}
          onRetry={breakdown.refetch}
          skeletonHeight={220}
          className="xl:col-span-2"
        >
          {breakdown.breakdown && (
            <BlogCategoryPie slices={breakdown.breakdown.blogs.byCategory} />
          )}
        </ChartCard>
      </div>

      <BreakdownCharts />

      <TopLiked />
    </div>
  );
};
