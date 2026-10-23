import React from "react";
import { Skeleton } from "antd";
import { formatCount, formatFullCount, MetricConfig } from "./metrics";
import {
  statTile,
  statTileIcon,
  statTileLabel,
  statTileMeta,
  statTileValue,
} from "#/styles/dashboard";

type Props = {
  config: MetricConfig;
  total?: number;
  isLoading: boolean;
};

// & one all-time total: no period filter or comparison
export const StatTile: React.FC<Props> = ({ config, total, isLoading }) => {
  const Icon = config.icon;

  return (
    <article
      className={`${statTile} ${config.bgClass}`}
      aria-label={config.label}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={statTileLabel}>{config.label}</span>
        <span className={`${statTileIcon} ${config.iconClass}`}>
          <Icon size={22} aria-hidden />
        </span>
      </div>

      {isLoading || total === undefined ? (
        <Skeleton
          active
          title={{ width: "50%" }}
          paragraph={{ rows: 1, width: "40%" }}
        />
      ) : (
        <>
          <span className={statTileValue} title={formatFullCount(total)}>
            {formatCount(total)}
          </span>
          <span className={statTileMeta}>Since launch</span>
        </>
      )}
    </article>
  );
};
