"use strict"

var moore = require('moore')
var zeros = require("zeros")
var cave = require('cave-automata-2d')

module.exports = function World() {
  if (!(this instanceof World)) return new World()
  this.landscape = generateLandscape()
  this.entities = []
};

function generateLandscape() {
  var world = zeros([120, 40])
  return cave(world, {
    density: 0.37,
    iterations: 4
  })()
}
