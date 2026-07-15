import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { MenuController as MenuControllerBase } from '@ionic/angular/common';
import { menuController } from '@ionic/core/components';
let MenuController = class MenuController extends MenuControllerBase {
    constructor() {
        super(menuController);
    }
};
MenuController = __decorate([
    Injectable({
        providedIn: 'root',
    })
], MenuController);
export { MenuController };
