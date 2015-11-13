'use strict';

const co = require('co');
const remote = require('remote');
const localShortcut = remote.require('electron-localshortcut');

const alertTemplate = `<dialog id="alert-dialog" class="nice-dialogs">
    <header class="toolbar toolbar-header">
        <h1 class="title"></h1>
    </header>

    <main>
    </main>

    <footer class="toolbar toolbar-footer">
        <div class="toolbar-actions">
            <button class="ok btn btn-large btn-primary pull-right">Ok</button>
        </div>
    </footer>
</dialog>`;

const confirmTemplate = `<dialog id="confirm-dialog" class="nice-dialogs">
    <header class="toolbar toolbar-header">
        <h1 class="title"></h1>
    </header>

    <main>
    </main>

    <footer class="toolbar toolbar-footer">
        <div class="toolbar-actions">
            <button class="no btn btn-large btn-default">No</button>
            <button class="yes btn btn-large btn-primary pull-right">Yes</button>
        </div>
    </footer>
</dialog>`;

module.exports = app => {
  app.commands.register('alert', co.wrap(function * () {
    yield app.dialogs.alert('This is the alert message', 'Info');
    alert('message closed');
  }));
  app.commands.register('confirm', co.wrap(function * () {
    const answer = yield app.dialogs.confirm('Are you really sure?', 'Question');
    alert('answer ' + answer);
  }));
  return {
    _createElm() {
      const placeHolder = document.createElement('div');
      placeHolder.innerHTML = alertTemplate;
      this._elm = placeHolder.children[0];
      document.body.appendChild(this._elm);
      return this._elm;
    },
    _createConfirmElm() {
      const placeHolder = document.createElement('div');
      placeHolder.innerHTML = confirmTemplate;
      this._confirmElm = placeHolder.children[0];
      document.body.appendChild(this._confirmElm);
      return this._confirmElm;
    },


    alert(message, title) {
      const alertElm = this._elm ? this._elm : this._createElm();
      alertElm.querySelector('.title').innerHTML = title;
      alertElm.querySelector('main').innerHTML = message;

      const btnOk = alertElm.querySelector('.ok');

      return new Promise(resolve => {
        const onOk = () => {
          alertElm.close(true);
          localShortcut.enableAll(remote.getCurrentWindow());
          resolve();
          btnOk.removeEventListener('click', onOk);
        };

        btnOk.addEventListener('click', onOk);
        localShortcut.disableAll(remote.getCurrentWindow());
        alertElm.showModal();
      });
    },

    confirm(message, title) {
      const confirmElm = this._confirmElm ? this._confirmElm : this._createConfirmElm();
      confirmElm.querySelector('.title').innerHTML = title;
      confirmElm.querySelector('main').innerHTML = message;

      const btnYes = confirmElm.querySelector('.yes');
      const btnNo = confirmElm.querySelector('.no');

      return new Promise(resolve => {
        const onYes = () => {
          confirmElm.close(true);
          localShortcut.enableAll(remote.getCurrentWindow());
          resolve(true);
          btnYes.removeEventListener('click', onYes);
          btnNo.removeEventListener('click', onNo); // eslint-disable-line
        };

        const onNo = () => {
          confirmElm.close(false);
          localShortcut.enableAll(remote.getCurrentWindow());
          resolve(false);
          btnYes.removeEventListener('click', onYes);
          btnNo.removeEventListener('click', onNo);
        };

        btnYes.addEventListener('click', onYes);
        btnNo.addEventListener('click', onNo);
        localShortcut.disableAll(remote.getCurrentWindow());
        confirmElm.showModal();
      });
    }
  };
};
