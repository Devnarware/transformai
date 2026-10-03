# TransformAI — One Source. Multiple Deliverables.
SIH26154 prototype: one source → ingestion → context/intent analysis → transformation → validation → multiple deliverables.

**Demo Mode — Local Transformation Engine.** With `AI_PROVIDER=mock` (default) outputs come from a deterministic, rule-based engine (keyword/sentence analysis plus per-format templates). It is not a live AI model.

## Stack
React + Vite (plain CSS) · Node/Express REST API · JSON-file store (dev fallback in `backend/src/store.js`) · optional Python FastAPI service.

## Structure
`frontend/` UI · `backend/src/{routes,controllers,middleware,store}.js`, `services/{ingestion,analyzer,pipeline,transformers}.js`, `services/ai/{provider,mockProvider}.js` · `ai-service/` FastAPI stub · `docker-compose.yml`

## Run locally (Node 20+)
```
cp .env.example backend/.env
npm install
npm run dev        # API :4000, UI http://localhost:5173
npm test           # engine test, no server needed
```
Optional AI service: `cd ai-service && pip install -r requirements.txt && cd .. && npm run ai` (not yet called by the backend).

## Docker
`docker compose up --build` → UI :5173, API :4000, AI service :8000.

## API
GET /api/health · GET /api/sample · GET /api/dashboard/stats · POST /api/content/upload (multipart `file`: PDF/DOCX/TXT, 10 MB) · POST /api/transform (202 + transformationId; poll GET /api/transformations/:id, status queued→processing→completed|failed) · GET/DELETE /api/transformations[/:id] · POST /api/transformations/:id/regenerate {type} · POST /api/transformations/:id/export {type, format: txt|json} · CRUD /api/templates · GET/PUT /api/settings

Outputs (ids): linkedin, twitter, advisory, summary, infographic, presentation, video.

## Connecting a real LLM
Add `backend/src/services/ai/<name>Provider.js` exporting `generate(type, analysis, settings, title)` that returns the same structured object as `transformers.js`, register it in `provider.js`, set `AI_PROVIDER=<name>` and keep keys in server env vars.

## Not implemented yet
MongoDB/Mongoose (JSON store used), Tailwind, image OCR and video transcript ingestion, output editing (button disabled), template edit UI (PUT API exists), Hindi translation, wiring the FastAPI service into the pipeline.
