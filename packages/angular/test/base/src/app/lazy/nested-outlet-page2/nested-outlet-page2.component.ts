import { Component, OnDestroy, OnInit } from '@angular/core';

import { assertZoneContext } from '../../zone-assert.util';

@Component({
    selector: 'app-nested-outlet-page2',
    templateUrl: './nested-outlet-page2.component.html',
    standalone: false
})
export class NestedOutletPage2Component implements OnDestroy, OnInit {

  ngOnInit() {
    assertZoneContext();
  }

  ngOnDestroy() {
    assertZoneContext();
  }
}
