import { useGetDataConfigQuery, useGetDataQuery } from "#/store";
import { endpoints } from "#/model/endpoints";
import { AdminBlog, TopBlog, TopReview } from "#services/types";

export const useTopBlogs = (limit = 10) => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDataConfigQuery({
      getUrl: endpoints.dashboard.topBlogs,
      params: { limit },
    });

  return {
    blogs: (data?.blogs ?? []) as TopBlog[],
    isLoading: isLoading || isFetching,
    isError,
    refetch,
  };
};

export const useTopReviews = (limit = 10) => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDataConfigQuery({
      getUrl: endpoints.dashboard.topReviews,
      params: { limit },
    });

  return {
    reviews: (data?.reviews ?? []) as TopReview[],
    isLoading: isLoading || isFetching,
    isError,
    refetch,
  };
};

export const useAdminBlog = (blogId: string) => {
  const { data, isLoading, isError, error, refetch } = useGetDataQuery(
    { getUrl: endpoints.blogs.one.replace(":blogId", blogId) },
    { skip: !blogId },
  );

  return {
    blog: data?.blog as AdminBlog | undefined,
    isLoading,
    isError,
    isNotFound: (error as { status?: number } | undefined)?.status === 404,
    refetch,
  };
};
