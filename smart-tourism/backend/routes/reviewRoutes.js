const router = require("express").Router();
const Review = require("../models/Review");
const c = require("../controllers/crud")(Review, { populate: "user touristPlace", filterKeys: ["user", "status"], label: "Review" });

router.post("/", async (req, res) => {
  const { user, touristPlace, rating, comment } = req.body;
  if (!user || !touristPlace || !rating || !comment) return res.status(400).json({ message: "Please fill all required fields" });
  return c.create(req, res);
});
router.get("/place/:placeId", async (req, res) => {
  try {
    const reviews = await Review.find({ touristPlace: req.params.placeId, status: "Approved" }).populate("user", "name").sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get("/", c.getAll); // all reviews (admin) or ?user=ID
router.put("/:id", c.update);
router.delete("/:id", c.remove);
module.exports = router;
