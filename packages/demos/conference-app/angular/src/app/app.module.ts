import { BrowserModule, } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicAngularModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AppComponent } from './app.component';

import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { MapPage } from '../pages/map/map';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { TabsPage } from '../pages/tabs-page/tabs-page';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';

@NgModule({
  declarations: [
    AboutPage,
    AppComponent,
    MapPage,
    PopoverPage,
    SpeakerListPage,
    TabsPage
  ],
  entryComponents: [
    AboutPage,
    MapPage,
    PopoverPage,
    SpeakerListPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicAngularModule.forRoot(),
    IonicStorageModule.forRoot()
  ],
  providers: [
    ConferenceData,
    InAppBrowser,
    SplashScreen,
    UserData
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
