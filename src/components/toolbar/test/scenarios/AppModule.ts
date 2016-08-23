import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EApp {

  buttonClick(button) {
    console.log(button);
  }

}

@NgModule({
  declarations: [
    E2EApp
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp
  ]
})
export class AppModule {}
