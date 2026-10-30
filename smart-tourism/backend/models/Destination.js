const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: "Nature" },
  image: { type: String, default: "" },
  gallery: [String],
  bestTime: { type: String, default: "" },
  season: { type: String, enum: ["Winter", "Summer", "Monsoon", "All Year"], default: "All Year" },
  rating: { type: Number, default: 4, min: 0, max: 5 },
  avgBudget: { type: Number, default: 10000 },
  travelStyle: { type: String, enum: ["Budget", "Standard", "Luxury"], default: "Standard" },
  popularity: { type: Number, default: 50 },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Destination", schema);
