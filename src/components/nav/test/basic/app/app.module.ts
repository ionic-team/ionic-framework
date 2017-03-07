import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { E2EApp } from './app.component';
import { FirstPage } from '../pages/first-page/first-page';
import { MyCmpTest } from '../pages/first-page/my-component';
import { MyCmpTest2 } from '../pages/first-page/my-component-two';


@NgModule({
  declarations: [
    E2EApp,
    FirstPage,
    MyCmpTest,
    MyCmpTest2
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, { swipeBackEnabled: true, preloadModules: true }, {
      links: [
        { name: 'first-page', component: FirstPage },
        { name: 'another-page', priority: 'low', loadChildren: '../pages/another-page/another-page.module#AnotherPageModule' },
        { name: 'full-page', priority: 'low', loadChildren: '../pages/full-page/full-page.module#FullPageModule', defaultHistory: ['first-page', 'another-page'] },
        { name: 'primary-header-page', priority: 'high',  loadChildren: '../pages/primary-header-page/primary-header-page.module#PrimaryHeaderPageModule' },
        { name: 'redirect-page', priority: 'low',  loadChildren: '../pages/redirect-page/redirect-page.module#RedirectPageModule' },
        { name: 'tab-item-page', priority: 'high',  loadChildren: '../pages/tab-item-page/tab-item-page.module#TabItemPageModule' },
        { name: 'another-one', priority: 'off', loadChildren: '../pages/tab-item-page/tab-item-page.module#TabItemPageModule' },
        { name: 'tabs', priority: 'high',  loadChildren: '../pages/tabs/tabs.module#TabsPageModule' },
        { name: 'tab-one', priority: 'off',  loadChildren: '../pages/tab-one/tab-one.module#Tab1Module' },
        { name: 'tab-two', priority: 'low',  loadChildren: '../pages/tab-two/tab-two.module#Tab2Module' },
        { name: 'tab-three', priority: 'low',  loadChildren: '../pages/tab-three/tab-three.module#Tab3Module' },
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    FirstPage
  ]
})
export class AppModule {}
