import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let DomController = class DomController {
    /**
     * Schedules a task to run during the READ phase of the next frame.
     * This task should only read the DOM, but never modify it.
     */
    read(cb) {
        getQueue().read(cb);
    }
    /**
     * Schedules a task to run during the WRITE phase of the next frame.
     * This task should write the DOM, but never READ it.
     */
    write(cb) {
        getQueue().write(cb);
    }
};
DomController = __decorate([
    Injectable({
        providedIn: 'root',
    })
], DomController);
export { DomController };
const getQueue = () => {
    const win = typeof window !== 'undefined' ? window : null;
    if (win != null) {
        const Ionic = win.Ionic;
        if (Ionic === null || Ionic === void 0 ? void 0 : Ionic.queue) {
            return Ionic.queue;
        }
        return {
            read: (cb) => win.requestAnimationFrame(cb),
            write: (cb) => win.requestAnimationFrame(cb),
        };
    }
    return {
        read: (cb) => cb(),
        write: (cb) => cb(),
    };
};
