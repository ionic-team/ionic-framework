import { ChangeDetectorRef, Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { assertZoneContext } from '../../zone-assert.util';

@Component({
  selector: 'app-tabs-tab1',
  templateUrl: './tabs-tab1.component.html',
  standalone: false
})
export class TabsTab1Component {
  title = 'ERROR';
  segment = 'one';
  changed = 'false';

  constructor(public navCtrl: NavController, private cdr: ChangeDetectorRef) {}

  ionViewWillEnter() {
    assertZoneContext();
    setTimeout(() => {
      assertZoneContext();
      this.title = 'Tab 1 - Page 1';
      // Zoneless: state set in an async callback Angular does not wrap won't re-render on its own; mark the view dirty.
      this.cdr.markForCheck();
    });
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    this.changed = 'true';
  }
}
