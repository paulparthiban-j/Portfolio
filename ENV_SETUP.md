# Environment Variables Setup

Create a `.env.local` file in the root directory. Portfolio content itself is **not** configured via environment variables - it lives in [data/portfolio.json](data/portfolio.json), managed through the admin dashboard at `/admin`.

## Variables

```env
# Admin authentication (required for a real deployment - see warning below)
ADMIN_PASSWORD=change-me-to-a-strong-password
ADMIN_TOKEN=change-me-to-a-long-random-string

# Optional: port used by `npm run dev` / `npm start` (scripts/start-dev.js, scripts/start-prod.js)
PORT=3006
```

## ADMIN_PASSWORD / ADMIN_TOKEN

These protect `/admin` and every `/api/admin/*` route (portfolio edits, resume upload, resume sync).

- `ADMIN_PASSWORD` is the login password. **If unset, it defaults to `admin123`.**
- `ADMIN_TOKEN` is the value stored in the `admin_token` session cookie after login. **If unset, it defaults to `super-secret-admin`.**

**Both must be set to real secret values before deploying anywhere reachable by the public.** The defaults are intentionally weak placeholders for local development only; leaving them unset in production means anyone can log into the admin dashboard and edit or replace all site content.

## Notes

- `NEXT_PUBLIC_PORTFOLIO_*` variables from earlier versions of this doc are no longer used by any code in this repo - portfolio content is read from `data/portfolio.json` via `lib/portfolio.ts`, not from env vars.
- Test-only env vars used by the Playwright suite (`ADMIN_PASSWORD`/`ADMIN_TOKEN` fixed test values) are set in `playwright.config.ts`, not `.env.local`.
