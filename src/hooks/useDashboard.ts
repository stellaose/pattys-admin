import { useGetDataConfigQuery } from "#/store";
import { endpoints } from "#/model/endpoints";
import {
  DashboardBreakdown,
  DashboardPeriod,
  DashboardSummary,
  DashboardTotals,
  DashboardTrends,
} from "#services/types";

export const useDashboardSummary = (period: DashboardPeriod) => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDataConfigQuery({
      getUrl: endpoints.dashboard.summary,
      params: { period },
    });

  return {
    summary: data as DashboardSummary | undefined,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};

export const useDashboardTrends = (interval: DashboardPeriod) => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDataConfigQuery({
      getUrl: endpoints.dashboard.trends,
      params: { interval },
    });

  return {
    trends: data as DashboardTrends | undefined,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};

export const useDashboardBreakdown = (period?: DashboardPeriod) => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDataConfigQuery({
      getUrl: endpoints.dashboard.breakdown,
      params: period ? { period } : {},
    });

  return {
    breakdown: data as DashboardBreakdown | undefined,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};

// All-time totals: the backend takes no period for these
export const useDashboardTotals = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDataConfigQuery({ getUrl: endpoints.dashboard.totals });

  return {
    totals: (data as DashboardTotals | undefined)?.totals,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};
