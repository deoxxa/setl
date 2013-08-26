var events = require("events"),
    Jetty = require("jetty");

var Screen = module.exports = function Screen(options) {
  events.EventEmitter.call(this);

  this._out = options.out;
  this._tty = new Jetty(this._out);

  this._scrollX = null;
  this._scrollY = null;
  this._cursorX = null;
  this._cursorY = null;
  this._sizeX = null;
  this._sizeY = null;

  this._out.on("resize", this.resizeHandler.bind(this));

  this.scrollTo(0, 0);
  this.cursorTo(0, 0);
  this.resizeHandler();

  this.render();
};
Screen.prototype = Object.create(events.EventEmitter.prototype, {constructor: {value: Screen}});

Screen.prototype.resizeHandler = function resizeHandler() {
  this._sizeX = this._out.columns;
  this._sizeY = this._out.rows;

  this.render();
};

Screen.prototype.render = function render() {
  // make the screen sane to work with
  this._tty.clear();

  //
  // cursor
  //

  if (Math.abs(this._cursorX - this._scrollX) > Math.floor(this._sizeX / 2)) {
    this.scrollTo(this._cursorX, this._scrollY);
  }

  if (Math.abs(this._cursorY - this._scrollY) > Math.floor(this._sizeY / 2)) {
    this.scrollTo(this._scrollX, this._cursorY);
  }

  this._tty.moveTo([Math.floor(this._sizeY / 2) + (0 - (this._cursorY - this._scrollY)), Math.floor(this._sizeX / 2) + this._cursorX - this._scrollX]);
  this._tty.text("@");

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
