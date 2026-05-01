import { NextResponse } from "next/server";
import { createAdminSessionValue, setAdminCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { password } = await request.json();
  const expected = process.env.ADMIN_PASSWORD || "admin";

  if (!password || password !== expected) {
    return NextResponse.json({ error: "Senha invalida." }, { status: 401 });
  }

  setAdminCookie(createAdminSessionValue());
  return NextResponse.json({ ok: true });
}
