const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/usersCtrl");
const { check } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

// Get Current User
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ err });
  }
});

// Signup
router.post(
  "/signup",
  [
    check("firstName", "Prénom requis")
      .not()
      .isEmpty(),
    check("lastName", "Nom requis")
      .not()
      .isEmpty(),
    check("email", "Entrez une adresse email valide")
      .isEmail()
      .normalizeEmail(),
    check("password")
      .not()
      .isIn(["123456", "000000", "password", "motdepasse"])
      .withMessage("N'utilisez pas de mots trop communs")
      .isLength({ min: 6 })
      .withMessage("Le mot de passe doit contenir au moins 6 caractères")
      .matches(/\d/)
      .withMessage("Le mot de passe doit au moins contenir 1 chiffre")
  ],
  usersCtrl.signup
);

// Login
router.post(
  "/login",
  [
    check("email", "Entrez une adresse email valide")
      .isEmail()
      .normalizeEmail(),
    check("password", "Le mot de passe est requis").exists()
  ],
  usersCtrl.login
);

module.exports = router;
