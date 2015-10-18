const menus = require('./menus');
const tabs = require('./tabs');
const commands = require('./commands');
const config = require('./config');
const EventEmitter = require('events').EventEmitter;
const PluginLoader = require('plugin-loader').PluginLoader;

module.exports = Object.assign(new EventEmitter(), {
  name: 'termite',
  window: null,

  tabs: tabs,
  commands: commands,
  config: config,
  menus: menus,

  quit() {
    this.commands.execute('quit');
  },

  initRenderer() {
    this.tabs.init(this);
    this.commands.init(this);
    this.config.init(this);
    this.menus.init(this);
    this.emit('api-init-done');

    this.packages = {};
    this.packagesFolder = __dirname + '/../packages';

    this.packages.core = require('../packages/core')(this);
    this.packages.commandManager = require('../packages/command-manager')(this);
    this.packages.shell = require('../packages/shell')(this);
    this.packages.preference = require('../packages/preference')(this);

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

    this.emit('packages-init-done');

    setImmediate(() => this.emit('dom-available'));
    global.termite = this;
    const loader = new PluginLoader([this.config.configFolder + '/plugins/node_modules']);
    loader.on('pluginLoaded', (pluginName, plugin) => {
      const pluginResult = plugin(this);
      this.packages[pluginResult.name] = pluginResult;
    });
    loader.discover();
  },

  start() {
    const window = require('electron-window');

    const appIcon = __dirname + '/../../resources/icon.png';

    this.window = window.createWindow({
      resizable: true,
      icon: appIcon,
      'accept-first-mouse': true,
      frame: false
    });

    this.window.showUrl(__dirname + '/../main-window/index.html', () => {
      this.window.maximize();
    });
  }
});
