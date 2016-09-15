import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { ApiDemoApp, ModalContentPage, ModalFirstPage } from './app.component';

@NgModule({
  declarations: [
    ApiDemoApp,
    ModalFirstPage,
    ModalContentPage
  ],
  imports: [
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ModalFirstPage,
    ModalContentPage
  ]
})
export class AppModule {}
