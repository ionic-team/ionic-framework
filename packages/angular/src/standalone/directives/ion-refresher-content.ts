/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonRefresherContent } from '@ionic/core/components/ion-refresher-content.js';

@ProxyCmp({
  defineCustomElementFn: defineIonRefresherContent,
  inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText']
})
@Component({
  selector: 'ion-refresher-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText'],
})
export class IonRefresherContent {
  protected el: HTMLIonRefresherContentElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonRefresherContent extends Components.IonRefresherContent {}


