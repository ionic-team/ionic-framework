import { Component } from '@angular/core';
import { ionicBootstrap } from '../../../../../src';

@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  homeIcon = 'home';
  isActive = false;
  iconIndex = 0;
  icons = [
    'home',
    'star',
    'ios-alert',
    'ios-alert-outline',
    'md-alert',
    'logo-apple'
  ];
  btnIcon: string;

  constructor() {
    this.btnIcon = this.icons[0];
  }

  updateIcon() {
    this.iconIndex++;
    if (this.iconIndex >= this.icons.length) {
      this.iconIndex = 0;
    }
    this.btnIcon = this.icons[this.iconIndex];
  }
}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
class E2EApp {
  rootPage = E2EPage;
}

ionicBootstrap(E2EApp);
