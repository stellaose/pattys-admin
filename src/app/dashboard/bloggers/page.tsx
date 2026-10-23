"use client";
import React, { useState } from "react";
import { Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { endpoints } from "#/model/endpoints";
import { Blogger } from "#services/types";
import {
  DateCell,
  fullName,
  ListPage,
  PersonCell,
  StatusTag,
} from "#components/elements/admin";

type Verification = "all" | "verified" | "unverified";

const columns: ColumnsType<Blogger> = [
  {
    title: "Blogger",
    key: "name",
    render: (_, blogger) => (
      <PersonCell
        name={fullName(blogger)}
        detail={blogger.user_name ? `@${blogger.user_name}` : undefined}
      />
    ),
  },
  {
    title: "E-mail",
    dataIndex: "email",
    key: "email",
    render: (email?: string) => (
      <span className="text-sm font-arial text-grey-200">{email ?? "—"}</span>
    ),
  },
  {
    title: "Blogs",
    dataIndex: "blogCount",
    key: "blogCount",
    width: 90,
    render: (count: number) => (
      <span className="text-sm font-bold font-arial">{count}</span>
    ),
  },
  {
    title: "E-mail status",
    dataIndex: "isEmailVerified",
    key: "verified",
    width: 130,
    render: (verified?: boolean) => (
      <StatusTag status={verified ? "verified" : "unverified"} />
    ),
  },
  {
    title: "Joined",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 130,
    render: (iso: string) => <DateCell iso={iso} />,
  },
];

const BloggersPage = () => {
  const [verification, setVerification] = useState<Verification>("all");
  const [gender, setGender] = useState<string>();

  return (
    <ListPage<Blogger>
      title="Bloggers"
      subtitle="Everyone with a Pattys account"
      url={endpoints.bloggers.all}
      dataKey="bloggers"
      rowKey="userId"
      columns={columns}
      searchPlaceholder="Search name, username or e-mail"
      emptyText="No bloggers match these filters."
      filters={{
        isEmailVerified:
          verification === "all" ? undefined : verification === "verified",
        gender,
      }}
      toolbar={
        <>
          <Select
            aria-label="E-mail status"
            options={[
              { label: "Any e-mail status", value: "all" },
              { label: "Verified", value: "verified" },
              { label: "Unverified", value: "unverified" },
            ]}
            value={verification}
            onChange={(value) => setVerification(value as Verification)}
            className="!w-44"
          />
          <Select
            allowClear
            aria-label="Gender"
            placeholder="Any gender"
            value={gender}
            onChange={setGender}
            className="!w-36"
            options={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
            ]}
          />
        </>
      }
    />
  );
};

export default BloggersPage;
