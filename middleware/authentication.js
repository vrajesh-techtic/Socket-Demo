const jwt = require("jsonwebtoken");
const { findUserById } = require("../services/userServices");
const { decryptTokens } = require("../helpers/tokens");

const authenticate = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie.split(";");
    // console.log("cookies", cookies);
    if (cookies.length === 1) {
      const tokenKey = cookies[0].split("=")[0].trim();

      if (tokenKey !== "refresh_token") {
        return { status: false, error: "Refresh token missing!" };
      } else {
        //access_token not present
        return { status: false, error: "Access token missing!" };
      }
    }

    const cookieArr = cookies.map((i) => i.split("="));
    const tempObj = cookieArr.map((i) => {
      if (i[0].trim() === "access_token") {
        return { access_token: i[1] };
      } else if (i[0].trim() === "refresh_token") {
        return { refresh_token: i[1] };
      }
    });
    // console.log("tempObj----------------", tempObj);
    const refresh_token = tempObj[1].refresh_token;
    const access_token = tempObj[0].access_token;

    const tokens = { refresh_token, access_token };
    // console.log("token", tokens);
    const temp = await decryptTokens(req, tokens);

    if (temp?.status) {
      res.cookie("access_token", temp.tokens.access_token);
      res.cookie("refresh_token", temp.tokens.refresh_token);
      // res.status(200).send(temp);
      next();
    } else {
      res.status(401).send(temp);
    }
  } catch (error) {
    return res.status(401).send({ status: false, error: "Invalid Token" });
  }
};

const socketAuth = async (req) => {
  try {
    const cookies = req.headers.cookie.split(";");
    // console.log("cookies", cookies);
    if (cookies.length === 1) {
      const tokenKey = cookies[0].split("=")[0].trim();

      if (tokenKey !== "refresh_token") {
        return { status: false, error: "Refresh token missing!" };
      } else {
        //access_token not present
        return { status: false, error: "Access token missing!" };
      }
    }

    const cookieArr = cookies.map((i) => i.split("="));
    const tempObj = cookieArr.map((i) => {
      if (i[0].trim() === "access_token") {
        return { access_token: i[1] };
      } else if (i[0].trim() === "refresh_token") {
        return { refresh_token: i[1] };
      }
    });
    console.log("tempObj", tempObj);
    const refresh_token = tempObj[1].refresh_token;
    const access_token = tempObj[0].access_token;

    const tokens = { refresh_token, access_token };
    console.log("token", tokens);
    const temp = await decryptTokens(req, tokens);

    if (temp?.status) {
      // res.cookie("access_token", temp.tokens.access_token);
      // res.cookie("refresh_token", temp.tokens.refresh_token);
      // res.status(200).send(temp);
      return {
        status: true,
        message: "Valid User!",
        userId: req.headers.userId,
      };
      // next();
    } else {
      return temp;
    }
  } catch (error) {
    return { status: false, error: "Invalid Token" };
  }
};

module.exports = { authenticate, socketAuth };
