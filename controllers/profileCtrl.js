const Profile = require("../models/Profile");
const User = require("../models/User");
const { validationResult } = require("express-validator");

const authenticatedProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", "firstName lastName", User);

    if (!profile) {
      res.status(400).json({ msg: "Ce profile n'existe pas" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err });
  }
};

const createAndUpdateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    gender,
    mobilePhone,
    description,
    numberAddress,
    streetAddress,
    postalCode,
    city,
    carBrand,
    carColor,
    totalPlaces
  } = req.body;

  const profileFields = {};
  profileFields.user = req.user.id;
  if (gender) profileFields.gender = gender;
  if (mobilePhone) profileFields.mobilePhone = mobilePhone;
  if (description) profileFields.description = description;
  if (numberAddress) profileFields.numberAddress = numberAddress;
  if (streetAddress) profileFields.streetAddress = streetAddress;
  if (postalCode) profileFields.postalCode = postalCode;
  if (carBrand) profileFields.carBrand = carBrand;
  if (carColor) profileFields.carColor = carColor;
  if (totalPlaces) profileFields.totalPlaces = totalPlaces;
  if (city) profileFields.city = city;

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err });
  }
};

const allProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find().populate(
      "user",
      "firstName lastName",
      User
    );

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err });
  }
};

const userProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", "firstName lastName", User);

    if (!profile)
      return res.status(400).json({ msg: "Ce profile n'existe pas" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      res.status(500).json({ msg: "Ce profile n'existe pas" });
    }
    res.status(500).json({ err });
  }
};

const deleteUserWithProfile = async (req, res, next) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "Utilisateur supprimé" });
  } catch (err) {}
};

module.exports = {
  authenticatedProfile,
  createAndUpdateProfile,
  allProfiles,
  userProfile,
  deleteUserWithProfile
};
