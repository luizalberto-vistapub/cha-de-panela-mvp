"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Confirmation, EventInfo, Gift } from "@/lib/types";

type Props = {
  event: EventInfo;
};

const TOKEN_KEY = "cha_panela_visitor_token";

function createToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getToken() {
  const existing = localStorage.getItem(TOKEN_KEY);
  if (existing) return existing;

  const token = createToken();
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(date));
}

export function PublicInvite({ event }: Props) {
  const [visitorToken, setVisitorToken] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const groupedGifts = useMemo(() => {
    return gifts.reduce<Record<string, Gift[]>>((acc, gift) => {
      const category = gift.category || "Presentes";
      acc[category] = acc[category] || [];
      acc[category].push(gift);
      return acc;
    }, {});
  }, [gifts]);

  async function loadState(token: string) {
    const [meResponse, giftResponse] = await Promise.all([
      fetch(`/api/public/me?slug=${event.public_slug}&visitorToken=${token}`),
      fetch(`/api/public/gifts?slug=${event.public_slug}`)
    ]);

    if (meResponse.ok) {
      const data = await meResponse.json();
      setConfirmation(data.confirmation);
    }

    if (giftResponse.ok) {
      const data = await giftResponse.json();
      setGifts(data.gifts || []);
    }
  }

  useEffect(() => {
    const token = getToken();
    setVisitorToken(token);
    loadState(token).catch(() => setError("Nao conseguimos carregar seus dados agora."));
  }, []);

  async function confirmPresence(eventSubmit: React.FormEvent) {
    eventSubmit.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim() || !phone.trim()) {
      setError("Informe seu nome e telefone para confirmar.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/public/confirm-presence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: event.public_slug,
        visitorToken,
        name,
        phone
      })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Nao foi possivel confirmar sua presenca.");
      return;
    }

    setConfirmation(data.confirmation);
    setMessage("Presenca confirmada! Agora, se quiser, escolha um presente da lista.");
    await loadState(visitorToken);
  }

  async function reserveGift(giftId: string) {
    setError("");
    setMessage("");
    setLoading(true);
    const response = await fetch("/api/public/reserve-gift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: event.public_slug,
        visitorToken,
        giftId
      })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok || !data.success) {
      setError(data.error || data.message || "Esse presente acabou de ser escolhido. Escolha outro da lista.");
      await loadState(visitorToken);
      return;
    }

    setMessage("Presente reservado com sucesso. Obrigado pelo carinho!");
    await loadState(visitorToken);
  }

  const reservedByMe = gifts.find(
    (gift) => gift.status === "RESERVADO" && gift.reserved_by_visitor_token === visitorToken
  );

  return (
    <main className="page-shell">
      <section className="public-hero">
        <Image
          src={event.cover_image_url}
          alt={`Foto de ${event.couple_name}`}
          className="hero-image"
          width={1920}
          height={1080}
          priority
        />
        <span className="flower top" aria-hidden="true">
          <span />
        </span>
        <span className="flower bottom" aria-hidden="true">
          <span />
        </span>
        <div className="hero-content">
          <p className="eyebrow">{event.name}</p>
          <h1 className="couple-name">{event.couple_name}</h1>
          <p className="hero-copy">{event.welcome_text}</p>
          <ul className="event-details" aria-label="Detalhes do evento">
            <li>{formatDate(event.event_date)}</li>
            <li>{event.event_time}</li>
            <li>{event.event_place}</li>
          </ul>
          <a className="primary-button" href={confirmation ? "#presentes" : "#confirmar"}>
            {confirmation ? "Ver lista de presentes" : "Confirmar presenca"}
          </a>
        </div>
      </section>

      <section id="confirmar" className="section">
        <h2 className="section-heading">
          {confirmation ? `Ola, ${confirmation.name}!` : "Confirme sua presenca"}
        </h2>
        <p className="section-copy">
          {confirmation
            ? "Sua presenca ja esta confirmada. Agora voce pode reservar um presente, comprando onde preferir."
            : "E rapidinho: informe seu nome e telefone para ajudar na organizacao do cha."}
        </p>

        {!confirmation && (
          <form className="panel form-grid" onSubmit={confirmPresence}>
            <label className="field">
              <span>Nome</span>
              <input value={name} onChange={(eventChange) => setName(eventChange.target.value)} required />
            </label>
            <label className="field">
              <span>Telefone</span>
              <input
                value={phone}
                onChange={(eventChange) => setPhone(eventChange.target.value)}
                inputMode="tel"
                placeholder="(00) 00000-0000"
                required
              />
            </label>
            <button className="primary-button" disabled={loading} type="submit">
              Confirmar presenca
            </button>
          </form>
        )}

        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </section>

      {confirmation && (
        <section id="presentes" className="section">
          <h2 className="section-heading">Lista de presentes</h2>
          <p className="section-copy">
            Escolha um presente para reservar. Voce pode comprar onde preferir.
            {reservedByMe ? ` Seu presente reservado: ${reservedByMe.name}.` : ""}
          </p>

          <div className="gift-grid">
            {Object.entries(groupedGifts).map(([category, categoryGifts]) => (
              <div key={category} style={{ display: "contents" }}>
                <h3 className="category-title">{category}</h3>
                {categoryGifts.map((gift) => {
                  const isReserved = gift.status === "RESERVADO";
                  const isMine = gift.reserved_by_visitor_token === visitorToken;
                  return (
                    <article className={`gift-card ${isReserved ? "reserved" : ""}`} key={gift.id}>
                      <div>
                        <span className="pill">{isReserved ? (isMine ? "Reservado por voce" : "Ja escolhido") : "Disponivel"}</span>
                        <h3>{gift.name}</h3>
                        {gift.description && <p>{gift.description}</p>}
                      </div>
                      <button
                        className="secondary-button"
                        disabled={loading || isReserved || Boolean(reservedByMe)}
                        onClick={() => reserveGift(gift.id)}
                        type="button"
                      >
                        {isReserved ? "Esse presente ja foi escolhido" : "Vou comprar este"}
                      </button>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
