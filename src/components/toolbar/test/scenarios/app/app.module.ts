import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { RootPage } from '../pages/root-page/root-page'

@NgModule({
  declarations: [
    RootPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(RootPage)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    RootPage
  ]
})
export class AppModule {}
