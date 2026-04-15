import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const shop_id = searchParams.get("shop_id");

  const supabase = createAdminClient();
  let query = supabase
    .from("shop_comments")
    .select("*, shops(id, name, slug)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (shop_id) query = query.eq("shop_id", shop_id);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
