import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import { actionSheetController } from '@ionic/core';
let ActionSheetController = class ActionSheetController extends OverlayBaseController {
    constructor() {
        super(actionSheetController);
    }
};
ActionSheetController = __decorate([
    Injectable({
        providedIn: 'root',
    })
], ActionSheetController);
export { ActionSheetController };
