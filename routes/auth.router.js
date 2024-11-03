const express = require("express");
const router = express.Router();
const signInController = require("../controllers/authController");

router.get("/", signInController.showSignIn);
router.post("/", signInController.signIn);

router.get("/signup", signInController.showSignUp);
router.post("/signup", signInController.signUp);

module.exports = router;
