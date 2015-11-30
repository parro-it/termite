'use strict';
const electronDetach = require('electron-detach');
const createTermiteWindow = require('./create-window');
const app = require('electron').app;
const electronDebug = require('electron-debug');

function start() {
  // require('app-title')('termite - main process');

  if (process.env.DEBUG) {
    electronDebug();
  }

  process.on('uncaughtException', function(err) {
    process.stdout.write('Uncaught exception: \n\n' + err.stack + '\n\n');
  });

  app.on('ready', createTermiteWindow);

  app.on('window-all-closed', function onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

if (electronDetach({ requireCmdlineArg: false })) {
  start();
}

