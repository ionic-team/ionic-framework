/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonBadge } from '@ionic/core/components/ion-badge.js';

@ProxyCmp({
  defineCustomElementFn: defineIonBadge,
  inputs: ['color', 'hue', 'mode', 'shape', 'size', 'theme', 'vertical']
})
@Component({
  selector: 'ion-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'hue', 'mode', 'shape', 'size', 'theme', 'vertical'],
})
export class IonBadge {
  protected el: HTMLIonBadgeElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonBadge extends Components.IonBadge {}


