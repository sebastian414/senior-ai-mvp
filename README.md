# senior-ai-mvp

## Local development

### Frontend (Next.js)
```bash
cd web
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
```
The UI will be available at `http://localhost:3000/`.

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
