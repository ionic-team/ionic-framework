import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { E2EApp } from './app.component';

@NgModule({
  declarations: [
    E2EApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, {}, {
      links: [
        { loadChildren: '../pages/landing-page/landing-page.module#LandingPageModule', name: 'LandingPage' },
        { loadChildren: '../pages/first-page/first-page.module#FirstPageModule', name: 'FirstPage' },
        { loadChildren: '../pages/second-page/second-page.module#SecondPageModule', name: 'SecondPage' },
        { loadChildren: '../pages/third-page/third-page.module#ThirdPageModule', name: 'ThirdPage' },
        { loadChildren: '../pages/fourth-page/fourth-page.module#FourthPageModule', name: 'FourthPage' },
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
  ]
})
export class AppModule {}
