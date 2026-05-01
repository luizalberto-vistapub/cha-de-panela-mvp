"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Confirmation, EventInfo, Gift, StoryItem } from "@/lib/types";

type Props = {
  event: EventInfo;
};

const TOKEN_KEY = "cha_panela_visitor_token";
const FLORAL_IMAGE = "/images/floral-blue.png";

const Icon = {
  Calendar: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  ),
  Pin: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 1 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 21s-7.5-4.7-9.5-9.4C1 7.6 4 4 7.6 4c2 0 3.4 1 4.4 2.5C13 5 14.4 4 16.4 4 20 4 23 7.6 21.5 11.6 19.5 16.3 12 21 12 21Z" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12.5 10 18 20 7" />
    </svg>
  ),
  Gift: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      <rect x="3" y="9" width="18" height="11" rx="1.5" />
      <path d="M3 13h18M12 9v11M8 9c-1.5 0-3-1-3-2.5S6.5 4 8 4c2 0 4 5 4 5s2-5 4-5c1.5 0 3 1 3 2.5S17.5 9 16 9" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
};

function createToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
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
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(date));
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function useCountdown(target: Date) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) {
    return { days: null, hours: null, minutes: null, seconds: null };
  }

  const ms = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000)
  };
}

function categoryKey(category?: string | null) {
  return (category || "Presentes")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Countdown({ event }: { event: EventInfo }) {
  const [isMounted, setIsMounted] = useState(false);
  const target = useMemo(() => new Date(`${event.event_date}T16:00:00-03:00`), [event.event_date]);
  const { days, hours, minutes, seconds } = useCountdown(target);
  const cell = (value: number | null, label: string) => (
    <div className="cd-cell">
      <span className="cd-num">{value === null ? "00" : String(value).padStart(2, "0")}</span>
      <span className="cd-label">{label}</span>
    </div>
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="countdown" role="timer" aria-label="Contagem regressiva para o cha">
      {cell(days, "dias")}
      <span className="cd-sep">&middot;</span>
      {cell(hours, "horas")}
      <span className="cd-sep">&middot;</span>
      {cell(minutes, "min")}
      <span className="cd-sep">&middot;</span>
      {cell(seconds, "seg")}
    </div>
  );
}

const DEFAULT_STORY_ITEMS: StoryItem[] = [
    { year: "2019", title: "O primeiro café", text: "Um encontro simples que virou assunto para a vida toda." },
    { year: "2022", title: "A primeira casa", text: "Planos, plantas, listas e um cantinho ganhando forma." },
    { year: "2025", title: "O sim", text: "A certeza de construir cada detalhe lado a lado." },
    { year: "2026", title: "O chá", text: "Vocês com a gente nesse começo tão especial." }
];

function isStoryItem(item: unknown): item is StoryItem {
  if (!item || typeof item !== "object") return false;
  const maybeItem = item as Partial<StoryItem>;
  return (
    typeof maybeItem.year === "string" &&
    typeof maybeItem.title === "string" &&
    typeof maybeItem.text === "string"
  );
}

function getStoryItems(event: EventInfo) {
  const items = Array.isArray(event.story_items) ? event.story_items.filter(isStoryItem) : [];
  return items.length ? items : DEFAULT_STORY_ITEMS;
}

function StoryStrip({ event }: { event: EventInfo }) {
  const beats = getStoryItems(event);

  return (
    <section className="story story-with-photo" aria-labelledby="story-title">
      <div className="section-head">
        <p className="kicker">{event.story_kicker || "A nossa história"}</p>
        <h2 id="story-title">{event.story_title || "De um café para uma vida juntos"}</h2>
      </div>
      <div className="story-photo">
        <div className="story-photo-frame">
          <Image
            src="/images/beijo.jpg"
            alt={`${event.couple_name} sorrindo juntos`}
            width={920}
            height={690}
          />
        </div>
        <p className="story-photo-cap">
          <span className="quote-mark">“</span>
          O resto da vida começa amanhã, e a gente nem precisa de pressa.
          <span className="quote-mark">”</span>
        </p>
      </div>
      <ol className="timeline">
        {beats.map((beat) => (
          <li key={beat.year}>
            <span className="tl-year">{beat.year}</span>
            <h3>{beat.title}</h3>
            <p>{beat.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function FloralImage({ className }: { className: string }) {
  return (
    <Image
      src={FLORAL_IMAGE}
      alt=""
      aria-hidden="true"
      className={`floral ${className}`}
      width={1200}
      height={610}
    />
  );
}

function PhotoBanner() {
  return (
    <section className="banner" aria-hidden="true">
      <Image
        src="/images/danca.jpg"
        alt=""
        className="banner-photo"
        width={920}
        height={690}
      />
      <div className="banner-overlay">
        <p className="banner-script">vai ter dança</p>
        <p className="banner-sub">&mdash; e a gente quer você lá &mdash;</p>
      </div>
    </section>
  );
}

export function PublicInvite({ event }: Props) {
  const [visitorToken, setVisitorToken] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companions, setCompanions] = useState(0);
  const [notes, setNotes] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const rsvpRef = useRef<HTMLElement>(null);
  const giftsRef = useRef<HTMLElement>(null);

  const loadState = useCallback(async (token: string) => {
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
  }, [event.public_slug]);

  useEffect(() => {
    const token = getToken();
    setVisitorToken(token);
    loadState(token).catch(() => setError("Não conseguimos carregar seus dados agora."));
  }, [loadState]);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    gifts.forEach((gift) => map.set(categoryKey(gift.category), gift.category || "Presentes"));
    return [...map.entries()].map(([id, label]) => ({ id, label }));
  }, [gifts]);

  const counts = useMemo(() => {
    const total = gifts.filter((gift) => gift.status !== "INATIVO").length;
    const taken = gifts.filter((gift) => gift.status === "RESERVADO").length;
    return { total, free: total - taken };
  }, [gifts]);

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) => {
      if (gift.status === "INATIVO") return false;
      if (query && !gift.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (filter === "free") return gift.status === "DISPONIVEL";
      if (filter === "all") return true;
      return categoryKey(gift.category) === filter;
    });
  }, [filter, gifts, query]);

  const groupedGifts = useMemo(() => {
    const map = new Map<string, { label: string; items: Gift[] }>();
    filteredGifts.forEach((gift) => {
      const key = categoryKey(gift.category);
      if (!map.has(key)) map.set(key, { label: gift.category || "Presentes", items: [] });
      map.get(key)?.items.push(gift);
    });
    return [...map.entries()];
  }, [filteredGifts]);

  const reservedByMe = gifts.find(
    (gift) => gift.status === "RESERVADO" && gift.reserved_by_visitor_token === visitorToken
  );

  function jumpTo(ref: React.RefObject<HTMLElement>) {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function confirmPresence(eventSubmit: React.FormEvent) {
    eventSubmit.preventDefault();
    setError("");
    setMessage("");

    if (name.trim().length < 2) {
      setError("Conte seu nome para a gente.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      setError("Informe um WhatsApp com DDD.");
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
        phone,
        companions,
        notes
      })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Não foi possível confirmar sua presença.");
      return;
    }

    setConfirmation(data.confirmation);
    setMessage("Presença confirmada! Agora, se quiser, escolha um presente da lista.");
    await loadState(visitorToken);
    setTimeout(() => jumpTo(giftsRef), 250);
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

  return (
    <main className="app heading-script">
      <section className="hero">
        <Image
          src="/images/danca.jpg"
          alt={`Foto de ${event.couple_name}`}
          className="hero-photo"
          width={920}
          height={690}
          priority
        />
        <FloralImage className="floral-top-left" />
        <FloralImage className="floral-top-right" />
        <FloralImage className="floral-bottom-left" />
        <FloralImage className="floral-bottom-right" />
        <div className="hero-inner">
          <p className="eyebrow">&mdash; {event.name} &mdash;</p>
          <h1 className="couple">
            <span>João</span>
            <span className="amp">&amp;</span>
            <span>Mary</span>
          </h1>
          <div className="hero-divider">
            <span className="dot" />
            <span className="line" />
            <span className="dot" />
          </div>
          <div className="hero-portrait" aria-hidden="true">
            <div className="portrait-frame">
              <Image
                src="/images/praia.jpg"
                alt=""
                width={720}
                height={1080}
              />
            </div>
            <span className="portrait-tag">Rio &middot; 2025</span>
          </div>
          <p className="hero-blurb">{event.welcome_text}</p>
          <ul className="event-meta">
            <li>
              <Icon.Calendar /> <span><b>{formatDate(event.event_date)}</b></span>
            </li>
            <li>
              <Icon.Clock /> <span><b>{event.event_time}</b> &middot; recepção com carinho</span>
            </li>
            <li>
              <Icon.Pin /> <span>{event.event_place}</span>
            </li>
          </ul>
          <Countdown event={event} />
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => jumpTo(rsvpRef)} type="button">
              <Icon.Heart /> Confirmar presença
            </button>
            <button className="btn btn-ghost" onClick={() => jumpTo(giftsRef)} type="button">
              <Icon.Gift /> Ver lista de presentes
            </button>
          </div>
        </div>
      </section>

      <StoryStrip event={event} />

      <section id="confirmar" className="rsvp" ref={rsvpRef}>
        <div className="section-head">
          <p className="kicker">{confirmation ? "Presença confirmada" : "Confirme sua presença"}</p>
          <h2>{confirmation ? `Que alegria, ${confirmation.name.split(" ")[0]}!` : "É rapidinho"}</h2>
          <p className="lede">
            {confirmation
              ? "Anotamos seu nome na lista. Agora você pode reservar um presente logo abaixo."
              : "Só pra ajudar a gente a organizar comidinha, lugar e quanto bolo encomendar."}
          </p>
        </div>

        {confirmation ? (
          <div className="rsvp-success">
            <div className="success-badge"><Icon.Check /></div>
            <p>
              Confirmamos pelo telefone <b>{confirmation.phone}</b>
              {confirmation.companions ? ` com mais ${confirmation.companions} acompanhante${confirmation.companions > 1 ? "s" : ""}` : ""}.
            </p>
            <p className="rsvp-next">Agora, se quiser, escolha um presente da lista logo abaixo. &darr;</p>
          </div>
        ) : (
          <form className="rsvp-form" onSubmit={confirmPresence} noValidate>
            <label className="field">
              <span>Seu nome</span>
              <input
                autoComplete="name"
                placeholder="Como te chamamos no convite"
                value={name}
                onChange={(eventChange) => setName(eventChange.target.value)}
              />
            </label>
            <label className="field">
              <span>WhatsApp</span>
              <input
                autoComplete="tel"
                inputMode="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(eventChange) => setPhone(formatPhone(eventChange.target.value))}
              />
            </label>
            <div className="field">
              <span>Vai levar acompanhantes?</span>
              <div className="stepper" role="group" aria-label="Acompanhantes">
                <button type="button" onClick={() => setCompanions((value) => Math.max(0, value - 1))}>&minus;</button>
                <span className="stepper-val">{companions === 0 ? "Só eu" : `+${companions}`}</span>
                <button type="button" onClick={() => setCompanions((value) => Math.min(5, value + 1))}>+</button>
              </div>
            </div>
            <label className="field field-wide">
              <span>Recadinho (opcional)</span>
              <textarea
                rows={2}
                placeholder="Restrição alimentar, vai chegar atrasado, sugestão de música..."
                value={notes}
                onChange={(eventChange) => setNotes(eventChange.target.value)}
              />
            </label>
            <div className="form-actions">
              <button className="btn btn-primary" disabled={loading} type="submit">
                {loading ? "Enviando..." : <><Icon.Heart /> Confirmar minha presença</>}
              </button>
              <p className="form-fineprint">Confirme até <b>15 de junho</b>, por favor.</p>
            </div>
          </form>
        )}
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </section>

      <section id="presentes" className="gifts" ref={giftsRef}>
        <div className="section-head">
          <p className="kicker">Lista de presentes</p>
          <h2>Escolha um presentinho</h2>
          <p className="lede">
            Reserve um item para a gente não ganhar presentes repetidos. Você pode comprar onde preferir.
            <br />Preferência de cor/material: <b>preto, inox, branco, bambu, dourado ou cristal</b>.
            {reservedByMe ? <><br />Seu presente reservado: <b>{reservedByMe.name}</b>.</> : null}
          </p>
        </div>

        <div className="gift-toolbar">
          <div className="search">
            <Icon.Search />
            <input value={query} onChange={(eventChange) => setQuery(eventChange.target.value)} placeholder="Buscar por nome..." />
            {query && <button className="search-clear" onClick={() => setQuery("")} type="button">&times;</button>}
          </div>
          <div className="chips" role="tablist" aria-label="Categorias de presentes">
            <button className={`chip ${filter === "all" ? "is-on" : ""}`} onClick={() => setFilter("all")} type="button">
              Todos <em>{counts.total}</em>
            </button>
            <button className={`chip ${filter === "free" ? "is-on" : ""}`} onClick={() => setFilter("free")} type="button">
              Disponíveis <em>{counts.free}</em>
            </button>
            {categories.map((category) => (
              <button
                className={`chip ${filter === category.id ? "is-on" : ""}`}
                key={category.id}
                onClick={() => setFilter(category.id)}
                type="button"
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {!confirmation && (
          <div className="gate">
            <span className="gate-dot" />
            Confirme sua presença ali em cima para liberar a reserva. Você ainda pode dar uma olhadinha.
          </div>
        )}

        <div className="gift-stream">
          {groupedGifts.map(([key, group]) => (
            <div className="gift-group" key={key}>
              <header className="gift-group-head">
                <span className="ggh-num">{String(group.items.length).padStart(2, "0")}</span>
                <h3>{group.label}</h3>
                <span className="ggh-rule" />
              </header>
              <div className="gift-grid">
                {group.items.map((gift) => {
                  const isReserved = gift.status === "RESERVADO";
                  const isMine = gift.reserved_by_visitor_token === visitorToken;
                  return (
                    <article className={`gift ${isReserved ? "is-reserved" : ""} ${isMine ? "is-mine" : ""}`} key={gift.id}>
                      <div className="gift-top">
                        <span className="gift-cat">{gift.category || "Presente"}</span>
                        <span className={`badge ${isMine ? "badge-mine" : isReserved ? "badge-taken" : "badge-free"}`}>
                          {isMine ? "Você reservou" : isReserved ? "Reservado" : "Disponível"}
                        </span>
                      </div>
                      <h3>{gift.name}</h3>
                      {gift.description && <p className="gift-note">{gift.description}</p>}
                      <div className="gift-foot">
                        {isReserved ? (
                          <p className="gift-note">{isMine ? "Obrigada por escolher!" : "Já foi escolhido por alguém."}</p>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            disabled={loading || !confirmation || Boolean(reservedByMe)}
                            onClick={() => reserveGift(gift.id)}
                            type="button"
                          >
                            Vou levar este
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredGifts.length === 0 && <p className="empty">Nada por aqui. Tente outro filtro.</p>}
        </div>
      </section>

      <PhotoBanner />

      <footer className="foot">
        <FloralImage className="foot-floral-left" />
        <FloralImage className="foot-floral-right" />
        <p className="foot-script">Com carinho,</p>
        <p className="foot-couple">{event.couple_name}</p>
        <p className="foot-meta">20 &middot; 06 &middot; 2026 &middot; São Paulo</p>
      </footer>
    </main>
  );
}
