const mongoose = require("mongoose");
const moment = require("moment");
const { createHashPassword } = require("../helpers/passwords");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    isOnline: {
      type: Boolean,
      default: true,
    },

    lastSeen: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", async function (next) {
  this.password = await createHashPassword(this.password);
  next();
});

const users = mongoose.model("user", userSchema);

// users.methods.toJSON = function () {
//   const user = this;
//   const userObject = user.toObject();

//   delete userObject.password;
//   // delete userObject.

//   return userObject;
// };

module.exports = { users };
