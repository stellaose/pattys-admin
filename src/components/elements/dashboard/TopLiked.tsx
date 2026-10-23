"use client";
import React from "react";
import Link from "next/link";
import { Skeleton, Tag } from "antd";
import {
  LuArrowRight,
  LuChevronRight,
  LuHeart,
  LuMessageSquare,
} from "react-icons/lu";
import { useTopBlogs, useTopReviews } from "#/hooks";
import { AuthorDetails } from "#services/types";
import { LoadError } from "./ChartCard";
import { formatFullCount } from "./metrics";
import { DashboardCard } from "../common/DashboardCard";

export const authorName = (author: AuthorDetails | null) =>
  [author?.first_name, author?.last_name].filter(Boolean).join(" ") ||
  (author?.user_name ? `@${author.user_name}` : "Deleted user");

export const blogHref = (blogId: string) => `/dashboard/blogs/${blogId}`;

const ViewAll: React.FC<{ href: string; what: string }> = ({ href, what }) => (
  <Link
    href={href}
    className="inline-flex shrink-0 items-center gap-1 text-sm font-bold font-arial !text-purple-200 hover:underline"
  >
    View all<span className="sr-only"> {what}</span>
    <LuArrowRight size={14} aria-hidden />
  </Link>
);

const rankBadge =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lilac-100 text-xs font-bold font-arial text-purple-200";

const row =
  "group flex items-center gap-3 rounded-10 px-2 py-2.5 transition-colors hover:bg-lilac-100/60 focus-visible:outline-2 focus-visible:outline-purple-200";

const Likes: React.FC<{ value: number }> = ({ value }) => (
  <span
    className="flex shrink-0 items-center gap-1 text-sm font-bold font-arial text-black-200"
    title={`${formatFullCount(value)} likes`}
  >
    <LuHeart size={14} className="text-red" aria-hidden />
    {formatFullCount(value)}
    <span className="sr-only">likes</span>
  </span>
);

const ListState: React.FC<{
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  what: string;
  onRetry: () => void;
  children: React.ReactNode;
}> = ({ isLoading, isError, isEmpty, what, onRetry, children }) => {
  if (isError) return <LoadError what={what} onRetry={onRetry} />;
  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (isEmpty)
    return (
      <p className="py-12 text-center text-sm font-arial text-grey-200">
        Nothing has been liked yet.
      </p>
    );
  return <>{children}</>;
};

export const TopBlogs = () => {
  const { blogs, isLoading, isError, refetch } = useTopBlogs();

  return (
    <DashboardCard
      id="top-blogs-heading"
      title="Most liked blogs"
      subtitle="Top 10 of all time · open one for details"
      actions={<ViewAll href="/dashboard/blogs" what="blogs" />}
    >

      <ListState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!blogs.length}
        what="the most liked blogs"
        onRetry={refetch}
      >
        <ol className="flex flex-col">
          {blogs.map((blog, index) => (
            <li key={blog.blogId}>
              <Link href={blogHref(blog.blogId)} className={row}>
                <span className={rankBadge}>{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold font-arial text-black-200 group-hover:text-purple-200">
                    {blog.title}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-2 text-xs font-arial text-grey-200">
                    <span>{authorName(blog.authorDetails)}</span>
                    {blog.category && (
                      <Tag className="!m-0 !text-[10px] !leading-4 capitalize" variant="filled">
                        {blog.category}
                      </Tag>
                    )}
                    {blog.isFlagged && (
                      <Tag color="red" className="!m-0 !text-[10px] !leading-4" variant="filled">
                        Flagged
                      </Tag>
                    )}
                    <span className="flex items-center gap-1">
                      <LuMessageSquare size={12} aria-hidden />
                      {formatFullCount(blog.reviewCount)}
                      <span className="sr-only">comments</span>
                    </span>
                  </span>
                </span>
                <Likes value={blog.likeNo} />
                <LuChevronRight
                  size={16}
                  className="shrink-0 text-grey-100 group-hover:text-purple-200"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ol>
      </ListState>
    </DashboardCard>
  );
};

export const TopReviews = () => {
  const { reviews, isLoading, isError, refetch } = useTopReviews();

  return (
    <DashboardCard
      id="top-comments-heading"
      title="Most liked comments"
      subtitle="Top 10 of all time · open one to see its blog"
      actions={<ViewAll href="/dashboard/comments" what="comments" />}
    >

      <ListState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!reviews.length}
        what="the most liked comments"
        onRetry={refetch}
      >
        <ol className="flex flex-col">
          {reviews.map((review, index) => (
            <li key={review.reviewId}>
              <Link
                href={`${blogHref(review.blogId)}#review-${review.reviewId}`}
                className={row}
              >
                <span className={rankBadge}>{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-arial text-black-200 group-hover:text-purple-200">
                    &ldquo;{review.review}&rdquo;
                  </span>
                  <span className="block truncate text-xs font-arial text-grey-200">
                    {authorName(review.authorDetails)} on{" "}
                    <span className="font-bold">
                      {review.blogTitle ?? "a deleted blog"}
                    </span>
                  </span>
                </span>
                <Likes value={review.likeNo} />
                <LuChevronRight
                  size={16}
                  className="shrink-0 text-grey-100 group-hover:text-purple-200"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ol>
      </ListState>
    </DashboardCard>
  );
};

export const TopLiked = () => (
  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
    <TopBlogs />
    <TopReviews />
  </div>
);
