const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  status: { type: String, enum: ["Active", "Blocked"], default: "Active" },
  interests: [String],
  budgetPreference: { type: String, default: "" },
  travelStyle: { type: String, default: "Standard" },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "TouristPlace" }],
  favoriteDestinations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Destination" }],
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("User", userSchema);
