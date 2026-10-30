const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
  location: { type: String, default: "" },
  description: { type: String, required: true },
  category: { type: String, default: "Nature" },
  image: { type: String, default: "" },
  gallery: [String],
  rating: { type: Number, default: 4, min: 0, max: 5 },
  entryFee: { type: Number, default: 0 },
  estimatedCost: { type: Number, default: 500 },
  openingHours: { type: String, default: "9:00 AM - 6:00 PM" },
  bestTime: { type: String, default: "" },
  duration: { type: String, default: "2 hours" },
  tags: [String],
  nearby: [String],
});
module.exports = mongoose.model("TouristPlace", schema);
