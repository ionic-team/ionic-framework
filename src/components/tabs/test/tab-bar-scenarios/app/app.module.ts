import { Component, ViewEncapsulation, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { RootPage } from '../pages/root-page/root-page';

@Component({
  templateUrl: 'main.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
    ion-tabs {
      margin-bottom: 20px;
      contain: none;
    }
    `,
    `
    ion-tabs,
    ion-tabs ion-tabbar {
      position: relative;
      top: auto;
      height: auto;
      visibility: visible;
      opacity: 1;
    }
    `
  ]
})
export class AppComponent {
  root = RootPage;
}

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
    AppComponent,
    RootPage
  ]
})
export class AppModule {}
