const express = require("express");
const {
  createUser,
  loginUser,
  updateUser,
  fetchUsersList,
  logoutController,
  getUserController,
} = require("../controllers/userController");
const {
  signUpValidation,
  loginValidations,
  updateValidations,
  usernameValidations,
} = require("../middleware/validators");
const { authenticate } = require("../middleware/authentication");

const router = express.Router();
const multer = require("multer");
const {
  createRefreshToken,
  decryptTokens,
  generateTokens,
} = require("../helpers/tokens");
const { compareUsername } = require("../services/userServices");

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.get("/", (req, res) => {
  res.send({ status: true, message: "API working !!" });
});

router.post("/find-username", usernameValidations, compareUsername);

router.post("/get-tokens", async (req, res) => {
  const userId = req.body.userId;
  const tokens = await generateTokens(userId);
  res.send(tokens);
});

router.post("/decrypt-tokens", async (req, res) => {
  res.send(decryptTokens(req.body));
});

router.get("/validate-token", async (req, res) => {
  await authenticate(req, res);
});

router.post("/signup", signUpValidation, createUser);

//   console.log(req.files);
// });

router.post("/login", loginValidations, loginUser);
router.get("/logout", authenticate, logoutController);
router.post("/update-user", authenticate, updateValidations, updateUser);
router.get("/users-list", authenticate, fetchUsersList);
router.post("/find-user", authenticate, getUserController);

module.exports = router;
