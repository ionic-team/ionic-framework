import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-virtual-scroll-detail',
  templateUrl: './virtual-scroll-detail.component.html',
})
export class VirtualScrollDetailComponent implements OnInit {

  onInit = 0;
  willEnter = 0;
  didEnter = 0;
  willLeave = 0;
  didLeave = 0;

  itemNu = 'none';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.itemNu = this.route.snapshot.paramMap.get('itemId');
    NgZone.assertInAngularZone();
    this.onInit++;
  }

  ionViewWillEnter() {
    if (this.onInit !== 1) {
      throw new Error('ngOnInit was not called');
    }
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
