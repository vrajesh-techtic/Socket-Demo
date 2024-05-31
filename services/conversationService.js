const { ObjectId } = require("mongodb");
const { conversation } = require("../models/conversationModel");
// const { message } = require("../models/chatModel");

const addNewConversation = async (senderId, receiverId) => {
  try {
    const usersArr = [];
    usersArr.push(senderId, receiverId);
    console.log("usersArr", usersArr);
    const addConvoQuery = await conversation.create({
      users: usersArr,
    });
    console.log("addConvoQuery", addConvoQuery);
    return {
      status: true,
      message: "New conversation established!",
      convoId: addConvoQuery?._id,
    };
  } catch (error) {
    return { status: false, error: error.message };
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
          isGroup: {
            $eq: false,
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
        error: "Conversation exists!",
        convoId: findConvoQuery[0]._id,
      };
    } else {
      return { status: false, message: "No conversation found!" };
    }
  } catch (error) {
    return { status: false, error: error.message };
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
          receiverIds: {
            $filter: {
              input: "$users",
              as: "user",
              cond: {
                $ne: ["$$user", new ObjectId(senderId)],
              },
            },
          },
          loginId: {
            $filter: {
              input: "$users",
              as: "user",
              cond: {
                $eq: ["$$user", new ObjectId(senderId)],
              },
            },
          },
          isGroup: 1,
          groupName: 1,
          admin: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiverIds",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "admin",
          foreignField: "_id",
          as: "adminDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "loginId",
          foreignField: "_id",
          as: "loginUser",
        },
      },
      {
        $project: {
          convoId: "$_id",
          groupName: 1,
          isGroup: 1,
          users: {
            $cond: {
              if: { $eq: ["$isGroup", true] },
              then: {
                $concatArrays: [
                  {
                    $map: {
                      input: "$users",
                      as: "user",
                      in: {
                        _id: "$$user._id",
                        email: "$$user.email",
                        name: "$$user.name",
                      },
                    },
                  },

                  {
                    $map: {
                      input: "$loginUser",
                      as: "admin",
                      in: {
                        _id: "$$admin._id",
                        email: "$$admin.email",
                        name: "$$admin.name",
                      },
                    },
                  },
                ],
              },
              else: "$users",
            },
          },

          admin: {
            $cond: {
              if: { $eq: ["$isGroup", true] },
              then: {
                $mergeObjects: {
                  $map: {
                    input: "$adminDetails",
                    as: "admin",
                    in: {
                      _id: "$$admin._id",
                      email: "$$admin.email",
                      name: "$$admin.name",
                    },
                  },
                },
              },
              else: "$$REMOVE",
            },
          },
          email: {
            $cond: {
              if: { $eq: ["$isGroup", false] },
              then: {
                $arrayElemAt: ["$users.email", 0],
              },
              else: "$$REMOVE",
            },
          },
          name: {
            $cond: {
              if: { $eq: ["$isGroup", false] },
              then: {
                $arrayElemAt: ["$users.name", 0],
              },
              else: "$$REMOVE",
            },
          },
          receiverId: {
            $cond: {
              if: { $eq: ["$isGroup", false] },
              then: {
                $arrayElemAt: ["$users._id", 0],
              },
              else: "$$REMOVE",
            },
          },
        },
      },
      {
        $project: {
          groupName: 1,
          isGroup: 1,
          admin: {
            $cond: {
              if: "$admin",
              then: {
                email: "$admin.email",
                name: "$admin.name",
                _id: "$admin._id",
              },
              else: "$$REMOVE",
            },
          },
          users: {
            $cond: {
              if: { $eq: ["$isGroup", true] },
              then: "$users",
              else: "$$REMOVE",
            },
          },
          email: 1,
          name: 1,
          receiverId: 1,
          convoId: 1,
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

const getGroupList = async (senderId) => {
  try {
    const getGroupQuery = await conversation.aggregate([
      {
        $match: {
          users: {
            $elemMatch: {
              $eq: new ObjectId(senderId),
            },
          },
          isGroup: true,
        },
      },
      {
        $group: {
          _id: null,
          convoIds: {
            $push: "$_id",
          },
        },
      },
      {
        $project: {
          _id: 0,
          convoIds: 1,
        },
      },
    ]);

    return {
      status: true,
      message: "List of Groups",
      data: getGroupQuery[0]?.convoIds,
    };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const verifyUserConvo = async (userId, convoId) => {
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
      return {
        status: true,
        message: "Conversation exists",
        convoId: verifyUser[0]._id,
      };
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

const createGroup = async (users, admin, groupName) => {
  try {
    const addGroup = await conversation.create({
      users,
      admin,
      isGroup: true,
      groupName,
    });

    if (addGroup) {
      return { status: true, message: "New group Created!", data: addGroup };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const updateGroup = async (users, groupId, groupName) => {
  try {
    const updateGroupQuery = await conversation.findByIdAndUpdate(groupId, {
      users,
      groupName,
    });

    return { status: true, message: "Group updated!" };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const findAdmin = async (convoId) => {
  try {
    const fetchAdmin = await conversation.findById(convoId);
    return {
      status: true,
      message: "Admin details fetched!",
      data: fetchAdmin?.admin,
    };
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
  createGroup,
  getGroupList,
  updateGroup,
  findAdmin
};
