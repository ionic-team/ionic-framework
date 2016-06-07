import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';

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
  btnIcon;

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

ionicBootstrap(E2EPage);
