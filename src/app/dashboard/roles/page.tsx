"use client";
import React, { useState } from "react";
import { Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { endpoints } from "#/model/endpoints";
import { AdminRole } from "#services/types";
import { DateCell, ListPage, StatusTag } from "#components/elements/admin";

const columns: ColumnsType<AdminRole> = [
  {
    title: "Role",
    key: "name",
    render: (_, role) => (
      <span className="flex flex-col">
        <span className="text-sm font-bold font-arial text-black-200">
          {role.name ?? role.role}
        </span>
        {role.code && (
          <span className="font-mono text-xs text-grey-200">{role.code}</span>
        )}
      </span>
    ),
  },
  {
    title: "Permissions",
    key: "permissions",
    width: 130,
    render: (_, role) => (
      <span className="text-sm font-arial text-black-200">
        {role.permissions?.length ?? 0}
      </span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status?: string) => <StatusTag status={status} />,
  },
  {
    title: "Created",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 130,
    render: (iso?: string) => <DateCell iso={iso} />,
  },
];

const RolesPage = () => {
  const [status, setStatus] = useState<string>();

  return (
    <ListPage<AdminRole>
      title="Roles"
      subtitle="What each kind of administrator is allowed to do"
      url={endpoints.role.all}
      dataKey="roles"
      rowKey="roleId"
      columns={columns}
      searchPlaceholder="Search roles"
      searchParam="search"
      emptyText="No roles match these filters."
      filters={{ status }}
      scrollX={560}
      toolbar={
        <Select
          allowClear
          aria-label="Status"
          placeholder="Any status"
          value={status}
          onChange={setStatus}
          className="!w-36"
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      }
    />
  );
};

export default RolesPage;
