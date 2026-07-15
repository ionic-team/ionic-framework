import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import { alertController } from '@ionic/core';
let AlertController = class AlertController extends OverlayBaseController {
    constructor() {
        super(alertController);
    }
};
AlertController = __decorate([
    Injectable({
        providedIn: 'root',
    })
], AlertController);
export { AlertController };
