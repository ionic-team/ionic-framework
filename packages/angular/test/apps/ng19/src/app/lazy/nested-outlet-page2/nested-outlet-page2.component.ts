import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-nested-outlet-page2',
    templateUrl: './nested-outlet-page2.component.html',
    standalone: false
})
export class NestedOutletPage2Component implements OnDestroy, OnInit {

  ngOnInit() {
    NgZone.assertInAngularZone();
  }

  ngOnDestroy() {
    NgZone.assertInAngularZone();
  }
}
