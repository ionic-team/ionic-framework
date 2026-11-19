/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/dist/types/components';

import { defineCustomElement as defineIonSegmentContent } from '@ionic/core/components/ion-segment-content.js';

@ProxyCmp({
  defineCustomElementFn: defineIonSegmentContent
})
@Component({
  selector: 'ion-segment-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class IonSegmentContent {
  protected el: HTMLIonSegmentContentElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonSegmentContent extends Components.IonSegmentContent {}


