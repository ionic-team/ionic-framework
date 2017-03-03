import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, Range } from '../../../../..';

import { RootPage } from '../pages/root-page/root-page';

@Component({
  templateUrl: 'main.html'
})
export class E2EApp {
  rootPage = RootPage;
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
