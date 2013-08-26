"use strict"

var net = require('net')

var mdmBus = require('mux-demux')()

mdmBus.pipe(net.connect(9090)).pipe(mdmBus)

var stream = mdmBus.createStream(process.env.USER)
process.stdin.pipe(stream).pipe(process.stdout)
