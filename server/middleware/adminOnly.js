export default function adminOnly(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  if (req.session.user.id !== process.env.ADMIN_DISCORD_ID) {
    return res.status(403).json({ error: "Not admin" });
  }

  next();
}
