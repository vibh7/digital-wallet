# dWallet — Claude Project Memory

Concise project facts. Future sessions: read this first, skip re-scanning.

## Stack
- Backend: Spring Boot 3 (Java 21), Maven, JWT auth, JPA. Deployed on Render (free tier) via `dWallet/Dockerfile`; DB on Neon (free Postgres).
- Frontend: React 19 + Vite + Tailwind + Recharts + framer-motion, deployed on Vercel (`digital-wallet-psi.vercel.app`).
- DB: MySQL/Postgres (env-driven: `DB_URL`, `DB_USER`, `DB_PASS`).

## Key paths
- Backend controllers: `dWallet/src/main/java/com/vikas/dWallet/controller/` (`AuthController`, `WalletController`, `UserController`).
- Security: `dWallet/src/main/java/com/vikas/dWallet/config/` (`SecurityConfig`, `JwtRequestFilter`, `WebConfig`).
- JWT util: `dWallet/src/main/java/com/vikas/dWallet/util/JwtUtil.java`.
- Frontend components: `dwallet-frontend/src/components/`.
- Shared axios helper: `dwallet-frontend/src/api.js` — normalizes base URL, injects JWT.

## API map (all under `/api` prefix)
| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/register` | public (params: username, password) |
| POST | `/api/auth/login` | public (params: username, password) → returns JWT |
| GET | `/api/user/me` | bearer |
| GET | `/api/wallet/balance` | bearer |
| GET | `/api/wallet/transactions` | bearer |
| POST | `/api/wallet/deposit` | bearer (body: {amount}) |
| POST | `/api/wallet/withdraw` | bearer (body: {amount}) |
| POST | `/api/wallet/transfer` | bearer (body: {toUsername, amount}) |

## Env
- Frontend `.env` / Vercel env: `VITE_API_BASE_URL` — can be set with or without trailing `/api`; `src/api.js` normalizes it.
- Backend env (DO): `DB_URL`, `DB_USER`, `DB_PASS`, `PORT` (defaults 8080).

## Conventions
- All HTTP calls in frontend go through `api` from `src/api.js`. Never call `axios` directly; never hardcode base URLs.
- Backend controllers always live under `/api/*`. `SecurityConfig` permits `/api/auth/**` only; everything else requires JWT.
- CORS origins are declared in `WebConfig.java` using `allowedOriginPatterns` (supports wildcards with credentials).

## Known gotchas
- `VITE_API_BASE_URL` mismatch between localhost (`http://localhost:8080/api`) and prod (Vercel var must resolve to the DO backend, with or without `/api` — helper handles both).
- Hibernate `ddl-auto=update` — new columns auto-add, but existing rows will have NULL.
- JWT secret is hardcoded in `JwtUtil` (not env-driven). If rotated, all sessions invalidate.
