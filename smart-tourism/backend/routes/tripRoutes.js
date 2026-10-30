const router = require("express").Router();
const Trip = require("../models/Trip");
const TouristPlace = require("../models/TouristPlace");
const { generateItinerary } = require("../utils/itinerary");
const c = require("../controllers/crud")(Trip, { populate: "user destination places", sort: { startDate: -1 }, filterKeys: ["user", "status"], label: "Trip" });

const daysBetween = (a, b) => Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000) + 1);

// Generate (without saving) an itinerary from place ids
router.post("/itinerary", async (req, res) => {
  try {
    const { placeIds = [], startDate, endDate } = req.body;
    const places = await TouristPlace.find({ _id: { $in: placeIds } });
    const ordered = placeIds.map((id) => places.find((p) => String(p._id) === String(id))).filter(Boolean);
    res.status(200).json(generateItinerary(ordered, daysBetween(startDate, endDate)));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/", c.getAll);
router.get("/:id", c.getOne);
router.post("/", async (req, res) => {
  try {
    const { user, tripName, destination, startDate, endDate } = req.body;
    if (!user || !tripName || !destination || !startDate || !endDate) return res.status(400).json({ message: "Please fill all required fields" });
    if (new Date(endDate) < new Date(startDate)) return res.status(400).json({ message: "End date cannot be before start date" });
    if (!req.body.itinerary || !req.body.itinerary.length) {
      const ids = req.body.places || [];
      const found = await TouristPlace.find({ _id: { $in: ids } });
      const ordered = ids.map((id) => found.find((p) => String(p._id) === String(id))).filter(Boolean);
      req.body.itinerary = generateItinerary(ordered, daysBetween(startDate, endDate));
    }
    return c.create(req, res);
  } catch (e) { res.status(500).json({ message: e.message }); }
});
router.put("/:id", c.update);
router.delete("/:id", c.remove);
module.exports = router;
