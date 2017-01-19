import { Component, NgModule } from '@angular/core';
import { Config, IonicApp, IonicModule, Platform, NavController } from '../../../ionic-angular';

if (!window.localStorage) {
  Object.defineProperty(window, 'localStorage', new (function () {
    var aKeys: any[] = [], oStorage = {};
    Object.defineProperty(oStorage, 'getItem', {
      value: function (sKey: number) { return sKey ? this[sKey] : null; },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, 'key', {
      value: function (nKeyId: number) { return aKeys[nKeyId]; },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, 'setItem', {
      value: function (sKey: string, sValue: string) {
        if (!sKey) { return; }
        document.cookie = encodeURI(sKey) + '=' + encodeURI(sValue) + '; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/';
      },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, 'length', {
      get: function () { return aKeys.length; },
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, 'removeItem', {
      value: function (sKey: string) {
        if (!sKey) { return; }
        document.cookie = encodeURI(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      },
      writable: false,
      configurable: false,
      enumerable: false
    });
    this.get = function () {
      var iThisIndx: number;
      for (var sKey in oStorage) {
        iThisIndx = aKeys.indexOf(sKey);
        if (iThisIndx === -1) {
          (oStorage as any).setItem(sKey, (oStorage as any)[sKey]);
        } else {
          aKeys.splice(iThisIndx, 1);
        }
        delete (oStorage as any)[sKey];
      }
      for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { (oStorage as any).removeItem(aKeys[0]); }
      for (var aCouple: any, iKey: any, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
        aCouple = aCouples[nIdx].split(/\s*=\s*/);
        if (aCouple.length > 1) {
          (oStorage as any)[iKey = decodeURI(aCouple[0])] = decodeURI(aCouple[1]);
          aKeys.push(iKey);
        }
      }
      return oStorage;
    };
    this.configurable = false;
    this.enumerable = true;
  } as any)());
}

var CONFIG_DEMO: any = null;

if (window.localStorage.getItem('configDemo')) {
  CONFIG_DEMO = JSON.parse(window.localStorage.getItem('configDemo'));
}


@Component({
  templateUrl: 'tabs.html'
})
export class TabPage {
  tabOne = ApiDemoPage;
}


@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  config: any;
  initialConfig: any;
  constructor(_config: Config,  public navCtrl: NavController) {
    this.config = _config.settings();
    this.initialConfig = this.config;
  }


  load() {
    window.localStorage.setItem('configDemo', JSON.stringify(this.config));
    window.location.reload();
  }

  push() {
    this.navCtrl.push(PushPage);
  }
}

@Component({
  templateUrl: 'push-page.html'
})
export class PushPage {
  constructor(public navCtrl: NavController) {}

  pop() {
    this.navCtrl.pop();
  }
}


@Component({
  template: '<ion-nav [root]="root" #content></ion-nav>'
})
export class ApiDemoApp {
  config: any;
  root = TabPage;
  constructor(public _config: Config, public platform: Platform) {

    if (window.localStorage.getItem('configDemo') !== null) {
      this.config = JSON.parse(window.localStorage.getItem('configDemo'));
    } else if (platform.is('ios')) {
      this.config = {
        'backButtonIcon': 'ios-arrow-back',
        'iconMode': 'ios',
        'tabsPlacement': 'bottom'
      };
    } else if (platform.is('windows')) {
      this.config = {
        'backButtonIcon': 'ios-arrow-back',
        'iconMode': 'ios',
        'tabsPlacement': 'top'
      };
    } else {
      this.config = {
        'backButtonIcon': 'md-arrow-back',
        'iconMode': 'md',
        'tabsPlacement': 'bottom'
      };
    }

    this._config.set('tabsPlacement', this.config.tabsPlacement);
    this._config.set('iconMode', this.config.iconMode);
    this._config.set('backButtonIcon', this.config.backButtonIcon);
  }
}


@NgModule({
  declarations: [
    ApiDemoApp,
    ApiDemoPage,
    PushPage,
    TabPage
  ],
  imports: [
    IonicModule.forRoot(ApiDemoApp, CONFIG_DEMO)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApiDemoPage,
    PushPage,
    TabPage
  ]
})
export class AppModule {}
