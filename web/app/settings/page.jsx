export default function SettingsPage() {
  return (
    <main style={s.screen}>
      <header style={s.header}>
        <a href="/" style={s.back}>← Späť</a>
        <div style={s.title}>Nastavenia</div>
        <div style={{ width: 44 }} />
      </header>

      <div style={s.card}>
        <div style={s.row}>
          <div>
            <div style={s.rowTitle}>Režim aplikácie</div>
            <div style={s.rowSub}>Prepínanie medzi seniorom a adminom</div>
          </div>
        </div>
      </div>

      <a href="/family" style={s.primary}>Prepnúť na Admin</a>
      <a href="/" style={s.secondary}>Späť do Senior režimu</a>
    </main>
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
  title: { fontWeight: 900, fontSize: 18 },
  card: {
    maxWidth: 520,
    margin: "16px auto 0",
    background: "#fff",
    border: "1px solid rgba(16,24,40,0.08)",
    borderRadius: 16,
    padding: 14,
  },
  row: { display: "flex", justifyContent: "space-between" },
  rowTitle: { fontWeight: 900, fontSize: 16 },
  rowSub: { marginTop: 4, fontSize: 13, opacity: 0.65 },
  primary: {
    width: "min(520px, 100%)",
    margin: "18px auto 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    borderRadius: 16,
    background: "#8ad4c3",
    color: "#083a33",
    fontSize: 18,
    fontWeight: 900,
    textDecoration: "none",
  },
  secondary: {
    width: "min(520px, 100%)",
    margin: "10px auto 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    borderRadius: 16,
    border: "1px solid rgba(16,24,40,0.12)",
    background: "#fff",
    color: "#101828",
    fontSize: 18,
    fontWeight: 900,
    textDecoration: "none",
  },
};