const hypernal = require('hypernal');
const pty = require('pty.js');
const cursor = require('hypernal/lib/cursor');
const Vt100KeysSource = require('./vt100-keyevent');

function startGui() {
  const termGui = hypernal({ tail: true });
  termGui.tail = true;


  termGui.term.constructor.cursorBlink = true;
  cursor(termGui.term.constructor);
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
