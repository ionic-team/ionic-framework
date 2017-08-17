/**
 * Adopted from FastDom
 * https://github.com/wilsonpage/fastdom
 * MIT License
 */
import { Injectable } from '@angular/core';
import { Platform } from './platform';
import { removeArrayItem } from '../util/util';
/**
 * @hidden
 */
export class DomDebouncer {
    /**
     * @param {?} dom
     */
    constructor(dom) {
        this.dom = dom;
        this.writeTask = null;
        this.readTask = null;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    read(fn) {
        if (this.readTask) {
            return;
        }
        return this.readTask = this.dom.read((t) => {
            this.readTask = null;
            fn(t);
        });
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    write(fn) {
        if (this.writeTask) {
            return;
        }
        return this.writeTask = this.dom.write((t) => {
            this.writeTask = null;
            fn(t);
        });
    }
    /**
     * @return {?}
     */
    cancel() {
        const /** @type {?} */ writeTask = this.writeTask;
        writeTask && this.dom.cancel(writeTask);
        const /** @type {?} */ readTask = this.readTask;
        readTask && this.dom.cancel(readTask);
        this.readTask = this.writeTask = null;
    }
}
function DomDebouncer_tsickle_Closure_declarations() {
    /** @type {?} */
    DomDebouncer.prototype.writeTask;
    /** @type {?} */
    DomDebouncer.prototype.readTask;
    /** @type {?} */
    DomDebouncer.prototype.dom;
}
/**
 * @hidden
 */
export class DomController {
    /**
     * @param {?} plt
     */
    constructor(plt) {
        this.plt = plt;
        this.r = [];
        this.w = [];
    }
    /**
     * @return {?}
     */
    debouncer() {
        return new DomDebouncer(this);
    }
    /**
     * @param {?} fn
     * @param {?=} timeout
     * @return {?}
     */
    read(fn, timeout) {
        if (timeout) {
            ((fn)).timeoutId = this.plt.timeout(() => {
                this.r.push(fn);
                this._queue();
            }, timeout);
        }
        else {
            this.r.push(fn);
            this._queue();
        }
        return fn;
    }
    /**
     * @param {?} fn
     * @param {?=} timeout
     * @return {?}
     */
    write(fn, timeout) {
        if (timeout) {
            ((fn)).timeoutId = this.plt.timeout(() => {
                this.w.push(fn);
                this._queue();
            }, timeout);
        }
        else {
            this.w.push(fn);
            this._queue();
        }
        return fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    cancel(fn) {
        if (fn) {
            if (fn.timeoutId) {
                this.plt.cancelTimeout(fn.timeoutId);
            }
            removeArrayItem(this.r, fn) || removeArrayItem(this.w, fn);
        }
    }
    /**
     * @return {?}
     */
    _queue() {
        const /** @type {?} */ self = this;
        if (!self.q) {
            self.q = true;
            self.plt.raf(function rafCallback(timeStamp) {
                self._flush(timeStamp);
            });
        }
    }
    /**
     * @param {?} timeStamp
     * @return {?}
     */
    _flush(timeStamp) {
        let /** @type {?} */ err;
        try {
            dispatch(timeStamp, this.r, this.w);
        }
        catch (e) {
            err = e;
        }
        this.q = false;
        if (this.r.length || this.w.length) {
            this._queue();
        }
        if (err) {
            throw err;
        }
    }
}
DomController.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DomController.ctorParameters = () => [
    { type: Platform, },
];
function DomController_tsickle_Closure_declarations() {
    /** @type {?} */
    DomController.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DomController.ctorParameters;
    /** @type {?} */
    DomController.prototype.r;
    /** @type {?} */
    DomController.prototype.w;
    /** @type {?} */
    DomController.prototype.q;
    /** @type {?} */
    DomController.prototype.plt;
}
/**
 * @param {?} timeStamp
 * @param {?} r
 * @param {?} w
 * @return {?}
 */
function dispatch(timeStamp, r, w) {
    let /** @type {?} */ fn;
    // ******** DOM READS ****************
    while (fn = r.shift()) {
        fn(timeStamp);
    }
    // ******** DOM WRITES ****************
    while (fn = w.shift()) {
        fn(timeStamp);
    }
}
//# sourceMappingURL=dom-controller.js.map