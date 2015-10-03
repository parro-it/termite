module.exports = function init(app) {
  app.commands.register('quit', () => {
    const BrowserWindow = require('remote').require('browser-window');
    const win = BrowserWindow.getFocusedWindow();
    win.close();
  });



  return {
    name: 'core',
    path: __dirname

  };
};
