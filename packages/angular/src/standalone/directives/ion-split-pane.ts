/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/dist/types/components';

import { defineCustomElement as defineIonSplitPane } from '@ionic/core/components/ion-split-pane.js';

@ProxyCmp({
  defineCustomElementFn: defineIonSplitPane,
  inputs: ['contentId', 'disabled', 'when']
})
@Component({
  selector: 'ion-split-pane',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['contentId', 'disabled', 'when'],
  outputs: ['ionSplitPaneVisible'],
})
export class IonSplitPane {
  protected el: HTMLIonSplitPaneElement;
  @Output() ionSplitPaneVisible = new EventEmitter<IonSplitPaneCustomEvent<{ visible: boolean }>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonSplitPaneCustomEvent } from '@ionic/core/components';

export declare interface IonSplitPane extends Components.IonSplitPane {
  /**
   * Expression to be called when the split-pane visibility has changed
   */
  ionSplitPaneVisible: EventEmitter<IonSplitPaneCustomEvent<{ visible: boolean }>>;
}


