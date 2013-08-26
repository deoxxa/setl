#!/usr/bin/env node

var Screen = require("./lib/screen"),
    World = require("./lib/world");

var world = World();

var screen = new Screen({
  layers: [
    world.landscape,
  ],
});

screen.pipe(process.stdout);

screen.render(0, 0);

process.stdin.resume();
