import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { ApiDemoApp, Page1, Page2 } from './app.component';

@NgModule({
  declarations: [
    ApiDemoApp,
    Page1,
    Page2
  ],
  imports: [
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Page1,
    Page2
  ]
})
export class AppModule {}
