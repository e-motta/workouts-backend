const express = require("express");
const router = express.Router();

const sessionStatsController = require("../controllers/sessionStatsController");

router.get("/", sessionStatsController.session_stats_get);
router.get("/:id", sessionStatsController.session_stats_get_detail);
// router.post("/", sessionStatsController.exercise_stats_create);
// router.put("/:id", sessionStatsController.exercise_stats_update);
// router.delete("/:id", sessionStatsController.exercise_stats_delete);

module.exports = router;
