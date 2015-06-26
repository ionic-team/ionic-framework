import {bind, Injector} from 'angular2/di';
import {bootstrap, ElementRef, NgFor} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';

import {Control, ControlGroup, formDirectives} from 'angular2/forms';

import {IonicView} from 'ionic/ionic';
import {Http} from 'ionic/net/http';

let testUrl = 'https://ionic-api-tester.herokuapp.com/json';
let testUrl404 = 'https://ionic-api-tester.herokuapp.com/404';

@Component({ selector: 'ion-app' })
@IonicView({
  templateUrl: 'main.html',
  directives: [formDirectives]
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

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
