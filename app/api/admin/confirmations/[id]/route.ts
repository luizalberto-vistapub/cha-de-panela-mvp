import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!isAdminRequest()) return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });

  const supabase = getSupabaseAdmin();

  const { data: confirmation, error: fetchError } = await supabase
    .from("guest_confirmations")
    .select("*")
    .eq("id", params.id)
    .single();

  if (fetchError || !confirmation) {
    return NextResponse.json({ error: "Confirmacao nao encontrada." }, { status: 404 });
  }

  const { error: giftsError } = await supabase
    .from("gifts")
    .update({
      status: "DISPONIVEL",
      reserved_by_confirmation_id: null,
      reserved_by_visitor_token: null,
      reserved_at: null,
      updated_at: new Date().toISOString()
    })
    .eq("reserved_by_confirmation_id", params.id);

  if (giftsError) {
    return NextResponse.json({ error: "Nao foi possivel liberar presentes associados." }, { status: 500 });
  }

  const { error: deleteError } = await supabase
    .from("guest_confirmations")
    .delete()
    .eq("id", params.id);

  if (deleteError) {
    return NextResponse.json({ error: "Nao foi possivel remover confirmacao." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
