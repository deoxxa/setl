"use strict"

var through = require("through2");
var zeros = require("zeros")
var keypress = require("keypress");

var Cursor = module.exports = function Cursor(options) {
  this.x = 0;
  this.y = 0;
  this.data = zeros([120, 40])
  this.input = through()
  keypress(this.input)
  var self = this
  this.input.on("keypress", function(char, key) {
      self.data.set(self.x, self.y, 0)
      if (!key || !key.name) {
        return;
      }

      switch (key.name) {
        case "left":  self.x--; break;
        case "right": self.x++; break;
        case "up":    self.y--; break;
        case "down":  self.y++; break;
      }
      self.data.set(self.x, self.y, 3)
    })
}



