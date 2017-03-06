import { Component, ViewEncapsulation, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { RootPage } from '../pages/root-page/root-page';

@Component({
  templateUrl: 'main.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
    ion-tabs {
      margin-bottom: 20px;
      contain: none;
    }
    `,
    `
    ion-tabs,
    ion-tabs ion-tabbar {
      position: relative;
      top: auto;
      height: auto;
      visibility: visible;
      opacity: 1;
    }
    `
  ]
})
export class E2EApp {
  root = RootPage;
}

@NgModule({
  declarations: [
    E2EApp,
    RootPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    RootPage
  ]
})
export class AppModule {}
