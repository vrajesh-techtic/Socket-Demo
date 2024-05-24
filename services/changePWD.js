const { passwords } = require("../models/passwordsModel");

const tokenExists = async (id) => {
  try {
    const findtoken = await passwords.findOne({ userId: id });

    if (findtoken === null) {
      return { status: false, error: "Invalid Attempt!" };
    } else {
      return { status: true, data: findtoken };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
};

module.exports = { tokenExists };
