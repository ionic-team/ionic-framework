import { OverlayProxy } from '../../navigation/overlay-proxy';
import { PopoverImpl } from './popover-impl';
/**
 * @hidden
 */
export class Popover extends OverlayProxy {
    /**
     * @param {?} app
     * @param {?} component
     * @param {?} data
     * @param {?=} opts
     * @param {?=} config
     * @param {?=} deepLinker
     */
    constructor(app, component, data, opts = {}, config, deepLinker) {
        super(app, component, config, deepLinker);
        this.data = data;
        this.opts = opts;
        this.isOverlay = true;
    }
    /**
     * @return {?}
     */
    getImplementation() {
        return new PopoverImpl(this._app, this._component, this.data, this.opts, this._config);
    }
}
function Popover_tsickle_Closure_declarations() {
    /** @type {?} */
    Popover.prototype.isOverlay;
    /** @type {?} */
    Popover.prototype.data;
    /** @type {?} */
    Popover.prototype.opts;
}
//# sourceMappingURL=popover.js.map