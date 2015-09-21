const homedir = require('os').homedir;
const join = require('path').join;
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

const JSON5 = require('json5');

const config = Object.assign(new EventEmitter(), {
  initPackageDefaultsPreferences(pkg) {
    const configFolder = join(homedir(), '.termite');
    const configFile = join(configFolder, pkg.name + '.json5');
    const defaultsConfigFile = join(__dirname + `/../packages/${pkg.name}/default-preferences.json5`);
    pkg.configFile = configFile;

    if (!fs.existsSync(configFolder)) {
      fs.mkdirSync(configFolder);
    }

    if (!fs.existsSync(configFile) && fs.existsSync(defaultsConfigFile)) {
      const defaultsConfigContent = fs.readFileSync(defaultsConfigFile);
      fs.writeFileSync(configFile, defaultsConfigContent);
    }

    return this.loadPreferences(defaultsConfigFile);
  },

  loadPreferences(configFile) {
    return JSON5.parse(fs.readFileSync(configFile));
  },

  init(app) {
    this.defaultPreferences = {};
    app.on('packages-init-done', () => {
      try {
        Object.keys(app.packages).forEach(packageName => {
          const pkg = app.packages[packageName];
          process.stdout.write(packageName + ' initPackageDefaultsPreferences...');
          pkg.defaultPreferences = this.initPackageDefaultsPreferences(pkg);
          process.stdout.write('done.\n');

          process.stdout.write(packageName + ' loadPreferences...');
          pkg.preferences = this.loadPreferences(pkg.configFile);
          process.stdout.write('done.\n');
          setImmediate(() => {
            (p => {
              this.emit('preferences-loaded', p);
            })(pkg);
          });
        });
      } catch (err) {
        process.stderr.write(err.stack);
      }
    });
  }
});

module.exports = config;

