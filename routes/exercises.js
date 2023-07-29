const express = require("express");
const router = express.Router();

const exercisesController = require("../controllers/exercisesController");

router.get("/", exercisesController.exercises_get);
router.get("/:id", exercisesController.exercises_get_detail);
router.post("/", exercisesController.exercises_create);
router.put("/:id", exercisesController.exercises_update);
router.delete("/:id", exercisesController.exercises_delete);

module.exports = router;
