# senior-ai-mvp

## Local development

### Frontend (Next.js)
```bash
cd web
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
```
The UI will be available at `http://localhost:3000/`.

Create `web/.env.local` and point the frontend at your backend (Render or local):

```
NEXT_PUBLIC_API_URL=https://senior-ai-server.onrender.com
```

With the Azure Speech key/region set on the backend, the senior screen will:
- fetch a speech token from `/speech-token`
- record one utterance from the microphone (STT)
- call `/ask`
- speak the answer back (TTS) with a simple mouth-flap animation on the avatar.

### Backend (Express)
```bash
cd server
npm install
PORT=4000 node index.js
```
Environment variables required for the backend:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MISTRAL_API_KEY`
- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`
- `ALLOWED_ORIGINS` (optional, comma-separated list)

Running the backend on `PORT=4000` avoids clashing with the frontend dev server.

## Deploying the backend to Render

The Render service only needs the `server` folder. Create a **Web Service** that points to this repo and set:

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Runtime:** Node 20

Environment variables required (you mentioned they are already present):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MISTRAL_API_KEY`
- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`
- `ALLOWED_ORIGINS` (comma-separated, e.g. your Vercel URL and local dev URL)

After deploy, verify the service is reachable with a Render shell or curl:

```bash
curl -sSf https://<your-render-service>.onrender.com/health
```

If you get `{ "ok": true }`, the backend and credentials are loaded correctly. The current Render deployment responds at `https://senior-ai-server.onrender.com/health` with `{"ok":true}`; update `ALLOWED_ORIGINS` to include any frontend hosts that need to call it.
