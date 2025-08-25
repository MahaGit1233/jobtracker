const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");

router.post("/signup", registerController.signupUsers);
router.post("/login", registerController.loginUsers);
router.post("/forgotpassword", registerController.forgotPassword);
router.get("/resetpassword/:id", registerController.getResetPasswordForm);
router.post("/updatepassword/:id", registerController.updatePassword);

module.exports = router;
