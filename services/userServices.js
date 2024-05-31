const { verifyPassword, createHashPassword } = require("../helpers/passwords");
const { generateTokens } = require("../helpers/tokens");
const { savePic, deletePic } = require("../middleware/saveProfilePic");
const { findById } = require("../models/ISDModel");
const { passwords } = require("../models/passwordsModel");
const { users } = require("../models/userModel");
const { ObjectId } = require("mongodb");

const findUserById = async (id) => {
  try {
    const findUser = await users.findById(new ObjectId(id), {
      password: 0,
    });
    if (findUser !== null) {
      return { status: true, message: "User data fetched!", data: findUser };
    } else {
      return { status: false, message: "User does not exists!" };
    }
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const findUser = async (email) => {
  try {
    const findUser = await users.findOne({ email });
    if (findUser !== null) {
      return { status: true, message: "User already exists!", data: findUser };
    } else {
      return { status: false };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const registerNewUser = async (req, res) => {
  try {
    let createQuery = await users.create(req.body);

    const { access_token, refresh_token } = generateTokens(
      createQuery._id.valueOf()
    );

    res.cookie("access_token", access_token);
    res.cookie("refresh_token", refresh_token);

    createQuery = createQuery.toObject();
    delete createQuery?.password;

    delete createQuery?.updatedAt;
    delete createQuery?.createdAt;

    let resp = createQuery;

    res.status(200).send({
      status: true,
      message: "User added successfully!",
      data: resp,
    });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const validateLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let loginQuery = await users.findOne(
      { email },
      { createdAt: 0, updatedAt: 0 }
    );

    if (await verifyPassword(password, loginQuery.password)) {
      const { access_token, refresh_token } = generateTokens(
        loginQuery._id.valueOf()
      );

      // const changeStatus = await users.findByIdAndUpdate(loginQuery._id, {
      //   isOnline: true,
      // });

      res.cookie("access_token", access_token);
      res.cookie("refresh_token", refresh_token);

      loginQuery = loginQuery.toObject();
      delete loginQuery?.password;

      const resp = loginQuery;

      console.log("resp", resp);

      res.status(200).send({
        status: true,
        message: "Login Successfully",
        data: resp,
      });
    } else {
      res.status(401).send({ status: false, error: "Invalid Password!" });
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.headers.userId;

  try {
    let updateQuery = await users.findByIdAndUpdate(userId, req.body);

    const resp = (await findUserById(userId)).data.toObject();
    delete resp?._id;
    delete resp?.createdAt;
    delete resp?.updatedAt;

    if (updateQuery) {
      return res.status(200).send({
        status: true,
        message: "Profile updated successfully!",
        data: resp,
      });
    }
  } catch (error) {
    console.log("called");
    res.status(500).send({ status: false, error: error.message });
  }
};

const getUsersList = async (req, res) => {
  const senderId = req.headers.userId;

  try {
    const getUsers = await users.aggregate([
      {
        $match: {
          _id: {
            $ne: new ObjectId(senderId),
          },
        },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          name: 1,
          lastSeen: 1,
        },
      },
    ]);

    res.status(200).send({ status: true, data: getUsers });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const pwdChange = async (res, id, pwd, userData) => {
  const validatePWD = await verifyPassword(pwd, userData?.password);

  if (validatePWD) {
    return res.status(400).send({
      status: false,
      error: "New password must be different from Old password!",
    });
  } else {
    const password = await createHashPassword(pwd);

    const updatePWDQuery = await users.findByIdAndUpdate(id, { password });

    if (updatePWDQuery !== null) {
      const removeToken = await passwords.deleteOne({ userId: id });
      res
        .status(200)
        .send({ status: true, message: "Password Changed Successfully!" });
    }
  }
};

const changePassword = async (res, id, pwd, currPWD, type) => {
  try {
    const userData = await users.findById(id);
    let isReset = false;

    if (type === "reset") {
      isReset = true;
    }

    if (!isReset) {
      await pwdChange(res, id, pwd, userData);
    } else {
      const verifyCurr = await verifyPassword(currPWD, userData?.password);
      if (verifyCurr) {
        await pwdChange(res, id, pwd, userData);
      } else {
        res
          .status(401)
          .send({ status: false, error: "Incorrect current password" });
      }
    }
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

const compareUsername = async (req, res) => {
  const username = req.body.username;
  try {
    const isusernameExist = await users.findOne({ username });

    if (isusernameExist !== null) {
      return res
        .status(404)
        .send({ status: false, error: "Username already exists!" });
    } else {
      res.status(200).send({ status: true, message: "Username available!" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

const changeStatus = async (userId, isOnline) => {
  console.log("isOnline", isOnline);
  try {
    const changeQuery = await users.findByIdAndUpdate(userId, {
      isOnline: isOnline,
    });
    console.log("changeQuery", changeQuery);
  } catch (error) {
    return { status: false, error: error.message };
  }
};

module.exports = {
  registerNewUser,
  findUser,
  validateLogin,
  findUserById,
  updateProfile,
  changePassword,
  compareUsername,
  getUsersList,
  changeStatus,
};
