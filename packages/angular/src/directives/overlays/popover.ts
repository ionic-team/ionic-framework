import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonPopover as IonPopoverBase } from '@ionic/angular/common';

@Component({
  selector: 'ion-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container [ngTemplateOutlet]="template" *ngIf="isCmpOpen || keepContentsMounted"></ng-container>`,
})
export class IonPopover extends IonPopoverBase {}
