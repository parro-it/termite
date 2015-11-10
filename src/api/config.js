const homedir = require('os').homedir;
const join = require('path').join;
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

const PreferenceComponent = require('../components/preference-component');

const JSON5 = require('json5');

module.exports = app => {
  const config = Object.assign(new EventEmitter(), {
    readPackageDefaultsPreferences(pkg) {
      const defaultsConfigFile = join(`${pkg.path}/default-preferences.json5`);
      return this.loadPreferences(defaultsConfigFile);
    },

    loadPreferences(configFile) {
      if (fs.existsSync(configFile)) {
        return JSON5.parse(fs.readFileSync(configFile));
      }
      return {};
    }
  });

  config.configFolder = join(homedir(), '.termite');
  config.configFile = join(config.configFolder, 'preferences.json5');

  if (!fs.existsSync(config.configFolder)) {
    fs.mkdirSync(config.configFolder);
  }

  config.defaultPreferences = {};
  config.userPreferences = config.loadPreferences(config.configFile);

  app.on('packages-init-done', () => {
    try {
      Object.keys(app.packages).forEach(packageName => {
        const pkg = app.packages[packageName];

        config.defaultPreferences[packageName] = config.readPackageDefaultsPreferences(pkg);

        pkg.preferences = Object.assign(
          config.userPreferences[pkg.name] || {},
          { __proto__: pkg.defaultPreferences }
        );

        setImmediate(() => {
          (p => {
            config.emit('preferences-loaded', p);
          })(pkg);
        });
      });

      config.emit('all-preferences-loaded');
    } catch (err) {
      process.stderr.write(err.stack);
    }
  });

  app.commands.register('default-preferences', () => {
    const tab = app.tabs.add(new PreferenceComponent(
      app.config.defaultPreferences
    ));
    tab.setTitle('Default preferences');
  });

  app.commands.register('user-preferences', () => {
    const tab = app.tabs.add(new PreferenceComponent(
      app.config.userPreferences,
      app.config.configFile
    ));
    tab.setTitle('User preferences');
  });

  app.on('api-init-done', () => {
    app.menus.merge({
      Tools: [{
        label: 'Default Preference',
        command: 'default-preferences'
      }, {
        label: 'User Preference',
        command: 'user-preferences'
      }]
    });
  });

  return config;
};

