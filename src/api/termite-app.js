const requireProps = require('require-props')(__dirname);
const EventEmitter = require('events').EventEmitter;
require('app-title')('termite - renderer process');
const dialogs = require('nice-dialogs');

if (process.env.DEBUG) {
  require('debug-menu').install();
}

function registerWindowButtonHandlers() {
  const BrowserWindow = require('remote').require('browser-window');

  document.querySelector('.titlebar-close').addEventListener('click', () =>{
    window.close();
  });

  document.querySelector('.titlebar-minimize').addEventListener('click', () =>{
    BrowserWindow.getFocusedWindow().minimize();
  });

  document.querySelector('.titlebar-fullscreen').addEventListener('click', () =>{
    const win = BrowserWindow.getFocusedWindow();
    win.setFullScreen(!win.isFullScreen());
  });
}

function registerCommands(commands) {
  commands.register('inject-js', code => {
    const script = document.createElement('script');
    script.textContent = code;
    document.body.appendChild(script);
  });

  commands.register('inject-script', path => {
    const script = document.createElement('script');
    script.src = path;
    document.body.appendChild(script);
  });

  commands.register('quit', () => {
    dialogs.confirm('Are you sure to quit termite?', 'Quit confirmation')
      .then(answer => answer ? window.close() : null);
  });
}


const app = Object.assign(new EventEmitter(), {
  name: 'termite',
  window: null,
  packages: {},
  packagesFolder: __dirname + '/../packages', // this could be removed

  quit() {
    this.commands.execute('quit');
  }
});

requireProps(app, [
  './commands',
  './palette',
  './tabs',
  './config',
  './menus',
  './shell',
  './plugins'
]);

app.emit('api-init-done');
app.menus.merge({
  File: [{
    label: 'Exit',
    accelerator: 'CmdOrCtrl+Q',
    command: 'quit'
  }, {
    label: 'Close current shell',
    accelerator: 'CmdOrCtrl+D',
    command: 'close-current'
  }]
});

registerCommands(app.commands);
registerWindowButtonHandlers();

global.termite = app;

app.plugins.load()
  .then(() =>
    app.emit('packages-init-done')
  )
  .then(() =>
    require('remote').getCurrentWindow().show()
  )
  .catch(err => {
    process.stderr.write(`Error loading plugins:\n${err.stack}\n`);
  });

module.exports = app;
