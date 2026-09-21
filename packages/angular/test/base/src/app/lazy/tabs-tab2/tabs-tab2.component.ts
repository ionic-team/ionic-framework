import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { assertZoneContext } from '../../zone-assert.util';

@Component({
  selector: 'app-tabs-tab2',
  templateUrl: './tabs-tab2.component.html',
  standalone: false
})
export class TabsTab2Component implements OnInit {
  title = 'ERROR';
  segment = 'two';
  changed = 'false';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    assertZoneContext();
    setTimeout(() => {
      assertZoneContext();
      this.title = 'Tab 2 - Page 1';
      // Zoneless: state set in an async callback Angular does not wrap won't re-render on its own; mark the view dirty.
      this.cdr.markForCheck();
    });
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    this.changed = 'true';
  }
}
