const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { jwtSecret } = require("../config/default");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      res
        .status(400)
        .json({ errors: [{ msg: "Cet utilisateur existe déjà" }] });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password
    });

    const salt = await bcrypt.genSaltSync(10);
    user.password = await bcrypt.hashSync(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ err });
  }
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        errors: [{ msg: "L'utilisateur ou le mot de passe est incorrect" }]
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(400).json({
        errors: [{ msg: "L'utilisateur ou le mot de passe est incorrect" }]
      });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ err });
  }
};

module.exports = {
  signup,
  login
};
