const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");

router.get("/", usersController.users_get);
router.get("/:id", usersController.users_get_detail);
router.post("/", usersController.users_create);
router.put("/:id", usersController.users_update);
router.delete("/:id", usersController.users_delete);

module.exports = router;
