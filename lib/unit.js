"use strict"

module.exports = Unit

var art = require('../texture-map')

function Unit(pos) {
  this.pos = pos || [0, 0]
  this.template = art.UNIT
}

Unit.prototype.render = function(layer) {
  this.layer.set(this.pos[0], this.pos[1], this.template)
}

