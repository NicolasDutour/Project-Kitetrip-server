const express = require("express");
const router = express.Router();
const tripsCtrl = require("../../controllers/tripsCtrl");
const auth = require("../../middleware/auth");
const { check } = require("express-validator");

router.get("/all", tripsCtrl.allTrips);

router.post(
  "/new",
  auth,
  [
    check("departureCity", "Ville de départ requis")
      .not()
      .isEmpty(),
    check("destinationCity", "Destination requise")
      .not()
      .isEmpty(),
    check("departureDate")
      .not()
      .isEmpty()
      .withMessage("Date de départ requise")
      .isAfter()
      .withMessage("Date de départ doit être après aujourd'hui")
  ],
  tripsCtrl.createTrip
);

router.get("/:id", tripsCtrl.getOneTrip);

router.post("/comment/:id", auth, tripsCtrl.createComment);

router.delete("/comment/:id/:comment_id", auth, tripsCtrl.deleteComment);

router.post("/passenger/:id", auth, tripsCtrl.addPassenger);

router.get(
  "/search/:departureDate/:departureCity",
  [
    check("departureCity", "Ville de départ requis")
      .not()
      .isEmpty(),
    check("departureDate")
      .not()
      .isEmpty()
      .withMessage("Date de départ requise")
      .isAfter()
      .withMessage("Date de départ doit être après aujourd'hui")
  ],
  tripsCtrl.searchTrip
);

module.exports = router;
