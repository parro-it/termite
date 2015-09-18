const pty = require('pty.js');
const EventEmitter = require('events').EventEmitter;
const hterm = global.hterm;
const lib = global.lib;

function startGui() {
  hterm.defaultStorage = new lib.Storage.Memory();
  const t = new hterm.Terminal('parro-it');

  const termGui = new EventEmitter();
  termGui.write = data => {
    t.io.print(data);
  };

  // t.prefs_.set('background-color', '#fff');

  // Disable bold.
  t.prefs_.set('enable-bold', false);

  // Use this for Solarized Dark
  t.prefs_.set('background-color', '#002b36');
  t.prefs_.set('foreground-color', '#839496');

  t.prefs_.set('color-palette-overrides', [
    '#073642',
    '#dc322f',
    '#859900',
    '#b58900',
    '#268bd2',
    '#d33682',
    '#2aa198',
    '#eee8d5',
    '#002b36',
    '#cb4b16',
    '#586e75',
    '#657b83',
    '#839496',
    '#6c71c4',
    '#93a1a1',
    '#fdf6e3'
  ]);

  t.onTerminalReady = () => {
    // Create a new terminal IO object and give it the foreground.
    // (The default IO object just prints warning messages about unhandled
    // things to the the JS console.)
    const io = t.io.push();

    io.onVTKeystroke = str => {
      termGui.emit('data', str);
    };

    io.sendString = str => {
      termGui.emit('data', str);
    };

    io.onTerminalResize = (columns, rows) => {
      termGui.emit('resize', columns, rows);
    };
  };

  const stdin = document.querySelector('#stdin');
  stdin.addEventListener('blur', () => {
    setTimeout(() => stdin.focus());
  });
  stdin.focus();
  t.keyboard.installKeyboard(stdin);


  t.decorate(document.querySelector('#terminal'));
  return termGui;
}

function startShell() {
  const termGui = startGui();

  const term = pty.spawn('zsh', [], {
    name: 'xterm-color',
    cwd: process.env.HOME,
    env: process.env
  });

  term.on('data', data => {
    termGui.write(data);
  });

  termGui.on('data', key => {
    term.write(key);
  });

  termGui.on('resize', (columns, rows) => {
    term.resize(columns, rows);
  });
}

startShell();
