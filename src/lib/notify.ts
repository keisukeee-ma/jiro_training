import { Resend } from "resend";
import type { ReportPage, ReportType } from "@/lib/types/database";

const PAGE_LABELS: Record<ReportPage, string> = {
  info: "基本情報",
  menu: "メニュー",
  flow: "来店フロー",
};

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  wrong: "誤っている",
  closed: "閉店している",
  update: "最新情報",
  other: "その他",
};

export type NewCommentNotifyPayload = {
  shopName: string;
  slug: string;
  page: ReportPage;
  targetLabel: string | null;
  reportType: ReportType | null;
  body: string;
  commentId: string;
};

/**
 * 新着コメント(報告)が入ったときに運営のGmailへ通知メールを送る。
 * - 必須環境変数が揃っていない場合は no-op（ローカル開発などで安全）
 * - 失敗は console.error に出すだけで例外は投げない(fire-and-forget 前提)
 */
export async function sendNewCommentNotification(
  payload: NewCommentNotifyPayload
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.NOTIFY_TO_EMAIL;
  const fromEmail = process.env.NOTIFY_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey || !toEmail) {
    console.warn(
      "[notify] RESEND_API_KEY または NOTIFY_TO_EMAIL が未設定のため通知をスキップ"
    );
    return;
  }

  const host = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pageLabel = PAGE_LABELS[payload.page];
  const typeLabel = payload.reportType
    ? REPORT_TYPE_LABELS[payload.reportType]
    : "未指定";
  const target = payload.targetLabel ?? "(ページ全体)";

  const subject = `【二郎マップ】新着報告: ${payload.shopName} / ${target} / ${typeLabel}`;

  const adminUrl = `${host}/admin/comments`;
  const shopUrl = `${host}/shops/${payload.slug}`;

  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #222; line-height: 1.6; max-width: 560px;">
  <h2 style="font-size: 16px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #f5c518;">
    🍜 新しい報告が届きました
  </h2>

  <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
    <tr>
      <td style="padding: 6px 12px 6px 0; color: #666; white-space: nowrap; width: 90px;">店舗</td>
      <td style="padding: 6px 0;"><strong>${escapeHtml(payload.shopName)}</strong></td>
    </tr>
    <tr>
      <td style="padding: 6px 12px 6px 0; color: #666;">ページ</td>
      <td style="padding: 6px 0;">${escapeHtml(pageLabel)}</td>
    </tr>
    <tr>
      <td style="padding: 6px 12px 6px 0; color: #666;">対象</td>
      <td style="padding: 6px 0;">${escapeHtml(target)}</td>
    </tr>
    <tr>
      <td style="padding: 6px 12px 6px 0; color: #666;">種別</td>
      <td style="padding: 6px 0;">${escapeHtml(typeLabel)}</td>
    </tr>
  </table>

  <div style="margin-top: 16px; padding: 12px 16px; background: #fafafa; border-left: 3px solid #f5c518; border-radius: 4px; font-size: 14px; white-space: pre-wrap;">${escapeHtml(payload.body)}</div>

  <div style="margin-top: 24px; font-size: 13px;">
    <a href="${adminUrl}" style="display: inline-block; padding: 10px 20px; background: #222; color: #fff; text-decoration: none; border-radius: 6px; margin-right: 8px;">管理画面で確認</a>
    <a href="${shopUrl}" style="color: #666; text-decoration: underline;">店舗ページ</a>
  </div>

  <p style="margin-top: 24px; font-size: 11px; color: #999;">
    受付ID: ${payload.commentId}<br/>
    このメールは二郎マップの自動通知です。
  </p>
</div>
  `.trim();

  const text = [
    `新しい報告が届きました`,
    ``,
    `店舗: ${payload.shopName}`,
    `ページ: ${pageLabel}`,
    `対象: ${target}`,
    `種別: ${typeLabel}`,
    ``,
    `--- 補足 ---`,
    payload.body,
    `-------------`,
    ``,
    `管理画面: ${adminUrl}`,
    `店舗ページ: ${shopUrl}`,
    ``,
    `受付ID: ${payload.commentId}`,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("[notify] Resend error:", error);
    }
  } catch (e) {
    console.error("[notify] Failed to send notification:", e);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
