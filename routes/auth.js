const express = require("express");
const router = express.Router();

const loginController = require("../controllers/authController");

router.post("/login", loginController.login);

module.exports = router;
