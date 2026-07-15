import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonModal as IonModalBase, ProxyCmp } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-modal.js';
let IonModal = class IonModal extends IonModalBase {
};
IonModal = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineCustomElement,
    }),
    Component({
        selector: 'ion-modal',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `<div class="ion-delegate-host ion-page" *ngIf="isCmpOpen || keepContentsMounted">
    <ng-container [ngTemplateOutlet]="template"></ng-container>
  </div>`,
        standalone: true,
        imports: [CommonModule],
    })
], IonModal);
export { IonModal };
