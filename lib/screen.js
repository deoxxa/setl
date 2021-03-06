var events = require("events"),
    Jetty = require("jetty"),
    ndarray = require("ndarray"),
    ndarrayFill = require("ndarray-fill"),
    stream = require("stream"),
    zeros = require("zeros");

var Screen = module.exports = function Screen(options) {
  stream.Readable.call(this);

  options = options || {};

  this._layers = options.layers;

  this._tty = new Jetty();
  this._tty.on("data", this.push.bind(this));

  this._previous = zeros([80, 24]);
  this._buffer = zeros([80, 24]);

  this._tty.hide().clear();

  this.render();
};
Screen.prototype = Object.create(stream.Duplex.prototype, {constructor: {value: Screen}});

Screen.prototype.characters = " .#@".split("");

Screen.prototype._read = function _read(n) {};

Screen.prototype.reset = function reset() {
  this._tty.show();
};

Screen.prototype.render = function render(offsetX, offsetY) {
  ndarrayFill(this._buffer, function() { return 0; });

  // squash all our layers into one buffer. skip "transparent" (0-value) pixels.

  for (var i=0;i<this._layers.length;++i) {
    var layer = this._layers[i].lo(offsetX, offsetY).hi(80, 24);

    for (var x=0;x<80;++x) {
      for (var y=0;y<24;++y) {
        var pixel = layer.get(x, y);

        // skip compositing "transparent" pixels
        if (pixel === 0) {
          continue;
        }

        // write the pixel to our buffer
        this._buffer.set(x, y, pixel);
      }
    }
  }

  // compare our buffer to the previous screen contents, render the pixels that
  // need rendering. skip any pixels that don't need to be rendered because they
  // haven't changed.

  for (var y=0;y<24;++y) {
    var currentX = null;

    for (var x=0;x<80;++x) {
      var pixel = this._buffer.get(x, y);

      // only actually output the pixel if it's changed on the screen
      if (this._previous.get(x, y) === pixel) {
        continue;
      }

      // move to the correct position if we need to
      if (currentX !== x) {
        this._tty.moveTo([y, x]);
      }

      // render this pixel
      this._tty.text(this.characters[pixel]);

      // mark the last known value for this pixel
      this._previous.set(x, y, pixel);

      // record where our cursor should be now
      currentX = x + 1;
    }
  }
};
