import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import { toastController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-toast.js';
let ToastController = class ToastController extends OverlayBaseController {
    constructor() {
        super(toastController);
        defineCustomElement();
    }
};
ToastController = __decorate([
    Injectable({
        providedIn: 'root',
    })
], ToastController);
export { ToastController };
