import {Component} from 'angular2/angular2';
import {Control, ControlGroup} from 'angular2/forms';

import {App, Http} from 'ionic/ionic';


let testUrl = 'https://ionic-api-tester.herokuapp.com/json';
let testUrl404 = 'https://ionic-api-tester.herokuapp.com/404';


@App({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.form = new ControlGroup({
      requestData: new Control('')
    })
  }
  doGet() {
    Http.get('http://swapi.co/api/people/1').then((resp) => {
      this.resp = resp;
    }, (err) => {
      this.err = err;
    })
  }
  doGet404() {
    Http.get(testUrl404).then((resp) => {
      this.resp = resp;
    }, (err) => {
      this.err = err;
    })
  }
  doPost() {
    let data = this.form.controls.requestData.value;
    Http.post(testUrl, data).then((resp) => {
      this.resp = resp;
    }, (err) => {
      this.err = err;
    })
  }
  doPut() {
    let data = this.form.controls.requestData.value;
    Http.put(testUrl, data).then((resp) => {
      this.resp = resp;
    }, (err) => {
      this.err = err;
    })
  }
  doDelete() {
    let data = this.form.controls.requestData.value;
    Http.delete(testUrl, data).then((resp) => {
      this.resp = resp;
    }, (err) => {
      this.err = err;
    })
  }
  doPatch() {
    let data = this.form.controls.requestData.value;
    Http.patch(testUrl, data).then((resp) => {
      this.resp = resp;
    }, (err) => {
      this.err = err;
    })
  }
}
