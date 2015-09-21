const tabs = require('./tabs');
const commands = require('./commands');

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

module.exports = {
  window: null,

  tabs: tabs,
  commands: commands,

  quit() {
    this.commands.execute('quit');
  },

  initRenderer() {
    this.tabs.init();
    this.commands.init();

    require('./packages/core')(this);
    require('./packages/shell')(this);
  },

  start() {
    const window = require('electron-window');

    const appIcon = __dirname + '/../resources/icon.png';

    this.window = window.createWindow({
      resizable: true,
      icon: appIcon
    });

    setupMenus(template, this);

    this.window.showUrl(__dirname + '/index.html', () => {
      this.window.maximize();
    });
  }
};
