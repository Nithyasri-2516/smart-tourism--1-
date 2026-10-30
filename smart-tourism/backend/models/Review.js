const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  touristPlace: { type: mongoose.Schema.Types.ObjectId, ref: "TouristPlace", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  status: { type: String, enum: ["Approved", "Pending", "Rejected"], default: "Approved" },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Review", schema);
