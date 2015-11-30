'use strict';

const test = require('tape');
const collider = require('collider');
const electron = require('electron');
// const co = require('co');
const createTermiteWindow = require('../src/create-window');


let win;
let coll;

test('wait app ready and init tests', t => {
  electron.app.on('ready', () => {
    win = createTermiteWindow();
    coll = collider.window(win);
    t.end();
  });
});

test('Start title equal Termite', t => {
  coll.waitTitle('Termite');
  t.end();
});

test('quit collider', t => {
  win.close();
  collider.quit();
  t.ok(true);
  t.end();

});
