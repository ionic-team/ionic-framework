import {Component} from '@angular/core';
import {App, ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  btnColor;
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
class E2EApp {
  rootPage = E2EPage;
}

ionicBootstrap(E2EApp);
