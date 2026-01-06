import express from "express";
import { createClient } from "@supabase/supabase-js";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";


const app = express();
app.use(express.json({ limit: "1mb" }));

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  MISTRAL_API_KEY,
  ALLOWED_ORIGINS,
  AZURE_SPEECH_KEY,
  AZURE_SPEECH_REGION,
  PORT,
} = process.env;

function must(name, val) {
  if (!val) {
    console.error(`Missing env var: ${name}`);
    process.exit(1);
  }
}

must("SUPABASE_URL", SUPABASE_URL);
must("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY);
must("MISTRAL_API_KEY", MISTRAL_API_KEY);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const allowList = (ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// =========================
// CORS (jednoduché a správne)
// =========================
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const ok = !origin || allowList.length === 0 || allowList.includes(origin);

  if (origin && ok) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") return res.sendStatus(204);
  if (origin && !ok) return res.status(403).json({ error: "Origin not allowed" });

  next();
});

// =========================
// Helpers
// =========================
function isMedicalHighRisk(q) {
  const s = (q || "").toLowerCase();
  return (
    s.includes("dávkov") ||
    s.includes("davkov") ||
    s.includes("koľko mg") ||
    s.includes("kolko mg") ||
    s.includes("koľko tablet") ||
    s.includes("kolko tablet") ||
    s.includes("predpis") ||
    s.includes("diagnóz") ||
    s.includes("diagnoz") ||
    s.includes("kombinovať lieky") ||
    s.includes("kombinovat lieky") ||
    s.includes("zmeniť liek") ||
    s.includes("zmenit liek") ||
    s.includes("nahradiť liek") ||
    s.includes("nahradit liek")
  );
}

function shorten(text) {
  if (!text) return "";
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return parts.slice(0, 3).join(" ").trim();
}

// triedenie: question | reminder | note
function classifyType(question = "") {
  const s = question.toLowerCase();

  const hasTime = /\bo\s*\d{1,2}(:\d{2})?\b/.test(s);

  const isReminder =
    s.includes("pripomeň") ||
    s.includes("pripomen") ||
    s.includes("nezabudni") ||
    s.includes("nezabud") ||
    hasTime ||
    s.includes("užil som") ||
    s.includes("uzil som") ||
    s.includes("zober") ||
    s.includes("lieky o") ||
    s.includes("tablet");

  const isQuestion =
    s.includes("?") ||
    s.startsWith("čo") ||
    s.startsWith("co") ||
    s.startsWith("ako") ||
    s.startsWith("kedy") ||
    s.startsWith("prečo") ||
    s.startsWith("preco");

  if (isReminder) return "reminder";
  if (isQuestion) return "question";
  return "note";
}

async function safeInsertLog(row) {
  const { error } = await supabase.from("logs").insert(row);
  if (error) console.error("Supabase insert error:", error.message);
}

// =========================
// Health
// =========================
app.get("/", (req, res) => res.status(200).send("OK"));
app.get("/health", (req, res) => res.json({ ok: true }));

