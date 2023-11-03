import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs-tab2',
  templateUrl: './tabs-tab2.component.html',
})
export class TabsTab2Component implements OnInit {
  title = 'ERROR';
  segment = 'two';
  changed = 'false';

  ngOnInit() {
    NgZone.assertInAngularZone();
    setTimeout(() => {
      NgZone.assertInAngularZone();
      this.title = 'Tab 2 - Page 1';
    });
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    this.changed = 'true';
  }
}
