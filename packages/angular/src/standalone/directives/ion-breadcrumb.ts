/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonBreadcrumb } from '@ionic/core/components/ion-breadcrumb.js';

@ProxyCmp({
  defineCustomElementFn: defineIonBreadcrumb,
  inputs: ['active', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'separator', 'target']
})
@Component({
  selector: 'ion-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['active', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'separator', 'target'],
  outputs: ['ionFocus', 'ionBlur'],
})
export class IonBreadcrumb {
  protected el: HTMLIonBreadcrumbElement;
  @Output() ionFocus = new EventEmitter<IonBreadcrumbCustomEvent<void>>();
  @Output() ionBlur = new EventEmitter<IonBreadcrumbCustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonBreadcrumbCustomEvent } from '@ionic/core/components';

export declare interface IonBreadcrumb extends Components.IonBreadcrumb {
  /**
   * Emitted when the breadcrumb has focus.
   */
  ionFocus: EventEmitter<IonBreadcrumbCustomEvent<void>>;
  /**
   * Emitted when the breadcrumb loses focus.
   */
  ionBlur: EventEmitter<IonBreadcrumbCustomEvent<void>>;
}


