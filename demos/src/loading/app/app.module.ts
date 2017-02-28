import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../src';

import { ApiDemoApp } from './app.component';
import { Page1 } from '../pages/page-one';
import { Page2 } from '../pages/page-two';

@NgModule({
  declarations: [
    ApiDemoApp,
    Page1,
    Page2
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Page1,
    Page2
  ]
})
export class AppModule {}
