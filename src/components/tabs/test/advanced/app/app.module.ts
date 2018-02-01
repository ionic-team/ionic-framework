import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { SignInPageModule } from '../pages/signin-page/sign-in-page.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {tabsHideOnSubPages: true}),
    SignInPageModule
  ],
  bootstrap: [IonicApp],
})
export class AppModule {}
