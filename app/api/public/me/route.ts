import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  const visitorToken = url.searchParams.get("visitorToken");

  if (!slug || !visitorToken) {
    return NextResponse.json({ error: "Dados obrigatorios ausentes." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: event } = await supabase.from("events").select("id").eq("public_slug", slug).single();
  if (!event) return NextResponse.json({ error: "Evento nao encontrado." }, { status: 404 });

  const { data } = await supabase
    .from("guest_confirmations")
    .select("*")
    .eq("event_id", event.id)
    .eq("visitor_token", visitorToken)
    .maybeSingle();

  return NextResponse.json({ confirmation: data || null });
}
