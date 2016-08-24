import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  isDestructive: boolean;
  isSecondary: boolean;
  isCustom: boolean;
  isSolid: boolean;
  isOutline: boolean;
  isClear: boolean;
  isClicked: boolean;
  myColor1: string;
  myColor2: string;
  multiColor: Array<string>;
  showIf: boolean = true;

  constructor() {
    this.reset();
  }

  unify() {
    this.isDestructive = false;
    this.isSecondary = false;
    this.isCustom = false;
    this.isSolid = false;
    this.isOutline = false;
    this.isClear = false;
    this.isClicked = false;
    this.myColor1 = 'primary';
    this.myColor2 = 'primary';
  }

  reset() {
    this.isDestructive = true;
    this.isSecondary = true;
    this.isCustom = true;
    this.isSolid = true;
    this.isOutline = true;
    this.isClear = true;
    this.isClicked = false;
    this.myColor1 = 'custom1';
    this.myColor2 = 'custom2';
  }

  toggle() {
    this.isClicked = !this.isClicked;
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
