"use client";

import { useEffect, useState } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

export default function FamilyHome() {
  const [seniorId, setSeniorId] = useState("demo");
  const [type, setType] = useState("reminder"); // reminder | note
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [items, setItems] = useState([]);

  async function load() {
    if (!API_BASE) return;
    const r = await fetch(`${API_BASE}/logs?senior_id=${encodeURIComponent(seniorId)}&limit=30`);
    const j = await r.json();
    setItems(j.logs || []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit() {
    setStatus("");
    if (!API_BASE) return setStatus("Chýba NEXT_PUBLIC_API_URL");
    const t = text.trim();
    if (!t) return;

    const r = await fetch(`${API_BASE}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senior_id: seniorId, type, text: t }),
    });

    if (!r.ok) {
      const msg = await r.text().catch(() => "");
      return setStatus(`Chyba: ${r.status} ${msg.slice(0, 120)}`);
    }

    setText("");
    setStatus("Uložené ✅");
    await load();
  }

  return (
    <main style={S.page}>
      <h1 style={S.h1}>Rodina</h1>
      <div style={S.sub}>Pridajte pripomienku alebo záznam seniorovi.</div>

      <div style={S.card}>
        <label style={S.label}>Senior ID</label>
        <input value={seniorId} onChange={(e) => setSeniorId(e.target.value)} style={S.input} />

        <label style={S.label}>Typ</label>
        <select value={type} onChange={(e) => setType(e.target.value)} style={S.input}>
          <option value="reminder">Pripomienka</option>
          <option value="note">Poznámka</option>
        </select>

        <label style={S.label}>Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder={type === "reminder" ? "Napr. Lieky o 8:00" : "Napr. Dnes bol unavený"}
          style={S.textarea}
        />

        <button onClick={submit} style={S.btn}>
          Uložiť
        </button>

        {status && <div style={S.status}>{status}</div>}
      </div>

      <div style={S.list}>
        <div style={S.listTitle}>Posledné záznamy</div>
        {items.map((it, idx) => (
          <div key={idx} style={S.item}>
            <div style={S.meta}>
              <b>{it.role}</b> • {it.created_at?.slice(0, 19)?.replace("T", " ")} • {it.type || "-"}
            </div>
            <div>{it.question}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

const S = {
  page: { padding: 18, maxWidth: 720, margin: "0 auto", fontFamily: "system-ui" },
  h1: { fontSize: 28, margin: 0 },
  sub: { opacity: 0.7, marginTop: 6, marginBottom: 14 },
  card: {
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 14,
    padding: 14,
    background: "rgba(255,255,255,0.9)",
  },
  label: { display: "block", fontSize: 13, fontWeight: 800, marginTop: 10, opacity: 0.7 },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)",
    marginTop: 6,
    fontSize: 16,
  },
  textarea: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)",
    marginTop: 6,
    fontSize: 16,
    resize: "vertical",
  },
  btn: {
    width: "100%",
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "none",
    fontWeight: 900,
    cursor: "pointer",
    background: "#8ad4c3",
    color: "#083a33",
  },
  status: { marginTop: 10, padding: 10, borderRadius: 10, background: "rgba(0,0,0,0.06)" },
  list: { marginTop: 16 },
  listTitle: { fontWeight: 900, marginBottom: 8 },
  item: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.08)",
    marginBottom: 10,
    background: "#fff",
  },
  meta: { fontSize: 12, opacity: 0.7, marginBottom: 6 },
};
