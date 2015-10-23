'use strict';

const EventEmitter = require('events').EventEmitter;
const PluginLoader = require('plugin-loader').PluginLoader;


module.exports = Object.assign(new EventEmitter(), {
  load() {
    const loader = new PluginLoader([this.app.config.configFolder + '/plugins/node_modules']);
    loader.on('pluginLoaded', (pluginName, plugin) => {
      const pluginResult = plugin(this.app);
      this.app.packages[pluginResult.name] = pluginResult;
    });

    return new Promise(resolve => {
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
  }
});
