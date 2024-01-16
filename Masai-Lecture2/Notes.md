- Server Side Implementation

  - Install socket.io lobrary from npm
  - Create a server (we can't attach an Express server to socket server, more on this while Implementing)
  - Listen/emit, events once the server is running
  <hr/>

- Client Side Implementation

  - create a html file
  - Import socket.io via cdn link and use the io methods
  - Listen/emit events

- socket.emit() -> sends to that particular client
- socket.broadcast.emit() -> want to send to everyone except that user
- io.emit-> sends to everyone [io me websocket server name]
