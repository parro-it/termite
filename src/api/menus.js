const fs = require('fs');
const join = require('path').join;
const JSON5 = require('json5');

function setupMenus(menuTemplate, termiteApp) {
  const remote = require('remote');
  const globalShortcut = remote.require('global-shortcut');
  const Menu = remote.require('menu');
  const app = remote.require('app');

  const instrumentMenu = (menus) => {
    menus.forEach(m => {
      if (m.command) {
        const handler = () => {
          termiteApp.commands.execute(m.command);
        };
        m.click = handler;

        if (m.accelerator) {
          const shortcut = m.accelerator;
          delete m.accelerator;

          app.on('browser-window-focus', () => {
            globalShortcut.register(shortcut, handler);
          });

          app.on('browser-window-blur', () => {
            globalShortcut.unregister(shortcut, handler);
          });
        }
      }

      if (m.submenu) {
        instrumentMenu(m.submenu);
      }
    });
  };

  instrumentMenu(menuTemplate);
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

module.exports = {
  menuTemplate: [],
  init(app) {
    const loadPackageMenus = packageName => {
      const pkg = app.packages[packageName];
      const menuFile = join(pkg.path, 'menu.json5');

      if (fs.existsSync(menuFile)) {
        process.stdout.write(menuFile);
        const packageMenu = JSON5.parse(fs.readFileSync(menuFile));
        const merge = (obj1, obj2) => {
          if (Array.isArray(obj1)) {
            return obj1.concat(obj2);
          }

          for (const property in obj1) {
            if (property in obj2 && typeof obj1[property] === 'object') {
              obj2[property] = merge(obj1[property], obj2[property]);
            }
          }

          return Object.assign(
            obj1,
            obj2
          );
        };


        this.menuTemplate = merge(
          this.menuTemplate,
          packageMenu
        );
      }
    };

    app.on('packages-init-done', () => {
      Object.keys(app.packages).forEach(loadPackageMenus);
      process.stdout.write(JSON5.stringify(this.menuTemplate));
      setupMenus(this.menuTemplate, app);
    });
  }
};

