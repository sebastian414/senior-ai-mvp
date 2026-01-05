"use client";

import { useState } from "react";

export default function Page() {
  const [mode, setMode] = useState("listening"); // listening | saved | ask | offline

  const texts = {
    listening: {
      big: "Počúvam.",
      small: "Môžete povedať napríklad: „Čo mám teraz užiť?“",
    },
    saved: {
      big: "Zapísala som.",
      small: "Paralen – 1 tableta – dnes 09:12.",
    },
    ask: {
      big: "Podľa rozvrhu teraz:",
      small: "Liek 1 – 3 tablety – po jedle. Po užití povedzte „hotovo“.",
    },
    offline: {
      big: "Nemám internet.",
      small: "Skontrolujte Wi-Fi alebo mobilné dáta.",
    },
  };

  const t = texts[mode];

  return (
    <main style={s.screen}>
      <div style={s.topHint}>Váš zdravotný asistent</div>

      <div style={s.avatarWrap}>
        <div style={{ ...s.halo, ...(mode === "offline" ? s.haloOff : {}) }} />
        <img src="/pharmacist.png" alt="AI lekárnička" style={s.avatar} />
      </div>

      <div style={s.big}>{t.big}</div>
      <div style={s.small}>{t.small}</div>

      {/* Demo ovládanie (neskôr odstránime) */}
      <div style={s.demoBar}>
        <button style={btn(mode === "listening")} onClick={() => setMode("listening")}>Počúva</button>
        <button style={btn(mode === "saved")} onClick={() => setMode("saved")}>Zapísala</button>
        <button style={btn(mode === "ask")} onClick={() => setMode("ask")}>Rozvrh</button>
        <button style={btn(mode === "offline")} onClick={() => setMode("offline")}>Offline</button>
      </div>

      {mode === "offline" && (
        <a href="/offline" style={s.offlineLink}>Skúsiť znova</a>
      )}
    </main>
  );
}

function btn(active) {
  return {
    height: 38,
    padding: "0 12px",
    borderRadius: 999,
    border: active ? "none" : "1px solid rgba(16,24,40,0.12)",
    background: active ? "#8ad4c3" : "#fff",
    color: active ? "#083a33" : "#101828",
    fontWeight: 900,
    fontSize: 12,
  };
}

const s = {
  screen: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "26px 18px 22px",
    background:
      "radial-gradient(1200px 700px at 50% 10%, #ffffff 0%, #f3fbf8 70%, #eaf7f3 100%)",
    color: "#0b1220",
    fontFamily: "system-ui",
  },
  topHint: {
    width: "100%",
    maxWidth: 420,
    fontSize: 14,
    letterSpacing: 0.2,
    color: "rgba(11,18,32,0.55)",
    textAlign: "center",
    marginTop: 4,
  },
  avatarWrap: {
    position: "relative",
    marginTop: 28,
    width: 320,
    height: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 999,
    background:
      "radial-gradient(circle at 50% 50%, rgba(138,212,195,0.38) 0%, rgba(138,212,195,0.14) 45%, rgba(138,212,195,0) 72%)",
  },
  haloOff: { opacity: 0.35 },
  avatar: {
    width: 240,
    height: 240,
    borderRadius: 999,
    objectFit: "cover",
    background: "#fff",
    border: "1px solid rgba(138,212,195,0.22)",
    boxShadow:
      "0 22px 60px rgba(16,24,40,0.10), 0 4px 14px rgba(138,212,195,0.14)",
  },
  big: {
    marginTop: 18,
    fontSize: 46,
    fontWeight: 900,
    letterSpacing: -0.8,
    textAlign: "center",
    lineHeight: 1.05,
  },
  small: {
    marginTop: 12,
    maxWidth: 520,
    textAlign: "center",
    fontSize: 16,
    color: "rgba(11,18,32,0.72)",
    lineHeight: 1.4,
  },
  demoBar: {
    marginTop: 18,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
    opacity: 0.95,
  },
  offlineLink: {
    marginTop: 14,
    width: "min(420px, 100%)",
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