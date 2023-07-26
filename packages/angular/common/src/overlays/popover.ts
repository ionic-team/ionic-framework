import {
  ChangeDetectorRef,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  TemplateRef,
} from '@angular/core';
import { Components } from '@ionic/core';

import { ProxyCmp, proxyOutputs } from '../utils';

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


export const POPOVER_INPUTS = [
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
];

export const POPOVER_METHODS = ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss'];

@ProxyCmp({
  inputs: POPOVER_INPUTS,
  methods: POPOVER_METHODS,
})
@Directive()
export class IonPopover {
  // TODO(FW-2827): type
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;

  @Input() alignment: any;
  @Input() animated: any;
  @Input() arrow: any;
  @Input() keepContentsMounted: any;
  @Input() backdropDismiss: any;
  @Input() cssClass: any;
  @Input() dismissOnSelect: any;
  @Input() enterAnimation: any;
  @Input() event: any;
  @Input() isOpen: any;
  @Input() keyboardClose: any;
  @Input() leaveAnimation: any;
  @Input() mode: any;
  @Input() showBackdrop: any;
  @Input() translucent: any;
  @Input() trigger: any;
  @Input() triggerAction: any;
  @Input() reference: any;
  @Input() size: any;
  @Input() side: any;

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

