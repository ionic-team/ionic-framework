import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { E2EApp } from './app.component';
import { PageOne } from '../pages/page-one/page-one';
import { PageOneModule } from '../pages/page-one/page-one.module';

@NgModule({
  declarations: [
    E2EApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, { statusbarPadding: true }, {
      links: [
        { name: 'page-one', component: PageOne },
        { name: 'page-two', loadChildren: '../pages/page-two/page-two.module#PageTwoModule'},
        { name: 'page-three', loadChildren: '../pages/page-three/page-three.module#PageThreeModule'},
        { name: 'tabs-page', loadChildren: '../pages/tabs/tabs-page.module#TabsPageModule'},
        { name: 'tabs-page-one', loadChildren: '../pages/tabs-page-one/tabs-page-one.module#TabsPageOneModule'},
        { name: 'modal-page', loadChildren: '../pages/modal/modal.module#ModalPageModule'}
      ]
    }),
    PageOneModule
  ],
  bootstrap: [IonicApp],
})
export class AppModule {}