// =========================
// Logs API (čítanie)
// GET /logs?senior_id=demo&limit=20&type=reminder
// =========================
app.get("/logs", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 20), 100);
    const senior_id = String(req.query.senior_id || "demo").trim();
    const type = req.query.type ? String(req.query.type).trim() : null;

    let q = supabase
      .from("logs")
      .select("created_at, role, question, answer, senior_id, type")
      .eq("senior_id", senior_id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (type) q = q.eq("type", type);

    const { data, error } = await q;

    if (error) {
      console.error("Supabase read error:", error.message);
      return res.status(500).json({ error: "DB read failed" });
    }

    return res.json({ logs: data || [] });
  } catch (e) {
    console.error("Logs endpoint error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

// =========================
// Family create log (rodina pridá reminder/note)
// POST /log  { senior_id, type, text }
// =========================
app.post("/log", async (req, res) => {
  try {
    const senior_id = String(req.body?.senior_id || "demo").trim();
    const role = "family";
    const question = String(req.body?.text || "").trim();
    const type = String(req.body?.type || "note").trim();

    if (!question) return res.status(400).json({ error: "Missing text" });
    if (!["reminder", "note", "question"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    const answer = "";
    await safeInsertLog({ senior_id, role, question, answer, type });
    return res.json({ ok: true });
  } catch (e) {
    console.error("Log create error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

// =========================
// Ask (AI) + ukladanie do logs s type
// POST /ask { question, role, senior_id }
// =========================
app.post("/ask", async (req, res) => {
  try {
    const question = String(req.body?.question || "").trim();
    const role = String(req.body?.role || "senior").trim();
    const senior_id = String(req.body?.senior_id || "demo").trim();

    if (!question) return res.status(400).json({ error: "Missing question" });

    const type = classifyType(question);

    if (isMedicalHighRisk(question)) {
      const answer =
        "S týmto ti neviem bezpečne poradiť. Zavolaj lekárnika alebo lekára a povedz im presne, aké lieky užívaš.";
      await safeInsertLog({ senior_id, role, question, answer, type });
      return res.json({ answer, type });
    }

    const system = [
      "Si asistent pre seniorov. Odpovedáš po slovensky.",
      "Odpoveď max 3 vety. Jasne a jednoducho.",
      "Nedávaj konkrétne lekárske rady ani dávkovanie liekov.",
      "Ak je otázka zdravotná, odporuč overiť u lekárnika alebo lekára.",
    ].join(" ");

    const resp = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: system },
          { role: "user", content: question },
        ],
        temperature: 0.2,
        max_tokens: 180,
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("Mistral error:", resp.status, t);
      return res.status(502).json({ error: "AI service failed" });
    }

    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content || "";
    const answer = shorten(raw) || "Prepáč, neviem odpovedať.";

    await safeInsertLog({ senior_id, role, question, answer, type });
    return res.json({ answer, type });
  } catch (e) {
    console.error("Server error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

// =========================
// Azure Speech token
// =========================
app.get("/speech-token", async (req, res) => {
  try {
    if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
      return res.status(500).json({
        error: "Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION",
      });
    }

    const r = await fetch(
      `https://${AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: "POST",
        headers: { "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY },
      }
    );

    if (!r.ok) {
      const t = await r.text();
      return res
        .status(500)
        .json({ error: `Azure token error ${r.status}: ${t.slice(0, 200)}` });
    }

app.post("/tts", async (req, res) => {
  try {
    const text = String(req.body?.text || "").trim();
    if (!text) return res.status(400).json({ error: "Missing text" });

    const key = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION;
    if (!key || !region) {
      return res.status(500).json({ error: "Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION" });
    }

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, region);
    speechConfig.speechSynthesisLanguage = "sk-SK";
    speechConfig.speechSynthesisVoiceName = "sk-SK-ViktoriaNeural";
    speechConfig.speechSynthesisOutputFormat =
      SpeechSDK.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    // null = do pamäte (result.audioData)
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, null);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        try {
          if (result.reason !== SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
            const details = SpeechSDK.CancellationDetails.fromResult(result);
            return res.status(500).json({ error: details?.errorDetails || "TTS failed" });
          }

          const audioData = Buffer.from(result.audioData);
          res.setHeader("Content-Type", "audio/mpeg");
          res.setHeader("Cache-Control", "no-store");
          return res.status(200).send(audioData);
        } finally {
          result?.close?.();
          synthesizer.close();
        }
      },
      (err) => {
        synthesizer.close();
        return res.status(500).json({ error: String(err) });
      }
    );
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

    
    const token = await r.text();
    res.json({ token, region: AZURE_SPEECH_REGION });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// =========================
// Start
// =========================
const port = PORT || 3000;
app.listen(port, () => console.log(`Server running on :${port}`));

