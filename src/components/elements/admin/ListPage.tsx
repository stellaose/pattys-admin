"use client";
import React, { ReactNode, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ListParams, useAdminList } from "#/hooks";
import { LoadError } from "#components/elements/dashboard/ChartCard";
import { DashboardCard, SearchInput } from "#components/elements/common";

export const PAGE_SIZE = 10;

type Props<T> = {
  title: string | ReactNode;
  subtitle?: string;
  url: string;
  dataKey: string;
  rowKey: keyof T & string;
  columns: ColumnsType<T>;
  searchPlaceholder: string;
  searchParam?: string;
  filters?: ListParams;
  toolbar?: ReactNode;
  emptyText?: string;
  onRowClick?: (row: T) => void;
  scrollX?: number;
};

export const ListPage = <T extends object>({
  title,
  subtitle,
  url,
  dataKey,
  rowKey,
  columns,
  searchPlaceholder,
  searchParam = "keyword",
  filters = {},
  toolbar,
  emptyText = "Nothing matches your search.",
  onRowClick,
}: Props<T>) => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const filterKey = JSON.stringify(filters);

  const onSearch = (next: string) => {
    if (next === keyword) return;
    setKeyword(next);
    setPage(1);
  };

  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (lastFilterKey !== filterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
  }

  const { rows, total, isLoading, isError, refetch } = useAdminList<T>(
    url,
    dataKey,
    { ...filters, [searchParam]: keyword, page, limit: PAGE_SIZE },
  );

  return (
    <DashboardCard
      id={`${dataKey}-heading`}
    
      subtitle={subtitle}
      headingLevel={2}
      actions={
        <>
          {toolbar}
          <SearchInput placeholder={searchPlaceholder} onSearch={onSearch} />
        </>
      }
    >
      {isError ? (
        <LoadError
          what={typeof title === "string" ? title.toLowerCase() : "this list"}
          onRetry={refetch}
        />
      ) : (
        <Table<T>
          rowKey={rowKey}
          columns={columns}
          dataSource={rows}
          loading={isLoading}
          locale={{ emptyText }}
          scroll={{ x: 1024 }}
          rowClassName={onRowClick ? "cursor-pointer" : undefined}
          onRow={
            onRowClick
              ? (row) => ({ onClick: () => onRowClick(row) })
              : undefined
          }
          pagination={{
            simple: true,
            current: page,
            pageSize: PAGE_SIZE,
            total,
            showTotal: (count) => `${count.toLocaleString("en")} total`,
            onChange: setPage,
          }}
        />
      )}
    </DashboardCard>
  );
};
