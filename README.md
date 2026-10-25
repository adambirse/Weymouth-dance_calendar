# Weymouth Dance Calendar

A searchable version of the Weymouth dance festival programme, built with Next.js and protected by Google sign-in (Auth.js). Only emails listed in `ALLOWED_EMAILS` can sign in.

## Environment variables

See `.env.example`. Set these in Vercel (Project → Settings → Environment Variables):

- `AUTH_SECRET`: random string (`npx auth secret`)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`: Google OAuth client
- `ALLOWED_EMAILS`: comma-separated allowlist

The Google OAuth client needs the redirect URI `https://<your-domain>/api/auth/callback/google`.

## Local development

```bash
npm install
cp .env.example .env.local  # fill in values
npm run dev
```
