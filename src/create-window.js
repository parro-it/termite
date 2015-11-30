'use strict';

const createWindow = require('electron-window').createWindow;
const resolve = require('path').resolve;

module.exports = function createTermiteWindow() {
  const appIcon = resolve(__dirname, 'assets/icon.png');

  const win = createWindow({
    resizable: true,
    icon: appIcon,
    'accept-first-mouse': true,
    frame: false
  });
  win._loadUrlWithArgs(__dirname + '/assets/index.html', () => {});
  return win;
};
