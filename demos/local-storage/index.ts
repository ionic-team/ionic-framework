import {App, Page, IonicApp, Config, Platform} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import {Pipe, PipeTransform, Injectable} from 'angular2/core'


@Pipe({name: 'cleanLocalData'})
@Injectable()
class CleanLocalDataPipe implements PipeTransform {
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

@App({
  template: '<ion-nav [root]="root"></ion-nav>',
  pipes: [CleanLocalDataPipe]
})
class ApiDemoApp {
  constructor() {
    this.root = MainPage;
  }
}

@Page({
  templateUrl: 'main.html',
  pipes: [CleanLocalDataPipe]
})
class MainPage {
  constructor() {
    this.local = new Storage(LocalStorage);
    this.localStorageDemo = '{}';
    window.localStorage.clear();

    this.myItem = {
      key: 'username',
      value: 'admin'
    };

    this.keys = ['username', 'name', 'email', 'address'];
    this.values = ['admin', 'Administrator', 'admin@administrator.com', '123 Admin St'];
    this.addedKeys = [];
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
