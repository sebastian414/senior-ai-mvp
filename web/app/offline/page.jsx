export default function OfflinePage() {
  return (
    <main style={styles.screen}>
      <div style={styles.topHint}>Váš zdravotný asistent</div>

      <div style={styles.avatarWrap}>
        <div style={styles.haloOff} />
        <img src="/pharmacist.png" alt="AI lekárnička" style={styles.avatar} />
      </div>

      <div style={styles.title}>Nemám internet.</div>
      <div style={styles.subtitle}>Skontrolujte Wi-Fi alebo mobilné dáta.</div>

      <a href="/" style={styles.buttonLink}>Skúsiť znova</a>
    </main>
  );
}

const styles = {
  screen: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "26px 18px 28px",
    background: "#f6fbf9",
    color: "#101828",
  },
  topHint: { fontSize: 14, opacity: 0.6, marginTop: 6 },
  avatarWrap: {
    position: "relative",
    marginTop: 26,
    width: 300,
    height: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  haloOff: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 999,
    background:
      "radial-gradient(circle, rgba(138,212,195,0.18) 0%, rgba(138,212,195,0.08) 45%, rgba(138,212,195,0) 70%)",
  },
  avatar: {
    width: 230,
    height: 230,
    borderRadius: 999,
    objectFit: "cover",
    background: "#fff",
    border: "1px solid rgba(138,212,195,0.22)",
    boxShadow: "0 18px 50px rgba(16,24,40,0.10)",
  },
  title: { marginTop: 18, fontSize: 44, fontWeight: 800, textAlign: "center" },
  subtitle: { marginTop: 10, fontSize: 18, opacity: 0.75, textAlign: "center" },
  buttonLink: {
  marginTop: 22,
  width: "min(420px, 100%)",
  height: 54,
  borderRadius: 14,
  background: "#8ad4c3",
  color: "#083a33",
  fontSize: 18,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
},
};