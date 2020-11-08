const User = require("../models/User");
const Trip = require("../models/Trip");
const Profile = require("../models/Profile");
const { validationResult } = require("express-validator");

const allTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find()
      .populate("user", "firstName lastName", User)
      .where("departureDate")
      .gt(Date.now())
      .sort("departureDate");

    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err });
  }
};

const createTrip = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    description,
    departureCity,
    destinationCity,
    departureDate
  } = req.body;

  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", "firstName lastName", User);

    const newTrip = new Trip({
      user: req.user.id,
      driver: profile.user.firstName,
      carBrand: profile.carBrand,
      carColor: profile.carColor,
      totalPlaces: profile.totalPlaces,
      description,
      departureCity,
      destinationCity,
      departureDate
    });

    const trip = await newTrip.save();
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err);
  }
};

const getOneTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404).json({ msg: "Ce trip n'existe pas" });
    }

    res.json(trip);
  } catch (err) {
    if (err.kind === ObjectId) {
      res.status(404).json({ msg: "Ce trip n'existe pas" });
    }
    res.status(500).json({ err });
  }
};

const addPassenger = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", "firstName lastName", User);
    const trip = await Trip.findById(req.params.id);

    const newPassenger = {
      user: req.user.id,
      kiter: profile.user.firstName
    };

    trip.passengers.unshift(newPassenger);

    await trip.save();
    res.json(trip.passengers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err);
  }
};

const createComment = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", "firstName lastName", User);
    const trip = await Trip.findById(req.params.id);

    const newComment = {
      user: req.user.id,
      kiter: profile.user.firstName,
      text: req.body.text
    };

    trip.comments.unshift(newComment);

    await trip.save();
    res.json(trip.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    const comment = trip.comments.find(
      comment => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Ce commentaire n'existe pas" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "Vous n'êtes pas autorisé à supprimer ce compte" });
    }

    const removeComment = trip.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    trip.comments.splice(removeComment, 1);

    await trip.save();

    res.json(trip.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err });
  }
};

const searchTrip = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { departureDate, departureCity } = req.params;

    const trips = await Trip.find({ departureCity, departureDate });

    if (!trips) {
      res.status(404).json({
        msg: `Il n'y a aucun trajet au départ de ${departureCity} le ${departureDate}`
      });
    }

    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err });
  }
};

module.exports = {
  allTrips,
  createTrip,
  getOneTrip,
  createComment,
  deleteComment,
  addPassenger,
  searchTrip
};
