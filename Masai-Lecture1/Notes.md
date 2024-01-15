- This is the Notes of Lecture 01

`Client Side Code Inside Browser Console`

```js
const socket = new WebSocket("ws://localhost:8500");

socket.onopen = () => {
  console.log("Connected to Server!");
  socket.send("Hey From Client"); // this will send message to server
};

// this function will receive message from the server and will print into browser's console
socket.onmessage = (event) => {
  console.log(event.data);
};
```

Web Sockets

"event-driven architecture"
