import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs-tab1',
  templateUrl: './tabs-tab1.component.html',
})
export class TabsTab1Component {
  title = 'ERROR';
  segment = 'one';
  changed = 'false';

  constructor(public navCtrl: NavController) {}

  ionViewWillEnter() {
    NgZone.assertInAngularZone();
    setTimeout(() => {
      NgZone.assertInAngularZone();
      this.title = 'Tab 1 - Page 1';
    });
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    this.changed = 'true';
  }
}
