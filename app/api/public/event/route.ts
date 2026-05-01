import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug") || "joao-e-mary";
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("public_slug", slug)
    .eq("status", "ATIVO")
    .single();

  if (error) return NextResponse.json({ error: "Evento nao encontrado." }, { status: 404 });
  return NextResponse.json({ event: data });
}
