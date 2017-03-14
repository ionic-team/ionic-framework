import { Component, NgModule, enableProdMode } from '@angular/core';
import { IonicApp, IonicModule, NavController, Platform } from '../../../../../ionic-angular';


enableProdMode();

@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  items: any[] = [];
  webview: string = '';
  counter: number = 0;

  constructor(plt: Platform, public navCtrl: NavController) {
    for (var i = 0; i < 200; i++) {
      this.addItem();
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

  headerFn(record: any, index: number, records: any[]) {
    if (index % 4 === 0) {
      return index + ' is divisible by 4';
    }
    return null;
  }

  pushPage() {
    this.navCtrl.push(E2EPage);
  }

  addItem() {
    this.items.push({
      value: this.counter,
      someMethod: function() {
        return '!!';
      }
    });
    this.counter++;
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
