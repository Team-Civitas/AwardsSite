import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import cors from "cors";
import "./db.js";
import db from "./db.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";

// Viktigt bakom Nginx / proxy
app.set("trust proxy", 1);

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
      secure: IS_PROD,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 dagar
    }
  })
);

/**
 * --------------------
 * CORS configuration
 * --------------------
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://awards.teamcivitas.net"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn("? Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(express.json());

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
} = process.env;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI) {
  console.error("? Missing Discord env variables");
  process.exit(1);
}

/**
 * --------------------
 * OAuth: redirect to Discord
 * --------------------
 */
app.get("/auth/discord", (req, res) => {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify"
  });

  res.redirect(
    `https://discord.com/api/oauth2/authorize?${params.toString()}`
  );
});

/**
 * --------------------
 * OAuth: callback
 * --------------------
 */
app.get("/auth/discord/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("? No code provided");

  try {
    const tokenResponse = await fetch(
      "https://discord.com/api/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: DISCORD_REDIRECT_URI
        })
      }
    );

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error("? Token error:", tokenData);
      return res.status(500).send("Failed to get access token");
    }

    const userResponse = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const user = await userResponse.json();

    // Ensure user exists
    db.prepare(`
  INSERT INTO users (id, name, avatar)
  VALUES (?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    avatar = excluded.avatar
`).run(user.id, user.username, user.avatar);


    // Fetch badges live from DB
    const badges = db.prepare(`
      SELECT b.id
      FROM user_badges ub
      JOIN badges b ON b.id = ub.badge_id
      WHERE ub.user_id = ?
    `).all(user.id).map(r => r.id);

    req.session.user = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      badges
    };

    console.log("? Logged in:", user.username);
    res.redirect(FRONTEND_URL || "/");
  } catch (err) {
    console.error("? OAuth error:", err);
    res.status(500).send("OAuth error");
  }
});

/**
 * --------------------
 * API
 * --------------------
 */
app.get("/api/me", (req, res) => {
  if (!req.session.user) {
    return res.json(null);
  }

  const badges = db.prepare(`
    SELECT b.id
    FROM user_badges ub
    JOIN badges b ON b.id = ub.badge_id
    WHERE ub.user_id = ?
  `).all(req.session.user.id).map(r => r.id);

  res.json({
    ...req.session.user,
    badges
  });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.sendStatus(200);
  });
});

app.use("/api/admin", adminRoutes);

/**
 * --------------------
 * Start server
 * --------------------
 */
app.listen(PORT, () => {
  console.log(`?? Server running on port ${PORT} (${NODE_ENV})`);
});
