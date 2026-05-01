import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicInvite } from "@/components/PublicInvite";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { EventInfo } from "@/lib/types";

async function getEvent(slug: string): Promise<EventInfo | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("public_slug", slug)
    .eq("status", "ATIVO")
    .single();

  if (error) return null;
  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEvent(params.slug).catch(() => null);
  if (!event) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const imageUrl = `${siteUrl}/convite/${event.public_slug}/opengraph-image`;

  return {
    title: `${event.name} | ${event.couple_name}`,
    description: event.short_description,
    openGraph: {
      title: `${event.name} - ${event.couple_name}`,
      description: event.short_description,
      type: "website",
      url: `${siteUrl}/convite/${event.public_slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${event.name} de ${event.couple_name}`
        }
      ]
    }
  };
}

export default async function InvitePage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug).catch(() => null);
  if (!event) notFound();

  return <PublicInvite event={event} />;
}
