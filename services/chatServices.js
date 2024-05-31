const { ObjectId } = require("mongodb");
const { message } = require("../models/chatModel.js");
const { findConvo, verifyUserConvo } = require("./conversationService.js");

const sendMessage = async (obj) => {
  // const { convoId, senderId, message } = req.body;
  // console.log("obj", obj);

  try {
    const sendQuery = await message.create(obj);

    //   {
    //     "senderId": "664aea10ed9609df939bea8b",
    //     "convoId": "66544503ce739a44b139b0b7",
    //     "message": "Hey",
    //     "_id": "66544ed16286784aecd49e71",
    //     "createdAt": "2024-05-27T09:13:53.605Z",
    //     "updatedAt": "2024-05-27T09:13:53.605Z",
    //     "status": "delivered"
    // }
    // sendQuery {
    //   senderId: new ObjectId('664ae6236046ab8f1586c9d5'),
    //   convoId: new ObjectId('66545c57ce49f2ff1b53e7fe'),
    //   message: 'g cvvwg ',
    //   _id: new ObjectId('66548b3f2c0b2188b90a1ab9'),
    //   createdAt: 2024-05-27T13:31:43.644Z,
    //   updatedAt: 2024-05-27T13:31:43.644Z
    // }
    // console.log("sendQuery", sendQuery);

    // {
    //   "senderId": "664aea10ed9609df939bea8b",
    //   "message": "hey",
    //   "createdAt": "2024-05-27T12:12:13.611Z",
    //   "senderName": "Harsh"
    // }
    const temp = sendQuery.toObject();
    delete temp._id;
    delete temp.updatedAt;

    return { status: true, message: "Message sent!", data: temp };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const getMessages = async (req, res) => {
  // const senderId = req.body.senderId;
  const { convoId } = req.body;
  console.log("convoId", convoId);
  try {
    const getChats = await message.aggregate([
      {
        $match: {
          convoId: new ObjectId(convoId),
        },
      },
      {
        $project: {
          _id: 0,
          updatedAt: 0,
          convoId: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          pipeline: [
            {
              $addFields: {
                senderName: "$name",
              },
            },
          ],
          as: "result",
        },
      },
      {
        $unwind: {
          path: "$result",
        },
      },
      {
        $project: {
          senderId: 1,
          convoId: 1,
          message: 1,
          createdAt: 1,

          senderName: "$result.senderName",
        },
      },
    ]);
    if (getChats.length === 0) {
      res.status(200).send({
        status: true,
        message: "No chats found!",
        chats: getChats,
        convoId: convoId,
      });
    } else {
      res.status(200).send({
        status: true,
        message: "Chats fetched!",
        chats: getChats,
        convoId: convoId,
      });
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
