"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar, Skeleton, Tag } from "antd";
import {
  LuArrowLeft,
  LuHeart,
  LuMessageSquare,
  LuThumbsDown,
} from "react-icons/lu";
import { useAdminBlog } from "#/hooks";
import { authorName, LoadError } from "#components/elements";
import { formatFullCount } from "#components/elements";
import { chartCard, chartTitle } from "#/styles/dashboard";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const stat =
  "flex items-center gap-1.5 text-sm font-arial text-grey-200 [&>b]:text-black-200";

const BlogDetails = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const { blog, isLoading, isError, isNotFound, refetch } =
    useAdminBlog(blogId);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  // A review opened from the dashboard (#review-<id>) is scrolled to and highlighted
  useEffect(() => {
    if (!blog) return;
    const target = window.location.hash.replace("#review-", "");
    if (!target) return;
    document
      .getElementById(`review-${target}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    const frame = requestAnimationFrame(() => setHighlighted(target));
    return () => cancelAnimationFrame(frame);
  }, [blog]);

  const back = (
    <Link
      href="/dashboard"
      className="mb-4 inline-flex items-center gap-2 text-sm font-bold font-arial !text-purple-200 hover:underline"
    >
      <LuArrowLeft size={16} /> Back to overview
    </Link>
  );

  if (isLoading) {
    return (
      <div>
        {back}
        <div className={chartCard}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (isNotFound || (!isError && !blog)) {
    return (
      <div>
        {back}
        <div className={`${chartCard} py-12 text-center`}>
          <p className="text-base font-bold font-arial text-black-200">
            This blog no longer exists
          </p>
          <p className="text-sm font-arial text-grey-200">
            It may have been deleted by its author.
          </p>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div>
        {back}
        <div className={chartCard}>
          <LoadError what="this blog" onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[880px]">
      {back}

      <article className={`${chartCard} mb-6`} aria-labelledby="blog-title">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {blog.category && (
            <Tag className="!m-0 capitalize" variant="filled">
              {blog.category}
            </Tag>
          )}
          {blog.isFlagged && (
            <Tag color="red" className="!m-0" variant="filled">
              Flagged
            </Tag>
          )}
        </div>

        <h2
          id="blog-title"
          className="text-28 max-sm:text-24 font-lora font-bold leading-tight text-black-200"
        >
          {blog.title}
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-white-150 pb-4">
          <span className="flex items-center gap-2 text-sm font-arial text-black-200">
            <Avatar size={28} className="!bg-purple-200 !text-xs !font-bold">
              {authorName(blog.authorDetails).replace("@", "").charAt(0)}
            </Avatar>
            {authorName(blog.authorDetails)}
          </span>
          <span className="text-sm font-arial text-grey-200">
            {dateFormat.format(new Date(blog.createdAt))}
          </span>
          <span className={stat}>
            <LuHeart size={14} className="text-red" aria-hidden />
            <b>{formatFullCount(blog.likeNo)}</b> likes
          </span>
          <span className={stat}>
            <LuThumbsDown size={14} aria-hidden />
            <b>{formatFullCount(blog.dislikeNo)}</b> dislikes
          </span>
          <span className={stat}>
            <LuMessageSquare size={14} aria-hidden />
            <b>{formatFullCount(blog.review.length)}</b> comments
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-4 text-base font-arial leading-7 text-black-200">
          {blog.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className={chartCard} aria-labelledby="comments-heading">
        <h3 id="comments-heading" className={`${chartTitle} mb-3`}>
          Comments ({formatFullCount(blog.review.length)})
        </h3>

        {blog.review.length === 0 ? (
          <p className="py-6 text-center text-sm font-arial text-grey-200">
            No comments yet.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-white-150">
            {blog.review.map((review) => (
              <li
                key={review.reviewId}
                id={`review-${review.reviewId}`}
                className={`flex gap-3 rounded-10 px-2 py-3 transition-colors duration-700 ${highlighted === review.reviewId ? "bg-lilac-100" : ""}`}
              >
                <Avatar size={32} className="!bg-lilac-200 !text-xs !font-bold !text-purple-300">
                  {authorName(review.authorDetails).replace("@", "").charAt(0)}
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-x-2 text-sm font-bold font-arial text-black-200">
                    {authorName(review.authorDetails)}
                    {review.isEdited && (
                      <span className="text-xs font-normal text-grey-100">
                        edited
                      </span>
                    )}
                  </p>
                  <p className="text-sm font-arial text-black-200">
                    {review.review}
                  </p>
                </div>
                <span className={`${stat} shrink-0 self-start`}>
                  <LuHeart size={14} className="text-red" aria-hidden />
                  <b>{formatFullCount(review.likeNo)}</b>
                  <span className="sr-only">likes</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default BlogDetails;
