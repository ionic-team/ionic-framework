import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import { actionSheetController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-action-sheet.js';
let ActionSheetController = class ActionSheetController extends OverlayBaseController {
    constructor() {
        super(actionSheetController);
        defineCustomElement();
    }
};
ActionSheetController = __decorate([
    Injectable({
        providedIn: 'root',
    })
], ActionSheetController);
export { ActionSheetController };
