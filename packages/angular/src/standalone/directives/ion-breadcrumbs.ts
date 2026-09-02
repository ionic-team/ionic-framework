/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonBreadcrumbs } from '@ionic/core/components/ion-breadcrumbs.js';

@ProxyCmp({
  defineCustomElementFn: defineIonBreadcrumbs,
  inputs: ['color', 'itemsAfterCollapse', 'itemsBeforeCollapse', 'maxItems', 'mode']
})
@Component({
  selector: 'ion-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'itemsAfterCollapse', 'itemsBeforeCollapse', 'maxItems', 'mode'],
  outputs: ['ionCollapsedClick'],
})
export class IonBreadcrumbs {
  protected el: HTMLIonBreadcrumbsElement;
  @Output() ionCollapsedClick = new EventEmitter<IonBreadcrumbsCustomEvent<IIonBreadcrumbsBreadcrumbCollapsedClickEventDetail>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonBreadcrumbsCustomEvent } from '@ionic/core/components';
import type { BreadcrumbCollapsedClickEventDetail as IIonBreadcrumbsBreadcrumbCollapsedClickEventDetail } from '@ionic/core/components';

export declare interface IonBreadcrumbs extends Components.IonBreadcrumbs {
  /**
   * Emitted when the collapsed indicator is clicked on.
   */
  ionCollapsedClick: EventEmitter<IonBreadcrumbsCustomEvent<IIonBreadcrumbsBreadcrumbCollapsedClickEventDetail>>;
}


