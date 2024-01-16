/*
 we have to attach a normal http server with a socket.io server

application building using socket.io

 const express = require("express");  //? Not Supported in Socket

 importing web socket server
const { Server } = require("socket.io");

const app = express();

const websocketserver = new Server(app); // creating socket server and attaching the normal http server `app` with that

app.get("/", (req, res) => {
  res.send("Base End Point");
});

app.listen(8080, () => {
  console.log("Listening on Port 8080");
});

 normal server running on 8080 port
  attach a web socket server
 normal server created using express does not supported by socket

*/
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app); // creating a server for web socket with the help of http server as web socket doesn't take express server directly as attachment

app.get("/", (req, res) => res.send("Helo from backend"));

server.listen(8000);

// in docs `websocketserver` is named as io

const websocketserver = new Server(server); // creating a web socket server

let count = 0;

websocketserver.on("connection", (socket) => {
  count++;
  socket.broadcast.emit("newuser", count);
  console.log("Current Count of User is :", count);

  websocketserver.emit("usercount", count); // sends to every user

  socket.emit("message", "Hello from Server");

  socket.on("message", (msg) => {
    console.log("Message From Client Side " + msg + "");
    socket.emit("message", "message recieved in the Server");
  });

  socket.on("disconnect", () => {
    count--;
    console.log("Current Count of User is :", count);
    websocketserver.emit("usercount", count);
  });
});

// we will be listening like this from client side

// Problem Statement
// Build Something that says Currently XYZ Number of People online
