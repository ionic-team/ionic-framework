import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import { loadingController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-loading.js';
let LoadingController = class LoadingController extends OverlayBaseController {
    constructor() {
        super(loadingController);
        defineCustomElement();
    }
};
LoadingController = __decorate([
    Injectable({
        providedIn: 'root',
    })
], LoadingController);
export { LoadingController };
