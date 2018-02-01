import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { RootPage } from '../pages/root-page/root-page';

@NgModule({
  declarations: [
    AppComponent,
    RootPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    RootPage
  ]
})
export class AppModule {}
