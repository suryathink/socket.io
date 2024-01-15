const { WebSocketServer } = require("ws"); // importing ws and destructuring and getting WebSocketServer

// wss -> web socket server
const wss = new WebSocketServer({ port: 8500 }); // setting up WebSocketServer along with its port

wss.on("connection", (socket) => {
  //establishing a connection, 'connection keyword is important'
  console.log("A new connection established"); // when connection gets established with client , then this concole statement will get print

  socket.send("Hello from Server"); // sending message from server to client

  socket.on("message", (msg) => {
    // in this callback you can use whatever message the client is Sending
    console.log(msg.toString()); // msg will come in Buffer, you have to convert into String
  });
});


/* Problem Statement
- if Client is sending -"hey"
- server should send - "hello"

- if client is sending- "bye"
- then server should send - "ta ta"  
*/


//? Solution

const wss1 = new WebSocketServer({ port: 8400 })
wss1.on("connection",(socket)=>{

    socket.on("message",(msg)=>{
        if (msg.toString() === "hey"){
            socket.send("hello")
        }

        if (msg.toString()==="bye"){
            socket.send("ta ta")
        }
    })


    socket.on("close",()=>{
      console.log("Client Disconnected")
    })
})
