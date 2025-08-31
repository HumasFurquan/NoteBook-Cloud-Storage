const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function fetchuser(req, res, next) {
  const token = req.header('auth-token');
  if(!token) return res.status(401).send({ error: "Auth token missing" });
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    res.status(401).send({ error: "Invalid token" });
  }
}
