/* eslint-disable */
/* tslint:disable */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, } from "@angular/core";
import { IonIcon as IonIconCmp } from 'ionicons/components/ion-icon.js';

import { ProxyCmp } from "./angular-component-lib/utils";


export declare interface IonIcon extends IonIconCmp {}
@ProxyCmp({
  tagName: 'ion-icon',
  customElement: IonIconCmp,
  inputs: ['ariaHidden', 'ariaLabel', 'color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'sanitize', 'size', 'src']
})
@Component({
  selector: 'ion-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['ariaHidden', 'ariaLabel', 'color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'sanitize', 'size', 'src']
})
export class IonIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
