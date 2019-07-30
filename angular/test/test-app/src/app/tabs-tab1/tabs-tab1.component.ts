import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-tabs-tab1',
  templateUrl: './tabs-tab1.component.html',
})
export class TabsTab1Component {
  title = 'ERROR';

  ionViewWillEnter() {
    NgZone.assertInAngularZone();
    setTimeout(() => {
      NgZone.assertInAngularZone();
      this.title = 'Tab 1 - Page 1';
    });
  }
}
