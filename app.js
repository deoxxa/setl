#!/usr/bin/env node

var keypress = require("keypress");

var Screen = require("./lib/screen"),
    World = require("./lib/world");

keypress(process.stdin);

var screen = new Screen({
  world: World(),
});

screen.pipe(process.stdout);

screen.on("cursor", screen.render.bind(screen));
screen.on("scroll", screen.render.bind(screen));

process.stdin.on("keypress", function(char, key) {
  if (key && key.ctrl && key.name === "c") {
    screen.reset();
    return process.stdin.pause();
  }

  var x = 0, y = 0;

  switch (key.name) {
    case "left":  x = -1; break;
    case "right": x =  1; break;
    case "down":  y = -1; break;
    case "up":    y =  1; break;
  }

  if (key.shift) {
    screen.scrollBy(x, y);
  } else {
    screen.cursorBy(x, y);
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
