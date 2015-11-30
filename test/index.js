'use strict';

const test = require('tape');
const collider = require('collider');
const electron = require('electron');
const co = require('co');
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

test('define global object', co.wrap(function* (t) {
  const g = yield coll.evaluate(() => typeof window.termite);
  t.equal(g, 'object');
  t.end();
}));


test('cursor on prompt row', co.wrap(function* (t) {
  const prompt = yield coll.wait(1500).evaluate(() => window.termite.shell.cursorRowText);
  t.equal(prompt, '❯ ');
  t.end();
}));

test('quit collider', t => {
  win.close();
  collider.quit();
  t.ok(true);
  t.end();

});
