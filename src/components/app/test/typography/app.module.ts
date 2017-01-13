import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, App } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EApp {
  constructor(app: App) {
    app.setTitle('Basic Buttons');
  }
}

@NgModule({
  declarations: [
    E2EApp
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
