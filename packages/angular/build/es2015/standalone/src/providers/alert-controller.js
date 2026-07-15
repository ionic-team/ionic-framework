import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import { alertController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-alert.js';
let AlertController = class AlertController extends OverlayBaseController {
    constructor() {
        super(alertController);
        defineCustomElement();
    }
};
AlertController = __decorate([
    Injectable({
        providedIn: 'root',
    })
], AlertController);
export { AlertController };
