const express = require("express");
const {
  forgotPassword,
  validateForgotPWD,
  resetPasswordController,
} = require("../controllers/passwordController");
const {
  forgotPWDValidations,
  onlyPWDValidations,
  resetPWDValidations,
} = require("../middleware/validators");
const { decryptForgotToken } = require("../helpers/tokens");
const { authenticate } = require("../middleware/authentication");

const router = express.Router();

router.post(
  "/send-forgot-password-email",
  forgotPWDValidations,
  forgotPassword
);
router.post(
  "/validate-forgot-password/:token",
  decryptForgotToken,
  onlyPWDValidations,
  validateForgotPWD
);

router.get("/forgot-password/:token", (req, res) => {
  const token = req.params.token;
  res.render("../services/email/email", { token });
});

router.post(
  "/reset-password",
  authenticate,
  resetPWDValidations,
  resetPasswordController
);

module.exports = router;
