const homedir = require('os').homedir;
const join = require('path').join;
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

const JSON5 = require('json5');

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
  },

  init(app) {
    this.configFolder = join(homedir(), '.termite');
    this.configFile = join(this.configFolder, 'preferences.json5');

    if (!fs.existsSync(this.configFolder)) {
      fs.mkdirSync(this.configFolder);
    }

    this.defaultPreferences = {};
    this.userPreferences = this.loadPreferences(this.configFile);

    app.on('packages-init-done', () => {
      try {
        Object.keys(app.packages).forEach(packageName => {
          const pkg = app.packages[packageName];

          this.defaultPreferences[packageName] = this.readPackageDefaultsPreferences(pkg);

          pkg.preferences = Object.assign(
            this.userPreferences[pkg.name] || {},
            { __proto__: pkg.defaultPreferences }
          );

          setImmediate(() => {
            (p => {
              this.emit('preferences-loaded', p);
            })(pkg);
          });
        });

        this.emit('all-preferences-loaded');
      } catch (err) {
        process.stderr.write(err.stack);
      }
    });
  }
});

module.exports = config;

