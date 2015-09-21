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
      const menuFile = join(app.packagesFolder, packageName, 'menu.json5-');
      process.stdout.write(menuFile);
      if (fs.existsSync(menuFile)) {
        const packageMenu = JSON5.parse(fs.readFileSync(menuFile));
        for (const property in packageMenu) {
          if (property in this.menuTemplate) {
            packageMenu[property] = Object.assign(
              this.menuTemplate[property],
              packageMenu[property]
            );
          }
        }

        Object.assign(
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

