const $ = global.jQuery;
const chromeTabs = global.chromeTabs;

const $tabsShell = $('.chrome-tabs-shell');
chromeTabs.init({
  $shell: $tabsShell,
  minWidth: 45,
  maxWidth: 160
});

exports.addTab = function addTab(id) {
  chromeTabs.addNewTab($tabsShell, {
    title: ''
  });
  const elm = document.querySelector('.chrome-tab-current');
  elm.id = id;
  return elm;
};
