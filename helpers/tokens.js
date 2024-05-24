const jwt = require("jsonwebtoken");
const { tokenExists } = require("../services/changePWD");

const createAccessToken = (id) => {
  const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "24h" });
  return token;
};

const createRefreshToken = (id) => {
  const refresh_token = jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "15d",
  });
  return refresh_token;
};

const generateTokens = (id) => {
  const access_token = createAccessToken(id);

  const refresh_token = createRefreshToken(id);
  return {
    access_token,
    refresh_token,
  };
};

const decryptTokens = async (req, tokens) => {
  const { refresh_token, access_token } = tokens;
  const data = jwt.verify(
    access_token,
    process.env.SECRET_KEY,
    function (err, decoded) {
      if (err) {
        return { status: false, error: err.message };
      } else {
        return { status: true, id: decoded?.id };
      }
    }
  );

  if (data?.status) {
    req.headers.userId = data?.id;

    return {
      status: true,
      tokens: { access_token, refresh_token },
    };
  } else {
    if (data.error === "jwt expired") {
      console.log("Access token Expired");
      const refreshData = jwt.verify(
        refresh_token,
        process.env.SECRET_KEY,
        function (err, decoded) {
          if (err) {
            return { status: false, error: err.message };
          } else {
            return { status: true, id: decoded?.id };
          }
        }
      );
      if (refreshData?.status) {
        console.log("Access token Updated");
        const newAccess = createAccessToken(refreshData?.id);
        req.headers.userId = refreshData?.id;
        return {
          status: true,
          tokens: { access_token: newAccess, refresh_token },
        };
      } else {
        return { status: false, error: "Refresh token expired!" };
      }
    } else {
      console.log("Corrupted Token");
      return { status: false, error: "Corrupted Token!" };
    }
  }

  // console.log("data", data);
  // return data;
  // if (access_token === data.access_token) {
  //   const isExpired = jwt.verify(
  //     access_token,
  //     process.env.SECRET_KEY,
  //     function (err, decoded) {
  //       if (err) {
  //         return { status: true, error: err };
  //       } else {
  //         return { status: false, token: decoded };
  //       }
  //     }
  //   );

  //   if (isExpired?.status) {
  //     const id = data?.id;
  //     const access_token = createAccessToken(id);

  //     const refresh_token = createRefreshToken(id, access_token);

  //     req.headers.userId = id;
  //     return {
  //       status: false,
  //       error: "Token expired",
  //       tokens: { access_token, refresh_token },
  //     };
  //   } else {
  //     req.headers.userId = data?.id;

  //     return {
  //       status: true,
  //       message: "Valid User",
  //       id: isExpired?.token.id,
  //     };
  //   }
  // } else {
  //   return { status: false, message: "Invalid User" };
  // }
};

const decryptForgotToken = async (req, res, next) => {
  const token = req.params.token;

  const temp = jwt.verify(
    token,
    process.env.SECRET_KEY,
    function (err, decoded) {
      if (err) {
        return { status: false, error: err.message };
      } else {
        return { status: true, id: decoded };
      }
    }
  );

  if (temp?.status) {
    req.headers.userId = temp?.id?.id;

    const isToken = await tokenExists(temp?.id?.id);

    if (isToken?.status) {
      next();
    } else {
      res.status(500).send(isToken);
    }
  } else {
    return res.status(401).send(temp);
  }
};

module.exports = {
  generateTokens,
  createRefreshToken,
  createAccessToken,
  decryptTokens,
  decryptForgotToken,
};
