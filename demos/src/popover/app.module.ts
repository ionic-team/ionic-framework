import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { ApiDemoApp, ApiDemoPage, PopoverRadioPage } from './app.component';

@NgModule({
  declarations: [
    ApiDemoApp,
    ApiDemoPage,
    PopoverRadioPage
  ],
  imports: [
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApiDemoPage,
    PopoverRadioPage
  ]
})
export class AppModule {}
