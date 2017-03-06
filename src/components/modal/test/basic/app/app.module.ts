import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicApp } from '../../../../..';

import { E2EApp } from './app.component';
import { SomeAppProvider } from '../services/some-app-provider';

@NgModule({
  declarations: [
    E2EApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, {
      statusbarPadding: true,
      swipeBackEnabled: true
    }, {
      links: [
        { loadChildren: '../pages/main/main.module#E2EPageModule', name: 'E2EPage' },
        { loadChildren: '../pages/modal-first/modal-first.module#ModalFirstPageModule', name: 'ModalFirstPage' },
        { loadChildren: '../pages/modal-second/modal-second.module#ModalSecondPageModule', name: 'ModalSecondPage' },
        { loadChildren: '../components/contact-us/contact-us.module#ContactUsModalModule', name: 'ContactUsModal' },
        { loadChildren: '../components/modal-pass-data/modal-pass-data.module#ModalPassDataModule', name: 'ModalPassData' },
        { loadChildren: '../components/modal-with-inputs/modal-with-inputs.module#ModalWithInputsModule', name: 'ModalWithInputs' },
        { loadChildren: '../components/toolbar/toolbar.module#ToolbarModalModule', name: 'ToolbarModal' },
      ]
    })
  ],
  bootstrap: [IonicApp],
  providers: [SomeAppProvider],
  entryComponents: [
    E2EApp,
  ]
})
export class AppModule {}

