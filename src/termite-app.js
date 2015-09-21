const tabs = require('./tabs');

module.exports = {
  window: null,

  tabs: tabs,

  quit() {
    this.window.close();
  },

  start() {
    const window = require('electron-window');
    const Menu = require('menu');
    const registerShortcuts = require('./shortcuts');

    const appIcon = __dirname + '/../resources/icon.png';

    this.window = window.createWindow({
      resizable: true,
      icon: appIcon
    });

    const template = [{
      label: 'File',
      submenu: [{
        label: 'New tab',
        accelerator: 'CmdOrCtrl+T',
        click: () => this.window.webContents.send('new-tab')
      }, {
        label: 'Exit',
        accelerator: 'CmdOrCtrl+F10',
        click: () => this.quit()
      }]
    }];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    registerShortcuts();

    this.window.showUrl(__dirname + '/index.html', () => {
      this.window.maximize();
    });
  }
};
