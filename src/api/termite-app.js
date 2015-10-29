const menus = require('./menus');
const tabs = require('./tabs');
const palette = require('./palette');
const commands = require('./commands');
const config = require('./config');
const plugins = require('./plugins');
const keymap = require('./keymap');

const EventEmitter = require('events').EventEmitter;
const resolve = require('path').resolve;

module.exports = Object.assign(new EventEmitter(), {
  name: 'termite',
  window: null,

  palette: palette,
  tabs: tabs,
  commands: commands,
  config: config,
  menus: menus,
  plugins: plugins,
  keymap: keymap,

  quit() {
    this.commands.execute('quit');
  },

  initRenderer() {
    this.palette.init(this);
    this.tabs.init(this);
    this.commands.init(this);
    this.config.init(this);
    this.menus.init(this);
    this.plugins.init(this);
    this.keymap.init(this);
    this.emit('api-init-done');


    this.packages = {};
    this.packagesFolder = __dirname + '/../packages';

    const BrowserWindow = require('remote').require('browser-window');

    this.commands.register('inject-js', code => {
      const script = document.createElement('script');
      script.textContent = code;
      document.body.appendChild(script);
    });

    this.commands.register('inject-script', path => {
      const script = document.createElement('script');
      script.src = path;
      document.body.appendChild(script);
    });


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

    setImmediate(() => this.emit('dom-available'));
    global.termite = this;

    this.plugins.load()
      .then(() =>
        this.emit('packages-init-done')
      );

    setTimeout(()=>{
      this.window = BrowserWindow.getFocusedWindow();
      this.window.maximize();
      this.emit('window-ready');
    }, 100);
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
