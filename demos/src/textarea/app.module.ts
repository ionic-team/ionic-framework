import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { ApiDemoApp, ApiDemoPage, TabPage } from './app.component';

@NgModule({
  declarations: [
    ApiDemoApp,
    ApiDemoPage,
    TabPage
  ],
  imports: [
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApiDemoPage
  ]
})
export class AppModule {}