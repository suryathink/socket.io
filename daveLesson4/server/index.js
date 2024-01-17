const express = require("express");
const { Server } = require("socket.io");
const path = require("path");
const { fileURLToPath } = require("url");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});

const io = new Server(expressServer, {
  cors: {
    origin: "*", // means no one is blocked
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // upon connection inform only to user
  socket.emit("message", "Welcome to Chat App");

  // Upon Connection inform to all others except that particular user
  socket.broadcast.emit("message", `User ${socket.id} connected`);


  // Listening for a message event
  socket.on("message", (data) => {
    io.emit("message", `${socket.id}: ${data}`);
  });


  // When user disconnects, inform to all others
  socket.on('disconnect',()=>{
    console.log(`User ${socket.id} Disconnected`);
    socket.broadcast.emit("message", `User ${socket.id} Disconnected`);
  })
  
  // Listen for Activity
  socket.on("activity", (username) => {
    socket.broadcast.emit("activity", ` ${username} is Typing...`);
  });

});
