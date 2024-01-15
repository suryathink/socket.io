const { EventEmitter } = require("events");

const Button = new EventEmitter();

Button.on("click", () => {
  console.log("button clicked");
});

Button.emit("click");

Button.on("xyz", () => {
  console.log("Event xyz clicked");
});

Button.emit("xyz");



//  Another Example

const Player = new EventEmitter();

let energy = 100;

Player.on("dead", () => {
  console.log("Player had Died");
});

Player.on("shot", () => {
  console.log("Player Injured");
  energy -= 50;
  if (energy <= 0) {
    Player.emit("dead");
  }
});

Player.on("hadfood", () => {
  console.log("Player had Food");
  energy += 20;
});

// Run `node index.js` to see the output
Player.emit("shot"); //? here output will be "Player Injured"
Player.emit("shot"); //? here output will be "Player had Died"
