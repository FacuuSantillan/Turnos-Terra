const { Router } = require("express");
const { loginUser } = require("../controller/authController.js");

const router = Router();

router.post("/login", loginUser);

module.exports = router;
