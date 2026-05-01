"use client";

import { useEffect, useState } from "react";
import type { Confirmation, Gift } from "@/lib/types";

type GiftForm = {
  name: string;
  description: string;
  category: string;
  reference_link: string;
};

const emptyGift: GiftForm = {
  name: "",
  description: "",
  category: "Cozinha",
  reference_link: ""
};

export function AdminPanel({ initialIsAuthed }: { initialIsAuthed: boolean }) {
  const [isAuthed, setIsAuthed] = useState(initialIsAuthed);
  const [password, setPassword] = useState("");
  const [confirmations, setConfirmations] = useState<Confirmation[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [giftForm, setGiftForm] = useState<GiftForm>(emptyGift);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadAdminData() {
    const [confirmationsResponse, giftsResponse] = await Promise.all([
      fetch("/api/admin/confirmations"),
      fetch("/api/admin/gifts")
    ]);

    if (confirmationsResponse.status === 401 || giftsResponse.status === 401) {
      setIsAuthed(false);
      return;
    }

    if (confirmationsResponse.ok) {
      const data = await confirmationsResponse.json();
      setConfirmations(data.confirmations || []);
    }

    if (giftsResponse.ok) {
      const data = await giftsResponse.json();
      setGifts(data.gifts || []);
    }
  }

  useEffect(() => {
    if (isAuthed) {
      loadAdminData().catch(() => setError("Nao foi possivel carregar o admin."));
    }
  }, [isAuthed]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    setLoading(false);

    if (!response.ok) {
      setError("Senha administrativa invalida.");
      return;
    }

    setIsAuthed(true);
    setPassword("");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthed(false);
  }

  async function addGift(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const response = await fetch("/api/admin/gifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(giftForm)
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Nao foi possivel adicionar o presente.");
      return;
    }

    setGiftForm(emptyGift);
    setMessage("Presente adicionado com sucesso.");
    await loadAdminData();
  }

  async function updateGift(gift: Gift, status: Gift["status"]) {
    setError("");
    setMessage("");
    const response = await fetch(`/api/admin/gifts/${gift.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Nao foi possivel atualizar o presente.");
      return;
    }

    setMessage("Presente atualizado.");
    await loadAdminData();
  }

  async function releaseGift(gift: Gift) {
    setError("");
    setMessage("");
    const response = await fetch(`/api/admin/gifts/${gift.id}/release`, { method: "POST" });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Nao foi possivel liberar o presente.");
      return;
    }

    setMessage("Presente liberado.");
    await loadAdminData();
  }

  if (!isAuthed) {
    return (
      <main className="admin-shell">
        <section className="admin-container">
          <div className="panel" style={{ maxWidth: "30rem", margin: "10vh auto" }}>
            <p className="eyebrow">Area administrativa</p>
            <h1 className="section-heading">Entrar</h1>
            <form className="form-grid" onSubmit={login}>
              <label className="field">
                <span>Senha</span>
                <input
                  value={password}
                  onChange={(eventChange) => setPassword(eventChange.target.value)}
                  type="password"
                  required
                />
              </label>
              <button className="primary-button" disabled={loading} type="submit">
                Acessar admin
              </button>
            </form>
            {error && <p className="message error">{error}</p>}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <section className="admin-container">
        <header className="admin-header">
          <div>
            <p className="eyebrow">Cha de Panela</p>
            <h1 className="section-heading">Painel admin</h1>
          </div>
          <button className="secondary-button" onClick={logout} type="button">
            Sair
          </button>
        </header>

        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}

        <div className="admin-grid">
          <section className="panel">
            <h2>Adicionar presente</h2>
            <form className="form-grid" onSubmit={addGift}>
              <label className="field">
                <span>Nome</span>
                <input
                  value={giftForm.name}
                  onChange={(eventChange) => setGiftForm({ ...giftForm, name: eventChange.target.value })}
                  required
                />
              </label>
              <label className="field">
                <span>Categoria</span>
                <select
                  value={giftForm.category}
                  onChange={(eventChange) => setGiftForm({ ...giftForm, category: eventChange.target.value })}
                >
                  <option>Cozinha</option>
                  <option>Banheiro</option>
                  <option>Quarto</option>
                  <option>Area de servico</option>
                </select>
              </label>
              <label className="field">
                <span>Descricao curta</span>
                <input
                  value={giftForm.description}
                  onChange={(eventChange) => setGiftForm({ ...giftForm, description: eventChange.target.value })}
                />
              </label>
              <label className="field">
                <span>Link de referencia</span>
                <input
                  value={giftForm.reference_link}
                  onChange={(eventChange) => setGiftForm({ ...giftForm, reference_link: eventChange.target.value })}
                />
              </label>
              <button className="primary-button" disabled={loading} type="submit">
                Adicionar presente
              </button>
            </form>
          </section>

          <section className="panel">
            <h2>Confirmacoes</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Acompanhantes</th>
                    <th>Recado</th>
                    <th>Confirmado em</th>
                    <th>Token</th>
                    <th>Duplicidade</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmations.map((confirmation) => (
                    <tr key={confirmation.id}>
                      <td>{confirmation.name}</td>
                      <td>{confirmation.phone}</td>
                      <td>{confirmation.companions || 0}</td>
                      <td>{confirmation.notes || "-"}</td>
                      <td>{new Date(confirmation.confirmed_at).toLocaleString("pt-BR")}</td>
                      <td>{confirmation.visitor_token.slice(0, 12)}...</td>
                      <td>{confirmation.duplicate_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <h2>Presentes</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Presente</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th>Reservado por</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {gifts.map((gift) => (
                    <tr key={gift.id}>
                      <td>{gift.name}</td>
                      <td>{gift.category}</td>
                      <td>{gift.status}</td>
                      <td>{gift.guest_confirmations?.name || "-"}</td>
                      <td style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {gift.status === "RESERVADO" && (
                          <button className="secondary-button" onClick={() => releaseGift(gift)} type="button">
                            Liberar
                          </button>
                        )}
                        {gift.status !== "INATIVO" && (
                          <button className="secondary-button" onClick={() => updateGift(gift, "INATIVO")} type="button">
                            Inativar
                          </button>
                        )}
                        {gift.status === "INATIVO" && (
                          <button className="secondary-button" onClick={() => updateGift(gift, "DISPONIVEL")} type="button">
                            Reativar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
