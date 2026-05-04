"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Confirmation, EventInfo, StoryItem } from "@/lib/types";

type Props = {
  event: EventInfo;
};

const TOKEN_KEY = "cha_panela_visitor_token";
const FLORAL_IMAGE = "/images/floral-blue.png";
const PIX_COPY_PASTE = "00020126580014BR.GOV.BCB.PIX013617f83fe0-d15f-4d9a-958b-cd66c327c6005204000053039865802BR5925Joao Victor Barbosa da Co6009SAO PAULO621405104nBybVsQt463048A00";
const PIX_QR_CODE_IMAGE = "/images/pix-qrcode.svg";
const PETALS = [
  { left: "4%", delay: "-7s", duration: "13s", size: "20px", drift: "38px" },
  { left: "12%", delay: "-1s", duration: "15s", size: "15px", drift: "-24px" },
  { left: "20%", delay: "-10s", duration: "14s", size: "18px", drift: "34px" },
  { left: "29%", delay: "-4s", duration: "16s", size: "14px", drift: "-30px" },
  { left: "38%", delay: "-12s", duration: "13s", size: "19px", drift: "28px" },
  { left: "47%", delay: "-3s", duration: "17s", size: "16px", drift: "-36px" },
  { left: "56%", delay: "-8s", duration: "14s", size: "21px", drift: "30px" },
  { left: "66%", delay: "-2s", duration: "16s", size: "15px", drift: "-28px" },
  { left: "76%", delay: "-11s", duration: "15s", size: "18px", drift: "36px" },
  { left: "86%", delay: "-5s", duration: "13s", size: "14px", drift: "-22px" },
  { left: "94%", delay: "-9s", duration: "17s", size: "20px", drift: "26px" },
  { left: "98%", delay: "-6s", duration: "14s", size: "13px", drift: "-20px" }
];
const CONFETTI = [
  { left: "45%", top: "44%", x: "-92px", y: "-86px", rotate: "-24deg", color: "#b07a5a", delay: "0s" },
  { left: "48%", top: "42%", x: "-42px", y: "-118px", rotate: "18deg", color: "#d6a989", delay: "0.03s" },
  { left: "50%", top: "44%", x: "12px", y: "-126px", rotate: "58deg", color: "#6f879e", delay: "0.01s" },
  { left: "53%", top: "42%", x: "64px", y: "-106px", rotate: "-48deg", color: "#8a5a3e", delay: "0.05s" },
  { left: "55%", top: "46%", x: "104px", y: "-68px", rotate: "32deg", color: "#d4ba94", delay: "0.02s" },
  { left: "47%", top: "48%", x: "-78px", y: "-34px", rotate: "76deg", color: "#3f5872", delay: "0.06s" },
  { left: "51%", top: "48%", x: "36px", y: "-48px", rotate: "-82deg", color: "#b07a5a", delay: "0.04s" },
  { left: "54%", top: "48%", x: "84px", y: "-20px", rotate: "42deg", color: "#d6a989", delay: "0.08s" },
  { left: "49%", top: "45%", x: "-10px", y: "-88px", rotate: "-12deg", color: "#6f879e", delay: "0.07s" },
  { left: "52%", top: "45%", x: "28px", y: "-96px", rotate: "64deg", color: "#8a5a3e", delay: "0.09s" }
];

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

