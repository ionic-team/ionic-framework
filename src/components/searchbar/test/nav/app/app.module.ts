import { NgModule } from '@angular/core';
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
        { loadChildren: '../pages/detail-page/detail.module#DetailPageModule', name: 'DetailPage' },
        { loadChildren: '../pages/main-page/main.module#MainPageModule', name: 'MainPage' },
        { loadChildren: '../pages/modal-page/modal.module#ModalPageModule', name: 'ModalPage' },
        { loadChildren: '../pages/search-page/search.module#SearchPageModule', name: 'SearchPage' },
        { loadChildren: '../pages/tabs-page/tabs.module#TabsPageModule', name: 'TabsPage' },
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
  ]
})
export class AppModule {}
