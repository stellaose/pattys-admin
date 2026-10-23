"use client";
import React, { useState } from "react";
import { Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { endpoints } from "#/model/endpoints";
import { AdminAccount } from "#services/types";
import {
  DateCell,
  fullName,
  ListPage,
  PersonCell,
  StatusTag,
} from "#components/elements/admin";

const statuses = [
  "active",
  "pending",
  "inactive",
  "suspended",
  "watchlisted",
  "blacklisted",
];

const columns: ColumnsType<AdminAccount> = [
  {
    title: "Administrator",
    key: "name",
    render: (_, admin) => (
      <PersonCell name={fullName(admin)} detail={admin.email} />
    ),
  },
  {
    title: "Role",
    key: "role",
    width: 180,
    render: (_, admin) => (
      <span className="text-sm font-arial text-black-200">
        {admin.adminRole?.name ?? admin.role ?? "—"}
      </span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 130,
    render: (status?: string) => <StatusTag status={status} />,
  },
  {
    title: "Added",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 130,
    render: (iso?: string) => <DateCell iso={iso} />,
  },
];

const AdministratorsPage = () => {
  const [status, setStatus] = useState<string>();

  return (
    <ListPage<AdminAccount>
      title="Administrators"
      subtitle="Everyone who can sign in to this console"
      url={endpoints.admin.all}
      dataKey="admins"
      rowKey="adminId"
      columns={columns}
      searchPlaceholder="Search name or e-mail"
      emptyText="No administrators match these filters."
      filters={{ status, sort: "-createdAt" }}
      toolbar={
        <Select
          allowClear
          aria-label="Status"
          placeholder="Any status"
          value={status}
          onChange={setStatus}
          className="!w-40"
          options={statuses.map((value) => ({
            value,
            label: value.charAt(0).toUpperCase() + value.slice(1),
          }))}
        />
      }
    />
  );
};

export default AdministratorsPage;
