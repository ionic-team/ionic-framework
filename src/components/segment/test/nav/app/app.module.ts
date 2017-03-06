import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { E2EApp } from './app.component';
import { FirstPage } from '../pages/first-page/first-page';

@NgModule({
  declarations: [
    E2EApp,
    FirstPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, {}, {
      links: [
        { name: 'first-page', component: FirstPage },
        { name: 'second-page', loadChildren: '../pages/second-page/second-page.module#SecondPageModule' },
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    FirstPage
  ]
})
export class AppModule { }
