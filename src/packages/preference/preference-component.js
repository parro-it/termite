'use strict';

class PreferenceComponent {
  constructor() {
    this.element = document.createElement('textarea');
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
