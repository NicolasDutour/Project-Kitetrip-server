const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/default");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "Aucun token, accès non autorisé" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Identification non valide" });
  }
};
