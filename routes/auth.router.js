const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/", authController.showSignIn);
router.post("/", authController.signIn);

router.get("/signup", authController.showSignUp);
router.post("/signup", authController.signUp);

router.get("/logout", authController.logOut);

module.exports = router;
