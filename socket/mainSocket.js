const { Server } = require("socket.io");
const { success } = require("colorify-an-log");
const connectSocket = (server) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  const connectRoom = (socket, convoId) => {
    console.log(socket.id, " joined Room: ", convoId);
    socket.join(convoId?.toString());
    // socket.emit("receiveMessage", `${socket.id} has joined ---> ${convoId}`);
  };

  const leaveRoom = (socket, convoId) => {
    socket.leave(convoId?.toString());
    console.log(socket.id, " left Room: ", convoId);
  };

  const sendMessage = (socket, convoId, msgObj, receiverId) => {
    console.log(`message sent by ${socket.id} :`, msgObj);
    socket.to(convoId).emit("receiveMessage", msgObj);
    // io.emit("receiveMessage", msgObj);
    socket.to(receiverId).emit("notify", msgObj);
  };

  io.on("connection", (socket) => {
    socket.on("join", (convoId) => {
      connectRoom(socket, convoId);
    });

    socket.on("leaveRoom", (convoId) => {
      leaveRoom(socket, convoId);
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
