export default function TutorialPage() {
  const steps = [
    "Povedzte „Stlačte a hovorte“ a aplikácia vás počúva.",
    "Zopakujeme, čo sme zachytili, a zapíšeme to do histórie.",
    "Ak si nie ste istí dávkou, pozrite leták alebo zavolajte lekára."
  ];

  return (
    <main style={s.screen}>
      <div style={s.badge}>Rýchly návod</div>
      <h1 style={s.title}>Ako používať asistenta</h1>
      <p style={s.sub}>Jednoduché kroky, všetko po slovensky.</p>

      <div style={s.steps}>
        {steps.map((t, i) => (
          <div key={i} style={s.stepCard}>
            <div style={s.stepNum}>{i + 1}</div>
            <div style={s.stepText}>{t}</div>
          </div>
        ))}
      </div>

      <a href="/" style={s.cta}>Pokračovať</a>
    </main>
  );
}

const s = {
  screen: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 16px 40px",
    background: "linear-gradient(180deg,#f6fbf9 0%,#eef7f3 100%)",
    fontFamily: "system-ui",
    color: "#101828",
  },
  badge: {
    background: "#e8f6f2",
    color: "#0b6b5e",
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 800,
    letterSpacing: 0.3,
  },
  title: { marginTop: 18, fontSize: 32, fontWeight: 900 },
  sub: { marginTop: 6, opacity: 0.7, textAlign: "center" },
  steps: { marginTop: 22, width: "min(520px, 100%)", display: "flex", flexDirection: "column", gap: 12 },
  stepCard: {
    display: "flex",
    gap: 12,
    background: "#fff",
    borderRadius: 16,
    padding: 14,
    border: "1px solid rgba(16,24,40,0.08)",
    boxShadow: "0 16px 40px rgba(8,58,51,0.08)",
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 12,
    background: "#8ad4c3",
    color: "#083a33",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },
  stepText: { flex: 1, fontWeight: 700 },
  cta: {
    marginTop: 26,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    width: "min(420px, 100%)",
    borderRadius: 16,
    background: "#8ad4c3",
    color: "#083a33",
    fontWeight: 900,
    textDecoration: "none",
    fontSize: 18,
    boxShadow: "0 14px 40px rgba(8,58,51,0.16)",
  },
};
