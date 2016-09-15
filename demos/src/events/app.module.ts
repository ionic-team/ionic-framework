import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { ApiDemoApp, Login, Logout } from './app.component';

@NgModule({
  declarations: [
    ApiDemoApp,
    Login,
    Logout
  ],
  imports: [
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Login,
    Logout
  ]
})
export class AppModule {}
