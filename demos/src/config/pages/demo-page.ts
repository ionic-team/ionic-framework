import { Component } from '@angular/core';
import { Config, NavController } from '../../../../src';
import { PushPage } from './push-page';

@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
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
    this.navCtrl.push(PushPage);
  }
}
