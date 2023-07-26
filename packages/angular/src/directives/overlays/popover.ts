/* eslint-disable */
/* tslint:disable */
import { IonPopover as IonPopoverBase, POPOVER_INPUTS, ProxyCmp } from '@ionic/angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@ProxyCmp({
  inputs: POPOVER_INPUTS,
  methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss'],
})
@Component({
  selector: 'ion-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container [ngTemplateOutlet]="template" *ngIf="isCmpOpen || keepContentsMounted"></ng-container>`,
  inputs: POPOVER_INPUTS,
})
export class IonPopover extends IonPopoverBase {}
