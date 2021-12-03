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
export declare interface IonPopover extends Components.IonPopover {}
@ProxyCmp({
  tagName: 'ion-popover',
  inputs: [
    'alignment',
    'animated',
    'arrow',
    'backdropDismiss',
    'cssClass',
    'dismissOnSelect',
    'enterAnimation',
    'event',
    'isOpen',
    'keyboardClose',
    'leaveAnimation',
    'mode',
    'showBackdrop',
    'translucent',
    'trigger',
    'triggerAction',
    'reference',
    'size',
  ],
  methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss'],
})
@Component({
  selector: 'ion-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container [ngTemplateOutlet]="template" *ngIf="isCmpOpen"></ng-container>`,
  inputs: [
    'alignment',
    'animated',
    'arrow',
    'backdropDismiss',
    'cssClass',
    'dismissOnSelect',
    'enterAnimation',
    'event',
    'isOpen',
    'keyboardClose',
    'leaveAnimation',
    'mode',
    'showBackdrop',
    'translucent',
    'trigger',
    'triggerAction',
    'reference',
    'size',
  ],
})
export class IonPopover {
  /**
   * Emitted after the popover has presented.
   */
  @Output() ionPopoverDidPresent = new EventEmitter<CustomEvent>();
  /**
   * Emitted before the popover has presented.
   */
  @Output() ionPopoverWillPresent = new EventEmitter<CustomEvent>();
  /**
   * Emitted after the popover has dismissed.
   */
  @Output() ionPopoverWillDismiss = new EventEmitter<CustomEvent>();
  /**
   * Emitted after the popover has dismissed.
   */
  @Output() onPopoverDidDismiss = new EventEmitter<CustomEvent>();
  /**
   * Emitted after the popover has presented. Shorthand for ionPopoverWillDismiss.
   */
  @Output() didPresent = new EventEmitter<CustomEvent>();
  /**
   * Emitted before the popover has presented. Shorthand for ionPopoverWillPresent.
   */
  @Output() willPresent = new EventEmitter<CustomEvent>();
  /**
   * Emitted after the popover has presented. Shorthand for ionPopoverWillDismiss.
   */
  @Output() willDismiss = new EventEmitter<CustomEvent>();
  /**
   * Emitted after the popover has dismissed. Shorthand for ionPopoverDidDismiss.
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
