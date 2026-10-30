const router = require("express").Router();
const Destination = require("../models/Destination");
const TouristPlace = require("../models/TouristPlace");
const Hotel = require("../models/Hotel");
const c = require("../controllers/crud")(Destination, { sort: { popularity: -1 }, label: "Destination" });
router.get("/", c.getAll);
router.get("/:id", c.getOne);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", async (req, res) => {
  await TouristPlace.deleteMany({ destination: req.params.id });
  await Hotel.deleteMany({ destination: req.params.id });
  return c.remove(req, res);
});
module.exports = router;
