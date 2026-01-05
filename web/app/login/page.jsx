export default function LoginPage() {
  return (
    <main style={s.screen}>
      <div style={s.card}>
        <div style={s.logoRow}>
          <div style={s.logoDot} />
          <div style={s.brand}>Zdravio</div>
        </div>

        <div style={s.title}>Prihlásenie</div>
        <div style={s.sub}>Použite email a heslo. Po prihlásení zostanete prihlásený.</div>

        <label style={s.label}>Email</label>
        <input style={s.input} placeholder="napr. rodina@email.com" />

        <label style={s.label}>Heslo</label>
        <input style={s.input} placeholder="••••••••" type="password" />

        <a href="/tutorial" style={s.primary}>Prihlásiť</a>
        <a href="/reset" style={s.link}>Zabudol som heslo</a>
      </div>
    </main>
  );
}

const s = {
  screen: {
    minHeight: "100vh",
    background: "radial-gradient(1200px 700px at 50% 10%, #ffffff 0%, #f3fbf8 70%, #eaf7f3 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    color: "#101828",
  },
  card: {
    width: "min(420px, 100%)",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(16,24,40,0.08)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 20px 60px rgba(16,24,40,0.10)",
  },
  logoRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  logoDot: { width: 14, height: 14, borderRadius: 99, background: "#8ad4c3" },
  brand: { fontWeight: 900, letterSpacing: 0.2 },
  title: { fontSize: 28, fontWeight: 900, marginTop: 6 },
  sub: { marginTop: 6, fontSize: 14, opacity: 0.68, lineHeight: 1.4 },
  label: { display: "block", marginTop: 14, fontSize: 13, fontWeight: 800, opacity: 0.8 },
  input: {
    width: "100%",
    height: 48,
    marginTop: 8,
    borderRadius: 14,
    border: "1px solid rgba(16,24,40,0.12)",
    padding: "0 14px",
    fontSize: 16,
    outline: "none",
    background: "#fff",
  },
  primary: {
    marginTop: 16,
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
  link: {
    display: "block",
    textAlign: "center",
    marginTop: 12,
    color: "#0b6b5e",
    fontWeight: 800,
    textDecoration: "none",
  },
};