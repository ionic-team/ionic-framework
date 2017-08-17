import { PointerEvents } from './pointer-events';
/**
 * @hidden
 */
export class UIEventManager {
    /**
     * @param {?} plt
     */
    constructor(plt) {
        this.plt = plt;
        this.evts = [];
    }
    /**
     * @param {?} config
     * @return {?}
     */
    pointerEvents(config) {
        if (!config.element || !config.pointerDown) {
            console.error('PointerEvents config is invalid');
            return;
        }
        const /** @type {?} */ eventListnerOpts = {
            capture: config.capture,
            passive: config.passive,
            zone: config.zone
        };
        const /** @type {?} */ pointerEvents = new PointerEvents(this.plt, config.element, config.pointerDown, config.pointerMove, config.pointerUp, eventListnerOpts);
        const /** @type {?} */ removeFunc = () => pointerEvents.destroy();
        this.evts.push(removeFunc);
        return pointerEvents;
    }
    /**
     * @param {?} ele
     * @param {?} eventName
     * @param {?} callback
     * @param {?} opts
     * @return {?}
     */
    listen(ele, eventName, callback, opts) {
        if (ele) {
            var /** @type {?} */ removeFunc = this.plt.registerListener(ele, eventName, callback, opts);
            this.evts.push(removeFunc);
            return removeFunc;
        }
    }
    /**
     * @return {?}
     */
    unlistenAll() {
        this.evts.forEach(unRegEvent => {
            unRegEvent();
        });
        this.evts.length = 0;
    }
    /**
     * @return {?}
     */
    destroy() {
        this.unlistenAll();
        this.evts = null;
    }
}
function UIEventManager_tsickle_Closure_declarations() {
    /** @type {?} */
    UIEventManager.prototype.evts;
    /** @type {?} */
    UIEventManager.prototype.plt;
}
//# sourceMappingURL=ui-event-manager.js.map