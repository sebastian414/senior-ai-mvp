import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const VOICE = "sk-SK-FilipNeural";
const LANGUAGE = "sk-SK";

export async function fetchSpeechToken(apiBase = "") {
  const res = await fetch(`${apiBase}/speech-token`, { cache: "no-store" });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Speech token error ${res.status}: ${txt}`);
  }
  const data = await res.json();
  if (!data?.token || !data?.region) throw new Error("Invalid speech token payload");
  return data;
}

export function buildSpeechClients(token, region) {
  const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);
  speechConfig.speechRecognitionLanguage = LANGUAGE;
  speechConfig.speechSynthesisLanguage = LANGUAGE;
  speechConfig.speechSynthesisVoiceName = VOICE;

  const recognizer = new SpeechSDK.SpeechRecognizer(
    speechConfig,
    SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()
  );

  const synthesizer = new SpeechSDK.SpeechSynthesizer(
    speechConfig,
    SpeechSDK.AudioConfig.fromDefaultSpeakerOutput()
  );

  return { recognizer, synthesizer };
}

export function recognizeOnce(recognizer) {
  return new Promise((resolve, reject) => {
    if (!recognizer) return reject(new Error("Recognizer not ready"));

    recognizer.recognizeOnceAsync(
      result => {
        resolve((result?.text || "").trim());
      },
      err => {
        reject(new Error(String(err)));
      }
    );
  });
}

export function speakText(synthesizer, text) {
  return new Promise((resolve, reject) => {
    if (!text) return resolve();
    if (!synthesizer) return reject(new Error("Synthesizer not ready"));

    synthesizer.speakTextAsync(
      text,
      result => resolve(result),
      err => reject(new Error(String(err)))
    );
  });
}
