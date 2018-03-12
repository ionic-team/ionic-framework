import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, NavController } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  items: { 1: [], 2: [] } = {1: [], 2: []};
  webview: string = '';
  counter: number = 0;

  vs: string = "1";

  constructor(public navCtrl: NavController) {
  }

  addItems() {
    if (this.items[this.vs].length === 0) {
      for (var i = 0; i < 200; i++) {
        this.addItem();
      }
    }
  }

  headerFn(_record: any, index: number, _records: any[]) {
    if (index % 4 === 0) {
      return index + ' is divisible by 4';
    }
    return null;
  }

  pushPage() {
    this.navCtrl.push(E2EPage);
  }

  addItem() {
    this.items[this.vs].push({
      value: this.vs + ' / ' + this.counter,
      someMethod: function () {
        return '!!';
      }
    });
    this.counter++;
  }

  addRandomItem() {
    const index = Math.floor(Math.random() * this.items[this.vs].length);
    console.log('Adding to index: ', index);
    this.items[this.vs].splice(index, 0, {
      value: Math.floor(Math.random() * 10000),
      someMethod: function () {
        return '!!';
      }
    });
  }

  changeItem() {
    const index = Math.floor(Math.random() * this.items[this.vs].length);
    console.log('Change to index: ', index);
    this.items[this.vs][index] = {value: Math.floor(Math.random() * 10000), someMethod: () => '!!'};
  }

  trackByFn(_index: number, item: any) {
    return item.value;
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
export class AppModule {
}
