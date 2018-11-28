import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-router-link-page',
  templateUrl: './router-link-page.component.html',
})
export class RouterLinkPageComponent {

  willEnter = 0;
  didEnter = 0;
  willLeave = 0;
  didLeave = 0;

  ionViewWillEnter() {
    NgZone.assertInAngularZone();
    this.willEnter++;
  }
  ionViewDidEnter() {
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
