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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../util/util", "../../config/config", "../ion"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var util_1 = require("../../util/util");
    var config_1 = require("../../config/config");
    var ion_1 = require("../ion");
    /**
     * \@name Icon
     * \@description
     * Icons can be used on their own, or inside of a number of Ionic components.
     * For a full list of available icons, check out the
     * [Ionicons docs](../../../../ionicons).
     *
     * One feature of Ionicons in Ionic is when icon names are set, the actual icon
     * which is rendered can change slightly depending on the mode the app is
     * running from. For example, by setting the icon name of `alarm`, on iOS the
     * icon will automatically apply `ios-alarm`, and on Material Design it will
     * automatically apply `md-alarm`. This allows the developer to write the
     * markup once while Ionic applies the appropriate icon based on the mode.
     *
     * \@usage
     * ```html
     * <!-- automatically uses the correct "star" icon depending on the mode -->
     * <ion-icon name="star"></ion-icon>
     *
     * <!-- explicity set the icon for each mode -->
     * <ion-icon ios="ios-home" md="md-home"></ion-icon>
     *
     * <!-- always use the same icon, no matter what the mode -->
     * <ion-icon name="ios-clock"></ion-icon>
     * <ion-icon name="logo-twitter"></ion-icon>
     * ```
     *
     * \@demo /docs/demos/src/icon/
     * @see {\@link /docs/components#icons Icon Component Docs}
     *
     */
    var Icon = (function (_super) {
        __extends(Icon, _super);
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         */
        function Icon(config, elementRef, renderer) {
            var _this = _super.call(this, config, elementRef, renderer, 'icon') || this;
            /**
             * @hidden
             */
            _this._isActive = true;
            /**
             * @hidden
             */
            _this._name = '';
            /**
             * @hidden
             */
            _this._ios = '';
            /**
             * @hidden
             */
            _this._md = '';
            /**
             * @hidden
             */
            _this._css = '';
            /**
             * @hidden
             */
            _this._hidden = false;
            _this._iconMode = config.get('iconMode');
            return _this;
        }
        /**
         * @hidden
         * @return {?}
         */
        Icon.prototype.ngOnDestroy = function () {
            if (this._css) {
                this.setElementClass(this._css, false);
            }
        };
        Object.defineProperty(Icon.prototype, "name", {
            /**
             * \@input {string} Specifies which icon to use. The appropriate icon will be used based on the mode.
             * For more information, see [Ionicons](/docs/ionicons/).
             * @return {?}
             */
            get: function () {
                return this._name;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                if (!(/^md-|^ios-|^logo-/.test(val))) {
                    // this does not have one of the defaults
                    // so lets auto add in the mode prefix for them
                    this._name = this._iconMode + '-' + val;
                }
                else {
                    this._name = val;
                }
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Icon.prototype, "ios", {
            /**
             * \@input {string} Specifies which icon to use on `ios` mode.
             * @return {?}
             */
            get: function () {
                return this._ios;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._ios = val;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Icon.prototype, "md", {
            /**
             * \@input {string} Specifies which icon to use on `md` mode.
             * @return {?}
             */
            get: function () {
                return this._md;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._md = val;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Icon.prototype, "isActive", {
            /**
             * \@input {boolean} If true, the icon is styled with an "active" appearance.
             * An active icon is filled in, and an inactive icon is the outline of the icon.
             * The `isActive` property is largely used by the tabbar. Only affects `ios` icons.
             * @return {?}
             */
            get: function () {
                return this._isActive;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._isActive = util_1.isTrueProperty(val);
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @hidden
         * @return {?}
         */
        Icon.prototype.update = function () {
            var /** @type {?} */ iconName;
            if (this._ios && this._iconMode === 'ios') {
                iconName = this._ios;
            }
            else if (this._md && this._iconMode === 'md') {
                iconName = this._md;
            }
            else {
                iconName = this._name;
            }
            var /** @type {?} */ hidden = this._hidden = (iconName === null);
            if (hidden) {
                return;
            }
            var /** @type {?} */ iconMode = iconName.split('-', 2)[0];
            if (iconMode === 'ios' &&
                !this._isActive &&
                iconName.indexOf('logo-') < 0 &&
                iconName.indexOf('-outline') < 0) {
                iconName += '-outline';
            }
            var /** @type {?} */ css = 'ion-' + iconName;
            if (this._css === css) {
                return;
            }
            if (this._css) {
                this.setElementClass(this._css, false);
            }
            this._css = css;
            this.setElementClass(css, true);
            var /** @type {?} */ label = iconName
                .replace('ios-', '')
                .replace('md-', '')
                .replace('-', ' ');
            this.setElementAttribute('aria-label', label);
        };
        return Icon;
    }(ion_1.Ion));
    Icon.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-icon',
                    host: {
                        'role': 'img'
                    }
                },] },
    ];
    /**
     * @nocollapse
     */
    Icon.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
    ]; };
    Icon.propDecorators = {
        'name': [{ type: core_1.Input },],
        'ios': [{ type: core_1.Input },],
        'md': [{ type: core_1.Input },],
        'isActive': [{ type: core_1.Input },],
        '_hidden': [{ type: core_1.HostBinding, args: ['class.hide',] },],
    };
    exports.Icon = Icon;
    function Icon_tsickle_Closure_declarations() {
        /** @type {?} */
        Icon.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Icon.ctorParameters;
        /** @type {?} */
        Icon.propDecorators;
        /**
         * @hidden
         * @type {?}
         */
        Icon.prototype._iconMode;
        /**
         * @hidden
         * @type {?}
         */
        Icon.prototype._isActive;
        /**
         * @hidden
         * @type {?}
         */
        Icon.prototype._name;
        /**
         * @hidden
         * @type {?}
         */
        Icon.prototype._ios;
        /**
         * @hidden
         * @type {?}
         */
        Icon.prototype._md;
        /**
         * @hidden
         * @type {?}
         */
        Icon.prototype._css;
        /**
         * @hidden
         * @type {?}
         */
        Icon.prototype._hidden;
    }
});
//# sourceMappingURL=icon.js.map