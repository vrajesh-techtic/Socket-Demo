const { deleteAllMessages } = require("../services/chatServices");
const {
  findConvo,
  getConvoList,
  deleteConversation,
  verifyUserConvo,
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

module.exports = { findConvoController, findPastConvo, deleteConvoController };
