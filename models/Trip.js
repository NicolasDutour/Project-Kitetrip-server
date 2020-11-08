const mongoose = require("mongoose");

const tripSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  driver: { type: String },
  carBrand: { type: String },
  carColor: { type: String },
  carPlateNumber: { type: String },
  totalPlaces: { type: Number },
  description: { type: String },
  departureCity: { type: String, required: true, lowercase: true },
  destinationCity: { type: String, required: true, lowercase: true },
  departureDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  passengers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      kiter: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      text: { type: String, required: true },
      kiter: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Trip", tripSchema);
