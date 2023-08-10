
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from "@angular/core";
import { defineCustomElement as defineIonIcon } from 'ionicons/components/ion-icon.js';

import { ProxyCmp } from "./angular-component-lib/utils";

@ProxyCmp({
  defineCustomElementFn: defineIonIcon,
  inputs: ['color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'sanitize', 'size', 'src']
})
@Component({
  selector: 'ion-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'sanitize', 'size', 'src'],
  standalone: true
})
export class IonIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
