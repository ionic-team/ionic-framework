import { Component, OnInit, NgZone, Input } from '@angular/core';
import { ViewLifecycles } from '@ionic/angular';
@Component({
  selector: 'app-lifecycles-logger',
  templateUrl: './lifecycles-logger.component.html',
})
export class LifecyclesLoggerComponent {

  willEnter = 0;
  didEnter = 0;
  willLeave = 0;
  didLeave = 0;

  constructor(lifecycles: ViewLifecycles) {
    console.log(lifecycles);
    lifecycles.ionViewWillEnter$.subscribe(() => this.willEnter++);
    lifecycles.ionViewDidEnter$.subscribe(() => this.didEnter++);
    lifecycles.ionViewWillLeave$.subscribe(() => this.willLeave++);
    lifecycles.ionViewDidLeave$.subscribe(() => this.didLeave++);
  }
}
