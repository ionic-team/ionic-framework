import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { Page3 } from '../pages/page3/page3';
import { Page4 } from '../pages/page4/page4';
import { RootPage } from '../pages/root-page/root-page';
import { TabsPage } from '../pages/tabs/tabs';


@NgModule({
  declarations: [
    AppComponent,
    Page1,
    Page2,
    Page3,
    Page4,
    RootPage,
    TabsPage,
    RootPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Page1,
    Page2,
    Page3,
    Page4,
    RootPage,
    TabsPage,
    RootPage,
    TabsPage
  ]
})
export class AppModule {}
