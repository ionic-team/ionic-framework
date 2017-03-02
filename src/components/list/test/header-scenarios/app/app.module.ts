import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { E2EApp } from './app.component';
import { E2EPageModule } from '../pages/main/main.module';

@NgModule({
  declarations: [
    E2EApp
  ],
  imports: [
    BrowserModule,
    E2EPageModule,
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp
  ]
})
export class AppModule {}
