import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../src';

import { ApiDemoApp } from './app.component';
import { Login } from '../pages/login';
import { Logout } from '../pages/logout';


@NgModule({
  declarations: [
    ApiDemoApp,
    Login,
    Logout
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Login,
    Logout
  ]
})
export class AppModule {}
