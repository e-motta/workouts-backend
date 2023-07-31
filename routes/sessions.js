const express = require("express");
const router = express.Router();

const sessionsController = require("../controllers/sessionsController");

router.get("/", sessionsController.sessions_get);
router.get("/:id", sessionsController.sessions_get_detail);
router.post("/", sessionsController.sessions_create);
router.put("/:id", sessionsController.sessions_update);
router.delete("/:id", sessionsController.sessions_delete);

module.exports = router;
