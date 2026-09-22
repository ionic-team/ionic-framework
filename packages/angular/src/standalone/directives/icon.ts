import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';
import { defineCustomElement as defineIonIcon } from 'ionicons/components/ion-icon.js';

import { nullableBooleanAttribute } from './angular-component-lib/boolean-attribute';
import { ProxyCmp } from './angular-component-lib/utils';

const ICON_INPUTS = [
  'color',
  { name: 'flipRtl', transform: nullableBooleanAttribute },
  'icon',
  'ios',
  { name: 'lazy', transform: nullableBooleanAttribute },
  'md',
  'mode',
  'name',
  { name: 'sanitize', transform: nullableBooleanAttribute },
  'size',
  'src',
];

/* ProxyCmp only needs the names, and runs at runtime rather than through the Angular compiler. */
const ICON_PROXY_INPUTS = ICON_INPUTS.map((input) => (typeof input === 'string' ? input : input.name));

@ProxyCmp({
  defineCustomElementFn: defineIonIcon,
  inputs: ICON_PROXY_INPUTS,
})
@Component({
  selector: 'ion-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ICON_INPUTS,
  standalone: true,
})
export class IonIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
