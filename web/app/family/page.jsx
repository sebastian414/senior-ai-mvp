"use client";
import { useEffect, useState } from "react";

export default function FamilyPage() {
  const [logs, setLogs] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const problems = logs.filter((x) => {
  const q = (x.question || "").toLowerCase();
  return (
    q.includes("brn") ||       // brneli, brnenie
    q.includes("závr") || q.includes("zavrat") ||
    q.includes("boles") ||
    q.includes("opuch") ||
    q.includes("nevo") ||      // nevoľnosť
    q.includes("tepl") ||      // teplota
    q.includes("kaš") || q.includes("kas") ||
    q.includes("dých") || q.includes("dych") ||
    q.includes("tlak") ||
    q.includes("srdc")         // srdce
  );
});

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

<div style={{ marginBottom: 18 }}>
  <h2 style={{ margin: "0 0 10px 0" }}>Problémy seniora</h2>

  {!loading && !err && problems.length === 0 && (
    <div style={{ opacity: 0.7 }}>Zatiaľ žiadne hlásené problémy.</div>
  )}

  {!loading && !err && problems.slice(0, 5).map((x, i) => (
    <a
      key={i}
      href="/family/problems"
      style={{
        display: "block",
        textDecoration: "none",
        color: "#101828",
        border: "1px solid rgba(16,24,40,0.10)",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        background: "#fff",
      }}
    >
      <div style={{ fontWeight: 900 }}>
        {(x.question || "").slice(0, 60)}
      </div>
      <div style={{ fontSize: 13, opacity: 0.65, marginTop: 6 }}>
        {x.created_at}
      </div>
    </a>
  ))}
</div>

      <div style={styles.nav}>
  <a style={styles.navItemActive} href="/family">Prehľad</a>
  <a style={styles.navItem} href="/family/problems">Problémy</a>
  <a style={styles.navItem} href="/family/schedule">Rozvrh</a>
  <a style={styles.navItem} href="/family/stock">Zásoby</a>
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
const styles = {
  nav: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    margin: "12px 0 18px",
  },
  navItem: {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(16,24,40,0.12)",
    textDecoration: "none",
    fontWeight: 800,
    color: "#101828",
    background: "#fff",
  },
  navItemActive: {
    padding: "10px 14px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 900,
    color: "#083a33",
    background: "#8ad4c3",
    border: "1px solid rgba(138,212,195,0.35)",
  },
};
