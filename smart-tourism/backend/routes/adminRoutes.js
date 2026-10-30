const router = require("express").Router();
const c = require("../controllers/adminController");
router.get("/stats", c.stats);
router.get("/analytics", c.analytics);
module.exports = router;
