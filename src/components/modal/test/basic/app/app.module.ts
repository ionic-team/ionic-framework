import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicApp } from '../../../../..';

import { E2EApp } from './app.component';
import { ModalWithInputs } from '../pages/modal-with-inputs/modal-with-inputs';
import { ContactUs } from '../pages/contact-us/contact-us';
import { ModalPassData } from '../pages/modal-pass-data/modal-pass-data';
import { ToolbarModal } from '../pages/toolbar-modal/toolbar-modal';
import { SomeAppProvider } from '../components/some-app-provider';

@NgModule({
  declarations: [
    E2EApp,
    ModalWithInputs,
    ContactUs,
    ModalPassData,
    ToolbarModal
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, {
      statusbarPadding: true,
      swipeBackEnabled: true
    }, {
      links: [
        { loadChildren: '../pages/main/main.module#E2EPageModule', name: 'E2EPage' },
        { loadChildren: '../pages/modal-first-page/modal-first-page.module#ModalFirstPageModule', name: 'ModalFirstPage' },
        { loadChildren: '../pages/modal-second-page/modal-second-page.module#ModalSecondPageModule', name: 'ModalSecondPage' }
      ]
    })
  ],
  bootstrap: [IonicApp],
  providers: [SomeAppProvider],
  entryComponents: [
    E2EApp,
    ModalWithInputs,
    ContactUs,
    ModalPassData,
    ToolbarModal
  ]
})
export class AppModule {}

