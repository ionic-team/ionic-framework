import { Component } from '@angular/core';
import { Config, Platform } from '../../../../src';
import { PageOne } from '../pages/page-one/page-one';

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class AppComponent {
  config: any;
  root = PageOne;
  constructor(public _config: Config, public platform: Platform) {

    if (window.localStorage.getItem('configDemo') !== null) {
      this.config = JSON.parse(window.localStorage.getItem('configDemo'));
    } else if (platform.is('ios')) {
      this.config = {
        'backButtonIcon': 'ios-arrow-back',
        'iconMode': 'ios',
        'tabsPlacement': 'bottom'
      };
    } else if (platform.is('windows')) {
      this.config = {
        'backButtonIcon': 'ios-arrow-back',
        'iconMode': 'ios',
        'tabsPlacement': 'top'
      };
    } else {
      this.config = {
        'backButtonIcon': 'md-arrow-back',
        'iconMode': 'md',
        'tabsPlacement': 'bottom'
      };
    }

    this._config.set('tabsPlacement', this.config.tabsPlacement);
    this._config.set('iconMode', this.config.iconMode);
    this._config.set('backButtonIcon', this.config.backButtonIcon);
  }
}
