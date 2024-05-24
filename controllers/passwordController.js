const { createAccessToken } = require("../helpers/tokens");
const { passwords } = require("../models/passwordsModel");
const { tokenExists } = require("../services/changePWD");
const { sendEmail } = require("../services/email/emailService");
const { findUser, changePassword } = require("../services/userServices");
const { updatePassword } = require("./userController");

const forgotPassword = async (req, res) => {
  try {
    const isUser = await findUser(req.body.email);
    const userId = isUser?.data?._id.valueOf();
    if (isUser?.status) {
      const newToken = createAccessToken(userId);
      const isToken = await tokenExists(userId);

      if (isToken?.status) {
        const addNewToken = await passwords.findOneAndUpdate(
          { userId },
          { token: newToken }
        );
      } else if (isToken?.error === "Invalid Attempt!") {
        const addToken = await passwords.create({ userId, token: newToken });
      }
      sendEmail(req.body.email, newToken);

      res.status(200).send({
        status: true,
        message: "Reset password link sent to your email address!",
      });
    } else {
      return res
        .status(401)
        .send({ status: false, message: "Email address not registered!" });
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const validateForgotPWD = async (req, res) => {
  try {
    await updatePassword(req, res);
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const resetPasswordController = async (req, res) => {
  await changePassword(
    res,
    req.headers.userId,
    req.body.password,
    req.body.currPassword,
    "reset"
  );
};

module.exports = { forgotPassword, validateForgotPWD, resetPasswordController };
