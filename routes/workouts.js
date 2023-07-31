const express = require("express");
const router = express.Router();

const workoutsController = require("../controllers/workoutsController");

router.get("/", workoutsController.workouts_get);
router.get("/:id", workoutsController.workouts_get_detail);
router.post("/", workoutsController.workouts_create);
router.put("/:id/update_exercises", workoutsController.workouts_add_exercise);
router.put("/:id", workoutsController.workouts_update);
router.delete("/:id", workoutsController.workouts_delete);

module.exports = router;
