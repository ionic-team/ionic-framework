import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { PageOneModule } from '../pages/page-one/page-one.module';
import { ToastCustomCmp } from '../toast-custom/toast-custom-component';

@NgModule({
  declarations: [
    AppComponent,
    ToastCustomCmp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot([AppComponent, ToastCustomCmp], {}),
    PageOneModule
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
