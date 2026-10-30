const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
  description: { type: String, default: "" },
  priceRange: { type: String, default: "" },
  rating: { type: Number, default: 4, min: 0, max: 5 },
  contact: { type: String, default: "" },
  address: { type: String, default: "" },
  image: { type: String, default: "" },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});
module.exports = mongoose.model("Hotel", schema);
