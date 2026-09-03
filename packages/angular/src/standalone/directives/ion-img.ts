/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonImg } from '@ionic/core/components/ion-img.js';

@ProxyCmp({
  defineCustomElementFn: defineIonImg,
  inputs: ['alt', 'mode', 'src', 'theme']
})
@Component({
  selector: 'ion-img',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['alt', 'mode', 'src', 'theme'],
  outputs: ['ionImgWillLoad', 'ionImgDidLoad', 'ionError'],
})
export class IonImg {
  protected el: HTMLIonImgElement;
  @Output() ionImgWillLoad = new EventEmitter<IonImgCustomEvent<void>>();
  @Output() ionImgDidLoad = new EventEmitter<IonImgCustomEvent<void>>();
  @Output() ionError = new EventEmitter<IonImgCustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonImgCustomEvent } from '@ionic/core/components';

export declare interface IonImg extends Components.IonImg {
  /**
   * Emitted when the img src has been set
   */
  ionImgWillLoad: EventEmitter<IonImgCustomEvent<void>>;
  /**
   * Emitted when the image has finished loading
   */
  ionImgDidLoad: EventEmitter<IonImgCustomEvent<void>>;
  /**
   * Emitted when the img fails to load
   */
  ionError: EventEmitter<IonImgCustomEvent<void>>;
}


