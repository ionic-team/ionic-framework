import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonModal as IonModalBase } from '@ionic/angular/common';
let IonModal = class IonModal extends IonModalBase {
};
IonModal = __decorate([
    Component({
        standalone: false,
        selector: 'ion-modal',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `<div class="ion-delegate-host ion-page" *ngIf="isCmpOpen || keepContentsMounted">
    <ng-container [ngTemplateOutlet]="template"></ng-container>
  </div>`,
    })
], IonModal);
export { IonModal };
