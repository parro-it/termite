# Bootstrap process

- 1) App start in src/index.js in main process
- 2) on app ready main window is created and src/assets/html file is loaded.
- 3) In renderer, `./api/termite-app` is required
- 4) `./api/termite-app`, all other modules in `src/api` are required
using requireProps.
- 5) All external plugins is loaded calling `plugins` module `load` method

# Api modules structure

All api modules resides in folder src/api.
Each api modules must export a function receiving the app instance
and returning an object that is then added as a property
on the app instance, named as the modules itself.

Api modules are loaded using [`require-props`](https://github.com/parro-it/require-props) module.

# Modules details

App objects member:

## [commands](commands.md)
## [config](config.md)
## [menus](menus.md)
## [palette](palette.md)
## [plugins](plugins.md)
## [shell](shell.md)
## [tabs](tabs.md)
