const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 5000;

let onlineUsers = {};
let messages = [];

// SOCKET
io.on("connection", (socket) => {

  socket.on("join", (email) => {
    socket.email = email;
    onlineUsers[email] = socket.id;

    io.emit("users", Object.keys(onlineUsers));
  });

  socket.on("sendMessage", (data) => {
    const msg = {
      from: data.from,
      to: data.to,
      message: data.message,
      type: data.type || "text",
      time: new Date().toLocaleTimeString()
    };

    messages.push(msg);

    // send to receiver
    if (onlineUsers[data.to]) {
      io.to(onlineUsers[data.to]).emit("message", msg);
    }

    // send back to sender
    socket.emit("message", msg);
  });

  socket.on("loadChat", (data) => {
    const chat = messages.filter(
      m =>
        (m.from === data.me && m.to === data.friend) ||
        (m.from === data.friend && m.to === data.me)
    );

    socket.emit("chatHistory", chat);
  });

  socket.on("typing", (data) => {
    if (onlineUsers[data.to]) {
      io.to(onlineUsers[data.to]).emit("typing", data.from);
    }
  });

  socket.on("disconnect", () => {
    if (socket.email) {
      delete onlineUsers[socket.email];
      io.emit("users", Object.keys(onlineUsers));
    }
  });
});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});