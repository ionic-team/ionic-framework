import { isPresent } from '../../util/util';
import { PopoverCmp } from './popover-component';
import { PopoverMdPopIn, PopoverMdPopOut, PopoverPopIn, PopoverPopOut } from './popover-transitions';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export class PopoverImpl extends ViewController {
    /**
     * @param {?} app
     * @param {?} component
     * @param {?=} data
     * @param {?=} opts
     * @param {?=} config
     */
    constructor(app, component, data = {}, opts = {}, config) {
        opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
        data.component = component;
        data.opts = opts;
        super(PopoverCmp, data, null);
        this._app = app;
        this.isOverlay = true;
        config.setTransition('popover-pop-in', PopoverPopIn);
        config.setTransition('popover-pop-out', PopoverPopOut);
        config.setTransition('popover-md-pop-in', PopoverMdPopIn);
        config.setTransition('popover-md-pop-out', PopoverMdPopOut);
    }
    /**
     * @hidden
     * @param {?} direction
     * @return {?}
     */
    getTransitionName(direction) {
        let /** @type {?} */ key = (direction === 'back' ? 'popoverLeave' : 'popoverEnter');
        return this._nav && this._nav.config.get(key);
    }
    /**
     * Present the popover instance.
     *
     * @param {?=} navOptions
     * @return {?}
     */
    present(navOptions = {}) {
        return this._app.present(this, navOptions);
    }
}
function PopoverImpl_tsickle_Closure_declarations() {
    /** @type {?} */
    PopoverImpl.prototype._app;
}
//# sourceMappingURL=popover-impl.js.map