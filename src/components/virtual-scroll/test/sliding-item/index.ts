import {Component, ViewChild, ElementRef} from '@angular/core';
import {ionicBootstrap, Platform} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  items: any[] = [];
  webview: string;

  @ViewChild('content') content: ElementRef;

  constructor(platform: Platform) {
    for (var i = 0; i < 200; i++) {
      this.items.push({
        value: i,
        someMethod: function() {
          return '!!';
        }
      });
    }

    if (platform.is('ios')) {
      if (window.indexedDB) {
        this.webview = ': WKWebView';

      } else {
        this.webview = ': UIWebView';
      }
    }
  }

  headerFn(record: any, index: number, records: any[]) {
    if (index % 4 === 0) {
      return index + ' is divisible by 4';
    }

    return null;
  }

  reload() {
    window.location.reload(true);
  }

}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp, null, {
  prodMode: true
});
