import {Component} from 'angular2/angular2';
import {Control, ControlGroup} from 'angular2/forms';

import {App, Http, Storage, LocalStorage, SQLStorage} from 'ionic/ionic';

let testUrl = 'https://ionic-api-tester.herokuapp.com/json';
let testUrl404 = 'https://ionic-api-tester.herokuapp.com/404';


@App({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.local = new Storage(LocalStorage);
    this.sql = new Storage(SQLStorage);
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
