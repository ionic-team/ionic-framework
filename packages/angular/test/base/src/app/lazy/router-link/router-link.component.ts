import { Component, OnInit } from '@angular/core';
import { NavController, ViewDidEnter, ViewDidLeave, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Router } from '@angular/router';

import { assertZoneContext } from '../../zone-assert.util';

@Component({
    selector: 'app-router-link',
    templateUrl: './router-link.component.html',
    standalone: false
})
export class RouterLinkComponent implements OnInit, ViewWillEnter, ViewDidEnter, ViewWillLeave, ViewDidLeave {

  onInit = 0;
  willEnter = 0;
  didEnter = 0;
  willLeave = 0;
  didLeave = 0;
  changes = 0;

  constructor(
    private navCtrl: NavController,
    private router: Router
  ) {}

  navigate() {
    this.router.navigateByUrl('/lazy/router-link-page');
  }

  navigateForward() {
    this.navCtrl.navigateForward('/lazy/router-link-page');
  }

  navigateBack() {
    this.navCtrl.navigateBack('/lazy/router-link-page');
  }

  navigateRoot() {
    this.navCtrl.navigateRoot('/lazy/router-link-page');
  }

  counter() {
    this.changes++;
    return Math.floor(this.changes / 2);
  }

  ngOnInit() {
    assertZoneContext();
    this.onInit++;
  }

  ionViewWillEnter() {
    if (this.onInit !== 1) {
      throw new Error('ngOnInit was not called');
    }
    assertZoneContext();
    this.willEnter++;
  }
  ionViewDidEnter() {
    assertZoneContext();
    this.didEnter++;
  }
  ionViewWillLeave() {
    assertZoneContext();
    this.willLeave++;
  }
  ionViewDidLeave() {
    assertZoneContext();
    this.didLeave++;
  }
}
