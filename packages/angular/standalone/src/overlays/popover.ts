import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonPopover as IonPopoverBase, ProxyCmp } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-popover.js';

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
})
@Component({
  selector: 'ion-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container [ngTemplateOutlet]="template" *ngIf="isCmpOpen || keepContentsMounted"></ng-container>`,
  standalone: true,
  imports: [CommonModule],
})
export class IonPopover extends IonPopoverBase {}
