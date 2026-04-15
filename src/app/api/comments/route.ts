import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendNewCommentNotification } from "@/lib/notify";

const MAX_BODY_LEN = 1000;
const MAX_LABEL_LEN = 200;

const PAGES = ["info", "menu", "flow"] as const;
const TARGET_KINDS = [
  "field",
  "menu_item",
  "topping",
  "visit_step",
  "selection",
  "free",
] as const;
const REPORT_TYPES = ["wrong", "closed", "update", "other"] as const;

type Page = (typeof PAGES)[number];
type TargetKind = (typeof TARGET_KINDS)[number];
type ReportType = (typeof REPORT_TYPES)[number];

const REPORT_TYPE_LABEL: Record<ReportType, string> = {
  wrong: "誤っている",
  closed: "閉店している",
  update: "最新情報あり",
  other: "その他",
};

function pick<T extends readonly string[]>(
  value: unknown,
  list: T
): T[number] | null {
  return typeof value === "string" && (list as readonly string[]).includes(value)
    ? (value as T[number])
    : null;
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ハニーポット
  if (typeof payload.hp === "string" && payload.hp.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const shop_id = typeof payload.shop_id === "string" ? payload.shop_id : "";
  if (!shop_id) {
    return NextResponse.json({ error: "shop_id is required" }, { status: 400 });
  }

  const rawBody =
    typeof payload.body === "string" ? payload.body.trim() : "";
  if (rawBody.length > MAX_BODY_LEN) {
    return NextResponse.json(
      { error: `本文は${MAX_BODY_LEN}文字以内で入力してください` },
      { status: 400 }
    );
  }

  const page: Page | null = pick(payload.page, PAGES);
  const target_kind: TargetKind | null = pick(payload.target_kind, TARGET_KINDS);
  const report_type: ReportType | null = pick(payload.report_type, REPORT_TYPES);
  const target_id =
    typeof payload.target_id === "string" && payload.target_id.length <= 64
      ? payload.target_id
      : null;
  const target_label =
    typeof payload.target_label === "string"
      ? payload.target_label.slice(0, MAX_LABEL_LEN)
      : null;

  // 自由記述が空の場合は自動生成（項目指定型の最小送信）
  let body = rawBody;
  if (body.length === 0) {
    const labelPart = target_label ? `[${target_label}]` : "";
    const typePart = report_type ? `[${REPORT_TYPE_LABEL[report_type]}]` : "";
    const fallback = `${labelPart}${typePart}`.trim() || "(補足なし)";
    body = fallback;
  }

  // 項目指定なしの自由記述は最低1文字必要（従来互換）
  if (!target_kind && rawBody.length === 0) {
    return NextResponse.json(
      { error: "本文を入力してください" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("id, name, slug, is_published")
    .eq("id", shop_id)
    .single();

  if (!shop || !shop.is_published) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  const { data: inserted, error } = await supabase
    .from("shop_comments")
    .insert({
      shop_id,
      body,
      status: "pending",
      page: page ?? "info",
      target_kind: target_kind ?? "free",
      target_id,
      target_label,
      report_type,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 運営Gmailへ通知 (fire-and-forget: 失敗してもコメント登録自体は成功)
  void sendNewCommentNotification({
    shopName: shop.name,
    slug: shop.slug,
    page: page ?? "info",
    targetLabel: target_label,
    reportType: report_type,
    body,
    commentId: inserted?.id ?? "",
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
