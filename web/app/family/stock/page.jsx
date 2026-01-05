export default function StockPage() {
  return (
    <main style={s.screen}>
      <header style={s.header}>
        <a href="/family" style={s.back}>← Späť</a>
        <h1 style={s.title}>Zásoby</h1>
        <div style={{ width: 44 }} />
      </header>

      <div style={s.card}>
        <Row name="Paralen" left="12 tabliet" note="OK" />
        <Row name="Ibalgin" left="6 tabliet" note="Doplniť čoskoro" />
        <Row name="Liek 3" left="3 tablety" note="Málo" danger />
      </div>

      <div style={s.info}>
        Demo verzia – zásoby sa budú automaticky prepočítavať podľa užívania.
      </div>
    </main>
  );
}

function Row({ name, left, note, danger }) {
  return (
    <div style={s.row}>
      <div>
        <div style={s.name}>{name}</div>
        <div style={s.sub}>{left}</div>
      </div>
      <div style={{ ...s.pill, ...(danger ? s.pillDanger : {}) }}>{note}</div>
    </div>
  );
}

const s = {
  screen: {
    minHeight: "100vh",
    background: "#f6fbf9",
    padding: "18px 16px",
    color: "#101828",
    fontFamily: "system-ui",
  },
  header: {
    maxWidth: 520,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { textDecoration: "none", color: "#0b6b5e", fontWeight: 900 },
  title: { fontSize: 20, fontWeight: 900 },
  card: {
    maxWidth: 520,
    margin: "16px auto 0",
    background: "#fff",
    border: "1px solid rgba(16,24,40,0.08)",
    borderRadius: 16,
    padding: 12,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 8px",
    borderBottom: "1px solid rgba(16,24,40,0.06)",
  },
  name: { fontWeight: 900, fontSize: 16 },
  sub: { marginTop: 4, fontSize: 13, opacity: 0.65 },
  pill: {
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(138,212,195,0.25)",
    color: "#083a33",
    fontWeight: 900,
    fontSize: 12,
  },
  pillDanger: {
    background: "rgba(255,90,90,0.18)",
    color: "#7a1f1f",
  },
  info: {
    maxWidth: 520,
    margin: "14px auto 0",
    fontSize: 13,
    opacity: 0.6,
    textAlign: "center",
  },
};