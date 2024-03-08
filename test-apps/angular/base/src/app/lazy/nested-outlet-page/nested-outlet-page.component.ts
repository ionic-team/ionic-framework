import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-nested-outlet-page',
  templateUrl: './nested-outlet-page.component.html',
})
export class NestedOutletPageComponent implements OnDestroy, OnInit {
  hasParentOutlet = false;

  constructor(private routerOutlet: IonRouterOutlet) {
    this.hasParentOutlet = routerOutlet.parentOutlet != null;
  }

  ngOnInit() {
    NgZone.assertInAngularZone();
  }

  ngOnDestroy() {
    NgZone.assertInAngularZone();
  }
}
