const { users } = require("../models/userModel");
const {
  registerNewUser,
  findUser,
  validateLogin,
  updateProfile,
  changePassword,
  getUsersList,
  findUserById,
} = require("../services/userServices");

// function to create new user
const createUser = async (req, res) => {
  const isUser = await findUser(req.body.email);
  if (isUser.status) {
    res.status(400).send({ status: false, error: isUser.message });
  } else {
    await registerNewUser(req, res);
  }
};

// function to login existing user
const loginUser = async (req, res) => {
  const isUser = await findUser(req.body.email);
  if (isUser.status) {
    await validateLogin(req, res);
  } else {
    res.status(401).send({ status: false, message: "User not Registered!" });
  }
};

const updateUser = async (req, res) => {
  await updateProfile(req, res);
};

const updatePassword = async (req, res) => {
  const pwd = req.body.password;
  const id = req.headers.userId;

  await changePassword(res, id, pwd, "", "forgot");
};

const fetchUsersList = async (req, res) => {
  await getUsersList(req, res);
};

const logoutController = async (req, res) => {
  try {
    // res.cookie("access_token", "");
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    // res.cookie("refresh_token", "");
    res.status(200).send({ status: true, message: "Log out successfully!" });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const getUserController = async (req, res) => {
  try {
    const findUser = await findUserById(req.body.receiverId);
    if (findUser?.status) {
      res.status(200).send(findUser);
    } else {
      res.status(404).send(findUser);
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  updatePassword,
  fetchUsersList,
  logoutController,
  getUserController,
};
