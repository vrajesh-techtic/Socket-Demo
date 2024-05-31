const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    isGroup: {
      type: Boolean,
      default: false,
    },

    groupName: {
      type: String,
    },

    admin: {
      type: ObjectId,
    },
    users: [
      {
        type: ObjectId,
        required: true,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const conversation = mongoose.model("conversation", conversationSchema);

module.exports = { conversation };
