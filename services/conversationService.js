const { ObjectId } = require("mongodb");
const { conversation } = require("../models/conversationModel");
// const { message } = require("../models/chatModel");

const addNewConversation = async (senderId, receiverId) => {
  try {
    const usersArr = [];
    usersArr.push(senderId, receiverId);

    const addConvoQuery = await conversation.create({
      users: usersArr,
    });
    // console.log("addConvoQuery", addConvoQuery);
    return {
      status: true,
      message: "New conversation established!",
      convoId: addConvoQuery?._id,
    };
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const findConvo = async (senderId, receiverId) => {
  try {
    const findConvoQuery = await conversation.aggregate([
      {
        $match: {
          users: {
            $all: [
              {
                $elemMatch: {
                  $eq: new ObjectId(senderId),
                },
              },
              {
                $elemMatch: {
                  $eq: new ObjectId(receiverId),
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);

    if (findConvoQuery !== null && findConvoQuery.length !== 0) {
      return {
        status: true,
        message: "Conversation exists!",
        convoId: findConvoQuery[0]._id,
      };
    } else {
      return { status: false, message: "No conversation found!" };
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const getConvoList = async (req, res) => {
  const senderId = req.headers.userId;
  try {
    const getList = await conversation.aggregate([
      {
        $match: {
          users: {
            $elemMatch: {
              $eq: new ObjectId(senderId),
            },
          },
        },
      },
      {
        $project: {
          receiverId: {
            $filter: {
              input: "$users",
              as: "user",
              cond: {
                $ne: ["$$user", new ObjectId(senderId)],
              },
            },
          },
        },
      },
      {
        $project: {
          receiverId: {
            $arrayElemAt: ["$receiverId", 0],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiverId",
          foreignField: "_id",
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
          convoId: "$_id",
          email: "$result.email",
          name: "$result.name",
          receiverId: "$result._id",
          _id: 0,
        },
      },
    ]);

    res
      .status(200)
      .send({ status: true, message: "List fetched!", data: getList });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const verifyUserConvo = async (userId, convoId) => {
  console.log("userId", userId);
  console.log("convoId", convoId);
  try {
    const verifyUser = await conversation.aggregate([
      {
        $match: {
          users: {
            $elemMatch: {
              $eq: new ObjectId(userId),
            },
          },
          _id: new ObjectId(convoId),
        },
      },
    ]);

    if (verifyUser.length === 0) {
      return { status: false, message: "No conversation exists!" };
    } else {
      return { status: true, message: "Conversation exists" };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const deleteConversation = async (convoId) => {
  console.log("convoId:::>>>", new ObjectId(convoId));

  try {
    const delConvo = await conversation.findByIdAndDelete(convoId);
    if (delConvo) {
      return { status: true, message: "Conversation deleted!" };
    } else {
      return { status: false, error: "Conversation not found!" };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
};

module.exports = {
  addNewConversation,
  findConvo,
  getConvoList,
  verifyUserConvo,
  deleteConversation,
};
