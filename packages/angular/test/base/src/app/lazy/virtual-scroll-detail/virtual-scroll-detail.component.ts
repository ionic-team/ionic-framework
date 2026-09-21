import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewDidEnter, ViewDidLeave, ViewWillEnter, ViewWillLeave } from '@ionic/angular/lazy';

import { assertZoneContext } from '../../zone-assert.util';

@Component({
  selector: 'app-virtual-scroll-detail',
  templateUrl: './virtual-scroll-detail.component.html',
})
export class VirtualScrollDetailComponent implements OnInit, ViewWillEnter, ViewDidEnter, ViewWillLeave, ViewDidLeave {

  onInit = 0;
  willEnter = 0;
  didEnter = 0;
  willLeave = 0;
  didLeave = 0;

  itemNu: string | null = 'none';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.itemNu = this.route.snapshot.paramMap.get('itemId');
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
