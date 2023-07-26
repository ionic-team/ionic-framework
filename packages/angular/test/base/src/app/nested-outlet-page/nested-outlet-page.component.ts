import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-nested-outlet-page',
  templateUrl: './nested-outlet-page.component.html',
})
export class NestedOutletPageComponent implements OnDestroy, OnInit {

  ngOnInit() {
    NgZone.assertInAngularZone();
  }

  ngOnDestroy() {
    NgZone.assertInAngularZone();
  }
}
