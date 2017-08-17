var TimeoutDebouncer = (function () {
    /**
     * @param {?} wait
     */
    function TimeoutDebouncer(wait) {
        this.wait = wait;
        this.timer = null;
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    TimeoutDebouncer.prototype.debounce = function (callback) {
        this.callback = callback;
        this.schedule();
    };
    /**
     * @return {?}
     */
    TimeoutDebouncer.prototype.schedule = function () {
        this.cancel();
        if (this.wait <= 0) {
            this.callback();
        }
        else {
            this.timer = setTimeout(this.callback, this.wait);
        }
    };
    /**
     * @return {?}
     */
    TimeoutDebouncer.prototype.cancel = function () {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    };
    return TimeoutDebouncer;
}());
export { TimeoutDebouncer };
function TimeoutDebouncer_tsickle_Closure_declarations() {
    /** @type {?} */
    TimeoutDebouncer.prototype.timer;
    /** @type {?} */
    TimeoutDebouncer.prototype.callback;
    /** @type {?} */
    TimeoutDebouncer.prototype.wait;
}
//# sourceMappingURL=debouncer.js.map