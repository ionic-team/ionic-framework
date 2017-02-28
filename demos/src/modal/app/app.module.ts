import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../src';

import { ApiDemoApp } from './app.component';
import { ModalFirstPage } from '../pages/page-one';
import { ModalContentPage } from '../pages/modal-content';

@NgModule({
  declarations: [
    ApiDemoApp,
    ModalFirstPage,
    ModalContentPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ModalFirstPage,
    ModalContentPage
  ]
})
export class AppModule {}
