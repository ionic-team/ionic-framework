import { PointerEvents } from './pointer-events';
/**
 * @hidden
 */
var UIEventManager = (function () {
    /**
     * @param {?} plt
     */
    function UIEventManager(plt) {
        this.plt = plt;
        this.evts = [];
    }
    /**
     * @param {?} config
     * @return {?}
     */
    UIEventManager.prototype.pointerEvents = function (config) {
        if (!config.element || !config.pointerDown) {
            console.error('PointerEvents config is invalid');
            return;
        }
        var /** @type {?} */ eventListnerOpts = {
            capture: config.capture,
            passive: config.passive,
            zone: config.zone
        };
        var /** @type {?} */ pointerEvents = new PointerEvents(this.plt, config.element, config.pointerDown, config.pointerMove, config.pointerUp, eventListnerOpts);
        var /** @type {?} */ removeFunc = function () { return pointerEvents.destroy(); };
        this.evts.push(removeFunc);
        return pointerEvents;
    };
    /**
     * @param {?} ele
     * @param {?} eventName
     * @param {?} callback
     * @param {?} opts
     * @return {?}
     */
    UIEventManager.prototype.listen = function (ele, eventName, callback, opts) {
        if (ele) {
            var /** @type {?} */ removeFunc = this.plt.registerListener(ele, eventName, callback, opts);
            this.evts.push(removeFunc);
            return removeFunc;
        }
    };
    /**
     * @return {?}
     */
    UIEventManager.prototype.unlistenAll = function () {
        this.evts.forEach(function (unRegEvent) {
            unRegEvent();
        });
        this.evts.length = 0;
    };
    /**
     * @return {?}
     */
    UIEventManager.prototype.destroy = function () {
        this.unlistenAll();
        this.evts = null;
    };
    return UIEventManager;
}());
export { UIEventManager };
function UIEventManager_tsickle_Closure_declarations() {
    /** @type {?} */
    UIEventManager.prototype.evts;
    /** @type {?} */
    UIEventManager.prototype.plt;
}
//# sourceMappingURL=ui-event-manager.js.map