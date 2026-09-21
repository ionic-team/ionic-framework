import { Component, OnInit, signal } from '@angular/core';
import { IonRouterOutlet, ViewDidEnter, ViewDidLeave, ViewWillLeave } from '@ionic/angular/lazy';

import { assertZoneContext } from '../../zone-assert.util';

@Component({
    selector: 'app-router-link-page',
    templateUrl: './router-link-page.component.html',
    standalone: false
})
export class RouterLinkPageComponent implements OnInit, ViewWillLeave, ViewDidEnter, ViewWillLeave, ViewDidLeave {

  // Signals so state set from Ionic lifecycle hooks renders under the
  // OnPush-by-default change detection introduced in Angular 22.
  onInit = signal(0);
  willEnter = signal(0);
  didEnter = signal(0);
  willLeave = signal(0);
  didLeave = signal(0);
  canGoBack = signal<boolean | null | undefined>(null);

  constructor(
    private ionRouterOutlet: IonRouterOutlet
  ) {}

  ngOnInit() {
    assertZoneContext();
    this.canGoBack.set(this.ionRouterOutlet.canGoBack());
    this.onInit.update((value) => value + 1);
  }

  ionViewWillEnter() {
    if (this.onInit() !== 1) {
      throw new Error('ngOnInit was not called');
    }
    if (this.canGoBack() !== this.ionRouterOutlet.canGoBack()) {
      throw new Error('canGoBack() changed');
    }
    assertZoneContext();
    this.willEnter.update((value) => value + 1);
  }
  ionViewDidEnter() {
    if (this.canGoBack() !== this.ionRouterOutlet.canGoBack()) {
      throw new Error('canGoBack() changed');
    }
    assertZoneContext();
    this.didEnter.update((value) => value + 1);
  }
  ionViewWillLeave() {
    assertZoneContext();
    this.willLeave.update((value) => value + 1);
  }
  ionViewDidLeave() {
    assertZoneContext();
    this.didLeave.update((value) => value + 1);
  }
}
