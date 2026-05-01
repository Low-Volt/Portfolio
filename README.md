# Elijah Richter — Portfolio 2.0

Personal portfolio site built with React, Vite, and Tailwind CSS. Features a persistent light/night theme with a mint accent colour, animated background effects, a secure contact form backed by Google reCAPTCHA, and a Dockerised deployment pipeline ready for Dokploy.

**Live:** [low-voltage.xyz](https://low-voltage.xyz)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Styling | PostCSS, Autoprefixer, Space Grotesk / Manrope fonts |
| Backend | Node.js, Express 4, Helmet, express-rate-limit, Zod |
| CAPTCHA | Google reCAPTCHA v2 (server-side verified) |
| Notifications | Discord webhook |
| Deployment | Docker (multi-stage), Dokploy, VPS |

---

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in the three required values:

```
PORT=3000
RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
CONTACT_WEBHOOK_URL=your_discord_or_webhook_url
```

### 3. Start development servers

Run each in its own terminal:

```bash
# API server (port 3000)
npm run dev:api

# Vite dev server (port 5173)
npm run dev
```

The frontend proxies `/api` requests to the Express server automatically.

---

## Building for Production

```bash
npm run build   # outputs to dist/
npm run start   # serves dist/ via Express on port 3000
```

---

## Deploying with Dokploy

1. Push this repository to GitHub.
2. In Dokploy: **New App → Dockerfile** — set build path to `./Dockerfile`, port `3000`.
3. Add environment variables in the Dokploy dashboard:
   - `CONTACT_WEBHOOK_URL`
   - `RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_SECRET_KEY`
   - `PORT=3000`
4. Attach your domain and enable SSL.

---

## Contact Form Security

- Rate limited to 8 submissions per 15 minutes per IP
- Google reCAPTCHA token verified server-side (secret key never exposed to browser)
- Zod schema validates all fields before processing
- Honeypot field silently discards bot submissions
- Helmet sets strict Content Security Policy headers

---

## License

MIT — feel free to use this as a reference or starting point.

