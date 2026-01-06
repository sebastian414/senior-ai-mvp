"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildSpeechClients,
  fetchSpeechToken,
  recognizeOnce,
  speakText,
} from "./lib/speech";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

function cleanTranscript(text) {
  const trimmed = (text || "").replace(/^You said:?\s*/i, "").trim();
  if (!trimmed) return "";
  return trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;
}

function safetyWrap(question, aiAnswer) {
  const q = (question || "").toLowerCase();
  const isDose = q.includes("kolko") || q.includes("koľko") || q.includes("dávk") || q.includes("mg") || q.includes("tablet");
  const isSideEffect = q.includes("vedlaj") || q.includes("vedľaj") || q.includes("ucink") || q.includes("účink");
  if (isDose || isSideEffect) {
    return "Zapísala som, čo ste povedali. Pre dávkovanie a vedľajšie účinky vždy postupujte podľa letáku a opýtajte sa lekára alebo lekárnika.";
  }
  return `Zapísala som: ${aiAnswer}`;
}

async function askBackend(question) {
  if (!API_BASE) throw new Error("Chýba NEXT_PUBLIC_API_URL");

  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, senior_id: "demo", role: "senior" }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Ask failed ${res.status}: ${txt}`);
  }

  const data = await res.json();
  return data?.answer || "Prepáč, neviem odpovedať.";
}

export default function Page() {
  const [mode, setMode] = useState("listening");
  const [heardText, setHeardText] = useState("");
  const [answer, setAnswer] = useState("");
  const [isTalking, setIsTalking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const [mouthOpen, setMouthOpen] = useState(false);
  const [hasApi, setHasApi] = useState(Boolean(API_BASE));
  const speechRef = useRef({ recognizer: null, synthesizer: null });

  const statusText = useMemo(() => {
    return {
      listening: {
        big: "Počúvam.",
        small: "Povedzte napríklad: „Čo mám teraz užiť?“",
      },
      ask: {
        big: "Podľa rozvrhu teraz:",
        small: answer || "Čítam rozvrh…",
      },
      saved: {
        big: "Zapísala som.",
        small: answer || "Uložila som záznam.",
      },
      offline: {
        big: "Nemám internet.",
        small: "Skontrolujte Wi‑Fi alebo mobilné dáta.",
      },
    }[mode];
  }, [answer, mode]);

  useEffect(() => {
    if (!API_BASE) {
      setError("Chýba NEXT_PUBLIC_API_URL v prostredí.");
      setHasApi(false);
      setMode("offline");
      return;
    }
    warmUpSpeech();
  }, []);

  useEffect(() => {
    if (!isTalking) {
      setMouthOpen(false);
      return undefined;
    }
    const id = setInterval(() => setMouthOpen(m => !m), 160);
    return () => clearInterval(id);
  }, [isTalking]);

  async function warmUpSpeech() {
    try {
      setError("");
      const { token, region } = await fetchSpeechToken(API_BASE);
      speechRef.current = buildSpeechClients(token, region);
      setMode("listening");
      await speakOut("Počúvam.");
    } catch (e) {
      console.error(e);
      setError("Hlasové služby nie sú dostupné.");
      setMode("offline");
    }
  }

  async function speakOut(text) {
  if (!text) return;
  try {
    setError("");
    setIsTalking(true);

    const r = await fetch(`${API_BASE}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!r.ok) {
      const t = await r.text().catch(() => "");
      throw new Error(`TTS HTTP ${r.status}: ${t.slice(0, 200)}`);
    }

    const blob = await r.blob();
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    await audio.play();
  } catch (e) {
    setError(`TTS chyba: ${String(e?.message || e)}`);
  } finally {
    setIsTalking(false);
  }
}

  async function handleListen() {
    if (mode === "offline") {
      await warmUpSpeech();
    }

    if (!hasApi) {
      setError("Chýba adresa API. Nastavte NEXT_PUBLIC_API_URL.");
      setMode("offline");
      return;
    }

    setIsListening(true);
    setError("");
    setHeardText("");
    setAnswer("");
    setMode("listening");

    try {
      if (!speechRef.current.recognizer) {
        await warmUpSpeech();
      }

      if (!speechRef.current.recognizer) {
        setError("Mikrofón nie je pripravený.");
        setMode("offline");
        return;
      }

      const raw = await recognizeOnce(speechRef.current.recognizer);
      const cleaned = cleanTranscript(raw);
      setHeardText(cleaned || "Nerozumela som.");

      if (!cleaned) {
        await speakOut("Nerozumela som. Skúste to prosím znova.");
        setMode("listening");
        return;
      }

      setMode("ask");
      const aiAnswer = await askBackend(cleaned);
      const safe = safetyWrap(cleaned, aiAnswer);
      setAnswer(safe);
      await speakOut(safe);
      setMode("saved");
    } catch (e) {
      console.error(e);
      setError("Nepodarilo sa spracovať hlas.");
      setMode("offline");
    } finally {
      setIsListening(false);
      setIsTalking(false);
    }
  }

  return (
    <main style={s.screen}>
      <nav style={s.nav}>
        <a href="/tutorial" style={s.navLink}>
          Návod
        </a>
        <a href="/family" style={s.navLink}>
          Rodina
        </a>
        <a href="/settings" style={s.navLink}>
          Nastavenia
        </a>
      </nav>

      <div style={s.topHint}>Váš zdravotný asistent</div>

      <div style={s.avatarWrap}>
        <div style={{ ...s.halo, ...(mode === "offline" ? s.haloOff : {}) }} />
        <img src="/pharmacist.svg" alt="AI lekárnička" style={s.avatar} />
        <div style={{ ...s.mouth, ...(mouthOpen ? s.mouthOpen : {}) }} />
        {isListening && <div style={s.pulse} aria-hidden />}
      </div>

      <div style={s.big}>{statusText.big}</div>
      <div style={s.small}>{statusText.small}</div>

      <div style={s.examples}>
        <div style={s.exampleTitle}>Môžete povedať napríklad:</div>
        <div style={s.exampleChips}>
          <span style={s.chip}>„Užil som 2 tabletky lieku X.“</span>
          <span style={s.chip}>„Čo mám teraz užiť?“</span>
          <span style={s.chip}>„Včera mi brneli nohy okolo obeda.“</span>
        </div>
      </div>

      {heardText && (
        <div style={s.heard}>Zachytila som: „{heardText}“</div>
      )}

      {answer && (
        <div style={s.answerBlock}>
          <div style={s.answerLabel}>Odpoveď</div>
          <div>{answer}</div>
        </div>
      )}

      {error && <div style={s.error}>{error}</div>}

      <div style={s.actions}>
        <button
          style={btn(mode === "offline").main}
          onClick={handleListen}
          disabled={isListening}
        >
          {mode === "offline"
            ? "Skúsiť znova"
            : isListening
              ? "Počúvam…"
              : "Stlačte a hovorte"}
        </button>
        <button
          style={btn(false).ghost}
          onClick={() => speakOut(answer || "Počúvam.")}
          disabled={mode === "offline" || isListening}
        >
          Prehrať znova
        </button>
      </div>
    </main>
  );
}

