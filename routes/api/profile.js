const express = require("express");
const router = express.Router();
const profileCtrl = require("../../controllers/profileCtrl");
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const multer = require("multer");

const upload = multer({
  dest: "avatars",
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, callback) {
    const regExp = /\.(jpg|jpeg|png)$/;
    if (!file.originalname.match(regExp)) {
      return callback(new Error("File must be jpg or jpeg or png"));
    }
    callback(undefined, true);
  }
});

router.get("/me", auth, profileCtrl.authenticatedProfile);
router.post(
  "/new",
  auth,
  [
    check("gender", "Genre requis")
      .not()
      .isEmpty(),
    check("mobilePhone", "Téléphone requis")
      .not()
      .isEmpty(),
    check("streetAddress", "Nom de rue requis")
      .not()
      .isEmpty(),
    check("postalCode", "Code Postal requis")
      .not()
      .isEmpty(),
    check("city", "Ville requise")
      .not()
      .isEmpty(),
    check("carBrand", "Marque de voiture requise")
      .not()
      .isEmpty(),
    check("carColor", "Couleur de voiture requise")
      .not()
      .isEmpty(),
    check("totalPlaces", "Nombre de places total requis")
      .not()
      .isEmpty()
  ],
  profileCtrl.createAndUpdateProfile
);
router.get("/all", profileCtrl.allProfiles);
router.get("/:user_id", profileCtrl.userProfile);
router.delete("/", auth, profileCtrl.deleteUserWithProfile);
router.post("/me/avatar", upload.single("avatar"), (req, res) => {
  res.send();
});

module.exports = router;
