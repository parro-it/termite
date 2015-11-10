const commands = {};


module.exports = app => {
  const mod = {
    register(command, handler) {
      commands[command] = handler;
    },
    all() {
      return Object.keys(commands);
    },
    init() {

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

  mod.register('command-palette', () => {
    const choosedCommand = app.palette.open(app.commands.all());
    choosedCommand.then(cmd => {
      if (cmd) {
        app.commands.execute(cmd);
      }
    });
  });

  app.on('api-init-done', () => {
    app.menus.merge({
      Tools: [{
        label: 'Command Palette',
        accelerator: 'CmdOrCtrl+Shift+C',
        command: 'command-palette'
      }]
    });
  });

  const ipc = require('ipc');
  ipc.on('exec-command', command => mod.execute(command));
  return mod;
};
