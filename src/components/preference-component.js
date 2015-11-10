'use strict';
const JSON5 = require('json5');
const writeFile = require('fs').writeFile;

class PreferenceComponent {
  constructor(preferences, filePath) {
    const code = JSON5.stringify(preferences, null, 4);

    this.element = document.createElement('textarea');
    this.element.classList.add('preference');
    this.element.value = code;
    this.element.readOnly = !filePath;

    process.stdout.write(filePath);
    if (filePath) {
      this.element.addEventListener('input', () => {
        writeFile(filePath, this.element.value, err => {
          if (err) {
            return process.stderr.write(err.stack + '\n\n');
          }
          process.stdout.write('It\'s saved!\n\n');
        });
      });
    }
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
