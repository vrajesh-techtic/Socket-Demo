const { message } = require("../models/chatModel");
const {
  sendMessage,
  getMessages,
  deleteAllMessages,
} = require("../services/chatServices");
const {
  findConvo,
  addNewConversation,
  verifyUserConvo,
} = require("../services/conversationService");

const sendMsgController = async (req, res) => {
  const { senderId, receiverId, convoId } = req.body;

  console.log("req.body", req.body);
  try {
    await sendMessage(req, res);

    // const isConvoExists = await findConvo(senderId, receiverId);
    // console.log("isConvoExists", isConvoExists);
    // if (isConvoExists?.status) {
    //   // conversation already exists
    //   req.body.convoId = isConvoExists.convoId;
    // } else {
    //   // new conversation needs to be created
    //   const newConvo = await addNewConversation(senderId, receiverId);
    //   if (newConvo?.status) {
    //     req.body.convoId = newConvo?.convoId;
    //     await sendMessage(req, res);
    //   }
    // }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const fetchMsgController = async (req, res) => {
  const { senderId, receiverId, convoId } = req.body;
  // console.log("req.body", req.body);
  try {
    const isConvoExists = await verifyUserConvo(senderId, convoId);
    // console.log("isConvoExists", isConvoExists);
    if (isConvoExists?.status) {
      req.body.convoId = isConvoExists?.convoId;
      // console.log("isConvoExists?.convoId", isConvoExists?.convoId);
      await getMessages(req, res);
    } else {
      // const newConvo = await addNewConversation(senderId, receiverId);
      // // console.log("newConvo", newConvo);
      // if (newConvo?.status) {
      //   req.body.convoId = newConvo?.convoId;
      //   await getMessages(req, res);
      // } else {
      res.status(500).send(isConvoExists);
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const deleteMessagesController = async (req, res) => {
  const { convoId } = req.body;
  const userId = req.headers.userId;
  try {
    const verifyConvo = await verifyUserConvo(userId, convoId);

    if (verifyConvo?.status) {
      const deleteQuery = await deleteAllMessages(convoId);

      if (deleteQuery?.status) {
        res.status(200).send(deleteQuery);
      } else {
        res.status(404).send(deleteQuery);
      }
    } else {
      res.status(404).send(verifyConvo);
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const sendMsgUsingSocket = async (obj) => {
  const { senderId, message, convoId, receiverId } = obj;
  try {
    // const isConvoExists = await findConvo(senderId, receiverId);
    const isConvoExists = await verifyUserConvo(senderId, convoId);

    if (!isConvoExists?.status) {
      // new conversation needs to be created
      const newConvo = await addNewConversation(senderId, receiverId);
      if (newConvo?.status) {
        obj.convoId = newConvo?.convoId;
      }
      const isSent = await sendMessage(obj);
      return isSent;
    } else {
      obj.convoId = isConvoExists?.convoId;
      const isSent = await sendMessage(obj);
      return isSent;
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
};

module.exports = {
  sendMsgController,
  fetchMsgController,
  deleteMessagesController,
  sendMsgUsingSocket,
};
