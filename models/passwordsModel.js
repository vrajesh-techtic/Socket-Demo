const mongoose = require("mongoose");

const { Schema } = mongoose;

const pwdSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
      default: null,
    },
  },
  { timestamps: false, versionKey: false }
);

const passwords = mongoose.model("password", pwdSchema);

module.exports = { passwords };
