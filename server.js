"use strict"

var net = require("net"),
    keypress = require("keypress");

var World = require("./lib/world"),
    Screen = require("./lib/screen"),
    Cursor = require("./lib/cursor");

var players = {};

var world = new World();

var server = net.createServer(function(socket) {
  var cursor = new Cursor()
  var screen = new Screen({
    layers: [
      world.landscape,
      world.actors,
      cursor.data
    ],
  })

  screen
  .pipe(socket)
  .pipe(cursor.input)

  var x = 0, y = 0;

  setInterval(function() {
    screen.render(x, y);
  }, 100)

  keypress(socket)

  socket.on("keypress", function(char, key) {
    if (!key || !key.name) {
      return;
    }

    //switch (key.name) {
      //case "left":  x--; break;
      //case "right": x++; break;
      //case "up":    y--; break;
      //case "down":  y++; break;
    //}

    if (key.name === "escape") {
      socket.end();
      screen.unpipe(socket);
    }
  })
})

server.listen(9090)
console.log('server listening on 9090')
