"use client";

import { useState } from "react";

const MAX_LEN = 1000;

type Status = "idle" | "sending" | "success" | "error";

export function ShopCommentForm({ shopId }: { shopId: string }) {
  const [body, setBody] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const remaining = MAX_LEN - body.length;
  const canSubmit = body.trim().length > 0 && remaining >= 0 && status !== "sending";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_id: shopId, body: body.trim(), hp }),
      });
      if (res.ok) {
        setStatus("success");
        setBody("");
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
    <section className="mt-10 pt-6 border-t border-jiro-border">
      <h2 className="text-base font-bold mb-1">情報の誤り・最新情報の報告</h2>
      <p className="text-xs text-jiro-gray mb-4 leading-relaxed">
        掲載内容に誤りや変更があれば、お気軽にお知らせください。いただいた内容は運営で確認し、店舗情報に反映します。個人情報は入力しないでください。
      </p>

      {status === "success" ? (
        <div className="p-4 bg-jiro-yellow-light border border-jiro-yellow rounded-lg text-sm">
          <p className="font-medium text-jiro-dark">送信ありがとうございます！</p>
          <p className="text-jiro-gray mt-1">
            内容を確認のうえ、店舗情報に反映させていただきます。
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-3 text-xs text-jiro-dark underline"
          >
            続けて報告する
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
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
          <div>
            <label htmlFor="comment-body" className="sr-only">
              コメント本文
            </label>
            <textarea
              id="comment-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              maxLength={MAX_LEN + 100}
              placeholder="例: 営業時間が変更されていました。現在は11:00〜15:00のみ営業のようです。"
              className="w-full border border-jiro-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-jiro-yellow resize-y"
            />
            <div className="flex justify-between items-center mt-1 text-xs">
              <span
                className={
                  remaining < 0 ? "text-red-600" : "text-jiro-gray"
                }
              >
                残り {remaining} 文字
              </span>
              {errorMsg && <span className="text-red-600">{errorMsg}</span>}
            </div>
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-jiro-dark text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jiro-yellow focus-visible:ring-offset-2"
          >
            {status === "sending" ? "送信中..." : "報告を送信"}
          </button>
        </form>
      )}
    </section>
  );
}
