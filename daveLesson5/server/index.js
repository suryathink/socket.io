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
  console.log(`User ${socket.id} connected`);

  // upon connection inform only to user
  socket.emit("message",buildMsg(ADMIN,"Welcome to Chat App"));

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

// State for users
const UsersState = {
  users:[],
  setUsers: function(newUsersArray){
    this.users= newUsersArray
  }
}


function buildMsg(name,text){
  return {
    name,
    text,
    time: new Intl.DateTimeFormat('default',{
      hour:"numeric",
      minute:"numeric",
      second:"numeric"
    }).format(new Date())
  }
}

//  User Functions
function activateUser(id,name,room){
 const user = {id,name,room}
 UsersState.setUsers([
    ...UsersState.users.filter(user => user.id !== id),
    user
 ])
 return user
}

function userLeavesApp(id){
  UsersState.setUsers([
   UsersState.users.filter(user => user.id !== id)
 ])
}

function getUser(id){
  return UsersState.users.find(user => user.id === id)
}

function getUsersInRoom(room){
  return UsersState.users.find(user => user.room === room)
}

function getAllActiveRooms(){
  return Array.from(new Set(UsersState.users.map(user => user.room)))
}