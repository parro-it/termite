'use strict';

const EventEmitter = require('events').EventEmitter;

const template = `<dialog id="alert-dialog">
    <header class="toolbar toolbar-header">
        <h1 class="title"></h1>
    </header>

    <main style="padding:50px">
    </main>

    <footer class="toolbar toolbar-footer">
        <div class="toolbar-actions">
            <button class="ok btn btn-primary pull-right">Ok</button>
        </div>
    </footer>
</dialog>`;

module.exports = () => Object.assign(new EventEmitter(), {
  _createElm() {
    const placeHolder = document.createElement('div');
    placeHolder.innerHTML = template;
    this._elm = placeHolder.children[0];
    document.body.appendChild(this._elm);
    return this._elm;
  },

  alert(message, title) {
    const alertElm = this._elm ? this._elm : this._createElm();
    alertElm.querySelector('.title').innerHTML = title;
    alertElm.querySelector('main').innerHTML = message;

    const btnOk = alertElm.querySelector('.ok');

    return new Promise(resolve => {
      btnOk.addEventListener('click', () => {
        alertElm.close(true);
        resolve();
      });
      alertElm.showModal();
    });
  }
});
