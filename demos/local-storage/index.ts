import { Component, Injectable, Pipe, PipeTransform } from '@angular/core';

import { Config, IonicApp, ionicBootstrap, LocalStorage, Platform, Storage } from 'ionic-angular';


@Pipe({
  name: 'cleanLocalData'
})
@Injectable()
class CleanLocalDataPipe implements PipeTransform {
  validKeys: string[];
  output: any;
  data: any;

  transform(obj:any) : any {
    this.validKeys = ['username', 'name', 'email', 'address'];
    this.output = {};
    this.data = JSON.parse(obj);
    for (var i = 0; i < Object.keys(this.data).length; i++) {
      if (this.validKeys.indexOf( Object.keys(this.data)[i] ) > -1) {
        this.output[Object.keys(this.data)[i]] = this.data[Object.keys(this.data)[i]];
      }
    }
    return JSON.stringify(this.output, null, 2);
  }
}


@Component({
  templateUrl: 'main.html',
  pipes: [CleanLocalDataPipe]
})
class ApiDemoPage {
  local: Storage;
  localStorageDemo: string;
  myItem: any;
  keys = ['username', 'name', 'email', 'address'];
  values = ['admin', 'Administrator', 'admin@administrator.com', '123 Admin St'];
  addedKeys = [];
  delKey: any;

  constructor() {
    this.local = new Storage(LocalStorage);
    this.localStorageDemo = '{}';
    window.localStorage.clear();

    this.myItem = {
      key: 'username',
      value: 'admin'
    };
  }

  set() {
    if (this.myItem.key) {
      let added = false;

      for (let i = 0; i < this.addedKeys.length; i++) {
        if (this.addedKeys[i] == this.myItem.key) added = true;
      }

      if (added == false) {
        console.log("Adding key", this.myItem.key);
        this.addedKeys.push(this.myItem.key);
        this.delKey = this.myItem.key;
        this.local.set(this.myItem.key, this.myItem.value );
        this.localStorageDemo = JSON.stringify(window.localStorage, null, 2);
      }
    }
  }

  remove() {
    this.local.remove(this.delKey);
    this.localStorageDemo = JSON.stringify(window.localStorage, null, 2);

    let index = this.addedKeys.indexOf(this.delKey);
    if (index > -1) {
      this.addedKeys.splice(index, 1);
    }
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>',
  pipes: [CleanLocalDataPipe]
})
class ApiDemoApp {
  root = ApiDemoPage;
}

ionicBootstrap(ApiDemoApp);