function btn(active) {
  return {
    main: {
      width: "min(420px, 100%)",
      height: 58,
      borderRadius: 16,
      border: "none",
      background: active ? "#dbe8e4" : "#8ad4c3",
      color: "#083a33",
      fontWeight: 900,
      fontSize: 18,
      boxShadow: "0 14px 40px rgba(8,58,51,0.16)",
      cursor: "pointer",
    },
    ghost: {
      marginTop: 10,
      width: "min(420px, 100%)",
      height: 48,
      borderRadius: 14,
      border: "1px solid rgba(8,58,51,0.18)",
      background: "#fff",
      color: "#083a33",
      fontWeight: 800,
      fontSize: 16,
      cursor: "pointer",
    },
  };
}

const s = {
  screen: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "26px 18px 32px",
    background:
      "radial-gradient(1200px 700px at 50% 10%, #ffffff 0%, #f3fbf8 70%, #eaf7f3 100%)",
    color: "#0b1220",
    fontFamily: "system-ui",
  },
  nav: {
    width: "100%",
    maxWidth: 520,
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  },
  navLink: {
    fontSize: 13,
    fontWeight: 800,
    color: "#0b6b5e",
    textDecoration: "none",
    padding: "6px 10px",
    borderRadius: 12,
    background: "rgba(138,212,195,0.18)",
    border: "1px solid rgba(8,58,51,0.12)",
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
  mouth: {
    position: "absolute",
    bottom: 88,
    width: 64,
    height: 12,
    borderRadius: 999,
    background: "rgba(8,58,51,0.72)",
    transform: "scaleY(0.4)",
    transformOrigin: "center",
    opacity: 0.78,
    transition: "transform 120ms ease",
  },
  mouthOpen: {
    transform: "scaleY(1)",
  },
  pulse: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 999,
    border: "2px solid rgba(138,212,195,0.6)",
    animation: "pulse 1.6s ease-in-out infinite",
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
  heard: {
    marginTop: 14,
    padding: "10px 14px",
    background: "rgba(8,58,51,0.06)",
    borderRadius: 12,
    color: "#083a33",
    fontWeight: 600,
  },
  answerBlock: {
    marginTop: 12,
    padding: "12px 16px",
    background: "#fff",
    borderRadius: 14,
    border: "1px solid rgba(8,58,51,0.12)",
    boxShadow: "0 12px 34px rgba(8,58,51,0.10)",
    width: "min(520px, 100%)",
  },
  answerLabel: { fontSize: 14, opacity: 0.6, marginBottom: 6 },
  error: {
    marginTop: 10,
    color: "#b42318",
    background: "rgba(180,35,24,0.08)",
    borderRadius: 10,
    padding: "8px 12px",
    fontWeight: 600,
  },
  actions: {
    marginTop: 18,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: 6,
  },
  examples: {
    marginTop: 18,
    background: "rgba(138,212,195,0.12)",
    borderRadius: 16,
    padding: "12px 14px",
    width: "min(540px, 100%)",
    border: "1px solid rgba(8,58,51,0.08)",
  },
  exampleTitle: { fontSize: 14, opacity: 0.75, marginBottom: 8 },
  exampleChips: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: {
    background: "#fff",
    border: "1px solid rgba(8,58,51,0.12)",
    borderRadius: 999,
    padding: "8px 12px",
    fontWeight: 700,
    fontSize: 14,
    color: "#083a33",
    boxShadow: "0 8px 20px rgba(8,58,51,0.08)",
  },
};

