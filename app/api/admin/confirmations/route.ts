import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!isAdminRequest()) return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("guest_confirmations")
    .select("*")
    .order("confirmed_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Nao foi possivel carregar confirmacoes." }, { status: 500 });
  return NextResponse.json({ confirmations: data || [] });
}
