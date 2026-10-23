"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LuArrowRight, LuCircleCheck, LuCircleX } from "react-icons/lu";
import { useActivityLogs } from "#/hooks";
import { ActivityKind, ActivityLog } from "#services/types";
import { LoadError } from "./ChartCard";
import { DashboardCard } from "../common/DashboardCard";

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const fullDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const timeAgo = (iso: string, now = Date.now()) => {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size)
      return relative.format(Math.round(seconds / size), unit);
  }
  return "just now";
};

export const formatLogDate = (iso: string) => fullDate.format(new Date(iso));

export const activityActor = (log: ActivityLog) => {
  if (log.adminDetails !== undefined) {
    const admin = log.adminDetails;
    return (
      [admin?.first_name, admin?.last_name].filter(Boolean).join(" ") ||
      admin?.email ||
      "Removed admin"
    );
  }
  const user = log.userDetails;
  return (
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    (user?.user_name ? `@${user.user_name}` : "Deleted user")
  );
};

// Status is never colour alone: an icon and a word go with it
export const ActivityStatusBadge: React.FC<{ status: string }> = ({
  status,
}) =>
  status === "success" ? (
    <span className="inline-flex items-center gap-1 text-xs font-bold font-arial text-green">
      <LuCircleCheck size={14} aria-hidden /> Success
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-bold font-arial text-red">
      <LuCircleX size={14} aria-hidden /> Failed
    </span>
  );

export const activityHref = (kind: ActivityKind) =>
  `/dashboard/activity?tab=${kind}`;

const titles: Record<ActivityKind, string> = {
  users: "Recent user activity",
  admins: "Recent admin activity",
};

export const activityColumns: ColumnsType<ActivityLog> = [
  {
    title: "Activity",
    dataIndex: "description",
    key: "description",
    render: (description: string, log) => (
      <span className="flex flex-col">
        <span className="text-sm font-arial text-black-200">{description}</span>
        <span className="text-xs font-arial text-grey-200">
          {activityActor(log)}
        </span>
      </span>
    ),
  },
  {
    title: "Status",
    dataIndex: "activity_status",
    key: "status",
    width: 100,
    render: (status: string) => <ActivityStatusBadge status={status} />,
  },
  {
    title: "When",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 130,
    render: (createdAt: string) => (
      <time
        dateTime={createdAt}
        title={formatLogDate(createdAt)}
        className="whitespace-nowrap text-xs font-arial text-grey-200"
      >
        {timeAgo(createdAt)}
      </time>
    ),
  },
];

export const RecentActivityCard: React.FC<{ kind: ActivityKind }> = ({
  kind,
}) => {
  const router = useRouter();
  const { logs, isLoading, isError, refetch } = useActivityLogs(kind, {
    limit: 10,
  });
  const headingId = `recent-${kind}-heading`;

  return (
    <DashboardCard
      id={headingId}
      title={titles[kind]}
      subtitle="The 10 latest events"
      actions={
        <Link
              href={activityHref(kind)}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-bold font-arial !text-purple-200 hover:underline"
            >
              View all
              <span className="sr-only">
                {" "}
                {kind === "users" ? "user" : "admin"} activity
              </span>
              <LuArrowRight size={14} aria-hidden />
            </Link>
      }
    >

      {isError ? (
        <LoadError what={titles[kind].toLowerCase()} onRetry={refetch} />
      ) : (
        <Table<ActivityLog>
          rowKey="logId"
          size="small"
          columns={activityColumns}
          dataSource={logs}
          loading={isLoading}
          pagination={false}
          locale={{ emptyText: "No activity yet." }}
          scroll={{ x: 420 }}
          rowClassName="cursor-pointer"
          onRow={() => ({ onClick: () => router.push(activityHref(kind)) })}
        />
      )}
    </DashboardCard>
  );
};

export const RecentActivity = () => (
  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
    <RecentActivityCard kind="users" />
    <RecentActivityCard kind="admins" />
  </div>
);
