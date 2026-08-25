/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonTabBar } from '@ionic/core/components/ion-tab-bar.js';

@ProxyCmp({
  defineCustomElementFn: defineIonTabBar,
  inputs: ['color', 'mode', 'selectedTab', 'translucent']
})
@Component({
  selector: 'ion-tab-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'mode', 'selectedTab', 'translucent'],
})
export class IonTabBar {
  protected el: HTMLIonTabBarElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonTabBar extends Components.IonTabBar {}


