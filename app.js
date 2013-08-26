#!/usr/bin/env node

var keypress = require("keypress");

var Screen = require("./lib/screen"),
    World = require("./lib/world");

keypress(process.stdin);

var screen = new Screen({
  in: process.stdin,
  out: process.stdout,
});

screen.on("cursor", screen.render.bind(screen));
screen.on("scroll", screen.render.bind(screen));

process.stdin.on("keypress", function(char, key) {
  if (key && key.ctrl && key.name === "c") {
    return process.stdin.pause();
  }

  switch (key.name) {
    case "left":  screen.cursorBy(-1, 0); break;
    case "right": screen.cursorBy(+1, 0); break;
    case "down":  screen.cursorBy(0, -1); break;
    case "up":    screen.cursorBy(0, +1); break;
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
