const express = require("express");
const router = express.Router();

const overallStatsController = require("../controllers/overallStatsController");

router.get("/", overallStatsController.overall_stats_get);
router.get("/:id", overallStatsController.overall_stats_get_detail);
// router.post("/", overallStatsController.overall_stats_create);
// router.put("/:id", overallStatsController.overall_stats_update);
// router.delete("/:id", overallStatsController.overall_stats_delete);

module.exports = router;
