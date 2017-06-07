import { Component } from '@angular/core';


@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
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
  dynamicColor: string = 'danger';

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
