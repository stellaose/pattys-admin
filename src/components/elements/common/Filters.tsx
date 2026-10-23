"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input, Select } from "antd";
import { LuSearch } from "react-icons/lu";
import { DashboardPeriod } from "#services/types";

export type FilterOption<T extends string> = { label: string; value: T };

type FilterSelectProps<T extends string> = {
  // read by screen readers and used by tests to find the control
  label: string;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  options: FilterOption<T>[];
  // shown when nothing is chosen; with it the filter can be cleared
  placeholder?: string;
  width?: number;
};

// Every dashboard filter is an antd Select so they look and behave alike
export const FilterSelect = <T extends string>({
  label,
  value,
  onChange,
  options,
  placeholder,
  width = 144,
}: FilterSelectProps<T>) => (
  <Select<T>
    aria-label={label}
    value={value}
    onChange={(next) => onChange(next ?? undefined)}
    options={options}
    placeholder={placeholder}
    allowClear={Boolean(placeholder)}
    popupMatchSelectWidth={false}
    style={{ width }}
  />
);

export type PeriodValue = DashboardPeriod | "all";

const periods: FilterOption<PeriodValue>[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

type PeriodFilterProps<T extends PeriodValue> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  // adds "All time" after Year
  includeAllTime?: boolean;
};

export const PeriodFilter = <T extends PeriodValue>({
  label,
  value,
  onChange,
  includeAllTime = false,
}: PeriodFilterProps<T>) => (
  <FilterSelect<T>
    label={label}
    value={value}
    onChange={(next) => next && onChange(next)}
    options={
      (includeAllTime
        ? [...periods, { label: "All time", value: "all" }]
        : periods) as FilterOption<T>[]
    }
    width={128}
  />
);

type SearchInputProps = {
  placeholder: string;
  // called with the trimmed text once typing pauses
  onSearch: (keyword: string) => void;
  delay?: number;
  width?: number;
};

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  onSearch,
  delay = 300,
  width = 256,
}) => {
  const [text, setText] = useState("");
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  });

  useEffect(() => {
    const timer = setTimeout(() => onSearchRef.current(text.trim()), delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <Input
      allowClear
      value={text}
      onChange={(event) => setText(event.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      prefix={<LuSearch size={16} className="text-grey-100" />}
      className="max-sm:!w-full"
      style={{ width }}
    />
  );
};
