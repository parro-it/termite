# Menus object

This module manage application menu.

It take care of loading application menu from templates specfied by other api modules and external plugins.

You can access `menus` object in a plugin using `app.menus`.

Menu template are specified with following format:

```js
{
  File: [{
    label: 'New shell tab',
    accelerator: 'CmdOrCtrl+T',
    command: 'new-tab'
  }],
  Edit: [{
    label: 'Previous word',
    accelerator: 'CmdOrCtrl+Left',
    command: 'prev-word'
  }, {
    label: 'Next word',
    accelerator: 'CmdOrCtrl+Right',
    command: 'next-word'
  }, {
    label: 'Start of line',
    accelerator: 'CmdOrCtrl+Home',
    command: 'start-line'
  }, {
    label: 'End of line',
    accelerator: 'CmdOrCtrl+End',
    command: 'end-line'
  }, {
    label: 'Delete line',
    accelerator: 'Shift+Esc',
    command: 'delete-line'
  }]
}
```

## Merge process

TODO

## Members

### Property `menuTemplate`

An array containing application menu after merge process, converted in `Electron format`

### `merge(menu)`

Merge specified menu template to appication menus.

### Arguments

* menu - required object
Contains template of the menu to merge, as specified above.

