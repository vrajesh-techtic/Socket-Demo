const jwt = require("jsonwebtoken");
const { findUserById } = require("../services/userServices");
const { decryptTokens } = require("../helpers/tokens");

const authenticate = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie.split(";");
    if (cookies.length === 1) {
      const tokenKey = cookies[0].split("=")[0].trim();

      if (tokenKey !== "refresh_token") {
        return res
          .status(401)
          .send({ status: false, error: "Refresh token missing!" });
      } else {
        //access_token not present
        return res
          .status(401)
          .send({ status: false, error: "Access token missing!" });
      }
    }

    const refresh_token = cookies[1].split("=")[1];
    const access_token = cookies[0].split("=")[1];

    const tokens = { refresh_token, access_token };

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

module.exports = { authenticate };
