const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  gender: { type: String, required: true },
  phone: { type: Number },
  mobilePhone: { type: String, required: true },
  dateOfBirth: { type: Date },
  description: { type: String },
  numberAddress: { type: Number },
  streetAddress: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  carBrand: { type: String, required: true },
  carColor: { type: String, required: true },
  totalPlaces: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Profile", profileSchema);
