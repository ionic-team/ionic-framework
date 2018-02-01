import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../..';

@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  items: number[] = [];

  constructor() {
    for (var i = 0; i < 100; i++) {
      this.items.push(i);
    }
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
