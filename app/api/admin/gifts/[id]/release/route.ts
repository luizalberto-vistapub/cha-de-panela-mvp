import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  if (!isAdminRequest()) return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data: gift, error: fetchError } = await supabase
    .from("gifts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (fetchError || !gift) return NextResponse.json({ error: "Presente nao encontrado." }, { status: 404 });
  if (gift.status !== "RESERVADO") {
    return NextResponse.json({ error: "Apenas presentes reservados podem ser liberados." }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from("gifts")
    .update({
      status: "DISPONIVEL",
      reserved_by_confirmation_id: null,
      reserved_by_visitor_token: null,
      reserved_at: null,
      updated_at: new Date().toISOString()
    })
    .eq("id", params.id);

  if (updateError) return NextResponse.json({ error: "Nao foi possivel liberar presente." }, { status: 500 });

  await supabase.from("gift_reservation_history").insert({
    event_id: gift.event_id,
    gift_id: gift.id,
    confirmation_id: gift.reserved_by_confirmation_id,
    visitor_token: gift.reserved_by_visitor_token,
    action: "LIBERADO_ADMIN",
    performed_by: "ADMIN",
    reason: "Liberado pelo painel admin"
  });

  return NextResponse.json({ ok: true });
}
