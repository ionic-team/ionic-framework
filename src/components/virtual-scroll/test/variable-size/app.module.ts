import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  items: any[] = [];

  constructor() {

    for (var i = 0; i < 5000; i++) {

      this.items.push({
        isHeader: ((i % 10) === 0),
        fontSize: Math.floor((Math.random() * 32) + 16) + 'px',
        item: i
      });

    }
  }

  headerFn(_record: any, recordIndex: number) {
    if (recordIndex > 0 && recordIndex % 100 === 0) {
      return recordIndex;
    }
    return null;
  }

}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>',
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
