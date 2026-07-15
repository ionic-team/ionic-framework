import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import { toastController } from '@ionic/core';
let ToastController = class ToastController extends OverlayBaseController {
    constructor() {
        super(toastController);
    }
};
ToastController = __decorate([
    Injectable({
        providedIn: 'root',
    })
], ToastController);
export { ToastController };
