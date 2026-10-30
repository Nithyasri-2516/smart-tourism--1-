const mongoose = require("mongoose");
const activitySchema = new mongoose.Schema({ id: String, time: String, title: String, note: String }, { _id: false });
const daySchema = new mongoose.Schema({ day: Number, activities: [activitySchema] }, { _id: false });
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tripName: { type: String, required: true, trim: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  travelers: { type: Number, default: 1, min: 1 },
  budget: { type: Number, default: 0 },
  places: [{ type: mongoose.Schema.Types.ObjectId, ref: "TouristPlace" }],
  itinerary: [daySchema],
  status: { type: String, enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"], default: "Upcoming" },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Trip", schema);
