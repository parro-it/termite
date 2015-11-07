const requireProps = require('require-props')(__dirname);
const EventEmitter = require('events').EventEmitter;

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

function registerJsCommands(commands) {
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
}


const app = Object.assign(new EventEmitter(), {
  name: 'termite',
  window: null,
  packages: {},
  packagesFolder: __dirname + '/../packages', //this could be removed

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
  './plugins'
]);


registerJsCommands(app.commands);
registerWindowButtonHandlers();

global.termite = app;

app.plugins.load()
  .then(() =>
    app.emit('packages-init-done')
  )
  .catch(err => {
    process.stderr.write(`Error loading plugins:\n${err.stack}\n`);
  });

module.exports = app;
