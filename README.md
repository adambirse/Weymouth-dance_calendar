# Weymouth Dance Calendar

A searchable version of the Weymouth dance festival programme, built with Next.js and protected by Google sign-in (Auth.js). Only allowlisted emails can sign in: those in `ALLOWED_EMAILS` or `ADMIN_EMAILS`, plus any added by an admin at `/admin`.

## Environment variables

See `.env.example`. Set these in Vercel (Project → Settings → Environment Variables):

- `AUTH_SECRET`: random string (`npx auth secret`)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`: Google OAuth client
- `ADMIN_EMAILS`: comma-separated emails that can manage users at `/admin`
- `ALLOWED_EMAILS`: comma-separated allowlist (more users can be added at `/admin`)
- `KV_REST_API_URL` / `KV_REST_API_TOKEN`: added automatically when an Upstash Redis store is connected in Vercel (Storage tab). Users added at `/admin` are stored there.

The Google OAuth client needs the redirect URI `https://<your-domain>/api/auth/callback/google`.

## Local development

```bash
npm install
cp .env.example .env.local  # fill in values
npm run dev
```

## Programme data

The programme is transcribed from photos of the paper programme into `src/data/programme-source.txt` (one `EVENT|HH:MM|Title` line per class followed by its entries). Regenerate the JSON after editing it:

```bash
python3 scripts/convert-programme.py src/data/programme-source.txt src/data/programme.json
```
