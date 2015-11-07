'use strict';

const EventEmitter = require('events').EventEmitter;


module.exports = () => Object.assign(new EventEmitter(), {
  open(items) {
    const palette = require('command-palette');
    const p = palette.create(items);
    return new Promise(resolve => {
      p.on('cancel', resolve);
      p.on('command', resolve);
      p.appendTo(document.body);
      p.show();
    });
  }
});
