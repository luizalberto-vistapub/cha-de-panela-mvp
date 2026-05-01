import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!isAdminRequest()) return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("gifts")
    .select("*, guest_confirmations(name, phone)")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: "Nao foi possivel carregar presentes." }, { status: 500 });
  return NextResponse.json({ gifts: data || [] });
}

export async function POST(request: Request) {
  if (!isAdminRequest()) return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });

  const body = await request.json();
  if (!body.name?.trim()) return NextResponse.json({ error: "Nome do presente e obrigatorio." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data: event } = await supabase.from("events").select("id").eq("public_slug", "joao-e-mary").single();
  if (!event) return NextResponse.json({ error: "Evento nao encontrado." }, { status: 404 });

  const { data: maxOrder } = await supabase
    .from("gifts")
    .select("display_order")
    .eq("event_id", event.id)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("gifts")
    .insert({
      event_id: event.id,
      name: body.name.trim(),
      description: body.description?.trim() || null,
      category: body.category?.trim() || "Presentes",
      reference_link: body.reference_link?.trim() || null,
      display_order: (maxOrder?.display_order || 0) + 10,
      status: "DISPONIVEL"
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: "Nao foi possivel criar presente." }, { status: 500 });
  return NextResponse.json({ gift: data });
}
