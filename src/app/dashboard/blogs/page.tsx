"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LuHeart, LuMessageSquare } from "react-icons/lu";
import { endpoints } from "#/model/endpoints";
import { TopBlog } from "#services/types";
import {
  DateCell,
  fullName,
  ListPage,
  StatusTag,
} from "#components/elements/admin";

const categories = [
  "news",
  "politics",
  "entertainment",
  "sports",
  "business",
  "education",
  "other",
];

type StatusFilter = "all" | "published" | "flagged";

const columns: ColumnsType<TopBlog> = [
  {
    title: "Blog",
    key: "title",
    render: (_, blog) => (
      <span className="flex flex-col">
        <span className="text-sm font-bold font-arial text-black-200">
          {blog.title}
        </span>
        <span className="text-xs font-arial text-grey-200">
          {fullName(blog.authorDetails)}
        </span>
      </span>
    ),
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    width: 130,
    render: (category?: string) =>
      category ? (
        <Tag variant="filled" className="!m-0 capitalize">
          {category}
        </Tag>
      ) : (
        "—"
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
    title: "Comments",
    dataIndex: "reviewCount",
    key: "reviewCount",
    width: 110,
    render: (count: number) => (
      <span className="flex items-center gap-1 text-sm font-arial">
        <LuMessageSquare size={14} className="text-grey-100" aria-hidden />
        {count.toLocaleString("en")}
      </span>
    ),
  },
  {
    title: "Status",
    dataIndex: "isFlagged",
    key: "status",
    width: 110,
    render: (isFlagged: boolean) => (
      <StatusTag status={isFlagged ? "flagged" : "published"} />
    ),
  },
  {
    title: "Published",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 130,
    render: (iso: string) => <DateCell iso={iso} />,
  },
];

const BlogsPage = () => {
  const router = useRouter();
  const [category, setCategory] = useState<string>();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState("-createdAt");

  return (
    <ListPage<TopBlog>
      title="Blogs"
      subtitle="Every blog on Pattys · open one for its details and comments"
      url={endpoints.blogs.all}
      dataKey="blogs"
      rowKey="blogId"
      columns={columns}
      searchPlaceholder="Search blog titles"
      emptyText="No blogs match these filters."
      filters={{
        category,
        isFlagged: status === "all" ? undefined : status === "flagged",
        sort,
      }}
      onRowClick={(blog) => router.push(`/dashboard/blogs/${blog.blogId}`)}
      toolbar={
        <>
          <Select
            aria-label="Status"
            options={[
              { label: "Any status", value: "all" },
              { label: "Published", value: "published" },
              { label: "Flagged", value: "flagged" },
            ]}
            value={status}
            onChange={(value) => setStatus(value as StatusFilter)}
            className="!w-36"
          />
          <Select
            allowClear
            aria-label="Category"
            placeholder="All categories"
            value={category}
            onChange={setCategory}
            className="!w-40"
            options={categories.map((value) => ({
              value,
              label: value.charAt(0).toUpperCase() + value.slice(1),
            }))}
          />
          <Select
            aria-label="Sort"
            value={sort}
            onChange={setSort}
            className="!w-36"
            options={[
              { value: "-createdAt", label: "Newest" },
              { value: "createdAt", label: "Oldest" },
              { value: "-likeNo", label: "Most liked" },
            ]}
          />
        </>
      }
    />
  );
};

export default BlogsPage;
