import { BrowserModule, } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { IonicAngularModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';

import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { MapPage } from '../pages/map/map';
import { TabsPage } from '../pages/tabs-page/tabs-page';


@NgModule({
  declarations: [
    AboutPage,
    AppComponent,
    MapPage,
    PopoverPage,
    TabsPage
  ],
  entryComponents: [
    AboutPage,
    MapPage,
    PopoverPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicAngularModule.forRoot(),
    IonicStorageModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
