import express from "express";
import db from "../db.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

/**
 * GET /api/admin/users
 * Returnerar alla users + deras badges
 */
router.get("/users", adminOnly, (req, res) => {
  const users = db.prepare(`
    SELECT id, name, avatar
    FROM users
    ORDER BY name COLLATE NOCASE
  `).all();

  const getBadgesForUser = db.prepare(`
    SELECT badge_id
    FROM user_badges
    WHERE user_id = ?
  `);

  const result = users.map(user => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    badges: getBadgesForUser
      .all(user.id)
      .map(row => row.badge_id)
  }));

  res.json(result);
});

/**
 * POST /api/admin/grant-badge
 * Body: { userId, badgeId }
 */
router.post("/grant-badge", adminOnly, (req, res) => {
  const { userId, badgeId } = req.body;

  if (!userId || !badgeId) {
    return res.status(400).json({ error: "Missing userId or badgeId" });
  }

  // Finns user?
  const userExists = db.prepare(
    "SELECT 1 FROM users WHERE id = ?"
  ).get(userId);

  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }

  // Finns badge?
  const badgeExists = db.prepare(
    "SELECT 1 FROM badges WHERE id = ?"
  ).get(badgeId);

  if (!badgeExists) {
    return res.status(404).json({ error: "Badge not found" });
  }

  // Ge badge (ignorerar om den redan finns)
  db.prepare(`
    INSERT OR IGNORE INTO user_badges (user_id, badge_id, granted_at)
    VALUES (?, ?, ?)
  `).run(userId, badgeId, Date.now());

  res.json({ success: true });
});

/**
 * POST /api/admin/revoke-badge
 * Body: { userId, badgeId }
 */
router.post("/revoke-badge", adminOnly, (req, res) => {
  const { userId, badgeId } = req.body;

  if (!userId || !badgeId) {
    return res.status(400).json({ error: "Missing userId or badgeId" });
  }

  db.prepare(`
    DELETE FROM user_badges
    WHERE user_id = ? AND badge_id = ?
  `).run(userId, badgeId);

  res.json({ success: true });
});

/**
 * GET /api/admin/badges
 * Returnerar alla badges
 */
router.get("/badges", adminOnly, (req, res) => {
  const badges = db.prepare(`
    SELECT id, name, rarity
    FROM badges
    ORDER BY id
  `).all();

  res.json(badges);
});

export default router;
