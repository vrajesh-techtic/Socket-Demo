const { conversation } = require("../models/conversationModel");
const { deleteAllMessages } = require("../services/chatServices");
const {
  findConvo,
  getConvoList,
  deleteConversation,
  verifyUserConvo,
  createGroup,
  addNewConversation,
  getGroupList,
  findAdmin,
  updateGroup,
} = require("../services/conversationService");

const findConvoController = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const isConvoExists = await findConvo(senderId, receiverId);

    res.status(200).send(isConvoExists);
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const findPastConvo = async (req, res) => {
  await getConvoList(req, res);
};

const deleteConvoController = async (req, res) => {
  const { convoId } = req.body;
  const userId = req.headers.userId;
  try {
    const verifyUser = await verifyUserConvo(userId, convoId);
    console.log("verifyUser", verifyUser);
    if (verifyUser?.status) {
      // If user is verified
      const deleteConvo = await deleteConversation(convoId);
      if (deleteConvo?.status) {
        // conversation deleted now delete all messages
        const deleteMessages = await deleteAllMessages(convoId);
        if (deleteMessages?.status) {
          // all messages deleted
          res.status(200).send(deleteMessages);
        } else {
          // error in deleting messsages
          res.status(404).send(deleteMessages);
        }
      } else {
        // error is deleting conversation
        res.status(404).send(deleteConvo);
      }
    } else {
      // if user is invalid!
      res.status(404).send(verifyUser);
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const createGroupController = async (req, res) => {
  // const creatorId = req.headers.userId;
  const { users, groupName, senderId } = req.body;
  users.push(senderId);

  const temp = await createGroup(users, senderId, groupName);
  if (temp?.status) {
    res
      .status(200)
      .send({ status: true, message: "New Group Created!", data: temp?.data });
  } else {
    res.status(500).send(temp);
  }
};

const createNewConvo = async (req, res) => {
  const { receiverId, senderId } = req.body;

  try {
    const checkConvo = await findConvo(senderId, receiverId);
    if (checkConvo?.status) {
      res.status(404).send(checkConvo);
    } else {
      const addConvo = await addNewConversation(senderId, receiverId);
      if (addConvo?.status) {
        res.status(200).send(addConvo);
      } else {
        res.status(500).send(addConvo);
      }
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const fetchGroupList = async (senderId) => {
  return await getGroupList(senderId);
};

const EditGroupController = async (req, res) => {
  // users array, groupName , convoId
  const { users, groupName, convoId, senderId } = req.body;

  const checkAdmin = await findAdmin(convoId);
  if (checkAdmin?.data.valueOf() === senderId) {
    const updateGroupQuery = await updateGroup(users, convoId, groupName);

    if (updateGroupQuery?.status) {
      res.status(200).send({ status: true, message: "Group Updated!" });
    } else {
      res.status(500).send(updateGroupQuery);
    }
  } else {
    res
      .status(400)
      .send({ status: false, error: "Only admin can edit group!" });
  }
};

module.exports = {
  findConvoController,
  findPastConvo,
  deleteConvoController,
  createGroupController,
  createNewConvo,
  fetchGroupList,
  EditGroupController,
};
