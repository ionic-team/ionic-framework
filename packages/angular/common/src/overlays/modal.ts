import {
  ChangeDetectorRef,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  NgZone,
  TemplateRef,
} from '@angular/core';
import type { Components, ModalBreakpointChangeEventDetail } from '@ionic/core/components';

import { ProxyCmp, proxyOutputs } from '../utils/proxy';

export declare interface IonModal extends Components.IonModal {
  /**
   * Emitted after the modal has presented.
   **/
  ionModalDidPresent: EventEmitter<CustomEvent>;
  /**
   * Emitted before the modal has presented.
   */
  ionModalWillPresent: EventEmitter<CustomEvent>;
  /**
   * Emitted before the modal has dismissed.
   */
  ionModalWillDismiss: EventEmitter<CustomEvent>;
  /**
   * Emitted after the modal has dismissed.
   */
  ionModalDidDismiss: EventEmitter<CustomEvent>;
  /**
   * Emitted after the modal breakpoint has changed.
   */
  ionBreakpointDidChange: EventEmitter<CustomEvent<ModalBreakpointChangeEventDetail>>;
  /**
   * Emitted after the modal has presented. Shorthand for ionModalDidPresent.
   */
  didPresent: EventEmitter<CustomEvent>;
  /**
   * Emitted before the modal has presented. Shorthand for ionModalWillPresent.
   */
  willPresent: EventEmitter<CustomEvent>;
  /**
   * Emitted before the modal has dismissed. Shorthand for ionModalWillDismiss.
   */
  willDismiss: EventEmitter<CustomEvent>;
  /**
   * Emitted after the modal has dismissed. Shorthand for ionModalDidDismiss.
   */
  didDismiss: EventEmitter<CustomEvent>;
}

const MODAL_INPUTS = [
  'animated',
  'keepContentsMounted',
  'backdropBreakpoint',
  'backdropDismiss',
  'breakpoints',
  'canDismiss',
  'cssClass',
  'enterAnimation',
  'event',
  'handle',
  'handleBehavior',
  'initialBreakpoint',
  'isOpen',
  'keyboardClose',
  'leaveAnimation',
  'mode',
  'presentingElement',
  'showBackdrop',
  'translucent',
  'trigger',
];

const MODAL_METHODS = [
  'present',
  'dismiss',
  'onDidDismiss',
  'onWillDismiss',
  'setCurrentBreakpoint',
  'getCurrentBreakpoint',
];

@ProxyCmp({
  inputs: MODAL_INPUTS,
  methods: MODAL_METHODS,
})
/**
 * @Component extends from @Directive
 * so by defining the inputs here we
 * do not need to re-define them for the
 * lazy loaded popover.
 */
@Directive({
  selector: 'ion-modal',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: MODAL_INPUTS,
})

// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonModal {
  // TODO(FW-2827): type
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;

  isCmpOpen = false;

  protected el: HTMLElement;

  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    this.el = r.nativeElement;

    this.el.addEventListener('ionMount', () => {
      this.isCmpOpen = true;
      c.detectChanges();
    });
    this.el.addEventListener('didDismiss', () => {
      this.isCmpOpen = false;
      c.detectChanges();
    });
    proxyOutputs(this, this.el, [
      'ionModalDidPresent',
      'ionModalWillPresent',
      'ionModalWillDismiss',
      'ionModalDidDismiss',
      'ionBreakpointDidChange',
      'didPresent',
      'willPresent',
      'willDismiss',
      'didDismiss',
    ]);
  }
}
