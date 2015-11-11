'use strict';

function start() {
  require('app-title')('termite - main process');
  const resolve = require('path').resolve;
  const app = require('app');
  const electronDebug = require('electron-debug');
  const createWindow = require('electron-window').createWindow;

  if (process.env.DEBUG) {
    electronDebug();
  }

  process.on('uncaughtException', function(err) {
    process.stdout.write('Uncaught exception: \n\n' + err.stack + '\n\n');
  });

  app.on('ready', () => {
    const appIcon = resolve(__dirname, '/../media/icon.png');

    const win = createWindow({
      resizable: true,
      icon: appIcon,
      'accept-first-mouse': true,
      frame: false
    });

    win.showUrl(__dirname + '/assets/index.html', { show: false });
  });

  app.on('window-all-closed', function onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

const electronDetach = require('electron-detach');
if (electronDetach({ requireCmdlineArg: false })) {
  start();
}
