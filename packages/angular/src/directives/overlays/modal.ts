import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonModal as IonModalBase } from '@ionic/angular/common';

@Component({
  selector: 'ion-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="ion-delegate-host ion-page" *ngIf="isCmpOpen || keepContentsMounted">
    <ng-container [ngTemplateOutlet]="template"></ng-container>
  </div>`,
})
export class IonModal extends IonModalBase {}
