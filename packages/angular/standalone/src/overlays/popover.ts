import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonPopover as IonPopoverBase, ProxyCmp } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-popover.js';

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
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
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
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
  standalone: true,
  imports: [CommonModule]
})
export class IonPopover extends IonPopoverBase { }
