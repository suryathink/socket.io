const express = require("express");
const { Server } = require("socket.io");
const path = require("path");
const { fileURLToPath } = require("url");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;

const ADMIN = "Admin";

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
  // upon connection inform only to user
  socket.emit("message", buildMsg(ADMIN, "Welcome to Chat App"));

  socket.on("enterRoom", ({ name, room }) => {
    // leave previous room if he was in previous room
    const prevRoom = getUser(socket.id)?.room;

    if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit(
        "message",
        buildMsg(ADMIN, `${name} has left the room`)
      ); // it will only broadcast to the previous room
    }

    const user = activateUser(socket.id, name, room);

    // cannot update previous room users list until after the state update in activate user

    if (prevRoom) {
      io.to(prevRoom).emit("userList", {
        users: getUsersInRoom(prevRoom),
      });
    }

    // Join the new Room
    socket.join(user.room);

    // To user who joined
    socket.emit(
      "message",
      buildMsg(ADMIN, `You have joined the ${user.room} chat room`)
    );

    // To Everyone else
    socket.broadcast
      .to(user.room)
      .emit("message", buildMsg(ADMIN, `${user.name} has joined the room`));
  });

  // update user list for room
  io.to(user.room).emit("userList", {
    users: getUsersInRoom(user.room),
  });

  //  update rooms list for everyone
  io.emit("roomList", {
    rooms: getAllActiveRooms(),
  });

  // When user disconnects, inform to all others
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    userLeavesApp(user);
    if (user) {
      io.to(user.room).emit(
        "message",
        buildMsg("ADMIN", `${user.name} has left the room`)
      );

      io.to(user.room).emit("userList", {
        users: getUsersInRoom(user.room),
      });
      io.emit("roomList", {
        rooms: getAllActiveRooms,
      });
    }
    console.log(`User ${socket.id} disconnected`);
  });

  // Listening for a message event
  socket.on("message", ({ name, text }) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      io.to(room).emit("message", buildMsg(name, text));
    }
  });

  // Listen for Activity
  socket.on("activity", (name) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      socket.broadcast.to(room).emit("activity", name);
    }
  });
});

function buildMsg(name, text) {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date()),
  };
}

// State for users
const UsersState = {
  users: [],
  setUsers: function (newUsersArray) {
    this.users = newUsersArray;
  },
};

//  User Functions
function activateUser(id, name, room) {
  const user = { id, name, room };
  UsersState.setUsers([
    ...UsersState.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
}

function userLeavesApp(id) {
  UsersState.setUsers([UsersState.users.filter((user) => user.id !== id)]);
}

function getUser(id) {
  return UsersState.users.find((user) => user.id === id);
}

function getUsersInRoom(room) {
  return UsersState.users.find((user) => user.room === room);
}

function getAllActiveRooms() {
  return Array.from(new Set(UsersState.users.map((user) => user.room)));
}
