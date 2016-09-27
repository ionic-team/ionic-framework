import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { ApiDemoApp, ApiDemoPage, PushPage } from './app.component';

@NgModule({
  declarations: [
    ApiDemoApp,
    ApiDemoPage,
    PushPage
  ],
  imports: [
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApiDemoPage,
    PushPage
  ]
})
export class AppModule {}
