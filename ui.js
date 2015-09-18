const hypernal = require('hypernal');
const pty = require('pty.js');
const cursor = require('hypernal/lib/cursor');
const Vt100KeysSource = require('./vt100-keyevent');

function startGui() {
  const termGui = hypernal({ tail: true });
  const Terminal = termGui.term.constructor;
  termGui.tail = true;

  termGui.writeln = function writeln(line) {
    this.term.writeln(line);
  };

  termGui.write = function write(data) {
    this.term.write(data);
  };


  // Terminal.cursorBlink = true;
  cursor(Terminal);
  Terminal.prototype.cursorBlink = function cursorBlink() {
    this.cursorState ^= 1;
    this.refresh(this.y, this.y);
  };

  const originalRefresh = Terminal.prototype.refresh;

  Terminal.prototype.refresh = function refresh(start, end) {
    window.requestAnimationFrame(() => {
      originalRefresh.call(this, start, end);
      document.body.scrollTop = document.body.scrollHeight;
    });
  };


  termGui.term.showCursor();
  termGui.term.startBlink();
  termGui.appendTo('body');

  const keySource = new Vt100KeysSource(document.body);
  termGui.on = keySource.on.bind(keySource);
  return termGui;
}

function startShell() {
  const cols = Math.round(window.innerWidth / 14);
  const rows = Math.round(window.innerHeight / 27);

  const termGui = startGui({
    cols: cols,
    rows: rows
  });

  const term = pty.spawn('zsh', [], {
    name: 'xterm-color',
    cols: cols,
    rows: rows,
    cwd: process.env.HOME,
    env: process.env
  });

  term.on('data', data => {
    termGui.write(data);
  });

  termGui.on('data', key => {
    term.write(key);
  });

  term.write('ls /\r');
}

startShell();
