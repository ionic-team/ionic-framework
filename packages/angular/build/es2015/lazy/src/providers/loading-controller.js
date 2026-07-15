import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import { loadingController } from '@ionic/core';
let LoadingController = class LoadingController extends OverlayBaseController {
    constructor() {
        super(loadingController);
    }
};
LoadingController = __decorate([
    Injectable({
        providedIn: 'root',
    })
], LoadingController);
export { LoadingController };
