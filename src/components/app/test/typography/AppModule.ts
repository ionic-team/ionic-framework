import { Component, NgModule } from '@angular/core';
import { IonicModule, App } from '../../../dist';


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
  entryComponents: [
    E2EApp
  ]
})
export class AppModule {}
