export class TimeoutDebouncer {
    /**
     * @param {?} wait
     */
    constructor(wait) {
        this.wait = wait;
        this.timer = null;
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    debounce(callback) {
        this.callback = callback;
        this.schedule();
    }
    /**
     * @return {?}
     */
    schedule() {
        this.cancel();
        if (this.wait <= 0) {
            this.callback();
        }
        else {
            this.timer = setTimeout(this.callback, this.wait);
        }
    }
    /**
     * @return {?}
     */
    cancel() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
function TimeoutDebouncer_tsickle_Closure_declarations() {
    /** @type {?} */
    TimeoutDebouncer.prototype.timer;
    /** @type {?} */
    TimeoutDebouncer.prototype.callback;
    /** @type {?} */
    TimeoutDebouncer.prototype.wait;
}
//# sourceMappingURL=debouncer.js.map