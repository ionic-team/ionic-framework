import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, Platform } from '../../../../../ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  items: any[] = [];
  webview: string = '';
  type: string = 'range';
  testCheck: boolean;

  constructor(plt: Platform) {
    for (var i = 0; i < 200; i++) {
      if (i % 2 === 0) {
        this.changeType();
      }

      this.items.push({
        value: i,
        type: this.type,
        class: `item-${i}`
      });
    }

    if (plt.is('ios')) {
      if (plt.testUserAgent('Safari')) {
        this.webview = ': iOS Safari';

      } else if (!!window['webkit']) {
        this.webview = ': iOS WKWebView';

      } else {
        this.webview = ': iOS UIWebView';
      }
    }
  }

  changeType() {
    if (this.type === 'range') {
      this.type = 'checkbox';
    } else if (this.type === 'checkbox') {
      this.type = 'toggle';
    } else if (this.type === 'toggle') {
      this.type = 'radio';
    } else {
      this.type = 'range';
    }
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
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
