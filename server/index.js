import express from "express"
import fetch from "node-fetch"
import dotenv from "dotenv"
import session from "express-session"
import cors from "cors"

dotenv.config()

const app = express()

app.use(
    session({
        secret: "dev-secret-change-later",
        resave: false,
        saveUninitialized: false
    })
)

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
)

const {
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    DISCORD_REDIRECT_URI
} = process.env

// Debug safety check
if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
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
        return res.send("❌ No code provided")
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
            console.error(tokenData)
            return res.send("❌ Failed to get access token")
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

        req.session.user = user

        console.log("✅ Discord user:", user)

        // Skicka tillbaka användaren till frontend istället
        res.redirect("http://localhost:5173")

    } catch (err) {
        console.error(err)
        res.send("❌ OAuth error")
    }
})

app.get("/api/me", (req, res) => {
    res.json(req.session.user || null)
})

app.post("/api/logout", (req, res) => {
    req.session.destroy()
    res.sendStatus(200)
})

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000")
})