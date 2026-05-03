import { ImageResponse } from "next/og";
import { getSupabaseAdmin } from "@/lib/supabase";

/* eslint-disable @next/next/no-img-element */

export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = getSupabaseAdmin();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("public_slug", params.slug)
    .eq("status", "ATIVO")
    .single();

  const coupleName = event?.couple_name || "Joao e Mary";
  const title = event?.name || "Cha de Panela";
  const description = event?.short_description || "Confirme sua presenca no cha de panela.";
  const cover = event?.cover_image_url?.startsWith("http")
    ? event.cover_image_url
    : `${siteUrl}${event?.cover_image_url || "/images/hero-couple-optimized.jpg"}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f8ecd9",
          color: "#3f332d",
          fontFamily: "Georgia"
        }}
      >
        <img
          src={cover}
          alt=""
          width="650"
          height="630"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            width: 650,
            height: 630
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px",
            background: "linear-gradient(90deg, rgba(248,236,217,0.92), #f8ecd9)"
          }}
        >
          <div style={{ color: "#8e604b", fontSize: 42, fontWeight: 700, textTransform: "uppercase" }}>
            {title}
          </div>
          <div style={{ color: "#8e604b", fontSize: 92, marginTop: 22 }}>{coupleName}</div>
          <div style={{ color: "#6f879e", fontSize: 30, lineHeight: 1.35, marginTop: 28 }}>{description}</div>
        </div>
      </div>
    ),
    size
  );
}
