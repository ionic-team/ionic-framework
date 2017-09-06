(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    /**
     * @hidden
     */
    var Ion = (function () {
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?=} componentName
         */
        function Ion(config, elementRef, renderer, componentName) {
            this._config = config;
            this._elementRef = elementRef;
            this._renderer = renderer;
            this._componentName = componentName;
            if (componentName) {
                this._setComponentName();
                this._setMode(config.get('mode'));
            }
        }
        Object.defineProperty(Ion.prototype, "color", {
            /**
             * @return {?}
             */
            get: function () {
                return this._color;
            },
            /**
             * \@input {string} The color to use from your Sass `$colors` map.
             * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
             * For more information, see [Theming your App](/docs/theming/theming-your-app).
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._setColor(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ion.prototype, "mode", {
            /**
             * @return {?}
             */
            get: function () {
                return this._mode;
            },
            /**
             * \@input {string} The mode determines which platform styles to use.
             * Possible values are: `"ios"`, `"md"`, or `"wp"`.
             * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._setMode(val);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @hidden
         * @param {?} className
         * @param {?} isAdd
         * @return {?}
         */
        Ion.prototype.setElementClass = function (className, isAdd) {
            this._renderer.setElementClass(this._elementRef.nativeElement, className, isAdd);
        };
        /**
         * @hidden
         * @param {?} attributeName
         * @param {?} attributeValue
         * @return {?}
         */
        Ion.prototype.setElementAttribute = function (attributeName, attributeValue) {
            this._renderer.setElementAttribute(this._elementRef.nativeElement, attributeName, attributeValue);
        };
        /**
         * @hidden
         * @param {?} property
         * @param {?} value
         * @return {?}
         */
        Ion.prototype.setElementStyle = function (property, value) {
            this._renderer.setElementStyle(this._elementRef.nativeElement, property, value);
        };
        /**
         * @hidden
         * @param {?} newColor
         * @param {?=} componentName
         * @return {?}
         */
        Ion.prototype._setColor = function (newColor, componentName) {
            if (componentName) {
                // This is needed for the item-radio
                this._componentName = componentName;
            }
            if (this._color) {
                this.setElementClass(this._componentName + "-" + this._mode + "-" + this._color, false);
            }
            if (newColor) {
                this.setElementClass(this._componentName + "-" + this._mode + "-" + newColor, true);
                this._color = newColor;
            }
        };
        /**
         * @hidden
         * @param {?} newMode
         * @return {?}
         */
        Ion.prototype._setMode = function (newMode) {
            if (this._mode) {
                this.setElementClass(this._componentName + "-" + this._mode, false);
            }
            if (newMode) {
                this.setElementClass(this._componentName + "-" + newMode, true);
                // Remove the color class associated with the previous mode,
                // change the mode, then add the new color class
                this._setColor(null);
                this._mode = newMode;
                this._setColor(this._color);
            }
        };
        /**
         * @hidden
         * @return {?}
         */
        Ion.prototype._setComponentName = function () {
            this.setElementClass(this._componentName, true);
        };
        /**
         * @hidden
         * @return {?}
         */
        Ion.prototype.getElementRef = function () {
            return this._elementRef;
        };
        /**
         * @hidden
         * @return {?}
         */
        Ion.prototype.getNativeElement = function () {
            return this._elementRef.nativeElement;
        };
        return Ion;
    }());
    Ion.propDecorators = {
        'color': [{ type: core_1.Input },],
        'mode': [{ type: core_1.Input },],
    };
    exports.Ion = Ion;
    function Ion_tsickle_Closure_declarations() {
        /** @type {?} */
        Ion.propDecorators;
        /**
         * @hidden
         * @type {?}
         */
        Ion.prototype._config;
        /**
         * @hidden
         * @type {?}
         */
        Ion.prototype._elementRef;
        /**
         * @hidden
         * @type {?}
         */
        Ion.prototype._renderer;
        /**
         * @hidden
         * @type {?}
         */
        Ion.prototype._color;
        /**
         * @hidden
         * @type {?}
         */
        Ion.prototype._mode;
        /**
         * @hidden
         * @type {?}
         */
        Ion.prototype._componentName;
    }
});
//# sourceMappingURL=ion.js.map