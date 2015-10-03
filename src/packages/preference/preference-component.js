'use strict';

class PreferenceComponent {
  constructor(app) {
    this.element = document.createElement('main');
    this.element.classList.add('preference');
    const pre = document.createElement('pre');
    pre.innerText = JSON.stringify(app.config.defaultPreferences, null, 4);
    this.element.appendChild(pre);
  }

  close() {
    this.element.remove();
  }

  activate() {
    this.element.style.display = '';
  }

  deactivate() {
    this.element.style.display = 'none';
  }
}

module.exports = PreferenceComponent;
