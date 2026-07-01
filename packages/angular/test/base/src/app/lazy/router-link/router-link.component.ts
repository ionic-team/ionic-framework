import { Component, OnInit, signal } from '@angular/core';
import { NavController, ViewDidEnter, ViewDidLeave, ViewWillEnter, ViewWillLeave } from '@ionic/angular/lazy';
import { Router } from '@angular/router';

import { assertZoneContext } from '../../zone-assert.util';

@Component({
    selector: 'app-router-link',
    templateUrl: './router-link.component.html',
    standalone: false
})
export class RouterLinkComponent implements OnInit, ViewWillEnter, ViewDidEnter, ViewWillLeave, ViewDidLeave {

  // Signals so state set from Ionic lifecycle hooks renders under the
  // OnPush-by-default change detection introduced in Angular 22.
  onInit = signal(0);
  willEnter = signal(0);
  didEnter = signal(0);
  willLeave = signal(0);
  didLeave = signal(0);
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
    this.onInit.update((value) => value + 1);
  }

  ionViewWillEnter() {
    if (this.onInit() !== 1) {
      throw new Error('ngOnInit was not called');
    }
    assertZoneContext();
    this.willEnter.update((value) => value + 1);
  }
  ionViewDidEnter() {
    assertZoneContext();
    this.didEnter.update((value) => value + 1);
  }
  ionViewWillLeave() {
    assertZoneContext();
    this.willLeave.update((value) => value + 1);
  }
  ionViewDidLeave() {
    assertZoneContext();
    this.didLeave.update((value) => value + 1);
  }
}
