const app = require('app');
const electronDebug = require('electron-debug');
const termiteApp = require('./termite-app');
if (process.env.DEBUG) {
  electronDebug();
}

app.on('ready', () => {
  termiteApp.start();
});

app.on('window-all-closed', function onWindowAllClosed() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


