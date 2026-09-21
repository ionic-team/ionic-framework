/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonNavLink } from '@ionic/core/components/ion-nav-link.js';

@ProxyCmp({
  defineCustomElementFn: defineIonNavLink,
  inputs: ['component', 'componentProps', 'mode', 'routerAnimation', 'routerDirection', 'theme']
})
@Component({
  selector: 'ion-nav-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['component', 'componentProps', 'mode', 'routerAnimation', 'routerDirection', 'theme'],
})
export class IonNavLink {
  protected el: HTMLIonNavLinkElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonNavLink extends Components.IonNavLink {}


