"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";
import { LuHeart } from "react-icons/lu";
import { endpoints } from "#/model/endpoints";
import { TopReview } from "#services/types";
import { DateCell, fullName, ListPage } from "#components/elements/admin";

const commentHref = (comment: TopReview) =>
  `/dashboard/blogs/${comment.blogId}#review-${comment.reviewId}`;

const columns: ColumnsType<TopReview> = [
  {
    title: "Comment",
    key: "review",
    render: (_, comment) => (
      <span className="flex flex-col">
        <span className="text-sm font-arial text-black-200">
          {comment.review}
          {comment.isEdited && (
            <span className="ml-1.5 text-xs text-grey-100">(edited)</span>
          )}
        </span>
        <span className="text-xs font-arial text-grey-200">
          {fullName(comment.authorDetails)}
        </span>
      </span>
    ),
  },
  {
    title: "On blog",
    key: "blog",
    width: 260,
    render: (_, comment) =>
      comment.blogTitle ? (
        <Link
          href={`/dashboard/blogs/${comment.blogId}`}
          onClick={(event) => event.stopPropagation()}
          className="text-sm font-bold font-arial !text-purple-200 hover:underline"
        >
          {comment.blogTitle}
        </Link>
      ) : (
        <span className="text-sm font-arial text-grey-100">Deleted blog</span>
      ),
  },
  {
    title: "Likes",
    dataIndex: "likeNo",
    key: "likeNo",
    width: 90,
    render: (likes: number) => (
      <span className="flex items-center gap-1 text-sm font-arial">
        <LuHeart size={14} className="text-red" aria-hidden />
        {likes.toLocaleString("en")}
      </span>
    ),
  },
  {
    title: "Posted",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 130,
    render: (iso: string) => <DateCell iso={iso} />,
  },
];

const CommentsPage = () => {
  const router = useRouter();

  return (
    <ListPage<TopReview>
      title="Comments"
      subtitle="Every comment on every blog · open one to see it in place"
      url={endpoints.comments.all}
      dataKey="comments"
      rowKey="reviewId"
      columns={columns}
      searchPlaceholder="Search comments"
      emptyText="No comments match your search."
      onRowClick={(comment) => router.push(commentHref(comment))}
    />
  );
};

export default CommentsPage;
