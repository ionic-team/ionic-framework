import { Component, OnInit, NgZone, Input } from '@angular/core';
import { ViewLifecycles } from '@ionic/angular';
@Component({
  selector: 'app-lifecycles-logger',
  templateUrl: './lifecycles-logger.component.html',
})
export class LifecyclesLoggerComponent implements OnInit {

  willEnter = 0;
  didEnter = 0;
  willLeave = 0;
  didLeave = 0;
  onInit = 0;

  constructor(lifecycles: ViewLifecycles) {
    lifecycles.ionViewWillEnter$.subscribe(() => {
      NgZone.assertInAngularZone();
      this.willEnter++;
    });
    lifecycles.ionViewDidEnter$.subscribe(() => {
      NgZone.assertInAngularZone();
      this.didEnter++;
    });
    lifecycles.ionViewWillLeave$.subscribe(() => {
      NgZone.assertInAngularZone();
      this.willLeave++;
    });
    lifecycles.ionViewDidLeave$.subscribe(() => {
      NgZone.assertInAngularZone();
      this.didLeave++;
    });
  }

  ngOnInit() {
    NgZone.assertInAngularZone();
    this.onInit++;
  }
}
