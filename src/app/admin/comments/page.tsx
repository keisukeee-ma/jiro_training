"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  ReportPage,
  ReportTargetKind,
  ReportType,
  ShopCommentStatus,
} from "@/lib/types/database";

type CommentRow = {
  id: string;
  shop_id: string;
  body: string;
  status: ShopCommentStatus;
  admin_note: string | null;
  page: ReportPage | null;
  target_kind: ReportTargetKind | null;
  target_id: string | null;
  target_label: string | null;
  report_type: ReportType | null;
  created_at: string;
  shops: { id: string; name: string; slug: string } | null;
};

const PAGE_LABELS: Record<ReportPage, string> = {
  info: "基本情報",
  menu: "メニュー",
  flow: "来店フロー",
};

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  wrong: "誤り",
  closed: "閉店",
  update: "最新情報",
  other: "その他",
};

const STATUS_LABELS: Record<ShopCommentStatus, string> = {
  pending: "未対応",
  reviewed: "確認済",
  applied: "反映済",
  rejected: "却下",
};

const STATUS_COLORS: Record<ShopCommentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  applied: "bg-green-100 text-green-800",
  rejected: "bg-gray-100 text-gray-600",
};

const FILTERS: Array<{ value: ShopCommentStatus | "all"; label: string }> = [
  { value: "pending", label: "未対応" },
  { value: "reviewed", label: "確認済" },
  { value: "applied", label: "反映済" },
  { value: "rejected", label: "却下" },
  { value: "all", label: "すべて" },
];

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [filter, setFilter] = useState<ShopCommentStatus | "all">("pending");
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const url =
      filter === "all"
        ? "/api/admin/comments"
        : `/api/admin/comments?status=${filter}`;
    const res = await fetch(url);
    if (res.ok) {
      setComments(await res.json());
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function updateStatus(id: string, status: ShopCommentStatus) {
    await fetch(`/api/admin/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchComments();
  }

  async function updateNote(id: string, admin_note: string) {
    await fetch(`/api/admin/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_note }),
    });
  }

  async function deleteComment(id: string) {
    if (!confirm("このコメントを削除しますか？")) return;
    await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    fetchComments();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">ユーザーからの報告</h1>

      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar -mx-4 px-4">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 px-4 py-2 text-sm rounded-full border transition-colors min-h-[40px] ${
              filter === f.value
                ? "bg-jiro-dark text-white border-jiro-dark"
                : "border-jiro-border text-jiro-gray hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-jiro-gray">読み込み中...</p>
      ) : comments.length === 0 ? (
        <div className="bg-white border border-jiro-border rounded-lg py-12 text-center">
          <p className="text-sm text-jiro-gray">該当するコメントはありません</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className="bg-white border border-jiro-border rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold">
                    {c.shops?.name ?? "(削除された店舗)"}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[c.status]}`}
                  >
                    {STATUS_LABELS[c.status]}
                  </span>
                  {c.page && (
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {PAGE_LABELS[c.page]}
                    </span>
                  )}
                  {c.target_label && (
                    <span className="text-xs px-2 py-0.5 rounded bg-jiro-yellow-light text-jiro-dark border border-jiro-yellow">
                      📍 {c.target_label}
                    </span>
                  )}
                  {c.report_type && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-700">
                      {REPORT_TYPE_LABELS[c.report_type]}
                    </span>
                  )}
                </div>
                <span className="text-xs text-jiro-gray whitespace-nowrap">
                  {new Date(c.created_at).toLocaleString("ja-JP")}
                </span>
              </div>

              <p className="text-sm whitespace-pre-wrap leading-relaxed py-2 border-t border-jiro-border mt-2">
                {c.body}
              </p>

              <div className="mt-3">
                <label className="block text-xs text-jiro-gray mb-1">
                  管理者メモ
                </label>
                <textarea
                  defaultValue={c.admin_note ?? ""}
                  onBlur={(e) => updateNote(c.id, e.target.value)}
                  rows={2}
                  placeholder="対応内容や確認結果をメモ"
                  className="w-full border border-jiro-border rounded px-2 py-1.5 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-jiro-yellow"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(["reviewed", "applied", "rejected"] as ShopCommentStatus[])
                  .filter((s) => s !== c.status)
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(c.id, s)}
                      className="text-xs px-3 py-1.5 border border-jiro-border rounded hover:bg-gray-50 min-h-[36px]"
                    >
                      {STATUS_LABELS[s]}に変更
                    </button>
                  ))}
                <button
                  onClick={() => deleteComment(c.id)}
                  className="text-xs px-3 py-1.5 text-red-600 hover:text-red-800 min-h-[36px] ml-auto"
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
