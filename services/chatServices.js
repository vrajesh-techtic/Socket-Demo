const { ObjectId } = require("mongodb");
const { message } = require("../models/chatModel.js");
const { findConvo, verifyUserConvo } = require("./conversationService.js");

const sendMessage = async (req, res) => {
  // const { convoId, senderId, message } = req.body;
  try {
    const sendQuery = await message.create(req.body);

    res.status(200).send({ status: true, message: "Message sent!" });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const getMessages = async (req, res) => {
  // const senderId = req.body.senderId;
  const { convoId, senderId } = req.body;

  try {
    const isConvoExists = await verifyUserConvo(senderId, convoId);

    if (isConvoExists?.status) {
      const getChats = await message.aggregate([
        {
          $match: {
            convoId: new ObjectId(convoId),
          },
        },
        // {
        //   $sort: {
        //     createdAt: -1,
        //   },
        // },
        {
          $project: {
            _id: 0,
            updatedAt: 0,
            convoId: 0,
          },
        },
      ]);
      if (getChats.length === 0) {
        res
          .status(200)
          .send({ status: true, message: "No chats found!", chats: getChats });
      } else {
        res
          .status(200)
          .send({ status: true, message: "Chats fetched!", chats: getChats });
      }
    } else {
      res.status(404).send(isConvoExists);
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const deleteAllMessages = async (convoId) => {
  try {
    const deleteChats = await message.deleteMany({
      convoId: new ObjectId(convoId),
    });
    console.log("deleteChats", deleteChats);
    if (deleteChats) {
      return { status: true, message: "All chats deleted!", data: deleteChats };
    } else {
      return { status: false, error: "Chats not found!" };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
};

module.exports = { sendMessage, getMessages, deleteAllMessages };
