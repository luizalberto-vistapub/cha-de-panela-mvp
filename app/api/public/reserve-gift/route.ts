import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const { slug, visitorToken, giftId } = await request.json();

  if (!slug || !visitorToken || !giftId) {
    return NextResponse.json({ error: "Dados obrigatorios ausentes." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("reserve_gift", {
    p_slug: slug,
    p_gift_id: giftId,
    p_visitor_token: visitorToken
  });

  if (error) return NextResponse.json({ error: "Nao foi possivel reservar o presente." }, { status: 500 });

  const result = Array.isArray(data) ? data[0] : data;
  const status = result?.success ? 200 : 409;
  return NextResponse.json(result || { success: false, message: "Reserva nao concluida." }, { status });
}
