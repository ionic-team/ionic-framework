import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, Platform } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  items: any[] = [];
  webview: string;

  @ViewChild('content') content: ElementRef;

  constructor(plt: Platform) {
    for (var i = 0; i < 200; i++) {
      this.items.push({
        value: i,
        someMethod: function() {
          return '!!';
        }
      });
    }

    if (plt.is('ios')) {
      if (window.indexedDB) {
        this.webview = ': WKWebView';

      } else {
        this.webview = ': UIWebView';
      }
    }
  }

  headerFn(_record: any, index: number) {
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
export class AppComponent {
  root = E2EPage;
}


@NgModule({
  declarations: [
    AppComponent,
    E2EPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    E2EPage
  ]
})
export class AppModule {}
