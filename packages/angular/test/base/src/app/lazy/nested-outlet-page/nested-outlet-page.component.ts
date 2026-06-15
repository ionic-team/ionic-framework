import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/lazy';

import { assertZoneContext } from '../../zone-assert.util';

@Component({
    selector: 'app-nested-outlet-page',
    templateUrl: './nested-outlet-page.component.html',
    standalone: false
})
export class NestedOutletPageComponent implements OnDestroy, OnInit {
  hasParentOutlet = false;

  constructor(private routerOutlet: IonRouterOutlet) {
    this.hasParentOutlet = routerOutlet.parentOutlet != null;
  }

  ngOnInit() {
    assertZoneContext();
  }

  ngOnDestroy() {
    assertZoneContext();
  }
}
