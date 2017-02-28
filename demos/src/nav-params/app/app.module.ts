import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../src';

import { ApiDemoApp } from './app.component';
import { ApiDemoPage } from '../pages/demo-page';
import { PushPage } from '../pages/push-page';

@NgModule({
  declarations: [
    ApiDemoApp,
    ApiDemoPage,
    PushPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApiDemoPage,
    PushPage
  ]
})
export class AppModule {}
