import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const { slug, visitorToken, name, phone, companions, notes } = body;

  if (!slug || !visitorToken || !name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "Nome e telefone sao obrigatorios." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: event } = await supabase.from("events").select("id").eq("public_slug", slug).single();
  if (!event) return NextResponse.json({ error: "Evento nao encontrado." }, { status: 404 });

  const { data, error } = await supabase
    .from("guest_confirmations")
    .upsert(
      {
        event_id: event.id,
        visitor_token: visitorToken,
        name: name.trim(),
        phone: phone.trim(),
        companions: Math.max(0, Math.min(5, Number(companions) || 0)),
        notes: notes?.trim() || null,
        presence_confirmed: true,
        confirmed_at: new Date().toISOString(),
        user_agent: request.headers.get("user-agent")
      },
      { onConflict: "event_id,visitor_token" }
    )
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: "Nao foi possivel confirmar sua presenca." }, { status: 500 });
  return NextResponse.json({ confirmation: data });
}
