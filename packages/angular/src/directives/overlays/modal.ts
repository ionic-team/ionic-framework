import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonModal as IonModalBase } from '@ionic/angular/common';

@Component({
  selector: 'ion-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container [ngTemplateOutlet]="template" *ngIf="isCmpOpen || keepContentsMounted"></ng-container>`,
})
export class IonModal extends IonModalBase {}
