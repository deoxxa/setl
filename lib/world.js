"use strict"

var moore = require('moore')
var zeros = require("zeros")

//Creates a 64x64 ndarray over a float64array filled with 0

module.exports = function() {
  var world = zeros([64, 64])
  moore(3, 2).forEach(function(x, y) {
    world.set(x + 32, y + 32, 1)
  })
  return world
};
