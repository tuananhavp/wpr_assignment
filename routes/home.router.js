const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.verifyCookie, homeController.home);
router.post("/post", homeController.verifyCookie, homeController.createEmail);
router.get("/detail/:id", homeController.getDetail);
router.post("/delete", homeController.deleteEmail);
router.get("/delete/:id", homeController.deleteEmailById);
module.exports = router;
