// Short revision of EventEmitter

const { EventEmitter } = require("events");

const Player = new EventEmitter();

Player.on("shot", (number) => {
  console.log(`Player ${number} got Injured`);
});

Player.on("dead", (number) => {
  console.log(`Player ${number}  is Dead`);
});

Player.emit("shot", 2);
Player.emit("dead", 1);
Player.emit("shot", "Bob");