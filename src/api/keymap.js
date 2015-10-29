'use strict';
module.exports = {
  init(app) {
    app.config.on('all-preferences-loaded', () => {
      const KeymapManager = require('atom-keymap');

      const keymaps = new KeymapManager();
      const commands = app.config.userPreferences.keymaps;
      keymaps.defaultTarget = document.body;
      let lastEvent;
      window.checkKeyMap = function(e) {
        if (lastEvent === e) {
          return true;
        }
        lastEvent = e;
        window._keymapHandled = false;
        keymaps.handleKeyboardEvent(e);
        return window._keymapHandled;
      };

      document.body.addEventListener('keyup', e => {
        if (lastEvent === e) {
          return;
        }
        lastEvent = e;
        keymaps.handleKeyboardEvent(e);
      });

      keymaps.add('termite-commands', {
        body: commands
      });

      Object.keys(commands).forEach(k => {
        window.addEventListener(commands[k], () => {
          window._keymapHandled = true;
          app.commands.execute(commands[k]);
        });
      });
    });
  }
};

