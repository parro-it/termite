const PreferenceComponent = require('./preference-component');

module.exports = function init(app) {
  app.commands.register('default-preferences', () => app.tabs.add(new PreferenceComponent(app)));
  return {
    name: 'preference',
    path: __dirname
  };
};
