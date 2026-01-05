export default function ProblemDetail() {
  return (
    <main style={s.screen}>
      <header style={s.header}>
        <a href="/family" style={s.back}>← Späť</a>
        <div style={s.title}>Problém</div>
        <div style={{ width: 44 }} />
      </header>

      <div style={s.card}>
        <div style={s.h1}>Brnenie nôh</div>
        <div style={s.meta}>Včera 12:00 · hlásené seniorom</div>

        <div style={s.section}>
          <div style={s.label}>Poznámka</div>
          <div style={s.text}>
            Senior povedal: „Včera okolo 12 mi brneli nohy.“
          </div>
        </div>

        <div style={s.section}>
          <div style={s.label}>Istota</div>
          <div style={s.pill}>Neisté</div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.label}>Poznámka pre rodinu</div>
        <div style={s.textMuted}>Demo: neskôr sem pridáme možnosť doplniť komentár.</div>
      </div>
    </main>
  );
}

const s = {
  screen: { minHeight: "100vh", background: "#f6fbf9", padding: "18px 16px", color: "#101828" },
  header: { maxWidth: 520, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" },
  back: { textDecoration: "none", color: "#0b6b5e", fontWeight: 900 },
  title: { fontWeight: 900, fontSize: 18 },
  card: {
    maxWidth: 520,
    margin: "14px auto 0",
    background: "#fff",
    border: "1px solid rgba(16,24,40,0.08)",
    borderRadius: 16,
    padding: 14,
  },
  h1: { fontSize: 22, fontWeight: 950 },
  meta: { marginTop: 6, fontSize: 13, opacity: 0.65 },
  section: { marginTop: 14 },
  label: { fontSize: 13, fontWeight: 900, opacity: 0.7, textTransform: "uppercase" },
  text: { marginTop: 8, fontSize: 15, lineHeight: 1.45 },
  textMuted: { marginTop: 8, fontSize: 14, opacity: 0.65, lineHeight: 1.4 },
  pill: {
    marginTop: 8,
    display: "inline-block",
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(138,212,195,0.25)",
    color: "#083a33",
    fontWeight: 900,
    fontSize: 12,
  },
};