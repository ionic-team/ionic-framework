import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class Page1 {
  items: any = [];

  constructor() {
    for (let i = 0; i < 100; i++) {
      this.items.push(i);
    }
  }
}


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class AppComponent {
  rootPage = Page1;
}

@NgModule({
  declarations: [
    AppComponent,
    Page1
  ],
  imports: [
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    Page1
  ]
})
export class AppModule {}
