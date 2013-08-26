"use strict"

var net = require('net')

var mdmBus = require('mux-demux')()
var players = {}

mdmBus.on('connection', function(stream) {
  var name = stream.meta
  players[name] = stream
  console.log('%s connected.', name)
})

var server = net.createServer(function(client) {
  client.pipe(mdmBus).pipe(client)
})


server.listen(9090)
console.log('server listening on 9090')
