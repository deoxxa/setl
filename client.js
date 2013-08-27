"use strict"

var net = require('net')

process.stdin.setRawMode(true);
process.stdin.pipe(net.connect(9090)).pipe(process.stdout)
