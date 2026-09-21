/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonHeader } from '@ionic/core/components/ion-header.js';

@ProxyCmp({
  defineCustomElementFn: defineIonHeader,
  inputs: ['collapse', 'divider', 'mode', 'scrollEffect', 'theme', 'translucent']
})
@Component({
  selector: 'ion-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['collapse', 'divider', 'mode', 'scrollEffect', 'theme', 'translucent'],
})
export class IonHeader {
  protected el: HTMLIonHeaderElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonHeader extends Components.IonHeader {}


