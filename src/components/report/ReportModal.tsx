"use client";

import { useEffect, useState } from "react";
import type { ReportTarget } from "./ReportContext";
import type { ReportType } from "@/lib/types/database";

const MAX_LEN = 1000;

type Status = "idle" | "sending" | "success" | "error";

const REPORT_TYPES: { value: ReportType; label: string }[] = [
  { value: "wrong", label: "誤っている" },
  { value: "closed", label: "閉店している" },
  { value: "update", label: "最新情報がある" },
  { value: "other", label: "その他" },
];

export function ReportModal({
  shopId,
  target,
  onClose,
}: {
  shopId: string;
  target: ReportTarget | null;
  onClose: () => void;
}) {
  const [reportType, setReportType] = useState<ReportType>("wrong");
  const [body, setBody] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const remaining = MAX_LEN - body.length;

  useEffect(() => {
    if (target) {
      setReportType("wrong");
      setBody("");
      setHp("");
      setStatus("idle");
      setErrorMsg("");
    }
  }, [target]);

  useEffect(() => {
    if (!target) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [target, onClose]);

  if (!target) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!target) return;
    if (remaining < 0) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop_id: shopId,
          body: body.trim(),
          hp,
          page: target.page,
          target_kind: target.targetKind,
          target_id: target.targetId ?? null,
          target_label: target.targetLabel,
          report_type: reportType,
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json.error ?? "送信に失敗しました");
        setStatus("error");
      }
    } catch {
      setErrorMsg("ネットワークエラーが発生しました");
      setStatus("error");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-jiro-border px-4 py-3 flex items-center justify-between">
          <h2
            id="report-modal-title"
            className="text-sm font-bold text-jiro-dark truncate pr-2"
          >
            「{target.targetLabel}」の報告
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jiro-yellow"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {status === "success" ? (
          <div className="p-5">
            <p className="font-medium text-jiro-dark">
              送信ありがとうございます！
            </p>
            <p className="text-xs text-jiro-gray mt-1 leading-relaxed">
              内容を確認のうえ、店舗情報に反映させていただきます。
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full min-h-[44px] px-4 py-2.5 bg-jiro-dark text-white rounded-lg text-sm font-medium hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jiro-yellow"
            >
              閉じる
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* honeypot */}
            <input
              type="text"
              name="hp"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <fieldset>
              <legend className="text-xs text-jiro-gray mb-2">
                どのような報告ですか？
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {REPORT_TYPES.map((rt) => (
                  <label
                    key={rt.value}
                    className={`cursor-pointer border rounded-lg px-3 py-2.5 text-xs text-center min-h-[44px] flex items-center justify-center transition-colors ${
                      reportType === rt.value
                        ? "border-jiro-dark bg-jiro-yellow-light font-medium"
                        : "border-jiro-border hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="report_type"
                      value={rt.value}
                      checked={reportType === rt.value}
                      onChange={() => setReportType(rt.value)}
                      className="sr-only"
                    />
                    {rt.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="report-body"
                className="block text-xs text-jiro-gray mb-1"
              >
                補足（任意）
              </label>
              <textarea
                id="report-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                maxLength={MAX_LEN + 100}
                placeholder="正しい情報がわかる場合はご記入ください"
                className="w-full border border-jiro-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-jiro-yellow resize-y"
              />
              <div className="flex justify-between items-center mt-1 text-xs">
                <span
                  className={remaining < 0 ? "text-red-600" : "text-jiro-gray"}
                >
                  残り {remaining} 文字
                </span>
                {errorMsg && <span className="text-red-600">{errorMsg}</span>}
              </div>
            </div>

            <p className="text-[11px] text-jiro-gray leading-relaxed">
              個人情報は入力しないでください。送信内容は運営で確認し、店舗情報に反映します。
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[44px] px-4 py-2.5 border border-jiro-border text-jiro-dark rounded-lg text-sm font-medium hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jiro-yellow"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={status === "sending" || remaining < 0}
                className="flex-1 min-h-[44px] px-4 py-2.5 bg-jiro-dark text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jiro-yellow focus-visible:ring-offset-2"
              >
                {status === "sending" ? "送信中..." : "報告を送信"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
