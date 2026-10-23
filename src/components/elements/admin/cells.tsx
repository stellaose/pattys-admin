import React from "react";
import { Avatar, Tag } from "antd";

const dateOnly = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const formatDate = (iso?: string) =>
  iso ? dateOnly.format(new Date(iso)) : "—";

export const fullName = (person?: {
  first_name?: string;
  last_name?: string;
  user_name?: string;
  email?: string;
} | null) =>
  [person?.first_name, person?.last_name].filter(Boolean).join(" ") ||
  (person?.user_name ? `@${person.user_name}` : person?.email) ||
  "Deleted account";

export const PersonCell: React.FC<{ name: string; detail?: string }> = ({
  name,
  detail,
}) => (
  <span className="flex items-center gap-2.5">
    <Avatar size={32} className="!shrink-0 !bg-lilac-100 !text-xs !font-bold !text-purple-300">
      {name.replace("@", "").charAt(0).toUpperCase()}
    </Avatar>
    <span className="flex min-w-0 flex-col">
      <span className="truncate text-sm font-bold font-arial text-black-200">
        {name}
      </span>
      {detail && (
        <span className="truncate text-xs font-arial text-grey-200">
          {detail}
        </span>
      )}
    </span>
  </span>
);

export const DateCell: React.FC<{ iso?: string }> = ({ iso }) => (
  <time dateTime={iso} className="whitespace-nowrap text-sm font-arial text-grey-200">
    {formatDate(iso)}
  </time>
);

const statusColors: Record<string, string> = {
  active: "green",
  published: "green",
  verified: "green",
  pending: "gold",
  unverified: "gold",
  watchlisted: "gold",
  inactive: "default",
  suspended: "red",
  blacklisted: "red",
  flagged: "red",
};

export const StatusTag: React.FC<{ status?: string }> = ({ status }) =>
  status ? (
    <Tag color={statusColors[status] ?? "default"} variant="filled" className="!m-0 capitalize">
      {status}
    </Tag>
  ) : (
    <span className="text-grey-100">—</span>
  );
