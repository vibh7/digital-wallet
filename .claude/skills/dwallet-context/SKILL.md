---
name: dwallet-context
description: Quick orientation for the dWallet project. Use when starting a new task in this repo — loads the API map, stack, paths, and conventions without re-scanning files.
---

# dWallet context

Spring Boot backend (`dWallet/`) + React/Vite frontend (`dwallet-frontend/`). Root memory lives in `CLAUDE.md` — read it first.

## Fast map
- Auth: `controller/AuthController.java` → `/api/auth/{register,login}` (query-param form).
- Wallet ops: `controller/WalletController.java` → `/api/wallet/{balance,transactions,deposit,withdraw,transfer}`.
- User: `controller/UserController.java` → `/api/user/me`.
- JWT filter: `config/JwtRequestFilter.java`. Permit list: `config/SecurityConfig.java`.
- CORS: `config/WebConfig.java` (uses `allowedOriginPatterns` so `allowCredentials(true)` + wildcards work).
- Frontend HTTP: always via `dwallet-frontend/src/api.js` (normalizes `VITE_API_BASE_URL`, injects JWT).

## Debugging recipe (auth fails in prod, works locally)
1. Inspect Vercel env `VITE_API_BASE_URL` — `src/api.js` handles trailing `/api` either way, but the host must be correct.
2. Check browser Network tab for CORS preflight failures → update `WebConfig.allowedOriginPatterns`.
3. Check DO app logs for `DB_URL` / `DB_USER` / `DB_PASS` connection errors.
4. `JwtRequestFilter` logs `Authorization header:` — if empty, frontend isn't attaching token; if malformed, token truncated.

## Do
- Add new HTTP calls with `api.post("/wallet/foo", body)` — never `axios.post(import.meta.env.VITE_API_BASE_URL + "/...")`.
- Add new controllers under `/api/...` and permit in `SecurityConfig` if public.

## Don't
- Don't hardcode `localhost:8080` anywhere.
- Don't stack `/api/api/...` — the shared helper prevents it.
- Don't add new axios imports in components; import `api` from `../api`.
