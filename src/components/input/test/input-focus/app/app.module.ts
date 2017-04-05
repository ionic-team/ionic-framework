import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { RootPage } from '../pages/root-page/root-page';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class AppComponent {
  rootPage = RootPage;
}

@NgModule({
  declarations: [
    AppComponent,
    RootPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {
      inputCloning: true,
      scrollAssist: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    RootPage
  ]
})
export class AppModule {}
