const commands = {};


module.exports = {
  register(command, handler) {
    commands[command] = handler;
  },
  all() {
    return Object.keys(commands);
  },
  init() {
    const ipc = require('ipc');
    ipc.on('exec-command', command => this.execute(command));
  },

  execute(command, arg) {
    const isRenderer = require('is-electron-renderer');

    if (!isRenderer) {
      const BrowserWindow = require('browser-window');
      const win = BrowserWindow.getFocusedWindow();
      if (!win) {
        return;
      }
      win.webContents.send('exec-command', command);
    } else {
      commands[command](arg);
    }
  }
};
