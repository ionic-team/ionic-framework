import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonPopover as IonPopoverBase } from '@ionic/angular/common';
let IonPopover = class IonPopover extends IonPopoverBase {
};
IonPopover = __decorate([
    Component({
        standalone: false,
        selector: 'ion-popover',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `<ng-container [ngTemplateOutlet]="template" *ngIf="isCmpOpen || keepContentsMounted"></ng-container>`,
    })
], IonPopover);
export { IonPopover };
