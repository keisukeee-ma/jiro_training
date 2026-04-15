"use client";

import { useReport } from "./ReportContext";
import type { ReportPage, ReportTargetKind } from "@/lib/types/database";

/**
 * インライン配置用の小さな⚠ボタン。
 * テーブル行など `<Reportable>` でラップしづらい箇所で使う。
 */
export function ReportButton({
  page,
  targetKind,
  targetId,
  targetLabel,
  className = "",
}: {
  page: ReportPage;
  targetKind: ReportTargetKind;
  targetId?: string | null;
  targetLabel: string;
  className?: string;
}) {
  const { openReport } = useReport();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openReport({ page, targetKind, targetId, targetLabel });
      }}
      aria-label={`${targetLabel} の誤りを報告`}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-jiro-gray/60 hover:text-jiro-dark hover:bg-jiro-yellow-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jiro-yellow transition-colors ${className}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </button>
  );
}
