const EventEmitter = require('events').EventEmitter;
const keys = require('./keys');
// const printable = require('printable-string');
const VT100_ESCAPES = {};

function initVt100Escapes() {
  VT100_ESCAPES[keys.DOM_VK_TAB] = '\t';
  VT100_ESCAPES[keys.DOM_VK_RIGHT] = '\x1b[C';
  VT100_ESCAPES[keys.DOM_VK_LEFT] = '\x1b[D';
  VT100_ESCAPES[keys.DOM_VK_UP] = '\x1b[A';
  VT100_ESCAPES[keys.DOM_VK_DOWN] = '\x1b[B';
  VT100_ESCAPES[keys.DOM_VK_DELETE] = '\x1b[3~';
  VT100_ESCAPES[keys.DOM_VK_ESCAPE] = '\x1b';
  VT100_ESCAPES[keys.DOM_VK_BACK_SPACE] = '\x7f';
  VT100_ESCAPES[keys.DOM_VK_HOME] = '\x1bOH';
  VT100_ESCAPES[keys.DOM_VK_END] = '\x1bOF';
  VT100_ESCAPES[keys.DOM_VK_PAGE_UP] = '\x1b[5~';
  VT100_ESCAPES[keys.DOM_VK_PAGE_DOWN] = '\x1b[6~';
  VT100_ESCAPES[keys.DOM_VK_INSERT] = '\x1b[2~';

  VT100_ESCAPES[keys.DOM_VK_F1] = '\x1bOP';
  VT100_ESCAPES[keys.DOM_VK_F2] = '\x1bOQ';
  VT100_ESCAPES[keys.DOM_VK_F3] = '\x1bOR';
  VT100_ESCAPES[keys.DOM_VK_F4] = '\x1bOS';
  VT100_ESCAPES[keys.DOM_VK_F5] = '\x1b[15~';
  VT100_ESCAPES[keys.DOM_VK_F6] = '\x1b[17~';
  VT100_ESCAPES[keys.DOM_VK_F7] = '\x1b[18~';
  VT100_ESCAPES[keys.DOM_VK_F8] = '\x1b[19~';
  VT100_ESCAPES[keys.DOM_VK_F9] = '\x1b[20~';
  VT100_ESCAPES[keys.DOM_VK_F10] = '\x1b[21~';
  VT100_ESCAPES[keys.DOM_VK_F11] = '\x1b[23~';
  VT100_ESCAPES[keys.DOM_VK_F12] = '\x1b[24~';
}


initVt100Escapes();

function Vt100KeysSource(elm) {
  EventEmitter.call(this);

  elm.addEventListener('keypress', this._onKeypress.bind(this));
  elm.addEventListener('keydown', this._onKeydown.bind(this));
}

const proto = Vt100KeysSource.prototype = new EventEmitter();
module.exports = Vt100KeysSource;

proto._onKeypress = function _onKeypress(e) {
  e.preventDefault();
  e.stopPropagation();

  this.emit('data', String.fromCharCode(e.keyCode));
  return false;
};

proto._onKeydown = function _onKeydown(e) {
  if (e.keyCode in VT100_ESCAPES) {
    const escaped = VT100_ESCAPES[e.keyCode];
    this.emit('data', escaped);
    // console.log(printable(escaped));
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  // ctrl + letter
  if (e.ctrlKey && e.keyCode >= keys.DOM_VK_A && e.keyCode <= keys.DOM_VK_Z) {
    this.emit('data', String.fromCharCode(e.keyCode - keys.DOM_VK_A + 1));
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
};

