'use strict';

let $;
let chromeTabs;
let $tabsShell;
const uuid = require('node-uuid');


function addTabElement(id) {
  chromeTabs.addNewTab($tabsShell, {
    title: ''
  });
  const elm = document.querySelector('.chrome-tab-current');
  elm.id = id;
  return elm;
}

class Tab {
  constructor(component) {
    this.component = component;
    this.id = uuid.v4();
  }

  close() {
    this.component.close();
  }

  createElement() {
    this.element = addTabElement('__' + this.id.replace(/-/g, '_'));
  }
}

module.exports = {
  tabs: {},

  init(app) {
    $ = global.jQuery;
    chromeTabs = global.chromeTabs;
    $tabsShell = $('.chrome-tabs-shell');
    chromeTabs.init({
      $shell: $tabsShell,
      minWidth: 45,
      maxWidth: 160
    });

    app.on('api-init-done', () => {
      app.commands.register('close-current', () => {
        const current = this.current();
        current.close();
        const closeTab = current.element.querySelector('.chrome-tab-close');
        const click = new Event('click');
        closeTab.dispatchEvent(click);
        this.activateFirstTab();
      });
    });
  },

  current() {
    const currentTabElm = document.querySelector('.chrome-tab-current');

    if (currentTabElm === null) {
      return null;
    }

    const tabId = currentTabElm.id;

    const currentTab = this.tabs[tabId.slice(2).replace(/_/g, '-')];
    return currentTab;
  },

  add(component) {
    const tab = new Tab(component);
    this.tabs[tab.id] = tab;

    component.tabId = tab.id;
    document.body.appendChild(component.element);

    const deactivateCurrentTab = () => {
      const currentTab = this.current();
      if (currentTab) {
        currentTab.component.deactivate();
      }
    };

    const activateTab = () => {
      component.activate();
    };

    deactivateCurrentTab();
    tab.createElement();
    component.element.id = tab.element.id + '_component';
    activateTab();

    tab.element.addEventListener('mouseup', () => {
      deactivateCurrentTab();
      activateTab();
    });

    const closeTab = tab.element.querySelector('.chrome-tab-close');
    closeTab.addEventListener('click', () => {
      tab.close();
      this.activateFirstTab();
    });
  },

  activateFirstTab() {
    const tabs = document.querySelectorAll('.chrome-tab');
    if (tabs.length === 0) {
      return;
    }
    const click = new Event('click');
    tabs[0].dispatchEvent(click);
    const mouseup = new Event('mouseup');
    tabs[0].dispatchEvent(mouseup);
  },

  close(tabId) {
    const tab = this.tabs[tabId];
    tab.close();
    this.activateFirstTab();
  },


  all() {

  }
};
