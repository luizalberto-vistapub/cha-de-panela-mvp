import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminRequest()) return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });

  const body = await request.json();
  const updates: Record<string, string | null> = {};

  if (body.name !== undefined) updates.name = body.name;
  if (body.description !== undefined) updates.description = body.description || null;
  if (body.category !== undefined) updates.category = body.category || null;
  if (body.reference_link !== undefined) updates.reference_link = body.reference_link || null;
  if (body.status !== undefined) updates.status = body.status;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("gifts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: "Nao foi possivel atualizar presente." }, { status: 500 });
  return NextResponse.json({ gift: data });
}
