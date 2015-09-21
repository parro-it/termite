'use strict';

const pty = require('pty.js');
const EventEmitter = require('events').EventEmitter;
const hterm = global.hterm;
const loadConfig = require('../../load-config');

function createDomElements(elm) {
  const stdin = document.createElement('input');
  stdin.classList.add('stdin');
  stdin.type = 'text';

  const stdout = document.createElement('div');
  stdout.classList.add('terminal');

  elm.appendChild(stdin);
  elm.appendChild(stdout);

  return {
    stdin: stdin,
    stdout: stdout
  };
}

function createTerminal(elms) {
  const config = loadConfig();
  hterm.defaultStorage = config.prefs;
  const t = new hterm.Terminal();
  config.load(t);

  const termGui = new EventEmitter();
  termGui.write = data => {
    t.io.print(data);
  };

  t.setWindowTitle = title => {
    const elm = document.querySelector('.chrome-tab-current .chrome-tab-title');
    elm.textContent = title;
  };

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
/*
  const closeTab = elms.tab.querySelector('.chrome-tab-close');
  closeTab.addEventListener('click', () => {
    elms.stdin.remove();
    elms.stdout.remove();
    termGui.emit('closed');
  });
*/

  t.keyboard.installKeyboard(elms.stdin);
  t.decorate(elms.stdout);
  return termGui;
}

function createShellProcess() {
  const proc = pty.spawn('zsh', [], {
    name: 'xterm-color',
    cwd: process.env.HOME,
    env: process.env
  });
  return proc;
}

function setupEvents(process, terminal) {
  process.on('data', data => {
    terminal.write(data);
  });

  terminal.on('data', key => {
    process.write(key);
  });

  terminal.on('closed', () => {
    process.destroy();
  });

  terminal.on('resize', (columns, rows) => {
    process.resize(columns, rows);
  });
}


class ShellComponent {
  constructor() {
    this.element = document.createElement('main');
    this.process = createShellProcess();
    this.children = createDomElements(this.element);

    setImmediate(() => {
      this.terminal = createTerminal(this.children);
      setupEvents(this.process, this.terminal);
    });
  }

  close() {
    this.element.remove();
  }

  _resetFocus(e) {
    setTimeout(() => e.target.focus());
  }

  activate() {
    this.element.style.display = '';
    this.children.stdin.addEventListener('blur', this._resetFocus);
    this.children.stdin.focus();
  }

  deactivate() {
    this.element.style.display = 'none';
    this.children.stdin.removeEventListener('blur', this.resetFocus);
  }
}

module.exports = ShellComponent;
