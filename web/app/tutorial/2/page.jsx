export default function T2() {
  return (
    <main style={s.screen}>
      <div style={s.card}>
        <div style={s.step}>Krok 2 z 3</div>
        <div style={s.icon}>✅</div>
        <div style={s.title}>Všetko zopakujem</div>
        <div style={s.sub}>Po každom zázname nahlas poviem, čo som uložila.</div>
        <a href="/tutorial/3" style={s.primary}>Pokračovať</a>
      </div>
    </main>
  );
}
const s = base();
function base() {
  return {
    screen: {
      minHeight: "100vh",
      background:
        "radial-gradient(1200px 700px at 50% 10%, #ffffff 0%, #f3fbf8 70%, #eaf7f3 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 18,
      color: "#101828",
    },
    card: {
      width: "min(420px, 100%)",
      background: "rgba(255,255,255,0.95)",
      border: "1px solid rgba(16,24,40,0.08)",
      borderRadius: 18,
      padding: 18,
      boxShadow: "0 20px 60px rgba(16,24,40,0.10)",
      textAlign: "center",
    },
    step: { fontSize: 13, fontWeight: 900, opacity: 0.6, textTransform: "uppercase" },
    icon: { fontSize: 52, marginTop: 12 },
    title: { fontSize: 26, fontWeight: 900, marginTop: 10 },
    sub: { marginTop: 8, fontSize: 15, opacity: 0.68, lineHeight: 1.45 },
    primary: {
      marginTop: 18,
      height: 54,
      borderRadius: 16,
      background: "#8ad4c3",
      color: "#083a33",
      fontWeight: 900,
      fontSize: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none",
    },
  };
}