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
  <div
    style={{
      maxWidth: 820,
      margin: "24px auto",
      fontFamily: "system-ui",
      padding: 16
    }}
  >
    <h1 style={{ fontSize: 32, marginBottom: 10 }}>Asistent pre seniorov</h1>
    <div style={{ fontSize: 18, opacity: 0.8, marginBottom: 18 }}>
      Napíš otázku. Odpoviem stručne.
    </div>

    <div style={{ marginTop: 10 }}>
      <div style={{ marginBottom: 8, fontSize: 20 }}>Otázka</div>

      <textarea
        value={q}
        onChange={(e) => setQ(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          fontSize: 22,
          padding: 14,
          borderRadius: 10,
          border: "1px solid #ccc"
        }}
        placeholder="Napr. Čo znamená tlak 140/90?"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (q.trim() && !loading) ask();
          }
        }}
      />

      <button
        onClick={ask}
        disabled={!q.trim() || loading || !API_URL}
        style={{
          marginTop: 14,
          padding: "16px 20px",
          fontSize: 22,
          borderRadius: 12,
          border: "1px solid #ccc",
          width: "100%"
        }}
      >
        {loading ? "Premýšľam..." : "Spýtať sa"}
      </button>

      {!API_URL && (
        <div style={{ marginTop: 12, fontSize: 18, color: "crimson" }}>
          Chýba nastavenie servera (NEXT_PUBLIC_API_URL).
        </div>
      )}
    </div>

    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 8, fontSize: 20 }}>Odpoveď</div>
      <div
        style={{
          border: "1px solid #ddd",
          padding: 16,
          fontSize: 24,
          minHeight: 120,
          borderRadius: 10,
          lineHeight: 1.35
        }}
      >
        {a || "—"}
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
        <button
          onClick={() => {
            setQ("");
            setA("");
          }}
          style={{
            padding: "14px 16px",
            fontSize: 18,
            borderRadius: 10,
            border: "1px solid #ccc",
            flex: 1
          }}
        >
          Vymazať
        </button>

        <button
          onClick={() => navigator.clipboard?.writeText(a || "")}
          disabled={!a}
          style={{
            padding: "14px 16px",
            fontSize: 18,
            borderRadius: 10,
            border: "1px solid #ccc",
            flex: 1
          }}
        >
          Kopírovať
        </button>
      </div>
    </div>
  </div>
);
}
