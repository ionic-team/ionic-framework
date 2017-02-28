import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../src';

import { ApiDemoApp } from './app.component';
import { ApiDemoPage } from '../pages/demo-page';
import { PushPage } from '../pages/push-page';
import { TabPage } from '../pages/tabs';

@NgModule({
  declarations: [
    ApiDemoApp,
    ApiDemoPage,
    PushPage,
    TabPage
  ],
  imports: [
    BrowserModule,
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
        document.cookie = encodeURI(sKey) + '=' + encodeURI(sValue) + '; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=';
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
        document.cookie = encodeURI(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=';
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
