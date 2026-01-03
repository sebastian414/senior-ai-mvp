import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json({ limit: "1mb" }));

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, MISTRAL_API_KEY, ALLOWED_ORIGINS } = process.env;

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
  .map(s => s.trim())
  .filter(Boolean);

function setCors(req, res) {
  const origin = req.headers.origin;
  if (!origin) return;
  const ok = allowList.length === 0 || allowList.includes(origin);
  if (!ok) return;

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

app.use((req, res, next) => {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

function isMedicalHighRisk(q) {
  const s = (q || "").toLowerCase();
  return (
    s.includes("dávkov") ||
    s.includes("kolko mg") ||
    s.includes("koľko mg") ||
    s.includes("koľko tablet") ||
    s.includes("predpis") ||
    s.includes("diagnóz") ||
    s.includes("kombinovať lieky") ||
    s.includes("zmeniť liek") ||
    s.includes("nahradiť liek")
  );
}

function shorten(text) {
  if (!text) return "";
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return parts.slice(0, 3).join(" ").trim();
}

async function safeInsertLog(row) {
  const { error } = await supabase.from("logs").insert(row);
  if (error) console.error("Supabase insert error:", error.message);
}

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/logs", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 20), 100);

    const { data, error } = await supabase
      .from("logs")
      .select("created_at, role, question, answer")
      .order("created_at", { ascending: false })
      .limit(limit);

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

app.post("/ask", async (req, res) => {
  try {
    const question = String(req.body?.question || "").trim();
    const role = String(req.body?.role || "senior").trim();
    const senior_id = String(req.body?.senior_id || "demo").trim();

    if (!question) return res.status(400).json({ error: "Missing question" });

    if (isMedicalHighRisk(question)) {
      const answer =
        "S týmto ti neviem bezpečne poradiť. Zavolaj lekárnika alebo lekára a povedz im presne, aké lieky užívaš.";
      await safeInsertLog({ senior_id, role, question, answer });
      return res.json({ answer });
    }

    const system = [
      "Si asistent pre seniorov. Odpovedáš po slovensky.",
      "Odpoveď max 3 vety. Jasne a jednoducho.",
      "Nedávaj konkrétne lekárske rady ani dávkovanie liekov.",
      "Ak je otázka zdravotná, odporuč overiť u lekárnika alebo lekára."
    ].join(" ");

    const resp = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: system },
          { role: "user", content: question }
        ],
        temperature: 0.2,
        max_tokens: 180
      })
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("Mistral error:", resp.status, t);
      return res.status(502).json({ error: "AI service failed" });
    }

    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content || "";
    const answer = shorten(raw) || "Prepáč, neviem odpovedať.";

    await safeInsertLog({ role, question, answer });
    return res.json({ answer });
  } catch (e) {
    console.error("Server error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on :${port}`));
