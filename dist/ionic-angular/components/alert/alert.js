var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { AlertCmp } from './alert-component';
import { AlertMdPopIn, AlertMdPopOut, AlertPopIn, AlertPopOut, AlertWpPopIn, AlertWpPopOut } from './alert-transitions';
import { isPresent } from '../../util/util';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
var Alert = (function (_super) {
    __extends(Alert, _super);
    /**
     * @param {?} app
     * @param {?=} opts
     * @param {?=} config
     */
    function Alert(app, opts, config) {
        if (opts === void 0) { opts = {}; }
        var _this = this;
        opts.inputs = opts.inputs || [];
        opts.buttons = opts.buttons || [];
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
        _this = _super.call(this, AlertCmp, opts, null) || this;
        _this._app = app;
        _this.isOverlay = true;
        config.setTransition('alert-pop-in', AlertPopIn);
        config.setTransition('alert-pop-out', AlertPopOut);
        config.setTransition('alert-md-pop-in', AlertMdPopIn);
        config.setTransition('alert-md-pop-out', AlertMdPopOut);
        config.setTransition('alert-wp-pop-in', AlertWpPopIn);
        config.setTransition('alert-wp-pop-out', AlertWpPopOut);
        return _this;
    }
    /**
     * @hidden
     * @param {?} direction
     * @return {?}
     */
    Alert.prototype.getTransitionName = function (direction) {
        var /** @type {?} */ key = (direction === 'back' ? 'alertLeave' : 'alertEnter');
        return this._nav && this._nav.config.get(key);
    };
    /**
     * @param {?} title
     * @return {?}
     */
    Alert.prototype.setTitle = function (title) {
        this.data.title = title;
        return this;
    };
    /**
     * @param {?} subTitle
     * @return {?}
     */
    Alert.prototype.setSubTitle = function (subTitle) {
        this.data.subTitle = subTitle;
        return this;
    };
    /**
     * @param {?} message
     * @return {?}
     */
    Alert.prototype.setMessage = function (message) {
        this.data.message = message;
        return this;
    };
    /**
     * @param {?} input
     * @return {?}
     */
    Alert.prototype.addInput = function (input) {
        this.data.inputs.push(input);
        return this;
    };
    /**
     * @param {?} button
     * @return {?}
     */
    Alert.prototype.addButton = function (button) {
        this.data.buttons.push(button);
        return this;
    };
    /**
     * @param {?} cssClass
     * @return {?}
     */
    Alert.prototype.setCssClass = function (cssClass) {
        this.data.cssClass = cssClass;
        return this;
    };
    /**
     * @param {?} mode
     * @return {?}
     */
    Alert.prototype.setMode = function (mode) {
        this.data.mode = mode;
    };
    /**
     * Present the alert instance.
     *
     * @param {?=} navOptions
     * @return {?}
     */
    Alert.prototype.present = function (navOptions) {
        if (navOptions === void 0) { navOptions = {}; }
        navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
        return this._app.present(this, navOptions);
    };
    return Alert;
}(ViewController));
export { Alert };
function Alert_tsickle_Closure_declarations() {
    /** @type {?} */
    Alert.prototype._app;
}
//# sourceMappingURL=alert.js.map