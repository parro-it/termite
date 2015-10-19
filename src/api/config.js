const homedir = require('os').homedir;
const join = require('path').join;
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

const JSON5 = require('json5');

const config = Object.assign(new EventEmitter(), {
  initPackageDefaultsPreferences(pkg) {
    const configFile = join(this.configFolder, pkg.name + '.json5');
    const defaultsConfigFile = join(`${pkg.path}/default-preferences.json5`);
    pkg.configFile = configFile;


    if (!fs.existsSync(this.configFolder)) {
      fs.mkdirSync(this.configFolder);
    }

    if (!fs.existsSync(configFile) && fs.existsSync(defaultsConfigFile)) {
      const defaultsConfigContent = fs.readFileSync(defaultsConfigFile);
      fs.writeFileSync(configFile, defaultsConfigContent);
    }

    return this.loadPreferences(defaultsConfigFile);
  },

  loadPreferences(configFile) {
    if (fs.existsSync(configFile)) {
      return JSON5.parse(fs.readFileSync(configFile));
    }
    return {};
  },

  init(app) {
    this.defaultPreferences = {};
    this.configFolder = join(homedir(), '.termite');
    app.on('packages-init-done', () => {
      try {
        Object.keys(app.packages).forEach(packageName => {
          const pkg = app.packages[packageName];
          process.stdout.write(packageName + ' initPackageDefaultsPreferences...');
          pkg.defaultPreferences = this.initPackageDefaultsPreferences(pkg);
          this.defaultPreferences[packageName] = pkg.defaultPreferences;

          process.stdout.write('done.\n');
          process.stdout.write(packageName + ' loadPreferences...');

          pkg.preferences = Object.assign(
            this.loadPreferences(pkg.configFile),
            { __proto__: pkg.defaultPreferences }
          );

          process.stdout.write('done.\n');
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

