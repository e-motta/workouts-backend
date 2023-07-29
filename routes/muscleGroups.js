const express = require("express");
const router = express.Router();

const muscleGroupsController = require("../controllers/muscleGroupsController");

router.get("/", muscleGroupsController.muscle_groups_get);
router.get("/:id", muscleGroupsController.muscle_groups_get_detail);
router.post("/", muscleGroupsController.muscle_groups_create);
router.put("/:id", muscleGroupsController.muscle_groups_update);
router.delete("/:id", muscleGroupsController.muscle_groups_delete);

module.exports = router;
