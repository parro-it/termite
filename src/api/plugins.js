'use strict';

const EventEmitter = require('events').EventEmitter;
const PluginLoader = require('plugin-loader').PluginLoader;
const npmKeyword = require('npm-keyword');
const npm = require('enpeem');
const co = require('co');
const mkdirp = require('mkdirp');
const emptyDir = require('empty-dir');

const defaultPlugins = [
  'termite-plugin-preference',
  'termite-plugin-shell'
];

module.exports = app => {
  const mod = Object.assign(new EventEmitter(), {
    load() {
      const pluginModules = this.pluginsFolder + '/node_modules';
      mkdirp.sync(pluginModules);
      if (emptyDir.sync(pluginModules)) {
        return this.installDefaultPlugins();
      }

      const loader = new PluginLoader([pluginModules]);
      loader.on('pluginLoaded', (pluginName, plugin) => {
        const pluginResult = plugin(app);
        app.packages[pluginResult.name] = pluginResult;
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

    installDefaultPlugins() {
      const pluginsInstalling = defaultPlugins.map(p => this.installPlugin(p));
      return Promise.all(pluginsInstalling)
        .then(() => this.load());
    },

    installPlugin(pluginToInstall) {
      const opts = {
        dir: app.config.configFolder + '/plugins',
        dependencies: [pluginToInstall],
        loglevel: 'verbose'
      };

      return new Promise((resolve, reject) => {
        npm.install(opts, err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    }
  });

  mod.pluginsFolder = app.config.configFolder + '/plugins';
  app.commands.register('install-package', co.wrap(function * () {
    const plugins = yield npmKeyword.names('termite-plugin');
    const pluginToInstall = yield app.palette.open(plugins);
    try {
      yield mod.installPlugin(pluginToInstall);
      alert(pluginToInstall + ' installed.');
    } catch (err) {
      process.stderr.write('Error occurred while installing package: ' + err.stack + '\n');
    }
  }));

  return mod;
};