function getMapUrl(place: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
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
    <section className="story story-with-photo section-reveal" aria-labelledby="story-title">
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

function HeroPetals() {
  return (
    <div className="hero-petals" aria-hidden="true">
      {PETALS.map((petal, index) => (
        <span
          className="hero-petal"
          key={`${petal.left}-${index}`}
          style={{
            "--petal-left": petal.left,
            "--petal-delay": petal.delay,
            "--petal-duration": petal.duration,
            "--petal-size": petal.size,
            "--petal-drift": petal.drift
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

function ConfirmConfetti({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="confirm-confetti" aria-hidden="true">
      {CONFETTI.map((piece, index) => (
        <span
          className="confetti-piece"
          key={`${piece.x}-${index}`}
          style={{
            "--confetti-left": piece.left,
            "--confetti-top": piece.top,
            "--confetti-x": piece.x,
            "--confetti-y": piece.y,
            "--confetti-rotate": piece.rotate,
            "--confetti-color": piece.color,
            "--confetti-delay": piece.delay
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

function InviteIntro({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="invite-intro" aria-label="Mensagem de boas-vindas">
      <div className="intro-mist" aria-hidden="true" />
      <p className="intro-prompt">
        <span>Será uma alegria celebrar...</span>
        <span>esse dia tão especial ao seu lado!&nbsp;&nbsp;</span>
      </p>
    </div>
  );
}

function PhotoBanner() {
  return (
    <section className="banner section-reveal" aria-hidden="true">
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
  const [showIntro, setShowIntro] = useState(false);
  const [hasLoadedState, setHasLoadedState] = useState(false);
  const [visitorToken, setVisitorToken] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const rsvpRef = useRef<HTMLElement>(null);
  const pixRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!showIntro) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setShowIntro(false), reduceMotion ? 1800 : 11800);
    return () => clearTimeout(timer);
  }, [showIntro]);

  const loadState = useCallback(async (token: string) => {
    const meResponse = await fetch(`/api/public/me?slug=${event.public_slug}&visitorToken=${token}`);

    if (meResponse.ok) {
      const data = await meResponse.json();
      const loadedConfirmation = data.confirmation ?? null;
      setConfirmation(loadedConfirmation);
      return loadedConfirmation as Confirmation | null;
    }

    return null;
  }, [event.public_slug]);

  useEffect(() => {
    const token = getToken();
    setVisitorToken(token);
    loadState(token)
      .then((loadedConfirmation) => {
        setShowIntro(!loadedConfirmation);
        setHasLoadedState(true);
      })
      .catch(() => {
        setError("Não conseguimos carregar seus dados agora.");
        setShowIntro(true);
        setHasLoadedState(true);
      });
  }, [loadState]);

  useEffect(() => {
    if (!hasLoadedState) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>(".section-reveal"));
    if (!sections.length) return;

    sections.forEach((section) => section.classList.add("reveal-ready"));

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [hasLoadedState]);

  function jumpTo(ref: React.RefObject<HTMLElement>) {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function fillDefaultPhoneDdd() {
    if (phone) return;
    setPhone(formatPhone("21"));
  }

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(PIX_COPY_PASTE);
      setCopyStatus("Pix copiado.");
    } catch {
      setCopyStatus("Nao foi possivel copiar automaticamente.");
    }
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
        companions: 0,
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
    setShowConfetti(true);
    setMessage("Presença confirmada! O Pix ficou logo abaixo para quem quiser enviar um carinho.");
    await loadState(visitorToken);
    setTimeout(() => {
      setShowConfetti(false);
      jumpTo(pixRef);
    }, 1400);
  }

  if (!hasLoadedState) return null;

  return (
    <main className="app heading-script">
      <InviteIntro visible={showIntro} />
      <section className="hero">
        <HeroPetals />
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
            <span className="portrait-tag">Rio &middot; 2026</span>
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
              <Icon.Pin /> <a href={getMapUrl(event.event_place)} target="_blank" rel="noreferrer">{event.event_place}</a>
            </li>
          </ul>
          <Countdown event={event} />
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => jumpTo(rsvpRef)} type="button">
              <Icon.Heart /> Confirmar presença
            </button>
            <button className="btn btn-ghost" onClick={() => jumpTo(pixRef)} type="button">
              <Icon.Gift /> Lista de Presente
            </button>
          </div>
        </div>
      </section>

      <StoryStrip event={event} />

      <section id="confirmar" className="rsvp section-reveal" ref={rsvpRef}>
        <ConfirmConfetti active={showConfetti} />
        <div className="section-head">
          <p className="kicker">{confirmation ? "Presença confirmada" : "Confirme sua presença"}</p>
          <h2>{confirmation ? `Que alegria, ${confirmation.name.split(" ")[0]}!` : "É rapidinho"}</h2>
          <p className="lede">
            {confirmation
              ? "Anotamos seu nome na lista. O Pix ficou logo abaixo para quem quiser enviar um carinho."
              : "Só pra ajudar a gente a organizar comidinha, lugar e quanto bolo encomendar."}
          </p>
        </div>

        {confirmation ? (
          <div className="rsvp-success">
            <div className="success-badge"><Icon.Check /></div>
            <p>
              Confirmamos pelo telefone <b className="phone-number">{confirmation.phone}</b>.
            </p>
            <button className="rsvp-next" onClick={() => jumpTo(pixRef)} type="button">
              O Pix ficou logo abaixo para quem quiser enviar um carinho. &darr;
            </button>
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
                placeholder="(21) 99999-9999"
                value={phone}
                onFocus={fillDefaultPhoneDdd}
                onChange={(eventChange) => setPhone(formatPhone(eventChange.target.value))}
              />
            </label>
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
              <p className="form-fineprint">Confirme até <b>01 de julho</b>, por favor.</p>
            </div>
          </form>
        )}
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </section>

      <section id="pix" className="pix-section section-reveal" ref={pixRef}>
        {confirmation ? (
          <>
            <div className="section-head">
              <p className="kicker">Presente por Pix</p>
              <h2>Seu carinho ajuda a realizar nossos sonhos</h2>
              <div className="lede pix-lede">
                <p>Estamos muito felizes em compartilhar esse momento tão especial com você!</p>
                <p>Sua presença é o nosso maior presente 💕</p>
                <p>Mas, se desejar nos presentear, ficaremos muito gratos com uma contribuição via Pix para realizarmos nossos sonhos juntos!</p>
              </div>
            </div>

            <div className="pix-card">
              <div className="pix-qr">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PIX_QR_CODE_IMAGE}
                  alt="QR Code para pagamento via Pix"
                />
              </div>
              <div className="pix-details">
                <p className="pix-owner">João Victor Barbosa da Co</p>
                <p className="pix-copy">
                  Escaneie o QR Code ou copie o Pix copia e cola.
                </p>
                <div className="pix-code" aria-label="Pix copia e cola">
                  {PIX_COPY_PASTE}
                </div>
                <button className="btn btn-primary" onClick={copyPix} type="button">
                  Copiar o Pix
                </button>
                {copyStatus && <p className="message success">{copyStatus}</p>}
              </div>
            </div>
          </>
        ) : (
          <div className="gate">
            <span className="gate-dot" />
            Confirme sua presença ali em cima para liberar a lista de presente.
          </div>
        )}
      </section>

      <PhotoBanner />

      <footer className="foot section-reveal">
        <FloralImage className="foot-floral-left" />
        <FloralImage className="foot-floral-right" />
        <p className="foot-script">Com carinho,</p>
        <p className="foot-couple">{event.couple_name}</p>
        <p className="foot-meta">08 &middot; 07 &middot; 2026 &middot; Rio de Janeiro</p>
      </footer>
    </main>
  );
}
