import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../../../ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  myParam = '';
  minValue = 8;
  maxValue = 12;
  stepValue = 2;

  myValues = {
    value1: 'Dynamic Input',
    value2: 'Dynamic Textarea'
  };

  toggleValues() {
    this.minValue === 8 ? this.minValue = 4 : this.minValue = 8;
    this.maxValue === 12 ? this.maxValue = 20 : this.maxValue = 12;
    this.stepValue === 2 ? this.stepValue = 4 : this.stepValue = 2;
  }
}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class E2EApp {
  rootPage = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EPage
  ]
})
export class AppModule {}
