import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';
import { E2EApp } from './app.component';
import { HomePage } from '../pages/home-page/home-page';
@NgModule({
  declarations: [
    E2EApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, {}, {
      links: [
        { component: HomePage, name: 'home-page' }
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    HomePage
  ]
})
export class AppModule { }
