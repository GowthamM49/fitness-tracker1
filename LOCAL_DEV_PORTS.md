# Local development ports

These ports are used **together** for this project (change them here and in `.env` if you need different values).

| Service   | Port | URL                         |
|----------|------|-----------------------------|
| Frontend | **3010** | http://localhost:3010   |
| Backend  | **5010** | http://localhost:5010   |

**Rules**

1. Frontend `PORT` and backend `PORT` must **never** be the same.
2. `frontend/.env` → `REACT_APP_API_URL` must match the backend, e.g. `http://localhost:5010/api`.
3. `backend/.env` → `FRONTEND_URL` must match the React dev server, e.g. `http://localhost:3010`.

After changing ports, restart **both** `npm run dev` (backend) and `npm start` (frontend).

---

## AI Fitness Coach (`/coach`)

- Uses your **MongoDB** workouts & meals (last 7 days) + **profile** from the User model.
- **Recommended:** set **`OPENROUTER_API_KEY`** in `backend/.env` (OpenRouter + **`deepseek/deepseek-chat`** by default). See `backend/env.example`.
- **Fallback:** `OPENAI_API_KEY` for direct OpenAI if OpenRouter is not set.
- Without any key, the coach uses **built-in short tips** (same chat UI).
