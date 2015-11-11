'use strict';

const pty = require('pty.js');
const EventEmitter = require('events').EventEmitter;
const htermAll = require('hterm-umd');
const td = require('throttle-debounce');


function createDomElements(elm) {
  const stdout = document.createElement('div');
  stdout.classList.add('terminal');

  elm.appendChild(stdout);

  return {
    stdout: stdout
  };
}

function createTerminal(elms, pkg, app) {
  const hterm = htermAll.hterm;
  const lib = htermAll.lib;
  hterm.defaultStorage = new lib.Storage.Memory();
  const t = new hterm.Terminal();
  pkg.initializeTerminal(t);

  const termGui = new EventEmitter();
  termGui.write = data => {
    t.io.print(data);
  };

  t.setWindowTitle = td.debounce(300, title => {
    app.tabs.current().setTitle(title);
  });

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

  t.decorate(elms.stdout);

  termGui.t = t;
  return termGui;
}

function createShellProcess() {
  const proc = pty.spawn(process.env.SHELL, [], {
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


class ShellComponent extends EventEmitter {
  constructor(app, pkg) {
    super();
    this.element = document.createElement('main');
    this.process = createShellProcess();
    this.children = createDomElements(this.element);

    setImmediate(() => {
      this.terminal = createTerminal(this.children, pkg, app);
      this.hterm = this.terminal.t;
      this.hterm.installKeyboard();
      setupEvents(this.process, this.terminal);
      this.process.on('exit', () => {
        this.emit('process-closed');
      });
    });
  }

  sendKey(k, type) {
    const evt = new KeyboardEvent(type);
    Object.defineProperty(evt, 'keyCode', {
      get() {
        return k;
      }
    });
    Object.defineProperty(evt, 'which', {
      get() {
        return k;
      }
    });

    this.hterm.keyboard.onKeyDown_(evt);
  }

  close() {
    this.element.remove();
  }

  activate() {
    if (this.hterm) {
      this.hterm.installKeyboard();
    }

    this.element.style.display = '';


    this.children.stdout.focus();
  }

  deactivate() {
    if (this.hterm) {
      this.hterm.uninstallKeyboard();
    }
    this.element.style.display = 'none';
  }
}

module.exports = ShellComponent;
