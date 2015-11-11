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

  const menu = Menu.buildFromTemplate(menuTemplate);
  const btnMenu = document.querySelector('.btn-menu');
  btnMenu.addEventListener('click', () => {
    const rect = btnMenu.getBoundingClientRect();
    menu.popup(Math.round(rect.left) - 50, Math.round(rect.bottom));
  });

  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(null);
  }
}

module.exports = app => {
  const appMenu = {
    File: [],
    Edit: [],
    Tools: []
  };

  const mod = {
    menuTemplate: [],

    merge(menu) {
      Object.keys(menu).forEach(property => {
        if (property in appMenu) {
          const updatedMenu = appMenu[property].concat(menu[property]);
          appMenu[property] = updatedMenu;
        } else {
          appMenu[property] = menu[property];
        }
      });
    }
  };

  app.on('packages-init-done', () => {
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

