import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { E2EApp } from './app.component';
import { RootPage } from '../pages/root-page/root-page';
import { ModalPage } from '../pages/modal-page/modal-page';

@NgModule({
  declarations: [
    E2EApp,
    RootPage,
    ModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    RootPage,
    ModalPage
  ]
})
export class AppModule {}
