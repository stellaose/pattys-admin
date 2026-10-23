"use client";
import React, { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, Table, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useActivityLogs } from "#/hooks";
import { ActivityKind, ActivityLog, ActivityStatus } from "#services/types";
import { LoadError } from "#components/elements/dashboard/ChartCard";
import {
  activityActor,
  ActivityStatusBadge,
  formatLogDate,
  timeAgo,
} from "#components/elements/dashboard/RecentActivity";
import { chartCard } from "#/styles/dashboard";

const PAGE_SIZE = 20;

type StatusFilter = "all" | ActivityStatus;

const statusOptions: { label: string; value: StatusFilter }[] = [
  { label: "Any status", value: "all" },
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
];

const columns = (kind: ActivityKind): ColumnsType<ActivityLog> => [
  {
    title: "Activity",
    dataIndex: "description",
    key: "description",
    render: (description: string) => (
      <span className="text-sm font-arial text-black-200">{description}</span>
    ),
  },
  {
    title: kind === "users" ? "User" : "Admin",
    key: "actor",
    responsive: ["md"],
    render: (_, log) => (
      <span className="text-sm font-arial text-grey-200">
        {activityActor(log)}
      </span>
    ),
  },
  {
    title: "Status",
    dataIndex: "activity_status",
    key: "status",
    width: 110,
    render: (status: string) => <ActivityStatusBadge status={status} />,
  },
  {
    title: "When",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 170,
    render: (createdAt: string) => (
      <time
        dateTime={createdAt}
        title={formatLogDate(createdAt)}
        className="text-sm font-arial text-grey-200"
      >
        {timeAgo(createdAt)}
      </time>
    ),
  },
];

const ActivityTable: React.FC<{ kind: ActivityKind }> = ({ kind }) => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>("all");

  const { logs, pagination, isLoading, isFetching, isError, refetch } =
    useActivityLogs(kind, {
      page,
      limit: PAGE_SIZE,
      status: status === "all" ? undefined : status,
    });

  if (isError) {
    return (
      <LoadError
        what={`${kind === "users" ? "user" : "admin"} activity`}
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Select
          aria-label="Status"
          options={statusOptions}
          value={status}
          onChange={(value) => {
            setStatus(value as StatusFilter);
            setPage(1);
          }}
          className="!w-36"
        />
      </div>
      <Table<ActivityLog>
        rowKey="logId"
        columns={columns(kind)}
        dataSource={logs}
        loading={isLoading || isFetching}
        locale={{ emptyText: "No activity matches this filter." }}
        pagination={{
          simple: true,
          current: page,
          pageSize: PAGE_SIZE,
          total: pagination?.total ?? 0,
          showTotal: (total) => `${total.toLocaleString("en")} events`,
          onChange: setPage,
        }}
        scroll={{ x: 560 }}
      />
    </>
  );
};

const ActivityLogs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab: ActivityKind =
    searchParams.get("tab") === "admins" ? "admins" : "users";

  return (
    <div className={chartCard}>
      <Tabs
        activeKey={tab}
        onChange={(key) => router.replace(`${pathname}?tab=${key}`)}
        destroyOnHidden
        items={[
          {
            key: "users",
            label: "User activity",
            children: <ActivityTable kind="users" />,
          },
          {
            key: "admins",
            label: "Admin activity",
            children: <ActivityTable kind="admins" />,
          },
        ]}
      />
    </div>
  );
};

// useSearchParams needs a Suspense boundary in the App Router
const ActivityPage = () => (
  <Suspense>
    <ActivityLogs />
  </Suspense>
);

export default ActivityPage;
