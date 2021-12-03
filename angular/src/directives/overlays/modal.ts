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
  Output,
  TemplateRef,
} from '@angular/core';
import { ProxyCmp } from '../angular-component-lib/utils';
import { Components } from '@ionic/core';

export declare interface IonModal extends Components.IonModal {}
@ProxyCmp({
  tagName: 'ion-modal',
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
  /**
   * Emitted after the modal has presented.
   **/
  @Output() ionModalDidPresent = new EventEmitter<CustomEvent>();
  /**
   * Emitted before the modal has presented.
   */
  @Output() ionModalWillPresent = new EventEmitter<CustomEvent>();
  /**
   * Emitted before the modal has dismissed.
   */
  @Output() ionModalWillDismiss = new EventEmitter<CustomEvent>();
  /**
   * Emitted after the modal has dismissed.
   */
  @Output() ionModalDidDismiss = new EventEmitter<CustomEvent>();
  /**
   * Emitted after the modal has presented. Shorthand for ionModalWillDismiss.
   */
  @Output() didPresent = new EventEmitter<CustomEvent>();
  /**
   * Emitted before the modal has presented. Shorthand for ionModalWillPresent.
   */
  @Output() willPresent = new EventEmitter<CustomEvent>();
  /**
   * Emitted before the modal has dismissed. Shorthand for ionModalWillDismiss.
   */
  @Output() willDismiss = new EventEmitter<CustomEvent>();
  /**
   * Emitted after the modal has dismissed. Shorthand for ionModalDidDismiss.
   */
  @Output() didDismiss = new EventEmitter<CustomEvent>();

  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;

  isCmpOpen: boolean = false;

  protected el: HTMLElement;

  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;

    this.el.addEventListener('willPresent', () => {
      this.isCmpOpen = true;
      c.detectChanges();
    });
    this.el.addEventListener('didDismiss', () => {
      this.isCmpOpen = false;
      c.detectChanges();
    });
  }
}
