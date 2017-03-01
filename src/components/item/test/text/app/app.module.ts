import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { E2EApp } from './app.component';
import { RootPageModule } from '../pages/root-page/root-page.module';

@NgModule({
  declarations: [
    E2EApp
  ],
  imports: [
    BrowserModule,
    RootPageModule,
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp
  ]
})
export class AppModule {}
