const tabs = require('./tabs');
const commands = require('./commands');
const config = require('./config');
const EventEmitter = require('events').EventEmitter;

const template = [{
  label: 'File',
  submenu: [{
    label: 'New tab',
    accelerator: 'CmdOrCtrl+T',
    command: 'new-tab'
  }, {
    label: 'Exit',
    accelerator: 'CmdOrCtrl+F10',
    command: 'quit'
  }]
}];


function setupMenus(menuTemplate, termiteApp) {
  const globalShortcut = require('global-shortcut');
  const Menu = require('menu');
  const app = require('app');

  const instrumentMenu = (menus) => {
    menus.forEach(m => {
      if (m.command) {
        const handler = () => {
          termiteApp.commands.execute(m.command);
        };
        m.click = handler;

        if (m.accelerator) {
          const shortcut = m.accelerator;
          delete m.accelerator;

          app.on('browser-window-focus', () => {
            globalShortcut.register(shortcut, handler);
          });

          app.on('browser-window-blur', () => {
            globalShortcut.register(shortcut, handler);
          });
        }
      }

      if (m.submenu) {
        instrumentMenu(m.submenu);
      }
    });
  };

  instrumentMenu(menuTemplate);
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

module.exports = Object.assign(new EventEmitter(), {
  window: null,

  tabs: tabs,
  commands: commands,
  config: config,

  quit() {
    this.commands.execute('quit');
  },

  initRenderer() {
    this.tabs.init(this);
    this.commands.init(this);
    this.config.init(this);
    this.emit('api-init-done');

    this.packages = {};
    this.packages.core = require('../packages/core')(this);
    this.packages.shell = require('../packages/shell')(this);

    this.emit('packages-init-done');
    setImmediate(() => this.emit('dom-available'));
  },

  start() {
    const window = require('electron-window');

    const appIcon = __dirname + '/../../resources/icon.png';

    this.window = window.createWindow({
      resizable: true,
      icon: appIcon
    });

    setupMenus(template, this);

    this.window.showUrl(__dirname + '/../main-window/index.html', () => {
      this.window.maximize();
    });
  }
});
