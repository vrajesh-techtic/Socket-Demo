const bcrypt = require("bcrypt");

const createHashPassword = async (pwd) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPWD = await bcrypt.hash(pwd, salt);

  return hashedPWD;
};

const verifyPassword = async (pwd, hashedPWD) => {
  return await bcrypt.compare(pwd, hashedPWD);
};

module.exports = { createHashPassword, verifyPassword };
