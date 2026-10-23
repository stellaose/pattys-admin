"use client";
import React, { ReactNode } from "react";
import { Button, Skeleton } from "antd";
import { LuRefreshCw } from "react-icons/lu";
import { DashboardCard } from "../common/DashboardCard";
import { FilterSelect } from "../common/Filters";

type Option<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  id: string;
  title: string;
  subtitle?: string;
  filterLabel: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  skeletonHeight?: number;
  className?: string;
  children: ReactNode;
};

export const LoadError: React.FC<{ what: string; onRetry: () => void }> = ({
  what,
  onRetry,
}) => (
  <div className="flex flex-col items-center gap-3 py-12 text-center">
    <p className="text-base font-bold font-arial text-black-200">
      We couldn&apos;t load {what}
    </p>
    <p className="text-sm font-arial text-grey-200">
      Check your connection and try again.
    </p>
    <Button icon={<LuRefreshCw size={14} />} onClick={onRetry}>
      Try again
    </Button>
  </div>
);

export const ChartCard = <T extends string>({
  id,
  title,
  subtitle,
  filterLabel,
  options,
  value,
  onChange,
  isLoading,
  isError,
  onRetry,
  skeletonHeight = 290,
  className = "",
  children,
}: Props<T>) => (
  <DashboardCard
    id={id}
    title={title}
    subtitle={subtitle}
    className={className}
    actions={
      <FilterSelect<T>
        label={filterLabel}
        value={value}
        onChange={(next) => next && onChange(next)}
        options={options}
        width={128}
      />
    }
  >
    {isError ? (
      <LoadError what={title.toLowerCase()} onRetry={onRetry} />
    ) : isLoading ? (
      <Skeleton.Node
        active
        className="!w-full"
        style={{ height: skeletonHeight }}
      >
        <span />
      </Skeleton.Node>
    ) : (
      children
    )}
  </DashboardCard>
);
