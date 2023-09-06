import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  NgZone,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
import type { RadioGroupChangeEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-radio-group.js';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

const RADIO_GROUP_INPUTS = ['allowEmptySelection', 'name', 'value'];

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: RADIO_GROUP_INPUTS,
})
@Component({
  selector: 'ion-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: RADIO_GROUP_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IonRadioGroup,
      multi: true,
    },
  ],
  standalone: true,
})
export class IonRadioGroup extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange']);
  }

  @HostListener('ionChange', ['$event.target'])
  handleIonChange(el: HTMLIonRadioGroupElement): void {
    this.handleValueChange(el, el.value);
  }
}

export declare interface IonRadioGroup extends Components.IonRadioGroup {
  /**
   * Emitted when the value has changed.
   */
  ionChange: EventEmitter<CustomEvent<RadioGroupChangeEventDetail>>;
}
