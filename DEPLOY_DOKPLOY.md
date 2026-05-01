# Deploy to Dokploy (VPS)

This project is ready for Dokploy using the included `Dockerfile`.

## 1. Push Project to GitHub

1. Create a new repository.
2. Push this project.

## 2. Create App in Dokploy

1. Open Dokploy dashboard.
2. Click **Create Application**.
3. Select **Git Repository**.
4. Connect your repository.

## 3. Build Settings

Use these values:

- Build type: `Dockerfile`
- Dockerfile path: `./Dockerfile`
- Context path: `.`
- Port: `3000`

## 4. Required Environment Variables

Set these in Dokploy app environment settings:

- `CONTACT_WEBHOOK_URL` = your webhook destination URL
- `RECAPTCHA_SITE_KEY` = Google reCAPTCHA site key
- `RECAPTCHA_SECRET_KEY` = Google reCAPTCHA secret key
- `PORT` = `3000`

## 5. Domain + HTTPS

1. Attach your domain in Dokploy.
2. Enable SSL/TLS (Let's Encrypt).
3. Point your DNS `A` record to your VPS public IP.

## 6. Verify

- Open your domain.
- Refresh routes directly (for example `/projects`) and confirm the SPA fallback works.
- Submit a test contact form and verify the webhook receives a message.

## Local Docker Test

```bash
docker build -t portfolio-2 .
docker run --rm -p 8080:3000 \
	-e CONTACT_WEBHOOK_URL="https://your-webhook-endpoint" \
	-e RECAPTCHA_SITE_KEY="your_recaptcha_site_key" \
	-e RECAPTCHA_SECRET_KEY="your_recaptcha_secret_key" \
	portfolio-2
```

Open `http://localhost:8080`.
