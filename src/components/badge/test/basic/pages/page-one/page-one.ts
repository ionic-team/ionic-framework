import { Component } from '@angular/core';
import { Config } from '../../../../../..';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  dynamicColor = 'primary';
  dynamicMode: string;

  constructor(config: Config) {
    this.dynamicMode = config.get('mode');
  }

  toggleColor() {
    if (this.dynamicColor === 'primary') {
      this.dynamicColor = 'secondary';
    } else if (this.dynamicColor === 'secondary') {
      this.dynamicColor = 'danger';
    } else {
      this.dynamicColor = 'primary';
    }
  }

  toggleMode() {
    if (this.dynamicMode === 'ios') {
      this.dynamicMode = 'md';
    } else if (this.dynamicMode === 'md') {
      this.dynamicMode = 'wp';
    } else {
      this.dynamicMode = 'ios';
    }
  }

  toggleBoth() {
    this.toggleColor();
    this.toggleMode();
  }
}
