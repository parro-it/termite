'use strict';

const EventEmitter = require('events').EventEmitter;
const PluginLoader = require('plugin-loader').PluginLoader;
const npmKeyword = require('npm-keyword');
const npm = require('enpeem');
const co = require('co');
const mkdirp = require('mkdirp');
const emptyDir = require('empty-dir');

module.exports = Object.assign(new EventEmitter(), {
  load() {
    const pluginModules = this.pluginsFolder + '/node_modules';
    mkdirp.sync(pluginModules);
    if (emptyDir.sync(pluginModules)) {
      return Promise.resolve();
    }

    const loader = new PluginLoader([pluginModules]);
    loader.on('pluginLoaded', (pluginName, plugin) => {
      const pluginResult = plugin(this.app);
      this.app.packages[pluginResult.name] = pluginResult;
    });

    return new Promise((resolve, reject) => {
      loader.on('error', reject);
      loader.on('allPluginsLoaded', errors => {
        if (errors) {
          process.stderr.write('Some error occurred while loading plugins:\n' + require('util').inspect(errors));
        }
        resolve();
      });

      loader.discover(true);
    });
  },

  init(app) {
    this.app = app;
    this.pluginsFolder = app.config.configFolder + '/plugins';

    app.commands.register('install-package', co.wrap(function * () {
      const plugins = yield npmKeyword.names('termite-plugin');
      const pluginToInstall = yield app.palette.open(plugins);
      const opts = {
        dir: app.config.configFolder + '/plugins',
        dependencies: [pluginToInstall],
        loglevel: 'verbose'
      };

      npm.install(opts, err => {
        if (err) {
          return process.stderr.write('Error occurred while installing package: ' + err.stack + '\n');
        }
        alert(pluginToInstall + ' installed.');
      });
    }));
  }
});
