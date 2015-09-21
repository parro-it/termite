const ShellComponent = require('./shell-component');

module.exports = function init(app) {
  const newShellTab = () => app.tabs.add(new ShellComponent(app));

  app.commands.register('new-tab', newShellTab);

  newShellTab();
};
