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
import { Components } from '@ionic/core';

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
    'backdropBreakpoint',
    'backdropDismiss',
    'breakpoints',
    'cssClass',
    'enterAnimation',
    'event',
    'handle',
    'initialBreakpoint',
    'isOpen',
    'keyboardClose',
    'leaveAnimation',
    'mode',
    'presentingElement',
    'showBackdrop',
    'swipeToClose',
    'translucent',
    'trigger',
  ],
  methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss'],
})
@Component({
  selector: 'ion-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container [ngTemplateOutlet]="template" *ngIf="isCmpOpen"></ng-container>`,
  inputs: [
    'animated',
    'backdropBreakpoint',
    'backdropDismiss',
    'breakpoints',
    'cssClass',
    'enterAnimation',
    'event',
    'handle',
    'initialBreakpoint',
    'isOpen',
    'keyboardClose',
    'leaveAnimation',
    'mode',
    'presentingElement',
    'showBackdrop',
    'swipeToClose',
    'translucent',
    'trigger',
  ],
})
export class IonModal {
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;

  isCmpOpen: boolean = false;

  protected el: HTMLElement;

  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    this.el = r.nativeElement;

    this.el.addEventListener('willPresent', () => {
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
      'didPresent',
      'willPresent',
      'willDismiss',
      'didDismiss',
    ]);
  }
}
