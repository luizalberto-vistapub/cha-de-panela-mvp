"use client";

import { useEffect, useState } from "react";
import type { Confirmation } from "@/lib/types";

export function AdminPanel({ initialIsAuthed }: { initialIsAuthed: boolean }) {
  const [isAuthed, setIsAuthed] = useState(initialIsAuthed);
  const [password, setPassword] = useState("");
  const [confirmations, setConfirmations] = useState<Confirmation[]>([]);
  const [confirmationToRemove, setConfirmationToRemove] = useState<Confirmation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function loadAdminData() {
    const confirmationsResponse = await fetch("/api/admin/confirmations");

    if (confirmationsResponse.status === 401) {
      setIsAuthed(false);
      return;
    }

    if (confirmationsResponse.ok) {
      const data = await confirmationsResponse.json();
      setConfirmations(data.confirmations || []);
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

  async function removeConfirmation() {
    if (!confirmationToRemove) return;

    setError("");
    setRemoving(true);
    const response = await fetch(`/api/admin/confirmations/${confirmationToRemove.id}`, {
      method: "DELETE"
    });
    setRemoving(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || "Nao foi possivel remover a confirmacao.");
      return;
    }

    setConfirmations((current) => current.filter((confirmation) => confirmation.id !== confirmationToRemove.id));
    setConfirmationToRemove(null);
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

        {error && <p className="message error">{error}</p>}

        <div className="admin-grid">
          <section className="panel">
            <h2>Confirmacoes</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Recado</th>
                    <th>Confirmado em</th>
                    <th>Token</th>
                    <th>Duplicidade</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmations.map((confirmation) => (
                    <tr key={confirmation.id}>
                      <td>{confirmation.name}</td>
                      <td>{confirmation.phone}</td>
                      <td>{confirmation.notes || "-"}</td>
                      <td>{new Date(confirmation.confirmed_at).toLocaleString("pt-BR")}</td>
                      <td>{confirmation.visitor_token.slice(0, 12)}...</td>
                      <td>{confirmation.duplicate_status}</td>
                      <td>
                        <button
                          className="danger-button btn-sm"
                          onClick={() => setConfirmationToRemove(confirmation)}
                          type="button"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>

      {confirmationToRemove && (
        <div
          className="admin-modal-backdrop"
          onClick={() => {
            if (!removing) setConfirmationToRemove(null);
          }}
          role="presentation"
        >
          <section
            aria-labelledby="remove-confirmation-title"
            aria-modal="true"
            className="admin-modal panel"
            onClick={(eventClick) => eventClick.stopPropagation()}
            role="dialog"
          >
            <p className="eyebrow">Remover confirmacao</p>
            <h2 id="remove-confirmation-title">Tem certeza?</h2>
            <p className="admin-modal-copy">
              Voce esta removendo a confirmacao de <b>{confirmationToRemove.name}</b>, telefone{" "}
              <b>{confirmationToRemove.phone}</b>.
            </p>
            <div className="admin-modal-actions">
              <button
                className="secondary-button"
                disabled={removing}
                onClick={() => setConfirmationToRemove(null)}
                type="button"
              >
                Cancelar
              </button>
              <button className="danger-button" disabled={removing} onClick={removeConfirmation} type="button">
                {removing ? "Removendo..." : "Remover"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
