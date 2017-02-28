import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { RootPage } from '../pages/root-page';
import { ModalPage } from '../pages/modal-page';

@NgModule({
  declarations: [
    AppComponent,
    RootPage,
    ModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    RootPage,
    ModalPage
  ]
})
export class AppModule {}
