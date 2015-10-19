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
          // delete m.accelerator;
          app.on('browser-window-focus', () => {
            globalShortcut.register(shortcut, handler);
          });

          globalShortcut.register(shortcut, handler);

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
    const appMenu = {};
    const merge = (menuTemplate, menu) => {
      Object.keys(menu).forEach(property => {
        if (property in menuTemplate) {
          menuTemplate[property] = menuTemplate[property].concat(menu[property]);
        } else {
          menuTemplate[property] = menu[property];
        }
      });
    };

    const mergePackageMenus = packageName => {
      const pkg = app.packages[packageName];
      const menuFile = join(pkg.path, 'menu.json5');
console.log({menuFile})
      if (fs.existsSync(menuFile)) {
        const packageMenu = JSON5.parse(fs.readFileSync(menuFile));
        merge(appMenu, packageMenu);
      }
    };

    app.on('packages-init-done', () => {
      Object.keys(app.packages).forEach(mergePackageMenus);
      Object.keys(appMenu).forEach(label => {
        this.menuTemplate.push({
          label,
          submenu: appMenu[label]
        });
      });

      setupMenus(this.menuTemplate, app);
    });
  }
};

