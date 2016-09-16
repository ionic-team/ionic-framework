import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { ApiDemoApp, ApiDemoPage, PushPage, TabPage } from './app.component';

@NgModule({
  declarations: [
    ApiDemoApp,
    ApiDemoPage,
    PushPage,
    TabPage
  ],
  imports: [
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApiDemoPage,
    PushPage,
    TabPage
  ]
})
export class AppModule {}
