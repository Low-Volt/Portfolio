import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "connect-src": ["'self'"],
        "script-src": ["'self'", "https://challenges.cloudflare.com"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "img-src": ["'self'", "data:", "https:"],
        "frame-src": ["'self'", "https://challenges.cloudflare.com"]
      }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(express.json({ limit: "20kb" }));

const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." }
});

const payloadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(10).max(1500),
  captchaToken: z.string().trim().min(1),
  company: z.string().trim().max(120).optional().default("")
});

app.get("/api/contact-config", (_req, res) => {
  const siteKey = process.env.TURNSTILE_SITE_KEY || "";
  res.json({ turnstileSiteKey: siteKey });
});

app.post("/api/contact", contactRateLimit, async (req, res) => {
  const parsed = payloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid form payload." });
  }

  const { name, email, message, captchaToken, company } = parsed.data;
  if (company) {
    return res.status(200).json({ ok: true });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (!turnstileSecret || !webhookUrl) {
    return res.status(500).json({ error: "Server contact configuration is incomplete." });
  }

  const verificationBody = new URLSearchParams({
    secret: turnstileSecret,
    response: captchaToken,
    remoteip: req.ip
  });

  try {
    const captchaRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: verificationBody
    });

    const captchaJson = await captchaRes.json();
    if (!captchaJson.success) {
      return res.status(400).json({ error: "Captcha verification failed." });
    }

    const sentAt = new Date().toISOString();
    const hookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: "Portfolio Contact",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/561/561127.png",
        embeds: [
          {
            title: "📬 New Portfolio Message",
            color: 0x2fd4a9,
            fields: [
              { name: "Name",    value: name,    inline: true  },
              { name: "Email",   value: email,   inline: true  },
              { name: "Message", value: message, inline: false }
            ],
            footer: { text: `Sent at ${sentAt}` }
          }
        ]
      })
    });

    if (!hookRes.ok) {
      return res.status(502).json({ error: "Could not deliver message." });
    }

    return res.status(200).json({ ok: true });
  } catch (_error) {
    return res.status(500).json({ error: "Unexpected server error." });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "..", "dist");

app.use(express.static(distPath));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "Not found." });
  }

  return res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Portfolio server listening on port ${port}`);
});
