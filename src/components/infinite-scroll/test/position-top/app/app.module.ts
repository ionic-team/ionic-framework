import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { RootPage } from '../pages/root-page/root-page';
import { PageTwo } from '../pages/page-two/page-two';

@NgModule({
  declarations: [
    AppComponent,
    RootPage,
    PageTwo
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    RootPage,
    PageTwo
  ]
})
export class AppModule {}
