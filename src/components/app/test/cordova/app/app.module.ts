import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { E2EApp } from './app.component';
import { PageOne } from '../pages/page-one/page-one';
import { SomeData } from '../pages/page-one/provider-one';
import { OtherData } from '../pages/page-one/provider-two';

@NgModule({
  declarations: [
    E2EApp,
    PageOne
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
      ]
    })
  ],
  bootstrap: [IonicApp],
  providers: [SomeData, OtherData],
  entryComponents: [
    PageOne
  ]
})
export class AppModule {}
