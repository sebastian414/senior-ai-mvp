"use client";
import { useEffect, useState } from "react";

export default function FamilyPage() {
  const [logs, setLogs] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr("");
        const r = await fetch(`${API_URL}/logs?limit=30`);
        const t = await r.text();
        if (!r.ok) {
          setErr(`HTTP ${r.status}: ${t.slice(0, 200)}`);
          return;
        }
        const data = JSON.parse(t);
        setLogs(data.logs || []);
      } catch (e) {
        setErr(String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [API_URL]);

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", fontFamily: "system-ui", padding: 16 }}>
      <h1>Rodinný režim</h1>
      <div style={{ marginBottom: 14, opacity: 0.75 }}>
        Posledné otázky a odpovede (história).
      </div>

      <div style={{ marginBottom: 16 }}>
        <a href="/" style={{ textDecoration: "underline" }}>← Späť na senior režim</a>
      </div>

      {loading && <div>Načítavam...</div>}
      {err && <div style={{ color: "crimson" }}>Chyba: {err}</div>}

      {!loading && !err && logs.length === 0 && <div>Zatiaľ žiadne záznamy.</div>}

      {!loading && !err && logs.map((x, i) => (
        <div key={i} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
            {x.created_at} • {x.role || "senior"}
          </div>
          <div style={{ fontSize: 18, marginBottom: 8 }}>
            <b>Otázka:</b> {x.question}
          </div>
          <div style={{ fontSize: 18 }}>
            <b>Odpoveď:</b> {x.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
