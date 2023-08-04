import {
  ChangeDetectorRef,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  NgZone,
  TemplateRef,
} from '@angular/core';
import { Components } from '@ionic/core';

import { ProxyCmp, proxyOutputs } from '../utils/proxy';

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
   * Emitted after the popover has presented. Shorthand for ionPopoverDidPresent.
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

const POPOVER_INPUTS = [
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

const POPOVER_METHODS = ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss'];

@ProxyCmp({
  inputs: POPOVER_INPUTS,
  methods: POPOVER_METHODS,
})
/**
 * @Component extends from @Directive
 * so by defining the inputs here we
 * do not need to re-define them for the
 * lazy loaded popover.
 */
@Directive({
  selector: 'ion-popover',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: POPOVER_INPUTS,
})

// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonPopover {
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
