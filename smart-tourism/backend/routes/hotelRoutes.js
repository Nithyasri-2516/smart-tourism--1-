const router = require("express").Router();
const c = require("../controllers/crud")(require("../models/Hotel"), { populate: "destination", sort: { rating: -1 }, filterKeys: ["destination"], label: "Hotel" });
router.get("/", c.getAll);
router.get("/:id", c.getOne);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.remove);
module.exports = router;
