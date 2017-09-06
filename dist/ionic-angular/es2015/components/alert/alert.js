import { AlertCmp } from './alert-component';
import { AlertMdPopIn, AlertMdPopOut, AlertPopIn, AlertPopOut, AlertWpPopIn, AlertWpPopOut } from './alert-transitions';
import { isPresent } from '../../util/util';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export class Alert extends ViewController {
    /**
     * @param {?} app
     * @param {?=} opts
     * @param {?=} config
     */
    constructor(app, opts = {}, config) {
        opts.inputs = opts.inputs || [];
        opts.buttons = opts.buttons || [];
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
        super(AlertCmp, opts, null);
        this._app = app;
        this.isOverlay = true;
        config.setTransition('alert-pop-in', AlertPopIn);
        config.setTransition('alert-pop-out', AlertPopOut);
        config.setTransition('alert-md-pop-in', AlertMdPopIn);
        config.setTransition('alert-md-pop-out', AlertMdPopOut);
        config.setTransition('alert-wp-pop-in', AlertWpPopIn);
        config.setTransition('alert-wp-pop-out', AlertWpPopOut);
    }
    /**
     * @hidden
     * @param {?} direction
     * @return {?}
     */
    getTransitionName(direction) {
        let /** @type {?} */ key = (direction === 'back' ? 'alertLeave' : 'alertEnter');
        return this._nav && this._nav.config.get(key);
    }
    /**
     * @param {?} title
     * @return {?}
     */
    setTitle(title) {
        this.data.title = title;
        return this;
    }
    /**
     * @param {?} subTitle
     * @return {?}
     */
    setSubTitle(subTitle) {
        this.data.subTitle = subTitle;
        return this;
    }
    /**
     * @param {?} message
     * @return {?}
     */
    setMessage(message) {
        this.data.message = message;
        return this;
    }
    /**
     * @param {?} input
     * @return {?}
     */
    addInput(input) {
        this.data.inputs.push(input);
        return this;
    }
    /**
     * @param {?} button
     * @return {?}
     */
    addButton(button) {
        this.data.buttons.push(button);
        return this;
    }
    /**
     * @param {?} cssClass
     * @return {?}
     */
    setCssClass(cssClass) {
        this.data.cssClass = cssClass;
        return this;
    }
    /**
     * @param {?} mode
     * @return {?}
     */
    setMode(mode) {
        this.data.mode = mode;
    }
    /**
     * Present the alert instance.
     *
     * @param {?=} navOptions
     * @return {?}
     */
    present(navOptions = {}) {
        navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
        return this._app.present(this, navOptions);
    }
}
function Alert_tsickle_Closure_declarations() {
    /** @type {?} */
    Alert.prototype._app;
}
//# sourceMappingURL=alert.js.map