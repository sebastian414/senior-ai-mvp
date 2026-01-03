"use client";
import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

  async function ask() {
  setLoading(true);
  setA("");
  try {
    if (!API_URL) {
      setA("Chýba NEXT_PUBLIC_API_URL vo Verceli.");
      return;
    }

    const r = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, role: "senior" })
    });

    const text = await r.text(); // najprv ako text, aby sme videli aj HTML chyby
    if (!r.ok) {
      setA(`HTTP ${r.status}: ${text.slice(0, 300)}`);
      return;
    }

    let data;
    try { data = JSON.parse(text); } catch { data = { answer: text }; }
    setA(data.answer || "Bez odpovede");
  } catch (e) {
    setA(`Chyba spojenia: ${String(e)}`);
  } finally {
    setLoading(false);
  }
}

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui", padding: 16 }}>
      <h1>Asistent pre seniorov (MVP)</h1>

      <div style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 8, fontSize: 18 }}>Otázka</div>
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          rows={3}
          style={{ width: "100%", fontSize: 18, padding: 12 }}
          placeholder="Napíš otázku..."
        />
        <button
          onClick={ask}
          disabled={!q.trim() || loading || !API_URL}
          style={{ marginTop: 12, padding: "12px 18px", fontSize: 18 }}
        >
          {loading ? "Premýšľam..." : "Spýtať sa"}
        </button>

        {!API_URL && (
          <div style={{ marginTop: 10, color: "crimson" }}>
            Chýba NEXT_PUBLIC_API_URL vo Verceli.
          </div>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 8, fontSize: 18 }}>Odpoveď</div>
        <div style={{ border: "1px solid #ddd", padding: 14, fontSize: 20, minHeight: 80 }}>
          {a}
        </div>
      </div>
    </div>
  );
}
