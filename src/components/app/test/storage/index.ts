import {Component} from '@angular/core';
import {Control, ControlGroup} from '@angular/common';
import {ionicBootstrap, Storage, LocalStorage, SqlStorage} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  local: Storage;
  sql: Storage;

  constructor() {
    this.local = new Storage(LocalStorage);
    this.sql = new Storage(SqlStorage);
  }

  getLocal() {
    this.local.get('name').then(value => {
      alert('Your name is: ' + value);
    });
  }

  setLocal() {
    let name = prompt('Your name?');

    this.local.set('name', name);
  }

  removeLocal() {
    this.local.remove('name');
  }

  getSql() {
    this.sql.get('name').then(value => {
      alert('Your name is: ' + value);
    }, (errResult) => {
      console.error('Unable to get item from SQL db:', errResult);
    });
  }

  setSql() {
    let name = prompt('Your name?');

    this.sql.set('name', name);
  }

  removeSql() {
    this.sql.remove('name');
  }
}

ionicBootstrap(E2EApp);
