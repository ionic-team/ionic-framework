import { NgModule, Component } from '@angular/core';
import { IonicApp, IonicModule, App } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  btnColor: string;
  testingColors = ['primary', 'secondary', 'danger', 'dark'];
  testingColorIndex = 0;

  constructor(app: App) {
    app.setTitle('Basic Buttons');
    this.chgColor();
  }

  chgColor() {
    this.btnColor = this.testingColors[this.testingColorIndex];
    console.log('dynamic btnColor', this.btnColor);
    this.testingColorIndex = (this.testingColorIndex >= this.testingColors.length - 1 ? 0 : this.testingColorIndex + 1);
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
