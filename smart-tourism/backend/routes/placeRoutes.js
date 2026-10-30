const router = require("express").Router();
const TouristPlace = require("../models/TouristPlace");
const { recommend } = require("../utils/recommender");
const c = require("../controllers/crud")(TouristPlace, { populate: "destination", sort: { rating: -1 }, filterKeys: ["destination", "category"], label: "Tourist place" });

// Smart recommendations (rule-based). Must be before "/:id"
router.post("/recommend", async (req, res) => {
  try {
    const places = await TouristPlace.find().populate("destination");
    const limit = Number(req.body.limit) || 12;
    res.status(200).json(recommend(places, req.body, limit));
  } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get("/", c.getAll);
router.get("/:id", c.getOne);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.remove);
module.exports = router;
