const express = require("express");
const { authenticate } = require("../middleware/authentication");
const {
  chatValidations,
  convoValidation,
  getChatsValidation,
  deleteConvoValidations,
} = require("../middleware/validators");
const {
  sendMsgController,
  fetchMsgController,
  deleteMessagesController,
} = require("../controllers/chatController");
const {
  findConvoController,
  findPastConvo,
  deleteConvoController,
} = require("../controllers/conversationController");

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ status: true, message: "Chat API is working fine!" });
});

router.post("/send-message", authenticate, chatValidations, sendMsgController);

router.post(
  "/fetch-chats",
  authenticate,
  getChatsValidation,
  fetchMsgController
);

router.post(
  "/find-conversation",
  authenticate,
  convoValidation,
  findConvoController
);

router.post(
  "/delete-conversation",
  authenticate,
  deleteConvoValidations,
  deleteConvoController
);

router.get("/get-convo-list", authenticate, findPastConvo);
router.post(
  "/clear-chats",
  authenticate,
  deleteMessagesController,
  deleteMessagesController
);

module.exports = router;
