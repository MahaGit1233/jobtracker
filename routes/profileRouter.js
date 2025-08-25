const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authenticate } = require("../middleware/auth");

router.post("/addprofile", authenticate, profileController.addProfile);
router.get("/getprofile", authenticate, profileController.getProfile);
router.put("/updateprofile/:id", authenticate, profileController.updateProfile);

module.exports = router;
