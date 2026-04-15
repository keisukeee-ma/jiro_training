import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

const VALID_STATUSES = ["pending", "reviewed", "applied", "rejected"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const payload = await request.json();

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof payload.status === "string") {
    if (!(VALID_STATUSES as readonly string[]).includes(payload.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = payload.status;
  }
  if (typeof payload.admin_note === "string" || payload.admin_note === null) {
    update.admin_note = payload.admin_note;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("shop_comments")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from("shop_comments").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
