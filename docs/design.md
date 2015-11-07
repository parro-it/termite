# Bootstrap process

* App start in src/index.js in main process

1) `./api/termite-app` is required
2) its start method is called  in main process on app ready
```javascript
app.on('ready', () => {
  termiteApp.start();
});
```

2) start method load src/assets/html.
in renderer, `./api/termite-app` is required again

3) all other modules in src/api are required

3) `./api/termite-app` `initRenderer` method is called, in renderer process.

4) in  `initRenderer` method, all other api modules init methods are called, passing them the instance of app.

# Api modules structure

All api modules resides in folder src/api.
Each api modules must export a function receiving the app instance
and returning an object that is then added as a property
on the app instance, named as the modules itself.

Api modules are loaded in src/api/modularize.js
