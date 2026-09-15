/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonTitle } from '@ionic/core/components/ion-title.js';

@ProxyCmp({
  defineCustomElementFn: defineIonTitle,
  inputs: ['color', 'mode', 'size', 'theme']
})
@Component({
  selector: 'ion-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'mode', 'size', 'theme'],
})
export class IonTitle {
  protected el: HTMLIonTitleElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonTitle extends Components.IonTitle {}


