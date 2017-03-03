import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { E2EApp } from './app.component';
import { E2EPage } from '../pages/e2e-page/e2e-page';

@NgModule({
  declarations: [
    E2EApp,
    E2EPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, {}, {
      links: [
        { component: E2EPage, name: 'e2e-page' },
        { loadChildren: '../pages/page2/page2.module#Page2Module', name: 'page2' },
        { loadChildren: '../pages/page3/page3.module#Page3Module', name: 'page3' }
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage,
  ]
})
export class AppModule { }

