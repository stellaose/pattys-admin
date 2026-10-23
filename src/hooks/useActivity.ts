import { useGetDataConfigQuery } from "#/store";
import { endpoints } from "#/model/endpoints";
import { ActivityKind, ActivityPage, ActivityStatus } from "#services/types";

type Options = { page?: number; limit?: number; status?: ActivityStatus };

export const useActivityLogs = (
  kind: ActivityKind,
  { page = 1, limit = 10, status }: Options = {},
) => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDataConfigQuery({
      getUrl: endpoints.activity[kind],
      params: { page, limit, ...(status && { status }) },
    });

  const result = data as ActivityPage | undefined;

  return {
    logs: result?.logs ?? [],
    pagination: result?.pagination,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};
