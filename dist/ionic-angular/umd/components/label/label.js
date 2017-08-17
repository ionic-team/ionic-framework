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
        define(["require", "exports", "@angular/core", "../../config/config", "../ion"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var ion_1 = require("../ion");
    /**
     * \@name Label
     * \@description
     * Labels are placed inside of an `ion-item` element and can be used
     * to describe an `ion-input`, `ion-toggle`, `ion-checkbox`, and more.
     *
     * \@property [fixed] - A persistent label that sits next the input.
     * \@property [floating] - A label that will float above the input if the input is empty or loses focus.
     * \@property [stacked] - A stacked label will always appear on top of the input.
     *
     * \@usage
     * ```html
     *  <ion-item>
     *    <ion-label>Username</ion-label>
     *    <ion-input></ion-input>
     *  </ion-item>
     *
     *  <ion-item>
     *    <ion-label fixed>Website</ion-label>
     *    <ion-input type="url"></ion-input>
     *  </ion-item>
     *
     *  <ion-item>
     *    <ion-label floating>Email</ion-label>
     *    <ion-input type="email"></ion-input>
     *  </ion-item>
     *
     *  <ion-item>
     *    <ion-label stacked>Phone</ion-label>
     *    <ion-input type="tel"></ion-input>
     *  </ion-item>
     *
     *  <ion-item>
     *    <ion-label>Toggle</ion-label>
     *    <ion-toggle></ion-toggle>
     *  </ion-item>
     *
     *  <ion-item>
     *    <ion-label>Checkbox</ion-label>
     *    <ion-checkbox></ion-checkbox>
     *  </ion-item>
     * ```
     *
     * \@demo /docs/demos/src/label/
     * @see {\@link ../../../../components#inputs Input Component Docs}
     * @see {\@link ../../input/Input Input API Docs}
     *
     */
    var Label = (function (_super) {
        __extends(Label, _super);
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?} isFloating
         * @param {?} isStacked
         * @param {?} isFixed
         * @param {?} isInset
         */
        function Label(config, elementRef, renderer, isFloating, isStacked, isFixed, isInset) {
            var _this = _super.call(this, config, elementRef, renderer, 'label') || this;
            _this.type = (isFloating === '' ? 'floating' : (isStacked === '' ? 'stacked' : (isFixed === '' ? 'fixed' : (isInset === '' ? 'inset' : null))));
            return _this;
        }
        Object.defineProperty(Label.prototype, "id", {
            /**
             * @hidden
             * @return {?}
             */
            get: function () {
                return this._id;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._id = val;
                if (val) {
                    this.setElementAttribute('id', val);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "text", {
            /**
             * @hidden
             * @return {?}
             */
            get: function () {
                return this.getNativeElement().textContent || '';
            },
            enumerable: true,
            configurable: true
        });
        return Label;
    }(ion_1.Ion));
    Label.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-label'
                },] },
    ];
    /**
     * @nocollapse
     */
    Label.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: undefined, decorators: [{ type: core_1.Attribute, args: ['floating',] },] },
        { type: undefined, decorators: [{ type: core_1.Attribute, args: ['stacked',] },] },
        { type: undefined, decorators: [{ type: core_1.Attribute, args: ['fixed',] },] },
        { type: undefined, decorators: [{ type: core_1.Attribute, args: ['inset',] },] },
    ]; };
    Label.propDecorators = {
        'id': [{ type: core_1.Input },],
    };
    exports.Label = Label;
    function Label_tsickle_Closure_declarations() {
        /** @type {?} */
        Label.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Label.ctorParameters;
        /** @type {?} */
        Label.propDecorators;
        /** @type {?} */
        Label.prototype._id;
        /**
         * @hidden
         * @type {?}
         */
        Label.prototype.type;
    }
});
//# sourceMappingURL=label.js.map