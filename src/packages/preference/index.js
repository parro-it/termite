const homedir = require('os').homedir;
const join = require('path').join;
const lib = global.lib;
const fs = require('fs');
const defaultConfig = require('./default-config');

module.exports = function loadConfig() {
  const configFolder = join(homedir(), '.termite');
  const configFile = join(configFolder, 'config.json');

  if (!fs.existsSync(configFolder)) {
    fs.mkdirSync(configFolder);
  }


  return {
    prefs: new lib.Storage.Memory(),
    load: t => {
      if (!fs.existsSync(configFile)) {
        fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
      } else {
        const config = require(configFile);
        Object.keys(config).forEach(k => {
          t.prefs_.set(k, config[k]);
        });
      }
    }
  };
};
const ShellComponent = require('./shell-component');

module.exports = function init(app) {
  const newShellTab = () => app.tabs.add(new ShellComponent());

  app.commands.register('new-tab', newShellTab);

  newShellTab();
};
