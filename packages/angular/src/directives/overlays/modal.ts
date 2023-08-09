/* eslint-disable */
/* tslint:disable */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  NgZone,
  TemplateRef,
} from '@angular/core';
import { ProxyCmp, proxyOutputs } from '../angular-component-lib/utils';
import { Components, ModalBreakpointChangeEventDetail } from '@ionic/core';

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
   * Emitted after the modal has presented. Shorthand for ionModalWillDismiss.
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
@ProxyCmp({
  inputs: [
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
  ],
  methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss', 'setCurrentBreakpoint', 'getCurrentBreakpoint'],
})
@Component({
  selector: 'ion-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="ion-delegate-host ion-page" *ngIf="isCmpOpen || keepContentsMounted">
    <ng-container [ngTemplateOutlet]="template"></ng-container>
  </div>`,
  inputs: [
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
  ],
})
export class IonModal {
  // TODO(FW-2827): type
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;

  isCmpOpen: boolean = false;

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
