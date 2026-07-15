import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { createGesture } from '@ionic/core';
let GestureController = class GestureController {
    constructor(zone) {
        this.zone = zone;
    }
    /**
     * Create a new gesture
     */
    create(opts, runInsideAngularZone = false) {
        if (runInsideAngularZone) {
            Object.getOwnPropertyNames(opts).forEach((key) => {
                if (typeof opts[key] === 'function') {
                    const fn = opts[key];
                    opts[key] = (...props) => this.zone.run(() => fn(...props));
                }
            });
        }
        return createGesture(opts);
    }
};
GestureController = __decorate([
    Injectable({
        providedIn: 'root',
    })
], GestureController);
export { GestureController };
