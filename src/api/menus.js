const fs = require('fs');
const join = require('path').join;
const JSON5 = require('json5');

function setupMenus(menuTemplate, termiteApp) {
  const remote = require('remote');
  const localShortcut = remote.require('electron-localshortcut');
  const Menu = remote.require('menu');
  const win = remote.getCurrentWindow();
  localShortcut.unregisterAll(win);

  const instrumentMenu = (menus) => {
    menus.forEach(m => {
      if (m.command) {
        const handler = () => {
          termiteApp.commands.execute(m.command);
        };
        m.click = handler;

        if (m.accelerator) {
          localShortcut.register(win, m.accelerator, handler);
        }
      }

      if (m.submenu) {
        instrumentMenu(m.submenu);
      }
    });
  };

  instrumentMenu(menuTemplate);

  if (process.platform === 'darwin') {
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  } else {
    const otherPlatformMenu = document.querySelector('.other-platform-menu');
    const systemMenus = menuTemplate.map(m => {
      const menuItem = document.createElement('span');
      menuItem.textContent = m.label;
      menuItem.submenu = m.submenu;

      otherPlatformMenu.appendChild(menuItem);
      return menuItem;
    });

    const popupMenu = menuItem => () => {
      const rect = menuItem.getBoundingClientRect();
      /* systemMenus
        .filter(m => m !== menuItem)
        .forEach(otherMenuItem =>
          otherMenuItem.onmouseover = popupMenu(otherMenuItem)
        ); */
      const menu = Menu.buildFromTemplate(menuItem.submenu);
      menu.popup(Math.round(rect.left), Math.round(rect.bottom));
    };

    systemMenus.forEach(menuItem => menuItem.onclick = popupMenu(menuItem));
  }
}

module.exports = app => {
  const mod = { menuTemplate: []};
  const appMenu = {
    File: [],
    Edit: [],
    Tools: []
  };
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
    if (fs.existsSync(menuFile)) {
      const packageMenu = JSON5.parse(fs.readFileSync(menuFile));
      merge(appMenu, packageMenu);
    }
  };

  app.on('packages-init-done', () => {
    Object.keys(app.packages).forEach(mergePackageMenus);
    Object.keys(appMenu).forEach(label => {
      mod.menuTemplate.push({
        label,
        submenu: appMenu[label]
      });
    });

    setupMenus(mod.menuTemplate, app);
  });

  return mod;
};

