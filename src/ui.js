const pty = require('pty.js');
const EventEmitter = require('events').EventEmitter;
const hterm = global.hterm;
const loadConfig = require('./load-config');
const tabsManager = require('./tabs-manager');
const uuid = require('node-uuid');
const ipc = require('ipc');

function createDomElements() {
  const id = '__' + uuid.v4().replace(/-/g, '');
  const stdin = document.createElement('input');
  stdin.id = id + '-stdin';
  stdin.classList.add('stdin');
  stdin.type = 'text';

  const terminal = document.createElement('div');
  terminal.classList.add('terminal');
  terminal.id = id + '-stdout';

  document.body.appendChild(stdin);
  document.body.appendChild(terminal);

  const resetFocus = e => {
    setTimeout(() => e.target.focus());
  };


  const deactivateTab = () => {
    const currentTab = document.querySelector('.chrome-tab-current');

    if (currentTab === null) {
      return;
    }

    const tabId = currentTab.id;
    const currentStdin = document.querySelector(`#${tabId}-stdin`);
    const currentStdout = document.querySelector(`#${tabId}-stdout`);
    currentStdout.style.display = 'none';
    currentStdin.style.display = 'none';
    currentStdin.removeEventListener('blur', resetFocus);
  };


  const keepFocus = () => {
    stdin.addEventListener('blur', resetFocus);
    stdin.focus();
  };

  const activateTab = () => {
    stdin.style.display = '';
    terminal.style.display = '';
    keepFocus();
  };

  deactivateTab();
  const tab = tabsManager.addTab(id);
  activateTab();

  tab.addEventListener('mouseup', () => {
    deactivateTab();
    activateTab();
  });

  const closeTab = tab.querySelector('.chrome-tab-close');
  closeTab.addEventListener('click', () => {
    const tabs = document.querySelectorAll('.chrome-tab');
    if (tabs.length === 0) {
      startShell(); // eslint-disable-line
    }
    const click = new Event('click');
    tabs[0].dispatchEvent(click);
    const mouseup = new Event('mouseup');
    tabs[0].dispatchEvent(mouseup);
  });

  return {
    tab: tab,
    stdin: stdin,
    stdout: terminal
  };
}

function startGui() {
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


  const elms = createDomElements();

  const closeTab = elms.tab.querySelector('.chrome-tab-close');
  closeTab.addEventListener('click', () => {
    elms.stdin.remove();
    elms.stdout.remove();
    termGui.emit('closed');
  });


  t.keyboard.installKeyboard(elms.stdin);
  t.decorate(elms.stdout);
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

  termGui.on('closed', () => {
    term.destroy();
  });

  termGui.on('resize', (columns, rows) => {
    term.resize(columns, rows);
  });
}

startShell();

ipc.on('new-tab', startShell);
