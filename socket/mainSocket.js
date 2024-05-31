const { Server } = require("socket.io");
// const cookie = require("cookie");
const { success } = require("colorify-an-log");
const { sendMsgUsingSocket } = require("../controllers/chatController");
const { socketAuth } = require("../middleware/authentication");
const { fetchGroupList } = require("../controllers/conversationController");
const { changeStatus } = require("../services/userServices");
const connectSocket = (server) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
    cookie: {
      name: "io",
      path: "/",
      // httpOnly: true,
      sameSite: "lax",
      secure: true,
    },
  });

  const connectRoom = async (socket) => {
    const validateUser = await socketAuth(socket.handshake);

    if (validateUser?.status) {
      console.log("validateUser", validateUser);
      socket.join(validateUser.userId?.toString());
      console.log(
        socket.id,
        " joined with loginID: ",
        validateUser.userId?.toString()
      );

      // socket.broadcast.emit()

      changeStatus(validateUser.userId?.toString(), true);

      const groupList = await fetchGroupList(validateUser.userId?.toString());

      if (groupList?.status) {
        groupList?.data?.map((i) => {
          socket.join(i?.valueOf().toString());
          console.log(
            socket.id,
            " joined with ConvoID: ",
            i?.valueOf().toString()
          );
        });
      }
    }

    // console.log("cookie", cookie);

    // const cookies = cookie.parse(socket.handshake.headers['Cookie']);
    // console.log("cookies", cookies);
    // socket.join(user)
    // socket.emit("receiveMessage", `${socket.id} has joined ---> ${convoId}`);
  };

  const leaveRoom = async (socket) => {
    const validateUser = await socketAuth(socket.handshake);
    if (validateUser?.status) {
      changeStatus(validateUser.userId?.toString(), false);
      socket.leave(validateUser.userId?.toString());
      console.log(socket.id, " left Room: ", validateUser.userId);
      const groupList = await fetchGroupList(validateUser.userId?.toString());

      if (groupList?.status) {
        groupList?.data?.map((i) => {
          socket.leave(i?.valueOf().toString());
          console.log(
            socket.id,
            " left room with ConvoID: ",
            i?.valueOf().toString()
          );
        });
      }
    }
  };

  //   convoId
  // message
  // receiverId
  // message sent by QtMqevbcTl9b572mAAAD : {
  //   senderId: '664ae6236046ab8f1586c9d5',
  //   message: 'sdj bgvg ',
  //   convoId: '665082dfef35676b0ff0ebfc',
  //   receiverId: '664c525e5564d304ee59952e',
  //   createdAt: 1716782696141
  // }

  const sendMessage = async (socket, convoId, msgObj, receiverId) => {
    // const ids = ["665040c4ef35676b0ff0e5ae", "664ae6236046ab8f1586c9d5"];
    const validateUser = await socketAuth(socket.handshake);

    if (validateUser?.status) {
      console.log(`message sent by ${socket.id} :`, msgObj);
      const isMsgSent = await sendMsgUsingSocket(msgObj);
      const returnMsg = isMsgSent?.data;
      returnMsg.senderName = msgObj?.senderName;
      returnMsg.isGroup = msgObj?.isGroup;
      if (isMsgSent?.status) {
        // message sent by -zzfxdZI06EBGtVbAAAD : {
        //   senderId: '664ae6236046ab8f1586c9d5',
        //   message: '5678',
        //   convoId: '665596307eb3373a9279160f',
        //   receiverId: '664aea18ed9609df939bea8e',
        //   createdAt: 1717127240492,
        //   senderName: 'VD',
        //   isGroup: false
        // }
        if (msgObj?.isGroup) {
          console.log(
            "======================= Message sent to Group ==============================="
          );
          // returnMsg {
          //   senderId: new ObjectId('664aea18ed9609df939bea8e'),
          //   convoId: new ObjectId('6657fe209d8f3d5fdcf9595a'),
          //   message: 'Group Test',
          //   createdAt: 2024-05-31T04:09:21.219Z,
          //   senderName: 'Anuj'
          // }
          returnMsg.groupName = msgObj?.groupName;
          socket.to(convoId).emit("receiveMessage", returnMsg); //User 1 user 2
        } else {
          console.log(
            "======================= Message sent to User ==============================="
          );

          socket.to(msgObj?.receiverId).emit("receiveMessage", returnMsg);
        }

        socket.emit("ACK", {
          status: true,
          stage: "delivered",
          message: isMsgSent?.data,
        });
        console.log("returnMsg", returnMsg);
      }
    }
  };

  io.on("connection", (socket) => {
    socket.on("join", () => {
      connectRoom(socket);
    });

    socket.on("leaveRoom", () => {
      leaveRoom(socket);
    });

    socket.on("sendMessage", (convoId, msgObj, receiverId) => {
      sendMessage(socket, convoId, msgObj, receiverId);
      // socket.to(convoId).emit("receiveMessage", msgObj);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected! ----> ", socket.id);
    });

    console.log("Client connected to Socket ---> ", socket.id);
  });
};

module.exports = connectSocket;
