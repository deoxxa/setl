"use strict"

var moore = require('moore')
var zeros = require("zeros")
var cave = require('cave-automata-2d')
//Creates a 64x64 ndarray over a float64array filled with 0

module.exports = function() {
  var world = zeros([120, 40])
  return cave(world, {
    density: 0.37,
    iterations: 4
  })()
};
