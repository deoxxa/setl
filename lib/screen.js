var events = require("events"),
    Jetty = require("jetty"),
    stream = require("stream");

var Screen = module.exports = function Screen(options) {
  stream.Duplex.call(this);

  options = options || {};

  this._world = options.world;

  this._tty = new Jetty();
  this._tty.on("data", this.push.bind(this));

  this._scrollX = null;
  this._scrollY = null;
  this._cursorX = null;
  this._cursorY = null;
  this._sizeX = options.size && options.size.x || 80;
  this._sizeY = options.size && options.size.y || 24;

  this._lastValues = new Buffer(80 * 24);
  this._lastValues.fill(255);

  this.scrollTo(0, 0);
  this.cursorTo(0, 0);

  this.render();
};
Screen.prototype = Object.create(stream.Duplex.prototype, {constructor: {value: Screen}});

Screen.prototype.characters = ".#".split("");

Screen.prototype._write = function _write(input, encoding, done) {};

Screen.prototype._read = function _read(n) {};

Screen.prototype.render = function render() {
  //
  // cursor
  //

  if (Math.abs(this._cursorX - this._scrollX) > Math.floor(this._sizeX / 2)) {
    this.scrollTo(this._cursorX, this._scrollY);
  }

  if (Math.abs(this._cursorY - this._scrollY) > Math.floor(this._sizeY / 2)) {
    this.scrollTo(this._scrollX, this._cursorY);
  }

  var pixels = this._world.hi(this._scrollX + 80, this._scrollY + 24).lo(this._scrollX, this._scrollY);

  for (var y=0;y<24;++y) {
    for (var x=0;x<80;++x) {
      var p = pixels.get(x, y);

      if (this._lastValues[y * 80 + x] !== p) {
        this._tty.moveTo([y, x]).text(this.characters[p]);
        this._lastValues[y * 80 + x] = p;
      }
    }
  }

  var cy = Math.floor(this._sizeY / 2) + (0 - (this._cursorY - this._scrollY)),
      cx = Math.floor(this._sizeX / 2) + this._cursorX - this._scrollX;

  this._tty.moveTo([cy, cx]);
  this._tty.text("@");
  this._lastValues[cy * 80 + cx] = "@".charCodeAt(0);

  this._tty.moveTo([0, 0]).text([this._cursorX, this._cursorY].join(","));
};

Screen.prototype.cursorBy = function cursorBy(x, y) {
  this._cursorX += x;
  this._cursorY += y;

  this.emit("cursor");
};

Screen.prototype.cursorTo = function cursorTo(x, y) {
  this._cursorX = x;
  this._cursorY = y;

  this.emit("cursor");
};

Screen.prototype.scrollBy = function scrollBy(x, y) {
  this._scrollX += x;
  this._scrollY += y;

  this.emit("scroll");
};

Screen.prototype.scrollTo = function scrollTo(x, y) {
  this._scrollX = x;
  this._scrollY = y;

  this.emit("scroll");
};
