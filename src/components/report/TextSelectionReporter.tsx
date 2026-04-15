"use client";

import { useEffect, useState } from "react";
import { useReport } from "./ReportContext";
import type { ReportPage } from "@/lib/types/database";

type FloatPos = { x: number; y: number; text: string } | null;

/**
 * PC（マウス）でのテキスト選択時に「ここを報告」フローティングボタンを出す。
 * モバイルでは長押しメニューと競合するため無効化。
 */
export function TextSelectionReporter({
  defaultPage,
}: {
  defaultPage: ReportPage;
}) {
  const { openReport } = useReport();
  const [pos, setPos] = useState<FloatPos>(null);

  useEffect(() => {
    // タッチデバイスでは無効化
    if (typeof window === "undefined") return;
    const isTouch =
      window.matchMedia?.("(hover: none)").matches ||
      "ontouchstart" in window;
    if (isTouch) return;

    const handleMouseUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setPos(null);
        return;
      }
      const text = sel.toString().trim();
      if (text.length < 3 || text.length > 200) {
        setPos(null);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setPos(null);
        return;
      }
      setPos({
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + window.scrollY - 8,
        text,
      });
    };

    const handleMouseDown = () => setPos(null);

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  if (!pos) return null;

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        // mousedown で選択が消えないよう抑止
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={() => {
        openReport({
          page: defaultPage,
          targetKind: "selection",
          targetLabel: pos.text,
        });
        setPos(null);
        window.getSelection()?.removeAllRanges();
      }}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -100%)",
      }}
      className="z-40 px-3 py-1.5 text-xs font-medium bg-jiro-dark text-white rounded-full shadow-lg hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jiro-yellow whitespace-nowrap"
    >
      ⚠ ここを報告
    </button>
  );
}
