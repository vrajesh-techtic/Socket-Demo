const express = require("express");
const { authenticate } = require("../middleware/authentication");
const {
  chatValidations,
  convoValidation,
  getChatsValidation,
  deleteConvoValidations,
  createGroupValdiation,
  editGroupValidations,
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
  createGroupController,
  createNewConvo,
  EditGroupController,
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

router.post(
  "/add-new-conversation",
  authenticate,
  convoValidation,
  createNewConvo
);

router.post(
  "/create-group",
  authenticate,
  createGroupValdiation,
  createGroupController
);

router.post(
  "/edit-group",
  authenticate,
  editGroupValidations,
  EditGroupController
);

module.exports = router;
