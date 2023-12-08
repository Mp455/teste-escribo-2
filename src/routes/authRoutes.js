// authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signin", authController.signIn);
router.get("/authenticatedUser", authController.getAuthenticatedUser);

module.exports = router;
