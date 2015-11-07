const requireProps = require('require-props')(__dirname);
const EventEmitter = require('events').EventEmitter;
const resolve = require('path').resolve;

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


module.exports = Object.assign(new EventEmitter(), {
  name: 'termite',
  window: null,

  quit() {
    this.commands.execute('quit');
  },

  initRenderer() {
    requireProps(this, [
      './commands',
      './palette',
      './tabs',
      './config',
      './menus',
      './plugins'
    ]);

    this.packages = {};
    this.packagesFolder = __dirname + '/../packages';

    registerJsCommands(this.commands);
    registerWindowButtonHandlers();

    global.termite = this;

    this.plugins.load()
      .then(() =>
        this.emit('packages-init-done')
      )
      .catch(err => {
        process.stderr.write(`Error loading plugins:\n${err.stack}\n`);
      });
  },

  start() {
    const window = require('electron-window');

    const appIcon = resolve(__dirname, '../../media/icon.png');

    this.window = window.createWindow({
      resizable: true,
      icon: appIcon,
      'accept-first-mouse': true,
      frame: false
    });

    this.window.showUrl(__dirname + '/../assets/index.html', ()=>{});
  }
});
