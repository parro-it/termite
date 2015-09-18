const app = require('app');
const electronDebug = require('electron-debug');
const window = require('electron-window');
const Menu = require('menu');

if (process.env.DEBUG) {
  electronDebug();
}

app.on('ready', () => {
  const mainWindow = window.createWindow({
    resizable: true
  });

  const template = [{
    label: 'File',
    submenu: [{
      label: 'New tab',
      accelerator: 'CmdOrCtrl+T',
      click: () => mainWindow.webContents.send('new-tab')
    }, {
      label: 'Exit',
      accelerator: 'CmdOrCtrl+F10',
      click: () => mainWindow.close(),
      role: 'close'
    }]
  }];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);


  mainWindow.showUrl('index.html', () => {
    mainWindow.maximize();
  });
});

app.on('window-all-closed', function onWindowAllClosed() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


