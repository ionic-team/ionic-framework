import { Component, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';
import {E2EApp} from './app.component';
import {SignIn} from '../pages/signin-page/signIn';
import {ModalChat} from '../pages/modalChat/modalChat';
@NgModule({
  declarations: [
    E2EApp,
    SignIn,
    ModalChat
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, {tabsHideOnSubPages: true}, {
      links: [
        { component: SignIn, name: 'sign-in' },
        { loadChildren: '../pages/tabs-page/tabs.module#TabsPageModule', name: 'tabs' },
        { loadChildren: '../pages/tab1-page1/tab1-page1.module#Tab1Page1Module', name: 'tab1-page1' },
        { loadChildren: '../pages/tab1-page2/tab1-page2.module#Tab1Page2Module', name: 'tab1-page2' },
        { loadChildren: '../pages/tab1-page3/tab1-page3.module#Tab1Page3Module', name: 'tab1-page3' },
        { loadChildren: '../pages/tab2-page1/tab2-page1.module#Tab2Page1Module', name: 'tab2-page1' },
        { loadChildren: '../pages/tab2-page2/tab2-page2.module#Tab2Page2Module', name: 'tab2-page2' },
        { loadChildren: '../pages/tab2-page3/tab2-page3.module#Tab2Page3Module', name: 'tab2-page3' },
        { loadChildren: '../pages/tab3-page1/tab3-page1.module#Tab3Page1Module', name: 'tab3-page1' },
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    SignIn,
    ModalChat
  ]
})
export class AppModule {}
