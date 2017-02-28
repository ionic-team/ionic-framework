import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../src';

import { ApiDemoApp } from './app.component';
import { ApiDemoPage } from '../pages/demo-page';
import { PopoverRadioPage } from '../pages/page-two';

@NgModule({
  declarations: [
    ApiDemoApp,
    ApiDemoPage,
    PopoverRadioPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApiDemoPage,
    PopoverRadioPage
  ]
})
export class AppModule {}
