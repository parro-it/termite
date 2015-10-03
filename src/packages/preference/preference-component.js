'use strict';

class PreferenceComponent {
  constructor(app) {
    this.element = document.createElement('pre');
    this.element.innerText = JSON.stringify(app.config.defaultPreferences, null, 4);
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
