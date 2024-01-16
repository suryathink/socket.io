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

  socket.on("message", (data) => {
    // console.log(data);
    io.emit("message", `${socket.id}: ${data}`);
  });
});
