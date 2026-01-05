"use client";
import { useEffect, useState } from "react";

export default function FamilyPage() {
  const [logs, setLogs] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("schedule");

  const problems = logs.filter((x) => {
    const q = (x.question || "").toLowerCase();
    return (
      q.includes("brn") ||
      q.includes("závr") ||
      q.includes("zavrat") ||
      q.includes("boles") ||
      q.includes("opuch") ||
      q.includes("nevo") ||
      q.includes("tepl") ||
      q.includes("kaš") ||
      q.includes("kas") ||
      q.includes("dých") ||
      q.includes("dych") ||
      q.includes("tlak") ||
      q.includes("srdc")
    );
  });

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr("");
        const r = await fetch(`${API_URL}/logs?limit=30&senior_id=demo`);
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

  const schedule = [
    { name: "Ralgho", time: "Ráno do 10:00", dose: "1 tableta po jedle" },
    { name: "Balgin", time: "Obed do 14:00", dose: "1 tableta" },
    { name: "Anopyrin", time: "Večer do 19:00", dose: "1 tableta" },
  ];

  const stock = [
    { name: "Balgin", left: "10 tabliet", status: "5 dní" },
    { name: "Ralgho", left: "22 tabliet", status: "11 dní" },
    { name: "Anopyrin", left: "35 tabliet", status: "17 dní" },
  ];

  function SectionCard({ title, children }) {
    return (
      <div style={styles.card}>
        <div style={styles.cardTitle}>{title}</div>
        {children}
      </div>
    );
  }

  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <div>
          <div style={styles.kicker}>Rodina má prehľad</div>
          <h1 style={styles.title}>Senior „demo“</h1>
        </div>
        <a href="/" style={styles.back}>
          ← Späť
        </a>
      </header>

      <div style={styles.tabs}>
        {[
          { id: "schedule", label: "Rozvrh" },
          { id: "stock", label: "Zásoby" },
          { id: "problems", label: "Problémy" },
          { id: "history", label: "História" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={tab === t.id ? styles.tabActive : styles.tab}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "schedule" && (
        <SectionCard title="Rozvrh liekov">
          {schedule.map((s, i) => (
            <div key={i} style={styles.row}>
              <div style={styles.rowTitle}>{s.name}</div>
              <div style={styles.rowMeta}>{s.time}</div>
              <div style={styles.rowSub}>{s.dose}</div>
            </div>
          ))}
        </SectionCard>
      )}

      {tab === "stock" && (
        <SectionCard title="Zásoby">
          {stock.map((s, i) => (
            <div key={i} style={styles.row}>
              <div style={styles.rowTitle}>{s.name}</div>
              <div style={styles.rowMeta}>{s.left}</div>
              <div style={styles.rowSub}>Vydrží cca {s.status}</div>
            </div>
          ))}
        </SectionCard>
      )}

      {tab === "problems" && (
        <SectionCard title="Problémy (hlasené symptómy)">
          {!loading && !err && problems.length === 0 && (
            <div style={styles.empty}>Zatiaľ žiadne hlásené problémy.</div>
          )}
          {!loading && !err &&
            problems.slice(0, 8).map((x, i) => (
              <div key={i} style={styles.logCard}>
                <div style={styles.logMeta}>{x.created_at}</div>
                <div style={styles.logQ}>{x.question}</div>
              </div>
            ))}
        </SectionCard>
      )}

      {tab === "history" && (
        <SectionCard title="História (otázky/odpovede)">
          {loading && <div>Načítavam…</div>}
          {err && <div style={{ color: "#b42318" }}>Chyba: {err}</div>}
          {!loading && !err && logs.length === 0 && (
            <div style={styles.empty}>Zatiaľ žiadne záznamy.</div>
          )}
          {!loading &&
            !err &&
            logs.map((x, i) => (
              <div key={i} style={styles.logCard}>
                <div style={styles.logMeta}>{x.created_at}</div>
                <div style={styles.logQ}>Otázka: {x.question}</div>
                <div style={styles.logA}>Odpoveď: {x.answer}</div>
              </div>
            ))}
        </SectionCard>
      )}
    </div>
  );
}
const styles = {
  shell: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "22px 16px 40px",
    fontFamily: "system-ui",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  kicker: { fontSize: 13, color: "rgba(16,24,40,0.65)" },
  title: { margin: 0, fontSize: 28, fontWeight: 800 },
  back: {
    textDecoration: "none",
    fontWeight: 800,
    color: "#0b6b5e",
    background: "#e8f6f2",
    padding: "8px 12px",
    borderRadius: 12,
  },
  tabs: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  tab: {
    borderRadius: 999,
    border: "1px solid rgba(16,24,40,0.12)",
    padding: "10px 14px",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 750,
  },
  tabActive: {
    borderRadius: 999,
    border: "1px solid rgba(138,212,195,0.24)",
    padding: "10px 14px",
    background: "#8ad4c3",
    color: "#083a33",
    boxShadow: "0 12px 28px rgba(8,58,51,0.12)",
    cursor: "pointer",
    fontWeight: 800,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    border: "1px solid rgba(16,24,40,0.08)",
    boxShadow: "0 16px 40px rgba(8,58,51,0.08)",
    marginTop: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: 900, marginBottom: 10 },
  row: { marginBottom: 10 },
  rowTitle: { fontWeight: 800, fontSize: 17 },
  rowMeta: { color: "rgba(16,24,40,0.8)", marginTop: 2 },
  rowSub: { color: "rgba(16,24,40,0.62)", marginTop: 2 },
  logCard: {
    border: "1px solid rgba(16,24,40,0.08)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    background: "#f8fbfa",
  },
  logMeta: { fontSize: 13, opacity: 0.65, marginBottom: 6 },
  logQ: { fontWeight: 750, marginBottom: 4 },
  logA: { color: "rgba(16,24,40,0.82)" },
  empty: { opacity: 0.7 },
};
