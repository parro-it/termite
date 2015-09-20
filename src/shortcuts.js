const app = require('app');
const globalShortcut = require('global-shortcut');
const BrowserWindow = require('browser-window');

function newTab() {
  const win = BrowserWindow.getFocusedWindow();
  win.webContents.send('new-tab');
}

module.exports = function registerShortcuts() {
  app.on('browser-window-focus', () => {
    globalShortcut.register('CmdOrCtrl+T', newTab);
  });

  app.on('browser-window-blur', () => {
    globalShortcut.unregister('CmdOrCtrl+T');
  });
};
