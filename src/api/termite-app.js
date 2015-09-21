const menus = require('./menus');
const tabs = require('./tabs');
const commands = require('./commands');
const config = require('./config');
const EventEmitter = require('events').EventEmitter;

module.exports = Object.assign(new EventEmitter(), {
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
    this.packages.shell = require('../packages/shell')(this);

    this.emit('packages-init-done');
    setImmediate(() => this.emit('dom-available'));
  },

  start() {
    const window = require('electron-window');

    const appIcon = __dirname + '/../../resources/icon.png';

    this.window = window.createWindow({
      resizable: true,
      icon: appIcon
    });

    this.window.showUrl(__dirname + '/../main-window/index.html', () => {
      this.window.maximize();
    });
  }
});
