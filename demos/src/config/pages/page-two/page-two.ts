import { Component } from '@angular/core';
import { Config, NavController } from '../../../../../src';
import { PageThree } from '../page-three/page-three';

@Component({
  templateUrl: 'page-two.html'
})
export class PageTwo {
  config: any;
  initialConfig: any;
  constructor(_config: Config,  public navCtrl: NavController) {
    this.config = _config.settings();
    this.initialConfig = this.config;
  }

  load() {
    window.localStorage.setItem('configDemo', JSON.stringify(this.config));
    window.location.reload();
  }

  push() {
    this.navCtrl.push(PageThree);
  }
}
