module.exports = function init(app) {
  app.commands.register('command-palette', () => {
    const BrowserWindow = require('remote').require('browser-window');
    const win = BrowserWindow.getFocusedWindow();
    win.webContents.executeJavaScript(`
      (function(){
        window.palette = window.palette || require('command-palette');
        var p = window.palette.create(${JSON.stringify(app.commands.all())});
        p.appendTo(document.body);
        p.show();
      })();
    `);
  });

  return {
    name: 'command-manager',
    path: __dirname

  };
};
