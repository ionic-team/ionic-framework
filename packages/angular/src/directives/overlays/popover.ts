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
export declare interface IonPopover extends Components.IonPopover {
  /**
   * Emitted after the popover has presented.
   */
  ionPopoverDidPresent: EventEmitter<CustomEvent>;
  /**
   * Emitted before the popover has presented.
   */
  ionPopoverWillPresent: EventEmitter<CustomEvent>;
  /**
   * Emitted after the popover has dismissed.
   */
  ionPopoverWillDismiss: EventEmitter<CustomEvent>;
  /**
   * Emitted after the popover has dismissed.
   */
  ionPopoverDidDismiss: EventEmitter<CustomEvent>;
  /**
   * Emitted after the popover has presented. Shorthand for ionPopoverWillDismiss.
   */
  didPresent: EventEmitter<CustomEvent>;
  /**
   * Emitted before the popover has presented. Shorthand for ionPopoverWillPresent.
   */
  willPresent: EventEmitter<CustomEvent>;
  /**
   * Emitted after the popover has presented. Shorthand for ionPopoverWillDismiss.
   */
  willDismiss: EventEmitter<CustomEvent>;
  /**
   * Emitted after the popover has dismissed. Shorthand for ionPopoverDidDismiss.
   */
  didDismiss: EventEmitter<CustomEvent>;
}
@ProxyCmp({
  inputs: [
    'alignment',
    'animated',
    'arrow',
    'keepContentsMounted',
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
    'side',
  ],
  methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss'],
})
@Component({
  selector: 'ion-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container [ngTemplateOutlet]="template" *ngIf="isCmpOpen || keepContentsMounted"></ng-container>`,
  inputs: [
    'alignment',
    'animated',
    'arrow',
    'keepContentsMounted',
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
    'side',
  ],
})
export class IonPopover {
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
      'ionPopoverDidPresent',
      'ionPopoverWillPresent',
      'ionPopoverWillDismiss',
      'ionPopoverDidDismiss',
      'didPresent',
      'willPresent',
      'willDismiss',
      'didDismiss',
    ]);
  }
}
