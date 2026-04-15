const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files (VERY IMPORTANT)
app.use(express.static(path.join(__dirname, "public")));

// Route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
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
