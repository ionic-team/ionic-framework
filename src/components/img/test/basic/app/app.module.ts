import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { RootPage } from '../pages/root-page/root-page';
import { MyImg } from '../pages/my-img/my-img';

@NgModule({
  declarations: [
    AppComponent,
    RootPage,
    MyImg
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    RootPage,
    MyImg
  ]
})
export class AppModule {}
