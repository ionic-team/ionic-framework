import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { SessionList } from '../pages/session-list/session-list';


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = SessionList;
}

@NgModule({
  declarations: [
    E2EApp,
    SessionList
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, {}, {
      links: [
        { loadChildren: '../pages/session-detail/session-detail.module#SessionDetailModule', name: 'SessionDetail'}
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    SessionList
  ]
})
export class AppModule {}

