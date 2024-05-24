const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    senderId: {
      type: ObjectId,
      required: true,
    },
    // receiverId: {
    //   type: ObjectId,
    //   required: true,
    // },
    convoId: {
      type: ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const message = mongoose.model("message", chatSchema);

module.exports = { message };
