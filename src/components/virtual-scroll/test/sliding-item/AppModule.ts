import { Component, ViewChild, ElementRef, NgModule } from '@angular/core';
import { IonicApp, IonicModule, Platform } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
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
export class E2EApp {
  root = E2EPage;
}


@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp, {
      prodMode: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
