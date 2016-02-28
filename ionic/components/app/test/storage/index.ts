import {Component} from 'angular2/core';
import {Control, ControlGroup} from 'angular2/common';

import {App, Storage, LocalStorage, SqlStorage} from 'ionic-angular';

@App({
  templateUrl: 'main.html'
})
class IonicApp {
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
