const express = require("express");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const isdRouter = require("./routes/isdCodeRoutes");
const pwdRouter = require("./routes/passwordRoutes");

const http = require("http");
const morgan = require("morgan");
const env = require("dotenv").config();
const app = express();
const cors = require("cors");
const connectSocket = require("./socket/mainSocket");
const connectDB = require("./config/db");
const server = http.createServer(app);
const PORT = process.env.BACKEND_PORT;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use("/api/user/chat", chatRoutes);
app.use("/api/user/", userRoutes);
app.use("/api", isdRouter);
app.use("/api/user", pwdRouter);

server.listen(PORT, () => {
  console.log("Server listening at ", PORT);
  connectSocket(server);
  connectDB();
});

// const server = app.listen(PORT, () => {
//   console.log("Server running on ", PORT);
// });

// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     // origin: "http://localhost:8080",
//   },
// });

// io.on("connection", (socket) => {
//   socket.on("joinRoom", (req) => {
//     socket.join(req.room);
//     io.to("TechticRoom").emit("MSG", `${req.username} joined room TechticRoom`);
//   });

//   socket.on("joinRoom", (req) => {
//     socket.join(req.room);
//     io.to("VDROOM").emit("MSG", `${req.username} joined room VDROOM`);
//   });

//   console.log("Client connected to server");
//   //   socket.broadcast.emit("SEND_MESSAGE", "Techtic");
//   //   socket.on("RECEIVE_MESSAGE", (msg) => {});
// });
