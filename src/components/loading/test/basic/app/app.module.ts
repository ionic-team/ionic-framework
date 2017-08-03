import { LoadingCustomCmp } from './../../../loading-custom/loading-custom-component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { PageOneModule } from '../pages/page-one/page-one.module';

@NgModule({
  declarations: [
    AppComponent,
    LoadingCustomCmp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot([AppComponent, LoadingCustomCmp], {}),
    PageOneModule
  ],
  bootstrap: [IonicApp],
})
export class AppModule { }

