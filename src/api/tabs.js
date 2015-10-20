'use strict';

const uuid = require('node-uuid');

class Tab {
  constructor(component, pkg) {
    this.tabsShell = pkg.tabsShell;
    this.pkg = pkg;
    this.component = component;
    this.id = uuid.v4();
  }

  close() {
    this.component.close();
    this.element.remove();
  }

  activate() {
    const currentlyActive = this.pkg.current();
    if (currentlyActive) {
      currentlyActive.element.classList.remove('active');
      currentlyActive.component.deactivate();
    }
    this.component.activate();
    this.element.classList.add('active');
  }

  setTitle(text) {
    this.title.textContent = text;
  }

  createElement() {
    const elm = document.createElement('div');
    elm.id = '__' + this.id.replace(/-/g, '_');
    elm.classList.add('tab-item');


    const close = document.createElement('span');
    close.classList.add('icon');
    close.classList.add('icon-cancel');
    close.classList.add('icon-close-tab');
    elm.appendChild(close);

    const title = document.createElement('span');
    title.classList.add('title');
    elm.appendChild(title);
    this.title = title;

    this.tabsShell.appendChild(elm);
    this.element = elm;
  }
}

module.exports = {
  tabs: {},

  init(app) {
    this.tabsShell = document.querySelector('.tab-group');

    app.on('api-init-done', () => {
      app.commands.register('close-current', () => {
        const current = this.current();
        current.close();
        const closeTab = this.tabsShell.querySelector('.tab-item.active .icon-close-tab');

        if (closeTab) {
          const click = new Event('click');
          closeTab.dispatchEvent(click);
        }
      });
    });
  },

  current() {
    const currentTabElm = this.tabsShell.querySelector('.tab-item.active');

    if (currentTabElm === null) {
      return null;
    }

    const tabId = currentTabElm.id;

    const currentTab = this.tabs[tabId.slice(2).replace(/_/g, '-')];
    return currentTab;
  },

  add(component) {
    const tab = new Tab(component, this);
    this.tabs[tab.id] = tab;

    component.tabId = tab.id;
    const main = document.querySelector('main.window-content');
    main.appendChild(component.element);


    tab.createElement();
    component.element.id = tab.element.id + '_component';
    tab.activate();

    tab.element.addEventListener('mouseup', () => {
      tab.activate();
    });

    const closeTab = tab.element.querySelector('.icon-close-tab');
    closeTab.addEventListener('click', () => {
      this.activateFirstTab();
      tab.close();
    });
  },

  activateFirstTab() {
    if (this.tabs.length === 0) {
      return;
    }
    this.tabs[Object.keys(this.tabs)[0]].activate();
  },

  close(tabId) {
    const tab = this.tabs[tabId];
    tab.close();
    this.activateFirstTab();
  },


  all() {
    return this.tabs;
  }
};
