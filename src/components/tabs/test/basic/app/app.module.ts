import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { E2EApp } from './app.component';
import { Tab1 } from '../components/tab1';
import { Tab2 } from '../components/tab2';
import { Tab3 } from '../components/tab3';

@NgModule({
  declarations: [
    E2EApp,
    Tab1,
    Tab2,
    Tab3,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, {
      tabsHighlight: true,
    }, {
      links: [
        { loadChildren: '../pages/tabs-page/tabs.module#TabsPageModule', name: 'TabsPage' },
        { loadChildren: '../components/modal/modal.module#MyModalModule', name: 'MyModal' },
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    Tab1,
    Tab2,
    Tab3,
  ]
})
export class AppModule {}
