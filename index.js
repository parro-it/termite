const app = require('app');
const electronDebug = require('electron-debug');
const window = require('electron-window');
// const startShell = require('./start-shell');

electronDebug();

app.on('ready', () => {
  const mainWindow = window.createWindow({
    resizable: true,
    'web-preferences': {
      'web-security': false
    }
  });


  mainWindow.showUrl('index.html', () => {
    mainWindow.maximize();
  });
});

app.on('window-all-closed', function onWindowAllClosed() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


