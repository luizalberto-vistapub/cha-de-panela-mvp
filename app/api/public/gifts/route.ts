import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Slug ausente." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data: event } = await supabase.from("events").select("id").eq("public_slug", slug).single();
  if (!event) return NextResponse.json({ error: "Evento nao encontrado." }, { status: 404 });

  const { data, error } = await supabase
    .from("gifts")
    .select("*")
    .eq("event_id", event.id)
    .neq("status", "INATIVO")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: "Nao foi possivel carregar presentes." }, { status: 500 });
  return NextResponse.json({ gifts: data || [] });
}
