const jwt = require("jsonwebtoken");
const secretKey = require("../config/secretKey");

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey.secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Authentication failed", error: err.message });
  }
}

module.exports = verifyToken;