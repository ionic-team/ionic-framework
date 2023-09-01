import { Component, OnInit, NgZone } from '@angular/core';
import { IonRouterOutlet, ViewDidEnter, ViewDidLeave, ViewWillLeave } from '@ionic/angular';

@Component({
  selector: 'app-router-link-page',
  templateUrl: './router-link-page.component.html',
})
export class RouterLinkPageComponent implements OnInit, ViewWillLeave, ViewDidEnter, ViewWillLeave, ViewDidLeave {

  onInit = 0;
  willEnter = 0;
  didEnter = 0;
  willLeave = 0;
  didLeave = 0;
  canGoBack: boolean | null | undefined = null;

  constructor(
    private ionRouterOutlet: IonRouterOutlet
  ) {}

  ngOnInit() {
    NgZone.assertInAngularZone();
    this.canGoBack = this.ionRouterOutlet.canGoBack();
    this.onInit++;
  }

  ionViewWillEnter() {
    if (this.onInit !== 1) {
      throw new Error('ngOnInit was not called');
    }
    if (this.canGoBack !== this.ionRouterOutlet.canGoBack()) {
      throw new Error('canGoBack() changed');
    }
    NgZone.assertInAngularZone();
    this.willEnter++;
  }
  ionViewDidEnter() {
    if (this.canGoBack !== this.ionRouterOutlet.canGoBack()) {
      throw new Error('canGoBack() changed');
    }
    NgZone.assertInAngularZone();
    this.didEnter++;
  }
  ionViewWillLeave() {
    NgZone.assertInAngularZone();
    this.willLeave++;
  }
  ionViewDidLeave() {
    NgZone.assertInAngularZone();
    this.didLeave++;
  }
}
