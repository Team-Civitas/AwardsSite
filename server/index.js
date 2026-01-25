import express from "express"
import dotenv from "dotenv"
import session from "express-session"
import cors from "cors"
import fs from "fs"
import path from "path"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || "development"
const IS_PROD = NODE_ENV === "production"

// Viktigt bakom Nginx / proxy
app.set("trust proxy", 1)

/**
 * --------------------
 * Session configuration
 * --------------------
 */
app.use(
  session({
    name: "civitas.sid",
    secret: process.env.SESSION_SECRET || "dev-secret-change-later",
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: IS_PROD,             // true endast i production (HTTPS)
      sameSite: IS_PROD ? "lax" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 dagar
    }
  })
)

/**
 * --------------------
 * CORS configuration
 * --------------------
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://awards.teamcivitas.net"
]

app.use(
  cors({
    origin(origin, callback) {
      // Tillåt requests utan origin (curl, server-to-server)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      console.warn("❌ Blocked CORS origin:", origin)
      return callback(new Error("Not allowed by CORS"))
    },
    credentials: true
  })
)

/**
 * --------------------
 * User storage (JSON)
 * --------------------
 */
const USERS_FILE = path.resolve("data/users.json")

function loadUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return {}
    }

    const raw = fs.readFileSync(USERS_FILE, "utf8")
    if (!raw.trim()) return {}

    return JSON.parse(raw)
  } catch (err) {
    console.error("❌ Failed to load users.json:", err)
    return {}
  }
}

/**
 * --------------------
 * Discord OAuth config
 * --------------------
 */
const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI,
  FRONTEND_URL
} = process.env

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI) {
  console.error("❌ Missing Discord env variables")
  process.exit(1)
}

/**
 * Step 1 — Redirect user to Discord OAuth
 */
app.get("/auth/discord", (req, res) => {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify"
  })

  const discordAuthUrl =
    `https://discord.com/api/oauth2/authorize?${params.toString()}`

  res.redirect(discordAuthUrl)
})

/**
 * Step 2 — Discord redirects back with ?code=
 */
app.get("/auth/discord/callback", async (req, res) => {
  const code = req.query.code

  if (!code) {
    return res.status(400).send("❌ No code provided")
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://discord.com/api/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: DISCORD_REDIRECT_URI
        })
      }
    )

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      console.error("❌ Token error:", tokenData)
      return res.status(500).send("Failed to get access token")
    }

    // Fetch user info
    const userResponse = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    const user = await userResponse.json()

    const users = loadUsers()
    const storedUser = users[user.id]

    req.session.user = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      badges: storedUser?.badges || []
    }

    console.log("✅ Logged in:", user.username)

    res.redirect(FRONTEND_URL || "/")
  } catch (err) {
    console.error("❌ OAuth error:", err)
    res.status(500).send("OAuth error")
  }
})

/**
 * --------------------
 * API
 * --------------------
 */
app.get("/api/me", (req, res) => {
  res.json(req.session.user || null)
})

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.sendStatus(200)
  })
})

/**
 * --------------------
 * Start server
 * --------------------
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${NODE_ENV})`)
})