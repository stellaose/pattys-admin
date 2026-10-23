import { useGetDataConfigQuery } from "#/store";

export type ListParams = Record<string, string | number | boolean | undefined>;

type ListPagination = {
  total?: number;
  totalAdmins?: number;
  totalRoles?: number;
  totalPages?: number;
  currentPage?: number;
};

// Every admin list endpoint returns { [key]: rows, pagination }; admins and
// roles name their total differently, so it is normalised here
export const useAdminList = <T>(
  url: string,
  key: string,
  params: ListParams,
) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetDataConfigQuery({ getUrl: url, params: cleanParams });

  const pagination = data?.pagination as ListPagination | undefined;

  return {
    rows: (data?.[key] ?? []) as T[],
    total:
      pagination?.total ??
      pagination?.totalAdmins ??
      pagination?.totalRoles ??
      0,
    isLoading: isLoading || isFetching,
    isError,
    refetch,
  };
};
